/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef, useEffect } from "react";
import {
  FaPencilAlt,
  FaMicrophone,
  FaVideo,
  FaStop,
  FaPlay,
  FaUpload,
} from "react-icons/fa";
import Image from "next/image";

export default function Home() {
  const [activeInput, setActiveInput] = useState<
    "text" | "audio" | "video" | null
  >(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">psychiatrai</h1>
        <p className="text-lg text-gray-600">
          Welcome to PsychiatraiBot your trusted companion for mental health and
          well-being support!
        </p>
      </header>
      

      <main className="w-full max-w-3xl bg-white shadow-lg p-8 rounded-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-gray-800">
          <Card
            icon={<FaPencilAlt />}
            title="Text Input"
            description="Write down your thoughts and feelings."
            onClick={() => setActiveInput("text")}
            isActive={activeInput === "text"}
          />
          <Card
            icon={<FaMicrophone />}
            title="Audio Input"
            description="Speak and let your voice express your mood."
            onClick={() => setActiveInput("audio")}
            isActive={activeInput === "audio"}
          />
          <Card
            icon={<FaVideo />}
            title="Video Input"
            description="Share a video for a more personal touch."
            onClick={() => setActiveInput("video")}
            isActive={activeInput === "video"}
          />
        </div>

        {activeInput && (
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              {activeInput === "text" && "Tell us more in text."}
              {activeInput === "audio" && "Record your voice."}
              {activeInput === "video" && "Capture your mood in a video."}
            </h3>

            {activeInput === "text" && <TextInput />}
            {activeInput === "audio" && <AudioRecorder />}
            {activeInput === "video" && <VideoRecorder />}
          </div>
        )}
      </main>
    </div>
  );
}

const Card = ({
  icon,
  title,
  description,
  onClick,
  isActive,
}: {
  icon: JSX.Element;
  title: string;
  description: string;
  onClick: () => void;
  isActive: boolean;
}) => (
  <div
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-2 p-6 rounded-3xl cursor-pointer transition-all shadow-md ${
      isActive ? "bg-blue-500 text-white" : "bg-gray-50 hover:shadow-lg"
    }`}
  >
    <span className="text-4xl">{icon}</span>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-sm text-center">{description}</p>
  </div>
);

// TextInput Component
const TextInput = () => {
  const [text, setText] = useState("");
  const handleSubmit = () => {
    if (text.trim()) alert(`Your input: ${text}`);
    setText("");
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <textarea
        rows={4}
        className="w-full border rounded-lg p-4 bg-white text-black shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        placeholder="Type here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
      >
        Submit
      </button>
    </div>
  );
};

// AudioRecorder Component
const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [sendButtonText, setSendButtonText] = useState("Send Audio");

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const audioData = new Blob(chunks, { type: "audio/webm" });
      setAudioBlob(audioData);
      setSendButtonText("Send");
    };

    recorder.start();
    setRecording(true);
    setMessage("Someone is speaking");
    setMediaRecorder(recorder);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (audioBlob) {
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio_recording.webm");

      alert("Audio data sent to the server!");
    }
  };

  return (
    <div className="text-center justify-center items-center">
      {message && <p className="text-red-500 mb-4">{message}</p>}
      {recording ? (
        <button
          onClick={stopRecording}
          className="px-6 py-3 m-6 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center"
        >
          <FaStop className="mr-2" /> Stop Recording
        </button>
      ) : (
        <button
          onClick={startRecording}
          className="px-6 py-3 bg-green-500  text-white rounded-lg hover:bg-green-600 transition-all flex items-center"
        >
          <FaPlay className="mr-2" /> Start Recording
        </button>
      )}

      {audioBlob && (
        <button
          onClick={handleUpload}
          className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center"
        >
          <FaUpload className="mr-2" /> {sendButtonText}
        </button>
      )}
    </div>
  );
};

// VideoRecorder Component
const VideoRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [sendButtonText, setSendButtonText] = useState("Send Video");
  const videoRef = useRef<HTMLVideoElement>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const recorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const videoData = new Blob(chunks, { type: "video/webm" });
      setVideoBlob(videoData);
      setSendButtonText("Send");
    };

    recorder.start();
    setRecording(true);
    setMediaRecorder(recorder);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const handleUpload = async () => {
    if (videoBlob) {
      const formData = new FormData();
      formData.append("video", videoBlob, "video_recording.webm");

      alert("Video data sent to the server!");
    }
  };

  return (
    <div className="text-center">
      <video ref={videoRef} autoPlay playsInline className="mb-4 rounded-lg" />
      {recording ? (
        <button
          onClick={stopRecording}
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center"
        >
          <FaStop className="mr-2" /> Stop Recording
        </button>
      ) : (
        <button
          onClick={startRecording}
          className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all flex items-center"
        >
          <FaPlay className="mr-2" /> Start Recording
        </button>
      )}

      {videoBlob && (
        <button
          onClick={handleUpload}
          className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center"
        >
          <FaUpload className="mr-2" /> {sendButtonText}
        </button>
      )}
    </div>
  );
};
