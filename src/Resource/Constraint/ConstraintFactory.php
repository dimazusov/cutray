<?php

namespace App\Resource\Constraint;

use Symfony\Component\Validator\Constraint;

class ConstraintFactory implements ConstraintFactoryInterface {
    /**
     * @param string $namespace
     * @param ?array $option
     * @return Constraint
     */
    public static function create(string $namespace, ?array $option) :Constraint
    {
        $class = self::getFullNamespace($namespace);

        return new $class($option);
    }

    public static function getFullNamespace(string $nameValidator): string
    {
        if (preg_match('/\\\\/', $nameValidator)) {
            return $nameValidator;
        }

        return 'Symfony\Component\Validator\Constraints\\' . $nameValidator;
    }
}