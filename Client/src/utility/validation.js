export function validateName(name) {
    if (!name) {
        return 'Name is required*';
    }
    return /^[A-Za-z\s]{1,30}$/.test(name)
        ? ''
        : 'Name should only contain alphabets and not exceed 30 characters.';
}

export function validateEmail(email) {
    if (!email) {
        return 'Email is required*';
    }
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? ''
        : 'Invalid email format.';
}

export function validateCollege(college) {
    if (!college) {
        return 'College is required*';
    }
    return /^[A-Za-z\s]{1,50}$/.test(college)
        ? ''
        : 'College name should only contain alphabets and not exceed 50 characters.';
}

export function validateIndianNumber(phoneNumber) {
    if (!phoneNumber) {
        return 'Phone Number is required*';
    }
    return /^[789]\d{9}$/.test(phoneNumber)
        ? ''
        : 'Invalid number.';
}

export function validatePassingYear(passingYear) {
    if (!passingYear) {
        return 'Passing Year is required*';
    }
    return '';
}

export function validateAboutOpportunity(aboutOpportunity) {
    if (!aboutOpportunity) {
        return 'This is required field*';
    }
    return '';
}

export function validateResume(resumeFile) {
    if (resumeFile) {
        if (resumeFile.size > 150 * 1024) {
            return 'Resume file size should be less than 150KB.';
        }
    }
    return '';
}


