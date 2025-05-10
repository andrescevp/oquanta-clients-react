import { createTheme } from 'react-data-table-component';

/**
 * Custom theme configuration for React Data Table components
 * Following oQuanta design system guidelines for both light and dark modes
 */

// Define the base styles that will be used in the theme
const baseStyles = {
    headRow: {
        style: {
            backgroundColor: 'var(--dt-head-bg)',
            borderBottomWidth: '1px',
            borderBottomColor: 'var(--dt-border-color)',
            borderBottomStyle: 'solid',
            color: 'var(--dt-head-color)',
            fontWeight: 600,
            fontSize: '0.875rem',
            minHeight: '3rem',
            paddingLeft: '1rem',
            paddingRight: '1rem',
        },
    },
    headCells: {
        style: {
            paddingLeft: '1rem',
            paddingRight: '1rem',
            letterSpacing: '0.025em',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
        },
        activeSortStyle: {
            color: 'var(--dt-sort-active-color)',
            '&:focus': {
                outline: 'none',
            },
        },
        inactiveSortStyle: {
            '&:focus': {
                outline: 'none',
            },
            '&:hover': {
                color: 'var(--dt-sort-hover-color)',
            },
        },
    },
    rows: {
        style: {
            minHeight: '3.25rem',
            fontSize: '0.875rem',
            backgroundColor: 'var(--dt-row-bg)',
            borderBottomStyle: 'solid',
            borderBottomWidth: '1px',
            borderBottomColor: 'var(--dt-border-color)',
            color: 'var(--dt-row-color)',
            paddingLeft: '1rem',
            paddingRight: '1rem',
            fontWeight: 400,
            '&:hover': {
                backgroundColor: 'var(--dt-row-hover-bg)',
                transform: 'translateY(-1px)',
                transition: 'all 0.2s ease-in-out',
            },
            '&:last-of-type': {
                borderBottomWidth: '0',
            },
        },
        stripedStyle: {
            backgroundColor: 'var(--dt-row-stripe-bg)',
        },
        highlightOnHoverStyle: {
            backgroundColor: 'var(--dt-row-hover-bg)',
            transitionDuration: '200ms',
            transition: 'all ease-in-out',
            transform: 'translateY(-2px)',
            boxShadow: 'var(--dt-row-hover-shadow)',
            cursor: 'pointer',
        },
        selectedHighlightStyle: {
            backgroundColor: 'var(--dt-row-selected-bg)',
            color: 'var(--dt-row-selected-color)',
            fontWeight: 500,
            borderLeftWidth: '3px',
            borderLeftColor: 'var(--dt-primary-color)',
            borderLeftStyle: 'solid',
        },
    },
    cells: {
        style: {
            paddingLeft: '1rem',
            paddingRight: '1rem',
            paddingTop: '0.75rem',
            paddingBottom: '0.75rem',
        },
    },
    pagination: {
        style: {
            backgroundColor: 'var(--dt-pagination-bg)',
            color: 'var(--dt-pagination-color)',
            fontSize: '0.875rem',
            minHeight: '3.5rem',
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            borderTopColor: 'var(--dt-border-color)',
            borderRadius: '0 0 1rem 1rem',
            boxShadow: '0 -2px 5px var(--dt-pagination-shadow)',
        },
        pageButtonsStyle: {
            color: 'var(--dt-pagination-button-color)',
            fill: 'var(--dt-pagination-button-color)',
            backgroundColor: 'var(--dt-pagination-button-bg)',
            borderRadius: '0.75rem',
            transition: 'all 0.2s ease-in-out',
            padding: '0.5rem 0.75rem',
            margin: '0 0.25rem',
            cursor: 'pointer',
            '&:hover:not(:disabled)': {
                backgroundColor: 'var(--dt-pagination-button-hover-bg)',
                transform: 'translateY(-1px)',
            },
            '&:focus': {
                outline: 'none',
                boxShadow: '0 0 0 2px var(--dt-primary-color-focus)',
            },
            '&:disabled': {
                opacity: '0.4',
                cursor: 'not-allowed',
            },
        },
    },
    noData: {
        style: {
            padding: '2rem',
            color: 'var(--dt-empty-color)',
            backgroundColor: 'var(--dt-empty-bg)',
            textAlign: 'center',
            borderRadius: '0.5rem',
            margin: '1rem 0',
        },
    },
    expanderButton: {
        style: {
            color: 'var(--dt-expander-color)',
            backgroundColor: 'transparent',
            borderRadius: '50%',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
                backgroundColor: 'var(--dt-expander-hover-bg)',
            },
            '&:focus': {
                outline: 'none',
                boxShadow: '0 0 0 2px var(--dt-primary-color-focus)',
            },
        },
    },
    expanderRow: {
        style: {
            backgroundColor: 'var(--dt-expander-row-bg)',
            color: 'var(--dt-row-color)',
        },
    },
    table: {
        style: {
            backgroundColor: 'var(--dt-table-bg)',
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: 'var(--dt-table-shadow)',
            border: '1px solid var(--dt-border-color)',
            backdropFilter: 'blur(8px)',
        },
    },
    progress: {
        style: {
            backgroundColor: 'var(--dt-progress-bg)',
            color: 'var(--dt-primary-color)',
        },
    },
    tableWrapper: {
        style: {
            display: 'table',
            width: '100%',
        },
    },
    responsiveWrapper: {
        style: {},
    },
    header: {
        style: {
            fontSize: '1.25rem',
            fontWeight: 600,
            paddingTop: '1.5rem',
            paddingBottom: '1rem',
            color: 'var(--dt-header-color)',
        },
    },
    subHeader: {
        style: {
            padding: '1rem',
            paddingBottom: '0.5rem',
            backgroundColor: 'var(--dt-subheader-bg)',
            color: 'var(--dt-subheader-color)',
            borderTopLeftRadius: '1rem',
            borderTopRightRadius: '1rem',
        },
    },
    contextMenu: {
        style: {
            backgroundColor: 'var(--dt-context-menu-bg)',
            borderRadius: '0.75rem',
            padding: '0.5rem',
            boxShadow: 'var(--dt-context-menu-shadow)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--dt-border-color)',
        },
        activeStyle: {
            backgroundColor: 'var(--dt-context-menu-active-bg)',
            color: 'var(--dt-context-menu-active-color)',
        },
    },
};

