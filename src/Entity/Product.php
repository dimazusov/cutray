<?php

namespace App\Entity;

use App\Entity\Listener\ProductListener;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="product")
 * @ORM\Entity(repositoryClass="App\Repository\ProductRepository")
 * @ORM\EntityListeners({"ProductListener"})
 */
class Product
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
     * @ORM\Column(type="string", length=70, nullable=true)
     */
    private $vendor;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $description;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $full_description;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $price;

    /**
     * @ORM\Column(type="string", length=80, nullable=true)
     */
    private $preview_img_path;

    /**
     * @ORM\Column(type="string", length=800, nullable=true)
     */
    private $img_paths;

    /**
     * @ORM\Column(type="integer")
     */
    private $category_id;

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

    public function getVendor(): ?string
    {
        return $this->vendor;
    }

    public function setVendor(?string $vendor): self
    {
        $this->vendor = $vendor;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getFullDescription(): ?string
    {
        return $this->full_description;
    }

    public function setFullDescription(?string $full_description): self
    {
        $this->full_description = $full_description;

        return $this;
    }

    public function getPrice(): ?int
    {
        return $this->price;
    }

    public function setPrice(?int $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getPreviewImgPath(): ?string
    {
        return $this->preview_img_path;
    }

    public function setPreviewImgPath(?string $preview_img_path): self
    {
        $this->preview_img_path = $preview_img_path;

        return $this;
    }

    public function getImgPaths(): array
    {
        if (is_null($this->img_paths)) {
            return [];
        }

        return explode(',', $this->img_paths);
    }

    public function setImgPaths(?array $img_paths): self
    {
        if(!count($img_paths)) {
            $this->img_paths = null;
        } else {
            $this->img_paths = implode(',', $img_paths);
        }

        return $this;
    }

    public function getCategoryId(): ?int
    {
        return $this->category_id;
    }

    public function setCategoryId(int $category_id): self
    {
        $this->category_id = $category_id;

        return $this;
    }
}
