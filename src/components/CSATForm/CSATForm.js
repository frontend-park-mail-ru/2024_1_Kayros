import api from '../../modules/api';
import Button from '../Button/Button';
import Slider from '../Slider/Slider';
import template from './CSATForm.hbs';
import questionTemplate from './QuestionTemplate.hbs';
import './CSATForm.scss';

/**
 * Форма с вопросами для клиентов
 */
class CSATForm {
	/**
	 * Конструктор класса
	 */
	constructor() {
		this.questions = { defaultQuestions: [], focusQuestions: {} };
		this.formData = [];
	}

	/**
	 * Получение вопросов
	 */
	async getData() {
		await api.getCSATQuestions((data) => {
			const defaultQuestions = data.filter((item) => !item.focus_id);

			this.questions.defaultQuestions = defaultQuestions;

			this.questions.focusQuestions = data.reduce((acc, item) => {
				if (!item.focus_id) {
					return acc;
				}

				if (acc[item.focus_id]) {
					acc[item.focus_id].push(item);
				} else {
					acc[item.focus_id] = [item];
				}

				return acc;
			}, {});
		}, window.location.pathname);
	}

	/**
	 * Создание элементов вопросов
	 * @param {Array<object>} items - информация о вопросах
	 * @returns {Array<object>} - элементы с вопросами
	 */
	getSliderChildren(items) {
		const elements = [];

		items.forEach((item) => {
			const div = document.createElement('div');
			div.innerHTML = questionTemplate(item);

			elements.push({ content: div.innerHTML, ...item });
		});

		return elements;
	}

	/**
	 * Наполнение фрейма вопросами
	 * @param {HTMLIFrameElement} frame - iframe элемент
	 * @param {object} params - параметры
	 * @param {Array<HTMLElement>} params.questionElements - элементы опросника
	 * @param {HTMLElement} params.focusElement - целевой элемент
	 */
	setFrame(frame, { questionElements, focusElement }) {
		const cssLink = document.createElement('link');
		cssLink.href = 'styles.css';
		cssLink.rel = 'stylesheet';
		cssLink.type = 'text/css';
		cssLink.id = 'frame-stylesheet';

		frame.srcdoc = template();
		frame.style.opacity = 0;
		frame.style.bottom = '-60px';
		frame.style.pointerEvents = 'all';

		if (focusElement) {
			frame.style.transition = '0.4s';
			frame.style.position = 'absolute';
			frame.style.zIndex = 100;
			frame.style.border = 0;
			frame.style.width = '100%';
			frame.style.height = '100%';
		}

		frame.onload = () => {
			frame.contentWindow.document.head.appendChild(cssLink);

			const frameStylesheet = frame.contentDocument.querySelector('#frame-stylesheet');

			const form = frame.contentDocument.querySelector('.csat-form');

			frameStylesheet.onload = async () => {
				setTimeout(() => {
					frame.style.opacity = 1;

					if (focusElement) {
						frame.style.bottom = 0;

						form.style.zIndex = 101;

						focusElement.parentElement.style.boxShadow = 'rgb(0 0 0 / 28%) 0px 0px 30px 15px';

						form.style.left = '10px';
						form.style.bottom = '10px';
						return;
					}

					frame.style.bottom = '-20px';
				}, 200);
			};

			const slider = new Slider(form, {
				frame,
				formData: this.formData,
				children: questionElements,
				focusId: focusElement?.id,
			});

			slider.render();

			const action = document.createElement('div');
			action.className = 'question__navigation-buttons';
			form.appendChild(action);

			const backButton = new Button(action, {
				id: 'form-back-button',
				icon: 'back-arrow',
				style: 'clear',
				onClick: () => slider.prev(),
			});

			backButton.render();

			const prevBtn = form.querySelector('#form-back-button');
			prevBtn.style.opacity = 0;

			const nextButton = new Button(action, {
				id: 'form-next-button',
				style: 'clear',
				icon: questionElements.length > 1 ? 'right-arrow' : 'send-icon',
				onClick: () => {
					if (slider.active === questionElements.length - 1) {
						api.sendCSATQuestions(() => {
							frame.style.opacity = 0;
							frame.style.bottom = '-60px';
							frame.style.pointerEvents = 'none';

							setTimeout(() => {
								if (focusElement) {
									frame.remove();
								} else {
									form.remove();
								}
							}, 300);

							if (focusElement) {
								focusElement.parentElement.style.boxShadow = '';
							}
						}, slider.formData);

						return;
					}

					slider.next();
				},
			});

			nextButton.render();

			const closeButton = new Button(form, {
				id: 'csat-close-button',
				style: 'clear',
				icon: 'close',
				onClick: () => {
					if (focusElement) {
						focusElement.parentElement.style.boxShadow = '';
					}

					frame.style.opacity = 0;
					frame.style.bottom = '-60px';
					frame.style.pointerEvents = 'none';
					setTimeout(() => {
						if (focusElement) {
							frame.remove();
						}

						form.remove();
					}, 300);
				},
			});

			closeButton.render();
		};
	}

	/**
	 * Рендеринг компонента
	 */
	async render() {
		await this.getData();

		const defaultChildren = this.getSliderChildren(this.questions.defaultQuestions);

		const frame = document.querySelector('iframe');

		if (defaultChildren.length > 0) {
			this.setFrame(frame, { questionElements: defaultChildren, focus: false });
		}

		Object.entries(this.questions.focusQuestions).forEach(([focusId, questions]) => {
			if (!questions) {
				return;
			}

			const newFrame = document.createElement('iframe');
			newFrame.style.opacity = 0;

			const focusElement = document.getElementById(focusId);
			focusElement.appendChild(newFrame);

			if (!focusElement) return;

			const focusChildren = this.getSliderChildren(questions);

			const focusFrame = focusElement.querySelector('iframe');

			if (focusChildren.length > 0) {
				this.setFrame(focusFrame, { questionElements: focusChildren, focusElement });
			}
		});
	}
}

export default new CSATForm();
