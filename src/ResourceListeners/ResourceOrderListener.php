<?php

namespace App\ResourceListeners;

use App\Resource\Column\Column;
use App\Resource\AbstractResource;
use App\Resource\ActionListener\AbstractResourceListener;
use App\Entity\Product;

class ResourceOrderListener extends AbstractResourceListener
{
    /**
     * @param AbstractResource $resource
     */
    public function preExecute(AbstractResource &$resource): bool
    {
        $childResource = $resource->getChildResource();
        $childColumns = $childResource->getColumns();
        $productIds = [];
        $counts = [];

        foreach ($childColumns as $column) {
            if ($column->getName() == 'product_id') {
                $productIds = $column->getValue();
            }

            if ($column->getName() == 'count') {
                $counts = $column->getValue();
            }
        }

        $productsModels = $this->container->get('doctrine')
            ->getRepository(Product::class)
            ->findBy(['id' => $productIds]);

        $productsPrices = [];

        foreach ($productsModels as $model) {
            $productsPrices[$model->getId()] = $model->getPrice();
        }

        $sum = 0;

        foreach ($productIds as $key => $productId) {
            $sum += $counts[$key] * $productsPrices[$productId];
        }

        $amountColumn = new Column('amount');
        $amountColumn->setValue($sum);

        $columns = $resource->getColumns();
        $columns[] = $amountColumn;

        $resource->setColumns($columns);

        return true;
    }

    /**
     * @param AbstractResource $resource
     */
    public function postExecute(AbstractResource &$resource): bool
    {
        return true;
    }
}