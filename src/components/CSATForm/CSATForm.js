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
		this.items = [];
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
	 * Рендеринг компонента
	 */
	async render() {
		this.items = [];

		await this.getData();

		const frame = document.querySelector('iframe');

		const cssLink = document.createElement('link');
		cssLink.href = 'styles.css';
		cssLink.rel = 'stylesheet';
		cssLink.type = 'text/css';
		cssLink.id = 'frame-stylesheet';

		frame.srcdoc = template();
		frame.style.opacity = 0;
		frame.style.bottom = '-60px';

		frame.onload = () => {
			if (this.questions.defaultQuestions.length === 0) {
				return;
			}

			frame.contentWindow.document.head.appendChild(cssLink);

			const frameStylesheet = frame.contentDocument.querySelector('#frame-stylesheet');

			frameStylesheet.onload = async () => {
				frame.style.opacity = 1;
				frame.style.bottom = '-20px';
			};

			const form = frame.contentDocument.querySelector('.csat-form');

			const slider = new Slider(form, { frame, formData: this.formData, items: this.items });
			slider.render();

			const action = document.createElement('div');
			action.className = 'question__buttons_q';
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
				icon: this.items.length > 1 ? 'right-arrow' : 'send-icon',
				onClick: () => {
					slider.next();
				},
			});

			nextButton.render();

			const closeButton = new Button(form, {
				id: 'csat-close-button',
				style: 'clear',
				icon: 'close',
				onClick: () => {
					frame.style.opacity = 0;
					frame.style.bottom = '-60px';
					setTimeout(() => {
						form.remove();
					}, 300);
				},
			});

			closeButton.render();
		};

		this.questions.defaultQuestions.forEach((item) => {
			const div = document.createElement('div');
			div.innerHTML = questionTemplate(item);

			this.items.push({ content: div.innerHTML, ...item });
		});

		Object.entries(this.questions.focusQuestions).forEach(([focusId, items]) => {
			const questions = [];

			if (!items) {
				return;
			}

			const newFrame = document.createElement('iframe');
			newFrame.style.opacity = 0;
			newFrame.style.bottom = '-40px';
			newFrame.style.transition = '0.4s';
			newFrame.style.position = 'absolute';

			const map = document.getElementById(focusId);

			map.appendChild(newFrame);

			newFrame.srcdoc = template();

			const cssLink = document.createElement('link');
			cssLink.href = 'styles.css';
			cssLink.rel = 'stylesheet';
			cssLink.type = 'text/css';
			cssLink.id = 'frame-stylesheet';

			if (!map) return;

			items.forEach((item) => {
				const div = document.createElement('div');
				div.innerHTML = questionTemplate(item);

				questions.push({ content: div.innerHTML, ...item });
			});

			const mapFrame = map.querySelector('iframe');
			mapFrame.style.zIndex = 100;

			mapFrame.style.border = 0;
			mapFrame.style.width = '100%';
			mapFrame.style.height = '100%';

			mapFrame.onload = () => {
				newFrame.contentWindow.document.head.appendChild(cssLink);

				const frameStylesheet = mapFrame.contentDocument.querySelector('#frame-stylesheet');

				frameStylesheet.onload = async () => {
					mapFrame.style.bottom = 0;
					mapFrame.style.opacity = 1;
				};

				const form = mapFrame.contentDocument.querySelector('.csat-form');

				form.style.zIndex = 101;

				map.parentElement.style.boxShadow = 'rgb(0 0 0 / 28%) 0px 0px 30px 15px';

				form.style.left = '10px';
				form.style.bottom = '10px';

				const slider = new Slider(form, { frame: newFrame, formData: this.formData, items: questions, focusId });
				slider.render();

				const action = document.createElement('div');
				action.className = 'question__buttons_q';
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
					icon: questions.length > 1 ? 'right-arrow' : 'send-icon',
					onClick: () => slider.next(),
				});

				nextButton.render();

				const closeButton = new Button(form, {
					id: 'csat-close-button',
					icon: 'close',
					style: 'clear',
					onClick: () => {
						map.parentElement.style.boxShadow = '';
						newFrame.style.opacity = 0;
						setTimeout(() => {
							mapFrame.remove();
						}, 300);
					},
				});

				closeButton.render();
			};
		});
	}
}

export default new CSATForm();
