<?php

namespace App\Controller\Api\Crud;

use App\Service\ApiManagerService;
use App\Controller\Api\BaseApiController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Api controller implements CRUD action for resources
 *
 * @Route("/_api")
 */
class ApiController extends BaseApiController
{
    /**
     * Action implements one from operation:
     * create, read, update or delete.
     * It load resource, check access,
     * valid. After this it build operation
     * and execute.
     * Return status.
     * Also return total count and data if it get operation.
     *
     * @Route(
     *     "/{source}/{type}",
     *     defaults={},
     *     requirements={
     *         "source": "product|order|category|user|contacts",
     *         "type": "get|add|update|delete"
     *     },
     *     name="backoffice.api.index",
     *     methods="GET|POST"
     * )
     */
    public function index(string $source, string $type, ApiManagerService $manager): Response
    {
        $request = Request::createFromGlobals();

        if (!$manager->loadResource($source, $type, $request)) {
            return $this->jsonError($manager->getErrors());
        }

        if (!$manager->checkAccess($this->getUserRoles())) {
            return $this->jsonError($manager->getErrors());
        }

        if (!$manager->valid()) {
            return $this->jsonError($manager->getErrors());
        }

        if (!$manager->build()) {
            return $this->jsonError($manager->getErrors());
        }

        if (!$manager->execute()) {
            return $this->jsonError($manager->getErrors());
        }

        return $this->jsonSuccess($manager->getResults());
    }
}
