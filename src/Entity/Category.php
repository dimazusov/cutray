<?php

namespace App\Entity;

use App\Entity\Listener\CategoryListener;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="category")
 * @ORM\Entity(repositoryClass="App\Repository\CategoryRepository")
 * @ORM\EntityListeners({"CategoryListener"})
 */
class Category
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $seoname;

    /**
     * @ORM\Column(type="integer")
     */
    private $cleft;

    /**
     * @ORM\Column(type="integer")
     */
    private $cright;

    /**
     * @ORM\Column(type="datetime")
     */
    private $created_at;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $updated_at;

    /**
     * @ORM\Column(type="integer")
     */
    private $parent_id;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getSeoname(): ?string
    {
        return $this->seoname;
    }

    public function setSeoname(string $seoname): self
    {
        $this->seoname = $seoname;

        return $this;
    }

    public function getCleft(): ?int
    {
        return $this->cleft;
    }

    public function setCleft(int $cleft): self
    {
        $this->cleft = $cleft;

        return $this;
    }

    public function getCright(): ?int
    {
        return $this->cright;
    }

    public function setCright(int $cright): self
    {
        $this->cright = $cright;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeInterface $created_at): self
    {
        $this->created_at = $created_at;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updated_at;
    }

    public function setUpdatedAt(?\DateTimeInterface $updated_at): self
    {
        $this->updated_at = $updated_at;

        return $this;
    }

    public function getParentId(): ?int
    {
        return $this->parent_id;
    }

    public function setParentId(int $parentId): self
    {
        $this->parent_id = $parentId;

        return $this;
    }

//    public function prePersist()
//    {
//        $this->rebuidTreeForSave();
//    }
//
//    public function preSoftDelete()
//    {
//        $this->rebuildTreeForRemove();
//    }
//
//    private function rebuidTreeForSave() {
//
//    }
//
//    private function rebuildTreeForRemove() {
//
//    }
}
