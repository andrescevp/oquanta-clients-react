import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { User, UserCreate, UserInvitationsApi, UsersApi, UserUpdate } from '../../../../api-generated/api';
import { IconMailCheck, IconSave } from '../../../../components/UI/Icons';
import ButtonLoader from '../../../../components/UI/molecules/ButtonLoder';
import { ConfirmationTooltip } from '../../../../components/UI/molecules/ConfirmationTooltip';
import InputWithLabel from '../../../../components/UI/molecules/InputWithLabel';
import { useApi } from '../../../../hooks/useApi';
import { cn } from '../../../../lib/utils';

// Roles disponibles en el sistema
const AVAILABLE_ROLES = [
    { id: 'ROLE_ADMIN', label: 'Administrador' },
    { id: 'ROLE_USER', label: 'Usuario' },
];

type FormValues = Omit<User, 'uuid'>;

interface UserFormProps {
    uuid?: string;
    userData?: User;
    onSuccess?: () => void;
    onCancel?: () => void;
}

// eslint-disable-next-line complexity
const UserForm: React.FC<UserFormProps> = ({ uuid, userData, onSuccess, onCancel }) => {
    const { t } = useTranslation();
    const usersApi = useApi(UsersApi);
    const userInvitationApi = useApi(UserInvitationsApi);
    const [loading, setLoading] = useState<boolean>(false);
    const [invitationLoading, setInvitationLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [invitationSuccess, setInvitationSuccess] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: userData
            ? {
                  email: userData.email,
                  name: userData.name,
                  lastName: userData.lastName,
                  roles: userData.roles,
              }
            : {
                  email: '',
                  name: '',
                  lastName: '',
                  roles: [],
              },
    });

    const watchedRoles = watch('roles');
    const email = watch('email');

    // Manejar cambios en los roles seleccionados
    const handleRoleToggle = (roleId: string) => {
        const currentRoles = watchedRoles || [];
        if (currentRoles.includes(roleId)) {
            setValue(
                'roles',
                currentRoles.filter(r => r !== roleId),
            );
        } else {
            setValue('roles', [...currentRoles, roleId]);
        }
    };

    // Send invitation to the user
    const sendInvitation = async () => {
        if (!userData?.uuid || !email) return;

        setInvitationLoading(true);
        setError(null);
        setInvitationSuccess(false);

        try {
            await userInvitationApi.call('postApiSendUserInvitation', {
                userUuid: userData.uuid,
            });

            setInvitationSuccess(true);

            // Reset success message after 3 seconds
            setTimeout(() => {
                setInvitationSuccess(false);
            }, 3000);
        } catch (err) {
            console.error('Error al enviar invitación:', err);
            setError(t('No se pudo enviar la invitación al usuario'));
        } finally {
            setInvitationLoading(false);
        }
    };

    // Enviar el formulario
    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        setError(null);

        try {
            if (userData && userData.uuid) {
                // Actualizar usuario existente
                const updateData: UserUpdate = {
                    email: data.email,
                    name: data.name,
                    lastName: data.lastName,
                    roles: data.roles,
                };
                await usersApi.call('putApiUsersUpdate', userData.uuid, updateData);
            } else {
                // Crear nuevo usuario
                const createData: UserCreate = {
                    email: data.email,
                    name: data.name,
                    lastName: data.lastName,
                    roles: data.roles,
                };
                await usersApi.call('postApiUsersCreate', createData);
            }

            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            console.error('Error al guardar usuario:', err);
            setError(t('No se pudo guardar la información del usuario'));
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async () => {
        if (!userData || !userData.uuid) {
            return;
        }
        setLoading(true);
        setError(null);

        try {
            await usersApi.call('deleteApiUsersDelete', userData.uuid);
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            console.error('Error al eliminar usuario:', err);
            setError(t('No se pudo eliminar el usuario'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-6 max-w-2xl'>
            {error && (
                <div className='mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:border-red-400'>
                    {error}
                </div>
            )}

            {invitationSuccess && (
                <div className='mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:border-green-400 flex items-center'>
                    <svg
                        className='w-5 h-5 mr-2'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        xmlns='http://www.w3.org/2000/svg'>
                        <path
                            fillRule='evenodd'
                            d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                            clipRule='evenodd'></path>
                    </svg>
                    {t('Invitación enviada correctamente')}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                {/* Email */}
                <InputWithLabel
                    id='email'
                    label={t('Email')}
                    error={errors.email && t(errors.email.message || 'El email no tiene un formato válido')}
                    inputProps={{
                        type: 'email',
                        ...register('email', {
                            required: t('El email es obligatorio'),
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: t('El email no tiene un formato válido'),
                            },
                        }),
                    }}
                />

                {/* Nombre */}
                <InputWithLabel
                    id='name'
                    label={t('Nombre')}
                    error={errors.name && t(errors.name.message || 'El nombre es obligatorio')}
                    inputProps={{
                        type: 'text',
                        ...register('name', { required: t('El nombre es obligatorio') }),
                    }}
                />

                {/* Apellido */}
                <InputWithLabel
                    id='lastName'
                    label={t('Apellido')}
                    error={errors.lastName && t(errors.lastName.message || 'El apellido es obligatorio')}
                    inputProps={{
                        type: 'text',
                        ...register('lastName', { required: t('El apellido es obligatorio') }),
                    }}
                />

                {/* Roles */}
                <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        {t('Roles')}
                    </label>
                    <div className='space-y-2'>
                        {AVAILABLE_ROLES.map(role => (
                            <div key={role.id} className='flex items-center'>
                                <input
                                    type='checkbox'
                                    id={`role-${role.id}`}
                                    checked={watchedRoles?.includes(role.id) || false}
                                    onChange={() => handleRoleToggle(role.id)}
                                    className='h-4 w-4 rounded border-gray-300 text-pumpkin-orange focus:ring-pumpkin-orange/50 dark:border-gray-600 dark:bg-gray-700/50'
                                />
                                <label
                                    htmlFor={`role-${role.id}`}
                                    className='ml-2 text-sm text-gray-700 dark:text-gray-200'>
                                    {t(role.label)}
                                </label>
                            </div>
                        ))}
                    </div>
                    {errors.roles && (
                        <p className='mt-1.5 text-sm text-red-600 dark:text-red-400'>
                            {t(errors.roles.message as string)}
                        </p>
                    )}
                </div>

                {/* Botones de acción */}
                <div className='flex flex-wrap justify-between items-center gap-3'>
                    <div className='flex gap-2'>
                        {userData?.uuid && (
                            <>
                                <ConfirmationTooltip
                                    confirmationMessage={t(
                                        '¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.',
                                    )}
                                    onConfirm={deleteUser}
                                    confirmText={t('Eliminar')}
                                    confirmButtonClassName='bg-red-500 hover:bg-red-600'
                                    disabled={loading}>
                                    <ButtonLoader
                                        type='button'
                                        className={cn(
                                            'bg-gradient-to-r from-red-500 to-red-500/80',
                                            'text-white shadow-lg shadow-red-500/20',
                                            'hover:translate-y-[-2px] hover:shadow-xl',
                                            'focus:ring-red-500/50',
                                            'active:translate-y-[1px] active:shadow-md',
                                            'rounded-xl py-2.5 px-4 font-medium',
                                        )}
                                        disabled={loading}
                                        loading={loading}>
                                        {t('Eliminar')}
                                    </ButtonLoader>
                                </ConfirmationTooltip>

                                {/* Invitation Button */}
                                <ButtonLoader
                                    type='button'
                                    onClick={sendInvitation}
                                    disabled={invitationLoading || loading || !email}
                                    loading={invitationLoading}
                                    icon={<IconMailCheck className='w-5 h-5' />}
                                    className={cn(
                                        'bg-gradient-to-r from-iris-purple to-iris-purple/80',
                                        'text-white shadow-lg shadow-iris-purple/20',
                                        'hover:translate-y-[-2px] hover:shadow-xl',
                                        'focus:ring-iris-purple/50',
                                        'active:translate-y-[1px] active:shadow-md',
                                        'rounded-xl py-2.5 px-4 font-medium',
                                        'disabled:opacity-60 disabled:pointer-events-none',
                                    )}>
                                    {t('Enviar invitación')}
                                </ButtonLoader>
                            </>
                        )}
                    </div>

                    <div className='ml-auto'>
                        <ButtonLoader
                            type='submit'
                            disabled={loading}
                            loading={loading}
                            icon={<IconSave className='w-5 h-5' />}
                            className={cn(
                                'bg-gradient-to-r from-pumpkin-orange to-pumpkin-orange/80',
                                'text-white shadow-lg shadow-pumpkin-orange/20',
                                'hover:translate-y-[-2px] hover:shadow-xl',
                                'focus:ring-pumpkin-orange/50',
                                'active:translate-y-[1px] active:shadow-md',
                                'rounded-xl py-2.5 px-4 font-medium',
                            )}>
                            {userData?.uuid ? t('Actualizar') : t('Crear')}
                        </ButtonLoader>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UserForm;
