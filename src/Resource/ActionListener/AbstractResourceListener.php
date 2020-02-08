<?php

namespace App\Resource\ActionListener;

use App\Resource\AbstractResource;
use App\Service\ErrorService;

/**
 * Class exists for listen events such as preExecute and postExecute
 */
abstract class AbstractResourceListener {
    protected $container;

    /**
     * @var ErrorService
     */
    protected $errManager;

    /**
     * AbstractResourceListener constructor.
     * @param $container
     */
    public function __construct($container) {
        $this->container = $container;
        $this->errManager = $container->get('App\Service\ErrorService');
    }

    /**
     * @param AbstractResource $resource
     */
    abstract public function preExecute(AbstractResource &$resource): bool;

    /**
     * @param AbstractResource $resource
     */
    abstract public function postExecute(AbstractResource &$resource): bool;

    /**
     * @return array
     */
    public function getErrors(): array {
        return $this->errManager->getErrors();
    }
}