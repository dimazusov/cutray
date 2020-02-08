<?php

namespace App\Resource\Command\Crud;

use App\Resource\Error;
use App\Resource\AbstractResource;
use App\Resource\Command\AbstractCommand;

class UpdateCommand extends AbstractCommand
{
    const DEFAULT_COLUMN_FOR_SEARCH = 'id';

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
     * @param AbstractResource $resource
     * @param $parentJoinColumnValue
     * @return array
     */
    public function findModels(AbstractResource &$resource, $parentJoinColumnValue = null) :array
    {
        $conditions = [];

        if (!is_null($parentJoinColumnValue)) {
            $joinColumnName = $resource->getJoinColumnName();

            $conditions[$joinColumnName] = $parentJoinColumnValue;
        } else {
            $columns = $resource->getColumns();

            foreach ($columns as $column) {
                if ($column->getName() == self::DEFAULT_COLUMN_FOR_SEARCH) {
                    $conditions[$column->getName()] = $column->getValue();

                    break;
                }
            }
        }

        return $this->em->getRepository(get_class($resource->getModel()))
            ->findBy($conditions);
    }

    /**
     * @return bool
     */
    public function executeCommand(): bool
    {
        $this->em->beginTransaction();

        try {
            $result = $this->update($this->resource);

            if (!$result) {
                $this->em->getConnection()->rollBack();

                return false;
            }

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
     * @param AbstractResource $resource
     * @param $parentColumnValue
     * @return bool
     */
    public function update(AbstractResource &$resource, $parentJoinColumnValue = null) :bool
    {
        $models = $this->findModels($resource, $parentJoinColumnValue);

        if (empty($models)) {
            $this->errManager->addError(Error::SYSTEM_ERROR_KEY, ['errors.update_model_not_found']);

            return false;
        }

        $columns = $resource->getColumns();
        $isArray = $resource->isArray();

        if ($isArray) {
            foreach ($models as $model) {
                $this->em->remove($model);
            }

            $models = $this->getNewModels($resource);

            $joinColumnName = $resource->getJoinColumnName();
            $seterName = $this->getSeterName($joinColumnName);

            foreach ($models as $model) {
                $model->$seterName($parentJoinColumnValue);
            }
        }

        foreach ($columns as $column) {
            if ($column->getName() == self::DEFAULT_COLUMN_FOR_SEARCH) {
                continue;
            }

            $values = $column->getValue();
            $seterName = $this->getSeterName($column->getName());

            if (!method_exists($resource->getModel(), $seterName)) {
                continue;
            }

            if (!$isArray) {
                $models[0]->$seterName($values);

                continue;
            }

            $i=0;
            foreach ($values as $value) {
                $models[$i]->$seterName($value);
                $i++;
            }
        }

        foreach ($models as $model) {
            $this->em->persist($model);
            $this->em->flush();
        }

        $childResource = $resource->getChildResource();

        if ($childResource) {
            $parentJoinColumnName = $childResource->getParentJoinColumnName();

            $geterName = $this->getGeterName($parentJoinColumnName);

            $parentJoinColumnValue = $models[0]->$geterName();

            $res = $this->update($childResource, $parentJoinColumnValue);

            if (!$res) {
                return false;
            }
        }

        return true;
    }

    /**
     * Return count elements for resource column
     *
     * @param AbstractResource $resource
     * @return int
     */
    public function getCountElements(AbstractResource &$resource) :int
    {
        $columns = $resource->getColumns();

        return count($columns[0]->getValue());
    }

    /**
     * Return new models for insert
     *
     * @param AbstractResource $resource
     * @return array
     */
    public function getNewModels(AbstractResource &$resource) :array
    {
        $countElements = $this->getCountElements($resource);
        $model = $resource->getModel();
        $models = [];

        for ($i=0; $i<$countElements; $i++) {
            $models[] = clone $model;
        };

        return $models;
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