import React, { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import clsx from "clsx";

import { SurveyRequestChildrenInner } from "../../api-generated";
import { IconLayoutList, IconPlus, IconRefresh } from "../UI/Icons";
import DropZone from "./DropZone";
import SortableItem from "./SortableItem";

export type QuestionItem = SurveyRequestChildrenInner;

const CONTAINER_TYPES = ["block", "loop"];

const canHaveChildren = (type: string | undefined): boolean => {
  return !!type && CONTAINER_TYPES.includes(type);
};

interface QuestionTreeProps {
  items: QuestionItem[];
  onItemsChange: (items: QuestionItem[]) => void;
  onItemSelect: (item: QuestionItem) => void;
  selectedItemId?: string;
}

const flattenTree = (items: QuestionItem[]): QuestionItem[] => {
  const result: QuestionItem[] = [];

  const flatten = (questions: QuestionItem[], parentId: string | null = null) => {
    questions
      .filter((item) => item.parentCode === parentId)
      .forEach((item) => {
        result.push(item);
        if (item.children && item.children.length > 0) {
          flatten(item.children, item.code);
        }
      });
  };

  flatten(items);
  return result;
};

const rebuildTree = (flatItems: QuestionItem[]): QuestionItem[] => {
  console.log("Rebuilding tree with items:", flatItems);
  const itemMap = new Map<string, QuestionItem>();
  const rootItems: QuestionItem[] = [];

  flatItems.forEach((item) => {
    const itemWithoutChildren = { ...item, children: [] };
    itemMap.set(item.code, itemWithoutChildren);
  });

  flatItems.forEach((item) => {
    const current = itemMap.get(item.code);
    if (!current) return;

    if (item.parentCode && itemMap.has(item.parentCode)) {
      const parent = itemMap.get(item.parentCode);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(current);

        parent.children.forEach((child, idx) => {
          child.index = idx;
          child.isLast = idx === parent.children.length - 1;
        });
      }
    } else {
      rootItems.push(current);
    }
  });

  rootItems.forEach((item, index) => {
    item.index = index;
    item.isLast = index === rootItems.length - 1;
  });

  return rootItems;
};

// DropIndicator Component
const DropIndicator = ({ isActive }: { isActive: boolean }) => {
  if (!isActive) return null;

  return (
    <div className="h-1 bg-blue-500 w-full my-1 rounded-full animate-pulse transition-all duration-200" />
  );
};

// Add this helper function to check if an item is a descendant of another
const isDescendantOf = (
  possibleDescendant: string,
  possibleAncestor: string,
  items: QuestionItem[]
): boolean => {
  if (possibleDescendant === possibleAncestor) return true;
  
  let current = possibleDescendant;
  
  while (current) {
    const item = items.find(i => i.code === current);
    if (!item || !item.parentCode) break;
    
    if (item.parentCode === possibleAncestor) return true;
    current = item.parentCode;
  }
  
  return false;
};

