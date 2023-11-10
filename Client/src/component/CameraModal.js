import React, { useState, useEffect, useRef } from "react";
import styles from "../css/camera.module.css"

const CameraModal = ({ show,
    onHide,
    inputVideoData,
    setInputVideoData,
    recordedVideoData,
    setRecordedVideoData,
    isUploaded,
    setIsUploaded,
}) => {

    const [showCamera, setShowCamera] = useState(true);
    const [showInputField, setShowInputField] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [showPreviewVideo, setShowPreviewVideo] = useState(false);
    const [recordingButton, setRecordingButton] = useState(false);
    const [showDiscardButton, setShowDiscardButton] = useState(false);
    const [showRetakeButton, setShowRetakeButton] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [videoError, setVideoError] = useState();

    const [stream, setStream] = useState(false);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds + 1);
            }, 1000);
        } else if (seconds === 0) {
            clearInterval(interval);
        }

        return () => {
            clearInterval(interval);
        };
    }, [isRunning, seconds]);

    const handleStart = () => {
        setIsRunning(true);
    };

    const handleStop = () => {
        setIsRunning(false);
        setSeconds(0);
    };

    const mediaRecorderRef = useRef(null);
    const videoRef = useRef(null);

    const handleClose = () => {
        if (inputVideoData) {
            if (!isUploaded) {
                setInputVideoData(null);
            }
        } else {
            console.log(isUploaded);
            if (!isUploaded) {
                console.log("discard")
                setIsRecording(false);
                setRecordingButton(false);
                discardVideo();
            }
        }
        console.log("hide");
        onHide();
    };

    const handleUpload = async () => {
        setVideoError('');
        const recordfile = recordedVideoData.src;

        if (!recordfile && !inputVideoData) {
            setVideoError("Please upload your introductory video")
        } else if (inputVideoData) {
            const uploadedFile = inputVideoData;
            if (uploadedFile) {
                const videoElement = document.createElement("video");
                videoElement.src = window.URL.createObjectURL(new Blob([uploadedFile]));

                await new Promise((resolve) => {
                    videoElement.onloadedmetadata = function () {
                        const videoDuration = videoElement.duration;
                        const videoSize = uploadedFile.size;
                        console.log("Video duration: " + videoDuration + " video size: " + videoSize);
                        if (videoSize > 100 * 1024 * 1024) {
                            setVideoError("Video file size should be less than 100MB.")
                            document.getElementById('input_video').value = null;
                            setInputVideoData(null);
                        } else if (videoDuration > 60) {
                            setVideoError("Video duration should be equal or less than 1 minute.")
                            document.getElementById('input_video').value = null;
                            setInputVideoData(null);
                        } else {
                            setIsUploaded(true);
                            onHide();
                        }
                        resolve();
                    };
                });
            } else {
                setVideoError("No Upload File is Available");
            }
        } else {
            setIsUploaded(true);
            onHide();
        }
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            setShowCamera(false);
            setRecordingButton(true);
            setStream(true); // setStream
        } catch (error) {
            console.error("Error accessing the camera:", error);
        }
    };

    const toggleRecording = () => {
        if (!stream) {
            console.error("No media stream available for recording.");
            return;
        }
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
            handleStart()
        }
    };

    const startRecording = async () => {
        try {
            document.getElementById('input_video').value = null;
            setShowInputField(false);
            setInputVideoData(null);
            setVideoError('');

            const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
                ? 'video/webm;codecs=vp9,opus'
                : 'video/webm';

            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = mediaRecorder;

            const recordedChunks = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };

            const timeoutID = setTimeout(() => {
                stopRecording();
            }, 10500);
            setTimeoutId(timeoutID);

            mediaRecorder.onstop = () => {
                const recordedBlob = new Blob(recordedChunks, { type: mimeType });
                const recordedVideoURL = URL.createObjectURL(recordedBlob);
                videoRef.current.src = recordedVideoURL;

                setRecordedVideoData({ ...recordedVideoData, src: videoRef.current.src })
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error starting recording:", error);
        }
    };

    const stopRecording = () => {
        try {
            videoRef.current.srcObject = null;
            const mediaRecorder = mediaRecorderRef.current;
            if (mediaRecorder && mediaRecorder.state === "recording") {
                mediaRecorder.stop();
            }
            handleStop();
            if (timeoutId) {
                clearTimeout(timeoutId);
                setTimeoutId(null);
            }

            setStream(false); // setStream
            setShowPreviewVideo(true);
            setIsRecording(false);
            setRecordingButton(false);
            setShowDiscardButton(true);
            setShowRetakeButton(true);
        } catch (error) {
            console.error("Error while stopping the recording:", error);
        }
    };

    const retakeVideo = () => {
        setShowDiscardButton(false);
        setShowRetakeButton(false);
        setShowPreviewVideo(false);
        setIsUploaded(false);
        setShowCamera(true);
        setRecordedVideoData({ ...recordedVideoData, src: "" })
    };

    const discardVideo = () => {
        console.log("discar video")
        setIsUploaded(false);
        setShowInputField(true);
        setShowCamera(true);
        setShowDiscardButton(false);
        setShowRetakeButton(false);
        setShowPreviewVideo(false);
        setRecordedVideoData({ ...recordedVideoData, src: "" })
    };
    return (
        show && (
            <div className="modal show" tabIndex="-1" role="dialog" style={{ display: "block" }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title ">Upload or Record Your Video</h5>
                            <button type="button" className={styles.close} onClick={handleClose}>
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {/* for preview video */}
                            <video className={styles.preview_video}
                                id="previewVideo"
                                style={{ display: (showPreviewVideo && !isRecording) ? "block" : "none" }}
                                src={recordedVideoData.src}
                                controls
                                playsInline>
                            </video>
                            {/* for video */}
                            <div id="video">
                                <label htmlFor="video">Introductory Video (MP4, max 100MB, max 1 minute):</label>
                                <br />
                                <span id="videoError" className="error" style={{ color: "red" }}>{videoError}</span>
                                <br />
                                <div id="recording-instructions">
                                    <ul>
                                        <li>Self-Introduction and Educational background.</li>
                                        <li>Work experience (if any).</li>
                                        <li>Talk about personal interests or hobbies.</li>
                                        <li>Share any additional information you'd like to.</li>
                                    </ul>
                                </div>
                                {/* for input video file */}
                                <input
                                    type="file"
                                    id="input_video"
                                    accept="video/mp4"
                                    onChange={(e) => {
                                        const selectedFile = e.target.files[0];
                                        if (selectedFile) {
                                            setVideoError('');
                                            setInputVideoData(selectedFile);
                                        } else {
                                            setInputVideoData(null);
                                        }
                                    }}
                                />
                                {/* for video input */}
                                {inputVideoData ? (
                                    <p>{inputVideoData.name}</p>
                                ) : (
                                    ""
                                )}
                                {/* for discard & retake button */}
                                <div className="d-flex justify-content-between mt-3">
                                    <button
                                        id="discard-video"
                                        style={{ display: showDiscardButton ? "block" : "none" }}
                                        className="btn btn-danger text-white border-0 px-4"
                                        onClick={discardVideo}
                                    >
                                        Discard Video
                                    </button>
                                    <button
                                        id="retake-video"
                                        style={{ display: showRetakeButton ? "block" : "none" }}
                                        className="btn btn-warning text-white border-0 px-4"
                                        onClick={retakeVideo}
                                    >
                                        Retake Video
                                    </button>
                                </div>
                                {/* div............ */}
                                <div>
                                    <div>
                                        {/* camera button */}
                                        <button id="startCamera" className="btn btn-primary text-white border-0 px-4"
                                            style={{ display: showCamera ? "block" : "none" }}
                                            onClick={startCamera}>
                                            Start Camera
                                        </button>
                                        {/* start/stop button */}
                                        <button
                                            onClick={toggleRecording}
                                            className={`btn ${isRecording ? "btn-danger" : "btn-warning"
                                                } text-white border-0 px-4`}
                                            style={{ display: recordingButton ? "block" : "none" }}
                                        >
                                            {isRecording ? "Stop Recording" : "Start Recording"}
                                        </button>
                                        {/* for reccoridng video */}
                                        <video
                                            style={{ display: stream ? "block" : "none" }}
                                            className={styles.camera_video}
                                            id="recordedVideo"
                                            autoPlay
                                            playsInline
                                            muted
                                            ref={videoRef}
                                        ></video>
                                    </div>
                                    {/* for timer */}
                                    <div id="timer" style={{ display: isRecording ? "block" : "none" }}>
                                        {isRecording ? formatTime(seconds) : "Recording...."}
                                    </div>
                                </div>
                            </div>
                            {/* for download your recorded video link */}
                            <a id="video_download" href={recordedVideoData.src ? recordedVideoData.src : ''}
                                download="recorded_video.webm" style={{ display: recordedVideoData.src ? "block" : "none" }}
                            >
                                Download Your video
                            </a>
                        </div>
                        {/* for close and upload button */}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-success" onClick={handleUpload}>
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default CameraModal;

const formatTime = (time) => {
    const hours = Math.floor(time / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
    const remainingSeconds = (time % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${remainingSeconds}`;
};