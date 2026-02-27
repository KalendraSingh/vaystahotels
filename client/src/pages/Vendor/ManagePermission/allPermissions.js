import { FiBarChart2 } from 'react-icons/fi';

export const permissionList = [
  {
    name: 'Manage Property',
    route: '/manage-hotels',
    icon: FiBarChart2,
    subPermissions: [],
  },
  {
    name: 'Bank KYC',
    route: '/kycform',
    icon: 'bank',
    subPermissions: [],
  },
  {
    name: 'Manage Transactions',
    route: '/transactions',
    icon: 'transactions',
    subPermissions: [],
  },
  {
    name: 'Manage Bookings',
    route: '/bookings',
    icon: 'bookings',
    subPermissions: [],
  },
];
