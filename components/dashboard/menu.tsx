import { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Zap,
  Database,
  Users,
  BarChart3,
  MapPin,
  Bell,
  Navigation,
  Factory,
  Cpu,
  Smartphone,
  HardDrive,
  Building2,
  Car,
  Truck,
  UserCircle,
  Bus,
  MapPinned,
  ClipboardList,
  Wallet,
  UserRound,
  Shield,
  Building,
  Route,
  CarFront,
  UserCheck,
  FileSpreadsheet,
} from 'lucide-react';

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
    id: 'features',
    label: 'Features',
    icon: Zap,
    href: '/dashboard/features',
    subItems: [
      {
        id: 'geofence',
        label: 'Geofence',
        href: '/dashboard/features/geofence',
        icon: MapPin,
      },
      {
        id: 'alerts',
        label: 'Alerts & Notifications',
        href: '/dashboard/features/alerts',
        icon: Bell,
      },
      {
        id: 'tracking',
        label: 'Live Tracking',
        href: '/dashboard/features/tracking',
        icon: Navigation,
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
        id: 'vltd-manufacturer',
        label: 'VLTD Manufacturer',
        href: '/dashboard/masters/vltd-manufacturer',
        icon: Factory,
      },
      {
        id: 'vltd-model',
        label: 'VLTD Model',
        href: '/dashboard/masters/vltd-model',
        icon: Cpu,
      },
      {
        id: 'sim-services',
        label: 'SIM Services',
        href: '/dashboard/masters/sim-services',
        icon: Smartphone,
      },
      {
        id: 'vlt-devices',
        label: 'VLT Devices',
        href: '/dashboard/masters/vlt-devices',
        icon: HardDrive,
      },
      {
        id: 'vehicle-manufacturer',
        label: 'Vehicle Manufacturer',
        href: '/dashboard/masters/vehicle-manufacturer',
        icon: Building2,
      },
      {
        id: 'vehicle-type',
        label: 'Vehicle Type',
        href: '/dashboard/masters/vehicle-type',
        icon: Car,
      },
      {
        id: 'vehicle-model',
        label: 'Vehicle Model',
        href: '/dashboard/masters/vehicle-model',
        icon: Truck,
      },
      {
        id: 'vehicle-owner',
        label: 'Vehicle Owner',
        href: '/dashboard/masters/vehicle-owner',
        icon: UserCircle,
      },
      {
        id: 'vehicles',
        label: 'Vehicles',
        href: '/dashboard/masters/vehicles',
        icon: Bus,
      },
      {
        id: 'geo-fences',
        label: 'Geo-Fences',
        href: '/dashboard/masters/geo-fences',
        icon: MapPinned,
      },
      {
        id: 'plans',
        label: 'Plans',
        href: '/dashboard/masters/plans',
        icon: ClipboardList,
      },
      {
        id: 'subscriptions',
        label: 'Subscriptions',
        href: '/dashboard/masters/subscriptions',
        icon: Wallet,
      },
    ],
  },
  {
    id: 'user-management',
    label: 'User Management',
    icon: Users,
    href: '/dashboard/users',
    subItems: [
      {
        id: 'users',
        label: 'Users',
        href: '/dashboard/users/list',
        icon: UserRound,
      },
      {
        id: 'roles',
        label: 'Roles & Permissions',
        href: '/dashboard/users/roles',
        icon: Shield,
      },
      {
        id: 'business-accounts',
        label: 'Business Accounts',
        href: '/dashboard/users/business-accounts',
        icon: Building,
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
        id: 'trip-reports',
        label: 'Trip Reports',
        href: '/dashboard/reports/trips',
        icon: Route,
      },
      {
        id: 'vehicle-reports',
        label: 'Vehicle Reports',
        href: '/dashboard/reports/vehicles',
        icon: CarFront,
      },
      {
        id: 'driver-reports',
        label: 'Driver Reports',
        href: '/dashboard/reports/drivers',
        icon: UserCheck,
      },
      {
        id: 'summary-reports',
        label: 'Summary Reports',
        href: '/dashboard/reports/summary',
        icon: FileSpreadsheet,
      },
    ],
  },
];

export default menuItems;