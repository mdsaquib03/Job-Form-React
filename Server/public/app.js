document.addEventListener("DOMContentLoaded", function () {

    const startButton = document.getElementById("startButton");
    const stopButton = document.getElementById("stopButton");
    const recordedVideo = document.getElementById("recordedVideo");
    const previewVideo = document.getElementById("previewVideo");
    const startCameraButton = document.getElementById('startCamera');
    const videoInput = document.getElementById("input_video");
    const submit = document.getElementById("submit");
    const discardVideoButton = document.getElementById("discard-video");
    const retakeVideo = document.getElementById("retake-video");
    const video = document.getElementById("video");
    const preview = document.getElementById("preview");
    let timerDisplay = document.getElementById("timer");
    const mimeType = window.MediaRecorder.isTypeSupported('video/mp4;codecs=avc1') ? 'video/mp4;codecs=avc1' : 'video/webm;codecs=vp9,opus';
    const videoFormat = mimeType.includes('mp4') ? 'mp4' : 'webm';

    let blobs = [];

    previewVideo.style.display = 'none';

    let mediaStream;
    let recorder;
    let timerId;
    let isRecording = false;
    let isUpload = false;
    let current_Time;

    // // discard video button....................................
    discardVideoButton.addEventListener("click", () => {
        document.getElementById("camera").textContent = "Upload Video";
        recordedVideo.setAttribute("src", null);
        previewVideo.setAttribute("src", null);

        recorder = null;
        isUpload = false;

        startButton.style.display = "block";
        startCameraButton.style.display = "block";
        retakeVideo.style.display = "none";
        discardVideoButton.style.display = "none";
        previewVideo.style.display = "none";
        recordedVideo.style.display = "block";
        videoInput.style.display = "block";

        startCameraButton.disabled = false;
        startButton.disabled = true;

        already_a = document.getElementById("video_download")
        if (already_a) {
            const parentEle = already_a.parentElement;
            console.log("remove child");
            parentEle.removeChild(already_a)
        }
        console.log(recordedVideo);
        document.getElementById("preview").style.display = "block";
    });

    // // for retake..................................
    retakeVideo.addEventListener("click", () => {
        document.getElementById("camera").textContent = "Upload Video";
        startButton.style.display = "block";
        startCameraButton.style.display = "block";
        retakeVideo.style.display = "none";
        recordedVideo.setAttribute("src", null);
        previewVideo.setAttribute("src", null);
        recorder = null;
        isUpload = false;


        discardVideoButton.style.display = "none";
        previewVideo.style.display = "none";
        recordedVideo.style.display = "block";

        startCameraButton.disabled = false;
        startButton.disabled = true;

        already_a = document.getElementById("video_download")
        if (already_a) {
            const parentEle = already_a.parentElement;
            console.log("remove child");
            parentEle.removeChild(already_a)
        }

        document.getElementById("preview").style.display = "block";
    })


    // // for start Camera button..........................................
    startCameraButton.addEventListener('click', async (event) => {
        event.preventDefault();

        startButton.disabled = false;
        startCameraButton.disabled = true;

        previewVideo.style.display = 'none'
        preview.style.display = "block";
        discardVideoButton.style.display = "none";

        recordedVideo.setAttribute("src", null);
        recordedVideo.setAttribute("autoplay", true);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            recordedVideo.srcObject = stream;
        } catch (error) {
            console.error('Error accessing the camera:', error);
        }
    });

    // for Start recrding button............................
    startButton.addEventListener("click", async (event) => {
        event.preventDefault();
        previewVideo.pause();
        isRecording = true;
        isUpload = false;

        recordedVideo.style.display = 'block';
        discardVideoButton.style.display = "none";
        videoInput.style.display = "none";
        previewVideo.style.display = 'none';
        timerDisplay.style.display = 'block';

        // changes.............................
        stopButton.style.display = "block";
        startButton.style.display = "none";
        startCameraButton.style.display = "none";

        const videoFile = videoInput.files[0];
        if (videoFile) {
            videoInput.value = "";
        }

        recordedVideo.removeAttribute("autoplay");
        startButton.disabled = true;
        startCameraButton.disabled = true;
        stopButton.disabled = false;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            mediaStream = stream;
            recorder = new MediaRecorder(stream, {
                type: "video",
                mimeType
            });

            recorder.onstop = function (event) {

                console.log("recorder.onstop", event);
                console.log("recorder.blobs", blobs);

                const recordedBlob = blobs[0];
                recordedVideo.src = URL.createObjectURL(recordedBlob);
                
                console.log(recordedVideo.src);

                previewVideo.src = recordedVideo.src;
                const already_a = document.getElementById("video_download");
                if (already_a) {
                    const parentEle = already_a.parentElement;
                    parentEle.removeChild(already_a);
                }

                const downloadLink = document.createElement("a");
                downloadLink.id = "video_download";
                downloadLink.href = recordedVideo.src;
                downloadLink.download = "recorded_video.webm";
                downloadLink.innerText = "Download Your video";

                video.appendChild(downloadLink);
                
                preview.style.display = "none";

                // Turn off the camera and disable the video stream
                disableCamera();
            }
            recorder.ondataavailable = function (event) {
                console.log("recorder.ondataavailable", event);
                if (event.data && event.data.size > 0) {
                    blobs.push(event.data);
                }
            }

            recordedVideo.currentTime = 0;
            startTimer(60);
            recorder.start();
            timerId = setTimeout(stopperFunction, 60500);
        } catch (error) {
            console.error("Error accessing webcam and microphone:", error);
        }
    });

    // // stop recording button,,,,,,,,,,,,,,,,,,,,,,
    stopButton.addEventListener("click", () => {
        // console.log("***start time timer", timerId);
        clearTimeout(timerId);
        // console.log("***end time timer", timerId)
        stopperFunction();
    });

    // stop recording function..................
    function stopperFunction() {
        clearTimeout(timerId);
        previewVideo.style.display = 'block';
        discardVideoButton.style.display = "block";

        retakeVideo.style.display = "block";

        stopButton.style.display = "none";
        timerDisplay.style.display = "none";
        isRecording = false;


        stopButton.disabled = true;
        startButton.disabled = true;
        startCameraButton.disabled = true;

        timerDisplay.textContent = "Start Recording";

        // Check if the recorder is in the "recording" state
        if (recorder && recorder.state === "recording") {
            stopTimer();
            recorder.stop();
        } else {
            console.log(previewVideo);
            console.error("Recorder is not in the recording state");
        }
    }

    // // Disable Camera function
    function disableCamera() {
        // console.log("***start camera", mediaStream);

        if (mediaStream) {
            if (mediaStream.getTracks) {
                mediaStream.getTracks().forEach((track) => track.stop());
            }
            mediaStream = null;
        }

        if (recordedVideo.srcObject) {
            recordedVideo.srcObject = null;
        }
    }

    // Code for closing  Model......................................................
    let flag = false;
    document.getElementById("close-button").addEventListener("click", () => {
        document.getElementById("camera").textContent = "Upload Video";
        timerDisplay.style.display = 'none';
        timerDisplay.innerHTML = "Starting...";

        // Case 1: User uploaded files and then clicked the close button
        const videoInput = document.getElementById("input_video");
        const recordfile = document.getElementById("video_download");
        if (videoInput.files.length > 0) {
            // console.log(isUpload);
            if (isUpload) {
                console.log("video uploaded");
                document.getElementById("camera").textContent = "Uploaded Successfully";
            } else {
                isUpload = false;
                clearFileInput(videoInput);
            }
        }

        // Case 2: User clicked on start camera and then clicked the close button
        const startCameraButton = document.getElementById('startCamera');
        if (startCameraButton.disabled && discardVideoButton.style.display == 'none') {
            console.log("camera")
            disableStartCamera();
        }

        // // Case 3: User clicked on start recording and then clicked the close button
        if (recorder && recorder.state === "recording") {
            isUpload = false;
            console.log("recording")
            previewVideo.style.display = "none";
            videoInput.style.display = "block";
            stopButton.disabled = true;
            stopTimer();
            clearTimeout(timerId);
            recorder.stopRecording(async function () {
                disableCamera();
                previewVideo.src = null;
            });

        }

        // // Case 4: User clicked on stopped recording and then clicked the close button
        if (stopButton.disabled && !isUpload) {
            console.log("****stop recording***")
            discardVideoButton.click();
        }

        // Case 5: User record and uploaded files and then clicked the close button
        if (recordfile && isUpload) {
            document.getElementById("camera").textContent = "Uploaded Successfully";
            discardVideoButton.style.display = "block";
            console.log("recordfile");
        }

    });

    function clearFileInput(inputElement) {
        inputElement.value = "";
    }

    function disableStartCamera() {
        // console.log("disableStartCamera");
        startCameraButton.disabled = false;
        startButton.disabled = true;

        const recordedVideo = document.getElementById("recordedVideo");
        if (recordedVideo.srcObject) {
            const mediaStream = recordedVideo.srcObject;
            if (mediaStream.getTracks) {
                mediaStream.getTracks().forEach((track) => track.stop());
            }
            recordedVideo.srcObject = null;
        }
    }

    // ******............... all ok from here.......................******

    document.getElementById("camera").addEventListener("click", (event) => {
        event.preventDefault();
    })

    document.getElementById("video-upload").addEventListener("click", async (event) => {
        document.getElementById("video-upload").setAttribute("data-dismiss", true);
        const recordfile = document.getElementById("video_download");
        const videoError = document.getElementById('videoError');
        const video = document.createElement("video");
        let videoFile = videoInput.files[0];

        previewVideo.style.display = 'none'
        videoError.textContent = '';
        previewVideo.src = null;

        if (!videoFile && !recordfile) {
            videoError.textContent = "please, Upload your introductory video";
            document.getElementById("video-upload").removeAttribute("data-dismiss");
        }

        if (videoFile) {
            if (videoFile.size > 100 * 1024 * 1024) {
                videoError.textContent = "Video file size should be less than 100MB.";
                videoInput.value = "";
                document.getElementById("video-upload").removeAttribute("data-dismiss");
            } else {
                video.src = URL.createObjectURL(videoFile);

                await new Promise((resolve) => {
                    video.onloadedmetadata = function () {
                        const videoDuration = video.duration;
                        console.log("Video duration: " + videoDuration);
                        if (videoDuration > 60) {
                            videoError.textContent = "Video duration should be equal or less than 1 minute.";
                            videoInput.value = "";
                            videoFile = null;
                            document.getElementById("video-upload").removeAttribute("data-dismiss");
                        } else {
                            document.getElementById("camera").textContent = "Uploaded Successfully";
                            isUpload = true;
                            flag = true;
                            $('#cameraModal').modal('hide');
                        }
                        resolve();
                    };
                });
            }
        }

        document.getElementById("video-upload").setAttribute("data-dismiss", true);

        if (videoInput.value || recordfile) {
            document.getElementById("camera").textContent = "Uploaded Successfully";
            isUpload = true;
            if (videoFile) {
                disableStartCamera();
            }
            if (recordfile) {
                discardVideoButton.style.display = "block";
            }
            flag = true;
            $('#cameraModal').modal('hide');
        }
    });

    // form data validation ....................
    function validateName(name) {
        if (!name) {
            return 'Name is required*';
        }
        return /^[A-Za-z\s]{1,30}$/.test(name)
            ? ''
            : 'Name should only contain alphabets and not exceed 30 characters.';
    }

    function validateEmail(email) {
        if (!email) {
            return 'Email is required*';
        }
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            ? ''
            : 'Invalid email format.';
    }

    function validateCollege(college) {
        if (!college) {
            return 'College is required*';
        }
        return /^[A-Za-z\s]{1,50}$/.test(college)
            ? ''
            : 'College name should only contain alphabets and not exceed 50 characters.';
    }

    function validateIndianNumber(phoneNumber) {
        if (!phoneNumber) {
            return 'Phone Number is required*';
        }
        return /^[789]\d{9}$/.test(phoneNumber)
            ? ''
            : 'Invalid number.';
    }

    function validatePassingYear(passingYear) {
        if (!passingYear) {
            return 'Passing Year is required*';
        }
        return '';
    }

    function validateAboutOpportunity(aboutOpportunity) {
        if (!aboutOpportunity) {
            return 'This is required field*';
        }
        return '';
    }

    function validateResume(resumeFile) {
        if (resumeFile) {
            if (resumeFile.size > 150 * 1024) {
                return 'Resume file size should be less than 150KB.';
            }
        }
        return '';
    }

    function showLoadingOverlay() {
        const overlay = document.querySelector('.overlay');
        overlay.style.display = 'block';
    }
    function hideLoadingOverlay() {
        const overlay = document.querySelector('.overlay');
        overlay.style.display = 'none';
    }
    // submit for apply page....................
    submit.addEventListener("click", (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const college = document.getElementById('college').value;
        const phoneNumber = document.getElementById('phone').value;
        const passingYear = document.getElementById('year').value;
        const aboutOpportunity = document.getElementById('about-opportunity').value;
        const resumeFile = document.getElementById("resume").files[0];

        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const collegeError = document.getElementById('collegeError');
        const phoneNumberError = document.getElementById('phoneNumberError');
        const passingYearError = document.getElementById('yearError');
        const opportunityError = document.getElementById('opportunityError');
        const resumeError = document.getElementById('resumeError');

        nameError.textContent = '';
        emailError.textContent = '';
        collegeError.textContent = '';
        phoneNumberError.textContent = '';
        passingYearError.textContent = '';
        opportunityError.textContent = ' ';
        resumeError.textContent = '';

        const nameErrorMessage = validateName(name);
        const emailErrorMessage = validateEmail(email);
        const collegeErrorMessage = validateCollege(college);
        const numberErrorMessage = validateIndianNumber(phoneNumber);
        const yearErrorMessage = validatePassingYear(passingYear);
        const opportunityErrorMessage = validateAboutOpportunity(aboutOpportunity);
        const resumeErrorMessage = validateResume(resumeFile);

        if (nameErrorMessage) {
            nameError.textContent = nameErrorMessage;
            event.preventDefault();
            return;
        }

        if (emailErrorMessage) {
            emailError.textContent = emailErrorMessage;
            event.preventDefault();
            return;
        }

        if (collegeErrorMessage) {
            collegeError.textContent = collegeErrorMessage;
            event.preventDefault();
            return;
        }

        if (yearErrorMessage) {
            passingYearError.textContent = yearErrorMessage;
            event.preventDefault();
            return;
        }

        if (opportunityErrorMessage) {
            opportunityError.textContent = opportunityErrorMessage;
            event.preventDefault();
            return;
        }

        if (numberErrorMessage) {
            phoneNumberError.textContent = numberErrorMessage;
            event.preventDefault();
            return;
        }

        if (resumeErrorMessage) {
            resumeError.textContent = resumeErrorMessage;
            event.preventDefault();
            return;
        }

        const videoFile = videoInput.files[0];
        if (videoFile) {
            if (videoFile.size > 100 * 1024 * 1024) {
                alert("Video file size should be less than 100MB.");
                videoInput.value = "";
                event.preventDefault();
            }
        }

        const formData = new FormData();

        formData.append("name", document.getElementById("name").value);
        formData.append("email", document.getElementById("email").value);
        formData.append("college", document.getElementById("college").value);
        formData.append("year", document.getElementById("year").value);
        formData.append("aboutOpportunity", document.getElementById("about-opportunity").value);
        formData.append("phone", document.getElementById("phone").value);

        if (resumeFile) {
            formData.append("resume", resumeFile);
        }

        if (recorder && blobs.length) {
            // console.log(recorder.getBlob, recorder);
            console.log(blobs);
            // const videoBlob = recorder.getBlob(); // this should change
            const videoBlob = blobs[0];
            console.log(videoBlob);
            formData.append("video", videoBlob, `recorded_video.${videoFormat}`);
        } else if (videoInput.files[0]) {
            console.log(videoFile);
            formData.append("video", videoFile);
        } else {
            document.getElementById("camera").textContent = "Upload Video";
            alert("please, Upload your introductory video");
            event.preventDefault();
            return;
        }
        showLoadingOverlay();

        fetch("/submit", {
            method: "POST",
            body: formData,
        })
            .then(async (response) => {
                console.log(response);
                if (response.ok && response.redirected) {
                    sessionStorage.setItem('username', 'true');
                    document.getElementById("apply-now").style.display = "none";
                    document.getElementById("response").style.display = "block";
                } else if (response.status === 400) {
                    hideLoadingOverlay();
                    const data = await response.json();
                    if (data.message === "Email is already registered.") {
                        emailError.textContent = "You have already applied";
                    } else {
                        alert("Form Submission Failed");
                        console.log("Form Submission Failed");
                    }
                } else {
                    hideLoadingOverlay();
                    alert("Form Submission Failed");
                    console.log("Form Submission Failed");
                }
            })
            .catch((error) => {
                console.log("***Error***", error);
            });

    });

});