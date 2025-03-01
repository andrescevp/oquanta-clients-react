import React from 'react';

interface ModalHeaderProps {
    title: string | React.ReactNode | React.ReactNode[];
    onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => {
    return (
        <div className='flex justify-between items-center p-4 border-b border-gray-300'>
            <h2 className='text-lg font-bold'>{title}</h2>
            <button onClick={onClose} className='text-gray-600 hover:text-gray-900 focus:outline-none'>
                ✕
            </button>
        </div>
    );
};

export default ModalHeader;
