<?php

namespace App\Resource;

use App\Resource\Column\Column;
use App\Resource\ActionListener\ResourceListenerContainerInterface;

abstract class AbstractResource
{
    /**
     * @var string
     */
    protected $type;

    /**
     * @var array
     */
    protected $accessRoles;

    /**
     * @var App\Entity
     */
    protected $model;

    /**
     * @var stirng
     */
    protected $alias;

    /**
     * @var Column[]
     */
    protected $selectColumns;

    /**
     * @var Column[]
     */
    protected $columns = [];

    /**
     * @var string
     */
    protected $joinColumnName;

    /**
     * @var string
     */
    protected $parentJoinColumnName;

    /**
     * @var string|null
     */
    protected $listenerClass = null;

    /**
     * @var Resource|null
     */
    protected $childResource = null;

    /**
     * @var int|null
     */
    protected $page = null;

    /**
     * @var int|null
     */
    protected $countOnPage = null;

    /**
     * @var bool
     */
    protected $isArray = false;

    /**
     * @param array $source
     * @param string $type
     * @return Resource|null
     */
    abstract public static function create(array $source, string $type);
    /**
     * @param array $data
     * @param AbstractResource|null $resource
     */
    abstract public function bindData(array $data, AbstractResource &$resource=null);

    /**
     * @return string
     */
    public function getType(): string
    {
        return $this->type;
    }

    /**
     * @param string $type
     */
    public function setType(string $type): void
    {
        $this->type = $type;
    }

    /**
     * @return array
     */
    public function getAccessRoles(): array
    {
        return $this->accessRoles;
    }

    /**
     * @param array $accessRoles
     */
    public function setAccessRoles(array $accessRoles): void
    {
        $this->accessRoles = $accessRoles;
    }

    /**
     * @return array
     */
    public function getColumns(): array
    {
        return $this->columns;
    }

    /**
     * @param array Column
     */
    public function setColumns(array $columns): void
    {
        $this->columns = $columns;
    }

    /**
     * @return string
     */
    public function getAlias(): string
    {
        return $this->alias;
    }

    /**
     * @param string $alias
     */
    public function setAlias(string $alias): void
    {
        $this->alias = $alias;
    }

    /**
     * @return mixed
     */
    public function getModel()
    {
        return $this->model;
    }

    /**
     * @param mixed $model
     */
    public function setModel($model): void
    {
        $this->model = $model;
    }

    /**
     * @return array
     */
    public function getSelectColumns(): array
    {
        return $this->selectColumns;
    }

    /**
     * @param array Column
     */
    public function setSelectColumns(array $selectColumns): void
    {
        $this->selectColumns = $selectColumns;
    }

    /**
     * @return string
     */
    public function getJoinColumnName(): string
    {
        return $this->joinColumnName;
    }

    /**
     * @param string $joinColumnName
     */
    public function setJoinColumnName(string $joinColumnName): void
    {
        $this->joinColumnName = $joinColumnName;
    }

    /**
     * @return string|null
     */
    public function getListenerClass(): ?string
    {
        return $this->listenerClass;
    }

    /**
     * @param string $listenerClass
     */
    public function setListenerClass(string $listenerClass): void
    {
        $this->listenerClass = $listenerClass;
    }

    /**
     * @return Resource|null
     */
    public function getChildResource(): ?Resource
    {
        return $this->childResource;
    }

    /**
     * @param Resource $childResource
     */
    public function setChildResource(Resource $childResource): void
    {
        $this->childResource = $childResource;
    }

    /**
     * @return int|null
     */
    public function getPage(): ?int
    {
        return $this->page;
    }

    /**
     * @param int|null $page
     */
    public function setPage(?int $page): void
    {
        $this->page = $page;
    }

    /**
     * @return int|null
     */
    public function getCountOnPage(): ?int
    {
        return $this->countOnPage;
    }

    /**
     * @param int|null $countOnPage
     */
    public function setCountOnPage(?int $countOnPage): void
    {
        $this->countOnPage = $countOnPage;
    }

    /**
     * @return string
     */
    public function getParentJoinColumnName(): string
    {
        return $this->parentJoinColumnName;
    }

    /**
     * @param string $parentJoinColumnName
     */
    public function setParentJoinColumnName(string $parentJoinColumnName): void
    {
        $this->parentJoinColumnName = $parentJoinColumnName;
    }

    /**
     * @return bool
     */
    public function isArray(): bool
    {
        return $this->isArray;
    }

    /**
     * @param bool $isArray
     */
    public function setIsArray(bool $isArray): void
    {
        $this->isArray = $isArray;
    }
}