<?php
namespace App\Entity;

use App\Entity\Order;
use App\Entity\Product;
use Doctrine\ORM\EntityManager;

class OrderListener
{
    /**
     * Event sum price products
     *
     * @param EntityManager $em
     * @param Order $order
     * @param array $orderData
     */
    public static function preSave(&$em, &$order, &$orderData) {
        $productIds = [];

        foreach ($orderData['product'] as $product) {
            $productIds[] = $product['id'];
        }

        $users = $em->getRepository(Product::class)->findBy(['id' => $productIds]);

        $sum = 0;
        foreach ($users as $user) {
            $sum += $user->getPrice();
        }

        $order->setAmount($sum);
    }
}