import template from './SlickSlider.hbs';
import './SlickSlider.scss';

/**
 * Слайдер
 */
class SlickSlider {
	#parent;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 */
	constructor(parent) {
		this.#parent = parent;
		this.indentLeft = 0;
		this.dragTime = 0;
	}

	/**
	 * Трансформация слайдера
	 * @param {HTMLElement} track - трэк
	 * @param {object} params - параметры трарсформации
	 * @param {number} params.duration - длительность трансформации
	 */
	transform(track, { duration = 0 } = {}) {
		track.animate([{ transform: `translateX(${this.indentLeft}px)` }], {
			fill: 'forwards',
			easing: 'cubic-bezier(.05,.34,.45,1)',
			duration,
		});

		if (this.indentLeft > 0) {
			this.indentLeft = 0;
		}

		if (this.indentLeft < this.#parent.offsetWidth - track.offsetWidth - 68) {
			this.indentLeft = this.#parent.offsetWidth - track.offsetWidth - 68;
		}
	}

	/**
	 * Функция для перемещения элемента мышкой
	 * @param {MouseEvent} event - событие
	 * @param {HTMLElement} track - трэк
	 */
	dragDrop(event, track) {
		const dragStartX = event.clientX - this.indentLeft;

		let mouseMoveTimer;

		const scrollInterval = setInterval(() => {
			this.dragTime += 0.1;
		}, 100);

		document.onmousemove = (event) => {
			this.drag = true;
			clearTimeout(mouseMoveTimer);

			this.indentLeft = event.clientX - dragStartX;

			if (this.indentLeft > 0) {
				this.indentLeft /= 4;
			}

			this.transform(track);
		};

		document.onmouseup = () => {
			document.onmousemove = null;

			const dragStopX = event.clientX - this.indentLeft;

			clearInterval(scrollInterval);

			this.afterDragScroll(track, dragStartX - dragStopX);
		};
	}

	/**
	 * Продолжительный скролл
	 * @param {HTMLElement} track - трэк слайдера
	 * @param {number} scrollDistanceX - длина скролла по оси X в пикселях
	 */
	afterDragScroll(track, scrollDistanceX) {
		let scrollSpeedX = scrollDistanceX / this.dragTime;

		this.indentLeft += scrollSpeedX * 0.2;

		if (this.indentLeft > 0) {
			this.indentLeft = 0;
		}

		if (this.indentLeft < this.#parent.offsetWidth - track.offsetWidth - 68) {
			this.indentLeft = this.#parent.offsetWidth - track.offsetWidth - 68;
		}

		this.drag = false;

		this.transform(track, { duration: 200 });

		this.dragTime = 0;
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.#parent.insertAdjacentHTML('afterbegin', template());

		const track = this.#parent.querySelector('.slick-track');

		track.onmousemove = (event) => {
			event.preventDefault();
		};

		track.onmousedown = (event) => {
			event.preventDefault();

			this.dragDrop(event, track);
		};

		track.onmousewheel = (event) => {
			event.preventDefault();

			this.indentLeft -= event.deltaX;

			if (this.indentLeft > 0) {
				this.indentLeft = 0;
			}

			if (this.indentLeft < this.#parent.offsetWidth - track.offsetWidth - 68) {
				this.indentLeft = this.#parent.offsetWidth - track.offsetWidth - 68;
			}

			this.transform(track);
		};
	}
}

export default SlickSlider;
