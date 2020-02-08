<?php

namespace App\Resource;

use App\Resource\Column\Column;
use App\Resource\Constraint\ConstraintFactory;
use App\Resource\ActionListener\ResourceListenerContainer;

class Resource extends AbstractResource
{
    const DEFAULT_PAGE = 1;
    const DEFAULT_COUNT_ON_PAGE = 10;

    /**
     * @param array $source
     * @param string $type
     * @return Resource|null
     */
    public static function create(array $source, string $type) {
        /**
         * @var Resource
         */
        $resource = new Resource();
        $resource->setType($type);
        $resource->setPage(self::DEFAULT_PAGE);
        $resource->setCountOnPage(self::DEFAULT_COUNT_ON_PAGE);

        $keys = array_keys($source);

        if ($keys[0] == 'accessRoles') {
            $resource->setAccessRoles($source['accessRoles']);
            $alias = $keys[1];
        } else {
            $alias = $keys[0];
        }

        $resource->setAlias($alias);

        if (!class_exists($source[$alias]['model'])) {
            return null;
        }

        if (isset($source[$alias]['is_array'])) {
            $resource->setIsArray($source[$alias]['is_array']);
        }

        $resource->setModel(new $source[$alias]['model']());

        if (isset($source[$alias]['selectColumns'])) {
            $selectedColumns = [];

            foreach ($source[$alias]['selectColumns'] as $column) {
                $selectedColumns[] = new Column($column);
            }

            $resource->setSelectColumns($selectedColumns);
        }

        if (isset($source[$alias]['columns'])) {
            $selectedColumns = [];

            foreach ($source[$alias]['columns'] as $columnAlias => $columnSource) {
                $name = $columnSource['column'] ?? $columnAlias;

                $column = new Column($name, $columnAlias);

                if (isset($columnSource['required'])) {
                    $column->setIsRequired($columnSource['required']);
                }

                if (isset($columnSource['is_array'])) {
                    $column->setIsArray($columnSource['is_array']);
                }

                if (isset($columnSource['operation'])) {
                    $column->setOperation($columnSource['operation']);
                }

                if (isset($columnSource['constraints'])) {
                    foreach($columnSource['constraints'] as $validatorNamespace => $options) {
                        $column->appendConstraint(ConstraintFactory::create($validatorNamespace, $options));
                    }
                }

                $selectedColumns[] = $column;
            }

            $resource->setColumns($selectedColumns);
        }

        if (isset($source[$alias]['joinColumnName'])) {
            $resource->setJoinColumnName($source[$alias]['joinColumnName']);
        }

        if (isset($source[$alias]['parentJoinColumnName'])) {
            $resource->setParentJoinColumnName($source[$alias]['parentJoinColumnName']);
        }

        if (isset($source[$alias]['eventListener'])) {
            $class = $source[$alias]['eventListener'];

            $resource->setListenerClass($class);
        }

        if (isset($source[$alias]['child'])) {
            $childResource = Resource::create($source[$alias]['child'], $type);

            $resource->setChildResource($childResource);
        }

        return $resource;
    }

    /**
     * Bind data for resource
     *
     * @param array $data
     * @param AbstractResource|null $resource
     * @return void
     */
    public function bindData(array $data, AbstractResource &$resource = NULL) :void {
        if (is_null($resource)) {
            $resource = $this;
        }

        $alias = $resource->getAlias();

        if (!isset($data[$alias])) {
            return ;
        }

        foreach ($resource->getColumns() as $column) {
            $columnAlias = $column->getAlias();

            if (!$resource->isArray()) {
                if(isset($data[$alias][$columnAlias])) {
                    $column->setValue($data[$alias][$columnAlias]);
                }

                continue;
            }

            if (!is_array($data[$alias])) {
                 return ;
            }

            $values = array_column($data[$alias], $columnAlias);

            if (!empty($values)) {
                $column->setValue($values);
            }
        }

        if (isset($data[$alias]['page'])) {
            $resource->setPage((int) $data[$alias]['page']);
        }

        if (isset($data[$alias]['countOnPage'])) {
            $resource->setCountOnPage((int) $data[$alias]['countOnPage']);
        }

        $childResource = $resource->getChildResource();

        if ($childResource) {
            $childAlias = $resource->childResource->getAlias();

            if (isset($data[$alias][$childAlias])) {
                $resource->childResource->bindData($data[$alias], $childResource);
            }
        }
    }
}