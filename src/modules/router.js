import Content from '../components/Content';
import Header from '../components/Header';
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
		this.routes = [];
		window.addEventListener('popstate', this.handleLocationChange.bind(this));
	}

	/**
	 * Добавляет маршрут в список маршрутов роутера.
	 * @param {string} path - Путь маршрута.
	 * @param {Function} component - Компонент, соответствующий маршруту.
	 * @returns {ThisType} - контекст
	 */
	addRoute(path, component) {
		this.routes.push({ path, component });
		return this;
	}

	/**
	 * Выполняет навигацию по указанному пути.
	 * @param {string} path - Путь для навигации.
	 */
	navigate(path) {
		window.history.pushState({}, '', path);
		this.handleLocationChange();
	}

	/**
	 * Очищает layout страницы
	 */
	handleChangeInnerLayout() {
		const layout = document.getElementById('layout');
		const header = document.getElementById('header');
		const oldContent = document.getElementById('content');

		oldContent?.remove();
		let content;

		if ([urls.signIn, urls.signUp].includes(window.location.pathname)) {
			header?.remove();

			content = new Content(layout, { withoutPadding: true });
		} else {
			if (!header) {
				const header = new Header();
				header.render();
			}

			content = new Content(layout);
		}

		content.render();
	}

	/**
	 * Обрабатывает изменение местоположения, отображая соответствующий маршрут или страницу "Не найдено".
	 */
	handleLocationChange() {
		const path = window.location.pathname;
		const currentRoute = this.routes.find((route) => route.path === path);

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
