import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Transition } from '@headlessui/react';

import { cn } from '../../../lib/utils';
import {
  AlertCircleIcon,
  BoldIcon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  SeparatorHorizontalIcon,
  StrikethroughIcon,
  TypeIcon,
} from '../Icons';

interface PlaceholderInitializer {
    start: string;
    stop: string;
    placeholders: string[];
}

interface MarkdownEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    error?: boolean | string | React.ReactNode | React.ReactNode[];
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    initializers?: PlaceholderInitializer[];
    placeholderColors?: Record<string, string>;
    showToolbar?: boolean;
    placeholder?: string;
    rows?: number;
    disabled?: boolean;
    autoFocus?: boolean;
}

/**
 * Enhanced markdown editor component with autocomplete functionality
 * Built with a contenteditable div for better UX control
 * Supports markdown formatting and placeholder autocomplete
 */
const MarkdownEditor = React.forwardRef<HTMLDivElement, MarkdownEditorProps>(
    // eslint-disable-next-line complexity
    (props, ref) => {
        const {
            value,
            onChange,
            className,
            error,
            icon,
            iconPosition = 'left',
            initializers = [],
            placeholderColors = {},
            showToolbar = true,
            placeholder = '',
            rows = 3,
            disabled = false,
            autoFocus = false,
            ...rest
        } = props;

        const { t } = useTranslation();
        const hasError = error !== undefined && error !== false;

        // Internal refs
        const internalRef = useRef<HTMLDivElement>(null);
        const editorRef = (ref as React.RefObject<HTMLDivElement>) || internalRef;
        const contentRef = useRef<HTMLDivElement>(null);
        const dropdownRef = useRef<HTMLDivElement>(null);

        // State for autocomplete functionality
        const [cursorPosition, setCursorPosition] = useState<number>(0);
        const [showAutocomplete, setShowAutocomplete] = useState<boolean>(false);
        const [currentInitializer, setCurrentInitializer] = useState<PlaceholderInitializer | null>(null);
        const [filteredPlaceholders, setFilteredPlaceholders] = useState<string[]>([]);
        const [selectedIndex, setSelectedIndex] = useState<number>(0);
        const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
        const [filterText, setFilterText] = useState<string>('');
        const [isComposing, setIsComposing] = useState(false);

        // Calculate min-height based on rows
        const minHeight = `${rows * 1.5 + 1}rem`; // 1.5rem line height + padding

        // Get color for a placeholder
        const getPlaceholderColor = (placeholderToMapColor: string): string => {
            // Check custom colors first
            if (placeholderColors[placeholderToMapColor]) {
                return placeholderColors[placeholderToMapColor];
            }

            // Default colors
            const defaultColors = [
                '#0ea5e9', // sky-500
                '#8b5cf6', // violet-500
                '#ec4899', // pink-500
                '#f59e0b', // amber-500
                '#10b981', // emerald-500
            ];

            // Use hash to assign consistent colors
            const hash = placeholderToMapColor.split('').reduce((acc, char) => {
                return acc + char.charCodeAt(0);
            }, 0);

            return defaultColors[hash % defaultColors.length];
        };

        // Parse and format Markdown in real-time
        const getFormattedContent = useCallback((text: string) => {
            if (!text) {
                return '';
            }

            let html = text;

            // Escape HTML characters to prevent injection
            html = html
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');

            // Process placeholders
            initializers.forEach(initializer => {
                const { start, stop } = initializer;
                const escStart = start.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const escStop = stop.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`${escStart}([^${escStop}]*)${escStop}`, 'g');

                html = html.replace(regex, (match, placeholderMatched) => {
                    const color = getPlaceholderColor(placeholderMatched);
                    return `<span class="placeholder" style="color:${color}; font-weight:500;">${match}</span>`;
                });
            });

            // Process markdown (basic)

            // Code blocks
            html = html.replace(/```([^`]*?)```/g, '<pre class="code-block">```$1```</pre>');

            // Inline code
            html = html.replace(/`([^`]*?)`/g, '<code class="inline-code">`$1`</code>');

            // Headers - must process before bold/italic
            html = html.replace(/^(#{1,6})\s(.+)$/gm,
                '<span class="header">$1 $2</span>');

            // Bold
            html = html.replace(/\*\*([^*]+?)\*\*/g, '<strong>**$1**</strong>');
            html = html.replace(/__([^_]+?)__/g, '<strong>__$1__</strong>');

            // Italic
            html = html.replace(/\*([^*]+?)\*/g, '<em>*$1*</em>');
            html = html.replace(/_([^_]+?)_/g, '<em>_$1_</em>');

            // Strikethrough
            html = html.replace(/~~(.+?)~~/g, '<del>~~$1~~</del>');

            // Lists
            html = html.replace(/^(\s*)([*+-])\s(.+)$/gm,
                '$1<span class="list-marker">$2 </span>$3');
            html = html.replace(/^(\s*)(\d+\.)\s(.+)$/gm,
                '$1<span class="list-marker">$2 </span>$3');

            // Links
            html = html.replace(/\[(.+?)\]\((.+?)\)/g,
                '<span class="link">[<span class="link-text">$1</span>]($2)</span>');

            // Images
            html = html.replace(/!\[(.+?)\]\((.+?)\)/g,
                '<span class="image">![<span class="image-alt">$1</span>]($2)</span>');

            // Blockquotes
            html = html.replace(/^>\s(.+)$/gm,
                '<span class="blockquote">> </span>$1');

            // Horizontal rule
            html = html.replace(/^(-{3,}|_{3,}|\*{3,})$/gm,
                '<span class="hr">$1</span>');

            // Convert newlines
            html = html.replace(/\n/g, '<br>');

            return html;
        }, [initializers]);

        // Update editor content with formatted code
        const updateEditorContent = useCallback(() => {
            if (!contentRef.current) return;

            const formattedContent = getFormattedContent(value);

            // Only update if the content actually changed to preserve cursor position
            if (contentRef.current.innerHTML !== formattedContent) {
                contentRef.current.innerHTML = formattedContent || '';
            }

            // Show placeholder if empty
            if (!value && placeholder && contentRef.current) {
                contentRef.current.setAttribute('data-placeholder', placeholder);
            } else if (contentRef.current) {
                contentRef.current.removeAttribute('data-placeholder');
            }
        }, [value, placeholder, getFormattedContent]);

        // Handle content changes and sync with value prop
        const handleContentChange = useCallback(() => {
            if (!contentRef.current || isComposing) return;

            // Extract plain text by creating a temporary div
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = contentRef.current.innerHTML;

            // Replace <br> with newlines
            const brs = tempDiv.querySelectorAll('br');
            for (let i = 0; i < brs.length; i++) {
                brs[i].replaceWith('\n');
            }

            // Get plain text
            const plainText = tempDiv.textContent || '';

            // Only call onChange if the text actually changed
            if (plainText !== value) {
                onChange(plainText);
            }
        }, [onChange, value, isComposing]);

        // Update dropdown position based on current cursor
        const updateDropdownPosition = useCallback(() => {
            if (!editorRef.current || !window.getSelection) return;

            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;

            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const editorRect = editorRef.current.getBoundingClientRect();

            setDropdownPosition({
                top: rect.bottom - editorRect.top,
                left: Math.min(
                    rect.left - editorRect.left,
                    editorRect.width - 200,
                ),
            });
        }, []);

        // Insert text at current cursor position
        const insertTextAtCursor = useCallback((text: string) => {
            if (!contentRef.current || !window.getSelection) return;

            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;

            const range = selection.getRangeAt(0);
            const textNode = document.createTextNode(text);

            range.insertNode(textNode);

            // Move cursor after inserted text
            range.setStartAfter(textNode);
            range.collapse(true);

            // Update selection
            selection.removeAllRanges();
            selection.addRange(range);

            // Trigger content change
            handleContentChange();

            // Focus back on editor
            contentRef.current.focus();
        }, [handleContentChange]);

        // Handle placeholder selection from dropdown
        const handleSelectPlaceholder = useCallback((placeholderSelected: string) => {
            if (!contentRef.current || !currentInitializer || !window.getSelection) return;

            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;

            // Get current selection range
            const range = selection.getRangeAt(0);

            // Create document fragment with our content
            const fullPlaceholder = placeholderSelected + currentInitializer.stop;
            const textNode = document.createTextNode(fullPlaceholder);

            // Insert at cursor
            range.insertNode(textNode);

            // Move cursor after inserted text
            range.setStartAfter(textNode);
            range.collapse(true);

            // Update selection
            selection.removeAllRanges();
            selection.addRange(range);

            // Hide autocomplete
            setShowAutocomplete(false);

            // Force update content
            handleContentChange();

            // Focus back on editor
            contentRef.current.focus();
        }, [currentInitializer, handleContentChange]);

        // Markdown formatting helper functions
        const formatText = useCallback((before: string, after = '') => {
            if (!contentRef.current || !window.getSelection) return;

            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;

            const range = selection.getRangeAt(0);
            const selectedText = range.toString();

            // Delete selected text
            range.deleteContents();

            // Create document fragment with our formatted content
            const formattedText = before + selectedText + after;
            const textNode = document.createTextNode(formattedText);

            // Insert at cursor
            range.insertNode(textNode);

            // Move cursor after inserted text
            range.setStartAfter(textNode);
            range.collapse(true);

            // Update selection
            selection.removeAllRanges();
            selection.addRange(range);

            // Force update content
            handleContentChange();

            // Focus back on editor
            contentRef.current.focus();
        }, [handleContentChange]);

        // Formatting functions
        const formatBold = useCallback(() => formatText('**', '**'), [formatText]);
        const formatItalic = useCallback(() => formatText('*', '*'), [formatText]);
        const formatStrikethrough = useCallback(() => formatText('~~', '~~'), [formatText]);

        const formatHeading = useCallback((level: number) => {
            if (!contentRef.current || !window.getSelection) return;

            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;

            const prefix = '#'.repeat(level) + ' ';
            formatText(prefix, '');
        }, [formatText]);

        const formatList = useCallback((ordered = false) => {
            if (!contentRef.current || !window.getSelection) return;

            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;

            const range = selection.getRangeAt(0);
            const selectedText = range.toString();

            if (!selectedText) {
                // No selection, just insert a list marker
                formatText(ordered ? '1. ' : '- ', '');
                return;
            }

            // Format each line
            const lines = selectedText.split('\n');
            const formattedLines = lines.map((line, i) =>
                ordered ? `${i + 1}. ${line}` : `- ${line}`,
            );

            // Delete selected text
            range.deleteContents();

            // Create document fragment with our formatted content
            const formattedText = formattedLines.join('\n');
            const textNode = document.createTextNode(formattedText);

            // Insert at cursor
            range.insertNode(textNode);

            // Move cursor after inserted text
            range.setStartAfter(textNode);
            range.collapse(true);

            // Update selection
            selection.removeAllRanges();
            selection.addRange(range);

            // Force update content
            handleContentChange();

            // Focus back on editor
            contentRef.current.focus();
        }, [formatText, handleContentChange]);

        const insertHorizontalRule = useCallback(() => formatText('\n---\n'), [formatText]);

        const formatBlockquote = useCallback(() => {
            if (!contentRef.current || !window.getSelection) return;

            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;

            const range = selection.getRangeAt(0);
            const selectedText = range.toString();

            // Format each line
            const lines = selectedText.split('\n');
            const formattedLines = lines.map(line => `> ${line}`);

            // Delete selected text
            range.deleteContents();

            // Create document fragment with our formatted content
            const formattedText = formattedLines.join('\n');
            const textNode = document.createTextNode(formattedText);

            // Insert at cursor
            range.insertNode(textNode);

            // Update selection
            selection.removeAllRanges();
            selection.addRange(range);

            // Force update content
            handleContentChange();

            // Focus back on editor
            contentRef.current.focus();
        }, [handleContentChange]);

        const insertLink = useCallback(() => {
            // Ask for the link URL
            const url = prompt(t('Enter the URL:')) || 'https://';
            if (url) {
                if (!contentRef.current || !window.getSelection) return;

                const selection = window.getSelection();
                if (!selection || selection.rangeCount === 0) return;

                const range = selection.getRangeAt(0);
                const selectedText = range.toString();
                const linkText = selectedText || t('Link text');

                formatText(`[${linkText}](${url})`);
            }
        }, [formatText, t]);

        const insertImage = useCallback(() => {
            // Ask for the image URL and alt text
            const url = prompt(t('Enter the image URL:')) || 'https://';
            if (url) {
                const altText = prompt(t('Enter alt text (optional):')) || t('Image');
                formatText(`![${altText}](${url})`);
            }
        }, [formatText, t]);

        // Handle keyboard events
        const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
            if (disabled) return;

            // Handle dropdown navigation
            if (showAutocomplete && filteredPlaceholders.length > 0) {
                switch (e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        setSelectedIndex(prev => (prev + 1) % filteredPlaceholders.length);
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        setSelectedIndex(prev => (prev - 1 + filteredPlaceholders.length) % filteredPlaceholders.length);
                        break;
                    case 'Enter':
                        e.preventDefault();
                        handleSelectPlaceholder(filteredPlaceholders[selectedIndex]);
                        break;
                    case 'Escape':
                        e.preventDefault();
                        setShowAutocomplete(false);
                        break;
                    case 'Tab':
                        e.preventDefault();
                        handleSelectPlaceholder(filteredPlaceholders[selectedIndex]);
                        break;
                }
                return;
            }

            // Tab key should insert spaces instead of moving focus
            if (e.key === 'Tab') {
                e.preventDefault();
                insertTextAtCursor('    '); // 4 spaces
                return;
            }

            // Allow default behavior for other keys
        }, [showAutocomplete, filteredPlaceholders, selectedIndex, handleSelectPlaceholder, disabled, insertTextAtCursor]);

        // Handle editor input, check for autocomplete initializers
        // eslint-disable-next-line complexity
        const handleInput = useCallback(() => {
            if (disabled || !contentRef.current || isComposing) return;

            handleContentChange();

            // Process autocomplete if we have initializers
            if (initializers.length > 0 && window.getSelection) {
                const selection = window.getSelection();
                if (!selection || selection.rangeCount === 0) return;

                const range = selection.getRangeAt(0);
                const cursorNode = range.startContainer;

                // Only process text nodes
                if (cursorNode.nodeType !== Node.TEXT_NODE) return;

                const cursorOffset = range.startOffset;
                const text = cursorNode.textContent || '';
                const textBeforeCursor = text.substring(0, cursorOffset);

                // If we're already showing autocomplete
                if (showAutocomplete && currentInitializer) {
                    const lastInitializerPos = textBeforeCursor.lastIndexOf(currentInitializer.start);

                    if (lastInitializerPos !== -1) {
                        // Get text after initializer but before cursor
                        const filterTextValue = textBeforeCursor.substring(
                            lastInitializerPos + currentInitializer.start.length,
                        );
                        setFilterText(filterTextValue);

                        // Filter placeholders
                        const filtered = currentInitializer.placeholders.filter(p =>
                            p.toLowerCase().includes(filterTextValue.toLowerCase()),
                        );
                        setFilteredPlaceholders(filtered);
                        setSelectedIndex(0);

                        // Close dropdown if no matches or if closing delimiter is typed
                        if (filtered.length === 0 ||
                            text.substring(cursorOffset - currentInitializer.stop.length, cursorOffset) === currentInitializer.stop) {
                            setShowAutocomplete(false);
                        }
                    } else {
                        setShowAutocomplete(false);
                    }
                } else {
                    // Check if user just typed an initializer
                    for (const initializer of initializers) {
                        if (textBeforeCursor.endsWith(initializer.start)) {
                            setCurrentInitializer(initializer);
                            setFilteredPlaceholders(initializer.placeholders);
                            setShowAutocomplete(true);
                            setSelectedIndex(0);
                            setFilterText('');
                            updateDropdownPosition();
                            break;
                        }
                    }
                }
            }
        }, [handleContentChange, initializers, showAutocomplete, currentInitializer, disabled, isComposing, updateDropdownPosition]);

        // Update editor content whenever value changes
        useEffect(() => {
            updateEditorContent();
        }, [value, updateEditorContent]);

        // Close dropdown when clicking outside
        useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                if (
                    dropdownRef.current &&
                    !dropdownRef.current.contains(e.target as Node) &&
                    contentRef.current !== e.target &&
                    !contentRef.current?.contains(e.target as Node)
                ) {
                    setShowAutocomplete(false);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        // Focus on mount if autoFocus is true
        useEffect(() => {
            if (autoFocus && contentRef.current) {
                contentRef.current.focus();
            }
        }, [autoFocus]);

        return (
            <div className="w-full space-y-1.5">
                {/* Markdown toolbar */}
                {showToolbar && (
                    <div
                        className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-gray-100/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700">
                        {/* Text Formatting */}
                        <div className="flex items-center space-x-1 mr-2">
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={formatBold}
                                className={cn(
                                    'p-1.5 rounded-md text-gray-700 dark:text-gray-300',
                                    !disabled && 'hover:bg-gray-200 dark:hover:bg-gray-700',
                                    disabled && 'opacity-50 cursor-not-allowed',
                                )}
                                title={t('Bold')}
                            >
                                <BoldIcon className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={formatItalic}
                                className={cn(
                                    'p-1.5 rounded-md text-gray-700 dark:text-gray-300',
                                    !disabled && 'hover:bg-gray-200 dark:hover:bg-gray-700',
                                    disabled && 'opacity-50 cursor-not-allowed',
                                )}
                                title={t('Italic')}
                            >
                                <ItalicIcon className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={formatStrikethrough}
                                className={cn(
                                    'p-1.5 rounded-md text-gray-700 dark:text-gray-300',
                                    !disabled && 'hover:bg-gray-200 dark:hover:bg-gray-700',
                                    disabled && 'opacity-50 cursor-not-allowed',
                                )}
                                title={t('Strikethrough')}
                            >
                                <StrikethroughIcon className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={insertHorizontalRule}
                                className={cn(
                                    'p-1.5 rounded-md text-gray-700 dark:text-gray-300',
                                    !disabled && 'hover:bg-gray-200 dark:hover:bg-gray-700',
                                    disabled && 'opacity-50 cursor-not-allowed',
                                )}
                                title={t('Horizontal Rule')}
                            >
                                <SeparatorHorizontalIcon className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Separator */}
                        <div className="h-6 border-l border-gray-300 dark:border-gray-600 mx-1"></div>

                        {/* Headings */}
                        <div className="flex items-center space-x-1 mr-2">
                            <div className="relative group">
                                <button
                                    type="button"
                                    disabled={disabled}
                                    className={cn(
                                        'p-1.5 rounded-md text-gray-700 dark:text-gray-300 flex items-center',
                                        !disabled && 'hover:bg-gray-200 dark:hover:bg-gray-700',
                                        disabled && 'opacity-50 cursor-not-allowed',
                                    )}
                                    title={t('Headings')}
                                >
                                    <TypeIcon className="h-4 w-4" />
                                </button>
                                {!disabled && (
                                    <div
                                        className="absolute left-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-md border border-gray-200 dark:border-gray-700 hidden group-hover:block z-50">
                                        <div className="p-1 grid grid-cols-3 gap-1 w-[120px]">
                                            <button
                                                type="button"
                                                onClick={() => formatHeading(1)}
                                                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-center text-xs"
                                            >
                                                <Heading1Icon className="h-4 w-4 mx-auto" />
                                                <span className="text-xs">H1</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => formatHeading(2)}
                                                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-center text-xs"
                                            >
                                                <Heading2Icon className="h-4 w-4 mx-auto" />
                                                <span className="text-xs">H2</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => formatHeading(3)}
                                                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-center text-xs"
                                            >
                                                <Heading3Icon className="h-4 w-4 mx-auto" />
                                                <span className="text-xs">H3</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={() => formatList(false)}
                                className={cn(
                                    'p-1.5 rounded-md text-gray-700 dark:text-gray-300',
                                    !disabled && 'hover:bg-gray-200 dark:hover:bg-gray-700',
                                    disabled && 'opacity-50 cursor-not-allowed',
                                )}
                                title={t('Bulleted List')}
                            >
                                <ListIcon className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={() => formatList(true)}
                                className={cn(
                                    'p-1.5 rounded-md text-gray-700 dark:text-gray-300',
                                    !disabled && 'hover:bg-gray-200 dark:hover:bg-gray-700',
                                    disabled && 'opacity-50 cursor-not-allowed',
                                )}
                                title={t('Numbered List')}
                            >
                                <ListOrderedIcon className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Separator */}
                        <div className="h-6 border-l border-gray-300 dark:border-gray-600 mx-1"></div>

                        {/* Assets */}
                        <div className="flex items-center space-x-1">
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={insertLink}
                                className={cn(
                                    'p-1.5 rounded-md text-gray-700 dark:text-gray-300',
                                    !disabled && 'hover:bg-gray-200 dark:hover:bg-gray-700',
                                    disabled && 'opacity-50 cursor-not-allowed',
                                )}
                                title={t('Insert Link')}
                            >
                                <LinkIcon className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={formatBlockquote}
                                className={cn(
                                    'p-1.5 rounded-md text-gray-700 dark:text-gray-300',
                                    !disabled && 'hover:bg-gray-200 dark:hover:bg-gray-700',
                                    disabled && 'opacity-50 cursor-not-allowed',
                                )}
                                title={t('Insert Quote')}
                            >
                                <QuoteIcon className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={insertImage}
                                className={cn(
                                    'p-1.5 rounded-md text-gray-700 dark:text-gray-300',
                                    !disabled && 'hover:bg-gray-200 dark:hover:bg-gray-700',
                                    disabled && 'opacity-50 cursor-not-allowed',
                                )}
                                title={t('Insert Image')}
                            >
                                <ImageIcon className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={() => formatText('`', '`')}
                                className={cn(
                                    'p-1.5 rounded-md text-gray-700 dark:text-gray-300',
                                    !disabled && 'hover:bg-gray-200 dark:hover:bg-gray-700',
                                    disabled && 'opacity-50 cursor-not-allowed',
                                )}
                                title={t('Insert Code')}
                            >
                                <CodeIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}

                <div
                    className={cn(
                        'relative',
                        'w-full',
                        'border border-gray-300 dark:border-gray-600',
                        'rounded-xl',
                        'transition-all duration-200',
                        'focus-within:outline-none focus-within:ring-2 focus-within:border-pumpkin-orange',
                        hasError ? 'border-red-500 focus-within:ring-red-500/50 focus-within:border-red-500' : 'focus-within:ring-pumpkin-orange/50',
                        disabled && 'cursor-not-allowed opacity-50 bg-gray-100 dark:bg-gray-800/50',
                    )}
                    ref={editorRef}
                    {...rest}
                >
                    {/* Icon */}
                    {icon && iconPosition === 'left' && (
                        <div className="absolute left-3 top-3 text-gray-500 dark:text-gray-400">
                            {icon}
                        </div>
                    )}

                    {/* Editable content */}
                    <div
                        ref={contentRef}
                        contentEditable={!disabled}
                        className={cn(
                            'w-full outline-none',
                            'bg-gray-50/80 dark:bg-gray-800/80',
                            'min-h-[2.5rem]',
                            icon && iconPosition === 'left' ? 'pl-10 pr-4' : 'px-4',
                            icon && iconPosition === 'right' ? 'pr-10 pl-4' : 'px-4',
                            'py-2.5',
                            'whitespace-pre-wrap break-words',
                            className,
                            // Placeholder styling using empty pseudo-element
                            'empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none',
                        )}
                        onInput={handleInput}
                        onKeyDown={handleKeyDown}
                        onCompositionStart={() => setIsComposing(true)}
                        onCompositionEnd={() => {
                            setIsComposing(false);
                            handleInput();
                        }}
                        onClick={updateDropdownPosition}
                        style={{
                            minHeight,
                        }}
                    />

                    {/* Error icon */}
                    {hasError && typeof error === 'boolean' && (
                        <div className="absolute right-3 top-3 text-red-500">
                            <AlertCircleIcon className="h-5 w-5" />
                        </div>
                    )}

                    {/* Icon (right) */}
                    {icon && iconPosition === 'right' && (
                        <div className="absolute right-3 top-3 text-gray-500 dark:text-gray-400">
                            {icon}
                        </div>
                    )}

                    {/* Autocomplete dropdown */}
                    {showAutocomplete && filteredPlaceholders.length > 0 && (
                        <div
                            ref={dropdownRef}
                            className={cn(
                                'absolute z-50',
                                'bg-white dark:bg-gray-800',
                                'border border-gray-200 dark:border-gray-700',
                                'rounded-lg shadow-lg',
                                'max-h-64 overflow-y-auto',
                                'min-w-[180px] max-w-[300px]',
                            )}
                            style={{
                                top: `${dropdownPosition.top}px`,
                                left: `${dropdownPosition.left}px`,
                            }}
                        >
                            <ul className="py-1">
                                {filteredPlaceholders.map((placeholderFiltered, index) => (
                                    <li
                                        key={placeholderFiltered}
                                        className={cn(
                                            'px-3 py-2 cursor-pointer',
                                            'hover:bg-gray-100 dark:hover:bg-gray-700',
                                            'transition-colors duration-100',
                                            'text-sm font-medium',
                                            selectedIndex === index ?
                                                'bg-gray-100 dark:bg-gray-700' : '',
                                        )}
                                        onClick={() => handleSelectPlaceholder(placeholderFiltered)}
                                        style={{
                                            color: selectedIndex === index ?
                                                getPlaceholderColor(placeholderFiltered) : undefined,
                                        }}
                                    >
                                        {placeholderFiltered}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Error message */}
                <Transition
                    show={hasError && error !== true}
                    enter="transition-opacity duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="flex items-start space-x-1.5 text-red-600 dark:text-red-400 text-sm mt-1">
                        <AlertCircleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                </Transition>
            </div>
        );
    },
);

MarkdownEditor.displayName = 'MarkdownEditor';

export default MarkdownEditor;