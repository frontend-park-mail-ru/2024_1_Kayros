/**
 * Создание уникального идентификатора по родительскому id
 * @param {Element} parent - родительский элемент
 * @param {string} element - тип элемента
 * @returns уникальный идентификатор для кнопки
 */

export const getUID = (parent, element) => {
	const currentElements = parent.getElementsByTagName(element);
	let maxID = 0;

	[...currentElements].forEach((element) => {
		const elementId = Number(element.id.split('_')[1]);

		if (elementId > maxID) maxID = elementId;
	});

	return `${parent.id}-${element}_${maxID + 1}`;
};
