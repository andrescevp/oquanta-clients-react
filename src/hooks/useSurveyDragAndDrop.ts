import { useRef,useState } from 'react';

import {
  DragEndEvent,
  DragOverEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { QuestionItem } from './useSurveyTreeManager';
import { canHaveChildren } from './useSurveyTreeManager';

interface UseSurveyDragAndDropOptions {
  flatItems: QuestionItem[];
  handleDropOnDropzone: (activeSurveyQuestionId: string, parentId: string) => void;
  handleDropOnItem: (
    activeSurveyQuestionId: string,
    overId: string,
    dropPosition: 'before' | 'after' | 'inside',
  ) => void;
}

export const useSurveyDragAndDrop = ({
  flatItems,
  handleDropOnDropzone,
  handleDropOnItem,
}: UseSurveyDragAndDropOptions) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [dragOverRoot, setDragOverRoot] = useState<boolean>(false);
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | 'inside' | null>(null);
  
  // Ref to store the active item for DragOverlay
  const activeItemRef = useRef<QuestionItem | null>(null);

  // Initialize sensors for keyboard and pointer events
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  /**
   * Handles the start of a drag operation
   * @param event The drag start event
   */
  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
    // Store the active item for later use in the drag overlay
    activeItemRef.current = flatItems.find((item) => item.uniqueId === event.active.id) || null;
  };

  /**
   * Handles the drag over event to determine drop position
   * @param event The drag over event
   */
  // eslint-disable-next-line complexity
  const handleDragOver = (event: DragOverEvent) => {
    const { over, active } = event;

    // Check if we're over the root container
    const isOverRoot = !over || over.id === 'root-container';
    setDragOverRoot(isOverRoot);

    if (!over) {
      setDragOverId(null);
      setDropPosition(null);
      return;
    }

    const overId = String(over.id);

    // Skip if we're over our own dropzone
    if (overId.includes('-dropzone') && overId === `${active.id}-dropzone`) {
      setDragOverId(null);
      setDropPosition(null);
      return;
    }

    // Handle dropzone targeting
    if (overId.includes('-dropzone')) {
      setDragOverId(overId);
      setDropPosition('inside');
      return;
    }

    // Calculate vertical position within the item to determine drop position
    const overRect = over.rect;
    const overCenter = overRect.top + overRect.height / 2;
    const cursorY = event.delta.y ?? 0;
    const isInUpperHalf = cursorY < overCenter;

    const overItem = flatItems.find((item) => item.uniqueId === overId);

    if (overItem) {
      setDragOverId(overId);
      // For container types (blocks, loops), allow dropping inside when hovering lower half
      if (canHaveChildren(overItem.type) && !isInUpperHalf) {
        setDropPosition('inside');
      } else {
        // Otherwise, determine if it should be before or after
        setDropPosition(isInUpperHalf ? 'before' : 'after');
      }
    } else {
      setDragOverId(overId);
      setDropPosition(null);
    }
  };

  /**
   * Handles the end of a drag operation
   * @param event The drag end event
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Store final values before resetting state
    const finalDropPosition = dropPosition;

    // Reset all states
    setActiveId(null);
    setDragOverId(null);
    setDropPosition(null);

    if (!over || !active) return;

    const activeSurveyQuestionId = String(active.id);
    const overId = String(over.id);

    // Handle dropping on a dropzone (container)
    if (overId.includes('-dropzone')) {
      const parentId = overId.split('-dropzone')[0];
      handleDropOnDropzone(activeSurveyQuestionId, parentId);
    } 
    // Handle dropping on a regular item
    else if (over && active.id !== over.id && finalDropPosition) {
      handleDropOnItem(activeSurveyQuestionId, overId, finalDropPosition);
    }

    // Reset active item ref after drag operation is complete
    activeItemRef.current = null;
  };

  return {
    activeId,
    dragOverId,
    dragOverRoot,
    dropPosition,
    activeItemRef,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};