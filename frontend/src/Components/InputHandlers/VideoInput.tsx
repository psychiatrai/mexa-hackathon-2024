// import { useState } from "react";

// // VideoRecorder component to handle the start/stop video recording actions
// export const VideoRecorder = ({
//   onCapture,
// }: {
//   onCapture: (videoBlob: Blob) => void;
// }) => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
//     null
//   );
//   const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

//   const startRecording = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     setVideoStream(stream);
//     const recorder = new MediaRecorder(stream);
//     setMediaRecorder(recorder);

//     recorder.ondataavailable = (event) => {
//       onCapture(event.data);
//     };

//     recorder.start();
//     setIsRecording(true);
//   };

//   const stopRecording = () => {
//     if (mediaRecorder) {
//       mediaRecorder.stop();
//       setIsRecording(false);
//     }
//     if (videoStream) {
//       videoStream.getTracks().forEach((track) => track.stop()); // Stop all video streams
//     }
//   };

//   return (
//     <div className="flex flex-col items-center">
//       <button
//         onClick={isRecording ? stopRecording : startRecording}
//         className={`btn ${isRecording ? "btn-danger" : "btn-primary"}`}
//       >
//         {isRecording ? "Stop Recording" : "Start Recording"}
//       </button>
//     </div>
//   );
// };

// // Main component that handles the video input, displays success message, and processes captured video
// export const VideoInputComponent = () => {
//   const [videoData, setVideoData] = useState<Blob | null>(null);

//   const handleVideoCapture = (videoBlob: Blob) => {
//     setVideoData(videoBlob);
//     // Simulate video processing and response after 3 seconds
//     setTimeout(() => {
//       console.log("Video processed:", videoBlob);
//     }, 3000);
//   };

//   return (
//     <div className="flex-1 p-6 flex flex-col items-center">
//       <h2 className="text-2xl font-bold mb-6 text-center">Video Input</h2>
//       {/* Video Recorder */}
//       <VideoRecorder onCapture={handleVideoCapture} />
//       {videoData && (
//         <div className="mt-6 text-center">
//           <p className="text-lg text-blue-500">Video captured successfully!</p>
//         </div>
//       )}
//     </div>
//   );
// };
