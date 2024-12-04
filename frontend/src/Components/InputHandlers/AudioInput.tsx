import { useState } from "react";

// AudioRecorder component to handle the start/stop recording actions
export const AudioRecorder = ({
  onCapture,
}: {
  onCapture: (audioBlob: Blob) => void;
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);

    recorder.ondataavailable = (event) => {
      onCapture(event.data);
    };

    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`btn ${isRecording ? "btn-danger" : "btn-primary"}`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  );
};

// Main component that handles the audio input and displays success message
export const AudioInputComponent = () => {
  const [audioData, setAudioData] = useState<Blob | null>(null);

  const handleAudioCapture = (audioBlob: Blob) => {
    setAudioData(audioBlob);
    // Simulate audio processing and response after 2 seconds
    setTimeout(() => {
      console.log("Audio processed:", audioBlob);
    }, 2000);
  };

  return (
    <div className="flex-1 p-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 text-center">Audio Input</h2>
      {/* Audio Recorder */}
      <AudioRecorder onCapture={handleAudioCapture} />
      {audioData && (
        <div className="mt-6 text-center">
          <p className="text-lg text-green-500">Audio captured successfully!</p>
        </div>
      )}
    </div>
  );
};
