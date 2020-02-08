<?php

namespace App\Resource\Command;

use App\Resource\AbstractResource;
use App\Resource\ActionListener\AbstractResourceListener;
use App\Resource\ActionListener\ResourceListenerContainer;
use App\Service\ErrorService;
use Doctrine\ORM\EntityManager;
use App\Resource\Error;

/**
 * Class AbstractCommand
 * @package App\Resource\Command
 */
abstract class AbstractCommand {
    /**
     * @var EntityManager
     */
    protected $em;

    /**
     * @var ErrorService
     */
    protected $errManager;

    /**
     * @var AbstractResource
     */
    protected $resource;

    /**
     * @var array $results
     */
    protected $results = [];

    protected $container;

    /**
     * CreateCommand constructor
     *
     * @param EntityManager $this->em
     * @param ErrorService $errManager
     */
    public function __construct($container)
    {
        $this->container = $container;
        $this->em = $container->get('doctrine.orm.default_entity_manager');
        $this->errManager = $container->get('App\Service\ErrorService');
    }

    /**
     * Build command for operation
     *
     * @return bool
     */
    abstract public function build(AbstractResource &$resource) :bool;

    /**
     * Execute command
     *
     * @return bool
     */
    abstract public function executeCommand() :bool;

    /**
     * Execute command
     *
     * @return bool
     */
    public function execute() :bool {
        if (!$this->preExecute($this->resource)) {
            return false;
        }

        if (!$this->executeCommand()) {
            return false;
        }

        return $this->postExecute($this->resource);
    }

    /**
     * Return results
     *
     * @return array
     */
    public function getErrors() :array {
        return $this->errManager->getErrors();
    }

    /**
     * Return results
     *
     * @return array
     */
    public function getResults() :array {
        return $this->results;
    }

    /**
     * Set results
     *
     * @param array $results
     */
    public function setResults(array $results) :void {
        $this->results = $results;
    }

    /**
     * @param AbstractResource $resource
     * @return bool
     */
    protected function preExecute(AbstractResource &$resource) :bool
    {
        $childResource = $resource->getChildResource();

        if ($childResource) {
            if (!$this->preExecute($childResource)) {
                return false;
            }

            $resource->setChildResource($childResource);
        }

        $listenerClass = $resource->getListenerClass();

        if (!$listenerClass) {
            return true;
        }

        /**
         * @var AbstractResourceListener
         */
        $listener = new $listenerClass($this->container);

        if (!$listener->preExecute($resource)) {
            $this->errManager->setErrors($listener->getErrors());

            return false;
        }

        return true;
    }

    protected function postExecute(AbstractResource &$resource) :bool
    {
        $childResource = $resource->getChildResource();

        if ($childResource) {
            if (!$this->postExecute($childResource)) {

                return false;

            }

            $resource->setChildResource($childResource);
        }

        $listenerClass = $resource->getListenerClass();

        if (!$listenerClass) {
            return true;
        }

        /**
         * @var AbstractResourceListener
         */
        $listener = new $listenerClass($this->container);

        if (!$listener->postExecute($resource)) {
            $this->errManager->setErrors($listener->getErrors());

            return false;
        }


        return true;
    }
}