<?php

namespace App\Tests\Unit\Service;

use App\Resource\Validator\ResourceValidator;
use App\Resource\Resource;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ValidatorTest extends KernelTestCase
{
    private $cont;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->cont = $kernel->getContainer();
    }

    public function testValidate() {
        $yamlManager = $this->cont->get('App\Service\YamlService');
        $translator = $this->cont->get('translator');

        $type = 'get';
        $sourceName = 'product';
        $source = $yamlManager->parseSettingResource($type, $sourceName);

        $resource = Resource::create($source, $type);
        $resourceValidator = new ResourceValidator($translator);

        $data = [
            'product' => [
                'page' => 1,
                'countOnPage' => 23
            ]
        ];
        $resource->bindData($data);

        $errors = $resourceValidator->validate($resource);

        $this->assertEquals(count($errors), 0);


        $data = [
            'product' => [
                'page' => 1,
                'countOnPage' => 23
            ]
        ];
        $resource->bindData($data);

        $errors = $resourceValidator->validate($resource);

        $this->assertEquals(count($errors), 0);
    }

    public function testGetCountElements() {
        $yamlManager = $this->cont->get('App\Service\YamlService');
        $translator = $this->cont->get('translator');

        $type = 'get';
        $sourceName = 'product';
        $source = $yamlManager->parseSettingResource($type, $sourceName);

        $resource = Resource::create($source, $type);
        $resourceValidator = new ResourceValidator($translator);

        $data = [
            'product' => [
                'page' => 1,
                'countOnPage' => 23
            ]
        ];
        $resource->bindData($data);

        $countElements = $resourceValidator->getCountElements($resource);

        $this->assertEquals($countElements, 1);

        $data = [
            'product' => [
                'ids' => [1,2,3,4],
            ]
        ];
        $resource->bindData($data);

        $countElements = $resourceValidator->getCountElements($resource);

        $this->assertEquals($countElements, 4);
    }
}