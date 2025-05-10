import { useMemo } from 'react';

import { SurveyRequestChildrenInner } from '../api-generated';

export type QuestionItem = SurveyRequestChildrenInner;

const CONTAINER_TYPES = ['block', 'loop'];

export const canHaveChildren = (type: string | undefined): boolean => {
  return !!type && CONTAINER_TYPES.includes(type);
};

export interface UseSurveyTreeManagerOptions {
  items: QuestionItem[];
  onItemsChange: (items: QuestionItem[]) => void;
  onItemSelect?: (item: QuestionItem, formPath: string) => void;
}

const flattenTree = (items: QuestionItem[]): QuestionItem[] => {
  const result: QuestionItem[] = [];

  const flatten = (questions: QuestionItem[], parentId: string | null = null) => {
    questions
      .filter((item) => item.parentUniqueId === parentId)
      .forEach((item) => {
        result.push(item);
        if (item.children && item.children.length > 0) {
          flatten(item.children as QuestionItem[], item.uniqueId);
        }
      });
  };

  flatten(items);
  return result;
};

const rebuildTree = (flatItems: QuestionItem[]): QuestionItem[] => {
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
        if (!parent.children) {
          parent.children = [];
        }

        parent.children.push(current);

        parent.children.forEach((child, idx) => {
          child.index = idx;
          child.isLast = idx === (parent.children ? parent.children.length - 1 : 0);
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

// Helper function to check if an item is a descendant of another
const isDescendantOf = (
  possibleDescendant: string,
  possibleAncestor: string,
  items: QuestionItem[],
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

// Polyfill for findLastIndex
const findLastIndex = (
  arr: QuestionItem[],
  predicate: (item: QuestionItem) => boolean,
): number => {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i])) {
      return i;
    }
  }
  return -1;
};

