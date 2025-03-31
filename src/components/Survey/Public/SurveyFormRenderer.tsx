import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormSchema } from '../../../api-generated/api';
import { cn } from '../../../lib/utils';
import ButtonLoader from '../../UI/molecules/ButtonLoder';
import InputWithLabel from '../../UI/molecules/InputWithLabel';
import TextareaWithLabel from '../../UI/molecules/TextareaWithLabel';

export interface SurveyFormRendererProps {
  schema: FormSchema;
  onSubmit?: (data: any) => void;
  loading?: boolean;
  className?: string;
}

/**
 * Component that dynamically renders a form based on a JSON schema
 * This can be exported as part of the SDK for public-facing applications
 */
const SurveyFormRenderer: React.FC<SurveyFormRendererProps> = ({
  schema,
  onSubmit,
  loading = false,
  className
}) => {
  const { t } = useTranslation();

  // create a new object with: Object.values(schema.properties) keys and random values
  const initialValues = schema.properties ? Object.fromEntries(
    Object.entries(schema.properties).map(([key, prop]) => {
      const type = prop.type || 'string';
      const defaultValue = 'default' in prop ? prop.default : (type === 'number' ? 0 : '');
      return [key, defaultValue];
    })
  ) : {};

  console.log(initialValues);

  const methods = useForm<{[key:string]: string|number}>({
    defaultValues: initialValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  
  // Render individual field based on type
  const renderField = (key: string, prop: any) => {
    const { type, title, attr } = prop;
    const isRequired = schema.required?.includes(key);
    const formType = attr?.['data-form-type'] || type;
    
    switch (formType) {
      case 'string':
        return (
          <InputWithLabel
            key={key}
            id={key}
            label={title}
            required={isRequired}
            inputProps={{
              type: "text",
              placeholder: attr?.placeholder || '',
              ...methods.register(key, { required: isRequired }),
              className: "backdrop-blur-sm"
            }}
          />
        );
      case 'number':
        return (
          <InputWithLabel
            key={key}
            id={key}
            label={title}
            required={isRequired}
            inputProps={{
              type: "number",
              placeholder: attr?.placeholder || '',
              ...methods.register(key, { 
                required: isRequired,
                valueAsNumber: true 
              }),
              className: "backdrop-blur-sm"
            }}
          />
        );
      case 'textarea':
        return (
          <TextareaWithLabel
            key={key}
            id={key}
            label={title}
            required={isRequired}
            textareaProps={{
              placeholder: attr?.placeholder || '',
              ...methods.register(key, { required: isRequired }),
              className: "backdrop-blur-sm",
              rows: 3
            }}
          />
        );
      default:
        return (
          <InputWithLabel
            key={key}
            id={key}
            label={title}
            required={isRequired}
            inputProps={{
              type: "text",
              placeholder: attr?.placeholder || '',
              ...methods.register(key, { required: isRequired }),
              className: "backdrop-blur-sm"
            }}
          />
        );
    }
  };
  
  // Render row layout (multiple fields grouped under one question)
  const renderRowLayout = (questionPath: string, properties: [string, any][]) => {
    const title = properties[0][1].attr?.['data-child-label'] || 'Question';
    
    return (
      <div key={questionPath} className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          {title}
        </h3>
        <div className="space-y-3 bg-gray-50/60 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          {properties.map(([key, prop]) => (
            <div key={key} className="flex items-start">
              <div className="min-w-[120px] mr-3 pt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {prop.attr?.['data-row-label'] || 'Row'}
              </div>
              <div className="flex-grow">
                {renderField(key, prop)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Process and organize schema properties for rendering
  const formFields = React.useMemo(() => {
    if (!schema || !schema.properties) {
      return null;
    }
    
    // Sort properties by propertyOrder
    const sortedProperties = Object.entries(schema.properties)
      .sort(([, a]: [string, any], [, b]: [string, any]) => 
        (a.propertyOrder || 0) - (b.propertyOrder || 0));
    
    // Group properties by question path
    const groupedProperties = sortedProperties.reduce((groups: Record<string, any[]>, [key, value]: [string, any]) => {
      const questionPath = value.attr?.['data-question-path'] || key;
      if (!groups[questionPath]) {
        groups[questionPath] = [];
      }
      groups[questionPath].push([key, value]);
      return groups;
    }, {});
    
    // Render groups
    return Object.entries(groupedProperties).map(([questionPath, properties]) => {
      // Check layout type
      const layout = properties[0][1].attr?.['data-form-layout'] || 'default';
      
      if (layout === 'rows') {
        return renderRowLayout(questionPath, properties);
      }
      
      return properties.map(([key, prop]) => renderField(key, prop));
    });
  }, [schema]);

  // Default form submission handler if not provided
  const defaultSubmit = (data: any) => {
    console.log("Form submitted with data:", data);
  };

  return (
    <div className={cn("bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm", className)}>
      {schema.title && (
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {schema.title}
        </h2>
      )}
      
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit || defaultSubmit)} className="space-y-6">
          <div className="space-y-6">
            {formFields}
          </div>
          
          <ButtonLoader
            type="submit"
            loading={loading}
            className={cn(
              "bg-gradient-to-r from-pumpkin-orange to-pumpkin-orange/80",
              "text-white py-3 px-4 rounded-xl",
              "shadow-lg shadow-pumpkin-orange/20",
              "hover:translate-y-[-2px] transition-all duration-200 ease-in-out",
              "mt-6 w-full"
            )}
          >
            {t('Submit')}
          </ButtonLoader>
        </form>
      </FormProvider>
    </div>
  );
};

export default SurveyFormRenderer;