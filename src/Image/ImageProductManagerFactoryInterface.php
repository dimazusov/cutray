<?php

namespace App\Image;

/**
 * Interface ImageProductManagerFactoryInterface
 */
interface ImageProductManagerFactoryInterface
{
    public function getBlobs(string $token, int $id): array;

    public function getEncodedBlobs(string $token, int $id): array;
}