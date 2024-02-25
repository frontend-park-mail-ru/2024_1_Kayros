import Button from '../Button';
import Input from '../Input';
import template from './Restaurants.hbs';
import './Restaurants.scss';

class Restaurants {
	constructor() {
		this.parent = document.getElementById('content');
	}

	render() {
		this.parent.insertAdjacentHTML('beforeend', template());

		const example = document.getElementById('restaurants');

		const login = new Input(example, 'beforeend', 'Логин');
		login.render();

		const pass = new Input(example, 'beforeend', 'Пароль', true);
		pass.render();

		const button1 = new Button(example, 'primary', 'Нажми на меня 1', () => alert('1'));
		button1.render();

		const button2 = new Button(example, 'primary', 'Нажми на меня 2', () => alert('2'));
		button2.render();
	}
}

export default Restaurants;
