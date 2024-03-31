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
	 * @param {boolean} params.fullPage - карта на всю страницу
	 */
	constructor(parent, { startX = 0, startY = 0, startZoom = 1, fullPage = true } = {}) {
		this.#parent = parent;
		this.indentLeft = -startX;
		this.indentTop = -startY;
		this.scale = startZoom;
		this.fullPage = fullPage;
		this.dragTime = 0;
	}

	/**
	 * Создание элемента картинки
	 * @param {string} url - путь до картинки
	 * @returns {Promise} - изображение
	 */
	async loadImage(url) {
		return new Promise((resolve) => {
			const img = new Image();
			img.onload = () => resolve(img);
			img.src = url;
		});
	}

	/**
	 * Трансформация карты
	 * @param {HTMLElement} map - карта
	 * @param {object} params - параметры трарсформации
	 * @param {number} params.duration - длительность трансформации
	 */
	transform(map, { duration = 0 } = {}) {
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

		map.animate([{ transform: `translate(${this.indentLeft}px, ${this.indentTop}px) scale(${this.scale})` }], {
			fill: 'forwards',
			easing: 'cubic-bezier(.05,.34,.45,1)',
			duration,
		});
	}

	/**
	 * Функция для перемещения элемента мышкой
	 * @param {MouseEvent} event - карты
	 * @param {HTMLElement} map - карты
	 */
	dragDrop(event, map) {
		const mapPinIcon = document.querySelector('#address-map-pin');

		const dragStartX = event.clientX - this.indentLeft;
		const dragStartY = event.clientY - this.indentTop;

		let mouseMoveTimer;
		let mouseStopped = false;

		const scrollInterval = setInterval(() => {
			this.dragTime += 0.1;
		}, 100);

		document.onmousemove = (event) => {
			mapPinIcon?.classList.add('move');
			clearTimeout(mouseMoveTimer);
			mouseMoveTimer = setTimeout(() => {
				mouseStopped = true;
			}, 50);

			this.indentLeft = event.clientX - dragStartX;
			this.indentTop = event.clientY - dragStartY;

			this.transform(map);
		};

		document.onmouseup = () => {
			document.onmousemove = null;

			const dragStopX = event.clientX - this.indentLeft;
			const dragStopY = event.clientY - this.indentTop;

			clearInterval(scrollInterval);

			if (mouseStopped) {
				this.drawTiles(map);
				mapPinIcon?.classList.remove('move');
				return;
			}

			this.afterDragScroll(map, dragStartX - dragStopX, dragStartY - dragStopY);
		};
	}

	/**
	 * Продолжительный скролл карты
	 * @param {HTMLElement} map - карта
	 * @param {number} scrollDistanceX - длина скролла по оси X в пикселях
	 * @param {number} scrollDistanceY - длина скролла по оси Y в пикселях
	 */
	afterDragScroll(map, scrollDistanceX, scrollDistanceY) {
		const mapPinIcon = document.querySelector('#address-map-pin');

		if ((!scrollDistanceX && !scrollDistanceY) || this.dragTime < 0.1) {
			mapPinIcon?.classList.remove('move');
			return;
		}

		let scrollSpeedX = scrollDistanceX / this.dragTime;
		let scrollSpeedY = scrollDistanceY / this.dragTime;

		this.indentLeft += scrollSpeedX * 0.2;
		this.indentTop += scrollSpeedY * 0.2;

		this.transform(map, { duration: 200 });

		this.dragTime = 0;

		setTimeout(() => {
			this.drawTiles(map);

			mapPinIcon?.classList.remove('move');
		}, 200);
	}

	/**
	 * Функция для приближения и удаления карты
	 * @param {MouseEvent} event - mouse wheel событие
	 * @param {HTMLElement} map - карта
	 */
	zoom(event, map) {
		const rect = this.#parent.getBoundingClientRect();

		const currentX = (event.clientX - rect.left - this.indentLeft) / this.scale;
		const currentY = (event.clientY - rect.top - this.indentTop) / this.scale;

		const delta = -event.deltaY;

		if (delta > 0) {
			this.scale *= 1.03;
		}

		if (delta < 0 && (map.offsetWidth * this.scale) / 1.03 > window.innerWidth) {
			this.scale /= 1.03;
		}

		this.scale = Math.min(this.scale, MAX_ZOOM);

		this.indentLeft = event.clientX - rect.left - currentX * this.scale;
		this.indentTop = event.clientY - rect.top - currentY * this.scale;

		this.transform(map);
	}

	/**
	 * Функция для приближения и удаления карты из центра
	 * @param {HTMLElement} map - карта
	 * @param {HTMLElement} mapContainer - контейнер
	 * @param {object} params - параметры
	 * @param {'in' | 'out'} params.direction - направление
	 * @param {DOMRect} params.rect - информация о родительском элементе
	 */
	buttonZoom(map, mapContainer, { direction, rect }) {
		const currentX = (rect.left + mapContainer.offsetWidth / 2 - rect.left - this.indentLeft) / this.scale;
		const currentY = (rect.top + mapContainer.offsetHeight / 2 - rect.top - this.indentTop) / this.scale;

		if (direction === 'in') {
			this.scale *= 1.8;
			this.scale = Math.min(this.scale, MAX_ZOOM);
		} else {
			this.scale /= 1.8;
			this.scale = Math.max(this.scale, 0.4);
		}

		this.indentLeft = rect.left + mapContainer.offsetWidth / 2 - rect.left - currentX * this.scale;
		this.indentTop = rect.top + mapContainer.offsetHeight / 2 - rect.top - currentY * this.scale;

		this.transform(map, { duration: 100 });
	}

	/**
	 * Функция для отрисовки фрагментов карты
	 * @param {HTMLElement} map - карта
	 */
	drawTiles(map) {
		const ctx = map.getContext('2d');
		const mapContainer = document.getElementById('map-container');

		let zoom = 15;
		const tileSize = 256;

		const startX = 19784 + Math.floor(-this.indentLeft / tileSize / this.scale) - 1;
		const endX = startX + Math.floor(mapContainer.offsetWidth / tileSize / this.scale) + 2;

		const startY = 10218 + Math.floor(-this.indentTop / tileSize / this.scale) - 1;
		const endY = startY + Math.floor(mapContainer.offsetHeight / tileSize / this.scale) + 2;

		for (let i = startX; i <= endX; i++) {
			for (let j = startY; j <= endY; j++) {
				this.loadImage(`tiles/${zoom}/${i}/${j}.png`).then((image) => {
					ctx.drawImage(image, (i - 19784) * tileSize, (j - 10218) * tileSize, tileSize, tileSize);
				});
			}
		}
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.#parent.insertAdjacentHTML('beforeend', template({ class: this.fullPage && 'fullpage' }));

		const mapContainer = document.getElementById('map-container');
		const map = document.getElementById('canvas-map');

		map.style.transform = `translate(${this.indentLeft}px, ${this.indentTop}px) scale(${this.scale}) `;

		map.onmousedown = (event) => {
			event.preventDefault();
			this.dragDrop(event, map);
		};

		map.onwheel = (event) => {
			event.preventDefault();

			this.zoom(event, map);
		};

		this.drawTiles(map);

		const zoomInButton = document.querySelector('#increase-zoom-button');
		const zoomOutButton = document.querySelector('#decrease-zoom-button');

		const rect = this.#parent.getBoundingClientRect();

		zoomInButton.onclick = () => {
			this.buttonZoom(map, mapContainer, { direction: 'in', rect });
		};

		zoomOutButton.onclick = () => {
			this.buttonZoom(map, mapContainer, { direction: 'out', rect });
		};
	}
}

export default Map;
