import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import template from './RestaurantsPage.hbs';
import './RestaurantsPage.scss';

/**
 * Страница со списком ресторанов
 */
class RestaurantsPage {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 */
	constructor(parent) {
		this.parent = parent;
	}

	/**
	 * Рендеринг страницы
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', template());

		const example = document.getElementById('restaurants');

		const login = new Input(example, { id: 'login', placeholder: 'Логин' });
		login.render();

		const pass = new Input(example, { id: 'password', placeholder: 'Пароль', type: 'password' });
		pass.render();

		const button1 = new Button(example, {
			id: 'example-1',
			content: 'Нажми на меня 1',
			onClick: () => alert('1'),
			disabled: true,
		});

		button1.render();

		const button2 = new Button(example, {
			id: 'example-2',
			content: 'Нажми на меня 2',
			onClick: () => alert('2'),
		});

		button2.render();
	}
}

export default RestaurantsPage;
