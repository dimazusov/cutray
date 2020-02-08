<?php

namespace App\Tests\Unit\Resource\Column;

use App\Resource\Command\CommandFactory;
use App\Resource\Command\Crud\ReadCommand;
use App\Resource\Resource;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ReadCommandTest extends KernelTestCase
{
    private $cont;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->cont = $kernel->getContainer();
    }

    public function testBuildCreateCommand() {
        $yamlManager = $this->cont->get('App\Service\YamlService');

        $type = 'get';
        $sourceName = 'product';
        $source = $yamlManager->parseSettingResource($type, $sourceName);

        $resource = Resource::create($source, $type);

        $data = [
            'product' => [
                'page' => 1,
                'countOnPage' => 23
            ]
        ];

        $resource->bindData($data);

        $command = CommandFactory::create($type, $this->cont);
        $command->build($resource);

        $query = 'SELECT p0_.id AS id_0, '
                . 'p0_.price AS price_1, '
                . 'p0_.name AS name_2, '
                . 'p0_.vendor AS vendor_3, '
                . 'p0_.category_id AS category_id_4, '
                . 'p0_.vendor AS vendor_5, '
                . 'p0_.description AS description_6, '
                . 'p0_.full_description AS full_description_7, '
                . 'p0_.img_paths AS img_paths_8, '
                . 'c1_.id AS id_9, '
                . 'c1_.name AS name_10, '
                . 'c1_.seoname AS seoname_11 '
                . 'FROM product p0_ '
                . 'LEFT JOIN category c1_ ON (p0_.category_id = c1_.id) '
                . 'ORDER BY p0_.id ASC LIMIT 23';

        $this->assertEquals($query, $command->getSelectSql());

        $totalSql = 'SELECT count(p0_.id) AS sclr_0 FROM product p0_';

        $this->assertEquals($totalSql, $command->getTotalSql());
    }
}