import RestaurantsPage from '../pages/Restaurants';
import SignInPage from '../pages/SignIn';
import SignUpPage from '../pages/SignUp';

const urls = {
	base: '/',
	restaurants: '/restaurants',
	signIn: '/signin',
	signUp: '/signup',
};

const routes = {
	[urls.restaurants]: RestaurantsPage,
	[urls.signIn]: SignInPage,
	[urls.signUp]: SignUpPage,
};

export { routes, urls };
