import React, { useState } from 'react';

import Modal from './Modal';

interface WizardProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    steps: React.ReactNode[];
    footer?: React.ReactNode;
    showCLoseButton?: boolean;
}

const Wizard: React.FC<WizardProps> = ({ title, isOpen, onClose, steps, footer, showCLoseButton = true }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <Modal
            title={title}
            isOpen={isOpen}
            onClose={onClose}
            footer={
                <>
                    {currentStep > 0 && (
                        <button
                            className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
                            onClick={handlePrevious}>
                            Previous
                        </button>
                    )}
                    {currentStep < steps.length - 1 ? (
                        <button
                            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                            onClick={handleNext}>
                            Next
                        </button>
                    ) : (
                        <button
                            className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
                            onClick={onClose}>
                            Finish
                        </button>
                    )}
                    {footer}
                </>
            }
            showCLoseButton={showCLoseButton}>
            {steps[currentStep]}
        </Modal>
    );
};

export default Wizard;
