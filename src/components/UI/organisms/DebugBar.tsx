import React, { useCallback, useEffect, useState } from 'react';

import cn from 'clsx';

import { DebugRequest, useDebugBar } from '../../../context/DebugBarContext';
import {
    ArrowRightIcon,
    IconChevronDown,
    IconChevronUp,
    IconClock,
    IconExternalLink,
    IconGripHorizontal,
    IconTrash as IconTrash2,
    IconX,
} from '../Icons';

// Estilo basado en la debug bar de Symfony
const DebugBar: React.FC = () => {
    const { requests, visible, toggleVisibility, clearRequests } = useDebugBar();
    const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
    const [height, setHeight] = useState<number>(300); // Altura predeterminada en píxeles
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [startY, setStartY] = useState<number>(0);
    const [startHeight, setStartHeight] = useState<number>(0);

    // Toggle para expandir/colapsar un request
    const toggleRequest = (id: string) => {
        setExpandedRequest(expandedRequest === id ? null : id);
    };

    // Inicia el arrastre
    const startDrag = useCallback(
        (e: React.MouseEvent) => {
            setIsDragging(true);
            setStartY(e.clientY);
            setStartHeight(height);
            e.preventDefault();
        },
        [height],
    );

    // Función para manejar el arrastre
    const onDrag = useCallback(
        (e: MouseEvent) => {
            if (!isDragging) return;
            // Calcula la nueva altura (invertida porque arrastramos desde arriba)
            const newHeight = Math.max(150, startHeight + (startY - e.clientY));
            setHeight(newHeight);
            e.preventDefault();
        },
        [isDragging, startHeight, startY],
    );

    // Función para terminar el arrastre
    const endDrag = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Configurar oyentes de eventos globales para el arrastre
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', endDrag);
        }

        return () => {
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', endDrag);
        };
    }, [isDragging, onDrag, endDrag]);

    // Formatear fecha y hora
    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}.${date.getMilliseconds().toString().padStart(3, '0')}`;
    };

    // Formatear tamaño en KB
    const formatSize = (bytes?: number) => {
        if (!bytes) return '0 KB';
        return `${(bytes / 1024).toFixed(2)} KB`;
    };

    // Formatear duración en ms
    const formatDuration = (ms?: number) => {
        if (!ms) return '0 ms';
        return `${ms.toFixed(2)} ms`;
    };

    // Obtener color según el status HTTP
    const getStatusColor = (status?: number) => {
        if (!status) return 'bg-gray-500';
        if (status >= 500) return 'bg-red-600';
        if (status >= 400) return 'bg-orange-500';
        if (status >= 300) return 'bg-blue-500';
        if (status >= 200) return 'bg-green-500';
        return 'bg-gray-500';
    };

    if (!visible) {
        return (
            <div
                className='fixed bottom-0 right-4 z-2000 bg-blue-600 hover:bg-blue-700 text-white rounded-t-md px-3 py-1 cursor-pointer shadow-lg'
                onClick={toggleVisibility}>
                Debug {requests.length > 0 && `(${requests.length})`}
            </div>
        );
    }

    // eslint-disable-next-line complexity
    const requestDrawer = (request: DebugRequest) => (
        <div key={request.id} className='hover:bg-gray-800'>
            <div className='flex items-center px-2 py-1 cursor-pointer' onClick={() => toggleRequest(request.id)}>
                {/* Indicador de estado HTTP */}
                <div className={`w-2 h-full ${getStatusColor(request.status)} mr-2`}></div>

                {/* Método y URL */}
                <div className='flex-1 truncate'>
                    <span className='font-bold text-blue-400'>{request.method}</span>
                    <span className='text-gray-400 ml-2'>{request.url}</span>
                </div>

                {/* Información adicional */}
                <div className='flex items-center space-x-3 text-gray-400'>
                    {request.status && (
                        <span className={cn('px-1 rounded', getStatusColor(request.status), 'text-white')}>
                            {request.status}
                        </span>
                    )}

                    <div className='flex items-center'>
                        <IconClock className='w-3 h-3 mr-1' />
                        {formatDuration(request.duration)}
                    </div>

                    <div>{formatSize(request.responseSize)}</div>

                    {request.tokenLink && (
                        <a
                            href={request.tokenLink}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-400 hover:text-blue-300'
                            onClick={e => e.stopPropagation()}>
                            <IconExternalLink className='w-4 h-4' />
                        </a>
                    )}

                    {expandedRequest === request.id ? (
                        <IconChevronUp className='w-4 h-4' />
                    ) : (
                        <IconChevronDown className='w-4 h-4' />
                    )}
                </div>
            </div>

            {/* Panel expandido con detalles */}
            {expandedRequest === request.id && (
                <div className='p-2 bg-gray-850 border-t border-gray-700'>
                    <div className='grid grid-cols-2 gap-2'>
                        {/* Request info */}
                        <div>
                            <h4 className='font-bold text-blue-400 mb-1'>Request</h4>
                            <div className='bg-gray-900 rounded p-2'>
                                <div>
                                    <span className='text-gray-400'>Time:</span> {formatTime(request.timestamp)}
                                </div>
                                <div>
                                    <span className='text-gray-400'>Token:</span> {request.token}
                                </div>
                                <div>
                                    <span className='text-gray-400'>Method:</span> {request.method}
                                </div>
                                <div>
                                    <span className='text-gray-400'>URL:</span> {request.url}
                                </div>

                                {request.headers && Object.keys(request.headers).length > 0 && (
                                    <div className='mt-2'>
                                        <div className='text-gray-400 font-bold'>Headers:</div>
                                        <pre className='bg-gray-800 p-1 rounded text-xs overflow-x-auto'>
                                            {Object.entries(request.headers).map(([key, value]) => (
                                                <div key={key}>
                                                    <span className='text-green-400'>{key}:</span> {String(value)}
                                                </div>
                                            ))}
                                        </pre>
                                    </div>
                                )}

                                {request.requestData && (
                                    <div className='mt-2'>
                                        <div className='text-gray-400 font-bold'>Body:</div>
                                        <pre className='bg-gray-800 p-1 rounded text-xs overflow-x-auto'>
                                            {JSON.stringify(request.requestData, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Response info */}
                        <div>
                            <h4 className='font-bold text-blue-400 mb-1'>Response</h4>
                            <div className='bg-gray-900 rounded p-2'>
                                <div>
                                    <span className='text-gray-400'>Status:</span>
                                    <span
                                        className={cn(
                                            'px-1 rounded ml-1',
                                            getStatusColor(request.status),
                                            'text-white',
                                        )}>
                                        {request.status}
                                    </span>
                                </div>
                                <div>
                                    <span className='text-gray-400'>Duration:</span> {formatDuration(request.duration)}
                                </div>
                                <div>
                                    <span className='text-gray-400'>Size:</span> {formatSize(request.responseSize)}
                                </div>

                                {request.responseHeaders && Object.keys(request.responseHeaders).length > 0 && (
                                    <div className='mt-2'>
                                        <div className='text-gray-400 font-bold'>Headers:</div>
                                        <pre className='bg-gray-800 p-1 rounded text-xs overflow-x-auto'>
                                            {Object.entries(request.responseHeaders).map(([key, value]) => (
                                                <div key={key}>
                                                    <span className='text-green-400'>{key}:</span> {String(value)}
                                                </div>
                                            ))}
                                        </pre>
                                    </div>
                                )}

                                {request.responseData && (
                                    <div className='mt-2'>
                                        <div className='text-gray-400 font-bold'>Body:</div>
                                        <pre className='bg-gray-800 p-1 rounded text-xs overflow-x-auto max-h-60'>
                                            {JSON.stringify(request.responseData, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {request.tokenLink && (
                        <div className='mt-2 flex justify-end'>
                            <a
                                href={request.tokenLink}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='flex items-center text-blue-400 hover:text-blue-300'>
                                Ver detalle completo en Symfony Profiler
                                <ArrowRightIcon className='w-4 h-4 ml-1' />
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <div
            className='fixed bottom-0 left-0 right-0 bg-gray-900 text-white border-t border-gray-700 font-mono text-xs shadow-xl z-2000'
            style={{ height: `${height}px` }}>
            {/* Barra de agarre para redimensionar */}
            <div
                className={cn(
                    'h-1.5 w-full cursor-row-resize bg-gray-800 hover:bg-blue-600 relative flex items-center justify-center',
                    isDragging ? 'bg-blue-600' : '',
                )}
                onMouseDown={startDrag}>
                <IconGripHorizontal className='w-4 h-4 text-gray-500 absolute' />
            </div>

            {/* Barra principal */}
            <div className='flex items-center justify-between px-2 py-1 bg-gray-800'>
                <div className='flex items-center space-x-3'>
                    <div className='bg-blue-600 px-2 py-1 rounded'>Symfony Debug</div>
                    <div className='text-gray-300'>
                        <span className='text-blue-400'>{requests.length}</span> requests
                    </div>
                </div>
                <div className='flex items-center space-x-2'>
                    <button onClick={clearRequests} className='p-1 hover:bg-gray-700 rounded' title='Limpiar requests'>
                        <IconTrash2 className='w-4 h-4' />
                    </button>
                    <button
                        onClick={toggleVisibility}
                        className='p-1 hover:bg-gray-700 rounded'
                        title='Cerrar debug bar'>
                        <IconX className='w-4 h-4' />
                    </button>
                </div>
            </div>

            {/* Panel de requests */}
            <div className='overflow-y-auto bg-gray-900' style={{ maxHeight: `${height - 40}px` }}>
                {requests.length === 0 ? (
                    <div className='p-4 text-center text-gray-400'>No hay requests registrados todavía</div>
                ) : (
                    <div className='divide-y divide-gray-800'>{requests.map(requestDrawer)}</div>
                )}
            </div>
        </div>
    );
};

export default DebugBar;
