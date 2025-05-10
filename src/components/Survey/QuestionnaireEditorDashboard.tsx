import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { SurveyRequestChildrenInner } from '../../api-generated';
import { ISurvey } from '../../types/surveys';
import QuestionConfig from './Children/ChildrenConfig/QuestionConfig';
import QuestionEditor from './Children/QuestionEditor';
import QuestionTree, { QuestionItem } from './QuestionTree';

interface QuestionnaireEditorDashboardProps {
    surveyUuid: string;
    initialQuestions?: QuestionItem[];
    onChange?: (questions: QuestionItem[]) => void;
}

const QuestionnaireEditorDashboard: React.FC<QuestionnaireEditorDashboardProps> = ({
                                                                                       surveyUuid,
                                                                                       initialQuestions = [],
                                                                                       onChange,
                                                                                   }) => {
    // Access form context
    const { setValue, watch } = useFormContext<ISurvey>();
    const questions = watch('children') || initialQuestions;
    const [selectedQuestion, setSelectedQuestion] = React.useState<SurveyRequestChildrenInner | null>(null);
    const [selectedQuestionFormKey, setSelectedQuestionFormKey] = React.useState<string>('children');

    // Initialize children in the form if they don't exist
    useEffect(() => {
        if (initialQuestions.length > 0 && (!questions || questions.length === 0)) {
            setValue('children', initialQuestions);
        }
    }, [initialQuestions, setValue, questions]);

    // Function to update questions and notify parent component
    const handleQuestionsChange = (newQuestions: ISurvey['children']) => {
        setValue('children', newQuestions, {
            shouldValidate: true,
            shouldDirty: true,
        });

        console.log('New questions:', newQuestions);

        if (onChange) {
            onChange(newQuestions as QuestionItem[]);
        }
    };

    // Function to select a question and update its form path
    const handleQuestionSelect = (question: QuestionItem, formPath: string) => {
        setSelectedQuestion(question);
        setSelectedQuestionFormKey(formPath);
        console.log('Selected question path:', formPath);
    };

    return (
        <div
            className="flex h-full w-full bg-white dark:bg-dark-900 border rounded-lg shadow-sm dark:border-dark-700 overflow-hidden">
            <div className="w-1/4 border-r border-gray-200 dark:border-gray-700">
                <QuestionTree
                    items={questions}
                    onItemsChange={handleQuestionsChange}
                    onItemSelect={handleQuestionSelect}
                    selectedItemId={selectedQuestion?.uniqueId}
                />
            </div>
            <div className="w-1/2 border-r border-gray-200 dark:border-gray-700">
                <QuestionEditor
                    surveyUuid={surveyUuid}
                    selectedQuestion={selectedQuestion}
                    selectedQuestionFormKey={selectedQuestionFormKey}
                />
            </div>
            <div className="w-1/4">
                <QuestionConfig
                    selectedQuestion={selectedQuestion}
                    selectedQuestionFormKey={selectedQuestionFormKey}
                    onQuestionUpdate={(updatedQuestion) => {
                        // Update the form with the updated question
                        if (selectedQuestionFormKey !== 'children') {
                            setValue(selectedQuestionFormKey as any, updatedQuestion, {
                                shouldValidate: true,
                                shouldDirty: true,
                            });
                        } else {
                            // Handle top-level updates if needed
                            const newQuestions = [...questions];
                            const index = newQuestions.findIndex(q => q.uniqueId === updatedQuestion.uniqueId);
                            if (index !== -1) {
                                newQuestions[index] = updatedQuestion;
                                handleQuestionsChange(newQuestions);
                            }
                        }

                        setSelectedQuestion(updatedQuestion);
                    }}
                />
            </div>
        </div>
    );
};

export default QuestionnaireEditorDashboard;