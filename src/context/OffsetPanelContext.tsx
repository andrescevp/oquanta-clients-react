import React, { createContext, useCallback, useContext, useReducer } from 'react';

// Tipo para un panel registrado
export interface RegisteredPanel {
    id: string;
    isOpen: boolean;
    zIndex: number;
}

// Estado del contexto
interface OffsetPanelContextState {
    panels: RegisteredPanel[];
    baseZIndex: number;
}

// Acciones del reducer
type OffsetPanelAction =
    | { type: 'REGISTER_PANEL'; payload: { id: string } }
    | { type: 'UNREGISTER_PANEL'; payload: { id: string } }
    | { type: 'OPEN_PANEL'; payload: { id: string } }
    | { type: 'CLOSE_PANEL'; payload: { id: string } };

// Interfaz del contexto
interface OffsetPanelContextValue {
    registerPanel: (id: string) => void;
    unregisterPanel: (id: string) => void;
    openPanel: (id: string) => void;
    closePanel: (id: string) => void;
    getPanelZIndex: (id: string) => number;
    isTopMostPanel: (id: string) => boolean;
    getOpenPanelsCount: () => number;
}

// Estado inicial
const initialState: OffsetPanelContextState = {
    panels: [],
    baseZIndex: 40, // Base z-index para los paneles (coincide con el valor en el componente original)
};

// Reducer para manejar el estado
function offsetPanelReducer(state: OffsetPanelContextState, action: OffsetPanelAction): OffsetPanelContextState {
    switch (action.type) {
        case 'REGISTER_PANEL': {
            const { id } = action.payload;
            // Evitar duplicados
            if (state.panels.some(panel => panel.id === id)) {
                return state;
            }
            // Registrar el panel (inicialmente cerrado)
            return {
                ...state,
                panels: [...state.panels, { id, isOpen: false, zIndex: state.baseZIndex }],
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
            // Encontrar el índice más alto actual
            const highestZIndex = state.panels.reduce(
                (max, panel) => (panel.isOpen && panel.zIndex > max ? panel.zIndex : max),
                state.baseZIndex,
            );

            // Actualizar el panel abierto con un z-index más alto
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

        default:
            return state;
    }
}

// Crear el contexto
const OffsetPanelContext = createContext<OffsetPanelContextValue | null>(null);

// Hook personalizado para usar el contexto
export function useOffsetPanel() {
    const context = useContext(OffsetPanelContext);
    if (!context) {
        throw new Error('useOffsetPanel debe usarse dentro de un OffsetPanelProvider');
    }
    return context;
}

// Proveedor del contexto
export const OffsetPanelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(offsetPanelReducer, initialState);

    // Registrar un nuevo panel
    const registerPanel = useCallback((id: string) => {
        dispatch({ type: 'REGISTER_PANEL', payload: { id } });
    }, []);

    // Eliminar un panel del registro
    const unregisterPanel = useCallback((id: string) => {
        dispatch({ type: 'UNREGISTER_PANEL', payload: { id } });
    }, []);

    // Abrir un panel
    const openPanel = useCallback((id: string) => {
        dispatch({ type: 'OPEN_PANEL', payload: { id } });
    }, []);

    // Cerrar un panel
    const closePanel = useCallback((id: string) => {
        dispatch({ type: 'CLOSE_PANEL', payload: { id } });
    }, []);

    // Obtener el z-index de un panel
    const getPanelZIndex = useCallback(
        (id: string) => {
            const panel = state.panels.find(p => p.id === id);
            return panel ? panel.zIndex : state.baseZIndex;
        },
        [state.panels, state.baseZIndex],
    );

    // Comprobar si un panel es el que está más arriba en la pila
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

    // Obtener el número de paneles abiertos
    const getOpenPanelsCount = useCallback(() => {
        return state.panels.filter(p => p.isOpen).length;
    }, [state.panels]);

    // Valor del contexto
    const value: OffsetPanelContextValue = {
        registerPanel,
        unregisterPanel,
        openPanel,
        closePanel,
        getPanelZIndex,
        isTopMostPanel,
        getOpenPanelsCount,
    };

    return <OffsetPanelContext.Provider value={value}>{children}</OffsetPanelContext.Provider>;
};
