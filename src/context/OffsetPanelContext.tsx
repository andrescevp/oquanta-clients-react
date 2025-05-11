import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Interface for a registered panel
 */
export interface RegisteredPanel {
    id: string;
    isOpen: boolean;
    zIndex: number;
    width?: number;
    position: 'left' | 'right';
    persistState: boolean;
    defaultOpen: boolean;
    onOpen?: () => void;
    onClose?: () => void;
}

/**
 * Panel state used in URL serialization
 */
interface SerializedPanelState {
    id: string;
    w?: number; // width
}

/**
 * Context state interface
 */
interface OffsetPanelContextState {
    panels: RegisteredPanel[];
    baseZIndex: number;
}

/**
 * Actions for the reducer
 */
type OffsetPanelAction =
    | { type: 'REGISTER_PANEL'; payload: Omit<RegisteredPanel, 'isOpen' | 'zIndex'> }
    | { type: 'UNREGISTER_PANEL'; payload: { id: string } }
    | { type: 'OPEN_PANEL'; payload: { id: string } }
    | { type: 'CLOSE_PANEL'; payload: { id: string } }
    | { type: 'SET_PANEL_WIDTH'; payload: { id: string; width: number } };

/**
 * Public context interface
 */
interface OffsetPanelContextValue {
    registerPanel: (
        id: string, 
        position: 'left' | 'right', 
        persistState: boolean, 
        defaultOpen: boolean, 
        onOpen?: () => void, 
        onClose?: () => void
    ) => void;
    unregisterPanel: (id: string) => void;
    openPanel: (id: string) => void;
    closePanel: (id: string) => void;
    setPanelWidth: (id: string, width: number) => void;
    getPanelState: (id: string) => {
        isOpen: boolean;
        zIndex: number;
        width?: number;
        position: 'left' | 'right';
    } | undefined;
    isTopMostPanel: (id: string) => boolean;
    getOpenPanelsCount: () => number;
}

// Initial state
const initialState: OffsetPanelContextState = {
    panels: [],
    baseZIndex: 40,
};

/**
 * The single parameter key for storing all panel states in URL
 */
const PANEL_STATE_PARAM = 'sp';

/**
 * Serializes panel states into a compressed URL string
 * Format: id1:w1;id2:w2 where only open panels are included and w=width (optional)
 */
function serializePanelState(panels: RegisteredPanel[]): string {
    const serializable = panels
        .filter(panel => panel.persistState && panel.isOpen) // Only include open panels
        .map(panel => {
            // Just serialize the ID and width (if exists)
            const parts = [panel.id];
            
            // Only include width if it exists
            if (panel.width) {
                parts.push(panel.width.toString());
            }
            
            return parts.join(':');
        });
    
    return serializable.join(';');
}

/**
 * Deserializes the URL string into panel states
 * All panels in URL are considered open
 */
function deserializePanelState(stateStr: string | null): SerializedPanelState[] {
    if (!stateStr) return [];
    
    try {
        return stateStr.split(';')
            .filter(Boolean)
            .map(panelStr => {
                const [id, width] = panelStr.split(':');
                
                return {
                    id,
                    w: width ? parseInt(width, 10) : undefined
                };
            });
    } catch (err) {
        console.error('Error deserializing panel state:', err);
        return [];
    }
}

/**
 * Reducer to handle state transitions
 */
function offsetPanelReducer(state: OffsetPanelContextState, action: OffsetPanelAction): OffsetPanelContextState {
    switch (action.type) {
        case 'REGISTER_PANEL': {
            const { id, position, persistState, defaultOpen, onOpen, onClose } = action.payload;
            // Avoid duplicates
            if (state.panels.some(panel => panel.id === id)) {
                return state;
            }
            // Register panel (initially closed)
            return {
                ...state,
                panels: [
                    ...state.panels, 
                    { 
                        id, 
                        isOpen: false, 
                        zIndex: state.baseZIndex, 
                        position, 
                        persistState,
                        defaultOpen,
                        onOpen,
                        onClose
                    }
                ],
            };
        }

        case 'UNREGISTER_PANEL': {
            const { id } = action.payload;
            return {
                ...state,
                panels: state.panels.filter(panel => panel.id !== id),
            };
        }

        case 'OPEN_PANEL': {
            const { id } = action.payload;
            // Find highest current z-index
            const highestZIndex = state.panels.reduce(
                (max, panel) => (panel.isOpen && panel.zIndex > max ? panel.zIndex : max),
                state.baseZIndex,
            );

            // Update opened panel with higher z-index
            return {
                ...state,
                panels: state.panels.map(panel =>
                    panel.id === id ? { ...panel, isOpen: true, zIndex: highestZIndex + 1 } : panel,
                ),
            };
        }

        case 'CLOSE_PANEL': {
            const { id } = action.payload;
            return {
                ...state,
                panels: state.panels.map(panel => (panel.id === id ? { ...panel, isOpen: false } : panel)),
            };
        }

        case 'SET_PANEL_WIDTH': {
            const { id, width } = action.payload;
            return {
                ...state,
                panels: state.panels.map(panel => 
                    panel.id === id ? { ...panel, width } : panel
                ),
            };
        }

        default:
            return state;
    }
}

