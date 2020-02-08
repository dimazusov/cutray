<?php

namespace App\ResourceListeners;

use App\Entity\User;
use App\Resource\Error;
use App\Resource\Column\Column;
use App\Resource\AbstractResource;
use App\Resource\ActionListener\AbstractResourceListener;
use Symfony\Component\HttpFoundation\Request;

class ResourceUserListener extends AbstractResourceListener
{
    /**
     * @param AbstractResource $resource
     */
    public function preExecute(AbstractResource &$resource): bool
    {
        $currentUser = $this->getCurrentUser();
        $currentUserId = $currentUser->getId();
        $columns = $resource->getColumns();

        $email = $this->getColumnValueByName($columns, 'email');

        $userRecivedByEmail = $this->getUserByEmail($email);

        if ($userRecivedByEmail && $currentUserId != $userRecivedByEmail->getId()) {
            $translator = $this->container->get('translator');

            $this->errManager->addError('email', [
                $translator->trans('errors.email_allready_register')
            ]);

            return false;
        }

        $userIdColumn = new Column('id');
        $userIdColumn->setValue($currentUserId);

        $columns[] = $userIdColumn;

        foreach($columns as &$column) {
            if ($column->getName() == 'password') {
                $hashedPass = $this->getEncodedPass($currentUserId, $column->getValue());

                $column->setValue($hashedPass);

                break;
            }
        }

        $resource->setColumns($columns);

        return true;
    }

    /**
     * @param AbstractResource $resource
     */
    public function postExecute(AbstractResource &$resource): bool
    {
        return true;
    }

    /**
     * @return string|null
     */
    public function getEncodedPass($userId, $password) {
        $passManager = $this->container->get('App\Service\PasswordManagerService');
        $em          = $this->container->get('doctrine.orm.entity_manager');
        $user        = $em->getRepository(User::class)->findOneBy(['id' => $userId]);

        if (!$user) {
            $this->errManager->addError(Error::SYSTEM_ERROR_KEY, [Error::SYSTEM_ERROR_MESSAGE_ALIAS]);
            $this->errManager->logError(__METHOD__, 'not found');

            return null;
        }

        try {
            $hashedPass = $passManager->encodePassword($user, $password);
        } catch (\Exception $e) {
            $this->errManager->addError(Error::SYSTEM_ERROR_KEY, [Error::SYSTEM_ERROR_MESSAGE_ALIAS]);
            $this->errManager->logError(__METHOD__, $e->getMessage());

            return null;
        }

        return $hashedPass;
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

    /**
     * Return user if email exists
     *
     * @param string $email
     * @return User|null
     */
    public function getUserByEmail(string $email) : ?User {
        return $this->container->get('doctrine')
            ->getRepository(User::class)
            ->findOneBy(['email' => $email]);
    }

    /**
     * @param array $columns
     * @param string $columnName
     * @return mixed
     */
    public function getColumnValueByName(array &$columns, string $columnName) {
        foreach($columns as $column) {
            if ($column->getName() == $columnName) {
                return $column->getValue();
            }
        }

        return null;
    }

}