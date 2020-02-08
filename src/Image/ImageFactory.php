<?php

namespace App\Image;

use App\Service\ImageService;
use Doctrine\ORM\EntityManagerInterface;

/**
 * ImageFactory for creating image managers
 */
class ImageFactory
{
    /**
     * @param EntityManagerInterface $em
     * @param ImageService $imageService
     * @return ImageProductManager
     */
    public static function createImageProductManager(EntityManagerInterface $em, ImageService $imageService) {
        return new ImageProductManager($em, $imageService);
    }

    /**
     * @param string $type
     * @param EntityManagerInterface $em
     * @param ImageService $imageService
     * @return ImageProductManagerFactoryInterface|null
     */
    public static function get(string $type, EntityManagerInterface $em, ImageService $imageService): ?ImageProductManagerFactoryInterface {
        $methodName = 'create'.ucfirst($type).'Manager';

        if (!method_exists(self::class, $methodName)) {
            return null;
        }

        return self::$methodName($em, $imageService);
    }
}