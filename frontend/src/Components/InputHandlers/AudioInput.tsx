import { useState, useRef, useEffect } from "react";
import {
  FaPencilAlt,
  FaMicrophone,
  FaVideo,
  FaStop,
  FaPlay,
  FaUpload,
  FaPaperPlane,
  FaSpinner,
} from "react-icons/fa";

interface Message {
  type: "user" | "bot";
  content: string | Blob;
  analysis?: string;
}
type ConversationItem =
  | Message
  | { type: "audio" | "video" | "text"; content: any };

const AudioRecorder: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [conversation, setConversation] = useState<ConversationItem[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [visibleAnalysis, setVisibleAnalysis] = useState<{
    [key: number]: boolean;
  }>({});
  const [recordedTime, setRecordedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const audioData = new Blob(chunks, { type: "audio/webm" });
      setAudioBlob(audioData);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };

    recorder.start();
    setRecording(true);
    setMessage("Recording...");
    setMediaRecorder(recorder);
    setRecordedTime(0);

    intervalRef.current = setInterval(() => {
      setRecordedTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
      setMessage("");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const handleUpload = async () => {
    if (audioBlob) {
      setIsLoading(true);
      setConversation((prev) => [
        ...prev,
        { type: "audio", content: audioBlob },
      ]);

      const formData = new FormData();
      formData.append("file_content", audioBlob, "audio_recording.webm");
      formData.append("type", "audio");
      formData.append("session_id", "unique_session_id");
      formData.append("message_number", `${conversation.length + 1}`);

      try {
        const response = await fetch(
          "http://localhost:8000/api/receive_input",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to send audio");
        }

        const data = await response.json();
        const textResponse =
          data.generated_followup_question || "No response received.";

        setConversation((prev) => [
          ...prev,
          {
            type: "bot",
            content: textResponse,
            analysis: data.generated_analysis,
          },
        ]);

        if (data.terminate_chat) {
          const diagnosisMessage: Message = {
            type: "bot",
            content: `Diagnosis: ${data.diagnosis || "No Diagnosis"}`,
          };
          const questionnaireMessage: Message = {
            type: "bot",
            content: `Selected Questionnaire: \${
              data.selected_questionnaire || "None"
            }`,
          };
          setConversation((prev) => [
            ...prev,
            diagnosisMessage,
            questionnaireMessage,
          ]);
        }
      } catch (error) {
        console.error("Error uploading audio:", error);
        setConversation((prev) => [
          ...prev,
          {
            type: "bot",
            content: "Error: Unable to process audio. Please try again.",
          },
        ]);
      } finally {
        setAudioBlob(null);
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
    setConversation([
      { type: "bot", content: "Hey! How are you feeling today?" },
    ]);
  }, []);

  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <div className="flex flex-col space-y-4 w-full">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-2xl w-max max-w-xs ${
              msg.type === "audio"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-300 text-black self-start"
            }`}
          >
            {msg.type === "audio" ? (
              <audio controls src={URL.createObjectURL(msg.content)} />
            ) : (
              <p>{msg.content}</p>
            )}
            {msg.type === "bot" && msg.analysis && (
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
        <div className="flex justify-center items-center space-x-4">
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

        {recording && (
          <div className="flex justify-center items-center mt-4">
            <div
              className="radial-progress text-primary"
              style={
                {
                  "--value": recordedTime,
                  "--size": "6rem",
                } as React.CSSProperties
              }
              role="progressbar"
            >
              {recordedTime}s
            </div>
          </div>
        )}

        {audioBlob && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Audio Preview</h3>
              <audio
                controls
                src={URL.createObjectURL(audioBlob)}
                className="w-full mt-4"
              />
              <div className="modal-action">
                <button
                  onClick={handleUpload}
                  className="btn btn-primary btn-lg flex items-center justify-center"
                  aria-label="Send audio"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaUpload className="mr-2 flex items-center" />
                  )}
                  Send Audio
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
