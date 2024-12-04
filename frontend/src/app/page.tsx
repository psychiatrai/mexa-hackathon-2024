/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef } from "react";
import {
  FaPencilAlt,
  FaMicrophone,
  FaVideo,
  FaStop,
  FaPlay,
  FaUpload,
  FaPaperPlane,
} from "react-icons/fa";

export default function Home() {
  const [activeInput, setActiveInput] = useState<
    "text" | "audio" | "video" | null
  >(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Psychiatrai</h1>
        <p className="text-lg text-gray-600">
          Welcome to PsychiatraiBot, your trusted companion for mental health
          and well-being support!
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
      isActive ? "bg-blue-700 text-white" : "bg-gray-50 hover:shadow-lg"
    }`}
  >
    <span className="text-4xl">{icon}</span>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-sm text-center">{description}</p>
  </div>
);

const TextInput = () => {
  const [text, setText] = useState("");
  const [isMultiline, setIsMultiline] = useState(false);
  const [messages, setMessages] = useState<
    { type: "user" | "bot"; content: string }[]
  >([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.shiftKey && e.key === "Enter") {
      setIsMultiline(true);
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (text.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "user", content: text },
      ]);

      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "bot", content: "This is a sample response." },
        ]);
      }, 1000);

      setText("");
      setIsMultiline(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <div className="flex flex-col space-y-4 w-full">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-2xl w-max max-w-xs ${
              msg.type === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-300 text-black self-start"
            }`}
          >
            <p>{msg.content}</p>
          </div>
        ))}
      </div>

      <div className="relative w-full">
        <textarea
          rows={isMultiline ? 4 : 1}
          className="w-full border rounded-lg p-4 bg-white text-black shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
          placeholder="Type here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSubmit}
          className="absolute right-4 bottom-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center"
        >
          <FaPaperPlane className="text-xl" />
        </button>
      </div>
    </div>
  );
};

// const AudioRecorder = () => {
//   const [recording, setRecording] = useState(false);
//   const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
//   const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
//     null
//   );
//   const [message, setMessage] = useState("");
//   const [sendButtonText, setSendButtonText] = useState("Send Audio");

//   const startRecording = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const recorder = new MediaRecorder(stream);
//     const chunks: Blob[] = [];

//     recorder.ondataavailable = (e) => chunks.push(e.data);
//     recorder.onstop = () => {
//       const audioData = new Blob(chunks, { type: "audio/webm" });
//       setAudioBlob(audioData);
//       setSendButtonText("Send");
//     };

//     recorder.start();
//     setRecording(true);
//     setMessage("Recording...");
//     setMediaRecorder(recorder);
//   };

//   const stopRecording = () => {
//     if (mediaRecorder) {
//       mediaRecorder.stop();
//       setRecording(false);
//       setMessage("");
//     }
//   };

//   const handleUpload = async () => {
//     if (audioBlob) {
//       const formData = new FormData();
//       formData.append("audio", audioBlob, "audio_recording.webm");

//       alert("Audio data sent to the server!");
//     }
//   };

//   return (
//     <div className="text-center justify-center items-center">
//       {message && <p className="text-red-500 mb-4">{message}</p>}
//       <div className="flex justify-center items-center space-x-4">
//         {recording ? (
//           <button
//             onClick={stopRecording}
//             className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center"
//           >
//             <FaStop className="mr-2" /> Stop Recording
//           </button>
//         ) : (
//           <button
//             onClick={startRecording}
//             className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center"
//           >
//             <FaPlay className="mr-2" /> Start Recording
//           </button>
//         )}
//       </div>

