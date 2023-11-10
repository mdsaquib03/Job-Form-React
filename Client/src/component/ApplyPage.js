import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Modal from "./CameraModal";
import styles from '../css/Apply.module.css';
import axios from "axios";
import {
    handleNameChange,
    handleEmailChange,
    handleCollegeChange,
    handleNumberChange,
    handlePassingYearChange,
    handleAboutOpportunityChange,
    handleResumeChange
} from '../utility/handleChange';
import {
    validateName,
    validateEmail,
    validateCollege,
    validateIndianNumber,
    validatePassingYear,
    validateAboutOpportunity,
    validateResume
} from '../utility/validation';

const ApplyPage = ({ setFormSubmitted }) => {
    const [showModal, setShowModal] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [inputVideo, setInputVideo] = useState(null);
    const [recordedVideo, setRecordedVideo] = useState({ src: null })

    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [collegeError, setCollegeError] = useState('');
    const [numberError, setNumberError] = useState('');
    const [passingYearError, setPassingYearError] = useState('');
    const [aboutOpportunityError, setAboutOpportunityError] = useState('');
    const [resumeError, setResumeError] = useState('');
    const [introductoryVideoError, setIntroductoryVideoError] = useState('');

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        college: "",
        year: "",
        aboutOpportunity: "",
        phone: "",
        resume: null,
    });

    const navigate = useNavigate();

    const openModal = (event) => {
        event.preventDefault()
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        // const nameErrorMessage = validateName(formData.name);
        // setNameError(nameErrorMessage);
        // const emailErrorMessage = validateEmail(formData.email);
        // setEmailError(emailErrorMessage);
        // const collegeErrorMessage = validateCollege(formData.college);
        // setCollegeError(collegeErrorMessage);
        // const yearErrorMessage = validatePassingYear(formData.year);
        // setPassingYearError(yearErrorMessage);
        // const opportunityErrorMessage = validateAboutOpportunity(formData.aboutOpportunity);
        // setAboutOpportunityError(opportunityErrorMessage);
        // const numberErrorMessage = validateIndianNumber(formData.phone);
        // setNumberError(numberErrorMessage);
        // const resumeErrorMessage = validateResume(formData.resume);
        // setResumeError(resumeErrorMessage);

        // if (
        //     nameErrorMessage ||
        //     emailErrorMessage ||
        //     collegeErrorMessage ||
        //     yearErrorMessage ||
        //     opportunityErrorMessage ||
        //     numberErrorMessage
        // ) {
        //     return;
        // }

        const formDataToSend = new FormData();
        // formDataToSend.append("name", formData.name);
        // formDataToSend.append("email", formData.email);
        // formDataToSend.append("college", formData.college);
        // formDataToSend.append("year", formData.year);
        // formDataToSend.append("aboutOpportunity", formData.aboutOpportunity);
        // formDataToSend.append("phone", formData.phone);
        // formDataToSend.append("resume", formData.resume);

        // if (!inputVideo && !recordedVideo.src) {
        //     setIntroductoryVideoError('Please upload your introductory video');
        //     return;
        // } else {
        //     setIntroductoryVideoError('');
        //     if (inputVideo) {
        //         console.log(inputVideo);
        //         formDataToSend.append("video", inputVideo);
        //     } else if (recordedVideo.src) {
        //         console.log(recordedVideo);
        //         const recordedVideoBlob = new Blob([recordedVideo.src], { type: 'video/webm' });
        //         formDataToSend.append("video", recordedVideoBlob, 'recorded_video.webm');
        //     }
        // }

        try {
            const response = await axios.post("http://localhost:4000/submit", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log(response.data.success);
            if (response.data.success) {
                setFormSubmitted(true);
                navigate("/respond");
            } else {
                console.log("helloe from iuer");
                setEmailError(response.data.message || "Error submitting form");
            }
        } catch (error) {
            navigate("/error");
            console.error("Error sending form data:", error);
        }

    };


    return (
        <div>
            <section id="apply-now" style={{ display: showModal ? "none" : "block" }}>
                <Navbar />
                <h1 style={{ textAlign: "center", marginBottom: "4px", marginTop:"20px" }}>
                    Job <span style={{ color: "#20c997" }}>Application</span> Form
                </h1>
                <form>
                    <label htmlFor="name">
                        Name<sup className={styles.mandatory_field}>*</sup>
                    </label>
                    <input
                        type="text"
                        placeholder="Your Full Name"
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e, formData, setFormData, setNameError)}
                        required
                    />
                    <span id="nameError" className={styles.error}>{nameError}</span>
                    <br />

                    <label htmlFor="email">
                        Email<sup className={styles.mandatory_field}>*</sup>
                    </label>
                    <input
                        type="email"
                        placeholder="Your E-mail Id"
                        id="email"
                        value={formData.email}
                        onChange={(e) => handleEmailChange(e, formData, setFormData, setEmailError)}
                        required
                    />
                    <span id="emailError" className={styles.error}>{emailError}</span>
                    <br />

                    <label htmlFor="college">
                        College<sup className={styles.mandatory_field}>*</sup>
                    </label>
                    <input
                        type="text"
                        placeholder="College"
                        id="college"
                        value={formData.college}
                        onChange={(e) => handleCollegeChange(e, formData, setFormData, setCollegeError)}
                        required
                    />
                    <span id="collegeError" className={styles.error}>{collegeError}</span>
                    <br />

                    <label htmlFor="year">
                        Passing Year<sup className={styles.mandatory_field}>*</sup>
                    </label>
                    <select id="year" value={formData.year} onChange={(e) => handlePassingYearChange(e, formData, setFormData, setPassingYearError)} required>
                        <option value="">Select Year</option>
                        <option value="2018">2018</option>
                        <option value="2019">2019</option>
                        <option value="2020">2020</option>
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="other">other</option>
                    </select>
                    <span id="yearError" className={styles.error}>{passingYearError}</span>
                    <br />

                    <label htmlFor="about-opportunity">
                        How did you get to know about this opportunity?
                        <sup className={styles.mandatory_field}>*</sup>
                    </label>
                    <select id="about-opportunity" name="about-opportunity" value={formData.aboutOpportunity} onChange={(e) => handleAboutOpportunityChange(e, formData, setFormData, setAboutOpportunityError)} required>
                        <option value="">Select an option</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Codalien-Website">Codalien-Website</option>
                        <option value="Internshala">Internshala</option>
                        <option value="Whatsapp-Telegram">Whatsapp/Telegram</option>
                        <option value="Others">Others</option>
                    </select>
                    <span id="opportunityError" className={styles.error}>{aboutOpportunityError}</span>
                    <br />

                    <label htmlFor="phone">
                        Phone Number<sup className={styles.mandatory_field}>*</sup>
                    </label>
                    <input
                        type="tel"
                        placeholder="Your Phone Number"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleNumberChange(e, formData, setFormData, setNumberError)}
                        required
                    />
                    <span id="phoneNumberError" className={styles.error}>{numberError}</span>
                    <br />

                    <label htmlFor="resume">Resume (max 150KB)</label>
                    <input
                        type="file"
                        id="resume"
                        accept="image/*,.pdf"
                        onChange={(e) => handleResumeChange(e, formData, setFormData, setResumeError)}
                    />
                    <span id="resumeError" className={styles.error}>{resumeError}</span>
                    <br />
                    <label htmlFor="Introductory_Video">
                        Introductory Video<sup className={styles.mandatory_field}>*</sup>
                    </label>
                    <br />
                    <span id="videoError" className={styles.error}>{introductoryVideoError}</span>
                    <br />
                    <button
                        className={`btn border-0 w-100  ${isUploaded ? "btn-success" : "btn-secondary"}`}
                        id="Introductory_Video"
                        onClick={openModal}
                    >
                        {isUploaded ? "Uploaded Successfully" : "Upload Your Video"}
                    </button>
                    <div className="my-4">
                        <div className="row">
                            <div className="col-12">
                                <input
                                    type="button"
                                    className="btn btn-success border-0 w-100"
                                    value="Submit"
                                    onClick={handleFormSubmit}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </section>
            <Modal
                show={showModal}
                onHide={closeModal}
                inputVideoData={inputVideo}
                setInputVideoData={setInputVideo}
                recordedVideoData={recordedVideo}
                setRecordedVideoData={setRecordedVideo}
                isUploaded={isUploaded}
                setIsUploaded={setIsUploaded}
            />
        </div>
    );
};

export default ApplyPage;
