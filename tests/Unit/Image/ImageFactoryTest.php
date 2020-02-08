<?php

namespace App\Tests\Unit\Image;

use App\Image\ImageFactory;
use App\Image\ImageProductManager;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ImageFactoryTest extends KernelTestCase
{
    private $cont;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->cont = $kernel->getContainer();
    }

    public function testCreateImageProductManager() {
        $em = $this->cont->get('doctrine.orm.default_entity_manager');
        $imService = $this->cont->get('App\Service\ImageService');

        $imageProduct = ImageFactory::createImageProductManager($em, $imService);

        $this->assertEquals(get_class($imageProduct), ImageProductManager::class);
    }

    public function testGetImageProductByType() {
        $em = $this->cont->get('doctrine.orm.default_entity_manager');
        $imService = $this->cont->get('App\Service\ImageService');

        $type = 'imageProduct';

        $imageProduct = ImageFactory::get($type, $em, $imService);

        $this->assertNotNull($imageProduct);

        $type = 'type_not_exists';

        $imageProduct = ImageFactory::get($type, $em, $imService);

        $this->assertNull($imageProduct);
    }
}