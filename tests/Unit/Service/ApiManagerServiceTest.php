<?php

namespace App\Tests\Unit\Service;

use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\HttpFoundation\Request;
use App\Service\ApiManagerService;

class ApiManagerServiceTest extends KernelTestCase
{
    private $cont;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->cont = $kernel->getContainer();
    }

    public function getTestResourceParams()
    {
        return [
            'source' => 'product',
            'type' => 'get',
            'userRoles' => ['ROLE_ADMIN']
        ];
    }

    public function getLoadedManager(array $resourceParams, array $requestParams = []): ApiManagerService
    {
        $manager = $this->cont->get('App\Service\ApiManagerService');

        $request = new Request();

        $requestWithWrongPage = clone $request;
        $requestWithWrongPage->query->add($requestParams);

        $manager->loadResource($resourceParams['source'], $resourceParams['type'], $requestWithWrongPage);

        return $manager;
    }

    public function testLoad()
    {
        $manager = $this->cont->get('App\Service\ApiManagerService');

        $data = $this->getTestResourceParams();

        $request = new Request();

        $isLoad = $manager->loadResource($data['source'], $data['type'], $request);

        $this->assertEquals($isLoad, true);
    }

    public function testAccess()
    {
        $resourceParams = $this->getTestResourceParams();
        $manager = $this->getLoadedManager($resourceParams);

        $isAllow = $manager->checkAccess($resourceParams['userRoles']);

        $this->assertEquals($isAllow, true);
    }

    public function testAccessForUserRole()
    {
        $resourceParams = [
            'source' => 'user',
            'type' => 'get'
        ];

        $manager = $this->getLoadedManager($resourceParams);

        $isAllowForUser = $manager->checkAccess(['ROLE_USER']);
        $isAllowForUnknown = $manager->checkAccess(['ROLE_UNKNOWN']);

        $this->assertEquals($isAllowForUser, true);
        $this->assertEquals($isAllowForUnknown, false);
    }

    public function testValidPage()
    {
        $resourceParams = $this->getTestResourceParams();

        $manager = $this->getLoadedManager($resourceParams, ['product' => ['page' => 1]]);

        $this->assertEquals($manager->valid(), true);

        $manager = $this->getLoadedManager($resourceParams, ['product' => ['page' => -1]]);

        $this->assertEquals($manager->valid(), false);
    }

    public function testValidQueryParams()
    {
        $resourceParams = $this->getTestResourceParams();

        $manager = $this->getLoadedManager($resourceParams, ['product' => ['id' => 1]]);

        $this->assertEquals($manager->valid(), true);

        $manager = $this->getLoadedManager($resourceParams, ['product' => ['id' => -1]]);

        $this->assertEquals($manager->valid(), false);

        $manager = $this->getLoadedManager($resourceParams, ['product' => ['ids' => [1, 2, 3]]]);

        $this->assertEquals($manager->valid(), true);

        $manager = $this->getLoadedManager($resourceParams, ['product' => ['ids' => [-1]]]);

        $this->assertEquals($manager->valid(), false);

        $manager = $this->getLoadedManager($resourceParams, ['product' => ['ids' => 1]]);

        $this->assertEquals($manager->valid(), false);

        $manager = $this->getLoadedManager($resourceParams, ['product' => ['name' => 'test']]);

        $this->assertEquals($manager->valid(), true);
    }

    public function testBuild()
    {
        $resourceParams = $this->getTestResourceParams();

        $manager = $this->getLoadedManager($resourceParams);

        $this->assertEquals($manager->build(), true);
    }
}