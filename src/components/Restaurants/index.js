import template from './Restaurants.hbs';

class Restaurants {
	constructor() {
		this.parent = document.getElementById('content');
	}

	render() {
		this.parent.insertAdjacentHTML('beforeend', template());
	}
}

export default Restaurants;
