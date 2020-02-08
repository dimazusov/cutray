<?php

namespace App\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class UnsignedMoreZero extends Constraint
{
    public $message = 'Must be integer more than 0';
}