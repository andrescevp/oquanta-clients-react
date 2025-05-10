import React from 'react';
import { useTranslation } from 'react-i18next';

import {
    closestCenter,
    DndContext,
    DragOverlay,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Transition } from '@headlessui/react';

import { useSurveyDragAndDrop } from '../../hooks/useSurveyDragAndDrop';
import { canHaveChildren, QuestionItem, useSurveyTreeManager } from '../../hooks/useSurveyTreeManager';
import { cn } from '../../lib/utils';
import { IconLayoutList, IconPlus, IconRefresh } from '../UI/Icons';
import DropZone from './DropZone';
import SortableItem from './SortableItem';

interface QuestionTreeProps {
    items: QuestionItem[];
    onItemsChange: (items: QuestionItem[]) => void;
    onItemSelect: (item: QuestionItem, formPath: string) => void;
    selectedItemId?: string;
}

// DropIndicator Component
const DropIndicator = ({ isActive }: { isActive: boolean }) => {
    return (
        <Transition
            show={isActive}
            enter="transition-all duration-200 ease-in-out"
            enterFrom="opacity-0 transform scale-95"
            enterTo="opacity-100 transform scale-100"
            leave="transition-all duration-150 ease-in-out"
            leaveFrom="opacity-100 transform scale-100"
            leaveTo="opacity-0 transform scale-95"
            unmount={true}
        >
            <div
                className="h-1 bg-gradient-to-r from-pumpkin-orange to-pumpkin-orange/80 w-full my-1 rounded-full shadow-lg shadow-pumpkin-orange/10"
                style={{
                    animation: isActive ? 'pulse 1.5s infinite ease-in-out' : 'none',
                }}
            />
        </Transition>
    );
};

