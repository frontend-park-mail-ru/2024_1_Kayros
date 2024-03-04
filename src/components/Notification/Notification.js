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
		this.parent = document.getElementById('root');
		this.position = 'bottom-right';
		this.id = 'root-notification';
		this.count = 0;
	}

	/**
	 * Получение html компонента
	 */
	getHTML(params) {
		return template({
			position: this.position,
			id: this.id + '-' + this.count,
			...params,
		});
	}

	/**
	 * Функция для закрытия уведомления
	 */
	close() {
		const openNotifications = document.getElementsByClassName('notification-open');
		const lastNotification = openNotifications[openNotifications.length - 1];
		lastNotification?.classList.remove('notification-open');

		if (openNotifications.length == 1) {
			this.count = 0;
		}

		setTimeout(() => {
			lastNotification?.remove();
		}, 50);
	}

	/**
	 * Функция для открытия уведомления
	 * @param {Object} params - параметры
	 * @param {number} duration - время в секундах, после которого плашка исчезает
	 * @param {string} title - заголовок сообщение
	 * @param {string} description - описание
	 */
	open({ duration, ...params }) {
		this.count++;
		this.parent.insertAdjacentHTML('beforeend', this.getHTML(params));

		const element = document.getElementById(`root-notification-${this.count}`);
		const notificationTitle = element.getElementsByClassName('notification-title')[0];

		const closeButton = new Button(notificationTitle, {
			id: 'notification-close',
			icon: 'assets/close.svg',
			onClick: () => this.close(),
			style: 'clear',
		});

		closeButton.render();

		setTimeout(() => {
			element.classList.add('notification-open');
		}, 50);

		if (duration != 0) {
			setTimeout(() => {
				this.close();
			}, duration * 1000);
		}
	}
}

export default new Notification();
