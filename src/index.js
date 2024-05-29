import '@fontsource/montserrat';
import * as VKID from '@vkid/sdk';
import { Notification } from 'resto-ui';
import Layout from './components/Layout';
import { router } from './modules/router';
import routes from './routes';
import urls from './routes/urls';
import './global.scss';

VKID.Config.set({
	app: '51915631',
	redirectUrl: 'https://b440-195-19-45-172.ngrok-free.app/api/v1/vk',
	state: '',
});

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

const layout = new Layout(root);
layout.render();

const urlSearchParams = new URLSearchParams(window.location.search);

router.addRoutes(routes);

if (window.location.pathname.includes('api/v1/vk')) {
	router.navigate(urls.restaurants);

} else {
	router.navigate(window.location.pathname, { searchParams: urlSearchParams });
}

if (process.env.CACHE_ENABLE) {
	const registerServiceWorker = async () => {
		if ('serviceWorker' in navigator) {
			try {
				await navigator.serviceWorker.register('service-worker.js', { scope: urls.base });
			} catch (error) {
				console.error(`ServiceWorker registration failed with ${error}`);
			}
		}
	};

	registerServiceWorker();
}

window.addEventListener('online', () =>
	Notification.open({
		duration: 6,
		title: 'Соединение восстановлено!',
		description: 'С возвращением в интернет',
		type: 'success',
	}),
);

window.addEventListener('offline', () =>
	Notification.open({
		duration: 6,
		title: 'Упс... соединение потеряно!',
		description: 'Сайт работает в офлайн режиме',
		type: 'error',
	}),
);
