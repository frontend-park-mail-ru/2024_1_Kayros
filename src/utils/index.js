import { TABLET_BREAKPOINT } from '../constants';

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

export const getPhoneMask = (phoneElement) => {
	let phone = phoneElement.value;

	if (!phone) return '';

	phone = phone?.replace(/[^0-9*]/g, '') || '';

	let formattedPhone = '';

	if (phone) {
		phone = '7' + phone.substring(1);
	}

	for (let i = 0; i < phone.length; i++) {
		switch (i) {
		case 0:
			formattedPhone += '+';
			break;
		case 1:
			formattedPhone += ' (';
			break;
		case 4:
			formattedPhone += ') ';
			break;
		case 7:
		case 9:
			formattedPhone += ' ';
			break;
		}

		if (i < 11) {
			formattedPhone += phone[i];
		}
	}

	phoneElement.value = formattedPhone;

	return formattedPhone;
};

export const isMobileOrTabletScreen = () => window.innerWidth <= TABLET_BREAKPOINT;
