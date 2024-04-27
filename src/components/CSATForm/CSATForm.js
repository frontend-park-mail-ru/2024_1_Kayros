import api from '../../modules/api';
import urls from '../../routes/urls';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
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
		this.questions = [];
		this.items = [];
	}

	/**
	 *
	 */
	async getData() {
		await api.getCSATQuestions((data) => {
			this.questions = data;
		});
	}

	/**
	 * Рендеринг компонента
	 */
	async render() {
		const modal = new Modal({
			content: template(),
			className: 'csat-modal',
			url: urls.csatForm,
		});

		modal.render();

		const modalContent = document.getElementById('modal-content');

		await this.getData();

		this.questions.forEach((item) => {
			const div = document.createElement('div');
			div.innerHTML = questionTemplate(item);

			const button = new Button(div, { id: `question-${item.id}`, content: 'дальше' });
			button.render();

			this.items.push(div.innerHTML);
		});

		const form = document.querySelector('.csat-form');

		const slider = new Slider(form, { items: this.items });
		slider.render();

		const nextButton = new Button(modalContent, { id: 'form-next-button', icon: 'right-arrow', style: 'clear' });
		nextButton.render();
	}
}

export default CSATForm;
