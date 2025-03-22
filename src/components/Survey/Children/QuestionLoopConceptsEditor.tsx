import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LoopConcept } from '../../../api-generated';
import { cn } from '../../../lib/utils';
import { ISurvey } from '../../../types/surveys';
import { GripIcon, PlusIcon, TrashIcon } from '../../UI/Icons';
import InputWithLabel from '../../UI/molecules/InputWithLabel';

interface QuestionLoopConceptsEditorProps {
  questionCode: string;
  formPath: string;
}

/**
 * Component for managing loop concepts in loop-type questions
 * Loop concepts define the iterations for dynamic loops
 */
const QuestionLoopConceptsEditor: React.FC<QuestionLoopConceptsEditorProps> = ({
  questionCode,
  formPath
}) => {
  const { t } = useTranslation();
  const { setValue, watch } = useFormContext<ISurvey>();
  const loopConcepts = watch(`${formPath}.loopConcepts` as any) as LoopConcept[];

  // Update loop concepts in the form
  const updateLoopConcepts = (updatedConcepts: LoopConcept[]) => {
    setValue(`${formPath}.loopConcepts` as any, updatedConcepts, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  // Add a new concept
  const handleAddConcept = () => {
    const conceptIndex = loopConcepts?.length || 0;
    const newConcept: LoopConcept = {
      code: `concept_${conceptIndex + 1}`,
      label: t('New Concept'),
      index: conceptIndex,
      depth: 0,             // Required depth property
      isLast: true          // Required isLast property
    };
    
    // Update isLast property for previous concepts
    const updatedConcepts = [...(loopConcepts || [])].map(concept => ({
      ...concept,
      isLast: false
    }));
    
    updateLoopConcepts([...updatedConcepts, newConcept]);
  };

  // Update a concept
  const handleUpdateConcept = (index: number, field: keyof LoopConcept, value: string | number) => {
    const updatedConcepts = [...(loopConcepts || [])];
    updatedConcepts[index] = {
      ...updatedConcepts[index],
      [field]: value
    };
    updateLoopConcepts(updatedConcepts);
  };

  // Delete a concept
  const handleDeleteConcept = (index: number) => {
    const updatedConcepts = [...(loopConcepts || [])].filter((_, i) => i !== index);
    
    // Update indices after deletion
    updatedConcepts.forEach((concept, i) => {
      concept.index = i;
      // Set isLast property correctly
      concept.isLast = i === updatedConcepts.length - 1;
    });
    
    updateLoopConcepts(updatedConcepts);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-800 dark:text-gray-200">{t('Loop Concepts')}</h3>
          <button
            type="button"
            onClick={handleAddConcept}
            className={cn(
              "flex items-center px-3 py-1.5 rounded-xl text-sm",
              "bg-gradient-to-r from-pumpkin-orange to-pumpkin-orange/80",
              "text-white font-medium shadow-sm hover:shadow-md",
              "transition-all duration-200 hover:translate-y-[-1px]"
            )}
          >
            <PlusIcon className="h-4 w-4 mr-1.5" />
            {t('Add Concept')}
          </button>
        </div>
        
        <div className="mb-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('Define concepts that will be used in the loop iterations. Each concept represents an iteration variable.')}
          </p>
        </div>
        
        {loopConcepts && loopConcepts.length > 0 ? (
          <div className="space-y-3">
            {loopConcepts.map((concept, index) => (
              <div key={`concept-${index}`} className="flex items-start gap-2">
                <div className="flex-shrink-0 py-2.5 px-2 text-gray-400">
                  <GripIcon className="h-5 w-5" />
                </div>
                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InputWithLabel
                    id={`${questionCode}-concept-${index}-label`}
                    label={t('Label')}
                    inputProps={{
                      value: concept.label,
                      onChange: (e) => handleUpdateConcept(index, 'label', e.target.value),
                      placeholder: t('Display name'),
                      className: "backdrop-blur-sm"
                    }}
                  />
                  <InputWithLabel
                    id={`${questionCode}-concept-${index}-code`}
                    label={t('Code')}
                    inputProps={{
                      value: concept.code,
                      onChange: (e) => handleUpdateConcept(index, 'code', e.target.value),
                      placeholder: t('Variable name'),
                      className: "backdrop-blur-sm"
                    }}
                    helperText={t('Used in loop conditions and expressions')}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteConcept(index)}
                  className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            {t('No concepts defined yet. Add a concept to define loop variables.')}
          </div>
        )}
        
        {loopConcepts && loopConcepts.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {t('These concepts can be referenced in loop conditions using the syntax: {concept.code}')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionLoopConceptsEditor;