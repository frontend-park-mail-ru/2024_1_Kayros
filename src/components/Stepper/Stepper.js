import Button from '../Button/Button';
import template from './Stepper.hbs';
import './Stepper.scss';

/**
 * Прогресс бар
 */
class Stepper {
	#parent;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры
	 * @param {Array<string>} params.steps - шаги
	 */
	constructor(parent, { steps }) {
		this.#parent = parent;
		this.steps = steps;
		this.active = 3;
	}

	/**
	 * Обновление компонента
	 */
	rerender() {
		this.steps.forEach((step, i) => {
			const stepContainer = this.#parent.querySelector(`#stepper__step-${i}`);

			const connector = this.#parent.querySelector(`#stepper__connector-${i}`);

			if (i + 1 <= this.active && i > 0) {
				connector.style.borderColor = '#000';
			} else if (i > 0) {
				connector.style.borderColor = '#dfdfdf';
			}

			const button = stepContainer.querySelector(`#stepper__button-${i}`);

			if (i + 1 <= this.active) {
				button.classList.add('btn--primary');
				button.classList.remove('btn--clear');
			} else {
				button.classList.add('btn--clear');
				button.classList.remove('btn--primary');
			}
		});
	}

	/**
	 * Перейти на следующий шаг
	 */
	nextStep() {
		this.active++;
		this.rerender();
	}

	/**
	 * Перейти на предыдущий шаг
	 */
	prevStep() {
		this.active--;
		this.rerender();
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.#parent.insertAdjacentHTML('beforeend', template({ steps: this.steps }));

		this.steps.forEach((step, i) => {
			const stepContainer = this.#parent.querySelector(`#stepper__step-${i}`);

			if (i + 1 <= this.active && i > 0) {
				const connector = this.#parent.querySelector(`#stepper__connector-${i}`);
				connector.style.borderColor = '#000';
			}

			const button = new Button(stepContainer, {
				id: `stepper__button-${i}`,
				position: 'afterbegin',
				style: i + 1 <= this.active ? 'primary' : 'clear',
				content: i + 1,
			});

			button.render();
		});
	}
}

export default Stepper;
