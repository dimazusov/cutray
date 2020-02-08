<?php

namespace App\Controller\Api;

use App\Resource\Status;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class BaseApiController extends AbstractController
{
    /**
     * Return current user or null
     *
     * @return object|null
     */
    public function getCurrentUser() {
        $request = Request::createFromGlobals();
        $token = $request->headers->get('X-AUTH-TOKEN');

        if (!$token) {
            return null;
        }

        $user = $this->getDoctrine()
            ->getRepository(User::class)
            ->findOneBy(['apiToken' => $token]);

        return $user;
    }

    /**
     * Return user roles
     *
     * @return array
     */
    public function getUserRoles() :array {
        $user = $this->get('security.token_storage')->getToken()->getUser();

        if ($user === 'anon.') {
            return ['ROLE_UNKNOWN'];
        }

        return $user->getRoles();
    }

    /**
     * @param array $data
     */
    public function jsonSuccess(array $data) :JsonResponse {
        return $this->json([
            'status' => Status::SUCCESS,
            'data' => $data
        ]);
    }

    /**
     * @param array $errors
     */
    public function jsonError(array $errors) :JsonResponse {
        return $this->json([
            'status' => Status::ERROR,
            'messages' => $errors
        ]);
    }
}