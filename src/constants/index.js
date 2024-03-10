export const errorMessages = {
	SERVER_RESPONSE: 'Ошибка сервера',
	LOGIN: 'Не удалось войти',
	SIGNUP: 'Не удалось создать аккаунт',
	SIGNOUT: 'Не удалось выйти из аккаунта',
};

export const successMessages = {
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

export const validationErrors = {
	emailFormat: 'Неверный формат электронной почты',
	incorrectSymbol: 'Содержит некорректный символ',
	passwordRequirements: 'Пароль должен содержать минимум 8 символов, включая число и букву',
	fieldRequired: 'Поле не может быть пустым',
};

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const INVALID_EMAIL_CHAR_REGEX = /[^a-zA-Z0-9._%+\-@]/;

export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/;

export const INVALID_PASSWORD_CHAR_REGEX = /[^A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

export const NAME_REGEX = /^[a-zA-Zа-яА-ЯёЁ][a-zA-Zа-яА-ЯёЁ0-9]{1,19}$/;

export const INVALID_NAME_CHAR_REGEX = /[^a-zA-Zа-яА-ЯёЁ0-9]/;
