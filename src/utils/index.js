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
