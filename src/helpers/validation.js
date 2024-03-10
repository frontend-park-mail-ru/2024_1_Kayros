import '../components/Input/Input.scss';

import {
	VALIDATION_ERRORS,
	EMAIL_REGEX,
	INVALID_EMAIL_CHAR_REGEX,
	PASSWORD_REGEX,
	INVALID_PASSWORD_CHAR_REGEX,
} from '../constants';

export const validateEmail = (emailElement, emailErrorElement, hasEmailInputStarted) => {
	const isEmailValid = EMAIL_REGEX.test(emailElement.value);
	const hasInvalidChars = INVALID_EMAIL_CHAR_REGEX.test(emailElement.value);

	if (hasInvalidChars) {
		emailErrorElement.textContent = VALIDATION_ERRORS.incorrectSymbol;
		emailElement.classList.add('input-error');
	} else if (emailElement.value) {
		emailErrorElement.textContent = isEmailValid ? '' : VALIDATION_ERRORS.emailFormat;
		emailElement.style.borderColor = isEmailValid ? 'initial' : 'red';
	} else {
		emailErrorElement.textContent = hasEmailInputStarted ? VALIDATION_ERRORS.fieldRequired : '';
		emailElement.style.borderColor = hasEmailInputStarted ? 'red' : 'initial';
	}

	return emailElement.value && isEmailValid;
};

export const validatePassword = (passwordElement, passwordErrorElement, hasPasswordInputStarted) => {
	const isPasswordValid = PASSWORD_REGEX.test(passwordElement.value);
	const hasInvalidChars = INVALID_PASSWORD_CHAR_REGEX.test(passwordElement.value);

	if (hasInvalidChars) {
		passwordErrorElement.textContent = VALIDATION_ERRORS.incorrectSymbol;
		passwordElement.style.borderColor = 'red';
	} else if (passwordElement.value) {
		passwordErrorElement.textContent = isPasswordValid ? '' : VALIDATION_ERRORS.passwordRequirements;

		passwordElement.style.borderColor = isPasswordValid ? 'initial' : 'red';
	} else {
		passwordErrorElement.textContent = hasPasswordInputStarted ? VALIDATION_ERRORS.fieldRequired : '';
		passwordElement.style.borderColor = hasPasswordInputStarted ? 'red' : 'initial';
	}

	return passwordElement.value && isPasswordValid;
};
