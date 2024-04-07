import Button from '../../../../components/Button/Button';
import { router } from '../../../../modules/router';
import urls from '../../../../routes/urls';
import template from './Sidebar.hbs';
import './Sidebar.scss';

/**
 * Сайдбар с категориями
 */
class Sidebar {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры компонента
	 * @param {object} params.categories - информация о категориях
	 * @param {number} params.activeCategory - активная категория
	 * @param {void} params.setActiveCategory - обновить активную категорию
	 */
	constructor(parent, { activeCategory, setActiveCategory, categories }) {
		this.parent = parent;
		this.categories = categories;
		this.setActiveCategory = setActiveCategory;
		this.activeCategory = activeCategory;
	}

	/**
	 * Рендеринг компонента
	 */
	async render() {
		this.parent.insertAdjacentHTML('beforeend', template({ categories: this.categories }));

		const buttonContainer = this.parent.querySelector('#button-container');
		const backButton = new Button(buttonContainer, {
			id: 'restaurant-back-button',
			icon: 'back-arrow-full',
			content: 'Все рестораны',
			onClick: () => router.navigate(urls.restaurants),
		});

		backButton.render();

		const categories = this.parent.querySelector('#category-items');
		const items = document.querySelectorAll('.category-item');

		items.forEach((item, i) => {
			if (i === this.activeCategory) {
				item.classList.add('category-active');
			}

			item.addEventListener('mousedown', () => {
				const id = item.id.split('-')[1];

				const category = document.getElementById(`category-${id}`);
				var categoryPosition = category.getBoundingClientRect().top;
				var offsetPosition = categoryPosition + window.scrollY - 118;

				window.scrollTo({
					top: offsetPosition,
					behavior: 'smooth',
				});
			});
		});

		const observerCallback = (entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) {
					entry.target.classList.add('hide');
				} else {
					entry.target.classList.remove('hide');
				}
			});
		};

		const itemsObserver = new IntersectionObserver(observerCallback, {
			root: categories,
			rootMargin: '-10px 0px -20px 0px',
			threshold: 0,
		});

		items.forEach((item) => itemsObserver.observe(item));
	}
}

export default Sidebar;
