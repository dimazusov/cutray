<?php

namespace App\Service;

use App\Resource\Error;
use App\Resource\AbstractResource;
use App\Resource\Command\CommandFactory;
use App\Resource\Command\AbstractCommand;
use App\Resource\Resource;
use App\Resource\Validator\ResourceValidator;
use Psr\Log\LoggerInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Config\Resource\ResourceInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\Translation\TranslatorInterface;

class ApiManagerService
{
    /**
     * @var AbstractResource
     */
    private $resource;

    /**
     * @var TranslatorInterface
     */
    private $translator;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var YamlService
     */
    private $yaml;

    /**
     * @var ErrorService
     */
    private $errManager;

    /**
     * @var AbstractCommand
     */
    private $command;

    private $container;

    public function __construct(
        $container,
        TranslatorInterface $translator,
        LoggerInterface $logger,
        YamlService $yaml,
        ErrorService $errManager
    ) {
        $this->container    = $container;
        $this->translator   = $translator;
        $this->logger       = $logger;
        $this->yaml         = $yaml;
        $this->errManager   = $errManager;
    }

    /**
     * @param string $resourceName
     * @param string $type
     * @param Request $request
     * @return bool
     */
    public function loadResource(string $resourceName, string $type, Request $request) :bool
    {
        $this->request = $request;

        $source = $this->yaml->parseSettingResource($type, $resourceName);

        if (!$source) {
            $this->errManager->addError(Error::SYSTEM_ERROR_KEY, ['errors.source_not_found']);

            return false;
        }

        /**
         * @var ResourceInterface
         */
        $resource = Resource::create($source, $type);

        if (!$resource) {
            $this->errManager->addError(Error::SYSTEM_ERROR_KEY, ['errors.resource_not_found']);

            return false;
        }

        if ($request->getMethod() == 'GET') {
            $data = $request->query->all();
        } else {
            $data = $request->request->all();
        }

        $resource->bindData($data);

        $this->setResource($resource);

        return true;
    }

    /**
     * @param string $roles
     * @return bool
     */
    public function checkAccess(array $roles) :bool {
        if (empty(array_intersect($roles, $this->resource->getAccessRoles()))) {
            $this->errManager->addError(Error::SYSTEM_ERROR_KEY, ['errors.access_denied']);

            return false;
        }

        return true;
    }

    /**
     * @return bool
     */
    public function valid() :bool {
        $validator = new ResourceValidator($this->translator);

        $errors = $validator->validate($this->resource);

        if (!empty($errors)) {
            $this->errManager->setErrors($errors);

            return false;
        }

        return true;
    }

    /**
     *
     * @return bool
     */
    public function build() :bool {
        /**
         * @var AbstractCommand
         */
        $this->command = CommandFactory::create($this->resource->getType(), $this->container, $this->errManager);

        if (is_null($this->command)) {
            $this->errManager->addError(Error::SYSTEM_ERROR_KEY, ['errors.command_not_found']);

            return false;
        }

        if (!$this->command->build($this->resource)) {
            $this->errManager->setErrors($this->command->getErrors());

            return false;
        }

        return true;
    }

    /**
     * @return bool
     */
    public function execute() :bool {
        if (!$this->command->execute()) {
            $this->errManager->setErrors($this->command->getErrors());

            return false;
        }

        return true;
    }

    /**
     * @return array
     */
    public function getResults() {
        return $this->command->getResults();
    }

    /**
     * @return array
     */
    public function getErrors() :array {
        return $this->errManager->getErrors();
    }

    /**
     * @return Resource
     */
    public function getResource(): Resource
    {
        return $this->resource;
    }

    /**
     * @param AbstractResource $resource
     */
    public function setResource(AbstractResource $resource): void
    {
        $this->resource = $resource;
    }
}