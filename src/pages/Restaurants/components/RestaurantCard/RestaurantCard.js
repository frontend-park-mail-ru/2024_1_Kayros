import template from './RestaurantCard.hbs';
import './RestaurantCard.scss';

/**
 * Карточка ресторана
 */
class RestaurantCard {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {Object} params - параметры компонента
	 * @param {string} image - URL изображения
	 * @param {string} name - название ресторана (заголовок карточки)
	 * @param {string} description - описание ресторана
	 * @param {string} rating - рейтинг ресторана
	 */

	constructor(parent, { image, name, description, rating }) {
		this.parent = parent;
		this.image = image;
		this.name = name;
		this.description = description;
		this.rating = rating;
	}

	/**
	 * Получение html компонента
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
