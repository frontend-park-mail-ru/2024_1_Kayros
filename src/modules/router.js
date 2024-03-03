import NotFoundPage from '../pages/NotFound';

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
	 * Обрабатывает изменение местоположения, отображая соответствующий маршрут или страницу "Не найдено".
	 */
	handleLocationChange() {
		const path = window.location.pathname;
		const currentRoute = this.routes.find((route) => route.path === path);

		const content = document.getElementById('content');
		content.innerHTML = '';

		if (currentRoute) {
			const page = new currentRoute.component(content);
			page.render();
			return;
		}

		const notFoundPage = new NotFoundPage(content);
		notFoundPage.render();
		return;
	}
}

export const router = new Router();
