export const localStorageHelper = {
	getItem(name) {
		try {
			const value = localStorage.getItem(name);

			return JSON.parse(value);
		} catch {
			return null;
		}
	},
};

const prefixNumber = (str) => {
	if (str === '7') {
		return '7 (';
	}

	if (str === '8') {
		return '8 (';
	}

	if (str === '9') {
		return '7 (9';
	}

	return '7 (';
};

export const getPhoneMask = (phone) => {
	const value = phone.value.replace(/\D+/g, '');
	const NUMBER_LENGTH = 11;

	let result;

	if (phone.value.includes('+8') || phone.value[0] === '8') {
		result = '';
	} else {
		result = '+';
	}

	for (let i = 0; i < value.length && i < NUMBER_LENGTH; i++) {
		switch (i) {
			case 0:
				result += prefixNumber(value[i]);
				continue;
			case 4:
				result += ') ';
				break;
			case 7:
				result += ' ';
				break;
			case 9:
				result += ' ';
				break;
			default:
				break;
		}

		result += value[i];
	}

	phone.value = result;

	return result;
};
