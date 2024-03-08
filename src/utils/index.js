export const localStorageHelper = {
	getItem(name) {
		try {
			const value = localStorage.getItem(name);

			if (value === null) {
				return null;
			}

			return JSON.parse(value);
		} catch {
			return null;
		}
	},
};
