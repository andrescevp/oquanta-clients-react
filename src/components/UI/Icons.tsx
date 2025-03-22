import React from 'react';
import { FaRedo, FaTrash} from 'react-icons/fa';
import {GrDrag} from 'react-icons/gr';
import {ImPageBreak} from 'react-icons/im';
import {IoRadioButtonOn, IoText} from 'react-icons/io5';
import {RiInputMethodLine} from 'react-icons/ri';
import {TbLoader3, TbSection} from 'react-icons/tb';
import {VscAdd, VscClose, VscSymbolNumeric} from 'react-icons/vsc';

import {
  AlertCircle, ArrowRight, ArrowUp, BarChart3, Calendar, Check, ChevronDown,ChevronLeft, ChevronRight, ChevronUp,Clipboard, Clock, Cog, ExternalLink,Eye, EyeOff, File, FilePenLine, Files, FileText, GripHorizontal,   GripVertical as GripVerticalIcon ,
Home, LayoutDashboard, LayoutList, LoaderCircle, Lock, LogOut, Mail, MailCheck, MapPin, Menu, MessageCircleQuestion, Moon, Plus,   Plus as PlusIcon2, 
RadioIcon,RefreshCcw, RotateCcw, Save, Search,Settings, Shield, SquareCheckBigIcon,Sun,   Trash2 as TrashIcon2, 
User,UserCog, Users,XIcon} from 'lucide-react';

export const AlertCircleIcon = AlertCircle;
export const FileTextIcon = FileText;
export const HelpCircleIcon = MessageCircleQuestion;
export const SettingsIcon = Cog;
export const TrashIcon = TrashIcon2;
export const PlusIcon = PlusIcon2;
export const GripIcon = GripVerticalIcon;
export const InfoIcon = AlertCircleIcon;
export const CheckboxIcon = SquareCheckBigIcon;
export const RadioButtonIcon = RadioIcon;

export const IconCalendar = Calendar;
export const ClipboardIcon = Clipboard;
export const IconReset = RotateCcw;
export const ArrowUpIcon = ArrowUp;
export const ArrowRightIcon = ArrowRight;
export const EyeIcon = Eye;
export const EyeOffIcon = EyeOff;
export const LockIcon = Lock;
export const MailIcon = Mail;
export const IconClock = Clock;
export const IconExternalLink = ExternalLink;
export const IconGripHorizontal = GripHorizontal;

export const IconTrash = FaTrash;
export const IconFile = File;
export const IconMailCheck = MailCheck;

export const IconDrag = GrDrag;

export const IconClose = VscClose;

export const IconAdd = VscAdd;

export const IconEdit = FilePenLine;

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

export const IconMenu = Menu;

export const IconLightTheme = Sun;
export const IconDarkTheme = Moon;
export const IconHome = Home;
export const IconUser = User;
export const IconLogOut = LogOut;
export const IconShield = Shield;
export const IconUserCog = UserCog;

export const IconSearch = Search;
export const IconPlus = Plus;
export const IconLoaderCircle = LoaderCircle;
export const IconX = XIcon;
export const IconCheck = Check;
export const IconMapPin = MapPin;
export const IconChevronDown = ChevronDown;
export const IconChevronUp = ChevronUp;

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

export default {};