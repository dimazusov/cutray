<?php

namespace App\Image;

use App\Image\ImageProductManagerFactoryInterface;
use App\Entity\Product;
use App\Service\ImageService;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Class ImageProductManager
 * @package App\Image
 */
class ImageProductManager implements ImageProductManagerFactoryInterface
{
    /**
     * @var ImageService
     */
    private $imageService;

    /**
     * @var EntityManagerInterface
     */
    private $em;

    /**
     *
     *
     * ImageProductManager constructor.
     * @param EntityManagerInterface $em
     * @param ImageService $imageService
     */
    public function __construct(EntityManagerInterface $em, ImageService $imageService)
    {
        $this->em = $em;
        $this->imageService = $imageService;
    }

    /**
     * Return blobs from storage by token and id
     *
     * @param string $token
     * @param int|null $id
     * @return array
     */
    public function getBlobs(string $token, int $id=null): array
    {
        if (!$id) {
            return [];
        }

        $product = $this->em->getRepository(Product::class)->find($id);

        if (!$product) {
            return [];
        }

        return $this->imageService->readAllToRedis($product, $token);
    }

    /**
     * Return encoded blobs from storage by token and id
     *
     * @param string $token
     * @param int|null $id
     * @return array
     */
    public function getEncodedBlobs(string $token, int $id=null): array {
        $blobs = $this->getBlobs($token, $id);

        $encodedBlobs = [];

        foreach ($blobs as &$blob) {
            $encodedBlobs[] = base64_encode($blob);
        }

        return $encodedBlobs;
    }
}