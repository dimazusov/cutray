<?php

namespace App\Resource\ActionListener;

use App\Entity\User;
use App\Resource\AbstractResource;
use App\Service\ErrorService;
use Symfony\Component\HttpFoundation\Request;

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

    /**
     * Return current User or null
     *
     * @return User|null
     */
    public function getCurrentUser() : ?User {
        $request = Request::createFromGlobals();
        $token = $request->headers->get('X-AUTH-TOKEN');

        $user = $this->container->get('doctrine')
            ->getRepository(User::class)
            ->findOneBy(['apiToken' => $token]);

        return $user;
    }
}