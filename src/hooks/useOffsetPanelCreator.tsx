import React, { useCallback, useRef, useState } from 'react';

import { nanoid } from 'nanoid';

import { OffsetPanel } from '../components/UI/organisms/OffsetPanel';
import { useOffsetPanel } from '../context/OffsetPanelContext';

/**
 * Props for dynamic panel creation
 * Extends from the original OffsetPanel props but makes children optional
 */
export interface DynamicPanelOptions {
  /**
   * Initial content for the panel
   */
  children?: React.ReactNode;
  position?: 'left' | 'right';
  title?: string;
  className?: string;
  buttonText?: string;
  buttonIcon?: React.ElementType;
  buttonClassName?: string;
  buttonPosition?: 'fixed' | 'inline';
  buttonIconClassName?: string;
  /**
   * Unique identifier for this panel in URL params
   * If not provided, a random ID will be generated
   */
  panelId?: string;
  /**
   * Whether to persist panel state in URL
   * @default true
   */
  persistState?: boolean;
  /**
   * Default state when no URL parameter exists
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * Callback function executed when panel opens
   */
  onOpen?: () => void;
  /**
   * Callback function executed when panel closes
   */
  onClose?: () => void;
  /**
   * Whether to lazily load panel content
   * @default true
   */
  lazy?: boolean;
}

/**
 * Return type for the useOffsetPanelCreator hook
 */
export interface DynamicPanelControls {
  /**
   * The panel ID (generated or provided)
   */
  panelId: string;
  /**
   * Setter for panel content
   */
  setContent: (content: React.ReactNode) => void;
  /**
   * Setter for panel title
   */
  setTitle: (title: string) => void;
  /**
   * Setter for panel position
   */
  setPosition: (position: 'left' | 'right') => void;
  /**
   * Setter for panel className
   */
  setClassName: (className: string) => void;
  /**
   * Setter for panel button text
   */
  setButtonText: (text: string) => void;
  /**
   * Setter for panel button icon
   */
  setButtonIcon: (icon: React.ElementType) => void;
  /**
   * Setter for panel button className
   */
  setButtonClassName: (className: string) => void;
  /**
   * Setter for panel button position
   */
  setButtonPosition: (position: 'fixed' | 'inline') => void;
  /**
   * Setter for panel button icon className
   */
  setButtonIconClassName: (className: string) => void;
  /**
   * Setter for panel persistence state
   */
  setPersistState: (persist: boolean) => void;
  /**
   * Setter for panel open state handler
   */
  setOnOpen: (handler: (() => void) | undefined) => void;
  /**
   * Setter for panel close state handler
   */
  setOnClose: (handler: (() => void) | undefined) => void;
  /**
   * Setter for panel lazy loading
   */
  setLazy: (lazy: boolean) => void;
  /**
   * Method to open the panel
   */
  openPanel: () => void;
  /**
   * Method to close the panel
   */
  closePanel: () => void;
  /**
   * Render method for panel button
   */
  renderPanelButton: () => JSX.Element | null;
  /**
   * Render method for the panel itself
   */
  renderPanel: () => JSX.Element;
  /**
   * Check if the panel is currently open
   */
  isOpen: boolean;
}

/**
 * Hook for creating and controlling dynamic offset panels
 */
export const useOffsetPanelCreator = (options: DynamicPanelOptions = {}): DynamicPanelControls => {
  // Generate a stable panelId if not provided
  const stableIdRef = useRef<string>(options.panelId || `panel-${nanoid(6)}`);
  const panelId = stableIdRef.current;
  
  const { openPanel: contextOpenPanel, closePanel: contextClosePanel, getPanelState } = useOffsetPanel();
  
  // Panel state
  const [content, setContent] = useState<React.ReactNode>(options.children);
  const [title, setTitle] = useState<string | undefined>(options.title);
  const [position, setPosition] = useState<'left' | 'right'>(options.position || 'right');
  const [className, setClassName] = useState<string | undefined>(options.className);
  const [buttonText, setButtonText] = useState<string | undefined>(options.buttonText);
  const [buttonIcon, setButtonIcon] = useState<React.ElementType | undefined>(options.buttonIcon);
  const [buttonClassName, setButtonClassName] = useState<string | undefined>(options.buttonClassName);
  const [buttonPosition, setButtonPosition] = useState<'fixed' | 'inline'>(options.buttonPosition || 'inline');
  const [buttonIconClassName, setButtonIconClassName] = useState<string | undefined>(options.buttonIconClassName);
  const [persistState, setPersistState] = useState<boolean>(options.persistState !== false);
  const [onOpen, setOnOpen] = useState<(() => void) | undefined>(options.onOpen);
  const [onClose, setOnClose] = useState<(() => void) | undefined>(options.onClose);
  const [lazy, setLazy] = useState<boolean>(options.lazy !== false);
  
  // Get panel open state from context
  const panelState = getPanelState(panelId);
  const isOpen = !!panelState?.isOpen;

  // Methods for controlling the panel
  const openPanel = useCallback(() => contextOpenPanel(panelId), [contextOpenPanel, panelId]);
  const closePanel = useCallback(() => contextClosePanel(panelId), [contextClosePanel, panelId]);
  
  // Render methods
  const renderPanelButton = useCallback(() => (
    <OffsetPanel
      panelId={panelId}
      position={position}
      title={title}
      className={className}
      buttonText={buttonText}
      buttonIcon={buttonIcon}
      buttonClassName={buttonClassName}
      buttonPosition={buttonPosition}
      buttonIconClassName={buttonIconClassName}
      persistState={persistState}
      defaultOpen={options.defaultOpen}
      onOpen={onOpen}
      onClose={onClose}
      lazy={lazy}>
      {content}
    </OffsetPanel>
  ), [
    panelId, position, title, className, buttonText, buttonIcon,
    buttonClassName, buttonPosition, buttonIconClassName, persistState,
    options.defaultOpen, onOpen, onClose, lazy, content
  ]);
  
  const renderPanel = useCallback(() => (
    <OffsetPanel
      panelId={panelId}
      position={position}
      title={title}
      className={className}
      buttonText={buttonText}
      buttonIcon={buttonIcon}
      buttonClassName={buttonClassName}
      buttonPosition={buttonPosition}
      buttonIconClassName={buttonIconClassName}
      persistState={persistState}
      defaultOpen={options.defaultOpen}
      onOpen={onOpen}
      onClose={onClose}
      showButton={false}
      lazy={lazy}>
      {content}
    </OffsetPanel>
  ), [
    panelId, position, title, className, buttonText, buttonIcon,
    buttonClassName, buttonPosition, buttonIconClassName, persistState,
    options.defaultOpen, onOpen, onClose, lazy, content
  ]);

  return {
    panelId,
    setContent,
    setTitle,
    setPosition,
    setClassName,
    setButtonText,
    setButtonIcon,
    setButtonClassName,
    setButtonPosition,
    setButtonIconClassName,
    setPersistState,
    setOnOpen,
    setOnClose,
    setLazy,
    openPanel,
    closePanel,
    renderPanelButton,
    renderPanel,
    isOpen
  };
};

export default useOffsetPanelCreator;