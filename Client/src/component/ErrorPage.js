import React from 'react';
import styles from '../css/ErrorPage.module.css';

const ErrorPage = () => {
    return (
        <div className={styles.errorBody}>
            <div className={styles.errorContainer}>
                <h1 className={styles.errorHeading}>404</h1>
                <h2 className={styles.errorSubHeading}>Oops! Page Not Found</h2>
                <p className={styles.errorParagraph}>
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
            </div>
        </div>
    );
};

export default ErrorPage;
