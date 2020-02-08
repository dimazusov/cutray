<?php

namespace App\Tests\Unit\Service;

use App\Resource\Error;
use App\Tests\Unit\Mock\MockRedisClient;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;


class ImageServiceTest extends KernelTestCase
{
    private $cont;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->cont = $kernel->getContainer();
    }

    public function getLoadedImageManager() {
        $mockRedisClient = new MockRedisClient();

        $imageManager = $this->cont->get('App\Service\ImageService');
        $imageManager->setRedisClient($mockRedisClient);

        return $imageManager;
    }

    public function testReadImage()
    {
        $imageManager = $this->getLoadedImageManager();

        $imDir = $imageManager->getImgDir();
        $path = $imDir .'/logo.png';
        $isRead = $imageManager->readFromPath($path);

        $this->assertEquals($isRead, true);

        $imDir = $imageManager->getImgDir();
        $path = $imDir .'/notExists.png';
        $isRead = $imageManager->readFromPath($path);

        $this->assertEquals($isRead, false);
    }

    public function testReadFromBlob() {
        $imageManager = $this->getLoadedImageManager();

        $imDir = $imageManager->getImgDir();
        $path = $imDir .'/logo.png';

        $image = new \Imagick($path);

        $blob = $image->getImageBlob();
        $isRead = $imageManager->readFromBlob($blob);

        $this->assertEquals($isRead, true);

        $isRead = $imageManager->readFromBlob('test_wrong_blob');

        $this->assertEquals($isRead, false);
    }

    public function testWriteToRedis() {
        $imageManager = $this->getLoadedImageManager();
        $path = $imageManager->getImgDir() .'/logo.png';

        $imageManager->readFromPath($path);

        $position = 1;
        $isWrited = $imageManager->writeToRedis('testToken', $position);

        $this->assertEquals($isWrited, true);

        $mockRedisClient = $imageManager->getRedisClient();
        $countWritedImages = count($mockRedisClient->data);

        $this->assertEquals($countWritedImages, 1);
    }
}