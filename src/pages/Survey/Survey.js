import Button from '../../components/Button';
import Input from '../../components/Input';
import { router } from '../../modules/router';
import urls from '../../routes/urls';
import template from './Survey.hbs';
import './Survey.scss';

/**
 * Класс спользуется для отображения сообщения об отсутствии страницы или ресурса.
 */
class Survey {
	#parent;

	/**
	 * Создает экземпляр страницы Survey.
	 * @param {HTMLDivElement} parent - родительский элемент
	 */
	constructor(parent) {
		this.#parent = parent;
	}
	/**
	 * Рендер страницы.
	 */
	render() {
		const html = template();
		this.#parent.insertAdjacentHTML('beforeend', html);

		const searchBlock = this.#parent.querySelector('.survey__search-input');
		const searchInput = new Input(searchBlock, {
			id: 'restaurants-search',
			placeholder: '',
		});

		searchInput.render();

		new Button(document.querySelector('.plus-button'), {
			id: 'plus-button',
			content: 'добавить вопрос',
			onClick: () => {
				searchInput.render();
			},
		}).render();

		new Button(document.querySelector('.plusBlock-button'), {
			id: 'plusBlock-button',
			content: 'добавить блок',
			onClick: () => {
				this.addNewBlock();
			},
		}).render();

		new Button(document.querySelector('.not-found__return-button'), {
			id: 'return-to-home',
			content: 'Вернуться на главную',
			onClick: () => {
				router.navigate(urls.restaurants);
			},
		}).render();
	}

	/**
	 *
	 */
	addNewBlock() {
		const newBlock = document.createElement('div');
		newBlock.className = 'block';
		newBlock.textContent = 'Новый блок'; // Добавляем текст или другой контент

		const container = this.#parent.querySelector('.not-found'); // Используем #parent для обращения к элементу
		container.appendChild(newBlock);

		// Создание и рендеринг поля поиска
		const searchBlock = this.#parent.querySelector('.survey__search-input');
		const searchInput = new Input(searchBlock, {
			id: 'restaurants-search',
			placeholder: 'Поиск ресторанов', // Устанавливаем placeholder, если нужно
		});

		searchInput.render();

		// Создание и рендеринг кнопки
		new Button(document.querySelector('.plus-button'), {
			id: 'plus-button',
			content: 'Добавить вопрос',
			onClick: () => {
				searchInput.render(); // Повторный рендеринг поля поиска при клике
			},
		}).render();
	}
}

export default Survey;
