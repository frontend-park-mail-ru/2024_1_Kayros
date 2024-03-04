import '@fontsource/roboto';
import '@fontsource/montserrat';
import Layout from './components/Layout';
import { router } from './modules/router';
import { routes, urls } from './routes';
import './global.scss';

const root = document.getElementById('root');
const layout = new Layout(root);
layout.render();

Object.entries(routes).forEach(([path, component]) => {
	router.addRoute(path, component);
});

let initialPath;

if (window.location.pathname === urls.base) {
	initialPath = urls.restaurants;
} else {
	initialPath = window.location.pathname;
}

router.navigate(initialPath);
