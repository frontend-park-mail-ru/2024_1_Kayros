import template from './Login.hbs';
import './Login.scss';

class Login {
	constructor(parent) {
		this.parent = parent;
	}

	render() {
		const html = template();
		this.parent.insertAdjacentHTML('beforeend', html);
	}
}

export default Login;
