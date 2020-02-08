<?php

namespace App\ResourceListeners;

use App\Entity\Product;
use App\Resource\Error;
use App\Resource\AbstractResource;
use App\Resource\ActionListener\AbstractResourceListener;

class ResourceProductListener extends AbstractResourceListener {
    /**
     * @param AbstractResource $resource
     */
    public function preExecute(AbstractResource &$resource): bool
    {
        return true;
    }

    /**
     * @param AbstractResource $resource
     */
    public function postExecute(AbstractResource &$resource): bool
    {
        $columns = $resource->getColumns();

        $id    = null;
        $hash  = null;

        foreach ($columns as $column) {
            if ($column->getName() == 'id') {
                $id = $column->getValue();
            }
            if ($column->getName() == 'image_hash') {
                $hash = $column->getValue();
            }
        }

        if (is_null($id)) {
            $this->errManager->addError(Error::SYSTEM_ERROR_KEY, [Error::SYSTEM_ERROR_MESSAGE_ALIAS]);
            $this->errManager->logError(__METHOD__, 'id column don\'t append');

            return false;
        }

        if (is_null($hash)) {
            $this->errManager->addError(Error::SYSTEM_ERROR_KEY, [Error::SYSTEM_ERROR_MESSAGE_ALIAS]);
            $this->errManager->logError(__METHOD__, 'image_hash column not found');

            return false;
        }

        $em = $this->container->get('doctrine')->getManager();

        /**
         * @var Product
         */
        $model = $em->getRepository(Product::class)->find($id);

        if (!$model) {
            $this->errManager->addError(Error::SYSTEM_ERROR_KEY, [Error::SYSTEM_ERROR_MESSAGE_ALIAS]);
            $this->errManager->logError(__METHOD__, 'model not found ' . $id);

            return false;
        }

        $imageService = $this->container->get('App\Service\ImageService');
        
        $imageService->removeAllImageForProduct($model);

        $paths = $imageService->saveAllImagesForProduct($model->getId(), $hash);

        $model->setImgPaths($paths);

        try {
            $em->persist($model);
            $em->flush();
        } catch (\Exception $e) {
            $errMessage = 'id = ' . $id . '     paths = '.implode(',',$paths). ' '. $e->getMessage();

            $this->errManager->logError(__METHOD__, $errMessage);
            $this->errManager->addError(Error::SYSTEM_ERROR_KEY, [Error::SYSTEM_ERROR_MESSAGE_ALIAS]);

            return false;
        }

        return true;
    }
}