import Modal from '../components/Modal/Modal';
import RestaurantsPage from '../pages/Restaurants';
import SignUpPage from '../pages/SignUp';
import urls from './urls';

const routes = {
	[urls.restaurants]: {
		title: 'Рестораны',
		component: RestaurantsPage,
	},
	[urls.signIn]: {
		title: 'Вход',
		component: Modal,
	},
	[urls.signUp]: {
		title: 'Регистрация',
		component: SignUpPage,
	},
};

export { routes };
