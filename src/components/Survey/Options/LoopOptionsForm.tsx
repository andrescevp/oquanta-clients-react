import React from 'react';
import { useTranslation } from 'react-i18next';

import { Loop } from '../../../api-generated';
import { cn } from '../../../lib/utils';
import InputWithLabel from '../../UI/molecules/InputWithLabel';

interface LoopOptionsFormProps {
    element: Loop;
    onChange: (field: string, value: any) => void;
    className?: string;
}

/**
 * Form component for loop-type options
 * Handles loop-specific settings including conditional logic
 */
const LoopOptionsForm: React.FC<LoopOptionsFormProps> = ({ element, onChange, className }) => {
    const { t } = useTranslation();
    const { options } = element;

    return (
        <div className={cn('space-y-6', className)}>
            <div className='space-y-5 bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm'>
                <h3 className='font-medium text-gray-800 dark:text-gray-200'>{t('Loop Configuration')}</h3>

                {/* Condition */}
                <InputWithLabel
                    id='condition-input'
                    label={t('Condition')}
                    helperText={t('Expression to determine when this loop is shown')}
                    inputProps={{
                        type: 'text',
                        value: options?.condition || '',
                        onChange: e => onChange('condition', e.target.value),
                        placeholder: t('Enter condition expression'),
                        className: 'backdrop-blur-sm',
                    }}
                />
            </div>
        </div>
    );
};

export default LoopOptionsForm;
