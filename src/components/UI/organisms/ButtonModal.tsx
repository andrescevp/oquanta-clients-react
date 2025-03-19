import React, { useId, useState } from 'react';
import { Tooltip } from 'react-tooltip';

import Modal from './Modal';

interface ButtonModalProps {
    className?: string;
    children?: React.ReactNode | string;
    buttonTitle?: string;
    modalTitle?: string | React.ReactNode | React.ReactNode[];
    modalContent?: React.ReactNode | string;
    modalFooter?: React.ReactNode | string;
    showModalCloseButton?: boolean;
}

const ButtonModal: React.FC<ButtonModalProps> = ({
    modalFooter,
    showModalCloseButton = true,
    className = 'btn btn-outline',
    children = 'Open Modal',
    buttonTitle = 'Open Modal',
    modalTitle = 'Modal',
    modalContent = 'Modal Content',
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const randomId = useId();

    return (
        <>
            <button
                data-tooltip-id={`${randomId}-button-modal`}
                data-tooltip-content={buttonTitle}
                className={className}
                onClick={() => setIsModalOpen(true)}
                type={'button'}>
                {children}
            </button>
            <Tooltip id={`${randomId}-button-modal`} />
            <Modal
                title={modalTitle}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                footer={modalFooter}
                showCLoseButton={showModalCloseButton}>
                {modalContent}
            </Modal>
        </>
    );
};

export default ButtonModal;
