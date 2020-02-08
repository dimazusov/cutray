<?php

namespace App\Resource\Constraint;

use Symfony\Component\Validator\Constraint;

interface ConstraintFactoryInterface {
    /**
     * @param string $namespace
     * @param ?array $option
     * @return Constraint
     */
    public static function create(string $namespace, ?array $option) :Constraint;
}