const QuestionTree: React.FC<QuestionTreeProps> = ({
    items,
    onItemsChange,
    onItemSelect,
    selectedItemId,
}) => {
    const { t } = useTranslation();
    
    const {
        flatItems,
        addNewQuestion,
        addNewBlock,
        addNewLoop,
        addSubQuestion,
        addSubBlock,
        addSubLoop,
        handleDeleteItem,
        handleDropOnDropzone,
        handleDropOnItem,
        handleSelectItem,
    } = useSurveyTreeManager({ items, onItemsChange, onItemSelect });

    const {
        activeId,
        dragOverId,
        dragOverRoot,
        dropPosition,
        activeItemRef,
        sensors,
        handleDragStart,
        handleDragOver,
        handleDragEnd
    } = useSurveyDragAndDrop({
        flatItems,
        handleDropOnDropzone,
        handleDropOnItem
    });

    const handleAddNewQuestion = () => {
        const { newItem, formPath } = addNewQuestion();
        if (newItem) {
            onItemSelect(newItem, formPath);
        }
    };

    const handleAddNewBlock = () => {
        const { newItem, formPath } = addNewBlock();
        if (newItem) {
            onItemSelect(newItem, formPath);
        }
    };

    const handleAddNewLoop = () => {
        const { newItem, formPath } = addNewLoop();
        if (newItem) {
            onItemSelect(newItem, formPath);
        }
    };

    const handleAddSubQuestion = (parentId: string) => {
        const { newItem, formPath } = addSubQuestion(parentId);
        if (newItem) {
            onItemSelect(newItem, formPath);
        }
    };

    const handleAddSubBlock = (parentId: string) => {
        const { newItem, formPath } = addSubBlock(parentId);
        if (newItem) {
            onItemSelect(newItem, formPath);
        }
    };

    const handleAddSubLoop = (parentId: string) => {
        const { newItem, formPath } = addSubLoop(parentId);
        if (newItem) {
            onItemSelect(newItem, formPath);
        }
    };

    const renderTreeItems = (
        treeItems: QuestionItem[],
        parentId: string | null = null,
    ) => {
        let itemsAtLevel: QuestionItem[] = [];

        if (parentId === null) {
            itemsAtLevel = treeItems.filter((item) => !item.parentUniqueId);
        } else {
            const parentItem = flatItems.find((item) => item.uniqueId === parentId);
            if (parentItem) {
                itemsAtLevel = (parentItem.children || []) as QuestionItem[];
            }
        }

        if (itemsAtLevel.length === 0) {
            if (parentId) {
                const parentItem = flatItems.find((item) => item.uniqueId === parentId);
                if (parentItem && canHaveChildren(parentItem.type)) {
                    return (
                        <DropZone
                            id={`${parentItem.uniqueId}-dropzone`}
                            parentId={parentItem.uniqueId}
                            isActive={dragOverId === `${parentItem.uniqueId}-dropzone`}
                        />
                    );
                }
            }
            return null;
        }

        return (
            <>
                {itemsAtLevel.map((item) => {
                    const isContainerTarget = dragOverId === `${item.uniqueId}-container`;
                    const isItemTarget = dragOverId === item.uniqueId;

                    return (
                        <React.Fragment key={item.uniqueId}>
                            <div className="my-2">
                                <DropIndicator
                                    isActive={
                                        isItemTarget &&
                                        dropPosition === 'before' &&
                                        activeId !== item.uniqueId
                                    }
                                />
                            </div>

                            <SortableItem
                                id={item.uniqueId}
                                item={item}
                                isSelected={selectedItemId === item.uniqueId}
                                onClick={() => handleSelectItem(item)}
                                onAddSubQuestion={() => handleAddSubQuestion(item.uniqueId)}
                                onAddSubBlock={() => handleAddSubBlock(item.uniqueId)}
                                onAddSubLoop={() => handleAddSubLoop(item.uniqueId)}
                                canHaveChildren={canHaveChildren(item.type)}
                                onDelete={() => handleDeleteItem(item.uniqueId)}
                                isDragOver={isItemTarget || isContainerTarget}
                            />

                            {canHaveChildren(item.type) && (
                                <div
                                    className={cn(
                                        'pl-6 ml-4 border-l transition-all duration-200',
                                        {
                                            'border-pumpkin-orange bg-pumpkin-orange/5 dark:bg-pumpkin-orange/10 rounded-l-xl':
                                                isItemTarget && dropPosition === 'inside',
                                            'border-gray-200 dark:border-gray-700':
                                                !(isItemTarget && dropPosition === 'inside'),
                                        },
                                    )}
                                >
                                    {renderTreeItems(treeItems, item.uniqueId)}
                                </div>
                            )}

                            <div className="my-2">
                                <DropIndicator
                                    isActive={
                                        isItemTarget &&
                                        dropPosition === 'after' &&
                                        activeId !== item.uniqueId
                                    }
                                />
                            </div>
                        </React.Fragment>
                    );
                })}
            </>
        );
    };

    const rootContainerClasses = cn(
        'p-1 backdrop-blur-sm rounded-2xl transition-all duration-200',
        {
            'border-pumpkin-orange shadow-xl shadow-pumpkin-orange/10 dark:border-pumpkin-orange/50':
                dragOverRoot && activeId,
        },
    );

    return (
        <div className="h-full flex flex-col">
            <div className="p-2 space-y-2 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('Questions')}</h3>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={handleAddNewQuestion}
                        className="p-2 rounded-xl text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-all duration-200 hover:shadow-md flex items-center"
                        title={t('Add Question')}
                        aria-label={t('Add Question')}
                    >
                        <IconPlus className="w-4 h-4 mr-1" />
                        <span>{t('Question')}</span>
                    </button>

                    <button
                        onClick={handleAddNewBlock}
                        className="p-2 rounded-xl text-sm bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30 transition-all duration-200 hover:shadow-md flex items-center"
                        title={t('Add Block')}
                        aria-label={t('Add Block')}
                    >
                        <IconLayoutList className="w-4 h-4 mr-1" />
                        <span>{t('Block')}</span>
                    </button>

                    <button
                        onClick={handleAddNewLoop}
                        className="p-2 rounded-xl text-sm bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30 transition-all duration-200 hover:shadow-md flex items-center"
                        title={t('Add Loop')}
                        aria-label={t('Add Loop')}
                    >
                        <IconRefresh className="w-4 h-4 mr-1" />
                        <span>{t('Loop')}</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={[
                            ...flatItems.map((item) => item.uniqueId),
                            ...flatItems
                                .filter(
                                    (item) =>
                                        canHaveChildren(item.type) &&
                                        (!item.children || item.children.length === 0),
                                )
                                .map((item) => `${item.uniqueId}-dropzone`),
                        ]}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className={rootContainerClasses} id="root-container">
                            {items.length > 0 ? (
                                renderTreeItems(items)
                            ) : (
                                <div className="text-center py-12 text-gray-500 dark:text-gray-400 flex flex-col items-center">
                                    <div className="w-16 h-16 mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                        <IconPlus className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <p className="text-lg">{t('No questions yet')}</p>
                                    <p className="text-sm mt-1">{t('Add a question to get started')}</p>
                                </div>
                            )}
                        </div>
                    </SortableContext>

                    <DragOverlay>
                        {activeItemRef.current ? (
                            <div className="opacity-90 bg-gradient-to-r from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-800/70 p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl backdrop-blur-sm">
                                {activeItemRef.current.label || ''}
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    );
};

export default QuestionTree;