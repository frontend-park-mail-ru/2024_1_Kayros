import { router } from '../../modules/router';
import template from './Link.hbs';
import './Link.scss';

/**
 * Ссылка
 */
class Link {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры компонента
	 * @param {string} params.href - url страницы на которую перенаправлять
	 * @param {string} params.text - текст ссылки
	 */
	constructor(parent, { id, href, text }) {
		this.parent = parent;
		this.id = id;
		this.href = href;
		this.text = text;
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', template({ text: this.text, id: this.id }));

		const link = this.parent.querySelector(`#${this.id}`);

		link.addEventListener('click', () => {
			router.navigate(this.href);
		});
	}
}

export default Link;
