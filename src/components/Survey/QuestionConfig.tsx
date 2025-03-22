import React from 'react';
import { useTranslation } from 'react-i18next';

import { QuestionItem } from './QuestionTree';

interface QuestionConfigProps {
  selectedQuestion: QuestionItem | null;
  onQuestionUpdate: (question: QuestionItem) => void;
}

const QuestionConfig: React.FC<QuestionConfigProps> = ({ selectedQuestion, onQuestionUpdate }) => {
  const { t } = useTranslation();

  if (!selectedQuestion) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        {t('Select a question to configure')}
      </div>
    );
  }

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onQuestionUpdate({
      ...selectedQuestion,
      type: e.target.value
    });
  };

  const handleRequiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onQuestionUpdate({
      ...selectedQuestion,
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b dark:border-dark-700">
        <h3 className="font-medium">{t('Configuration')}</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            {t('Question Type')}
          </label>
          <select
            value={selectedQuestion.type}
            onChange={handleTypeChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-800 dark:border-dark-700"
          >
            <option value="text">{t('Text')}</option>
            <option value="checkbox">{t('Checkbox')}</option>
            <option value="radio">{t('Multiple Choice')}</option>
            <option value="dropdown">{t('Dropdown')}</option>
            <option value="textarea">{t('Long Text')}</option>
          </select>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              onChange={handleRequiredChange}
              className="rounded"
            />
            <span className="text-sm font-medium">{t('Required Question')}</span>
          </label>
        </div>

        {/* Configuraciones adicionales según el tipo de pregunta */}
        {selectedQuestion.type === 'text' && (
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('Placeholder text')}
            </label>
            <input
              type="text"
              onChange={(e) => onQuestionUpdate({
                ...selectedQuestion,
              })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-800 dark:border-dark-700"
              placeholder={t('Enter placeholder text')}
            />
          </div>
        )}

        {/* Espacio para más configuraciones específicas */}
        <div className="pt-4 border-t dark:border-dark-700">
          <h4 className="font-medium mb-2">{t('Validation')}</h4>
          {/* Aquí irían opciones de validación según el tipo */}
        </div>

        <div className="pt-4 border-t dark:border-dark-700">
          <h4 className="font-medium mb-2">{t('Conditional Logic')}</h4>
          {/* Aquí irían opciones de lógica condicional */}
        </div>
      </div>
    </div>
  );
};

export default QuestionConfig;
