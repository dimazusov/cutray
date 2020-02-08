<?php

namespace App\Tests\Unit\Service;

use App\Resource\Error;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ErrorServiceTest extends KernelTestCase
{
    private $cont;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->cont = $kernel->getContainer();
    }

    public function testAddError()
    {
        $errManager = $this->cont->get('App\Service\ErrorService');

        $errManager->addError(Error::SYSTEM_ERROR_KEY, ['errors.command_not_found']);

        $errors = $errManager->getErrors();

        $this->assertEquals($errors['system'][0], 'Команда не найдена');
    }
}