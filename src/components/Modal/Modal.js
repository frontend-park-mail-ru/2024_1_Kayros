import { router } from '../../modules/router';
import urls from '../../routes/urls';
import template from './Modal.hbs';
import './Modal.scss';

/**
 * Модальное окно
 */
class Modal {
	/**
	 * Конструктор класса
	 */
	constructor() {
		this.parent = document.getElementById('root');
		this.isOpen = false;
		this.rendered = false;
	}

	/**
	 * Функция, определяющая стартовую позицию для открыти модалки
	 */
	detectStartPosition() {
		const loginButton = document.getElementById('header-login-button');
		const modalContent = document.getElementById('modal-content');

		const rect = loginButton.getBoundingClientRect();

		const buttonTop = rect.top;
		const buttonLeft = rect.left + 15;

		const windowWidth = window.innerWidth,
			windowHeight = window.innerHeight;

		const modalWidth = modalContent.offsetWidth,
			modalHeight = modalContent.offsetHeight;

		const x = -(windowWidth / 2 - modalWidth / 2 - buttonLeft);
		const y = -(windowHeight / 2 - modalHeight / 2 - buttonTop);

		modalContent.style.transformOrigin = `${x}px ${y}px`;
	}

	/**
	 * Метод для открытия модалки
	 * @param {HTMLDivElement} element - модалка
	 */
	open(element) {
		if (this.isOpen) return;
		this.isOpen = true;

		this.detectStartPosition();

		setTimeout(() => {
			element.classList.add('modal-open');
		}, 50);
	}

	/**
	 * Метод для закрытия модалки
	 * @param {HTMLDivElement} element - модалка
	 */
	close(element) {
		if (!this.isOpen) return;
		this.isOpen = false;

		element.classList.remove('modal-open');

		window.history.replaceState(
			{ path: router.previousState?.path || urls.restaurants },
			'',
			router.previousState?.path || urls.restaurants,
		);
	}

	/**
	 * Получение html компонента
	 * @returns {HTMLElement} html
	 */
	getHTML() {
		return template();
	}

	/**
	 * Первая отрисовка в дереве
	 */
	firstRender() {
		this.parent.insertAdjacentHTML('beforeend', this.getHTML());
	}

	/**
	 * Открытие/закрытие модалки
	 */
	render() {
		const modalContent = document.getElementById('modal-content');
		const modalWrapper = document.getElementById('modal-wrapper');

		this.open(modalContent);

		const closeOnEsc = (event) => {
			if (event.key === 'Escape') {
				this.close(modalContent);
				modalContent.classList.remove('modal-open');
			}
		};

		window.addEventListener('keydown', closeOnEsc);

		modalContent.addEventListener('click', (event) => {
			event.stopPropagation();
		});

		modalWrapper.addEventListener('click', () => {
			this.close(modalContent);
		});
	}
}

new Modal().firstRender();

export default Modal;
