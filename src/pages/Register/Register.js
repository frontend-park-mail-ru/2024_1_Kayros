import template from './Register.hbs';
import './Regiter.scss';

class Register {
	constructor(parent) {
		this.parent = parent;
	}

	render() {
		const html = template();
		this.parent.insertAdjacentHTML('beforeend', html);
	}
}

export default Register;
