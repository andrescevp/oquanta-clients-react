import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { format, formatDistanceToNow } from 'date-fns';

import { ApiKey, ApiKeyList, UsersAPIKeysApi } from '../../../../api-generated/api';
import Button from '../../../../components/UI/atoms/Button';
import { IconAdd, IconTrash } from '../../../../components/UI/Icons';
import { ConfirmationTooltip } from '../../../../components/UI/molecules/ConfirmationTooltip';
import InputWithLabel from '../../../../components/UI/molecules/InputWithLabel';
import { usePermission } from '../../../../context/PermissionContext';
import { useApi } from '../../../../hooks/useApi';
import { useTheme } from '../../../../hooks/useTheme';
import { cn } from '../../../../lib/utils';

// Form values for creating a new API key
interface ApiKeyFormValues {
    name: string;
    expiresInDays: number;
}

interface UseraApiKeysFormProps {
    uuid?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

// eslint-disable-next-line complexity
const UseraApiKeysForm: React.FC<UseraApiKeysFormProps> = ({ uuid, onSuccess, onCancel }) => {
    const { t } = useTranslation();
    const apiKeysApi = useApi(UsersAPIKeysApi);
    const { hasRole } = usePermission();
    const { isDark } = useTheme();
    const [apiKeys, setApiKeys] = useState<ApiKeyList>();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newKeyToken, setNewKeyToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ApiKeyFormValues>({
        defaultValues: {
            name: '',
            expiresInDays: 30,
        },
    });

    // Load API keys when the component mounts or when uuid changes
    const loadApiKeys = () => {
        if (!uuid) return;

        apiKeysApi.call('getAdminUserApikeysList', uuid)
            .then((response) => {
                setApiKeys(response.data);
            })
            .catch(() => {
                console.error('Error al cargar las claves API:', error);
                setError(t('No se pudieron cargar las claves API del usuario'));
            });
    };

    useEffect(() => {
        loadApiKeys();
    }, [uuid]);

    // Create a new API key
    const createApiKey = (data: ApiKeyFormValues) => {
        console.log('Creating API key with data:', data, uuid);
        if (!uuid) return;

        setError(null);

        apiKeysApi.call('postAdminUserApikeysCreate', uuid, {
            name: data.name,
            expiresInDays: data.expiresInDays,
        }).then((response) => {
                // Show the token (only visible once)
                setNewKeyToken(response.data.token);
                setSuccessMessage(t('Clave API creada exitosamente'));

                // Reset the form and reload the keys
                reset();
                loadApiKeys();

                // Clear success message after 3 seconds
                setTimeout(() => {
                    setSuccessMessage(null);
                }, 3000);
            },
        ).catch(() => {
            setError(t('Error al crear la clave API'));
        });
    };

    // Revoke (delete) an API key
    const revokeApiKey = async (keyUuid: string) => {
        if (!uuid) return;

        setError(null);

        try {
            await apiKeysApi.call('deleteAdminUserApikeysRevoke', uuid, keyUuid);
            setSuccessMessage(t('Clave API revocada exitosamente'));
            loadApiKeys();

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
        } catch {
            setError(t('Error al revocar la clave API'));
        }
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return '-';
        try {
            return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
        } catch (e) {
            return dateString;
        }
    };

    const formatRelativeDate = (dateString: string | null | undefined) => {
        if (!dateString) return '-';
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="max-w-2xl">
            {/* Error and success messages */}
            {error && (
                <div
                    className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:border-red-400">
                    {error}
                </div>
            )}

            {successMessage && (
                <div
                    className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:border-green-400">
                    {successMessage}
                </div>
            )}

            {/* New key token display - only shown once after creation */}
            {newKeyToken && (
                <div
                    className="mb-4 p-4 bg-amber-50 border border-amber-300 rounded-xl text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                    <h3 className="font-medium mb-2">{t('Nueva clave API generada')}</h3>
                    <p className="mb-2 text-sm">{t('Guarde esta clave ahora. No se mostrará nuevamente:')}</p>
                    <div className="flex">
                        <input
                            type="text"
                            value={newKeyToken}
                            readOnly
                            className="flex-1 py-2 px-3 block w-full rounded-md border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-pumpkin-orange focus:border-pumpkin-orange dark:border-gray-600 dark:bg-gray-700/50 dark:text-white"
                        />
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(newKeyToken);
                                setSuccessMessage(t('Clave copiada al portapapeles'));
                                setTimeout(() => setSuccessMessage(null), 3000);
                            }}
                            className="ml-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl transition-colors"
                        >
                            {t('Copiar')}
                        </button>
                    </div>
                    <button
                        onClick={() => setNewKeyToken(null)}
                        className="mt-3 text-sm text-gray-600 dark:text-gray-400 hover:text-pumpkin-orange dark:hover:text-pumpkin-orange/80"
                    >
                        {t('Entendido, no mostrar más')}
                    </button>
                </div>
            )}