// Generate form path for an item
const generateFormPath = (item: QuestionItem, flatItems: QuestionItem[], items: QuestionItem[]): string => {
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
      } else {
        path.unshift(`children.${item.index}`);
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

interface UseSurveyTreeManagerReturn {
  flatItems: QuestionItem[];
  addNewQuestion: () => { newItem: QuestionItem; formPath: string };
  addNewBlock: () => { newItem: QuestionItem; formPath: string };
  addNewLoop: () => { newItem: QuestionItem; formPath: string };
  addSubQuestion: (parentId: string) => { newItem: QuestionItem | null; formPath: string };
  addSubBlock: (parentId: string) => { newItem: QuestionItem | null; formPath: string };
  addSubLoop: (parentId: string) => { newItem: QuestionItem | null; formPath: string };
  handleDeleteItem: (itemCode: string) => void;
  handleDropOnDropzone: (activeSurveyQuestionId: string, parentId: string) => void;
  handleDropOnItem: (activeId: string, overId: string, dropPosition: 'before' | 'after' | 'inside') => void;
  getFormPath: (item: QuestionItem) => string;
  isDescendantOf: (
    possibleDescendant: string,
    possibleAncestor: string,
    flatItems: QuestionItem[],
  ) => boolean;
  handleSelectItem: (item: QuestionItem) => void;
}

export const useSurveyTreeManager = ({ items, onItemsChange, onItemSelect }: UseSurveyTreeManagerOptions): UseSurveyTreeManagerReturn => {
  const flatItems = useMemo(() => flattenTree(items), [items]);

  const addNewQuestion = () => {
    const newQuestion: QuestionItem = {
      uniqueId: String(Math.floor(Math.random() * Date.now())),
      code: `Q${Math.floor(Math.random() * Date.now())}`,
      type: 'open_end',
      label: 'New Question',
      index: items.length,
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
    return { newItem: newQuestion, formPath: generateFormPath(newQuestion, flatItems, items) };
  };

  const addNewBlock = () => {
    const newBlock: QuestionItem = {
      uniqueId: String(Math.floor(Math.random() * Date.now())),
      code: `BL${Math.floor(Math.random() * Date.now())}`,
      type: 'block',
      label: 'New Block',
      index: items.length,
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
    return { newItem: newBlock, formPath: generateFormPath(newBlock, flatItems, items) };
  };

  const addNewLoop = () => {
    const newLoop: QuestionItem = {
      uniqueId: String(Math.floor(Math.random() * Date.now())),
      code: `LP${Math.floor(Math.random() * Date.now())}`,
      type: 'loop',
      label: 'New Loop',
      index: items.length,
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
    return { newItem: newLoop, formPath: generateFormPath(newLoop, flatItems, items) };
  };

  const addSubQuestion = (parentId: string) => {
    const parent = flatItems.find((item) => item.uniqueId === parentId);
    if (!parent) return { newItem: null, formPath: '' };

    if (!canHaveChildren(parent.type)) {
      console.warn(`Cannot add sub-questions to elements of type: ${parent.type}`);
      return { newItem: null, formPath: '' };
    }

    const newSubQuestion: QuestionItem = {
      uniqueId: String(Math.floor(Math.random() * Date.now())),
      code: `Q${Math.floor(Math.random() * Date.now())}`,
      type: 'open_end',
      label: 'New Question',
      index: 0,
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
    return {
      newItem: newSubQuestion,
      formPath: generateFormPath(newSubQuestion, newFlatItems, newTree)
    };
  };

  const handleDeleteItem = (itemCode: string) => {
    const filterItems = (
      treeItems: QuestionItem[],
      codeToRemove: string,
    ): QuestionItem[] => {
      return treeItems.filter((item) => {
        if (item.uniqueId === codeToRemove) return false;

        if (item.children && item.children.length > 0) {
          item.children = filterItems(item.children as QuestionItem[], codeToRemove);
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
    if (!parent) return { newItem: null, formPath: '' };

    if (!canHaveChildren(parent.type)) {
      console.warn(`Cannot add child elements to elements of type: ${parent.type}`);
      return { newItem: null, formPath: '' };
    }

    let code: string;
    let label: string;

    switch (type) {
      case 'block':
        code = `BL${Math.floor(Math.random() * Date.now())}`;
        label = 'New Block';
        break;
      case 'loop':
        code = `LP${Math.floor(Math.random() * Date.now())}`;
        label = 'New Loop';
        break;
      default:
        code = `Q${Math.floor(Math.random() * Date.now())}`;
        label = 'New Question';
    }

    const newChild: QuestionItem = {
      code,
      type,
      label,
      index: parent.children?.length || 0,
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
      newChildToUpdate: QuestionItem,
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
              item.children as QuestionItem[],
              parentIdToUpdate,
              newChildToUpdate,
            ),
          };
        }
        return item;
      });
    };

    const updatedItems = updateParent(items, parentId, newChild);

    onItemsChange(updatedItems);
    return {
      newItem: newChild,
      formPath: generateFormPath(newChild, [...flatItems, newChild], updatedItems)
    };
  };

  const handleDropOnDropzone = (activeSurveyQuestionId: string, parentId: string) => {
    const activeItemIndex = flatItems.findIndex(
      (item) => item.uniqueId === activeSurveyQuestionId,
    );

    // Check if attempted drop would create a circular reference
    if (isDescendantOf(parentId, activeSurveyQuestionId, flatItems)) {
      console.warn('Cannot drop an element inside one of its descendants');
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
      movedItem.parentCode = parentItem.code;
      movedItem.parentIndex = parentItem.index;
      movedItem.parentCodes = parentItem.parentCodes
        ? [...parentItem.parentCodes, parentItem.code]
        : [parentItem.code];
      movedItem.parentIndexes = parentItem.parentIndexes
        ? [...parentItem.parentIndexes, parentItem.index]
        : [parentItem.index];

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
          (item) => item.uniqueId === child.uniqueId,
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
    activeId: string,
    overId: string,
    dropPosition: 'before' | 'after' | 'inside',
  ) => {
    const activeItemIndex = flatItems.findIndex(
      (item) => item.uniqueId === activeId,
    );
    const overItemIndex = flatItems.findIndex((item) => item.uniqueId === overId);

    if (activeItemIndex !== -1 && overItemIndex !== -1) {
      const activeItem = flatItems[activeItemIndex];
      const overItem = flatItems[overItemIndex];

      // Check if we're trying to drop a parent before/after one of its descendants
      if (dropPosition !== 'inside') {
        // Check if the target item is a descendant of the active item
        const isTargetDescendant = isDescendantOf(overItem.uniqueId, activeItem.uniqueId, flatItems);

        if (isTargetDescendant && overItem.uniqueId !== activeItem.uniqueId) {
          console.warn('Cannot reorder a parent before or after its own descendants');
          return; // Prevent the invalid operation
        }
      }

      // Existing check for dropping inside
      if (dropPosition === 'inside' &&
        isDescendantOf(overItem.uniqueId, activeItem.uniqueId, flatItems)) {
        console.warn('Cannot drop an element inside itself or its descendants');
        return; // Prevent the invalid operation
      }

      const newFlatItems = [...flatItems];
      newFlatItems.splice(activeItemIndex, 1);

      let newIndex;
      let newParentUniqueId = overItem.parentUniqueId;
      let newDepth = overItem.depth;
      let parentCode = null;
      let parentIndex = null;
      let parentCodes = null;
      let parentIndexes = null;
      
      switch (dropPosition) {
        case 'before': {
          newIndex =
            overItemIndex > activeItemIndex ? overItemIndex - 1 : overItemIndex;
          newParentUniqueId = overItem.parentUniqueId;
          newDepth = overItem.depth;
          parentCode = overItem.parentCode;
          parentIndex = overItem.parentIndex;
          parentCodes = overItem.parentCodes;
          parentIndexes = overItem.parentIndexes;
          break;
        }
        case 'after': {
          newIndex =
            overItemIndex > activeItemIndex ? overItemIndex : overItemIndex + 1;
          newParentUniqueId = overItem.parentUniqueId;
          newDepth = overItem.depth;
          parentCode = overItem.parentCode;
          parentIndex = overItem.parentIndex;
          parentCodes = overItem.parentCodes;
          parentIndexes = overItem.parentIndexes;
          break;
        }
        case 'inside': {
          newParentUniqueId = overItem.uniqueId;
          newDepth = overItem.depth + 1;
          const lastChildIndex = findLastIndex(
            newFlatItems,
            (item: QuestionItem) => item.parentUniqueId === overItem.uniqueId,
          );
          newIndex =
            lastChildIndex !== -1 ? lastChildIndex + 1 : newFlatItems.length;
          parentCode = overItem.code;
          parentIndex = overItem.index;
          parentCodes = overItem.parentCodes
            ? [...overItem.parentCodes, overItem.code]
            : [overItem.code];
          parentIndexes = overItem.parentIndexes
            ? [...overItem.parentIndexes, overItem.index]
            : [overItem.index];
          break;
        }
      }

      const movedItem = {
        ...activeItem,
        parentUniqueId: newParentUniqueId,
        depth: newDepth,
        index: newIndex,
        parentCode,
        parentIndex,
        parentCodes,
        parentIndexes,
      };

      newFlatItems.splice(newIndex, 0, movedItem);

      const newTree = rebuildTree(newFlatItems);
      onItemsChange(newTree);
    }
  };

  const addSubBlock = (parentId: string) => addChildElement(parentId, 'block');
  const addSubLoop = (parentId: string) => addChildElement(parentId, 'loop');

  const getFormPath = (item: QuestionItem) => generateFormPath(item, flatItems, items);

  const handleSelectItem = (item: QuestionItem) => {
          const formPath = getFormPath(item);
          onItemSelect && onItemSelect(item, formPath);
      };

  return {
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
    getFormPath,
    isDescendantOf,
    handleSelectItem
  };
};