<?php

namespace App\Service;

use Doctrine\DBAL\Connection;
use Predis\Client;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Validator\Constraints\Image;
use Psr\Log\LoggerInterface;
use Monolog\Logger;

class ImageService
{
    const EXT_JPG = '.jpg';
    const DIVIDE_EVERY = 1000;
    const MAX_IMAGE_PER_USER_FOR_REDIS = 11;
    const REDIS_LIFETIME = 3600;
    const MAX_IMAGE_SIZE = 10000000; // 10 mb

    /**
     * @var string
     */
    private $imgDir;

    /**
     * @var string
     */
    private $typeImgDir;

    /**
     * @var \Imagick
     */
    private $image;

    /**
     * @var RedisService
     */
    private $redis;

    /**
     * @var LoggerInterface
     */
    private $logger;

    public function __construct(string $imgDir, RedisService $redis, LoggerInterface $logger)
    {
        $this->imgDir = $imgDir;
        $this->redis = $redis->getConnection();
        $this->typeImgDir = 'product';
        $this->logger = $logger;
    }

    public function readFromPath(string $path): bool
    {
        try {
            $this->image = new \Imagick($path);

        } catch (\Exception $e) {
            echo ' exeption ';
            $this->logger->error('Error read from path ' . $e);

            return false;
        }

        return true;
    }

    public function readFromBlob(string $blob): bool
    {
        try {
            $this->image = new \Imagick();
            $this->image->readImageBlob($blob);
        } catch (\Exception $e) {
            $this->logger->error('Error read from path ' . $e);

            return false;
        }

        return true;
    }

    public function writeToRedis($token, $position): bool
    {
        $array = [
            $position => $this->image->getImageBlob()
        ];

        if (!$this->redis->hmset($token, $array)) {
            $this->logger->error('Error write to redis', [
                'token' => $token,
                'map' => $array
            ]);

            return false;
        }

        $this->redis->expire($token, self::REDIS_LIFETIME);

        return true;
    }

    public function isMaxCount($token): bool
    {
        $count = count($this->redis->hkeys($token));

        if ($count < self::MAX_IMAGE_PER_USER_FOR_REDIS) {
            return false;
        }

        return true;
    }

    public function isAllowPosition(int $number): bool
    {
        if ($number < 0 || $number > self::MAX_IMAGE_PER_USER_FOR_REDIS) {
            return false;
        }

        return true;
    }

    public function checkMaxSize(int $size): bool
    {
        if ($size > self::MAX_IMAGE_SIZE) {
            return false;
        }

        return true;
    }

    public function getNewUniqueHash(): string
    {
        do {
            $hash = hash('sha256', time() . rand(0,10000000));
        } while($this->redis->exists($hash));

        return $hash;
    }

    public function adaptiveResizeImage(int $width, int $height): void
    {
        $this->image->adaptiveResizeImage($width, $height);
    }

    public function getImageBlob()
    {
        return $this->image->getImageBlob();
    }

    public function getImgSubDir(int $id): string
    {
        $index = floor($id / self::DIVIDE_EVERY);

        $subImgDir = substr(hash('sha256', $index), 0, 8);

        return $subImgDir;
    }

    public function getImgProductDir(int $id): string
    {
        $index = floor($id / self::DIVIDE_EVERY);

        $subImgDir = substr(hash('sha256', $index), 0, 8);

        $productImgDir = substr(hash('sha256', $id), 0, 8);

        return $subImgDir . '/' . $productImgDir;
    }

    public function removeAllImageForProduct($product): void
    {
        $dir =  $this->imgDir . '/product/' . $this->getImgProductDir($product->getId());

        if (!file_exists($dir)) {
            return ;
        }

        $files = scandir($dir);

        foreach ($files as $fileName) {
            if($fileName != '.' && $fileName != '..') {
                unlink($dir . '/' . $fileName);
            }
        }
    }

    public function readAllToRedis($product, $token)
    {
        $imgPaths = $product->getImgPaths();

        if(!count($imgPaths)) {
            return [];
        }

        $position = 0;
        $blobs = [];

        foreach ($imgPaths as $imgPath) {
            $this->readFromPath($this->imgDir . '/product/' . $imgPath);

            $blobs[] = $this->getImageBlob();

            $this->writeToRedis($token, $position++);
        }

        return $blobs;
    }

    public function delWithSort($token, $position) {
        $blobs = $this->redis->hgetall($token);

        $blobs[$position] = '';

        unset($blobs[$position]);

        ksort($blobs);

        $blobs = array_values($blobs);

        $emptyArr = array_fill(count($blobs), self::MAX_IMAGE_PER_USER_FOR_REDIS-count($blobs)-1, '');

        $blobs = array_merge($blobs, $emptyArr);

        $this->redis->hmset($token, $blobs);
    }

    public function saveAllImagesForProduct($productId, $token)
    {
        $blobs = $this->redis->hgetall($token);

        ksort($blobs);

        $paths = [];

        foreach ($blobs as $blob) {
            if (empty($blob)) {
                continue;
            }

            $this->readFromBlob($blob);

            $paths[] = $this->saveForProduct($productId);
        }

        return $paths;
    }

    public function saveForProduct($productId): string
    {
        $this->createDirForProduct($productId);

        $fullProductDirPath = $this->imgDir . '/product/' . $this->getImgProductDir($productId);

        do {
            $name = $this->generateName();

            $filename = $fullProductDirPath . '/' . $name . self::EXT_JPG;
        } while(file_exists($filename));

        $this->image->writeImage($filename);

        return $this->getImgProductDir($productId) . '/' . $name . self::EXT_JPG;
    }

    public function createDirForProduct(int $id): void
    {
        $fullSubDirPath = $this->imgDir . '/product/' . $this->getImgSubDir($id);

        if (!file_exists($fullSubDirPath)) {
            mkdir($fullSubDirPath);
        }

        $fullProductDirPath = $this->imgDir . '/product/' . $this->getImgProductDir($id);

        if (!file_exists($fullProductDirPath)) {
            mkdir($fullProductDirPath);
        }
    }

    public function deleteDirForProduct(int $id): void
    {
        $fullProductDirPath = $this->imgDir . '/product/' . $this->getImgProductDir($id);

        $this->rmRec($fullProductDirPath);
    }

    protected function rmRec($path) {
        if (is_file($path)) {
            return unlink($path);
        }

        if (is_dir($path)) {
            foreach (scandir($path) as $p) if (($p!='.') && ($p!='..')) {
                $this->rmRec($path.DIRECTORY_SEPARATOR.$p);
            }

            return rmdir($path);
        }

        return false;
    }

    private function generateName(): string
    {
        return substr(hash('sha256', time() . rand(0,10000000)), 0, 8);
    }

    public function setRedisClient($client) {
        $this->redis = $client;
    }

    public function getRedisClient() {
        return $this->redis;
    }

    public function getImgDir() {
        return $this->imgDir;
    }
}
