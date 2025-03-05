import { ClassNamesConfig } from 'react-select';

import clsx from 'clsx';

const darkSelectClassNames: ClassNamesConfig = {
  // Contenedor principal
  container: ({ isFocused }) => clsx(
    'text-white dark:bg-dark-800 rounded-md',
    isFocused ? 'ring-1 ring-iris-purple' : ''
  ),

  // Control (caja de entrada principal)
  control: ({ isFocused, isDisabled, menuIsOpen }) => clsx(
    'border dark:border-dark-600 rounded-md bg-transparent',
    'hover:border-iris-purple-60 transition-colors duration-200 dark:bg-dark-800',
    isFocused ? 'border-iris-purple shadow-sm shadow-iris-purple/30' : '',
    menuIsOpen ? 'border-b-0 rounded-b-none' : '',
    isDisabled ? 'bg-dark-700 opacity-70 cursor-not-allowed' : ''
  ),

  // Menú desplegable
  menu: () => clsx(
    'mt-0 rounded-b-md overflow-hidden',
    'dark:bg-dark-800 dark:border dark:border-dark-600 dark:border-t-0',
    'shadow-lg shadow-black/20 z-50'
  ),
  
  // Lista de opciones dentro del menú
  menuList: () => clsx(
    'py-1 dark:bg-dark-800'
  ),
  
  // Opción individual
  option: ({ isDisabled, isFocused, isSelected }) => clsx(
    'px-3 py-2 cursor-default',
    isSelected ? 'dark:bg-iris-purple-60 dark:text-white' : '',
    !isSelected && isFocused ? 'dark:bg-dark-700' : '',
    isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
  ),
  
  // Texto de placeholder
  placeholder: () => clsx(
    'text-dark-400'
  ),
  
  // Valor seleccionado (modo single)
  singleValue: () => clsx(
    'dark:text-white'
  ),
  
  // Valor múltiple (modo multi)
  multiValue: () => clsx(
    'bg-iris-purple-30 dark:bg-iris-purple-60 rounded-sm mr-1 my-0.5 overflow-hidden'
  ),
  
  // Etiqueta de valor múltiple
  multiValueLabel: () => clsx(
    'px-2 py-0.5 text-sm dark:text-white'
  ),
  
  // Botón para eliminar valor múltiple
  multiValueRemove: () => clsx(
    'px-1 hover:bg-pumpkin-orange hover:text-white transition-colors'
  ),
  
  // Contenedor de valores
  valueContainer: () => clsx(
    'px-3 py-1 gap-1'
  ),
  
  // Contenedor de indicadores
  indicatorsContainer: () => clsx(
    'text-dark-400'
  ),
  
  // Indicador de limpieza
  clearIndicator: () => clsx(
    'p-1 mx-1 hover:text-pumpkin-orange rounded-full hover:bg-dark-700 transition-colors'
  ),
  
  // Flecha desplegable
  dropdownIndicator: ({ selectProps }) => clsx(
    'p-1 hover:text-iris-purple transition-colors',
    selectProps.menuIsOpen ? 'text-iris-purple rotate-180' : ''
  ),
  
  // Separador entre indicadores
  indicatorSeparator: () => clsx(
    'dark:bg-dark-600 mx-1'
  ),
  
  // Mensaje de carga
  loadingMessage: () => clsx(
    'py-2 px-3 text-center text-dark-400'
  ),
  
  // Mensaje de "sin opciones"
  noOptionsMessage: () => clsx(
    'py-2 px-3 text-center text-dark-400'
  ),
  
  // Campo de entrada
  input: () => clsx(
    'dark:text-white m-0 p-0'
  ),
  
  // Grupo de opciones
  group: () => clsx(
    'dark:border-dark-600 dark:border-b py-1'
  ),
  
  // Encabezado de grupo
  groupHeading: () => clsx(
    'px-3 py-1 text-xs font-semibold uppercase tracking-wider dark:text-dark-400'
  ),
  
  // Portal del menú (para renderizado fuera del contenedor)
  menuPortal: () => clsx(
    'z-[2000]' // Usamos z-index alto definido en tu tailwind.config.js
  ),
  
  // Indicador de carga
  loadingIndicator: () => clsx(
    'text-iris-purple'
  ),
};

export default darkSelectClassNames;