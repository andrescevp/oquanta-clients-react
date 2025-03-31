import React from 'react';
import { FormSchema } from '../../../api-generated/api';
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
declare const SurveyFormRenderer: React.FC<SurveyFormRendererProps>;
export default SurveyFormRenderer;
