import React from 'react';
import { useTranslation } from 'react-i18next';

import { Block, Loop, QuestionChoice, QuestionNumber, QuestionString, SurveyRequestChildrenInner } from '../../../api-generated';
import { cn } from '../../../lib/utils';
import { AlertCircleIcon } from '../../UI/Icons';
import BlockOptionsForm from './BlockOptionsForm';
import ChoiceOptionsForm from './ChoiceOptionsForm';
import LoopOptionsForm from './LoopOptionsForm';
import NumberOptionsForm from './NumberOptionsForm';
import StringOptionsForm from './StringOptionsForm';

interface OptionsFormFactoryProps {
  element: SurveyRequestChildrenInner;
  onChange: (field: string, value: any) => void;
  className?: string;
}

/**
 * Factory component that renders the appropriate options form based on question type
 */
const OptionsFormFactory: React.FC<OptionsFormFactoryProps> = ({
  element,
  onChange,
  className
}) => {
  const { t } = useTranslation();

  // Select the appropriate options form based on question type
  const renderOptionsForm = () => {
    switch (element.type) {
      case 'string':
        return <StringOptionsForm element={element as QuestionString} onChange={onChange} />;
        
      case 'number':
        return <NumberOptionsForm element={element as QuestionNumber} onChange={onChange} />;
        
      case 'choice':
        return <ChoiceOptionsForm element={element as QuestionChoice} onChange={onChange} />;
        
      case 'block':
        return <BlockOptionsForm element={element as Block} onChange={onChange} />;
        
      case 'loop':
        return <LoopOptionsForm element={element as Loop} onChange={onChange} />;
        
      default:
        return (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500 bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700">
            <AlertCircleIcon className="h-12 w-12 mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-lg font-medium text-center">
              {t('Unsupported Question Type')}
            </p>
            <p className="text-sm text-center mt-2 max-w-md">
              {t('Options editor not available for type:')} <span className="font-mono">{element.type}</span>
            </p>
          </div>
        );
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {renderOptionsForm()}
    </div>
  );
};

export default OptionsFormFactory;