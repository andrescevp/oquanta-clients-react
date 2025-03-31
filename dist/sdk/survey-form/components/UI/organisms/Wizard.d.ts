import React from 'react';
interface WizardProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    steps: React.ReactNode[];
    footer?: React.ReactNode;
    showCLoseButton?: boolean;
}
declare const Wizard: React.FC<WizardProps>;
export default Wizard;
