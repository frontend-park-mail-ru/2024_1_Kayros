import '@fontsource/roboto';
import '@fontsource/montserrat';
import Layout from './components/Layout';
import Notification from './components/Notification/Notification';
import { router } from './modules/router';
import routes from './routes';
import urls from './routes/urls';
import './global.scss';

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

const layout = new Layout(root);
layout.render();

router.addRoutes(routes);

router.navigate(window.location.pathname);

const registerServiceWorker = async () => {
	if (Object.hasOwn(navigator, 'serviceWorker')) {
		try {
			await navigator.serviceWorker.register('service-worker.js', { scope: urls.base });
		} catch (error) {
			console.error(`ServiceWorker registration failed with ${error}`);
		}
	}
};

registerServiceWorker();

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
