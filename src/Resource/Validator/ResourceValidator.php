<?php

namespace App\Resource\Validator;

use App\Resource\AbstractResource;
use App\Validator\Constraints\UnsignedMoreZero;
use Symfony\Component\Validator\Validation;
use Symfony\Component\Validator\Constraints as Assert;

class ResourceValidator extends AbstractResourceValidator
{
    /**
     * @param AbstractResource $resource
     * @return bool
     */
    public function validate(AbstractResource $resource): array {
        /**
         * @var Column[]
         */
        $columns = $resource->getColumns();
        $validation = Validation::createValidator();
        $errors = [];
        $countElements = $this->getCountElements($resource);

        $constraint = new UnsignedMoreZero();

        if (!is_null($resource->getPage())) {
            $violations = $validation->validate($resource->getPage(), [$constraint]);

            if (count($violations)) {
                $errors['page'] = $violations[0]->getMessage();
            }
        }

        if (!is_null($resource->getCountOnPage())) {
            $violations = $validation->validate($resource->getCountOnPage(), [
                $constraint,
                new Assert\Length([
                    'min' => 1,
                    'max' => 5000,
                    'minMessage' => 'errors.page_min_error',
                    'maxMessage' => 'errors.page_max_error'
                ])
            ]);

            if (count($violations)) {
                $errors['countOnPage'] = $message = $violations[0]->getMessage();
            }
        }

        foreach ($columns as $column) {
            $constraints = $column->getConstraints();

            if ($column->isRequired()) {
                $constraints[] = new Assert\NotBlank(['message' => 'errors.empty']);
            } else if (is_null($column->getValue())) {
                continue;
            }

            if (is_null($column->getIsArray())) {
                $isArray = $resource->isArray();
            } else {
                $isArray = $column->getIsArray();
            }

            $values = $column->getValue();

            if ($isArray && !is_array($values)) {
                $errors[$column->getAlias()] = $this->translator->trans('errors.cannot_be_array');

                continue;
            }

            if ($isArray && count($values) != $countElements) {
                $errors[$column->getAlias()] = $this->translator->trans('errors.equal_size');

                continue;
            }

            if (!$isArray) {
                $values = [$values];
            }

            foreach ($values as $value) {
                $violations = $validation->validate($value, $constraints);

                foreach ($violations as $violation) {
                    $errors[$column->getAlias()] = $this->translator->trans(
                        $violation->getMessage(),
                        $violation->getParameters()
                    );
                }
            }
        }

        /**
         * @var Resource|null
         */
        $childResource = $resource->getChildResource();

        if ($childResource) {
            $childErrors = $this->validate($childResource);

            if (!empty($childErrors)) {
                $errors[$resource->getAlias()][$childResource->getAlias()] = $childErrors;
            }
        }

        return $errors;
    }

    /**
     * @param AbstractResource $resource
     * @return
     */
    public function getCountElements(AbstractResource $resource) {
        $columns = $resource->getColumns();

        if (empty($columns)) {
            return 0;
        }

        $values = $columns[0]->getValue();

        if (is_null($values)) {
            foreach ($columns as $column) {
                $values = $column->getValue();

                if (!is_null($values)) {
                    break;
                }
            }
        }

        if (is_array($values)) {
            return count($values);
        }

        return 1;
    }
}