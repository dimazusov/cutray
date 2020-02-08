<?php

namespace App\Resource\Command\Crud;

use App\Resource\Column\Column;
use App\Resource\Error;
use App\Resource\AbstractResource;
use App\Resource\Command\AbstractCommand;
use Doctrine\ORM\QueryBuilder;
use Doctrine\DBAL\Connection;

class ReadCommand extends AbstractCommand
{
    /**
     * @var string
     */
    private $selectSQL;

    /**
     * @var string
     */
    private $totalSQL;

    /**
     * @var array
     */
    private $queryParams = [];

    /**
     * @var array
     */
    private $queryParamsTypes = [];

    /**
     * @var array
     */
    private $queryTotalParams = [];

    /**
     * @var array
     */
    private $queryTotalParamsTypes = [];

    /**
     * Build read query
     *
     * @param AbstractResource $resource
     * @return bool
     */
    public function build(AbstractResource &$resource): bool
    {
        $this->resource = $resource;

        /**
         * @var array
         */
        $selectColumns = $this->getSelectColumns($resource);
        $alias = $this->getShieldingAlias($resource->getAlias());

        $qb = $this->em->createQueryBuilder();
        $qb->add('select', implode(',', $selectColumns))
           ->add('from', get_class($resource->getModel()).' '.$alias)
           ->add('orderBy', $alias.".id ASC");

        $childResource = $resource->getChildResource();

        if ($childResource) {
            $this->addJoin($qb, $childResource, $alias);
        }

        $this->addWhere($qb, $resource);

        $page        = $resource->getPage();
        $countOnPage = $resource->getCountOnPage();

        $qb->setMaxResults($countOnPage);
        $qb->setFirstResult(($page-1)*$countOnPage);

        $this->selectSQL = $qb->getQuery()->getSQL();

        $qbTotal = $this->em->createQueryBuilder();

        $qbTotal->add('select', "count($alias.id) as count")
                ->add('from', get_class($resource->getModel()).' '.$alias);

        $this->addWhere($qbTotal, $resource, true);

        $this->totalSQL = $qbTotal->getQuery()->getSQL();

        return true;
    }

    /**
     * @param string $alias
     * @return string
     */
    public function getShieldingAlias(string $alias) {
        if ($alias == 'order') {
            return '_order';
        }

        return $alias;
    }

    /**
     * Execute command
     *
     * @return bool
     */
    public function executeCommand(): bool
    {
        $connection = $this->em->getConnection();

        try {
            $data = $connection->fetchAll(
                $this->selectSQL,
                $this->getQueryParams(),
                $this->getQueryParamsTypes()
            );

            $total = $connection->fetchAll(
                $this->totalSQL,
                $this->getQueryTotalParams(),
                $this->getQueryTotalParamsTypes()
            )[0]['sclr_0'];
        } catch (\Exception $e) {
            $this->errManager->logError(__METHOD__, $e->getMessage());
            $this->errManager->addError(Error::SYSTEM_ERROR_KEY, [Error::SYSTEM_ERROR_MESSAGE_ALIAS]);

            return false;
        }

        $this->setResults([
            'results'    => $this->getFormattedData($this->resource, $data),
            'totalCount' => $total
        ]);

        return true;
    }

    /**
     * Formatted data for resources
     *
     * @param AbstractResource $resource
     * @param array $data
     * @return array
     */
    private function getFormattedData(AbstractResource &$resource, array &$data, int $fieldIndex = 0) :array {
        $columns = $resource->getSelectColumns();

        $formattedData = [];

        foreach ($columns as $column) {
            foreach ($data as $key => $values) {
                $formattedData[$key][$column->getName()] = $values[$column->getName().'_'.$fieldIndex];
            }

            $fieldIndex++;
        }

        $childResource = $resource->getChildResource();

        if ($childResource) {
            $childFormattedData = $this->getFormattedData(  $childResource, $data, $fieldIndex);
            $childAlias = $childResource->getAlias();

            foreach ($formattedData as $key => &$value) {
                $arr = array_filter($childFormattedData[$key], function ($item) {
                    return (bool) $item;
                });

                if (empty($arr)) {
                    $value[$childAlias] = [];

                    continue;
                }

                if ($childResource->isArray()) {
                    $value[$childAlias][] = $childFormattedData[$key];
                } else {
                    $value[$childAlias] = $childFormattedData[$key];
                }
            }

            if ($childResource->isArray()) {
                $parentColumn = $childResource->getParentJoinColumnName();

                $uniqueKeys = [];
                $uniqueArr  = [];

                foreach ($formattedData as $item)    {
                    if (in_array($item[$parentColumn], $uniqueKeys)) {
                        foreach ($uniqueArr as &$unique) {
                            if ($unique[$parentColumn] == $item[$parentColumn]) {
                                $unique[$childAlias] = array_merge($unique[$childAlias],$item[$childAlias]);
                            }
                        }

                        continue;
                    }

                    $uniqueKeys[] = $item[$parentColumn];
                    $uniqueArr[] = $item;
                }

                $formattedData = $uniqueArr;
            }
        }

        return $formattedData;
    }


