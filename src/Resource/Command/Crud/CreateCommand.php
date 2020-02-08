<?php

namespace App\Resource\Command\Crud;

use App\Resource\Error;
use App\Resource\Column\Column;
use App\Resource\AbstractResource;
use App\Resource\Command\AbstractCommand;

class CreateCommand extends AbstractCommand
{
    /**
     * Build read query
     *
     * @param AbstractResource $resource
     * @return bool
     */
    public function build(AbstractResource &$resource): bool
    {
        $this->resource = $resource;

        return true;
    }

    /**
     * Execute command
     *
     * @return bool
     */
    public function executeCommand(): bool
    {
        $this->em->beginTransaction();

        try {
            $this->save($this->resource);

            $this->em->getConnection()->commit();
        } catch (\Exception $e) {
            $this->em->getConnection()->rollBack();

            $this->errManager->addError(Error::SYSTEM_ERROR_KEY, [Error::SYSTEM_ERROR_MESSAGE_ALIAS]);
            $this->errManager->logError(__METHOD__, $e->getMessage());

            return false;
        }

        return true;
    }

    /**
     * Save models from resource
     *
     * @param AbstractResource $resource
     * @param string|null $parentJoinColumnValue
     * @return bool
     */
    public function save(AbstractResource &$resource, string $parentJoinColumnValue = null) :void
    {
        $models = $this->getFilledModels($resource);

        if (!is_null($parentJoinColumnValue)) {
            $parentJoinColumnName = $resource->getJoinColumnName();
            $seterName = $this->getSeterName($parentJoinColumnName);

            foreach ($models as $model) {
                $model->$seterName($parentJoinColumnValue);
            }
        }

        $id = null;
        foreach ($models as $model) {
            $this->em->persist($model);
            $this->em->flush();

            if (!$resource->isArray() && method_exists($model, 'getId')) {
                $id = $model->getId();
            }
        }

        if (!is_null($id)) {
            $columns = $resource->getColumns();

            $amountColumn = new Column('id');
            $amountColumn->setValue($id);
            $columns[] = $amountColumn;

            $resource->setColumns($columns);
        }

        /**
         * @var AbstractResource
         */
        $childResource = $resource->getChildResource();

        if ($childResource) {
            $parentJoinColumnName = $childResource->getParentJoinColumnName();

            $geterName = $this->getGeterName($parentJoinColumnName);

            $parentJoinColumnValue = $models[0]->$geterName();

            $this->save($childResource, $parentJoinColumnValue);
        }
    }

    /**
     * Return filled models for resource
     *
     * @param AbstractResource $resource
     * @return array
     */
    public function getFilledModels(AbstractResource $resource) :array
    {
        $columns = $resource->getColumns();
        $model = $resource->getModel();

        if ($resource->isArray()) {
            $countElements = $this->getCountElements($resource);
            $models = [];

            for ($i=0; $i<$countElements; $i++) {
                $models[] = clone $model;
            }
        } else {
            $models = [$model];
        }

        foreach ($columns as $column) {
            $seterName = $this->getSeterName($column->getName());

            if (!method_exists(get_class($model), $seterName)) {
                continue;
            }

            $values = $column->getValue();

            if (!is_array($values)) {
                $values = [$values];
            }

            $i = 0;
            foreach ($values as $value) {
                $models[$i]->$seterName($value);
                $i++;
            }
        }

        return $models;
    }

    /**
     * Return count elements for resource column
     *
     * @param AbstractResource $resource
     * @return int
     */
    public function getCountElements(AbstractResource $resource) :int
    {
        $columns = $resource->getColumns();

        return count($columns[0]->getValue());
    }

    /**
     * @param string $columnName
     * @return string
     */
    public function getSeterName(string $columnName) :string
    {
        $values = explode('_', $columnName);

        foreach ($values as &$value) {
            $value = ucfirst($value);
        }

        return 'set'.implode('', $values);
    }

    /**
     * @param string $columnName
     * @return string
     */
    public function getGeterName(string $columnName) :string
    {
        $values = explode('_', $columnName);

        foreach ($values as &$value) {
            $value = ucfirst($value);
        }

        return 'get'.implode('', $values);
    }
}