import '@fontsource/roboto';
import '@fontsource/montserrat';
import Layout from './components/Layout';
import { router } from './modules/router';
import routes from './routes';
import './global.scss';

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

const layout = new Layout(root);
layout.render();

router.addRoutes(routes);

router.navigate(window.location.pathname);

const registerServiceWorker = async () => {
	if ('serviceWorker' in navigator) {
		try {
			await navigator.serviceWorker.register('service-worker.js', { scope: '/' });
		} catch (error) {
			console.error(`ServiceWorker registration failed with ${error}`);
		}
	}
};

registerServiceWorker();
