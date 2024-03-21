import '../components/Input/Input.scss';

import {
	VALIDATION_ERRORS,
	EMAIL_REGEX,
	INVALID_EMAIL_CHAR_REGEX,
	PASSWORD_REGEX,
	INVALID_PASSWORD_CHAR_REGEX,
	NAME_REGEX,
	INVALID_NAME_CHAR_REGEX,
} from '../constants';

export const validateEmail = (emailElement, emailErrorElement, hasEmailInputStarted) => {
	const isEmailValid = EMAIL_REGEX.test(emailElement.value);
	const hasInvalidChars = INVALID_EMAIL_CHAR_REGEX.test(emailElement.value);

	if (hasInvalidChars) {
		emailErrorElement.textContent = VALIDATION_ERRORS.incorrectSymbol;
		emailElement.classList.add('input-error');
	} else if (emailElement.value) {
		emailErrorElement.textContent = isEmailValid ? '' : VALIDATION_ERRORS.emailFormat;
		emailElement.classList.toggle('input-error', !isEmailValid);
	} else {
		emailErrorElement.textContent = hasEmailInputStarted ? VALIDATION_ERRORS.fieldRequired : '';
		emailElement.classList.toggle('input-error', hasEmailInputStarted);
	}

	return emailElement.value && isEmailValid;
};

export const validatePassword = (passwordElement, passwordErrorElement, hasPasswordInputStarted) => {
	const isPasswordValid = PASSWORD_REGEX.test(passwordElement.value);
	const hasInvalidChars = INVALID_PASSWORD_CHAR_REGEX.test(passwordElement.value);

	if (hasInvalidChars) {
		passwordErrorElement.textContent = VALIDATION_ERRORS.incorrectSymbol;
		passwordElement.classList.add('input-error');
	} else if (passwordElement.value) {
		passwordErrorElement.textContent = isPasswordValid ? '' : VALIDATION_ERRORS.passwordRequirements;
		passwordElement.classList.toggle('input-error', !isPasswordValid);
	} else {
		passwordErrorElement.textContent = hasPasswordInputStarted ? VALIDATION_ERRORS.fieldRequired : '';
		passwordElement.classList.toggle('input-error', hasPasswordInputStarted);
	}

	return passwordElement.value && isPasswordValid;
};

export const validateName = (nameElement, nameErrorElement, hasNameInputStarted) => {
	const isNameValid = NAME_REGEX.test(nameElement.value);
	const hasInvalidChars = INVALID_NAME_CHAR_REGEX.test(nameElement.value);

	if (hasInvalidChars) {
		nameErrorElement.textContent = VALIDATION_ERRORS.incorrectSymbol;
		nameElement.classList.add('input-error');
	} else if (nameElement.value) {
		nameErrorElement.textContent = isNameValid ? '' : VALIDATION_ERRORS.nameFormat;
		nameElement.classList.toggle('input-error', !isNameValid);
	} else {
		nameErrorElement.textContent = hasNameInputStarted ? VALIDATION_ERRORS.fieldRequired : '';
		nameElement.classList.toggle('input-error', hasNameInputStarted);
	}

	return nameElement.value && isNameValid;
};

export const validateConfirmPassword = (
	passwordElement,
	confirmPasswordElement,
	confirmPasswordErrorElement,
	hasConfirmPasswordInputStarted,
) => {
	const isPasswordsMatch = confirmPasswordElement.value === passwordElement.value;

	if (!isPasswordsMatch) {
		confirmPasswordErrorElement.textContent = VALIDATION_ERRORS.passwordUnmatched;
		confirmPasswordErrorElement.classList.add('input-error');
	} else if (!confirmPasswordElement.value && hasConfirmPasswordInputStarted) {
		confirmPasswordErrorElement.textContent = VALIDATION_ERRORS.fieldRequired;
		confirmPasswordErrorElement.classList.add('input-error');
	} else {
		confirmPasswordErrorElement.textContent = '';
		confirmPasswordErrorElement.classList.remove('input-error');
	}

	return confirmPasswordElement.value && isPasswordsMatch;
};
