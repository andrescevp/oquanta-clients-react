import React from 'react';

interface ModalOverlayProps {
    onClose: () => void;
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({ onClose }) => {
    return <div className='fixed inset-0 bg-black bg-opacity-50 z-40' onClick={onClose}></div>;
};

export default ModalOverlay;
