<?php

namespace App\Resource\Command;

use App\Resource\Command\Crud\ReadCommand;
use App\Resource\Command\Crud\CreateCommand;
use App\Resource\Command\Crud\UpdateCommand;
use App\Resource\Command\Crud\DeleteCommand;
use App\Resource\Command\AbstractCommand;

class CommandFactory extends AbstractCommandFactory
{
    /**
     * Create command
     *
     * @param string $type
     * @param $container
     * @return AbstractCommand|null
     */
    public static function create(string $type, $container): ?AbstractCommand
    {
        if($type == self::CREATE_COMMAND) {
            return new CreateCommand($container);
        }

        if($type == self::UPDATE_COMMAND) {
            return new UpdateCommand($container);
        }

        if($type == self::DELETE_COMMAND) {
            return new DeleteCommand($container);
        }

        if ($type == self::GET_COMMAND) {
            return new ReadCommand($container);
        }

        return null;
    }
}