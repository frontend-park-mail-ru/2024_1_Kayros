import '@fontsource/inter';
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
