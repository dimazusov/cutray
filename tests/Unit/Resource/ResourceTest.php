<?php

namespace App\Tests\Unit\Service;

use App\Resource\Resource;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ResourceTest extends KernelTestCase
{
    private $cont;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->cont = $kernel->getContainer();
    }

    public function testCreate() {
        $yamlManager = $this->cont->get('App\Service\YamlService');

        $type = 'get';
        $sourceName = 'product';
        $source = $yamlManager->parseSettingResource($type, $sourceName);

        $resource = Resource::create($source, $type);

        $this->assertNotNull($resource);

        $source = [
            'product' => [
                'model' => 'NotFoundModel'
            ]
        ];
        $resource = Resource::create($source, $type);

        $this->assertNull($resource);
    }

    public function testBind() {
        $yamlManager = $this->cont->get('App\Service\YamlService');

        $type = 'get';
        $sourceName = 'product';
        $source = $yamlManager->parseSettingResource($type, $sourceName);

        $resource = Resource::create($source, $type);

        $data = [
            'product' => [
                'page' => 1,
                'countOnPage' => 23
            ]
        ];

        $resource->bindData($data);

        $page = $resource->getPage();
        $this->assertEquals($data['product']['page'], $page);

        $countOnPage = $resource->getCountOnPage();
        $this->assertEquals($data['product']['countOnPage'], $countOnPage);
    }
}