import React from 'react';
import { t } from '@friends-library/locale';
import Epub from '../../icons/Epub';
import Mobi from '../../icons/Mobi';
import ChoiceStep from './ChoiceStep';
import ChoiceItem from './ChoiceItem';

interface Props {
  onChoose: (choice: 'epub' | 'mobi') => any;
}

const ChooseEbookType: React.FC<Props> = ({ onChoose }) => (
  <ChoiceStep title={t`Choose eBook Type`}>
    <ChoiceItem
      label="E-Pub"
      description={t`Best for most apps and platforms, including Android, iOS, and newer Kindle devices.`}
      recommended
      Icon={Epub}
      onChoose={() => onChoose(`epub`)}
    />
    <ChoiceItem
      label="Mobi"
      description={t`Best for older Android and Kindle devices.`}
      Icon={Mobi}
      onChoose={() => onChoose(`mobi`)}
    />
  </ChoiceStep>
);

export default ChooseEbookType;
