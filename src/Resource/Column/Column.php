<?php

namespace App\Resource\Column;

use Symfony\Component\Validator\Constraint;

class Column {
     /**
      * @var string
      */
     private $alias;

    /**
     * @var string
     */
    private $name;

    /**
     * @var mixed
     */
    private $value;

    /**
     * @var array Constraint
     */
    private $constraints = [];

    /**
     * @var bool
     */
    private $isRequired = false;

    /**
     * @var bool|null
     */
    private $isArray = null;

    public function __construct(string $name, string $alias='')
    {
        $this->name  = $name;
        $this->alias = $alias;
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
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName(string $name): void
    {
        $this->name = $name;
    }

    /**
     * @return mixed
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * @param mixed $value
     */
    public function setValue($value): void
    {
        $this->value = $value;
    }

    /**
     * @var string
     */
    private $operation;

    /**
     * @return string
     */
    public function getOperation(): string
    {
        return $this->operation;
    }

    /**
     * @param string $operation
     */
    public function setOperation(string $operation): void
    {
        $this->operation = $operation;
    }

    /**
     * @return array
     */
    public function getConstraints(): array
    {
        return $this->constraints;
    }

    /**
     * @param array $constraints
     */
    public function setConstraints(array $constraints): void
    {
        $this->constraints = $constraints;
    }

    /**
     * @param Constraint
     */
    public function appendConstraint(Constraint $constraint): void
    {
        $this->constraints[] = $constraint;
    }

    /**
     * @return bool
     */
    public function isRequired(): bool
    {
        return $this->isRequired;
    }

    /**
     * @param bool $isRequired
     */
    public function setIsRequired(bool $isRequired): void
    {
        $this->isRequired = $isRequired;
    }

    /**
     * @return bool|null
     */
    public function getIsArray(): ?bool
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