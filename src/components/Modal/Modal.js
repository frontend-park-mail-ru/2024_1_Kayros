import { router } from '../../modules/router';
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
	 * @param {string} params.content - html элемент внутри модалки
	 * @param {string} params.className - дополнительный класс
	 * @param {string} params.url - url, по которому открывается модалка
	 * @param {string} params.initiatorId - id элемента, инициирующего открытие модалки
	 * @param {string} params.closeButton - есть ли у модалки кнопка закрытия
	 * @param {boolean} params.closeOnClick - закрыть при клике вне контента
	 */
	constructor({ content, closeOnClick = true, className = '', url = '', initiatorId = '', closeButton = true }) {
		this.parent = document.querySelector('body');
		this.isOpen = false;
		this.rendered = false;
		this.initiatorId = initiatorId;
		this.content = content;
		this.className = className;
		this.url = url;
		this.closeButton = closeButton;
		this.closeOnClick = closeOnClick;
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

		if (!initiatorElement) {
			return;
		}

		const modalContent = document.getElementById('modal-content');

		const rect = initiatorElement.getBoundingClientRect();

		const buttonTop = rect.top;
		const buttonLeft = rect.left + rect.width / 2;

		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;

		const modalWidth = modalContent.offsetWidth;
		const modalHeight = modalContent.offsetHeight;

		const x = -(windowWidth / 2 - modalWidth / 2 - buttonLeft);
		const y = -(windowHeight / 2 - modalHeight / 2 - buttonTop);

		modalContent.style.transformOrigin = `${x}px ${y}px`;
	}

	/**
	 * Метод для открытия модалки
	 */
	open() {
		if (this.isOpen) {
			return;
		}

		this.detectStartPosition();

		const modalContent = document.getElementById('modal-content');
		modalContent.classList.add('modal-open');

		this.isOpen = true;
	}

	/**
	 * Метод для закрытия модалки
	 */
	close() {
		if (!this.isOpen) {
			return;
		}

		const modalContent = document.getElementById('modal-content');
		const modalWrapper = document.getElementById('modal-wrapper');

		this.detectStartPosition();

		modalContent.classList.remove('modal-open');
		this.isOpen = false;

		setTimeout(() => {
			modalWrapper?.remove();
		}, 100);

		if (this.url) {
			router.navigateFromModal();
		}
	}

	/**
	 * Получение html компонента
	 * @returns {HTMLElement} html
	 */
	getHTML() {
		return template({ content: this.content, className: this.className });
	}

	/**
	 * Добавление обработчиков событий
	 */
	initListeners() {
		const modalWrapper = document.getElementById('modal-wrapper');
		const modalContent = document.getElementById('modal-content');

		const closeOnEsc = (event) => {
			if (event.key === 'Escape') {
				this.close();
			}
		};

		window.addEventListener('keydown', closeOnEsc);

		modalContent.addEventListener('mousedown', (event) => {
			event.stopPropagation();
		});

		modalWrapper.addEventListener('mousedown', () => {
			if (this.closeOnClick) this.close();
		});

		window.addEventListener('popstate', () => {
			if (this.url && window.location.pathname !== this.url) {
				this.close();
			}
		});
	}

	/**
	 * Открытие модалки и создание обработчиков событий
	 */
	render() {
		this.rendered = true;

		this.parent.insertAdjacentHTML('beforeend', this.getHTML());
		const modalContent = document.getElementById('modal-content');

		if (this.closeButton) {
			const closeButton = new Button(modalContent, {
				id: 'modal-close',
				icon: 'close',
				onClick: () => this.close(),
				style: 'clear',
			});

			closeButton.render();
		}

		setTimeout(() => {
			this.open();
		}, 50);

		this.initListeners();
	}
}

export default Modal;
