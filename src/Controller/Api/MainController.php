<?php

namespace App\Controller\Api;

use App\Resource\Status;
use App\Entity\User;
use App\Service\TokenManagerService;
use App\Controller\Api\BaseApiController;
use Psr\Log\LoggerInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * Main controller return our js app for all pages
 * besides api route
 *
 * @Route("/")
 */
class MainController extends BaseApiController
{
    /**
     * @Route(
     *     "/{path}",
     *     defaults={},
     *     requirements={
     *         "path": ".+|.?"
     *     },
     *     name="main.index",
     *     methods="GET"
     * )
     */
    public function indexAction() {
        return $this->render('base.html.twig');
    }
}
