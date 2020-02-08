<?php

namespace App\Service;

use Psr\Log\LoggerInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class ErrorService
{
    const SYSTEM_ERROR_KEY = 'system';

    /**
     * @var TranslatorInterface
     */
    private $translator;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var array
     */
    private $errors = [];

    public function __construct(LoggerInterface $logger, TranslatorInterface $translator)
    {
        $this->logger = $logger;
        $this->translator = $translator;
    }

    /**
     * @return array
     */
    public function getErrors(): array
    {
        return $this->errors;
    }

    /**
     * @param array $errors
     */
    public function setErrors(array $errors): void
    {
        $this->errors = $errors;
    }

    /**
     * @param array $errors
     */
    public function addError(string $key, array $errors): void
    {
        $messages = [];

        foreach ($errors as $error) {
            $messages[] = $this->translator->trans($error);
        }

        $this->errors[$key] = $messages;
    }

    /**
     * @param string $method
     * @param string $message
     */
    public function logError(string $method, string $message): void
    {
        $this->logger->error($method.' '.$message);
    }

    /**
     * @param string $message
     */
    public function logMessage(string $message):void
    {
        $this->logger->error($message);
    }
}
