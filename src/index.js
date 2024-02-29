import '@fontsource/roboto';
import '@fontsource/montserrat';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/Login/Login';
import RegisterPage from './pages/Register/Register';
import RestaurantsPage from './pages/Restaurants';
import { router } from './router';
import './global.scss';

const root = document.getElementById('root');
const layout = new Layout(root);
layout.render();

// Регистрация маршрутов
router
	.addRoute('/restaurants', RestaurantsPage)
	.addRoute('/login', LoginPage)
	.addRoute('/register', RegisterPage)
	.navigate(window.location.pathname);

if (!window.location.pathname || window.location.pathname === '/') {
	router.navigate('/restaurants');
}
// //const content = document.getElementById('content');
// //const restaurantsPage = new RestaurantsPage(content);
// //restaurantsPage.render();
