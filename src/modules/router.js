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
	 * Выполняет навигацию по указанному пути
	 * @param {string} path - Путь для навигации
	 * @param {object} params - Параметры навигации
	 * @param {string} params.pageTitle - Заголовок страницы
	 */
	navigate(path, { pageTitle = '' } = {}) {
		const currentPath = window.history.state?.path;
		path = this.normalizePath(path);

		if (path === urls.base) {
			path = urls.restaurants;
		}

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

		document.title = `Resto - ${pageTitle || this.routes[path]?.title || 'Страница не найдена'}`;

		if (currentPath === path) {
			this.handleLocationChange();
			return;
		}

		if (
			(currentPath === urls.signIn && path === urls.signUp) ||
			(currentPath === urls.signUp && path === urls.signIn) ||
			path === urls.address
		) {
			if (path === urls.address) {
				this.previousState = window.history?.state;
			}

			window.history.replaceState({ path }, '', path);
		} else {
			this.previousState = window.history?.state;
			window.history.pushState({ path }, '', path);
		}

		this.handleLocationChange();
	}

	/**
	 *
	 */
	navigateFromModal() {
		const previousPath = this.previousState?.path || urls.restaurants;

		window.history.replaceState({ path: previousPath }, '', previousPath);

		document.title = `Resto - ${this.routes[previousPath]?.title || 'Страница не найдена'}`;
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

		if (window.location.pathname !== urls.address) {
			oldContent?.remove();
		}

		let content;

		if ([urls.signIn, urls.signUp, urls.map].includes(window.location.pathname)) {
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
		const params = {};

		const currentPath = window.location.pathname;
		const urlSegments = currentPath.split('/').slice(1);

		let currentRoute = Object.entries(this.routes).find((route) => {
			const routeSegments = route[0].split('/').slice(1);

			if (routeSegments.length !== urlSegments.length) {
				return false;
			}

			const found = routeSegments.every((pathSegment, i) => {
				return pathSegment === urlSegments[i] || pathSegment[0] === ':';
			});

			if (found) {
				routeSegments.forEach((segment, i) => {
					if (segment[0] === ':') {
						const paramName = segment.slice(1);
						params[paramName] = urlSegments[i];
					}
				});
			}

			return found;
		});

		if (currentRoute) {
			currentRoute = currentRoute[1];
		}

		if (currentPath === urls.base) {
			currentRoute = this.routes[urls.restaurants];
		}

		this.handleChangeInnerLayout();

		const content = document.getElementById('content');

		if (currentRoute) {
      if (path === urls.address && content.children.length === 0) {
				const previousRoute = this.routes[this.previousState?.path || urls.restaurants];
				const previousPage = new previousRoute.component(content);
				previousPage.render();
			}
      
			const page = new currentRoute.component(content);
			page.render();
		}
	}
}

export const router = new Router();
