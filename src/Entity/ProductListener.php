<?php
namespace App\Entity;

use App\Service\ImageService;
use Doctrine\ORM\Event\LifecycleEventArgs;

class ProductListener
{
    /**
     * @var ImageService
     */
    private $imageService;

    /**
     * ProductListener constructor.
     *
     * @param ImageService $service
     */
    public function __construct(ImageService $service)
    {
        $this->imageService = $service;
    }

    /**
     * Event delete dir with product images
     *
     * @param Product $product
     * @param LifecycleEventArgs $event
     */
    public function preRemove(Product $product, LifecycleEventArgs $event) {
        $this->imageService->deleteDirForProduct($product->getId());
    }
}