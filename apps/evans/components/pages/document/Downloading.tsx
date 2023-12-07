import React from 'react';
import ChoiceStep from './ChoiceStep';
import Dual from '@/components/core/Dual';

const Downloading: React.FC = () => (
  <ChoiceStep title="Download">
    <Dual.P className="p-8 body-text text-white text-center bg-flblue-700 w-full">
      <>Your download should begin shortly.</>
      <>Tu descarga debería comenzar en breve.</>
    </Dual.P>
  </ChoiceStep>
);

export default Downloading;
