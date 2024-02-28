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
	 * @param {string} title - заголовок карточки
	 * @param {string} subtitle - описание карточки
	 * @param {string} rating - рейтинг ресторана
	 */

	constructor(parent, { image, title, subtitle, rating }) {
		this.parent = parent;
		this.image = image;
		this.title = title;
		this.subtitle = subtitle;
		this.rating = rating;
	}

	/**
	 * Получение html компонента
	 */
	getHTML() {
		return template({ image: this.image, title: this.title, subtitle: this.subtitle, rating: this.rating });
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', this.getHTML());
	}
}

export default RestaurantCard;
