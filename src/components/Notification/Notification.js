import Button from '../Button/Button';
import template from './Notification.hbs';
import './Notification.scss';

const MAX_LIST_ELEMENTS_COUNT = 3;

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
		this.list = true;
	}

	/**
	 * Получение html компонента
	 * @param {Object} params - параметры для шаблона
	 */
	getHTML(params) {
		return template({
			position: this.position,
			id: this.id + '-' + this.count,
			...params,
		});
	}

	/**
	 * Функция для анимации сжатого списка при появлении нового уведомоления
	 * @param {HTMLCollection} openNotifications - список открытых уведомлений
	 */
	animateCompressOnOpen(openNotifications) {
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

	/**
	 * Функция для анимации развернутого списка при появлении нового уведомоления
	 * @param {HTMLCollection} openNotifications - список открытых уведомлений
	 */
	animateListOnOpen(openNotifications) {
		if (!openNotifications) return;

		let margin = openNotifications[0]?.offsetHeight + 15;

		for (let i = openNotifications.length - 1; i >= 0; i--) {
			openNotifications[i].style.marginTop = `${margin}px`;
			openNotifications[i].style.opacity = 1;

			if (i > 0) margin += openNotifications[i].offsetHeight + 15;
		}
	}

	/**
	 * Функция для анимации развернутого списка при удалении
	 * @param {HTMLCollection} openNotifications - список открытых уведомлений
	 */
	animateListOnClose(openNotifications) {
		if (!openNotifications) return;

		let margin = 0;

		for (let i = openNotifications.length - 1; i >= 0; i--) {
			openNotifications[i].style.marginTop = `${margin}px`;

			margin += openNotifications[i].offsetHeight + 15;
		}
	}

	/**
	 * Функция для анимации сжатого списка при удалении
	 * @param {HTMLCollection} openNotifications - список открытых уведомлений
	 */
	animateCompressOnClose(openNotifications) {
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
	 * @param {HTMLCollection} openNotifications - список открытых уведомлений
	 */
	close(element) {
		const openNotifications = document.getElementsByClassName('notification-open');

		if (openNotifications.length > MAX_LIST_ELEMENTS_COUNT) {
			this.animateCompressOnOpen(openNotifications);
			this.list = false;
		} else {
			this.animateListOnOpen(openNotifications);
			this.list = true;
		}

		if (!this.list) {
			this.animateCompressOnClose(openNotifications);
		}

		element?.classList.remove('notification-open');

		if (this.list) {
			this.animateListOnClose(openNotifications);
		}

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

		const openNotifications = document.getElementsByClassName('notification-open');

		if (openNotifications.length > MAX_LIST_ELEMENTS_COUNT) {
			this.animateCompressOnOpen(openNotifications);
			this.list = false;
		} else {
			this.animateListOnOpen(openNotifications);
			this.list = true;
		}

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
