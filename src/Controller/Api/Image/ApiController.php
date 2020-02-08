<?php

namespace App\Controller\Api\Image;

use App\Image\ImageFactory;
use App\Resource\Status;
use App\Service\ImageService;
use App\Service\ImageTokenService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * Controller for work with images api
 *
 * @Route("/_api/image")
 */
class ApiController extends AbstractController
{
    /**
     * Recieve token for images action
     *
     * @Route("/get/token", name="backoffice.api.image.get.token", methods="GET|POST")
     */
    public function getToken(Request $request, ImageService $imageService, TranslatorInterface $translator): Response
    {
        $id   = (int) $request->request->get('id');
        $type = $request->request->get('type');

        if (!$type) {
            return $this->json([
                'status' => Status::ERROR,
                'messages' => [
                    $translator->trans('errors.image.typeEmpty')
                ]
            ]);
        }

        $token = $imageService->getNewUniqueHash($type);

        $manager = ImageFactory::get($type, $this->getDoctrine()->getManager(), $imageService);

        if (!$manager) {
            return $this->json([
                'status' => Status::ERROR,
                'messages' => [
                    $translator->trans('errors.image.wrongType')
                ]
            ]);
        }

        return $this->json([
           'token' => $token,
           'blobs' => $manager->getEncodedBlobs($token, $id)
        ]);
    }

    /**
     * Add image
     *
     * @Route("/add", name="backoffice.api.image.add", methods="GET|POST")
     */
    public function addImage(Request $request, ImageService $image, TranslatorInterface $translator): Response
    {
        $token = $request->request->get('token');
        $position = $request->request->get('position');

        if (!$token) {
            return $this->json([
                'status' => Status::ERROR,
                'messages' => [
                    $translator->trans('errors.image.tokenEmpty')
                ]
            ]);
        }

        if (!$image->isAllowPosition($position)) {
            return $this->json([
                'error' => true,
                'errorMessage' => $translator->trans('errors.image.wrongPosition')
            ]);
        }

        if ($image->isMaxCount($token)) {
            return $this->json([
                'error' => true,
                'errorMessage' => $translator->trans('errors.image.maxCount')
            ]);
        }

        if (!isset($_FILES['image'])) {
            return $this->json([
                'error' => true,
                'errorMessage' => $translator->trans('errors.system')
            ]);
        }

        if (!$image->checkMaxSize($position)) {
            return $this->json([
                'error' => true,
                'errorMessage' => $translator->trans('errors.image.size')
            ]);
        }

        if (!$image->readFromPath($_FILES['image']['tmp_name'])) {
            return $this->json([
                'error' => true,
                'errorMessage' => $translator->trans('errors.system')
            ]);
        }

        if (!$image->writeToRedis($token, $position)) {
            return $this->json([
                'error' => true,
                'errorMessage' => $translator->trans('errors.system')
            ]);
        }

        $image->adaptiveResizeImage(140,0);

        $blob = $image->getImageBlob();

        return $this->json([
            'success' => true,
            'blob' => base64_encode($blob),
            'position' => $position
        ]);
    }

    /**
     * Delete image
     *
     * @Route("/delete", name="backoffice.api.image.delete", methods="GET|POST")
     */
    public function deleteImage(Request $request, ImageService $image): Response
    {
        $position = (int) $request->request->get('position');
        $token = (string) $request->request->get('token');

        if (!$token) {
            return $this->render404();
        }

        $image->delWithSort($token, $position);

        return $this->json([
            'success' => true
        ]);
    }
}
