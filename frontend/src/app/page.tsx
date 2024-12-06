/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import AudioRecorder from "@/Components/InputHandlers/AudioInput";
import TextInput from "@/Components/InputHandlers/TextInput";
import VideoRecorder from "@/Components/InputHandlers/VideoInput";
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

export default function Home()
{
  const [activeInput, setActiveInput] = useState<
    "text" | "audio" | "video" | null
  >(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">psychiatrai</h1>
        <p className="text-lg text-gray-600">
          Welcome to psychiatrai Mental health measurement bot!
        !
        </p>
      </header>

      <main className="w-full max-w-3xl bg-white shadow-lg p-8 rounded-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-gray-800">
          <Card
            icon={<FaPencilAlt />}
            title="Text Input"
            description="Write down your thoughts and feelings"
            onClick={() => setActiveInput("text")}
            isActive={activeInput === "text"}
          />
          <Card
            icon={<FaMicrophone />}
            title="Audio Input"
            description="Use voice mode for more interactivity"
            onClick={() => setActiveInput("audio")}
            isActive={activeInput === "audio"}
          />
          <Card
            icon={<FaVideo />}
            title="Video Input"
            description="Use video mode for the best results"
            onClick={() => setActiveInput("video")}
            isActive={activeInput === "video"}
          />
        </div>

        {activeInput && (
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">
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

// 'use client'
// import GAD7Form from "@/Components/Questionaires/GAD-7 ";
// import IESRForm from "@/Components/Questionaires/IES-R";
// import PHQ9Form from "@/Components/Questionaires/PHQ-9";
// import React from "react";

// const Home: React.FC = () => {
//   return (
//     <div>
//       <PHQ9Form />
//       {/* <GAD7Form/> */}
//       {/* <IESRForm/> */}
//     </div>
//   );
// };

// export default Home;
