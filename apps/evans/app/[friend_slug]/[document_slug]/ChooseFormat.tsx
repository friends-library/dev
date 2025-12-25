import React from 'react';
import { t } from '@friends-library/locale';
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import ChoiceItem from './ChoiceItem';
import ChoiceStep from './ChoiceStep';
import Ebook from '@/components/custom-icons/Ebook';
import Pdf from '@/components/custom-icons/Pdf';
import { LANG } from '@/lib/env';

interface Props {
  onChoose: (choice: `epub` | `pdf` | `speech`) => any;
}
const ChooseFormat: React.FC<Props> = ({ onChoose }) => (
  <ChoiceStep title={t`Choose Download Format`}>
    <ChoiceItem
      label={t`E-Book`}
      description={t`Best for reading on a computer, phone, or tablet.`}
      recommended
      Icon={Ebook}
      onChoose={() => onChoose(`epub`)}
    />
    <ChoiceItem
      label="PDF"
      description={t`Best for printing out your own copy.`}
      Icon={Pdf}
      onChoose={() => onChoose(`pdf`)}
    />
    <ChoiceItem
      label={LANG === `es` ? `Texto Sin Formato` : `Plain Text`}
      description={t`Best for text-to-speech apps like “Voice Dream.”`}
      Icon={() => <ChatBubbleLeftEllipsisIcon />}
      onChoose={() => onChoose(`speech`)}
    />
  </ChoiceStep>
);

export default ChooseFormat;
