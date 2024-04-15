import Notification from '../Notification/Notification.js';
import template from './FileUpload.hbs';
import './FileUpload.scss';

// это 10Мб
const MAX_FILE_SIZE = 1000000;

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
		event.preventDefault();
		event.stopPropagation();

		const image = this.#parent.querySelector('.file-upload__image');

		let reader = new FileReader();

		const [file] = event.target.files || [];

		if (file) {
			const size = file.size;

			if (size > MAX_FILE_SIZE) {
				Notification.open({
					duration: 3,
					title: 'Превышен размер файла',
					description: 'Размер файла должен быть меньше 10Мб',
					type: 'error',
				});

				return;
			}
		}

		reader.onload = (event) => {
			this.imageSrc = event.target?.result;
			image.src = event.target?.result;
		};

		if (file) {
			this.handleFile(file);
			reader.readAsDataURL(file);
		}
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.#parent.insertAdjacentHTML('beforeend', template({ file: this.file }));

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

		const image = this.#parent.querySelector('.file-upload__image');

		const deleteButton = this.#parent.querySelector('.file-upload__delete');

		deleteButton.onclick = async (event) => {
			event.stopPropagation();

			image.src = '/minio-api/users/default.jpg';

			const res = await fetch('/minio-api/users/default.jpg');
			const blob = await res.blob();
			const file = new File([blob], 'image.png', blob);

			this.handleFile(file);
		};
	}
}

export default FileUpload;
