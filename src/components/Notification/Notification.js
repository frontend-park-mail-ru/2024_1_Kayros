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

	animateOnOpen() {
		const openNotifications = document.getElementsByClassName('notification-open');

		if (openNotifications[0]) openNotifications[0].style.marginTop = '16px';
		if (openNotifications[1]) openNotifications[1].style.marginTop = '10px';

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

	animateOnClose() {
		const openNotifications = document.getElementsByClassName('notification-open');

		const penult = openNotifications.length - 2;

		if (openNotifications[penult]) {
			openNotifications[penult].style.marginTop = 0;
			openNotifications[penult].style.opacity = 1;
		}

		if (openNotifications[penult - 1]) {
			openNotifications[penult - 1].style.marginTop = '10px';
			openNotifications[penult - 1].style.opacity = 1;
		}

		if (openNotifications[penult - 2]) {
			openNotifications[penult - 2].style.marginTop = '16px';
			openNotifications[penult - 2].style.opacity = 0.5;
		}
	}

	/**
	 * Функция для закрытия уведомления
	 */
	close(element) {
		this.animateOnClose();

		const openNotifications = document.getElementsByClassName('notification-open');

		element?.classList.remove('notification-open');

		if (openNotifications.length == 1) {
			this.count = 0;
		}

		setTimeout(() => {
			element?.remove();
		}, 100);
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
		this.animateOnOpen();

		this.parent.insertAdjacentHTML('beforeend', this.getHTML(params));

		const element = document.getElementById(`root-notification-${this.count}`);
		const notificationTitle = element.getElementsByClassName('notification-title')[0];

		const closeButton = new Button(notificationTitle, {
			id: 'notification-close',
			icon: 'assets/close.svg',
			onClick: () => this.close(element),
			style: 'clear',
		});

		closeButton.render();

		setTimeout(() => {
			element.classList.add('notification-open');
		}, 50);

		if (duration != 0) {
			setTimeout(() => {
				this.close(element);
			}, duration * 1000);
		}
	}
}

export default new Notification();
