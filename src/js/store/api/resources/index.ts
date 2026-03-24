import settings from '../../../settings';
import { injectStorageDefaults } from './utils';

export default [
  {
    name: 'currentUser',
    url: `${settings.REST_BASE_URL}/users?action=current`,
    initialState: { data: {} },
    transform: (item) => injectStorageDefaults(item),
  },
  {
    name: 'auth',
    url: `${settings.REST_BASE_URL}/public/login`,
    transform: (item) => item,
  },
  {
    name: 'info',
    url: `${settings.REST_BASE_URL}/public/info`,
    transform: (item) => item,
  },
  {
    name: 'logout',
    url: `${settings.REST_BASE_URL}/logout`,
    transform: (item) => item,
  },
];
