<?php

namespace App\Validator\Constraints;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

/**
 * @Annotation
 */
class UnsignedIntValidator extends ConstraintValidator
{
    public function validate($value, Constraint $constraint)
    {
        if (is_array($value)) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ string }}', '')
                ->addViolation();

            return ;
        }

        if (!preg_match('/^[0-9]+$/', $value, $matches)) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ string }}', $value)
                ->addViolation();
        }
    }
}