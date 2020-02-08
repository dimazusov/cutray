<?php

namespace App\Resource\Validator;

use App\Resource\AbstractResource;
use Symfony\Contracts\Translation\TranslatorInterface;

abstract class AbstractResourceValidator {

    /**
     * @var TranslatorInterface
     */
    protected $translator;

    public function __construct(TranslatorInterface $translator)
    {
        $this->translator = $translator;
    }

    /**
     * @param AbstractResource $resource
     * @return array
     */
    abstract public function validate(AbstractResource $resource): array;
}
