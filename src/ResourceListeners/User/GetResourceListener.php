<?php

namespace App\ResourceListeners\User;

use App\Entity\User;
use App\Resource\Column\Column;
use App\Resource\AbstractResource;
use App\Resource\ActionListener\AbstractResourceListener;

class GetResourceListener extends AbstractResourceListener
{
    /**
     * @param AbstractResource $resource
     */
    public function preExecute(AbstractResource &$resource): bool
    {
        /**
         * @var Column[]
         */
        $columns = $resource->getColumns();
        $columnValue = null;

        foreach ($columns as $column) {
            if ($column->getName() == 'id') {
                $columnValue = $column->getValue();

                break;
            }
        }

        /**
         * @var User
         */
        $currentUser = $this->getCurrentUser();

        if (!\in_array('ROLE_ADMIN', $currentUser->getRoles())) {
            $translator = $this->container->get('translator');

            $currentUserId = $currentUser->getId();

            if (is_array($columnValue)) {
                $this->errManager->addError('system', [$translator->trans('errors.access_denied')]);

                return false;
            }

            if ($columnValue != $currentUserId) {
                $this->errManager->addError('system', [$translator->trans('errors.access_denied')]);

                return false;
            }
        }

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