    /**
     * Get selected fields
     *
     * @param AbstractResource $resource
     * @return array
     */
    public function getSelectColumns(AbstractResource $resource) :array
    {
        $columns = $resource->getSelectColumns();
        $alias = $this->getShieldingAlias($resource->getAlias());
        $selectColumns = [];

        foreach ($columns as $column) {
            $selectColumns[] = $alias.'.'.$column->getName();
        }

        $childResource = $resource->getChildResource();

        if ($childResource) {
            $selectColumns = array_merge($selectColumns, $this->getSelectColumns($childResource));
        }

        return $selectColumns;
    }

    /**
     * Add joins for query
     *
     * @param QueryBuilder $qb
     * @param AbstractResource $resource
     * @param string $parentAlias
     */
    public function addJoin(QueryBuilder &$qb, AbstractResource $resource, string $parentAlias) :void {
        $model = get_class($resource->getModel());
        $alias = $this->getShieldingAlias($resource->getAlias());

        $joinColumn = $resource->getJoinColumnName();
        $parentJoinColumn = $resource->getParentJoinColumnName();

        $condition = "$parentAlias.$parentJoinColumn = $alias.$joinColumn";

        $qb->leftJoin($model, $alias, 'with', $condition);

        $childResource = $resource->getChildResource();

        if ($childResource) {
            $this->addJoin($qb, $childResource, $alias);
        }
    }

    /**
     * Add conditions for query
     *
     * @param QueryBuilder $qb
     * @param AbstractResource $resource
     * @param bool $withoutChild
     */
    public function addWhere(QueryBuilder &$qb, AbstractResource $resource, bool $isTotal = false) :void
    {
        $alias = $this->getShieldingAlias($resource->getAlias());
        /**
         * @var Column[]
         */
        $columns = $resource->getColumns();

        foreach ($columns as $column) {
            $value = $column->getValue();

            if (is_null($value)) {
                continue;
            }

            $columnName = $column->getName();
            $columnAlias = $column->getAlias();
            $operation = $column->getOperation();

            $isArray = $column->getIsArray();

            if (is_null($isArray)) {
                $isArray = $resource->isArray();
            }

            $values = $isArray ? $value : [$value];

            if ($column->getOperation() == "IN") {
                $qb->andWhere("$alias.$columnName IN(:$columnAlias)");

                if ($isTotal) {
                    $this->addQueryTotalParams($values, Connection::PARAM_INT_ARRAY);
                } else {
                    $this->addQueryParams($values, Connection::PARAM_INT_ARRAY);
                }

                continue;
            }

            foreach ($values as $value) {
                if ($operation == "%LIKE%") {
                    $qb->andWhere("$alias.$columnName LIKE :$columnAlias");

                    if ($isTotal) {
                        $this->addQueryTotalParams('%'.$value.'%');
                    } else {
                        $this->addQueryParams('%'.$value.'%');
                    }
                } else {
                    $qb->andWhere("$alias.$columnName $operation :$columnAlias");

                    if ($isTotal) {
                        $this->addQueryTotalParams($value);
                    } else {
                        $this->addQueryParams($value);
                    }
                }
            }
        }

        if (!$isTotal) {
            $childResource = $resource->getChildResource();

            if ($childResource) {
                $this->addWhere($qb, $childResource);
            }
        }
    }

    /**
     * @param $value
     * @param $type
     */
    public function addQueryParams($value, $type = \PDO::PARAM_STR) {
        $this->queryParams[] = $value;
        $this->queryParamsTypes[] = $type;

    }

    /**
     * @return array
     */
    public function getQueryParams() {
        return $this->queryParams;
    }

    /**
     * @param $value
     * @param $type
     */
    public function addQueryTotalParams($value, $type = \PDO::PARAM_STR) {
        $this->queryTotalParams[] = $value;
        $this->queryTotalParamsTypes[] = $type;
    }

    /**
     * @return array
     */
    public function getQueryTotalParams()
    {
        return $this->queryTotalParams;
    }

    /**
     * @return array
     */
    public function getQueryParamsTypes(): array
    {
        return $this->queryParamsTypes;
    }

    /**
     * @return array
     */
    public function getQueryTotalParamsTypes(): array
    {
        return $this->queryTotalParamsTypes;
    }

    /**
     * @return string
     */
    public function getTotalSql(): string
    {
        return $this->totalSQL;
    }

    /**
     * @return string
     */
    public function getSelectSql(): string
    {
        return $this->selectSQL;
    }

}