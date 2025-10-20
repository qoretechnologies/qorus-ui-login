import ReactDOM from 'react-dom/client';
import './css/app.scss';
import App from './js/app';
import settings from './js/settings';
import { PublicStore } from './js/store/api/utils';

global.env = process.env;

const publicData = await fetch(`${settings.REST_BASE_URL}/public/info`, {
  method: 'GET',
  headers: {
    // JSON content
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

PublicStore.setState(await publicData.json());

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App env={process.env} />);
