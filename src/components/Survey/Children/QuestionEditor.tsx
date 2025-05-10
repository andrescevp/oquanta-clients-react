import React from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '../../../lib/utils';
import { AlertCircleIcon, HelpCircleIcon } from '../../UI/Icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../UI/molecules/Tabs';
import { QuestionItem } from '../QuestionTree';
import QuestionPropertiesEditor from './QuestionPropertiesEditor';

interface QuestionEditorProps {
    surveyUuid: string;
    selectedQuestion: QuestionItem | null;
    selectedQuestionFormKey: string;
}

/**
 * QuestionEditor component for editing survey question properties
 * Uses atomic UI components for consistent styling and behavior
 */
const QuestionEditor: React.FC<QuestionEditorProps> = ({
                                                           surveyUuid,
                                                           selectedQuestion,
                                                           selectedQuestionFormKey,
                                                       }) => {
    const { t } = useTranslation();

    // Check if we have a valid selected question
    if (!selectedQuestion) {
        return (
            <div
                className="h-full flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <HelpCircleIcon className="h-16 w-16 mb-4 text-gray-300 dark:text-gray-600" />
                <p className="text-lg font-medium text-center">
                    {t('Select a question to edit')}
                </p>
                <p className="text-sm text-center mt-2 max-w-md">
                    {t('Click on any question in the tree to edit its properties and content')}
                </p>
            </div>
        );
    }

    // Render different editors based on question type
    // eslint-disable-next-line complexity
    const renderQuestionEditor = () => {
        switch (selectedQuestion.type) {
            case 'choice':
            case 'open_end':
                return (
                    <div className="space-y-6">
                        {/* Common properties for all question types */}
                        <QuestionPropertiesEditor
                            surveyUuid={surveyUuid}
                            question={selectedQuestion}
                            formPath={selectedQuestionFormKey}
                        />
                    </div>
                );
            case 'block':
            case 'loop':
                return (
                    <div className="space-y-6">
                        {/* Common properties for block types */}
                        <QuestionPropertiesEditor
                            surveyUuid={surveyUuid}
                            question={selectedQuestion}
                            formPath={selectedQuestionFormKey}
                        />
                    </div>
                );
            default:
                return (
                    <div
                        className="p-4 bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <p className="text-gray-700 dark:text-gray-300">{t('Editor not implemented for this question type:')}</p>
                        <div className="mt-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm font-mono">
                            {selectedQuestion.type}
                        </div>
                    </div>
                );
        }
    };

    // Render preview based on question type
    // eslint-disable-next-line complexity
    const renderQuestionPreview = () => {
        switch (selectedQuestion.type) {
            case 'open_end':
                return (
                    <div
                        className="p-6 bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <p className="font-medium mb-2 text-gray-900 dark:text-white">{selectedQuestion.label || t('Question text')}</p>
                        {selectedQuestion.help && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{selectedQuestion.help}</p>
                        )}
                        <input
                            type="text"
                            disabled
                            className="w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl"
                            placeholder={t('Text answer')}
                        />
                    </div>
                );
            case 'choice':
                return (
                    <div
                        className="p-6 bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <p className="font-medium mb-2 text-gray-900 dark:text-white">{selectedQuestion.label || t('Question text')}</p>
                        {selectedQuestion.help && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{selectedQuestion.help}</p>
                        )}
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    disabled
                                    className="w-4 h-4 text-pumpkin-orange"
                                />
                                <span className="ml-2 text-gray-700 dark:text-gray-300">{t('Option 1')}</span>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    disabled
                                    className="w-4 h-4 text-pumpkin-orange"
                                />
                                <span className="ml-2 text-gray-700 dark:text-gray-300">{t('Option 2')}</span>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    disabled
                                    className="w-4 h-4 text-pumpkin-orange"
                                />
                                <span className="ml-2 text-gray-700 dark:text-gray-300">{t('Option 3')}</span>
                            </div>
                        </div>
                    </div>
                );
            case 'block':
            case 'loop':
                return (
                    <div
                        className="p-6 bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">{selectedQuestion.label || t('Block title')}</h3>
                                {selectedQuestion.help && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedQuestion.help}</p>
                                )}
                            </div>
                            <div className={cn(
                                'px-3 py-1 text-xs rounded-full',
                                selectedQuestion.type === 'block'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
                            )}>
                                {selectedQuestion.type.toUpperCase()}
                            </div>
                        </div>

                        <div
                            className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/30">
                            <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                                {t('Child questions will appear here')}
                            </p>
                        </div>
                    </div>
                );
            default:
                return (
                    <div
                        className="flex flex-col items-center justify-center p-10 bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <AlertCircleIcon className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-gray-700 dark:text-gray-300">{t('Preview not available')}</p>
                    </div>
                );
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div
                className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{t('Question Editor')}</h3>
                    <div className={cn(
                        'px-3 py-1 text-xs rounded-full',
                        ['open_end', 'choice'].includes(selectedQuestion.type)
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            : selectedQuestion.type === 'block'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
                    )}>
                        {selectedQuestion.type.toUpperCase()}
                    </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                    {selectedQuestion.label || t('Untitled Question')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-mono">
                    {selectedQuestionFormKey}
                </p>
            </div>

            <div
                className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <Tabs defaultIndex={0} className="w-full">
                    <TabsList className="mb-4 bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm">
                        <TabsTrigger id="edit">{t('Edit')}</TabsTrigger>
                        <TabsTrigger id="preview">{t('Preview')}</TabsTrigger>
                    </TabsList>
                    <TabsContent id="edit" className="focus-visible:outline-none focus-visible:ring-0">
                        {renderQuestionEditor()}
                    </TabsContent>
                    <TabsContent id="preview" className="focus-visible:outline-none focus-visible:ring-0">
                        {renderQuestionPreview()}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default QuestionEditor;