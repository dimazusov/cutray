<?php

namespace App\Tests\Unit\Service;

use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class YamlServiceTest extends KernelTestCase
{
    private $cont;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->cont = $kernel->getContainer();
    }

    public function testParseResourceFile() {
        $yamlManager = $this->cont->get('App\Service\YamlService');

        $type = 'not_exists_type';
        $sourceName = 'not_exists_source_name';

        $result = $yamlManager->parseSettingResource($type, $sourceName);

        $this->assertFalse($result);

        $type = 'get';
        $sourceName = 'product';

        $result = $yamlManager->parseSettingResource($type, $sourceName);

        $this->assertNotFalse($result);
    }
}