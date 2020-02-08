<?php

namespace App\Tests\Unit\Mock;

class MockRedisClient
{
    public $data = [];

    public function expire($token, $lifetime) {
        return true;
    }

    public function exists($hash) {
        return isset($this->$data[$hash]);
    }

    public function hgetall($token) {
        if (!isset($this->data[$token])) {
            return null;
        }

        return $this->data[$token];
    }

    public function hmset($token, $blobs) {
        $this->data[$token] = $blobs;

        return true;
    }

    public function hkeys($token) {
        if (!isset($this->data[$token])) {
            return null;
        }

        return array_keys($this->data[$token]);
    }
}