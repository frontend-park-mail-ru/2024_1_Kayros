import api from '../../modules/api';
import Button from '../Button/Button';
import template from './Slider.hbs';
import './Slider.scss';

/**
 * Лоадер
 */
class Slider {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры компонента
	 * @param {object} params.items - children
	 * @param {HTMLIFrameElement} params.frame - frame
	 * @param {object} params.formData - ответы на форму
	 * @param {object} params.focusId - элемент на странице
	 */
	constructor(parent, { frame, items, formData, focusId }) {
		this.parent = parent;
		this.items = items;
		this.active = 0;
		this.activeQuestions = {};
		this.marginLeft = 0;
		this.formData = formData;
		this.focusId = focusId;
		this.frame = frame;
	}

	/**
	 *
	 */
	prev() {
		if (this.active === 0) return;

		const prev = this.parent.querySelector('#form-back-button');
		const next = this.parent.querySelector('#form-next-button');

		this.active--;
		const slider = this.parent.querySelector('.slider');
		this.marginLeft += this.parent.offsetWidth;
		slider.style.marginLeft = this.marginLeft + 'px';

		if (this.active === 0) {
			prev.style.opacity = 0;
		} else {
			prev.style.opacity = 1;
		}

		next.style.opacity = 1;
		const img = new Image();
		img.src = 'assets/right-arrow.svg';
		next.innerHTML = '';
		next.insertAdjacentElement('beforeend', img);
	}

	/**
	 *
	 */
	next() {
		if (this.active === this.items.length - 1) {
			api.sendCSATQuestions(() => {
				this.frame.style.opacity = 0;
				this.frame.style.bottom = '-60px';

				setTimeout(() => {
					this.parent.remove();
				}, 300);

				if (this.focusId) {
					const element = document.querySelector(`#${this.focusId}`);
					element.parentElement.style.boxShadow = '';
				}
			}, this.formData);

			return;
		}

		const prev = this.parent.querySelector('#form-back-button');
		const next = this.parent.querySelector('#form-next-button');

		this.active++;
		const slider = this.parent.querySelector('.slider');
		this.marginLeft -= this.parent.offsetWidth;
		slider.style.marginLeft = this.marginLeft + 'px';

		if (this.active === this.items.length - 1) {
			const img = new Image();
			img.src = 'assets/send-icon.svg';
			next.innerHTML = '';
			next.insertAdjacentElement('beforeend', img);
		} else {
			next.style.opacity = 1;
		}

		prev.style.opacity = 1;
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('afterbegin', template({ items: this.items }));

		this.items.forEach((question) => {
			const max = question.param_type === 'CSAT' ? 5 : 10;

			if (max === 5) {
				const description = this.parent.querySelector(`#slider__description-${question.id}`);
				description.style.width = '50%';
			} else {
				const description = this.parent.querySelector(`#slider__description-${question.id}`);
				description.style.width = '100%';
			}

			for (let rating = 1; rating <= max; rating++) {
				const action = this.parent.querySelector(`.question__buttons_${question.id}`);
				const button = new Button(action, {
					id: `question-${question.id}-${rating}`,
					content: rating,
					style: 'clear',
					onClick: () => {
						this.formData = this.formData.filter((cu) => cu.id !== question.id);
						this.formData.push({ id: question.id, rating: rating });

						if (this.activeQuestions[question.id]) {
							const prevButton = action.querySelector(`#question-${question.id}-${this.activeQuestions[question.id]}`);
							prevButton.classList.remove('active');
						}

						const activeButton = action.querySelector(`#question-${question.id}-${rating}`);
						activeButton.classList.add('active');

						this.activeQuestions[question.id] = rating;
					},
				});

				button.render();
			}
		});
	}
}

export default Slider;
