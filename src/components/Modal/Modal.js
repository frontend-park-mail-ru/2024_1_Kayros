import { router } from '../../modules/router';
import urls from '../../routes/urls';
import Button from '../Button/Button';
import template from './Modal.hbs';
import './Modal.scss';

/**
 * Модальное окно
 */
class Modal {
	/**
	 * Конструктор класса
	 * @param {object} params - параметры компонента
	 * @param {string} params.initiatorId - id элемента, инициирующего открытие модалки
	 */
	constructor({ initiatorId = '' } = {}) {
		this.parent = document.querySelector('body');
		this.isOpen = false;
		this.rendered = false;
		this.initiatorId = initiatorId;
	}

	/**
	 * Функция, определяющая стартовую позицию для открытия модалки
	 * (при отсутствии инициатора - открытие из центра экрана)
	 */
	detectStartPosition() {
		if (!this.initiatorId) {
			return;
		}

		const initiatorElement = document.getElementById(this.initiatorId);
		const modalContent = document.getElementById('modal-content');

		const rect = initiatorElement.getBoundingClientRect();

		const buttonTop = rect.top;
		const buttonLeft = rect.left + rect.width / 2;

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
		if (this.isOpen) {
			return;
		}

		this.isOpen = true;

		this.detectStartPosition();

		setTimeout(() => {
			element.classList.add('modal-open');
		}, 50);
	}

	/**
	 * Метод для закрытия модалки
	 * @param {HTMLDivElement} element - модалка
	 * @param {boolean} force - не обращать внимание на isOpen (использовать только для кнопки закрытия модалки)
	 */
	close(element, force = false) {
		if (!this.isOpen && !force) {
			return;
		}

		this.isOpen = false;

		this.detectStartPosition();

		element.classList.remove('modal-open');

		router.navigateFromModal();
	}

	/**
	 * Получение html компонента
	 * @returns {HTMLElement} html
	 */
	getHTML() {
		if (window.location.pathname === urls.address) {
			this.isOpen = true;
		} else {
			this.isOpen = false;
		}

		return template({ class: this.isOpen ? 'modal-open' : '' });
	}

	/**
	 * Первая отрисовка в дереве
	 */
	firstRender() {
		this.parent.insertAdjacentHTML('beforeend', this.getHTML());
		const modalContent = document.getElementById('modal-content');

		const closeButton = new Button(modalContent, {
			id: 'modal-close',
			icon: 'assets/close.svg',
			onClick: () => this.close(modalContent, true),
			style: 'clear',
		});

		closeButton.render();
	}

	/**
	 * Открытие модалки и создание обработчиков событий
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

		window.addEventListener('popstate', () => {
			if (window.location.pathname !== urls.address) {
				this.close(modalContent);
			}
		});
	}
}

new Modal().firstRender();

export default Modal;
