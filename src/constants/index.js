export const ERROR_MESSAGES = {
	SERVER_RESPONSE: 'Ошибка сервера',
	LOGIN: 'Не удалось войти',
	SIGNUP: 'Не удалось создать аккаунт',
	SIGNOUT: 'Не удалось выйти из аккаунта',
	ADDRESS: 'Не удалось добавить адрес',
	PROFILE_SAVE: 'Не удалось сохранить информацию',
	PASSWORD_CHANGE: 'Не удалось изменить пароль',
	CART_UPDATE: 'Корзина в данный момент недоступна',
	CHECKOUT: 'Не удалось оформить заказ',
};

export const SUCCESS_MESSAGES = {
	signup: {
		title: 'Аккаунт успешно создан',
		description: 'Добро пожаловать!',
	},
	login: {
		title: 'Успешный вход',
		description: 'С возвращением!',
	},
	signout: {
		title: 'Успешный выход',
		description: 'До встречи!',
	},
	repeatLoginTry: {
		title: 'Вы уже вошли в аккаунт',
		description: 'Еще раз входить не требуется!',
	},
	address: {
		title: 'Адрес успешно сохранен',
		description: 'Удачных заказов!',
	},
	profileSave: {
		title: 'Успешно',
		description: 'Новая информация сохранена',
	},
	passwordChange: {
		title: 'Успешно',
		description: 'Пароль изменен',
	},
	checkout: {
		title: 'Оплата прошла успешно',
		description: 'Передали заказ курьеру!',
	},
};

export const FIELDS_SIGN_IN = [
	{
		selector: '#email-input-container',
		id: 'email',
		placeholder: 'Почта',
		type: 'email',
	},
	{
		selector: '#password-input-container',
		id: 'password',
		placeholder: 'Пароль',
		type: 'password',
	},
];

export const FIELDS_SIGN_UP = [
	FIELDS_SIGN_IN[0],
	{
		selector: '#name-input-container',
		id: 'name',
		placeholder: 'Имя',
		type: 'text',
	},
	FIELDS_SIGN_IN[1],
	{
		selector: '#confirm-password-input-container',
		id: 'confirm-password',
		placeholder: 'Повторите пароль',
		type: 'password',
	},
];

export const FIELDS_ADRESS_FORM = [
	{
		id: 'main-address',
		placeholder: 'Улица, номер дома',
		style: 'dynamic',
		name: 'main',
	},
	{
		id: 'apart-address',
		placeholder: 'Квартира',
		style: 'dynamic',
		name: 'apart',
	},
	{
		id: 'entrance-address',
		placeholder: 'Подъезд',
		style: 'dynamic',
		name: 'entrance',
	},
	{
		id: 'floor-address',
		placeholder: 'Этаж',
		style: 'dynamic',
		name: 'floor',
	},
];

export const FIELDS_PROFILE_FORM = [
	{
		id: 'profile-name-input',
		placeholder: 'Имя',
		name: 'name',
	},
	{
		id: 'profile-mail-input',
		placeholder: 'Email',
		name: 'email',
	},
	{
		id: 'profile-phone-input',
		placeholder: 'Номер телефона',
		name: 'phone',
	},
];

export const FIELDS_PROFILE_PASSWORD_CHANGE = [
	{
		id: 'profile-old-password-input',
		placeholder: 'Старый пароль',
		name: 'oldPassword',
	},
	{
		id: 'profile-new-password-input',
		placeholder: 'Новый пароль',
		name: 'newPassword',
	},
	{
		id: 'profile-confirm-password-input',
		placeholder: 'Повторите пароль',
		name: 'confirmPassword',
	},
];

export const VALIDATION_ERRORS = {
	phoneFormat: 'Неверный формат телефона',
	emailFormat: 'Неверный формат электронной почты',
	incorrectSymbol: 'Содержит некорректный символ',
	passwordRequirements: 'Пароль должен содержать минимум 8 символов, включая число и букву',
	fieldRequired: 'Поле не может быть пустым',
	passwordUnmatched: 'Пароли не совпадают',
	nameFormat: 'Имя должно начинаться с буквы и содержать от 2 до 19 символов',
};

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const INVALID_EMAIL_CHAR_REGEX = /[^a-zA-Z0-9._%+\-@]/;

export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/;

export const INVALID_PASSWORD_CHAR_REGEX = /[^A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

export const NAME_REGEX = /^[a-zA-Zа-яА-ЯёЁ][a-zA-Zа-яА-ЯёЁ0-9]{1,19}$/;

export const INVALID_NAME_CHAR_REGEX = /[^a-zA-Zа-яА-ЯёЁ0-9]/;

export const PHONE_REGEX = /^\+7 \(\d{3}\) \d{3} \d{2} \d{2}$/;

export const YANDEX_API_SAGESTS = 'f96d8d36-1d0a-4786-9140-1b350e8179e1';

export const YANDEX_API_GEOCODER = '0b04a1cd-dc01-4c43-b44a-3efac84fa9f6';

export const MOBILE_BREAKPOINT = 768;

export const TABLET_BREAKPOINT = 1024;
