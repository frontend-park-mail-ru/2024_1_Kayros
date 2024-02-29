class Router {
	constructor() {
		this.routes = [];
		window.addEventListener('popstate', this.handleLocationChange.bind(this));
	}

	addRoute(path, component) {
		this.routes.push({ path, component });
		return this;
	}

	navigate(path) {
		window.history.pushState({}, '', path);
		this.handleLocationChange();
	}

	handleLocationChange() {
		const path = window.location.pathname;
		const route = this.routes.find((r) => r.path === path);

		const content = document.getElementById('content');
		content.innerHTML = '';

		if (route) {
			const page = new route.component(content);
			page.render();
		} else {
			const defaultRoute = this.routes.find((r) => r.path === '/restaurants');

			if (defaultRoute) {
				const page = new defaultRoute.component(content);
				page.render();
			} else {
				console.error("Default route '/restaurants' not found.");
			}
		}
	}
}

export const router = new Router();
