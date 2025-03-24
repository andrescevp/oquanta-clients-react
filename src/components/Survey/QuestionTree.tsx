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
import { Transition } from "@headlessui/react";

import { SurveyRequestChildrenInner } from "../../api-generated";
import { cn } from "../../lib/utils";
import { 
  IconLayoutList, 
  IconPlus, 
  IconRefresh} from "../UI/Icons";
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
  onItemSelect: (item: QuestionItem, formPath: string) => void; // Updated to include formPath
  selectedItemId?: string;
}

const flattenTree = (items: QuestionItem[]): QuestionItem[] => {
  const result: QuestionItem[] = [];

  const flatten = (questions: QuestionItem[], parentId: string | null = null) => {
    questions
      .filter((item) => item.parentUniqueId === parentId)
      .forEach((item) => {
        result.push(item);
        if (item.children && item.children.length > 0) {
          flatten(item.children, item.uniqueId);
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
    itemMap.set(item.uniqueId, itemWithoutChildren);
  });

  flatItems.forEach((item) => {
    const current = itemMap.get(item.uniqueId);
    if (!current) return;

    if (item.parentUniqueId && itemMap.has(item.parentUniqueId)) {
      const parent = itemMap.get(item.parentUniqueId);
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
      <div className="h-1 bg-gradient-to-r from-pumpkin-orange to-pumpkin-orange/80 w-full my-1 rounded-full shadow-lg shadow-pumpkin-orange/10" 
           style={{
             animation: isActive ? 'pulse 1.5s infinite ease-in-out' : 'none'
           }}
      />
    </Transition>
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
    const item = items.find(i => i.uniqueId === current);
    if (!item || !item.parentUniqueId) break;
    
    if (item.parentUniqueId === possibleAncestor) return true;
    current = item.parentUniqueId;
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

  // Helper function to generate form path
  const generateFormPath = (item: QuestionItem): string => {
    const path: string[] = [];
    let currentItem = item;
    let currentIndex: number | undefined;
    
    // Build path from bottom up
    while (currentItem) {
      // Find the index of the current item within its parent's children
      if (currentItem.parentUniqueId) {
        const parent = flatItems.find(i => i.uniqueId === currentItem.parentUniqueId);
        if (parent && parent.children) {
          currentIndex = parent.children.findIndex(child => child.uniqueId === currentItem.uniqueId);
          if (currentIndex !== -1) {
            path.unshift(`children.${currentIndex}`);
          }
        }
      } else {
        // Top-level item
        currentIndex = items.findIndex(i => i.uniqueId === currentItem.uniqueId);
        if (currentIndex !== -1) {
          path.unshift(`children.${currentIndex}`);
          break; // We've reached the top level
        }
      }
      
      // Move up to parent
      if (currentItem.parentUniqueId) {
        currentItem = flatItems.find(i => i.uniqueId === currentItem.parentUniqueId) || currentItem;
      } else {
        break;
      }
    }
    
    return path.length ? path.join('.') : 'children';
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
    // Store the active item
    activeItemRef.current = flatItems.find(
      (item) => item.uniqueId === event.active.id
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

    const overItem = flatItems.find((item) => item.uniqueId === overId);

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
      (item) => item.uniqueId === activeSurveyQuestionId
    );

    // Check if attempted drop would create a circular reference
    if (isDescendantOf(parentId, activeSurveyQuestionId, flatItems)) {
      console.warn("Cannot drop an element inside one of its descendants");
      return; // Prevent the invalid operation
    }

    if (activeItemIndex >= 0) {
      const parentItem = flatItems.find((item) => item.uniqueId === parentId);
      if (!parentItem) return;

      const newFlatItems = [...flatItems];
      const movedItem = { ...newFlatItems[activeItemIndex] };

      movedItem.parentUniqueId = parentId;
      movedItem.depth = (parentItem.depth || 0) + 1;
      movedItem.index = 0;

      newFlatItems.splice(activeItemIndex, 1);

      newFlatItems.push(movedItem);

      const childrenToMove = flatItems.filter((item) => {
        let currentParent = item.parentUniqueId;
        while (currentParent) {
          if (currentParent === activeSurveyQuestionId) return true;
          const parent = flatItems.find((p) => p.uniqueId === currentParent);
          currentParent = parent?.parentUniqueId;
        }
        return false;
      });

      childrenToMove.forEach((child) => {
        const childInNewList = newFlatItems.find(
          (item) => item.uniqueId === child.uniqueId
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
      (item) => item.uniqueId === active.id
    );
    const overItemIndex = flatItems.findIndex((item) => item.uniqueId === over.id);

    if (activeItemIndex !== -1 && overItemIndex !== -1) {
      const activeItem = flatItems[activeItemIndex];
      const overItem = flatItems[overItemIndex];

      // Check if we're trying to drop a parent before/after one of its descendants
      // This is an invalid operation that can break the tree structure
      if (finalDropPosition !== "inside") {
        // Check if the target item is a descendant of the active item
        const isTargetDescendant = isDescendantOf(overItem.uniqueId, activeItem.uniqueId, flatItems);
        
        if (isTargetDescendant && overItem.uniqueId !== activeItem.uniqueId) {
          console.warn("Cannot reorder a parent before or after its own descendants");
          return; // Prevent the invalid operation
        }
      }

      // Existing check for dropping inside
      if (finalDropPosition === "inside" && 
          isDescendantOf(overItem.uniqueId, activeItem.uniqueId, flatItems)) {
        console.warn("Cannot drop an element inside itself or its descendants");
        return; // Prevent the invalid operation
      }

      const newFlatItems = [...flatItems];
      newFlatItems.splice(activeItemIndex, 1);

      let newIndex;
      let newParentUniqueId = overItem.parentUniqueId;
      let newDepth = overItem.depth; // Add this line
      console.log("Final drop position:", finalDropPosition);
      switch (finalDropPosition) {
        case "before": {
          newIndex =
            overItemIndex > activeItemIndex ? overItemIndex - 1 : overItemIndex;
          newParentUniqueId = overItem.parentUniqueId; // Set parent to overItem's parent
          newDepth = overItem.depth; // and depth to overItem's depth
          break;
        }
        case "after": {
          newIndex =
            overItemIndex > activeItemIndex ? overItemIndex : overItemIndex + 1;
          newParentUniqueId = overItem.parentUniqueId; // Set parent to overItem's parent
          newDepth = overItem.depth; // and depth to overItem's depth
          break;
        }
        case "inside": {
          newParentUniqueId = overItem.uniqueId;
          newDepth = overItem.depth + 1; // Depth increased by 1
          const lastChildIndex = findLastIndex(
            newFlatItems,
            (item: SurveyRequestChildrenInner) => item.parentUniqueId === overItem.uniqueId
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
        parentUniqueId: newParentUniqueId,
        depth: newDepth, // Use the calculated depth
        parentCode: overItem.code,
        parentIndex: overItem.index,
        parentCodes: overItem.parentCodes
          ? [...overItem.parentCodes, overItem.code]
          : [overItem.code],
          parentIndexes: overItem.parentIndexes
          ? [...overItem.parentIndexes, overItem.index]
          : [overItem.index],
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
      uniqueId: String(Math.floor(Math.random() * Date.now())),
      code: `Q${Math.floor(Math.random() * Date.now())}`,
      type: "string",
      label: t("New Question"),
      index: items.length,
      options: {},
      children: [],
      depth: 0,
      isLast: true,
      parentUniqueId: null,
      parentCode: null,
      parentIndex: null,
      parentCodes: null,
      parentIndexes: null,
    };

    const updatedItems = items.map((item) => ({
      ...item,
      isLast: false,
    }));

    const newItems = [...updatedItems, newQuestion];

    onItemsChange(newItems);
    onItemSelect(newQuestion, 'children');
  };

  const addNewBlock = () => {
    const newBlock: SurveyRequestChildrenInner = {
      uniqueId: String(Math.floor(Math.random() * Date.now())),
      code: `BL${Math.floor(Math.random() * Date.now())}`,
      type: "block",
      label: t("New Block"),
      index: items.length,
      options: {},
      children: [],
      depth: 0,
      isLast: true,
      parentUniqueId: null,
      parentCode: null,
      parentIndex: null,
      parentCodes: null,
      parentIndexes: null,
    };

    const updatedItems = items.map((item) => ({
      ...item,
      isLast: false,
    }));

    const newItems = [...updatedItems, newBlock];

    onItemsChange(newItems);
    onItemSelect(newBlock, 'children');
  };

  const addNewLoop = () => {
    const newLoop: SurveyRequestChildrenInner = {
      uniqueId: String(Math.floor(Math.random() * Date.now())),
      code: `LP${Math.floor(Math.random() * Date.now())}`,
      type: "loop",
      label: t("New Loop"),
      index: items.length,
      options: {},
      children: [],
      depth: 0,
      isLast: true,
      parentUniqueId: null,
      parentCode: null,
      parentIndex: null,
      parentCodes: null,
      parentIndexes: null,
    };

    const updatedItems = items.map((item) => ({
      ...item,
      isLast: false,
    }));

    const newItems = [...updatedItems, newLoop];

    onItemsChange(newItems);
    onItemSelect(newLoop, 'children');
  };

  const addSubQuestion = (parentId: string) => {
    const parent = flatItems.find((item) => item.uniqueId === parentId);
    if (!parent) return;

    if (!canHaveChildren(parent.type)) {
      console.warn(
        `No se pueden añadir subpreguntas a elementos de tipo: ${parent.type}`
      );
      return;
    }

    const newSubQuestion: SurveyRequestChildrenInner = {
      uniqueId: String(Math.floor(Math.random() * Date.now())),
      code: `Q${Math.floor(Math.random() * Date.now())}`,
      type: "string",
      label: t("New Question"),
      index: 0,
      options: {},
      children: [],
      depth: (parent.depth || 0) + 1,
      isLast: true,
      parentUniqueId: parentId,
      parentCode: parent.code,
      parentIndex: parent.index,
      parentCodes: parent.parentCodes
        ? [...parent.parentCodes, parent.code]
        : [parent.code],
        parentIndexes: parent.parentIndexes
        ? [...parent.parentIndexes, parent.index]
        : [parent.index],
    };

    const newFlatItems = [...flatItems, newSubQuestion];

    const newTree = rebuildTree(newFlatItems);

    onItemsChange(newTree);
    onItemSelect(newSubQuestion, generateFormPath(newSubQuestion));
  };

  const handleDeleteItem = (itemCode: string) => {
    const filterItems = (
      treeItems: QuestionItem[],
      codeToRemove: string
    ): QuestionItem[] => {
      return treeItems.filter((item) => {
        if (item.uniqueId === codeToRemove) return false;

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
    const parent = flatItems.find((item) => item.uniqueId === parentId);
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
      parentUniqueId: parentId,
      uniqueId: String(Math.floor(Math.random() * Date.now())),
      parentCode: parent.code,
      parentIndex: parent.index,
      parentCodes: parent.parentCodes
        ? [...parent.parentCodes, parent.code]
        : [parent.code],
        parentIndexes: parent.parentIndexes
        ? [...parent.parentIndexes, parent.index]
        : [parent.index],
    };

    const updateParent = (
      treeItems: QuestionItem[],
      parentIdToUpdate: string,
      newChildToUpdate: QuestionItem
    ): QuestionItem[] => {
      return treeItems.map((item) => {
        if (item.uniqueId === parentIdToUpdate) {
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
    onItemSelect(newChild, generateFormPath(newChild));
  };

  const addSubBlock = (parentId: string) => addChildElement(parentId, "block");
  const addSubLoop = (parentId: string) => addChildElement(parentId, "loop");

  const renderTreeItems = (
    treeItems: QuestionItem[],
    parentId: string | null = null
  ) => {
    let itemsAtLevel: QuestionItem[] = [];

    if (parentId === null) {
      itemsAtLevel = treeItems.filter((item) => !item.parentUniqueId);
    } else {
      const parentItem = flatItems.find((item) => item.uniqueId === parentId);
      if (parentItem) {
        itemsAtLevel = parentItem.children || [];
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
                    dropPosition === "before" &&
                    activeId !== item.uniqueId
                  }
                />
              </div>

              <SortableItem
                id={item.uniqueId}
                item={item}
                isSelected={selectedItemId === item.uniqueId}
                onClick={() => {
                  const formPath = generateFormPath(item);
                  onItemSelect(item, formPath);
                }}
                onAddSubQuestion={() => addSubQuestion(item.uniqueId)}
                onAddSubBlock={() => addSubBlock(item.uniqueId)}
                onAddSubLoop={() => addSubLoop(item.uniqueId)}
                canHaveChildren={canHaveChildren(item.type)}
                onDelete={() => handleDeleteItem(item.uniqueId)}
                isDragOver={isItemTarget || isContainerTarget}
              />

              {canHaveChildren(item.type) && (
                <div
                  className={cn(
                    "pl-6 ml-4 border-l transition-all duration-200",
                    {
                      "border-pumpkin-orange bg-pumpkin-orange/5 dark:bg-pumpkin-orange/10 rounded-l-xl":
                        isItemTarget && dropPosition === "inside",
                      "border-gray-200 dark:border-gray-700":
                        !(isItemTarget && dropPosition === "inside"),
                    }
                  )}
                >
                  {renderTreeItems(treeItems, item.uniqueId)}
                </div>
              )}

              <div className="my-2">
                <DropIndicator
                  isActive={
                    isItemTarget &&
                    dropPosition === "after" &&
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
    "p-1 backdrop-blur-sm rounded-2xl transition-all duration-200",
    {
      "border-pumpkin-orange shadow-xl shadow-pumpkin-orange/10 dark:border-pumpkin-orange/50":
        dragOverRoot && activeId,
    }
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 space-y-2 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t("Questions")}</h3>
        </div>
        <div className="flex space-x-2">
            <button
              onClick={addNewQuestion}
              className="p-2 rounded-xl text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-all duration-200 hover:shadow-md flex items-center"
              title={t("Add Question")}
              aria-label={t("Add Question")}
            >
              <IconPlus className="w-4 h-4 mr-1" />
              <span>{t("Question")}</span>
            </button>
            
            <button
              onClick={addNewBlock}
              className="p-2 rounded-xl text-sm bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30 transition-all duration-200 hover:shadow-md flex items-center"
              title={t("Add Block")}
              aria-label={t("Add Block")}
            >
              <IconLayoutList className="w-4 h-4 mr-1" />
              <span>{t("Block")}</span>
            </button>
            
            <button
              onClick={addNewLoop}
              className="p-2 rounded-xl text-sm bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30 transition-all duration-200 hover:shadow-md flex items-center"
              title={t("Add Loop")}
              aria-label={t("Add Loop")}
            >
              <IconRefresh className="w-4 h-4 mr-1" />
              <span>{t("Loop")}</span>
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
                    (!item.children || item.children.length === 0)
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
                  <p className="text-lg">{t("No questions yet")}</p>
                  <p className="text-sm mt-1">{t("Add a question to get started")}</p>
                </div>
              )}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeItemRef.current ? (
              <div className="opacity-90 bg-gradient-to-r from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-800/70 p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl backdrop-blur-sm">
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