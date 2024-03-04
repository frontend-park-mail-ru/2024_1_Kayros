import Button from '../Button/Button';
import template from './Notification.hbs';
import './Notification.scss';

/**
 * Всплывающее окошко с сообщением
 */
class Notification {
	/**
	 * Конструктор класса
	 */
	constructor() {
		this.isOpen = false;
		this.parent = document.getElementById('root');
		this.position = 'bottom-right';
		this.id = 'root-notification';
	}

	/**
	 * Получение html компонента
	 */
	getHTML(params) {
		return template({
			open: '',
			position: this.position,
			id: this.id,
			...params,
		});
	}

	/**
	 * Функция для закрытия уведомления
	 */
	close() {
		if (!this.isOpen) return;

		const element = document.getElementById('root-notification');
		element.classList.remove('notification-open');
		this.isOpen = false;

		setTimeout(() => {
			element.remove();
		}, 300);
	}

	/**
	 * Функция для открытия уведомления
	 * @param {Object} params - параметры
	 * @param {number} duration - время в секундах, после которого плашка исчезает
	 * @param {string} title - заголовок сообщение
	 * @param {string} description - описание
	 */
	open({ duration, ...params }) {
		if (this.isOpen) return;

		this.parent.insertAdjacentHTML('beforeend', this.getHTML(params));

		const element = document.getElementById('root-notification');
		const notificationTitle = document.getElementById('notification-title');

		const closeButton = new Button(notificationTitle, {
			id: 'notification-close',
			icon: 'assets/close.svg',
			onClick: () => this.close(),
		});

		closeButton.render();

		setTimeout(() => {
			element.classList.add('notification-open');
			this.isOpen = true;
		}, 100);

		if (duration != 0) {
			setTimeout(() => {
				this.close();
			}, duration * 1000);
		}
	}
}

export default new Notification();
