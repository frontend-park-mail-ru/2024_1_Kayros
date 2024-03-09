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
};

export { routes };
