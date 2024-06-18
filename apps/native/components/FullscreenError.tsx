import React from 'react';
import { View } from 'react-native';
import tw from '../lib/tailwind';
import { LANG } from '../env';
import { Serif } from './Text';

const FullscreenError: React.FC<{
  bgColor?: string;
  textColor?: string;
  errorMsg?: string;
}> = ({ bgColor = `rgba(0, 0, 0, 0)`, textColor = `rgb(3, 3, 3)`, errorMsg }) => (
  <View
    style={tw.style(`flex-grow items-center justify-center`, {
      backgroundColor: bgColor,
    })}
  >
    <Serif
      style={tw.style(`mt-4 opacity-75 px-12 text-center leading-[29px]`, {
        color: textColor,
      })}
      size={19}
    >
      {errorMsg ?? LANG === `en`
        ? `Unexpected error. Please try again, or contact us at info@friendslibrary.com if the problem persists.`
        : `Ha ocurrido un error inesperado. Vuelve a intentarlo o ponte en contacto con nosotros en info@bibliotecadelosamigos.org si el problema persiste.`}
    </Serif>
  </View>
);

export default FullscreenError;
