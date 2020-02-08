<?php
namespace App\Entity;

use Carbon\Carbon;
use Doctrine\ORM\Event\LifecycleEventArgs;

class CategoryListener
{
    /**
     * @param Category $category
     * @param LifecycleEventArgs $event
     */
    public function prePersist(Category $category, LifecycleEventArgs $event)
    {
        $date = Carbon::now();

        $category->setCreatedAt($date);
        $category->setUpdatedAt($date);

        $parentId = $category->getParentId();

        $em = $event->getEntityManager();

        $qb = $em->createQueryBuilder('category c');

        if($parentId == 0) {
            $q = $qb->select('MAX(c.cright) as maxCright')
                ->from('App\Entity\Category', 'c')
                ->getQuery();

            $res = $q->getSingleResult();

            $maxCright = $res['maxCright'];

            $category->setCleft($maxCright + 1);
            $category->setCright($maxCright + 2);
        } else {
            $q = $qb->select('cat.cright as cright')
                ->from('App\Entity\Category', 'cat')
                ->where('cat.id = :parentId')
                ->setParameter('parentId', $parentId)
                ->setMaxResults(1)
                ->getQuery();

            $parentCategory = $q->getOneOrNullResult();

            $parentCright = $parentCategory['cright'] ?? 1;
            $qb = $em->createQueryBuilder();

            $qb->resetDQLParts();

            $qb->update('App\Entity\Category', 'c')
                ->set('c.cleft', 'c.cleft + 2')
                ->where('c.cleft > :parentCright')
                ->setParameter('parentCright', $parentCright)
                ->getQuery()
                ->execute();

            $qb->resetDQLParts();

            $qb->update('App\Entity\Category', 'c')
                ->set('c.cright', 'c.cright + 2')
                ->where('c.cright >= :parentCright')
                ->setParameter('parentCright', $parentCright)
                ->getQuery()
                ->execute();

            $category->setCleft($parentCright);
            $category->setCright($parentCright + 1);
        }
    }

    /**
     * @param Category $category
     * @param LifecycleEventArgs $event
     */
    public function preRemove(Category $category, LifecycleEventArgs $event)
    {
        $em = $event->getEntityManager();
        $qb = $em->createQueryBuilder();

        $qb->update('App\Entity\Category', 'c')
            ->set('c.cleft', 'c.cleft - 2')
            ->where('c.cleft > :parentCright')
            ->setParameter('parentCright', $category->getCright())
            ->getQuery()
            ->execute();

        $qb->resetDQLParts();

        $qb->update('App\Entity\Category', 'c')
            ->set('c.cright', 'c.cright - 2')
            ->where('c.cright >= :parentCright')
            ->setParameter('parentCright', $category->getCright())
            ->getQuery()
            ->execute();
    }
}