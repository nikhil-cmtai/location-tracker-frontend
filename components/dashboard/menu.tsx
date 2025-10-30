import { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Database,
  ListTree,
  Layers3,
  User,
  Factory,
  Cpu,
  Building2,
  Car,
  Truck,
  Users,
  Smartphone,
  HardDrive,
  ClipboardList,
  Wallet,
  UserRound,
  Shield,
  Navigation,
  History,
  Bell,
  Settings,
  Droplets,
  Bus,
  MapPinned,
  FolderTree,
  ListChecks,
  FileSpreadsheet,
  Timer,
  Gauge,
  AlertCircle,
  Repeat,
  Route,
  Globe2,
  BarChart3,
} from 'lucide-react';

/**
 * Menu and submenu items for the sidebar as per requirements
 */
export interface SubMenuItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  subItems?: SubMenuItem[];
}

export const menuItems: MenuItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    id: 'otc',
    label: 'OTC',
    icon: ListTree,
    href: '/dashboard/otc',
    subItems: [
      {
        id: 'hierarchy',
        label: 'Hierarchy',
        href: '/dashboard/otc/hierarchy',
        icon: Layers3,
      },
      {
        id: 'user-level',
        label: 'User Level',
        href: '/dashboard/otc/user-level',
        icon: User,
      },
      {
        id: 'vehicle-manufacturer',
        label: 'Vehicle Manufacturer',
        href: '/dashboard/otc/vehicle-manufacturer',
        icon: Factory,
      },
      {
        id: 'vehicle-type',
        label: 'Vehicle Type',
        href: '/dashboard/otc/vehicle-type',
        icon: Car,
      },
      {
        id: 'vehicle-model',
        label: 'Vehicle Model',
        href: '/dashboard/otc/vehicle-model',
        icon: Truck,
      },
      {
        id: 'vltd-manufacturer',
        label: 'VLTD Manufacturer',
        href: '/dashboard/otc/vltd-manufacturer',
        icon: Factory,
      },
      {
        id: 'vltd-model',
        label: 'VLTD Model',
        href: '/dashboard/otc/vltd-model',
        icon: Cpu,
      },
      {
        id: 'service-provider',
        label: 'Service Provider',
        href: '/dashboard/otc/service-provider',
        icon: Building2,
      },
      {
        id: 're-activation-cost',
        label: 'Re-activation Cost',
        href: '/dashboard/otc/re-activation-cost',
        icon: ClipboardList,
      },
      {
        id: 'activation-plan',
        label: 'Activation Plan',
        href: '/dashboard/otc/activation-plan',
        icon: ClipboardList,
      },
      {
        id: 'renewal-plan',
        label: 'Renewal Plan',
        href: '/dashboard/otc/renewal-plan',
        icon: ClipboardList,
      },
      {
        id: 'owner-type',
        label: 'Owner Type',
        href: '/dashboard/otc/owner-type',
        icon: UserRound,
      },
      {
        id: 'fuel-type',
        label: 'Fuel Type',
        href: '/dashboard/otc/fuel-type',
        icon: Droplets,
      },
      {
        id: 'faq-category',
        label: 'FAQ Category',
        href: '/dashboard/otc/faq-category',
        icon: FolderTree,
      },
      {
        id: 'event-category',
        label: 'Event Category',
        href: '/dashboard/otc/event-category',
        icon: FolderTree,
      },
      {
        id: 'event-configuration',
        label: 'Event Configuration',
        href: '/dashboard/otc/event-configuration',
        icon: Settings,
      },
    ],
  },
  {
    id: 'masters',
    label: 'Masters',
    icon: Database,
    href: '/dashboard/masters',
    subItems: [
      {
        id: 'vlt-device',
        label: 'VLT Device',
        href: '/dashboard/masters/vltd-device',
        icon: HardDrive,
      },
      {
        id: 'sim',
        label: 'SIM',
        href: '/dashboard/masters/sim',
        icon: Smartphone,
      },
      {
        id: 'vehicle',
        label: 'Vehicle',
        href: '/dashboard/masters/vehicles',
        icon: Bus,
      },
      {
        id: 'subscription',
        label: 'Subscription',
        href: '/dashboard/masters/subscriptions',
        icon: Wallet,
      },
      {
        id: 'geo-fence',
        label: 'Geo-Fence',
        href: '/dashboard/masters/geo-fences',
        icon: MapPinned,
      },
    ],
  },
  {
    id: 'features',
    label: 'Features',
    icon: Settings,
    href: '/dashboard/features',
    subItems: [
      {
        id: 'live-tracking',
        label: 'Live Tracking',
        href: '/dashboard/features/live-tracking',
        icon: Navigation,
      },
      {
        id: 'history-replay',
        label: 'History Replay',
        href: '/dashboard/features/history-replay',
        icon: History,
      },
      {
        id: 'events',
        label: 'Events',
        href: '/dashboard/features/events',
        icon: Bell,
      },
    ],
  },
  {
    id: 'user-management',
    label: 'User Management',
    icon: Users,
    href: '/dashboard/user-management',
    subItems: [
      {
        id: 'roles',
        label: 'Roles & Permissions',
        href: '/dashboard/user-management/roles',
        icon: Shield,
      },
      {
        id: 'users',
        label: 'Users',
        href: '/dashboard/user-management/users',
        icon: UserRound,
      },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    href: '/dashboard/reports',
    subItems: [
      {
        id: 'activation-check',
        label: 'Activation Check',
        href: '/dashboard/reports/activation-check',
        icon: ListChecks,
      },
      {
        id: 'raw-data-report',
        label: 'Raw data report',
        href: '/dashboard/reports/raw-data',
        icon: FileSpreadsheet,
      },
      {
        id: 'journey-history',
        label: 'Journey history',
        href: '/dashboard/reports/journey-history',
        icon: Route,
      },
      {
        id: 'nearby-vehicles',
        label: 'Nearby vehicles',
        href: '/dashboard/reports/nearby-vehicles',
        icon: Globe2,
      },
      {
        id: 'vehicle-activity',
        label: 'Vehicle Activity',
        href: '/dashboard/reports/vehicle-activity',
        icon: Gauge,
      },
      {
        id: 'crowd-management',
        label: 'Crowd Management',
        href: '/dashboard/reports/crowd-management',
        icon: Users,
      },
      {
        id: 'idling-summary',
        label: 'Idling summary',
        href: '/dashboard/reports/idling-summary',
        icon: Timer,
      },
      {
        id: 'detailed-idling',
        label: 'Detailed Idling',
        href: '/dashboard/reports/detailed-idling',
        icon: Timer,
      },
      {
        id: 'stoppage-summary',
        label: 'Stoppage Summary',
        href: '/dashboard/reports/stoppage-summary',
        icon: ListChecks,
      },
      {
        id: 'detailed-stoppage',
        label: 'Detailed Stoppage',
        href: '/dashboard/reports/detailed-stoppage',
        icon: ListChecks,
      },
      {
        id: 'vehicle-utilization',
        label: 'Vehicle Utilization',
        href: '/dashboard/reports/vehicle-utilization',
        icon: Car,
      },
      {
        id: 'firmware-details',
        label: 'Firmware Details',
        href: '/dashboard/reports/firmware-details',
        icon: Cpu,
      },
      {
        id: 'current-status',
        label: 'Current Status',
        href: '/dashboard/reports/current-status',
        icon: AlertCircle,
      },
      {
        id: 'over-speed',
        label: 'Over speed',
        href: '/dashboard/reports/over-speed',
        icon: Repeat,
      },
    ],
  },
];

export default menuItems;