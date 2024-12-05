import { useState, useRef, useEffect } from "react";
import { FaStop, FaPlay, FaUpload, FaSpinner } from "react-icons/fa";

interface Message {
  type: "user" | "bot";
  content: string | Blob;
  analysis?: string;
}
type ConversationItem =
  | Message
  | { type: "audio" | "video" | "text"; content: any };

const VideoRecorder: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleAnalysis, setVisibleAnalysis] = useState<{
    [key: number]: boolean;
  }>({});

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const recorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
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
        videoRef.current.muted = false;
      }
    }
  };

  const handleUpload = async () => {
    if (videoBlob) {
      setIsLoading(true);
      setMessages((prev) => [...prev, { type: "user", content: videoBlob }]);

      const formData = new FormData();
      formData.append("file_content", videoBlob, "video_recording.webm");
      formData.append("type", "video");
      formData.append("session_id", "unique_session_id");
      formData.append("message_number", `${messages.length + 1}`);

      try {
        const response = await fetch(
          "http://localhost:8000/api/receive_input",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to send video");
        }

        const data = await response.json();
        const textResponse =
          data.generated_followup_question || "No response received.";

        const botResponse: Message = {
          type: "bot",
          content: textResponse,
          analysis: data.generated_analysis,
        };

        setMessages((prevMessages) => [...prevMessages, botResponse]);

        if (data.terminate_chat) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              type: "bot",
              content: `Diagnosis: ${data.diagnosis || "No Diagnosis"}`,
            },
            {
              type: "bot",
              content: `Selected Questionnaire: ${
                data.selected_questionnaire || "None"
              }`,
            },
          ]);
        }
      } catch (error: any) {
        console.error("Error uploading video:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: "bot",
            content: `Error: Unable to process video. Please try again. Details: ${error.message}`,
          },
        ]);
      } finally {
        setVideoBlob(null);
        setIsLoading(false);
      }
    }
  };

  const handleToggleAnalysis = (index: number) => {
    setVisibleAnalysis((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    setMessages([{ type: "bot", content: "Hey! How are you feeling today?" }]);
  }, []);

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
            {typeof msg.content === "string" ? (
              <p>{msg.content}</p>
            ) : (
              <video
                controls
                className="w-48 h-auto"
                src={URL.createObjectURL(msg.content)}
              />
            )}
            {msg.analysis && (
              <div className="mt-2 border-t pt-2">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleToggleAnalysis(index)}
                    className="text-lg text-blue-500 hover:text-blue-600"
                  >
                    {visibleAnalysis[index] ? "Hide Analysis" : "Show Analysis"}
                  </button>
                </div>
                {visibleAnalysis[index] && (
                  <p className="mt-2 text-sm italic text-gray-600">
                    <strong>Analysis: </strong>
                    {msg.analysis}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="relative w-full">
        <video
          ref={videoRef}
          autoPlay
          className="w-full h-auto bg-black"
          aria-label="Video preview"
        ></video>
        <div className="flex justify-center items-center space-x-4 mt-4">
          {recording ? (
            <button
              onClick={stopRecording}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center"
              aria-label="Stop recording"
            >
              <FaStop className="mr-2" /> Stop Recording
            </button>
          ) : (
            <button
              onClick={startRecording}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center"
              aria-label="Start recording"
            >
              <FaPlay className="mr-2" /> Start Recording
            </button>
          )}
        </div>
        {videoBlob && (
          <button
            onClick={handleUpload}
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center"
            aria-label="Send video"
            disabled={isLoading}
          >
            {isLoading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaUpload className="mr-2" />
            )}{" "}
            Send Video
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;
