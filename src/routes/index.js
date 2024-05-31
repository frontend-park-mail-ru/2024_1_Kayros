import AddressForm from '../components/AddressForm/AddressForm';
import Map from '../components/Map/Map';
import CartPage from '../pages/Cart';
import NotFound from '../pages/NotFound';
import OrderPage from '../pages/Order/Order';
import OrdersPage from '../pages/Orders';
import ProfilePage from '../pages/Profile';
import RestaurantPage from '../pages/Restaurant';
import RestaurantsPage from '../pages/Restaurants';
import SearchPage from '../pages/Search';
import SignInPage from '../pages/SignIn';
import SignUpPage from '../pages/SignUp';
import StatisticPage from '../pages/Statistic';
import SurveyPage from '../pages/Survey';
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
	[urls.cart]: {
		title: 'Корзина',
		component: CartPage,
	},
	[urls.profile]: {
		title: 'Профиль',
		component: ProfilePage,
	},
	[urls.order]: {
		title: 'Заказ',
		component: OrderPage,
	},
	[urls.orders]: {
		title: 'Заказы',
		component: OrdersPage,
	},
	[urls.search]: {
		title: 'Поиск',
		component: SearchPage,
	},
	[urls.statistic]: {
		title: 'Статистика',
		component: StatisticPage,
	},
	[urls.survey]: {
		title: 'Опрос',
		component: SurveyPage,
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
