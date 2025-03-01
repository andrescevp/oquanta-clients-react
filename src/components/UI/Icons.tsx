import React from 'react';
import {FaEdit, FaRedo, FaTrash} from 'react-icons/fa';
import {GrDrag} from 'react-icons/gr';
import {ImPageBreak} from 'react-icons/im';
import {IoRadioButtonOn, IoText} from 'react-icons/io5';
import {RiInputMethodLine} from 'react-icons/ri';
import {TbLoader3, TbSection} from 'react-icons/tb';
import {VscAdd, VscClose, VscSymbolNumeric} from 'react-icons/vsc';

import {LayoutList,RefreshCcw} from 'lucide-react';
import {BarChart3, ChevronLeft, ChevronRight, Files, LayoutDashboard, Save, Settings, Users} from 'lucide-react';

export const IconTrash = FaTrash;

export const IconDrag = GrDrag;

export const IconClose = VscClose;

export const IconAdd = VscAdd;

export const IconEdit = FaEdit;

export const IconLoop = FaRedo;

export const IconPageBreak = ImPageBreak;

export const IconSingleChoice = IoRadioButtonOn;

export const IconText = IoText;

export const IconNumber = VscSymbolNumeric;

export const IconBlock = TbSection;

export const IconInput = RiInputMethodLine;

export const IconDashboard = LayoutDashboard;

export const IconUsers = Users;

export const IconFiles = Files;

export const IconSettings = Settings;

export const IconChevronLeft = ChevronLeft;

export const IconChevronRight = ChevronRight;

export const IconAnalytics = BarChart3;

export const IconSave = Save;

export const IconLoader = TbLoader3;

export const IconRefresh = RefreshCcw;
export const IconLayoutList = LayoutList;

export const IconGripVertical = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <circle cx="9" cy="12" r="1" />
    <circle cx="9" cy="5" r="1" />
    <circle cx="9" cy="19" r="1" />
    <circle cx="15" cy="12" r="1" />
    <circle cx="15" cy="5" r="1" />
    <circle cx="15" cy="19" r="1" />
  </svg>
);

export const IconPlus = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export default {};