import React from 'react';
import { useTranslation } from 'react-i18next';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../UI/molecules/Tabs';
import { QuestionItem } from './QuestionTree';

interface QuestionEditorProps {
  selectedQuestion: QuestionItem | null;
  onQuestionUpdate: (question: QuestionItem) => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ selectedQuestion, onQuestionUpdate }) => {
  const { t } = useTranslation();

  if (!selectedQuestion) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        {t('Select a question to edit')}
      </div>
    );
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onQuestionUpdate({
      ...selectedQuestion,
      label: e.target.value
    });
  };

  // Renderizar diferentes editores según el tipo de pregunta
  const renderQuestionEditor = () => {
    switch (selectedQuestion.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('Question Text')}
              </label>
              <input
                type="text"
                value={selectedQuestion.label}
                onChange={handleTitleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-800 dark:border-dark-700"
                placeholder={t('Enter your question')}
              />
            </div>
            {/* Aquí irían más campos específicos para preguntas de tipo texto */}
          </div>
        );
        case 'radio':
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t('Question Text')}
                </label>
                <input
                  type="text"
                  value={selectedQuestion.label}
                  onChange={handleTitleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-800 dark:border-dark-700"
                  placeholder={t('Enter your question')}
                />
              </div>
              {/* Aquí irían más campos específicos para preguntas de tipo texto */}
            </div>
          );
      // Añadir más casos para otros tipos de preguntas
      default:
        return (
          <div>
            <p>{t('Editor not implemented for this question type')}</p>
          </div>
        );
    }
  };

  // Renderizar vista previa según el tipo de pregunta
  const renderQuestionPreview = () => {
    switch (selectedQuestion.type) {
      case 'text':
        return (
          <div className="p-4 border rounded-md dark:border-dark-700">
            <p className="font-medium mb-2">{selectedQuestion.label}</p>
            <input
              type="text"
              disabled
              className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-dark-800 dark:border-dark-700"
              placeholder={t('Text answer')}
            />
          </div>
        );
      // Añadir más casos para otros tipos de preguntas
      default:
        return <p>{t('Preview not available')}</p>;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b dark:border-dark-700">
        <h3 className="font-medium">{selectedQuestion.label}</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <Tabs className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger >{t('Edit')}</TabsTrigger>
            <TabsTrigger >{t('Preview')}</TabsTrigger>
          </TabsList>
          <TabsContent >
            {renderQuestionEditor()}
          </TabsContent>
          <TabsContent >
            {renderQuestionPreview()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QuestionEditor;
