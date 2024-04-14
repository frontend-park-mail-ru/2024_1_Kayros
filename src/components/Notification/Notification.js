import Button from '../Button/Button';
import template from './Notification.hbs';
import './Notification.scss';

const MAX_LIST_ELEMENTS_COUNT = 4;

/**
 * Всплывающее окошко с сообщением
 */
class Notification {
	#parent;
	#id;
	#position;
	#count;
	#list;

	/**
	 * Конструктор класса
	 */
	constructor() {
		this.#parent = document.querySelector('body');
		this.#id = 'root-notification';
		this.#position = 'top-right';
		this.#count = 0;
		this.#list = true;
	}

	/**
	 * Получение html компонента
	 * @param {object} params - параметры для шаблона
	 * @param {'success' | 'error'} params.type - тип уведомления
	 * @returns {HTMLDivElement} - html
	 */
	getHTML({ type, ...params }) {
		return template({
			id: `${this.#id}-${this.#count}`,
			position: this.#position,
			icon: `${type === 'success' ? 'success' : 'error'}`,
			...params,
		});
	}

	/**
	 * Функция для анимации сжатого списка при появлении нового уведомоления
	 * @param {HTMLCollection} openNotifications - список открытых уведомлений
	 */
	animateCompressOnOpen(openNotifications) {
		if (openNotifications[0]) {
			openNotifications[0].style.marginTop = '16px';
		}

		if (openNotifications[1]) {
			openNotifications[1].style.marginTop = '10px';
		}

		for (let i = 2; i < openNotifications.length; i++) {
			if (openNotifications.length > i) {
				openNotifications[i - 2].style.opacity = 0;
				openNotifications[i - 1].style.opacity = 0.5;

				let margin = 16;

				for (let j = i - 1; j <= i; j++, margin -= 6) {
					openNotifications[j].style.marginTop = `${margin}px`;
				}
			}
		}
	}

	/**
	 * Функция для анимации развернутого списка при появлении нового уведомоления
	 * @param {HTMLCollection} openNotifications - список открытых уведомлений
	 */
	animateListOnOpen(openNotifications) {
		if (!openNotifications) {
			return;
		}

		let margin = openNotifications[0]?.offsetHeight + 15;

		for (let i = openNotifications.length - 1; i >= 0; i--) {
			if (this.#position.includes('top')) {
				openNotifications[i].style.marginTop = `${margin}px`;
			} else {
				openNotifications[i].style.marginBottom = `${margin}px`;
			}

			openNotifications[i].style.opacity = 1;

			if (i > 0) {
				margin += openNotifications[i].offsetHeight + 15;
			}
		}
	}

	/**
	 * Функция для анимации развернутого списка при удалении
	 * @param {HTMLCollection} openNotifications - список открытых уведомлений
	 */
	animateListOnClose(openNotifications) {
		if (!openNotifications) {
			return;
		}

		let margin = 0;

		for (let i = openNotifications.length - 1; i >= 0; i--) {
			if (this.#position.includes('top')) {
				openNotifications[i].style.marginTop = `${margin}px`;
			} else {
				openNotifications[i].style.marginBottom = `${margin}px`;
			}

			margin += openNotifications[i].offsetHeight + 15;
		}
	}

	/**
	 * Функция для анимации сжатого списка при удалении
	 * @param {HTMLCollection} openNotifications - список открытых уведомлений
	 */
	animateCompressOnClose(openNotifications) {
		const last = openNotifications.length - 1;

		if (openNotifications[last]) {
			openNotifications[last].style.marginTop = '0px';
			openNotifications[last].style.opacity = 1;
		}

		if (openNotifications[last - 1]) {
			openNotifications[last - 1].style.marginTop = '0px';
			openNotifications[last - 1].style.opacity = 1;
		}

		if (openNotifications[last - 2]) {
			openNotifications[last - 2].style.marginTop = '10px';
			openNotifications[last - 2].style.opacity = 1;
		}

		if (openNotifications[last - 3]) {
			openNotifications[last - 3].style.marginTop = '16px';
			openNotifications[last - 3].style.opacity = 0.5;
		}
	}

	/**
	 * Функция для закрытия уведомления
	 * @param {HTMLCollection} element - текущее уведомление
	 */
	close(element) {
		const openNotifications = document.getElementsByClassName('notification--open');

		if (openNotifications.length > MAX_LIST_ELEMENTS_COUNT) {
			this.animateCompressOnOpen(openNotifications);
			this.#list = false;
		} else {
			this.animateListOnOpen(openNotifications);
			this.#list = true;
		}

		if (!this.#list) {
			this.animateCompressOnClose(openNotifications);
		}

		element?.classList.remove('notification--open');

		if (this.#list) {
			this.animateListOnClose(openNotifications);
		}

		setTimeout(() => {
			element?.remove();
		}, 100);

		if (openNotifications.length === 0) {
			this.#count = 0;
		}
	}

	/**
	 * Функция для открытия уведомления
	 * @param {object} params - параметры
	 * @param {number} params.duration - время в секундах, после которого плашка исчезает
	 * @param {string} params.title - заголовок сообщение
	 * @param {string} params.description - описание
	 * @param {'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'} params.position - расположение
	 * @param {'success' | 'error'} params.type - тип уведомления
	 */
	open({ duration, position, ...params }) {
		this.#count++;

		if (position) {
			this.#position = position;
		}

		const openNotifications = document.getElementsByClassName('notification--open');

		if (openNotifications.length > MAX_LIST_ELEMENTS_COUNT - 1) {
			this.animateCompressOnOpen(openNotifications);
			this.#list = false;
		} else {
			this.animateListOnOpen(openNotifications);
			this.#list = true;
		}

		this.#parent.insertAdjacentHTML('beforeend', this.getHTML(params));

		const element = document.getElementById(`root-notification-${this.#count}`);
		const notificationTitle = element.getElementsByClassName('notification__title')[0];

		const closeButton = new Button(notificationTitle, {
			id: 'notification-close',
			icon: 'close',
			onClick: () => this.close(element),
			style: 'clear',
		});

		closeButton.render();

		setTimeout(() => {
			element.classList.add('notification--open');
		}, 20);

		if (duration !== 0) {
			setTimeout(() => {
				this.close(element);
			}, duration * 1000);
		}
	}
}

export default new Notification();
