import template from './RestaurantCard.hbs';
import './RestaurantCard.scss';

/**
 * Карточка ресторана
 */
class RestaurantCard {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры компонента
	 * @param {string} params.img_url - URL изображения
	 * @param {string} params.name - название ресторана (заголовок карточки)
	 * @param {string} params.description - описание ресторана
	 * @param {string} params.rating - рейтинг ресторана
	 */
	constructor(parent, { img_url, name, description, rating }) {
		this.parent = parent;
		this.image = img_url;
		this.name = name;
		this.description = description;
		this.rating = rating;
	}

	/**
	 * Получение html компонента
	 * @returns {HTMLDivElement} - html
	 */
	getHTML() {
		return template({ image: this.image, title: this.name, subtitle: this.description, rating: this.rating });
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', this.getHTML());
	}
}

export default RestaurantCard;
