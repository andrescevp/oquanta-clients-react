import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { SurveyRequestChildrenInner } from '../../api-generated';
import { ISurvey } from '../../types/surveys';
import QuestionConfig from './QuestionConfig';
import QuestionEditor from './QuestionEditor';
import QuestionTree, { QuestionItem } from './QuestionTree';

interface QuestionnaireEditorDashboardProps {
  initialQuestions?: QuestionItem[];
  onChange?: (questions: QuestionItem[]) => void;
}

const QuestionnaireEditorDashboard: React.FC<QuestionnaireEditorDashboardProps> = ({ 
  initialQuestions = [],
  onChange 
}) => {
  // Usar useFormContext para acceder al formulario
  const { setValue, watch, getValues } = useFormContext<ISurvey>();
  const questions = watch('children') || initialQuestions;
  const [selectedQuestion, setSelectedQuestion] = React.useState<SurveyRequestChildrenInner | null>(null);
  
  // Inicializar los children en el formulario si no existen
  useEffect(() => {
    if (initialQuestions.length > 0 && (!questions || questions.length === 0)) {
      setValue('children', initialQuestions);
    }
  }, [initialQuestions, setValue, questions]);
  
  // Función para actualizar las preguntas y notificar al componente padre
  const handleQuestionsChange = (newQuestions: ISurvey["children"]) => {
    setValue('children', newQuestions, {
      shouldValidate: true,
      shouldDirty: true
    });

    console.log('New questions:', newQuestions);
    
    if (onChange) {
      onChange(newQuestions);
    }
  };
  
  // Función para actualizar una pregunta específica
  const handleQuestionUpdate = (updatedQuestion: QuestionItem) => {
    // Función recursiva para encontrar y actualizar una pregunta en el árbol
    const updateQuestionInTree = (treeQuestions: QuestionItem[], targetCode: string): QuestionItem[] => {
      return treeQuestions.map(q => {
        if (q.code === targetCode) {
          return updatedQuestion;
        } 
        
        if (q.children && q.children.length > 0) {
          return {
            ...q,
            children: updateQuestionInTree(q.children, targetCode)
          };
        }
        
        return q;
      });
    };

    // Buscar la pregunta en cualquier nivel del árbol
    const newQuestions = updateQuestionInTree(questions, updatedQuestion.code);
    
    handleQuestionsChange(newQuestions);
    setSelectedQuestion(updatedQuestion);
  };
  
  // Función para seleccionar una pregunta
  const handleQuestionSelect = (question: QuestionItem) => {
    setSelectedQuestion(question);
  };

  return (
    <div className="flex h-full w-full bg-white dark:bg-dark-900 border rounded-lg shadow-sm dark:border-dark-700 overflow-hidden">
        <div className="w-1/4 border-r border-gray-200 dark:border-gray-700">
        <QuestionTree 
          items={questions}
          onItemsChange={handleQuestionsChange}
          onItemSelect={handleQuestionSelect}
          selectedItemId={selectedQuestion?.code}
        />
        </div>
        <div className="w-1/2 border-r border-gray-200 dark:border-gray-700">
        <QuestionEditor 
          selectedQuestion={selectedQuestion} 
          onQuestionUpdate={handleQuestionUpdate}
        />
        </div>
        <div className="w-1/4">
        <QuestionConfig 
          selectedQuestion={selectedQuestion} 
          onQuestionUpdate={handleQuestionUpdate}
        />

        </div>
    </div>
  );
};

export default QuestionnaireEditorDashboard;
