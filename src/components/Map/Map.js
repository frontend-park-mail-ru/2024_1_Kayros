import api from '../../modules/api';
import template from './Map.hbs';
import './Map.scss';

const EARTH_RADIUS = 6378137;
const MAX_ZOOM = 2;
const TILE_SIZE = 256;
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

const MERCATOR_POINT_MIN = {
	long: 4158142,
	lat: 7473308,
};

const MERCATOR_POINT_MAX = {
	long: 4213015,
	lat: 7541565,
};

// TODO: должно быть 11600 и 14300 (тогда будет лучшая точность)
// однако нужно подобрать подходящие для этого MERCATOR_POINT_MIN и MERCATOR_POINT_MAX
const MAP_WIDTH = 11480;
const MAP_HEIGHT = 14280;

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
	 * Конвертирует градусы в радианы
	 * @param {number} degrees - градусы
	 * @returns {number} - радианы
	 */
	degreesToRadians(degrees) {
		return (degrees * Math.PI) / 180;
	}

	/**
	 * Конвертирует радианы в градусы
	 * @param {number} radians - радианы
	 * @returns {number} - градусы
	 */
	radiansToDegrees(radians) {
		return (radians * 180) / Math.PI;
	}

	/**
	 * Конвертирует координаты в пиксели
	 * @param {Array} lonLat - [долгота, широта] в градусах
	 * @returns {object} - координаты в пикселях
	 */
	convertCoords(lonLat) {
		const mercX = EARTH_RADIUS * this.degreesToRadians(lonLat[0]);
		const mercY =
			(180 / Math.PI) * Math.log(Math.tan(Math.PI / 4 + (lonLat[1] * (Math.PI / 180)) / 2)) * (mercX / lonLat[0]);

		const mercator = {
			long: mercX,
			lat: mercY,
		};

		const x =
			(MAP_WIDTH / (MERCATOR_POINT_MAX.long - MERCATOR_POINT_MIN.long)) * (mercator.long - MERCATOR_POINT_MIN.long) -
			this.#container.offsetWidth / 2;

		const y =
			MAP_HEIGHT -
			(MAP_HEIGHT / (MERCATOR_POINT_MAX.lat - MERCATOR_POINT_MIN.lat)) * (mercator.lat - MERCATOR_POINT_MIN.lat) -
			this.#container.offsetHeight / 2;

		return { x, y };
	}

	/**
	 * Конвертирует пиксели в координаты
	 * @param {Array} lonLat - [долгота, широта] в пикселях
	 * @returns {object} - координаты в пикселях
	 */
	convertPixels(lonLat) {
		const mercatorLong =
			(lonLat[0] + this.#container.offsetWidth / 2) /
				((MAP_WIDTH * this.scale) / (MERCATOR_POINT_MAX.long - MERCATOR_POINT_MIN.long)) +
			MERCATOR_POINT_MIN.long;

		const mercatorLat =
			-(lonLat[1] + this.#container.offsetHeight / 2 - MAP_HEIGHT * this.scale) /
				((MAP_HEIGHT * this.scale) / (MERCATOR_POINT_MAX.lat - MERCATOR_POINT_MIN.lat)) +
			MERCATOR_POINT_MIN.lat;

		const x = this.radiansToDegrees(mercatorLong / EARTH_RADIUS);

		const y =
			((Math.atan(Math.pow(Math.E, (mercatorLat * Math.PI) / 180 / (mercatorLong / x))) - Math.PI / 4) * 2) /
			(Math.PI / 180);

		return { x, y };
	}

	/**
	 * Переход по точке
	 * @param {Array} coords - [долгота, широта] в градусах
	 */
	goToPoint(coords) {
		const pixels = this.convertCoords(coords);

		this.indentLeft = -pixels.x;
		this.indentTop = -pixels.y;

		this.scale = 1;
		this.zoomLevel = 15;

		const map = document.getElementById('canvas-map');

		this.transform(map, { duration: 100 });
		this.drawTiles(map);
	}

	/**
	 *
	 */
	async getAddressName() {
		const coordX = -this.indentLeft;
		const coordY = -this.indentTop;

		const coords = this.convertPixels([coordX, coordY]);

		await api.geoCoder(
			`${coords.x.toFixed(12)},${coords.y.toFixed(12)}`,
			(address) => {
				const searchContainer = document.querySelector('.search-input-container');
				const input = searchContainer?.querySelector('input');

				if (address && input) {
					input.value = address;
				}
			},
			{ getCoords: false },
		);
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
				this.getAddressName();
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

		this.getAddressName();

		this.transform(map, { duration: 200 });

		this.dragTime = 0;

		this.drawTiles(map);

		setTimeout(() => {
			mapPinIcon?.classList.remove('move');
		}, 200);
	}

	/**
	 * Изменение уровня приближения в зависимости от текущего масштаба
	 */
	setZoomLevel() {
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
	}

	/**
	 * Функция для приближения и удаления карты
	 * @param {MouseEvent} event - mouse wheel событие
	 * @param {HTMLElement} map - карта
	 */
	zoom(event, map) {
		this.setZoomLevel();

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
		this.setZoomLevel();

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
		setTimeout(() => {
			this.drawTiles(map);
		}, 110);
	}

	/**
	 * Функция для отрисовки фрагментов карты
	 * @param {HTMLElement} map - карта
	 */
	drawTiles(map) {
		const ctx = map.getContext('2d');

		const tileSize = TILE_SIZE * ZOOM_PROPERTIES[this.zoomLevel].scale;

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
