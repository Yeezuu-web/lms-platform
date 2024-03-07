import {
  Archive,
  ArchiveX,
  Send,
  Trash2,
  File,
  Users2,
  AlertCircle,
  MessagesSquare,
  ShoppingCart,
  LucideIcon,
  HomeIcon,
  Settings2,
} from 'lucide-react';

export interface SidebarProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    href: string;
  }[];
}

type LinkItemProps = SidebarProps['links'];

export const sidebarOne: LinkItemProps = [
  {
    title: 'Home',
    label: '',
    icon: HomeIcon,
    href: '/dashboard',
  },
  {
    title: 'Users',
    label: '',
    icon: Users2,
    href: '/dashboard/users',
  },
  {
    title: 'Sent',
    label: '',
    icon: Send,
    href: '/dashboard/sent',
  },
  {
    title: 'Junk',
    label: '23',
    icon: ArchiveX,
    href: '/dashboard/sent',
  },
  {
    title: 'Trash',
    label: '',
    icon: Trash2,
    href: '/dashboard/sent',
  },
  {
    title: 'Archive',
    label: '',
    icon: Archive,
    href: '/dashboard/sent',
  },
];

export const sidebarTow: LinkItemProps = [
  {
    title: 'Social',
    label: '972',
    icon: Users2,
    href: '/dashboard/sent',
  },
  {
    title: 'Updates',
    label: '342',
    icon: AlertCircle,
    href: '/dashboard/sent',
  },
  {
    title: 'Forums',
    label: '128',
    icon: MessagesSquare,
    href: '/dashboard/sent',
  },
  {
    title: 'Shopping',
    label: '8',
    icon: ShoppingCart,
    href: '/dashboard/sent',
  },
  {
    title: 'Settings',
    label: '',
    icon: Settings2,
    href: '/dashboard/sent',
  },
];
