<?php

namespace App\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class UnsignedInt extends Constraint
{
    public $message = 'Must be unsigned integer';
}