import React from 'react';
interface ButtonModalProps {
    className?: string;
    children?: React.ReactNode | string;
    buttonTitle?: string;
    modalTitle?: string | React.ReactNode | React.ReactNode[];
    modalContent?: React.ReactNode | string;
    modalFooter?: React.ReactNode | string;
    showModalCloseButton?: boolean;
}
declare const ButtonModal: React.FC<ButtonModalProps>;
export default ButtonModal;
