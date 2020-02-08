<?php

namespace App\ResourceListeners;

use App\Resource\Column\Column;
use App\Resource\AbstractResource;
use App\Resource\ActionListener\AbstractResourceListener;
use Carbon\Carbon;

class ResourceContactListener extends AbstractResourceListener
{
    /**
     * @param AbstractResource $resource
     */
    public function preExecute(AbstractResource &$resource): bool
    {
        $columns = $resource->getColumns();

        $createdAtColumn = new Column('created_at');
        $createdAtColumn->setValue(Carbon::now());

        $isModeratorReadColumn = new Column('is_moderator_read');
        $isModeratorReadColumn->setValue(false);

        $columns[] = $createdAtColumn;
        $columns[] = $isModeratorReadColumn;

        $resource->setColumns($columns);

        return true;
    }

    /**
     * @param AbstractResource $resource
     */
    public function postExecute(AbstractResource &$resource): bool
    {
        return true;
    }
}