import RestaurantsPage from '../pages/Restaurants';
import SignInPage from '../pages/SignIn';
import SignUpPage from '../pages/SignUp';
import urls from './urls';

const routes = {
	[urls.restaurants]: RestaurantsPage,
	[urls.signIn]: SignInPage,
	[urls.signUp]: SignUpPage,
};

export { routes, urls };
