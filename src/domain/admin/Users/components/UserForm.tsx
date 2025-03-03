import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { User, UserCreate, UsersApi,UserUpdate } from '../../../../api-generated/api';
import { IconSave } from '../../../../components/UI/Icons';
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

type FormValues = Omit<User, 'uuid'>

interface UserFormProps {
  uuid?: string;
  userData?: User;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// eslint-disable-next-line complexity
const UserForm: React.FC<UserFormProps> = ({ 
  uuid,
  userData,
  onSuccess,
  onCancel
}) => {
  const { t } = useTranslation();
  const usersApi = useApi(UsersApi);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch,
    formState: { errors } 
  } = useForm<FormValues>({
    defaultValues: userData ? {
        email: userData.email,
        name: userData.name,
        lastName: userData.lastName,
        roles: userData.roles
    } : {
      email: '',
      name: '',
      lastName: '',
      roles: []
    }
  });
  
  const watchedRoles = watch('roles');

  // Manejar cambios en los roles seleccionados
  const handleRoleToggle = (roleId: string) => {
    const currentRoles = watchedRoles || [];
    if (currentRoles.includes(roleId)) {
      setValue('roles', currentRoles.filter(r => r !== roleId));
    } else {
      setValue('roles', [...currentRoles, roleId]);
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
          roles: data.roles
        };
        await usersApi.call('putApiUsersUpdate', userData.uuid, updateData);
      } else {
        // Crear nuevo usuario
        const createData: UserCreate = {
          email: data.email,
          name: data.name,
          lastName: data.lastName,
          roles: data.roles
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
    }

  return (
    <div className="p-6 max-w-2xl">      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <InputWithLabel
          id="email"
          label={t('Email')}
          error={errors.email && t(errors.email.message || 'El email no tiene un formato válido')}
          inputProps={{
            type: "email",
            ...register('email', { 
              required: t('El email es obligatorio'),
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t('El email no tiene un formato válido')
              }
            })
          }}
        />
        
        {/* Nombre */}
        <InputWithLabel
          id="name"
          label={t('Nombre')}
          error={errors.name && t(errors.name.message || 'El nombre es obligatorio')}
          inputProps={{
            type: "text",
            ...register('name', { required: t('El nombre es obligatorio') })
          }}
        />
        
        {/* Apellido */}
        <InputWithLabel
          id="lastName"
          label={t('Apellido')}
          error={errors.lastName && t(errors.lastName.message || 'El apellido es obligatorio')}
          inputProps={{
            type: "text",
            ...register('lastName', { required: t('El apellido es obligatorio') })
          }}
        />
        
        {/* Roles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('Roles')}
          </label>
          <div className="space-y-2">
            {AVAILABLE_ROLES.map((role) => (
              <div key={role.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`role-${role.id}`}
                  checked={watchedRoles?.includes(role.id) || false}
                  onChange={() => handleRoleToggle(role.id)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`role-${role.id}`} className="ml-2 text-sm text-gray-700">
                  {t(role.label)}
                </label>
              </div>
            ))}
          </div>
          {errors.roles && (
            <p className="mt-1 text-sm text-red-600">{t(errors.roles.message as string)}</p>
          )}
        </div>
        
        {/* Botones de acción */}
        <div className="flex justify-between items-center">
            <div>
          {userData?.uuid && (            
    <ConfirmationTooltip
        confirmationMessage={t('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')}
        onConfirm={deleteUser}
        confirmText={t('Eliminar')}
        confirmButtonClassName="bg-red-500 hover:bg-red-600"
        disabled={loading}
    >
        <ButtonLoader
            type="button"
            className={cn(
            "btn bg-red-600 text-white hover:bg-red-700",
            )}
            disabled={loading}
            loading={loading}
            icon={<IconSave className='w-5 h-5'/>}
        >
            {t('Eliminar') }
        </ButtonLoader>
    </ConfirmationTooltip>)}
            </div>
            
        <div className="flex justify-end space-x-2 flex-grow">
          <ButtonLoader
            type="submit"
            disabled={loading}
            loading={loading}
            icon={<IconSave className='w-5 h-5'/>}
          >
            {userData?.uuid 
              ? t('Actualizar') 
              : t('Crear')
            }
          </ButtonLoader>
        </div>
        </div>
      </form>
    </div>
  );
};

export default UserForm;