import template from './Map.hbs';
import './Map.scss';

const MAX_ZOOM = 2;

const ZOOM_PROPERTIES = {
	11: {
		startX: 1236,
		startY: 638,
		scale: 16,
		left: -2050,
		top: -2430,
	},
	12: {
		startX: 2473,
		startY: 1277,
		scale: 8,
		left: 0,
		top: -385,
	},
	13: {
		startX: 4946,
		startY: 2554,
		scale: 4,
		left: 0,
		top: -385,
	},
	14: {
		startX: 9892,
		startY: 5108,
		scale: 2,
		left: 0,
		top: -385,
	},
	15: {
		startX: 19784,
		startY: 10217,
		scale: 1,
		left: 0,
		top: -128,
	},
	16: {
		startX: 39568,
		startY: 20435,
		scale: 1 / 2,
		left: 0,
		top: 0,
	},
};

/**
 * Карта
 */
class Map {
	#parent;
	#container;

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
		this.open = true;
		this.zoomLevel = 15;
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

		if (this.indentLeft < -map.offsetWidth * this.scale + this.#container.offsetWidth) {
			this.indentLeft = -map.offsetWidth * this.scale + this.#container.offsetWidth;
		}

		if (this.indentTop < -map.offsetHeight * this.scale + this.#container.offsetHeight) {
			this.indentTop = -map.offsetHeight * this.scale + this.#container.offsetHeight;
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

		this.indentLeft += scrollSpeedX * 0.3;
		this.indentTop += scrollSpeedY * 0.3;

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
		if (this.scale > 1.2) {
			this.zoomLevel = 16;
		}

		if (this.scale > 0.8 && this.scale < 1.2) {
			this.zoomLevel = 15;
		}

		if (this.scale > 0.5 && this.scale < 0.8) {
			this.zoomLevel = 14;
		}

		if (this.scale > 0.3 && this.scale < 0.5) {
			this.zoomLevel = 13;
		}

		if (this.scale > 0.1 && this.scale < 0.3) {
			this.zoomLevel = 12;
		}

		if (this.scale < 0.1) {
			this.zoomLevel = 11;
		}

		const rect = this.#parent.getBoundingClientRect();

		const currentX = (event.clientX - rect.left - this.indentLeft) / this.scale;
		const currentY = (event.clientY - rect.top - this.indentTop) / this.scale;

		const delta = -event.deltaY;

		if (delta > 0) {
			this.scale *= 1.03;
		}

		if (delta < 0 && (map.offsetWidth * this.scale) / 1.03 > this.#container.offsetWidth) {
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
	 * @param {object} params - параметры
	 * @param {'in' | 'out'} params.direction - направление
	 */
	buttonZoom(map, { direction }) {
		const currentX = (this.#container.offsetWidth / 2 - this.indentLeft) / this.scale;
		const currentY = (this.#container.offsetHeight / 2 - this.indentTop) / this.scale;

		if (direction === 'in') {
			this.scale *= 1.8;
			this.scale = Math.min(this.scale, MAX_ZOOM);
		} else {
			if ((map.offsetWidth * this.scale) / 1.8 > this.#container.offsetWidth) {
				this.scale /= 1.8;
			}
		}

		this.indentLeft = this.#container.offsetWidth / 2 - currentX * this.scale;
		this.indentTop = this.#container.offsetHeight / 2 - currentY * this.scale;

		this.transform(map, { duration: 100 });
	}

	/**
	 * Функция для отрисовки фрагментов карты
	 * @param {HTMLElement} map - карта
	 */
	drawTiles(map) {
		const ctx = map.getContext('2d');

		const tileSize = 256 * ZOOM_PROPERTIES[this.zoomLevel].scale;

		const startX = ZOOM_PROPERTIES[this.zoomLevel].startX + Math.floor(-this.indentLeft / tileSize / this.scale);
		const endX = startX + Math.floor(this.#container.offsetWidth / tileSize / this.scale) + 1;

		const startY = ZOOM_PROPERTIES[this.zoomLevel].startY + Math.floor(-this.indentTop / tileSize / this.scale);
		const endY = startY + Math.floor(this.#container.offsetHeight / tileSize / this.scale) + 1;

		for (let i = startX; i <= endX; i++) {
			for (let j = startY; j <= endY; j++) {
				this.loadImage(`minio-api/map-tiles/${this.zoomLevel}/${i}/${j}.png`).then((image) => {
					ctx.drawImage(
						image,
						(i - ZOOM_PROPERTIES[this.zoomLevel].startX) * tileSize + ZOOM_PROPERTIES[this.zoomLevel].left,
						(j - ZOOM_PROPERTIES[this.zoomLevel].startY) * tileSize + ZOOM_PROPERTIES[this.zoomLevel].top,
						tileSize,
						tileSize,
					);
				});
			}
		}
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.#parent.insertAdjacentHTML('beforeend', template({ class: this.fullPage && 'fullpage' }));

		this.#container = document.getElementById('map-container');
		const map = document.getElementById('canvas-map');

		map.style.transform = `translate(${this.indentLeft}px, ${this.indentTop}px) scale(${this.scale}) `;

		map.onmousedown = (event) => {
			event.preventDefault();
			this.dragDrop(event, map);
		};

		let zoomTimer;

		map.onwheel = (event) => {
			event.preventDefault();

			clearTimeout(zoomTimer);
			zoomTimer = setTimeout(() => {
				this.drawTiles(map);
			}, 100);

			this.zoom(event, map);
		};

		this.drawTiles(map);

		const zoomInButton = document.querySelector('#increase-zoom-button');
		const zoomOutButton = document.querySelector('#decrease-zoom-button');

		zoomInButton.onclick = () => {
			this.buttonZoom(map, { direction: 'in' });
		};

		zoomOutButton.onclick = () => {
			this.buttonZoom(map, { direction: 'out' });
		};
	}
}

export default Map;
