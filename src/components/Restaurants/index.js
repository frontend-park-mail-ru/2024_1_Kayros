import Input from '../Input';
import template from './Restaurants.hbs';
import './styles.scss';

class Restaurants {
	constructor() {
		this.parent = document.getElementById('content');
	}

	render() {
		this.parent.insertAdjacentHTML('beforeend', template());

		const rest = document.getElementById('restaurants');

		const login = new Input(rest, 'beforeend', 'Логин');
		login.render();

		const pass = new Input(rest, 'beforeend', 'Пароль', true);
		pass.render();
	}
}

export default Restaurants;
