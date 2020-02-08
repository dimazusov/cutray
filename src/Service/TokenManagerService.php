<?php

namespace App\Service;

use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

class TokenManagerService
{
    const TOKEN_ID = 'CSRF_TOKEN';

    /**
     * @var CsrfTokenManagerInterface
     */
    private $tokenManager;

    public function __construct(CsrfTokenManagerInterface $tokenManager)
    {
        $this->tokenManager = $tokenManager;
    }

    /**
     * @param int $userId
     * @param string $action
     *
     * @return \Symfony\Component\Security\Csrf\CsrfToken
     */
    public function getToken(string $action, int $userId = 0) {
        return $this->tokenManager->refreshToken(self::TOKEN_ID . '_' . $action . '_' . $userId)->getValue();
    }

    /**
     * @param int $userId
     * @param string $action
     *
     * @return \Symfony\Component\Security\Csrf\CsrfToken
     */
    public function isTokenValid(string $checkedToken, string $action, int $userId = 0) {
        $currentToken = $this->tokenManager->refreshToken(self::TOKEN_ID . '_' . $action . '_' . $userId)->getValue();

        if ($checkedToken == $currentToken) {
            return true;
        }

        return false;
    }


}
