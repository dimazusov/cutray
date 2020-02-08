<?php

namespace App\Tests\Unit\Resource\Column;

use App\Resource\Column\Column;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ColumnTest extends KernelTestCase
{
    private $cont;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->cont = $kernel->getContainer();
    }

    public function testColumn() {
        $name = 'test';
        $alias = 'aliasTest';
        $value = 'valueTest';

        $column = new Column($name, $alias);
        $column->setValue($value);

        $this->assertEquals($column->getAlias(), $alias);
        $this->assertEquals($column->getName(), $name);
        $this->assertEquals($column->getValue(), $value);
    }

}