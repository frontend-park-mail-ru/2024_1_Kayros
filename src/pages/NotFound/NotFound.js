import Button from '../../components/Button';
import { urls } from '../../routes/index.js';
// import { router } from '../../modules/router';
import template from './NotFound.hbs';
import './NotFound.scss';

/**
 * Класс спользуется для отображения сообщения об отсутствии страницы или ресурса.
 */
class NotFound {
	/**
	 * Создает экземпляр страницы NotFound.
	 * @param {Element} parent Элемент DOM, в который будет рендериться страница "Не найдено".
	 */
	constructor(parent) {
		this.parent = parent;
	}
	/**
	 * Рендер страницы.
	 */
	render() {
		const html = template();
		this.parent.insertAdjacentHTML('beforeend', html);
		new Button(document.getElementById('return-button'), {
			id: 'return-to-home',
			content: 'Вернуться на главную',
			onClick: () => {
				window.location.href = urls.base;
				// router.navigate(urls.restaurants);
			},
		}).render();
	}
}

export default NotFound;
