import Button from '../../../../components/Button/Button';
import Modal from '../../../../components/Modal/Modal';
import api from '../../../../modules/api';
import template from './Banner.hbs';
import reviewsTemplate from './Reviews.hbs';
import reviewsItems from './ReviewsItems.hbs';
import './Banner.scss';
import './Reviews.scss';

/**
 * Баннер на странице ресторана
 */
class Banner {
	#parent;
	#data;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} data - информация о ресторане
	 */
	constructor(parent, data) {
		this.#parent = parent;
		this.#data = data;
	}

	/**
	 *
	 */
	getReviews() {
		api.getReviewsInfo(this.#data.id, (data) => {
			const reviews = document.querySelector('.reviews');

			if (data?.length > 0) {
				data.forEach((review) => {
					const ratingValues = [];

					for (let i = 0; i < 5; i++) {
						ratingValues.push({ iconSuffix: i + 1 > review.rating ? '-default' : '' });
					}

					review.rating = ratingValues;
				});
			}

			reviews.insertAdjacentHTML('beforeend', reviewsItems({ reviews: data }));
		});
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.#parent.insertAdjacentHTML('beforeend', template(this.#data));

		const banner = document.querySelector('.restaurant-banner__rating');
		const reviewsButton = new Button(banner, {
			id: 'reviews-button',
			content: 'Отзывы',
			style: 'clear',
			onClick: () => {
				const modal = new Modal({
					content: reviewsTemplate(),
					className: 'reviews-modal',
					initiatorId: 'reviews-button',
				});

				modal.render();

				this.getReviews();
			},
		});

		reviewsButton.render();
	}
}

export default Banner;
