import React from 'react';
import { FaRedo, FaTrash } from 'react-icons/fa';
import { GrDrag } from 'react-icons/gr';
import { ImPageBreak } from 'react-icons/im';
import { IoRadioButtonOn, IoText } from 'react-icons/io5';
import { RiInputMethodLine } from 'react-icons/ri';
import { TbLoader3, TbSection } from 'react-icons/tb';
import { VscClose, VscSymbolNumeric } from 'react-icons/vsc';

import {
    AlertCircle,
    ArrowRight,
    ArrowUp,
    BarChart3,
    Calendar,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Clipboard,
    Clock,
    Cog,
    ExternalLink,
    Eye,
    EyeOff,
    File,
    FilePenLine,
    Files,
    FileText,
    GripHorizontal,
    GripVertical as GripVerticalIcon,
    Home,
    Key,
    LayoutDashboard,
    LayoutList,
    LoaderCircle,
    Lock,
    LogOut,
    Mail,
    MailCheck,
    MapPin,
    Menu,
    MessageCircleQuestion,
    Moon,
    Plus,
    Plus as PlusIcon2,
    RadioIcon,
    RefreshCcw,
    RotateCcw,
    Save,
    Search,
    Settings,
    Shield,
    SquareCheckBigIcon,
    Sun,
    Trash2 as TrashIcon2,
    User,
    UserCog,
    Users,
    XIcon,
} from 'lucide-react';

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
export const IconKey = Key;

export const IconDrag = GrDrag;

export const IconClose = VscClose;

export const IconAdd = PlusIcon;

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
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        {...props}>
        <circle cx='9' cy='12' r='1' />
        <circle cx='9' cy='5' r='1' />
        <circle cx='9' cy='19' r='1' />
        <circle cx='15' cy='12' r='1' />
        <circle cx='15' cy='5' r='1' />
        <circle cx='15' cy='19' r='1' />
    </svg>
);

// Add these icon exports

export const BoldIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        {...props}>
        <path d='M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z' />
        <path d='M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z' />
    </svg>
);

export const ItalicIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        {...props}>
        <line x1='19' y1='4' x2='10' y2='4' />
        <line x1='14' y1='20' x2='5' y2='20' />
        <line x1='15' y1='4' x2='9' y2='20' />
    </svg>
);

export const StrikethroughIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        {...props}>
        <line x1='4' y1='12' x2='20' y2='12' />
        <path d='M17.5 10c.5-1 .5-2 0-3-1-2-4-2-6-2h-3a4 4 0 0 0-4 4c0 1.5.8 2.5 2 3' />
        <path d='M17.5 14c.5 1 .5 2 0 3-1 2-4 2-6 2h-3a4 4 0 0 1-4-4c0-1.5.8-2.5 2-3' />
    </svg>
);

export const Heading1Icon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        {...props}>
        <path d='M4 12h8' />
        <path d='M4 18V6' />
        <path d='M12 18V6' />
        <path d='m17 12 3-2v12' />
    </svg>
);

export const Heading2Icon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        {...props}>
        <path d='M4 12h8' />
        <path d='M4 18V6' />
        <path d='M12 18V6' />
        <path d='M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1' />
    </svg>
);

export const Heading3Icon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        {...props}>
        <path d='M4 12h8' />
        <path d='M4 18V6' />
        <path d='M12 18V6' />
        <path d='M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2' />
        <path d='M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2' />
    </svg>
);

export const TypeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        {...props}>
        <polyline points='4 7 4 4 20 4 20 7' />
        <line x1='9' y1='20' x2='15' y2='20' />
        <line x1='12' y1='4' x2='12' y2='20' />
    </svg>
);

export const ListIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        {...props}>
        <line x1='9' y1='6' x2='20' y2='6' />
        <line x1='9' y1='12' x2='20' y2='12' />
        <line x1='9' y1='18' x2='20' y2='18' />
        <circle cx='4' cy='6' r='2' />
        <circle cx='4' cy='12' r='2' />
        <circle cx='4' cy='18' r='2' />
    </svg>
);

export const ListOrderedIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        {...props}>
        <line x1='10' y1='6' x2='21' y2='6' />
        <line x1='10' y1='12' x2='21' y2='12' />
        <line x1='10' y1='18' x2='21' y2='18' />
        <path d='M4 6h1v4' />
        <path d='M4 10h2' />
        <path d='M6 18H4c0-1 2-2 2-3s-1-1.5-2-1' />
    </svg>
);

export const QuoteIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        {...props}>
        <path d='M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z' />
        <path d='M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z' />
    </svg>
);

export const LinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        {...props}>
        <path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' />
        <path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' />
    </svg>
);

export const ImageIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        {...props}>
        <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
        <circle cx='8.5' cy='8.5' r='1.5' />
        <polyline points='21 15 16 10 5 21' />
    </svg>
);

export const CodeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        {...props}>
        <polyline points='16 18 22 12 16 6' />
        <polyline points='8 6 2 12 8 18' />
    </svg>
);

export const SeparatorHorizontalIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        {...props}>
        <line x1='3' y1='12' x2='21' y2='12' />
        <polyline points='8 8 12 4 16 8' />
        <polyline points='16 16 12 20 8 16' />
    </svg>
);

// ...existing code...

export const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        {...props}>
        <circle cx='11' cy='11' r='8' />
        <path d='m21 21-4.3-4.3' />
    </svg>
);

export const PlusCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        {...props}>
        <circle cx='12' cy='12' r='10' />
        <path d='M12 8v8M8 12h8' />
    </svg>
);

// ...existing code...

export default {};
