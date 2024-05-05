import Header from '../../components/Header';
import Loader from '../../components/Loader';
import api from '../../modules/api';
import template from './Search.hbs';
import SearchRestaurantCard from '../Restaurants/components/RestaurantCard';
import './Search.scss';

/**
 * Страница со списком ресторанов
 */
class Search {
    #parent;

    /**
     * Конструктор класса
     * @param {Element} parent - родительский элемент
     */
    constructor(parent) {
        this.#parent = parent;
    }

    /**
     * Отрисовка карточек ресторанов
     * @param {Array} items - массив ресторанов
     */
    renderData(items) {
        const searchRestaurants = document.querySelector('.search-restaurants__cards');

        if (!items || !items.length) {
            searchRestaurants.innerText = 'Ничего не найдено';
            return;
        }

        items.forEach((item) => {
            const restaurantCard = new SearchRestaurantCard(searchRestaurants, item);
            restaurantCard.render();
        });
    }

    /**
     * Получение данных о ресторанах
     */
    getData() {
        api.getSearchRestaurants(this.renderData.bind(this));
    }

    /**
     * Рендеринг страницы
     */
    async render() {
        this.#parent.insertAdjacentHTML('beforeend', template());

        const currentHeader = document.querySelector('.header');

        if (!currentHeader) {
            const header = new Header();
            header.render();
        }

        const searchRestaurants = document.querySelector('.search-restaurants__cards');
        const loader = new Loader(searchRestaurants, { id: 'content-loader', size: 'xl' });
        loader.render();

        this.getData();
    }
}

export default Search;
