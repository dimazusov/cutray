<?php

namespace App\Helper;

use Symfony\Component\Translation\TranslatorInterface;

class TranslatorHelper
{
    /**
     * @var TranslatorInterface
     */
    private $translator;

    /**
     * TranslatorHelper constructor.
     * @param TranslatorInterface $translator
     */
    public function __construct(TranslatorInterface $translator)
    {
        $this->translator = $translator;
    }

    /**
     * Translate keyfrase
     *
     * @param string $keyForTranslate
     * @return string
     */
    public function translate(string $keyForTranslate): string
    {
        return $this->translator->trans($keyForTranslate);
    }

    /**
     * Translate array of keyfrases
     *
     * @param array $arr
     * @return array
     */
    public function translateArray(array $arr): array
    {
        $translatedArray = [];

        foreach ($arr as $key => $value) {
            if( is_array($value) ) {
                $translatedArray[ $key ] = $this->translateArray( $value );
            } else {
                $translatedArray[ $key ] = $this->translate( $value );
            }
        }

        return $translatedArray;
    }
}
