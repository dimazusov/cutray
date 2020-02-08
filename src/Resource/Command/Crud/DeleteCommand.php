<?php

namespace App\Resource\Command\Crud;

use App\Resource\Error;
use App\Resource\AbstractResource;
use App\Resource\Command\AbstractCommand;

class DeleteCommand extends AbstractCommand
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
     * @return bool
     */
    public function executeCommand(): bool
    {
        $this->em->beginTransaction();

        try {
            $this->delete($this->resource);

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
    public function delete(AbstractResource &$resource, $parentJoinColumnValue = null)
    {
        $models = $this->findModels($resource, $parentJoinColumnValue);

        if (empty($models)) {
            return true;
        }

        $childResource = $resource->getChildResource();

        if ($childResource) {
            $parentJoinColumnName = $childResource->getParentJoinColumnName();

            $geterName = $this->getGeterName($parentJoinColumnName);

            $parentJoinColumnValue = $models[0]->$geterName();

            $this->delete($childResource, $parentJoinColumnValue);
        }

        foreach ($models as $model) {
            $this->em->remove($model);
            $this->em->flush();
        }

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