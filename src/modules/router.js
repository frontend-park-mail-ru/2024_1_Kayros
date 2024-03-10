import Content from '../components/Content/index.js';
import Header from '../components/Header/index.js';
import NotFoundPage from '../pages/NotFound';
import Restaurants from '../pages/Restaurants/Restaurants.js';
import { routes } from '../routes/index.js';
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
		const currentPath = window.history.state?.path;

		document.title = `Resto - ${routes[path].title}`;

		if (currentPath === path) {
			this.handleLocationChange();
			return;
		}

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

		let content;

		if ([urls.signIn, urls.signUp].includes(window.location.pathname) && this.previousState) {
			return;
		}

		oldContent?.remove();

		if (!header) {
			const header = new Header(layout);
			header.render();
		}

		content = new Content(layout);

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
			if (path === urls.signIn || path === urls.signUp) {
				const restaurants = document.getElementById('restaurants');
				if (!restaurants) new Restaurants(content).render();
			}

			const page = new currentRoute.component(content);
			page.render();
			return;
		}

		const notFoundPage = new NotFoundPage(content);
		notFoundPage.render();
	}
}

export const router = new Router();
