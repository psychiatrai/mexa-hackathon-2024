import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";

interface Message {
  type: "user" | "bot";
  content: string | Blob;
  analysis?: string;
}
type ConversationItem =
  | Message
  | { type: "audio" | "video" | "text"; content: any };

const TextInput: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [visibleAnalysis, setVisibleAnalysis] = useState<{
    [key: number]: boolean;
  }>({});

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "bot", content: "Please enter some text." },
      ]);
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "user", content: text },
    ]);

    setText("");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("text_content", text);
    formData.append("session_id", "unique_session_id");
    formData.append("message_number", `${messages.length + 1}`);

    try {
      const response = await fetch(
        `http://localhost:8000/api/receive_input?type=text`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Server responded with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();

      const botResponse: Message = {
        type: "bot",
        content: data.generated_followup_question,
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
      console.error("Error fetching from server:", error.message);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "bot",
          content: `Error: Unable to process your input. Please try again. Details: ${error.message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

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
            <p style={{ whiteSpace: "pre-wrap" }}>
              {typeof msg.content === "string"
                ? msg.content
                : "Invalid content"}
            </p>
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
        <textarea
          ref={textareaRef}
          className="w-full border rounded-lg p-4 bg-white text-black shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none overflow-hidden"
          placeholder="Type here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          aria-label="Text input"
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`absolute right-4 bottom-4 px-4 py-2 rounded-lg flex items-center justify-center transition-all ${
            isLoading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          aria-label="Send message"
        >
          {isLoading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaPaperPlane className="text-xl" />
          )}
        </button>
      </div>
    </div>
  );
};

export default TextInput;

// import { useState, useRef, useEffect } from "react";
// import { FaPaperPlane, FaSpinner } from "react-icons/fa";

// interface Message {
//   type: "user" | "bot";
//   content: string | Blob;
//   analysis?: string;
// }
// type ConversationItem =
//   | Message
//   | { type: "audio" | "video" | "text"; content: any };

// const TextInput: React.FC = () => {
//   const [text, setText] = useState<string>("");
//   const [isMultiline, setIsMultiline] = useState<boolean>(false);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [visibleAnalysis, setVisibleAnalysis] = useState<{
//     [key: number]: boolean;
//   }>({});

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.shiftKey && e.key === "Enter") {
//       setIsMultiline(true);
//     } else if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit();
//     }
//   };

//   const handleSubmit = async () => {
//     if (!text.trim()) {
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { type: "bot", content: "Please enter some text." },
//       ]);
//       return;
//     }

//     setMessages((prevMessages) => [
//       ...prevMessages,
//       { type: "user", content: text },
//     ]);

//     setText("");
//     setIsMultiline(false);
//     setIsLoading(true);

//     const formData = new FormData();
//     formData.append("text_content", text);
//     formData.append("session_id", "unique_session_id");
//     formData.append("message_number", `${messages.length + 1}`);

//     try {
//       const response = await fetch(
//         `http://localhost:8000/api/receive_input?type=text`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(
//           `Server responded with status ${response.status}: ${errorText}`
//         );
//       }

//       const data = await response.json();

//       const botResponse: Message = {
//         type: "bot",
//         content: data.generated_followup_question,
//         analysis: data.generated_analysis,
//       };

//       setMessages((prevMessages) => [...prevMessages, botResponse]);

//       if (data.terminate_chat) {
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           {
//             type: "bot",
//             content: `Diagnosis: ${data.diagnosis || "No Diagnosis"}`,
//           },
//           {
//             type: "bot",
//             content: `Selected Questionnaire: ${
//               data.selected_questionnaire || "None"
//             }`,
//           },
//         ]);
//       }
//     } catch (error: any) {
//       console.error("Error fetching from server:", error.message);
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         {
//           type: "bot",
//           content: `Error: Unable to process your input. Please try again. Details: ${error.message}`,
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleToggleAnalysis = (index: number) => {
//     setVisibleAnalysis((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   useEffect(() => {
//     setMessages([{ type: "bot", content: "Hey! How are you feeling today?" }]);
//   }, []);

//   return (
//     <div className="flex flex-col gap-4 items-center w-full">
//       <div className="flex flex-col space-y-4 w-full">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`p-2 rounded-2xl w-max max-w-xs ${
//               msg.type === "user"
//                 ? "bg-blue-500 text-white self-end"
//                 : "bg-gray-300 text-black self-start"
//             }`}
//           >
//             <p>
//               {typeof msg.content === "string"
//                 ? msg.content
//                 : "Invalid content"}
//             </p>
//             {msg.analysis && (
//               <div className="mt-2 border-t pt-2">
//                 <div className="flex justify-between items-center">
//                   <button
//                     onClick={() => handleToggleAnalysis(index)}
//                     className="text-lg text-blue-500 hover:text-blue-600"
//                   >
//                     {visibleAnalysis[index] ? "Hide Analysis" : "Show Analysis"}
//                   </button>
//                 </div>
//                 {visibleAnalysis[index] && (
//                   <p className="mt-2 text-sm italic text-gray-600">
//                     <strong>Analysis: </strong>
//                     {msg.analysis}
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       <div className="relative w-full">
//         <textarea
//           rows={isMultiline ? 4 : 1}
//           className="w-full border rounded-lg p-4 bg-white text-black shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
//           placeholder="Type here..."
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           onKeyDown={handleKeyDown}
//           disabled={isLoading}
//           aria-label="Text input"
//         />
//         <button
//           onClick={handleSubmit}
//           disabled={isLoading}
//           className={`absolute right-4 bottom-4 px-4 py-2 rounded-lg flex items-center justify-center transition-all ${
//             isLoading
//               ? "bg-gray-500 cursor-not-allowed"
//               : "bg-blue-500 text-white hover:bg-blue-600"
//           }`}
//           aria-label="Send message"
//         >
//           {isLoading ? (
//             <FaSpinner className="animate-spin" />
//           ) : (
//             <FaPaperPlane className="text-xl" />
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TextInput;
