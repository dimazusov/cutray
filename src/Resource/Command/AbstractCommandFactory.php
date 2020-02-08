<?php

namespace App\Resource\Command;

abstract class AbstractCommandFactory
{
    const CREATE_COMMAND = 'add';
    const UPDATE_COMMAND = 'update';
    const DELETE_COMMAND = 'delete';
    const GET_COMMAND = 'get';

    /**
     * Create command
     *
     * @param string $type
     * @param $container
     * @return AbstractCommand|null
     */
    abstract public static function create(string $type, $container) :?AbstractCommand;
}