            {/* Create API Key button and form */}
            <div className="mb-6">
                {!showCreateForm ? (
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className={cn(
                            'bg-gradient-to-r from-pumpkin-orange to-pumpkin-orange/80',
                            'text-white shadow-lg shadow-pumpkin-orange/20',
                            'hover:translate-y-[-2px] hover:shadow-xl',
                            'focus:ring-pumpkin-orange/50',
                            'active:translate-y-[1px] active:shadow-md',
                            'rounded-xl py-2.5 px-4 font-medium',
                            'transition-all duration-200 ease-in-out',
                            'flex items-center',
                        )}
                    >
                        <IconAdd className="w-5 h-5 mr-2" />
                        {t('Nueva Clave API')}
                    </button>
                ) : (
                    <div
                        className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm shadow-md">
                        <h3 className="text-lg font-medium mb-3">{t('Crear Nueva Clave API')}</h3>
                        <form className="space-y-4">
                            <InputWithLabel
                                id="apikey-name"
                                label={t('Nombre de la clave')}
                                // helpText={t('Un nombre descriptivo para identificar el propósito de esta clave')}
                                error={errors.name?.message}
                                inputProps={{
                                    ...register('name', {
                                        required: t('El nombre es requerido'),
                                        minLength: {
                                            value: 3,
                                            message: t('El nombre debe tener al menos 3 caracteres'),
                                        },
                                    }),
                                    placeholder: t('Ej: Integración con CRM'),
                                }}
                            />

                            <InputWithLabel
                                id="apikey-expires"
                                label={t('Días de validez')}
                                // helpText={t('Número de días antes de que expire la clave')}
                                error={errors.expiresInDays?.message}
                                inputProps={{
                                    ...register('expiresInDays', {
                                        required: t('Los días de validez son requeridos'),
                                        min: {
                                            value: 1,
                                            message: t('La validez mínima es de 1 día'),
                                        },
                                        max: {
                                            value: 365,
                                            message: t('La validez máxima es de 365 días'),
                                        },
                                    }),
                                    type: 'number',
                                }}
                            />

                            <div className="flex justify-end pt-2 space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateForm(false)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    {t('Cancelar')}
                                </button>

                                <Button
                                    type="button"
                                    disabled={apiKeysApi.isLoading}
                                    className={cn(
                                        'bg-gradient-to-r from-pumpkin-orange to-pumpkin-orange/80',
                                        'text-white shadow-lg shadow-pumpkin-orange/20',
                                        'hover:translate-y-[-2px] hover:shadow-xl',
                                        'focus:ring-pumpkin-orange/50',
                                        'active:translate-y-[1px] active:shadow-md',
                                        'rounded-xl py-2.5 px-4 font-medium',
                                        'transition-all duration-200 ease-in-out',
                                        'flex items-center',
                                    )}
                                    onClick={handleSubmit(createApiKey)}
                                >
                                    {t('Crear Clave API')}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* API Keys DataTable */}
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
                <DataTable<ApiKey>
                    theme={isDark ? 'dark' : undefined}
                    columns={[
                        {
                            name: t('Nombre'),
                            selector: (row) => row.name,
                            sortable: true,
                        },
                        {
                            name: t('Fecha de creación'),
                            selector: (row) => formatDate(row.createdAt),
                            sortable: true,
                        },
                        {
                            name: t('Expira'),
                            selector: (row) => formatDate(row.expiresAt),
                            sortable: true,
                        },
                        {
                            name: t('Último uso'),
                            selector: (row) => row.lastUsedAt ? formatRelativeDate(row.lastUsedAt) : t('Nunca'),
                            sortable: true,
                        },
                        {
                            name: t('Acciones'),
                            cell: (row) => (
                                <ConfirmationTooltip
                                    confirmationMessage={t(
                                        '¿Está seguro que desea revocar esta clave API? Esta acción no se puede deshacer.',
                                    )}
                                    onConfirm={() => revokeApiKey(row.uuid)}
                                    confirmText={t('Revocar')}
                                    confirmButtonClassName="bg-red-500 hover:bg-red-600 text-white"
                                >
                                    <button
                                        className="p-2 text-gray-500 hover:text-red-600 transition-colors !bg-transparent border rounded shadow"
                                        title={t('Revocar clave API')}
                                    >
                                        <IconTrash className="w-5 h-5" />
                                    </button>
                                </ConfirmationTooltip>
                            ),
                        },
                    ]}
                    data={apiKeys?.results || []}
                    progressPending={apiKeysApi.isLoading}
                    pagination
                    paginationTotalRows={apiKeys?.count || 0}
                    paginationPerPage={5}
                    paginationDefaultPage={1}
                    noDataComponent={
                        <div
                            className="p-4 text-center text-gray-500">{t('No hay claves API disponibles para este usuario')}</div>
                    }
                />
            </div>
        </div>
    );
};

export default UseraApiKeysForm;