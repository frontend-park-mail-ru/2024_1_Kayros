import AddressForm from '../components/AddressForm/AddressForm';
import NotFound from '../pages/NotFound';
import RestaurantsPage from '../pages/Restaurants';
import SignInPage from '../pages/SignIn';
import SignUpPage from '../pages/SignUp';
import urls from './urls';

const routes = {
	[urls.restaurants]: {
		title: 'Рестораны',
		component: RestaurantsPage,
	},
	[urls.signIn]: {
		title: 'Вход',
		component: SignInPage,
	},
	[urls.signUp]: {
		title: 'Регистрация',
		component: SignUpPage,
	},
	[urls.address]: {
		title: 'Поиск адреса',
		component: AddressForm,
	},
};

const invalidRouteCatcher = {
	get(object, key) {
		if (key in object) {
			return object[key];
		}

		return { title: 'Страница не найдена', component: NotFound };
	},
};

const safeRoutes = new Proxy(routes, invalidRouteCatcher);

export default safeRoutes;
