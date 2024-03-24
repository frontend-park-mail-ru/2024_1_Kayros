import AddressForm from '../components/AddressForm/AddressForm';
import Map from '../components/Map/Map';
import NotFound from '../pages/NotFound';
import RestaurantPage from '../pages/Restaurant';
import RestaurantsPage from '../pages/Restaurants';
import SignInPage from '../pages/SignIn';
import SignUpPage from '../pages/SignUp';
import urls from './urls';

const routes = {
	[urls.restaurants]: {
		title: 'Рестораны',
		component: RestaurantsPage,
	},
	[urls.restaurant]: {
		title: 'Ресторан',
		component: RestaurantPage,
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
	[urls.map]: {
		title: 'Карта',
		component: Map,
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
