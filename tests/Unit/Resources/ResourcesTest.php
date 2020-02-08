<?php

namespace App\Tests\Unit\Service;

use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ResourcesTest extends KernelTestCase
{
    private $cont;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->cont = $kernel->getContainer();
    }

    public function testLoad() {
        $yamlManager = $this->cont->get('App\Service\YamlService');
        $basePath = $this->cont->getParameter('kernel.project_dir');
        $resourcesPath = $basePath . '/src/Resources';
        $types = [
            'add',
            'delete',
            'get',
            'update'
        ];

        foreach ($types as $type) {
            $typeDirPath = $resourcesPath . '/' . $type;
            $listFiles = scandir($typeDirPath);

            // удаляем текущую и род. директории
            unset($listFiles[0]);
            unset($listFiles[1]);

            foreach ($listFiles as $filePath) {
                $sourceName = explode('.', $filePath)[0];

                $result = $yamlManager->parseSettingResource($type, $sourceName);

                $this->assertNotFalse($result);
            }
        }
    }
}