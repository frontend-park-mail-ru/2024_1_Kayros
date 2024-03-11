import { router } from '../../modules/router';
import Button from '../Button/Button';

/**
 * Кнопка назад
 */
class BackButton {
	#parent;
	#id;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметр компонента
	 * @param {number} params.id - id элемента
	 */
	constructor(parent, { id }) {
		this.#parent = parent;
		this.#id = id;
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		const backButton = new Button(this.#parent, {
			id: this.#id,
			content: router.previousState ? 'Назад' : 'На главную',
			style: 'clear',
			icon: 'assets/back-arrow.svg',
			onClick: () => router.back(),
		});

		backButton.render();
	}
}

export default BackButton;
