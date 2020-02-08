<?php

namespace App\Tests\Unit\Resource\Column;

use App\Resource\Command\CommandFactory;
use App\Resource\Command\Crud\CreateCommand;
use App\Resource\Command\Crud\ReadCommand;
use App\Resource\Command\Crud\UpdateCommand;
use App\Resource\Command\Crud\DeleteCommand;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class CommandFactoryTest extends KernelTestCase
{
    private $cont;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->cont = $kernel->getContainer();
    }

    public function testCommandFactory() {
        $commandAdd = CommandFactory::create('add', $this->cont);
        $commandGet = CommandFactory::create('get', $this->cont);
        $commandUpdate = CommandFactory::create('update', $this->cont);
        $commandDelete = CommandFactory::create('delete', $this->cont);

        $this->assertEquals(get_class($commandAdd), CreateCommand::class);
        $this->assertEquals(get_class($commandGet), ReadCommand::class);
        $this->assertEquals(get_class($commandUpdate), UpdateCommand::class);
        $this->assertEquals(get_class($commandDelete), DeleteCommand::class);
    }

}