//       {audioBlob && (
//         <button
//           onClick={handleUpload}
//           className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center"
//         >
//           <FaUpload className="mr-2" /> {sendButtonText}
//         </button>
//       )}
//     </div>
//   );
// };

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [conversation, setConversation] = useState<
    Array<{ type: "audio" | "text"; content: any }>
  >([]);
  const [message, setMessage] = useState("");

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const audioData = new Blob(chunks, { type: "audio/webm" });
      setAudioBlob(audioData);
    };

    recorder.start();
    setRecording(true);
    setMessage("Recording...");
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
      setConversation((prev) => [
        ...prev,
        { type: "audio", content: audioBlob },
      ]);

      const formData = new FormData();
      formData.append("audio", audioBlob, "audio_recording.webm");

      try {
        const response = await fetch("/api/gemini", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to send audio");
        }

        const data = await response.json();
        const textResponse = data.textResponse || "No response received.";

        // Add response to conversation
        setConversation((prev) => [
          ...prev,
          { type: "text", content: textResponse },
        ]);
      } catch (error) {
        console.error("Error uploading audio:", error);
        setConversation((prev) => [
          ...prev,
          { type: "text", content: "Error: Unable to process audio." },
        ]);
      } finally {
        // Reset audioBlob to allow another recording
        setAudioBlob(null);
      }
    }
  };

  return (
    <div className="text-center justify-center items-center">
      <div className="mb-4">
        <h2 className="text-lg font-bold">Chat with Audio Input</h2>
        <div className="border border-gray-300 rounded-md p-4 h-64 overflow-y-scroll bg-gray-50">
          {conversation.map((item, index) => (
            <div key={index} className="mb-2">
              {item.type === "audio" ? (
                <div className="flex items-center">
                  <p className="text-sm font-medium text-gray-600 mr-2 self-end">
                    You (Audio):
                  </p>
                  <audio controls src={URL.createObjectURL(item.content)} />
                </div>
              ) : (
                <div className="flex items-center">
                  <p className="text-sm font-medium  text-blue-600 mr-2 self-start">
                    Bot:
                  </p>
                  <p className="text-sm text-black">{item.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center space-x-4">
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
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center"
          >
            <FaPlay className="mr-2" /> Start Recording
          </button>
        )}
      </div>

      {audioBlob && (
        <button
          onClick={handleUpload}
          className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center"
        >
          <FaUpload className="mr-2" /> Send Audio
        </button>
      )}
    </div>
  );
};

// const VideoRecorder = () => {
//   const [recording, setRecording] = useState(false);
//   const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
//   const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
//     null
//   );
//   const [sendButtonText, setSendButtonText] = useState("Send Video");
//   const videoRef = useRef<HTMLVideoElement>(null);

//   const startRecording = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     const recorder = new MediaRecorder(stream);
//     const chunks: Blob[] = [];

//     if (videoRef.current) {
//       videoRef.current.srcObject = stream;
//     }

//     recorder.ondataavailable = (e) => chunks.push(e.data);
//     recorder.onstop = () => {
//       const videoData = new Blob(chunks, { type: "video/webm" });
//       setVideoBlob(videoData);
//       setSendButtonText("Send");
//     };

//     recorder.start();
//     setRecording(true);
//     setMediaRecorder(recorder);
//   };

//   const stopRecording = () => {
//     if (mediaRecorder) {
//       mediaRecorder.stop();
//       setRecording(false);
//     }
//   };

//   const handleUpload = async () => {
//     if (videoBlob) {
//       const formData = new FormData();
//       formData.append("video", videoBlob, "video_recording.webm");

//       alert("Video data sent to the server!");
//     }
//   };

//   return (
//     <div className="text-center">
//       <video ref={videoRef} autoPlay className="mb-4 w-full h-auto"></video>
//       <div className="flex justify-center items-center space-x-4">
//         {recording ? (
//           <button
//             onClick={stopRecording}
//             className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center"
//           >
//             <FaStop className="mr-2" /> Stop Recording
//           </button>
//         ) : (
//           <button
//             onClick={startRecording}
//             className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center"
//           >
//             <FaPlay className="mr-2" /> Start Recording
//           </button>
//         )}
//       </div>

//       {videoBlob && (
//         <button
//           onClick={handleUpload}
//           className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center"
//         >
//           <FaUpload className="mr-2" /> {sendButtonText}
//         </button>
//       )}
//     </div>
//   );
// };


const VideoRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [conversation, setConversation] = useState<
    Array<{ type: "video" | "text"; content: any }>
  >([]);
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
    };

    recorder.start();
    setRecording(true);
    setMediaRecorder(recorder);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  };

  const handleUpload = async () => {
    if (videoBlob) {
      // Add video to conversation
      setConversation((prev) => [
        ...prev,
        { type: "video", content: videoBlob },
      ]);

      const formData = new FormData();
      formData.append("video", videoBlob, "video_recording.webm");

      try {
        const response = await fetch("/api/gemini", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to send video");
        }

        const data = await response.json();
        const textResponse = data.textResponse || "No response received.";

        // Add bot response to conversation
        setConversation((prev) => [
          ...prev,
          { type: "text", content: textResponse },
        ]);
      } catch (error) {
        console.error("Error uploading video:", error);
        setConversation((prev) => [
          ...prev,
          { type: "text", content: "Error: Unable to process video." },
        ]);
      } finally {
        // Reset videoBlob to allow another recording
        setVideoBlob(null);
      }
    }
  };

  return (
    <div className="text-center">
      <div className="mb-4">
        <h2 className="text-lg font-bold">Chat with Video Input</h2>
        <div className="border border-gray-300 rounded-md p-4 h-64 overflow-y-scroll bg-gray-50">
          {conversation.map((item, index) => (
            <div key={index} className="mb-2">
              {item.type === "video" ? (
                <div className="flex items-center">
                  <p className="text-lg font-medium text-gray-600 mr-2">
                    You (Video):
                  </p>
                  <video
                    controls
                    className="w-48 h-auto"
                    src={URL.createObjectURL(item.content)}
                  />
                </div>
              ) : (
                <div className="flex items-center">
                  <p className="text-sm font-medium text-blue-600 mr-2">Bot:</p>
                  <p className="text-lg text-black">{item.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <video
        ref={videoRef}
        autoPlay
        className="mb-4 w-full h-auto bg-black"
      ></video>

      <div className="flex justify-center items-center space-x-4">
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
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center"
          >
            <FaPlay className="mr-2" /> Start Recording
          </button>
        )}
      </div>

      {videoBlob && (
        <button
          onClick={handleUpload}
          className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center"
        >
          <FaUpload className="mr-2" /> Send Video
        </button>
      )}
    </div>
  );
};