import template from './CartButton.hbs';
import './CardButton.scss';

/**
 * Кнопка корзины
 */
class CartButton {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 */
	constructor(parent, cartPrice) {
		this.parent = parent;
		this.cartPrice = cartPrice;
	}

	getHTML() {
		return template({ price: this.cartPrice, class: this.cartPrice ? 'filled' : '' });
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('afterend', this.getHTML());
	}
}

export default CartButton;