// Apply light theme variables
createTheme('light', {
    text: {
        primary: '#1d1d1b',
        secondary: '#4b5563',
        disabled: '#9ca3af',
    },
    background: {
        default: '#fbf8f3',
    },
    context: {
        background: '#ffffff',
        text: '#1d1d1b',
    },
    divider: {
        default: '#e5e7eb',
    },
    button: {
        default: '#f3f4f6',
        hover: '#e5e7eb',
        focus: 'rgba(253, 83, 4, 0.2)',
        disabled: '#d1d5db',
    },
    sortFocus: {
        default: 'rgba(253, 83, 4, 0.8)',
    },
    selected: {
        default: 'rgba(253, 83, 4, 0.1)',
        text: '#1d1d1b',
    },
    highlightOnHover: {
        default: 'rgba(243, 244, 246, 0.8)',
        text: '#1d1d1b',
    },
    striped: {
        default: 'rgba(249, 250, 251, 0.5)',
        text: '#1d1d1b',
    },
    ...baseStyles,
});

// Apply dark theme variables
createTheme('dark', {
    text: {
        primary: '#f9fafb',
        secondary: '#d1d5db',
        disabled: '#6b7280',
    },
    background: {
        default: '#1f2937',
    },
    context: {
        background: '#374151',
        text: '#f9fafb',
    },
    divider: {
        default: '#4b5563',
    },
    button: {
        default: '#374151',
        hover: '#4b5563',
        focus: 'rgba(253, 83, 4, 0.3)',
        disabled: '#6b7280',
    },
    sortFocus: {
        default: 'rgba(253, 83, 4, 0.8)',
    },
    selected: {
        default: 'rgba(253, 83, 4, 0.2)',
        text: '#f9fafb',
    },
    highlightOnHover: {
        default: 'rgba(55, 65, 81, 0.8)',
        text: '#f9fafb',
    },
    striped: {
        default: 'rgba(55, 65, 81, 0.3)',
        text: '#f9fafb',
    },
    ...baseStyles,
});

/**
 * Utility function to apply appropriate theme based on current mode
 * @param isDarkMode - Boolean indicating whether dark mode is active
 * @returns The theme name to use with the DataTable
 */
export const getDataTableTheme = (isDarkMode: boolean): string => {
    return isDarkMode ? 'dark' : 'light';
};

export default getDataTableTheme;