// Create context
const OffsetPanelContext = createContext<OffsetPanelContextValue | null>(null);

/**
 * Hook to access the offset panel context
 */
export function useOffsetPanel() {
    const context = useContext(OffsetPanelContext);
    if (!context) {
        throw new Error('useOffsetPanel must be used within an OffsetPanelProvider');
    }
    return context;
}

/**
 * Provider component for the offset panel context
 */
export const OffsetPanelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(offsetPanelReducer, initialState);
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Load panel states from URL on component mount and searchParams changes
    useEffect(() => {
        const serializedState = searchParams.get(PANEL_STATE_PARAM);
        const urlPanelStates = deserializePanelState(serializedState);
        
        // Apply states from URL to matching panels
        state.panels.forEach(panel => {
            if (panel.persistState) {
                const urlState = urlPanelStates.find(s => s.id === panel.id);
                
                // If panel exists in URL, it should be open
                // Otherwise, use defaultOpen value
                const shouldBeOpen = urlState !== undefined 
                    ? true // Panel in URL means open
                    : panel.defaultOpen;
                
                // Update panel state if needed
                if (shouldBeOpen !== panel.isOpen) {
                    if (shouldBeOpen) {
                        dispatch({ type: 'OPEN_PANEL', payload: { id: panel.id } });
                        
                        // Set width from URL if available
                        if (urlState?.w && panel.width !== urlState.w) {
                            dispatch({ 
                                type: 'SET_PANEL_WIDTH', 
                                payload: { id: panel.id, width: urlState.w } 
                            });
                        }
                        
                        // Call onOpen callback
                        if (panel.onOpen) {
                            panel.onOpen();
                        }
                    }
                } else if (urlState?.w && panel.width !== urlState.w) {
                    // Update width if different
                    dispatch({ 
                        type: 'SET_PANEL_WIDTH', 
                        payload: { id: panel.id, width: urlState.w } 
                    });
                }
            }
        });
    }, [searchParams]);

    // Sync state changes to URL - only include open panels
    useEffect(() => {
        // Only consider panels that are open and have persistState enabled
        const openPersistablePanels = state.panels.filter(
            panel => panel.persistState && panel.isOpen
        );
        
        const serializedState = serializePanelState(openPersistablePanels);
        const currentSerializedState = searchParams.get(PANEL_STATE_PARAM);
        
        // Only update URL if state has changed
        if (serializedState !== currentSerializedState) {
            const newParams = new URLSearchParams(searchParams);
            
            if (serializedState === '') {
                newParams.delete(PANEL_STATE_PARAM);
            } else {
                newParams.set(PANEL_STATE_PARAM, serializedState);
            }
            
            setSearchParams(newParams, { replace: true });
        }
    }, [state.panels, searchParams, setSearchParams]);

    /**
     * Register a new panel
     */
    const registerPanel = useCallback((
        id: string, 
        position: 'left' | 'right' = 'right', 
        persistState = true, 
        defaultOpen = false,
        onOpen?: () => void,
        onClose?: () => void
    ) => {
        dispatch({ 
            type: 'REGISTER_PANEL', 
            payload: { id, position, persistState, defaultOpen, onOpen, onClose } 
        });
        
        // Check URL for initial state
        if (persistState) {
            const serializedState = searchParams.get(PANEL_STATE_PARAM);
            const urlPanelStates = deserializePanelState(serializedState);
            const urlState = urlPanelStates.find(s => s.id === id);
            
            // Panel exists in URL means it should be open
            const shouldBeOpen = urlState !== undefined ? true : defaultOpen;
                
            if (shouldBeOpen) {
                dispatch({ type: 'OPEN_PANEL', payload: { id } });
                
                // Set width from URL if available
                if (urlState?.w) {
                    dispatch({ 
                        type: 'SET_PANEL_WIDTH', 
                        payload: { id, width: urlState.w } 
                    });
                }
            }
        } else if (defaultOpen) {
            // If not persisting but defaultOpen is true
            dispatch({ type: 'OPEN_PANEL', payload: { id } });
        }
    }, [searchParams]);

    /**
     * Unregister a panel
     */
    const unregisterPanel = useCallback((id: string) => {
        const panel = state.panels.find(p => p.id === id);
        
        if (panel?.persistState && panel.isOpen) {
            // Remove panel from URL state if it's open
            const serializedState = searchParams.get(PANEL_STATE_PARAM);
            const urlPanelStates = deserializePanelState(serializedState);
            const filteredStates = urlPanelStates.filter(s => s.id !== id);
            
            const newParams = new URLSearchParams(searchParams);
            
            if (filteredStates.length === 0) {
                newParams.delete(PANEL_STATE_PARAM);
            } else {
                // Create a new serialized state without this panel
                const openPersistablePanels = state.panels
                    .filter(p => p.persistState && p.isOpen && p.id !== id);
                
                const newSerializedState = serializePanelState(openPersistablePanels);
                
                if (newSerializedState) {
                    newParams.set(PANEL_STATE_PARAM, newSerializedState);
                } else {
                    newParams.delete(PANEL_STATE_PARAM);
                }
            }
            
            setSearchParams(newParams, { replace: true });
        }
        
        dispatch({ type: 'UNREGISTER_PANEL', payload: { id } });
    }, [state.panels, searchParams, setSearchParams]);

    /**
     * Open a panel
     */
    const openPanel = useCallback((id: string) => {
        const panel = state.panels.find(p => p.id === id);
        if (panel) {
            dispatch({ type: 'OPEN_PANEL', payload: { id } });
            
            // Execute onOpen callback
            if (panel.onOpen) {
                panel.onOpen();
            }
        }
    }, [state.panels]);

    /**
     * Close a panel
     */
    const closePanel = useCallback((id: string) => {
        const panel = state.panels.find(p => p.id === id);
        if (panel) {
            dispatch({ type: 'CLOSE_PANEL', payload: { id } });
            
            // Execute onClose callback
            if (panel.onClose) {
                panel.onClose();
            }
        }
    }, [state.panels]);

    /**
     * Set panel width
     */
    const setPanelWidth = useCallback((id: string, width: number) => {
        dispatch({ type: 'SET_PANEL_WIDTH', payload: { id, width } });
    }, []);

    /**
     * Get panel state
     */
    const getPanelState = useCallback(
        (id: string) => {
            const panel = state.panels.find(p => p.id === id);
            if (!panel) return undefined;
            
            return {
                isOpen: panel.isOpen,
                zIndex: panel.zIndex,
                width: panel.width,
                position: panel.position
            };
        },
        [state.panels]
    );

    /**
     * Check if panel is the topmost one
     */
    const isTopMostPanel = useCallback(
        (id: string) => {
            const openPanels = state.panels.filter(p => p.isOpen);
            if (openPanels.length === 0) return false;

            const maxZIndex = Math.max(...openPanels.map(p => p.zIndex));
            const panel = state.panels.find(p => p.id === id);

            return !!panel && panel.isOpen && panel.zIndex === maxZIndex;
        },
        [state.panels],
    );

    /**
     * Get count of open panels
     */
    const getOpenPanelsCount = useCallback(() => {
        return state.panels.filter(p => p.isOpen).length;
    }, [state.panels]);

    // Context value
    const value: OffsetPanelContextValue = {
        registerPanel,
        unregisterPanel,
        openPanel,
        closePanel,
        setPanelWidth,
        getPanelState,
        isTopMostPanel,
        getOpenPanelsCount,
    };

    return <OffsetPanelContext.Provider value={value}>{children}</OffsetPanelContext.Provider>;
};