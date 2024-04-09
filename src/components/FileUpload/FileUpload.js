import template from './FileUpload.hbs';
import './FileUpload.scss';

/**
 * Загрузка файла
 */
class FileUpload {
	#parent;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры компонента
	 * @param {void} params.handleFile - обработчик файла
	 * @param {void} params.file - текущий файл
	 */
	constructor(parent, { handleFile, file = '' }) {
		this.#parent = parent;
		this.handleFile = handleFile;
		this.imageSrc = '';
		this.file = file;
	}

	/**
	 * Обработка инпута
	 * @param {InputEvent} event - событие изменения инпута
	 */
	handleChange(event) {
		const image = this.#parent.querySelector('.file-upload__image');

		let reader = new FileReader();

		reader.onload = (event) => {
			this.imageSrc = event.target?.result;
			image.src = event.target?.result;
		};

		if (event.target.files && event.target.files[0]) {
			this.handleFile(event.target.files[0]);
			reader.readAsDataURL(event.target.files[0]);
		}
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.#parent.insertAdjacentHTML('beforeend', template());

		const form = this.#parent.querySelector('.file-upload__form');

		form.onsubmit = (event) => {
			event.preventDefault();
		};

		const input = this.#parent.querySelector('.file-upload__input');

		input.onchange = (event) => {
			this.handleChange(event);
		};

		const fileUpload = this.#parent.querySelector('.file-upload');

		fileUpload.onclick = () => {
			input.click();
		};
	}
}

export default FileUpload;
