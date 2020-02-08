<?php

namespace App\Service;

use Doctrine\DBAL\Connection;
use Predis\Client;

class RedisService
{
    /**
     * @var Client
     */
    private $connection;

    public function __construct(string $host)
    {
        $this->connection =  new Client([ 'host' => $host ]);
    }

    public function getConnection(): Client
    {
        return $this->connection;
    }

    public function getNewUniqueHash(): string
    {
        do {
            $hash = hash('sha256', time() . rand(0,10000000));
        } while($this->connection->exists($hash));

        $this->connection->hmset($hash, ['']);

        return $hash;
    }

    public function hmset($key, $array)
    {
        return $this->connection->hmset($key, $array);
    }

    public function hmget($key, $hash)
    {
        return $this->connection->hmget($key, $hash);
    }

    public function hgetall($key)
    {
        return $this->connection->hgetall($key);
    }

    public function hkeys($key)
    {
        return $this->connection->hkeys($key);
    }

    public function isExists($hash): bool
    {
        return (bool) $this->connection->exists($hash);
    }

    public function setExpire($key, $time): bool
    {
        return $this->connection->expire($key, $time);
    }

    public function del($key): bool
    {
        return $this->connection->del($key);
    }

    public function hdel($key, $part): bool
    {
        return $this->connection->hdel($key, $part);
    }
}
