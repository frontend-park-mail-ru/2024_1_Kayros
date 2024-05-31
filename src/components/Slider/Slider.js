import Button from '../Button/Button';
import template from './Slider.hbs';
import './Slider.scss';

/**
 * Слайдер
 */
class Slider {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры компонента
	 * @param {object} params.children - элементы слайдера
	 * @param {HTMLIFrameElement} params.frame - frame
	 * @param {object} params.formData - ответы на форму
	 * @param {object} params.focusId - элемент на странице
	 */
	constructor(parent, { frame, children, formData, focusId }) {
		this.parent = parent;
		this.children = children;
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
		const prev = this.parent.querySelector('#form-back-button');
		const next = this.parent.querySelector('#form-next-button');

		this.active++;
		const slider = this.parent.querySelector('.slider');
		this.marginLeft -= this.parent.offsetWidth;
		slider.style.marginLeft = this.marginLeft + 'px';

		if (this.active === this.children.length - 1) {
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
		this.parent.insertAdjacentHTML('afterbegin', template({ items: this.children }));

		this.children.forEach((element) => {
			const max = element.param_type === 'CSAT' ? 5 : 5;

			if (max === 5) {
				const description = this.parent.querySelector(`#slider__description-${element.id}`);
				description.style.width = '50%';
			} else {
				const description = this.parent.querySelector(`#slider__description-${element.id}`);
				description.style.width = '100%';
			}

			for (let rating = 1; rating <= max; rating++) {
				const action = this.parent.querySelector(`#question__answers-${element.id}`);
				const button = new Button(action, {
					id: `question-${element.id}-${rating}`,
					content: rating,
					style: 'clear',
					onClick: () => {
						this.formData = this.formData.filter((cu) => cu.id !== element.id);
						this.formData.push({ id: element.id, rating: rating });

						if (this.activeQuestions[element.id]) {
							const prevButton = action.querySelector(`#question-${element.id}-${this.activeQuestions[element.id]}`);
							prevButton.classList.remove('active');
						}

						const activeButton = action.querySelector(`#question-${element.id}-${rating}`);
						activeButton.classList.add('active');

						this.activeQuestions[element.id] = rating;
					},
				});

				button.render();
			}
		});
	}
}

export default Slider;
