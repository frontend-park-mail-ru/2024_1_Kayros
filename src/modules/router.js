import Content from '../components/Content/index.js';
import Header from '../components/Header/index.js';
import Notification from '../components/Notification/Notification.js';
import { SUCCESS_MESSAGES } from '../constants/index.js';
import urls from '../routes/urls.js';

/**
 * Класс для маршрутизации в одностраничном приложении (SPA).
 * Обеспечивает навигацию без перезагрузки страницы.
 */
class Router {
	/**
	 * Создает экземпляр роутера.
	 */
	constructor() {
		this.previousState = null;
		this.samePage = false;
		this.routes = {};
		window.addEventListener('popstate', this.handleLocationChange.bind(this));
	}

	/**
	 * Добавляет маршруты в список маршрутов роутера.
	 * @param {object} routes - объект, содеражщий маршруты
	 * @returns {ThisType} - контекст
	 */
	addRoutes(routes) {
		this.routes = routes;
		return this;
	}

	/**
	 * Нормализует путь, удаляя повторяющиеся слеши и конечный слеш.
	 * @param {string} path - Путь для нормализации.
	 * @returns {string} Нормализованный путь.
	 */
	normalizePath(path) {
		if (!path) {
			return undefined;
		}

		const noRepeatSlashes = path.replace(/\/\/+/g, '/');
		return noRepeatSlashes !== '/' ? noRepeatSlashes.replace(/\/+$/, '') : '/';
	}
	/**
	 * Выполняет навигацию по указанному пути.
	 * @param {string} path - Путь для навигации.
	 */
	navigate(path) {
		const currentPath = window.history.state?.path;
		path = this.normalizePath(path);

		const user = localStorage.getItem('user-info');

		if (user && [urls.signIn, urls.signUp].includes(window.location.pathname)) {
			window.history.replaceState({ path: urls.restaurants }, '', urls.restaurants);
			this.handleLocationChange();

			Notification.open({
				duration: 3,
				title: SUCCESS_MESSAGES.repeatLoginTry.title,
				description: SUCCESS_MESSAGES.repeatLoginTry.description,
				type: 'success',
			});

			return;
		}

		document.title = `Resto - ${this.routes[path]?.title || 'Страница не найдена'}`;

		if (currentPath === path) {
			this.samePage = true;
			this.handleLocationChange();
			return;
		}

		this.samePage = false;

		if (
			(currentPath === urls.signIn && path === urls.signUp) ||
			(currentPath === urls.signUp && path === urls.signIn)
		) {
			window.history.replaceState({ path }, '', path);
		} else {
			this.previousState = window.history?.state;
			window.history.pushState({ path }, '', path);
		}

		this.handleLocationChange();
	}

	/**
	 * Возвращает на шаг назад в истории
	 */
	back() {
		if (this.previousState) {
			this.previousState = window.history?.state;
			window.history.back();
		} else {
			this.navigate(urls.restaurants);
		}
	}

	/**
	 * Очищает layout страницы
	 */
	handleChangeInnerLayout() {
		const layout = document.getElementById('layout');
		const header = document.getElementById('header');
		const oldContent = document.getElementById('content');

		if (!(window.location.pathname === urls.restaurants && this.samePage)) {
			oldContent?.remove();
		}

		let content;

		if ([urls.signIn, urls.signUp].includes(window.location.pathname)) {
			header?.remove();

			content = new Content(layout, { withoutPadding: true });
		} else {
			if (!header) {
				const header = new Header({ navigate: this.navigate.bind(this) });
				header.render();
			}

			content = new Content(layout);
		}

		const currentContent = document.getElementById('content');

		if (!currentContent) {
			content.render();
		}
	}

	/**
	 * Обрабатывает изменение местоположения, отображая соответствующий маршрут.
	 */
	handleLocationChange() {
		const path = window.location.pathname;
		const currentRoute = this.routes[path];

		this.handleChangeInnerLayout();

		const content = document.getElementById('content');

		if (currentRoute) {
			const page = new currentRoute.component(content);
			page.render();
			return;
		}
	}
}

export const router = new Router();