const QuestionTree: React.FC<QuestionTreeProps> = ({
  items,
  onItemsChange,
  onItemSelect,
  selectedItemId,
}) => {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [dragOverRoot, setDragOverRoot] = useState<boolean>(false);
  const [dropPosition, setDropPosition] =
    useState<"before" | "after" | "inside" | null>(null);

  const flatItems = useMemo(() => flattenTree(items), [items]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Ref to store the active item for DragOverlay
  const activeItemRef = useRef<QuestionItem | null>(null);

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
    // Store the active item
    activeItemRef.current = flatItems.find(
      (item) => item.code === event.active.id
    ) || null;
  };

  // eslint-disable-next-line complexity
  const handleDragOver = (event: DragOverEvent) => {
    const { over, active } = event;

    console.log("Drag over:", over, "Active:", active);

    const isOverRoot = !over || over.id === "root-container";
    setDragOverRoot(isOverRoot);

    if (!over) {
      setDragOverId(null);
      setDropPosition(null);
      return;
    }

    const overId = String(over.id);

    if (overId.includes("-dropzone") && overId === `${active.id}-dropzone`) {
      setDragOverId(null);
      setDropPosition(null);
      return;
    }

    if (overId.includes("-dropzone")) {
      setDragOverId(overId);
      setDropPosition("inside");
      return;
    }

    const overRect = over.rect;
    const overCenter = overRect.top + overRect.height / 2;

    // Type assertion to 'any' to access clientOffset
    const cursorY = event.delta.y ?? 0;
    const isInUpperHalf = cursorY < overCenter;

    const overItem = flatItems.find((item) => item.code === overId);

    if (overItem) {
      setDragOverId(overId);
      // Clear styles for overItem (example: remove a class)
      // document.getElementById(overId)?.classList.remove('custom-drag-over-style');

      if (canHaveChildren(overItem.type) && !isInUpperHalf) {
        setDropPosition("inside");
      } else {
        setDropPosition(isInUpperHalf ? "before" : "after");
      }
    } else {
      setDragOverId(overId);
      setDropPosition(null);
    }
  };

  // Polyfill for findLastIndex
  const findLastIndex = (
    arr: SurveyRequestChildrenInner[],
    predicate: (item: SurveyRequestChildrenInner) => boolean
  ): number => {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (predicate(arr[i])) {
        return i;
      }
    }
    return -1;
  };

  const handleDropOnDropzone = (
    activeSurveyQuestionId: string,
    overId: string
  ) => {
    const parentId = overId.split("-dropzone")[0];
    const activeItemIndex = flatItems.findIndex(
      (item) => item.code === activeSurveyQuestionId
    );

    // Check if attempted drop would create a circular reference
    if (isDescendantOf(parentId, activeSurveyQuestionId, flatItems)) {
      console.warn("Cannot drop an element inside one of its descendants");
      return; // Prevent the invalid operation
    }

    if (activeItemIndex >= 0) {
      const parentItem = flatItems.find((item) => item.code === parentId);
      if (!parentItem) return;

      const newFlatItems = [...flatItems];
      const movedItem = { ...newFlatItems[activeItemIndex] };

      movedItem.parentCode = parentId;
      movedItem.depth = (parentItem.depth || 0) + 1;
      movedItem.index = 0;

      newFlatItems.splice(activeItemIndex, 1);

      newFlatItems.push(movedItem);

      const childrenToMove = flatItems.filter((item) => {
        let currentParent = item.parentCode;
        while (currentParent) {
          if (currentParent === activeSurveyQuestionId) return true;
          const parent = flatItems.find((p) => p.code === currentParent);
          currentParent = parent?.parentCode;
        }
        return false;
      });

      childrenToMove.forEach((child) => {
        const childInNewList = newFlatItems.find(
          (item) => item.code === child.code
        );
        if (childInNewList) {
          const originalDepthDiff =
            child.depth - flatItems[activeItemIndex].depth;
          childInNewList.depth = movedItem.depth + originalDepthDiff;
        }
      });

      const newTree = rebuildTree(newFlatItems);
      onItemsChange(newTree);
    }
  };

  // eslint-disable-next-line complexity
  const handleDropOnItem = (
    active: any,
    over: any,
    finalDropPosition: any
  ) => {
    const activeItemIndex = flatItems.findIndex(
      (item) => item.code === active.id
    );
    const overItemIndex = flatItems.findIndex((item) => item.code === over.id);

    if (activeItemIndex !== -1 && overItemIndex !== -1) {
      const activeItem = flatItems[activeItemIndex];
      const overItem = flatItems[overItemIndex];

      // Check if we're trying to drop a parent before/after one of its descendants
      // This is an invalid operation that can break the tree structure
      if (finalDropPosition !== "inside") {
        // Check if the target item is a descendant of the active item
        const isTargetDescendant = isDescendantOf(overItem.code, activeItem.code, flatItems);
        
        if (isTargetDescendant && overItem.code !== activeItem.code) {
          console.warn("Cannot reorder a parent before or after its own descendants");
          return; // Prevent the invalid operation
        }
      }

      // Existing check for dropping inside
      if (finalDropPosition === "inside" && 
          isDescendantOf(overItem.code, activeItem.code, flatItems)) {
        console.warn("Cannot drop an element inside itself or its descendants");
        return; // Prevent the invalid operation
      }

      const newFlatItems = [...flatItems];
      newFlatItems.splice(activeItemIndex, 1);

      let newIndex;
      let newParentCode = overItem.parentCode;
      let newDepth = overItem.depth; // Add this line
      console.log("Final drop position:", finalDropPosition);
      switch (finalDropPosition) {
        case "before": {
          newIndex =
            overItemIndex > activeItemIndex ? overItemIndex - 1 : overItemIndex;
          newParentCode = overItem.parentCode; // Set parent to overItem's parent
          newDepth = overItem.depth; // and depth to overItem's depth
          break;
        }
        case "after": {
          newIndex =
            overItemIndex > activeItemIndex ? overItemIndex : overItemIndex + 1;
          newParentCode = overItem.parentCode; // Set parent to overItem's parent
          newDepth = overItem.depth; // and depth to overItem's depth
          break;
        }
        case "inside": {
          newParentCode = overItem.code;
          newDepth = overItem.depth + 1; // Depth increased by 1
          const lastChildIndex = findLastIndex(
            newFlatItems,
            (item: SurveyRequestChildrenInner) => item.parentCode === overItem.code
          );
          newIndex =
            lastChildIndex !== -1 ? lastChildIndex + 1 : newFlatItems.length;
          break;
        }
        default: {
          newIndex = overItemIndex;
        }
      }

      const movedItem = {
        ...activeItem,
        parentCode: newParentCode,
        depth: newDepth, // Use the calculated depth
      };

      newFlatItems.splice(newIndex, 0, movedItem);

      const newTree = rebuildTree(newFlatItems);
      onItemsChange(newTree);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    const finalDropPosition = dropPosition;
    const finalDragOverId = dragOverId;

    setActiveId(null);
    setDragOverId(null);
    setDropPosition(null);

    // Clear styles for active item
    // if (active) {
    //   document.getElementById(active.id)?.classList.remove('custom-drag-style');
    // }

    if (!over || !active) return;

    const activeSurveyQuestionId = String(active.id);
    const overId = String(over.id);
    console.log("Drag end:", active, over, "Position:", finalDropPosition);

    if (overId.includes("-dropzone")) {
      handleDropOnDropzone(activeSurveyQuestionId, overId);
    } else if (over && active.id !== over.id) {
      handleDropOnItem(active, over, finalDropPosition);
    }

    activeItemRef.current = null;
  };

  const addNewQuestion = () => {
    const newQuestion: SurveyRequestChildrenInner = {
      code: `Q${Math.floor(Math.random() * Date.now())}`,
      type: "text",
      label: t("New Question"),
      index: items.length,
      options: {},
      children: [],
      depth: 0,
      isLast: true,
      parentCode: null,
    };

    const updatedItems = items.map((item) => ({
      ...item,
      isLast: false,
    }));

    const newItems = [...updatedItems, newQuestion];

    onItemsChange(newItems);
    onItemSelect(newQuestion);
  };

  const addNewBlock = () => {
    const newBlock: SurveyRequestChildrenInner = {
      code: `BL${Math.floor(Math.random() * Date.now())}`,
      type: "block",
      label: t("New Block"),
      index: items.length,
      options: {},
      children: [],
      depth: 0,
      isLast: true,
      parentCode: null,
    };

    const updatedItems = items.map((item) => ({
      ...item,
      isLast: false,
    }));

    const newItems = [...updatedItems, newBlock];

    onItemsChange(newItems);
    onItemSelect(newBlock);
  };

  const addNewLoop = () => {
    const newLoop: SurveyRequestChildrenInner = {
      code: `LP${Math.floor(Math.random() * Date.now())}`,
      type: "loop",
      label: t("New Loop"),
      index: items.length,
      options: {},
      children: [],
      depth: 0,
      isLast: true,
      parentCode: null,
    };

    const updatedItems = items.map((item) => ({
      ...item,
      isLast: false,
    }));

    const newItems = [...updatedItems, newLoop];

    onItemsChange(newItems);
    onItemSelect(newLoop);
  };

  const addSubQuestion = (parentId: string) => {
    const parent = flatItems.find((item) => item.code === parentId);
    if (!parent) return;

    if (!canHaveChildren(parent.type)) {
      console.warn(
        `No se pueden añadir subpreguntas a elementos de tipo: ${parent.type}`
      );
      return;
    }

    const newSubQuestion: SurveyRequestChildrenInner = {
      code: `Q${Math.floor(Math.random() * Date.now())}`,
      type: "text",
      label: t("New Question"),
      index: 0,
      options: {},
      children: [],
      depth: (parent.depth || 0) + 1,
      isLast: true,
      parentCode: parentId,
    };

    const newFlatItems = [...flatItems, newSubQuestion];

    const newTree = rebuildTree(newFlatItems);

    onItemsChange(newTree);
    onItemSelect(newSubQuestion);
  };

  const handleDeleteItem = (itemCode: string) => {
    const filterItems = (
      treeItems: QuestionItem[],
      codeToRemove: string
    ): QuestionItem[] => {
      return treeItems.filter((item) => {
        if (item.code === codeToRemove) return false;

        if (item.children && item.children.length > 0) {
          item.children = filterItems(item.children, codeToRemove);
        }

        return true;
      });
    };

    const newItems = filterItems(items, itemCode);

    if (newItems.length > 0) {
      const lastItem = newItems[newItems.length - 1];
      lastItem.isLast = true;
    }

    onItemsChange(newItems);
  };

  const addChildElement = (parentId: string, type: string) => {
    const parent = flatItems.find((item) => item.code === parentId);
    if (!parent) return;

    if (!canHaveChildren(parent.type)) {
      console.warn(
        `No se pueden añadir elementos hijo a elementos de tipo: ${parent.type}`
      );
      return;
    }

    let code: string;
    let label: string;

    switch (type) {
      case "block":
        code = `BL${Math.floor(Math.random() * Date.now())}`;
        label = t("New Block");
        break;
      case "loop":
        code = `LP${Math.floor(Math.random() * Date.now())}`;
        label = t("New Loop");
        break;
      default:
        code = `Q${Math.floor(Math.random() * Date.now())}`;
        label = t("New Question");
    }

    const newChild: SurveyRequestChildrenInner = {
      code,
      type,
      label,
      index: parent.children?.length || 0,
      options: {},
      children: [],
      depth: (parent.depth || 0) + 1,
      isLast: true,
      parentCode: parentId,
    };

    const updateParent = (
      treeItems: QuestionItem[],
      parentIdToUpdate: string,
      newChildToUpdate: QuestionItem
    ): QuestionItem[] => {
      return treeItems.map((item) => {
        if (item.code === parentIdToUpdate) {
          const updatedChildren = item.children
            ? item.children.map((child) => ({ ...child, isLast: false }))
            : [];

          return {
            ...item,
            children: [...updatedChildren, newChildToUpdate],
          };
        }
        if (item.children && item.children.length > 0) {
          return {
            ...item,
            children: updateParent(
              item.children,
              parentIdToUpdate,
              newChildToUpdate
            ),
          };
        }
        return item;
      });
    };

    const updatedItems = updateParent(items, parentId, newChild);

    onItemsChange(updatedItems);
    onItemSelect(newChild);
  };

  const addSubBlock = (parentId: string) => addChildElement(parentId, "block");
  const addSubLoop = (parentId: string) => addChildElement(parentId, "loop");

  const renderTreeItems = (
    treeItems: QuestionItem[],
    parentId: string | null = null
  ) => {
    let itemsAtLevel: QuestionItem[] = [];

    if (parentId === null) {
      itemsAtLevel = treeItems.filter((item) => !item.parentCode);
    } else {
      const parentItem = flatItems.find((item) => item.code === parentId);
      if (parentItem) {
        itemsAtLevel = parentItem.children || [];
      }
    }

    if (itemsAtLevel.length === 0) {
      if (parentId) {
        const parentItem = flatItems.find((item) => item.code === parentId);
        if (parentItem && canHaveChildren(parentItem.type)) {
          return (
            <DropZone
              id={`${parentItem.code}-dropzone`}
              parentId={parentItem.code}
              isActive={dragOverId === `${parentItem.code}-dropzone`}
            />
          );
        }
      }
      return null;
    }

    return (
      <>
        {itemsAtLevel.map((item) => {
          const isContainerTarget = dragOverId === `${item.code}-container`;
          const isItemTarget = dragOverId === item.code;

          return (
            <React.Fragment key={item.code}>             
              <div className="my-2">
                <DropIndicator
                  isActive={
                    isItemTarget &&
                    dropPosition === "before" &&
                    activeId !== item.code
                  }
                />
              </div>

              <SortableItem
                id={item.code}
                item={item}
                isSelected={selectedItemId === item.code}
                onClick={() => onItemSelect(item)}
                onAddSubQuestion={() => addSubQuestion(item.code)}
                onAddSubBlock={() => addSubBlock(item.code)}
                onAddSubLoop={() => addSubLoop(item.code)}
                canHaveChildren={canHaveChildren(item.type)}
                onDelete={() => handleDeleteItem(item.code)}
                isDragOver={isItemTarget || isContainerTarget}
              />

              {canHaveChildren(item.type) && (
                <div
                  className={clsx(
                    "pl-6 ml-4 border-l transition-all duration-200",
                    {
                      "border-blue-500 bg-blue-50/30 dark:bg-blue-900/10 rounded-l":
                        isItemTarget && dropPosition === "inside",
                      "border-gray-200 dark:border-dark-600":
                        !(isItemTarget && dropPosition === "inside"),
                    }
                  )}
                >
                  {renderTreeItems(treeItems, item.code)}
                </div>
              )}

              <div className="my-2">
                <DropIndicator
                  isActive={
                    isItemTarget &&
                    dropPosition === "after" &&
                    activeId !== item.code
                  }
                />
              </div>
            </React.Fragment>
          );
        })}
      </>
    );
  };

  const rootContainerClasses = clsx(
    "p-4 border rounded-md transition-all duration-200",
    {
      "border-blue-400 bg-blue-50/40 dark:bg-blue-900/10 dark:border-blue-600 shadow-sm":
        dragOverRoot && activeId,
      "border-gray-200 dark:border-dark-600": !(dragOverRoot && activeId),
    }
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b dark:border-dark-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{t("Questions")}</h3>
          <div className="flex space-x-1">
            <button
              onClick={addNewQuestion}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-dark-700"
              title={t("Add Question")}
            >
              <IconPlus className="w-5 h-5" />
            </button>
            <button
              onClick={addNewBlock}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-dark-700"
              title={t("Add Block")}
            >
              <IconLayoutList className="w-5 h-5" />
            </button>
            <button
              onClick={addNewLoop}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-dark-700"
              title={t("Add Loop")}
            >
              <IconRefresh className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-blue-100 border border-blue-300 rounded mr-1"></span>
            <span>{t("Question")}</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-green-100 border border-green-300 rounded mr-1"></span>
            <span>{t("Block")}</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-purple-100 border border-purple-300 rounded mr-1"></span>
            <span>{t("Loop")}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={[
              ...flatItems.map((item) => item.code),
              ...flatItems
                .filter(
                  (item) =>
                    canHaveChildren(item.type) &&
                    (!item.children || item.children.length === 0)
                )
                .map((item) => `${item.code}-dropzone`),
            ]}
            strategy={verticalListSortingStrategy}
          >
            <div className={rootContainerClasses} id="root-container">
              {items.length > 0 ? (
                renderTreeItems(items)
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {t("No questions yet. Click + to add one.")}
                </div>
              )}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeItemRef.current ? (
              <div className="opacity-80 bg-white dark:bg-dark-700 p-2 rounded border shadow-md">
                {activeItemRef.current.label || ""}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default QuestionTree;