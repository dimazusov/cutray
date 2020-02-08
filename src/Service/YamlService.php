<?php

namespace App\Service;

use Doctrine\DBAL\Connection;
use Predis\Client;
use Symfony\Component\Yaml\Yaml;
use Symfony\Component\Yaml\Exception\ParseException;

class YamlService
{
    /**
     * @var String
     */
    private $rootPath;

    public function __construct(string $rootPath)
    {
        $this->rootPath = $rootPath;
    }

    public function parseSettingResource($type, $sourceName)
    {
        $pathToFile = $this->rootPath . '/' . getenv('RESOURCES_PATH') . '/' . $type . '/' . $sourceName . '.yaml';

        try {
            $arr = Yaml::parseFile($pathToFile);
        } catch (ParseException $e) {
            return false;
        }

        return $arr;
    }
}
