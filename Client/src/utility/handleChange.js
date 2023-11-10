import {
    validateName,
    validateEmail,
    validateCollege,
    validateIndianNumber,
    validatePassingYear,
    validateAboutOpportunity,
    validateResume
} from './validation';

export function handleNameChange(e, formData, setFormData, setNameError) {
    const newName = e.target.value;
    setFormData({
        ...formData,
        name: newName,
    });
    const nameErrorMessage = validateName(newName);
    setNameError(nameErrorMessage);
}

export function handleEmailChange(e, formData, setFormData, setEmailError) {
    const newEmail = e.target.value;
    setFormData({
        ...formData,
        email: newEmail,
    });
    const emailErrorMessage = validateEmail(newEmail);
    setEmailError(emailErrorMessage);
}

export function handleCollegeChange(e, formData, setFormData, setCollegeError) {
    const newCollege = e.target.value;
    setFormData({
        ...formData,
        college: newCollege,
    });
    const collegeErrorMessage = validateCollege(newCollege);
    setCollegeError(collegeErrorMessage);
}

export function handleNumberChange(e, formData, setFormData, setNumberError) {
    const newNumber = e.target.value;
    setFormData({
        ...formData,
        phone: newNumber,
    });
    const numberErrorMessage = validateIndianNumber(newNumber);
    setNumberError(numberErrorMessage);
}

export function handlePassingYearChange(e, formData, setFormData, setYearError) {
    const newYear = e.target.value;
    setFormData({
        ...formData,
        year: newYear,
    });
    const yearErrorMessage = validatePassingYear(newYear);
    setYearError(yearErrorMessage);
}

export function handleAboutOpportunityChange(e, formData, setFormData, setOpportunityError) {
    const newOpportunity = e.target.value;
    setFormData({
        ...formData,
        aboutOpportunity: newOpportunity,
    });
    const opportunityErrorMessage = validateAboutOpportunity(newOpportunity);
    setOpportunityError(opportunityErrorMessage);
}

export function handleResumeChange(e, formData, setFormData, setResumeError) {
    const newResume = e.target.files[0];
    setFormData({
        ...formData,
        resume: newResume,
    });
    const resumeErrorMessage = validateResume(newResume);
    setResumeError(resumeErrorMessage);
}
