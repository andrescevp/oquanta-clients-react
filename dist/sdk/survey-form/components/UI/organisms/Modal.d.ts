import React from 'react';
interface ModalProps {
    title: string | React.ReactNode | React.ReactNode[];
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    footer?: React.ReactNode;
    showCLoseButton?: boolean;
}
declare const Modal: React.FC<ModalProps>;
export default Modal;
