<?php

namespace App\Controller\Api\User;

use App\Resource\Status;
use App\Entity\User;
use App\Service\TokenManagerService;
use App\Controller\Api\BaseApiController;
use Psr\Log\LoggerInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * User api for user operations
 * such as reg, auth and logout
 *
 * @Route("/_api")
 */
class ApiController extends BaseApiController
{
    /**
     * Action for authentication and receive access token
     *
     * @Route("/auth", name="api.user.auth", methods="POST")
     */
    public function authAction(
        Request $request,
        EntityManagerInterface $em,
        ValidatorInterface $validator,
        LoggerInterface $logger,
        UserPasswordEncoderInterface $encoder,
        TokenManagerService $tokenManager
    ): Response
    {
        $user = new User();
        $user->setEmail($request->get('email'));
        $user->setPassword($request->get('password'));

        $errors = $validator->validate($user);

        if (count($errors)) {
            $messages = [];

            foreach ($errors as $field => $error) {
                $messages[$error->getPropertyPath()][] = $error->getMessage();
            }

            return $this->json([
                'status' => Status::ERROR,
                'messages' => $messages
            ]);
        }

        $findedUser = $em->getRepository(User::class)
            ->findOneBy([
                'email' => $user->getEmail()
            ]);

        if (!$findedUser) {
            return $this->json([
                'status' => Status::ERROR,
                'messages' => ['email' => ['Email не найден']]
            ]);
        }

        $isValid = $encoder->isPasswordValid($findedUser, $user->getPassword());

        if (!$isValid) {
            return $this->json([
                'status' => Status::ERROR,
                'messages' => ['password' => ['Неправильный пароль']]
            ]);
        }

        $token = $tokenManager->getToken('auth', $findedUser->getId());

        $findedUser->setApiToken($token);

        try {
            $em->persist($findedUser);
            $em->flush();
        } catch (\Exception $exception) {
            $logger->err($exception->getMessage());

            return $this->json([
                'status' => Status::ERROR,
                'messages' => ['system' => ['Ведуться технические работы, попробуйте через 5 минут']]
            ]);
        }

        return $this->json([
            'status' => Status::SUCCESS,
            'token' => $token,
            'user_id' => $findedUser->getId(),
            'roles' => $findedUser->getRoles()
        ]);
    }

    /**
     * Action for user logout
     *
     * @Route("/logout", name="api.user.logout", methods="POST")
     */
    public function logoutAction(EntityManagerInterface $em, LoggerInterface $logger): Response
    {
        $user = $this->getCurrentUser();

        if (!$user) {
            return $this->json([
                'status' => Status::SUCCESS
            ]);
        }

        $user->setApiToken(NULL);

        try {
            $em->persist($user);
            $em->flush();
        } catch (\Exception $exception) {
            $logger->err($exception->getMessage());

            return $this->json([
                'status' => Status::ERROR,
                'messages' => ['system' => ['Ведуться технические работы, попробуйте через 5 минут']]
            ]);
        }

        return $this->json(['status' => Status::SUCCESS]);
    }

    /**
     * Action for registration new user
     *
     * @Route("/reg", name="api.user.reg", methods="GET|POST")
     */
    public function regAction(
        Request $request,
        EntityManagerInterface $em,
        ValidatorInterface $validator,
        LoggerInterface $logger,
        UserPasswordEncoderInterface $encoder,
        TokenManagerService $tokenManager
    ): Response {
        $user = new User();

        $user->setEmail($request->get('email'));
        $user->setPassword($request->get('password'));

        $errors = $validator->validate($user);

        if (count($errors)) {
            $messages = [];

            foreach ($errors as $field => $error) {
                $messages[$error->getPropertyPath()][] = $error->getMessage();
            }

            return $this->json([
                'status' => Status::ERROR,
                'messages' => $messages
            ]);
        }

        $repeatUser = $em->getRepository(User::class)
            ->findOneBy(['email' => $user->getEmail()]);

        if ($repeatUser) {
            return $this->json([
                'status' => Status::ERROR,
                'messages' => ['email' => ['Email уже зарегистрирован']]
            ]);
        }

        $encodedPass = $encoder->encodePassword($user, $user->getPassword());

        $user->setPassword($encodedPass);

        try {
            $em->persist($user);
            $em->flush();

            $token = $tokenManager->getToken('auth', $user->getId());

            $user->setApiToken($token);

            $em->persist($user);
            $em->flush();
        } catch (\Exception $exception) {
            $logger->err($exception->getMessage());

            return $this->json([
                'status' => Status::ERROR,
                'messages' => ['system' => ['Ведуться технические работы, попробуйте через 5 минут']]
            ]);
        }

        return $this->json([
            'status' => Status::SUCCESS,
            'token' => $token,
            'user_id' => $user->getId(),
            'roles' => $user->getRoles()
        ]);
    }

    /**
     * Action for receive info about user roles
     *
     * @Route("/user-info", name="api.user.info", methods="POST")
     */
    public function infoUserAction() {
        return $this->json([
            'status' => Status::SUCCESS,
            'roles' => $this->getUserRoles()
        ]);
    }
}
