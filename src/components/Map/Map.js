import template from './Map.hbs';
import './Map.scss';

const MAX_ZOOM = 20;

/**
 * Карта
 */
class Map {
	#parent;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры карты
	 * @param {number} params.startX - начальная точка по оси X
	 * @param {number} params.startY - начальная точка по оси Y
	 * @param {number} params.startZoom - начальное приближение
	 */
	constructor(parent, { startX = 0, startY = 0, startZoom = 6 } = {}) {
		this.#parent = parent;
		this.indentLeft = -startX;
		this.indentTop = -startY;
		this.scale = startZoom;
	}

	/**
	 * Создание элемента картинки
	 * @param {string} url - путь до картинки
	 * @returns {Promise} - изображение
	 */
	async loadImage(url) {
		return new Promise((resolve) => {
			const img = new Image();
			img.src = url;

			img.onload = () => resolve(img);
		});
	}

	/**
	 * Трансформация карты
	 * @param {HTMLElement} map - карта
	 */
	transform(map) {
		if (this.indentLeft > 0) {
			this.indentLeft = 0;
		}

		if (this.indentTop > 0) {
			this.indentTop = 0;
		}

		if (this.indentLeft < -map.offsetWidth * this.scale + window.innerWidth) {
			this.indentLeft = -map.offsetWidth * this.scale + window.innerWidth;
		}

		if (this.indentTop < -map.offsetHeight * this.scale + window.innerHeight) {
			this.indentTop = -map.offsetHeight * this.scale + window.innerHeight;
		}

		map.style.transform = `translate(${this.indentLeft}px, ${this.indentTop}px) scale(${this.scale})`;
	}

	/**
	 * Функция для перемещения элемента мышкой
	 * @param {MouseEvent} event - карты
	 * @param {HTMLElement} map - карты
	 */
	dragDrop(event, map) {
		const dragStartX = event.clientX - this.indentLeft;
		const dragStartY = event.clientY - this.indentTop;

		document.onmousemove = (event) => {
			this.indentLeft = event.clientX - dragStartX;
			this.indentTop = event.clientY - dragStartY;

			this.transform(map);
		};

		document.onmouseup = () => {
			document.onmousemove = null;
		};
	}

	/**
	 * Функция для приближения и удаления карты
	 * @param {MouseEvent} event - mouse wheel событие
	 * @param {HTMLElement} map - карта
	 */
	zoom(event, map) {
		const currentX = (event.clientX - this.indentLeft) / this.scale;
		const currentY = (event.clientY - this.indentTop) / this.scale;

		const delta = -event.deltaY;

		if (delta > 0) {
			this.scale *= 1.03;
		}

		if (delta < 0 && (map.offsetWidth * this.scale) / 1.03 > window.innerWidth) {
			this.scale /= 1.03;
		}

		this.scale = Math.min(this.scale, MAX_ZOOM);

		this.indentLeft = event.clientX - currentX * this.scale;
		this.indentTop = event.clientY - currentY * this.scale;

		this.transform(map);
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.#parent.insertAdjacentHTML('beforeend', template());

		const map = document.getElementById('canvas-map');
		const ctx = map.getContext('2d');

		map.style.transform = `translate(${this.indentLeft}px, ${this.indentTop}px) scale(${this.scale}) `;

		this.loadImage('/assets/map.jpg').then((img) => {
			ctx.drawImage(img, 0, 0);
		});

		map.onmousedown = (event) => {
			event.preventDefault();
			this.dragDrop(event, map);
		};

		map.onwheel = (event) => {
			this.zoom(event, map);
		};
	}
}

export default Map;
