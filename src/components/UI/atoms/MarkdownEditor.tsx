import React, { ChangeEvent, forwardRef } from 'react';

import MDEditor from '@uiw/react-md-editor';

const MarkdownEditor = forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
    (props: React.ComponentProps<'textarea'>, ref) => {
        const { value, onChange } = props;
        return (
            <MDEditor
                value={String(value)}
                onChange={(_, event) => {
                    if (onChange) {
                        onChange(event as ChangeEvent<HTMLTextAreaElement>);
                    }
                }}
            />
        );
    },
);
MarkdownEditor.displayName = 'MarkdownEditor';

export default MarkdownEditor;
