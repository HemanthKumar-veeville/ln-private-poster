import React, { useState } from "react";
import axios from "axios";
import { FaChevronDown, FaTimesCircle, FaLinkedin } from "react-icons/fa";

const LinkedInGenerator: React.FC = () => {
  // States for user inputs
  const [topic, setTopic] = useState<string>("");
  const [tone, setTone] = useState<string>("Inspirational");
  const [length, setLength] = useState<string>("Medium");
  const [buzzwords, setBuzzwords] = useState<string>("");
  const [includeHashtags, setIncludeHashtags] = useState<boolean>(true);
  const [systemMessage, setSystemMessage] = useState<string>(
    "You are an assistant that generates LinkedIn-style posts. Make them engaging and professional."
  );

  // States for functionality
  const [post, setPost] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState<boolean>(false);

  // Function to generate the LinkedIn post
  const generatePost = async (): Promise<void> => {
    if (!topic) {
      alert("Please enter a topic!");
      return;
    }

    setLoading(true);
    setPost("");

    const messages = [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: `
          Write a LinkedIn-style post with the following details:
          - Topic: "${topic}"
          - Tone: ${tone}
          - Length: ${length}
          - Include buzzwords: "${buzzwords || "None"}"
          - Include hashtags: ${includeHashtags}
        `,
      },
    ];

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: messages,
          max_tokens:
            length === "Short" ? 100 : length === "Medium" ? 300 : 500,
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
        }
      );

      const aiResponse = response.data.choices[0].message.content.trim();
      setPost(aiResponse);
      setIsPreview(true);
    } catch (error: any) {
      console.error("Error generating post:", error.response || error.message);
      setPost("Failed to generate post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Clear all inputs
  const clearInputs = (): void => {
    setTopic("");
    setTone("Inspirational");
    setLength("Medium");
    setBuzzwords("");
    setIncludeHashtags(true);
    setSystemMessage(
      "You are an assistant that generates LinkedIn-style posts. Make them engaging and professional."
    );
  };

  // Copy post to clipboard
  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(post);
    alert("Copied to clipboard!");
  };

  // Share post on LinkedIn
  const shareOnLinkedIn = (): void => {
    const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=https://yourapp.com&title=Generated%20Post&summary=${encodeURIComponent(
      post
    )}`;
    window.open(linkedInUrl, "_blank");
  };

  // Handle going back to the form
  const handleBack = (): void => {
    setIsPreview(false);
    setPost("");
  };

  return (
    <div className="min-h-screen bg-[#DFF2EB] text-gray-800 flex items-center justify-center p-6">
      {!isPreview && (
        <div className="max-w-4xl w-full bg-[#B9E5E8] shadow-xl rounded-lg p-8 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaLinkedin className="text-blue-600 w-10 h-10" />
              <h1 className="text-2xl font-bold text-[#4A628A] ml-4">
                Post Generator
              </h1>
            </div>
            <button
              onClick={clearInputs}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              Reset
            </button>
          </div>

          {/* Topic Input */}
          <div className="relative">
            <label className="block font-medium mb-1 text-[#4A628A]">
              Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Leadership, Growth"
              className="w-full px-4 py-2 border rounded-lg"
            />
            {topic && (
              <FaTimesCircle
                onClick={() => setTopic("")}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700"
              />
            )}
          </div>

          {/* Tone Dropdown */}
          <div className="relative">
            <label className="block font-medium mb-1 text-[#4A628A]">
              Tone
            </label>
            <div className="relative">
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg appearance-none"
              >
                <option value="Inspirational">Inspirational</option>
                <option value="Funny">Funny</option>
                <option value="Professional">Professional</option>
                <option value="Thought-Provoking">Thought-Provoking</option>
                <option value="Casual">Casual</option>
              </select>
              <FaChevronDown className="absolute top-1/2 right-4 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Length Dropdown */}
          <div className="relative">
            <label className="block font-medium mb-1 text-[#4A628A]">
              Post Length
            </label>
            <div className="relative">
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg appearance-none"
              >
                <option value="Short">Short</option>
                <option value="Medium">Medium</option>
                <option value="Long">Long</option>
              </select>
              <FaChevronDown className="absolute top-1/2 right-4 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Buzzwords Input */}
          <div className="relative">
            <label className="block font-medium mb-1 text-[#4A628A]">
              Buzzwords (Optional)
            </label>
            <input
              type="text"
              value={buzzwords}
              onChange={(e) => setBuzzwords(e.target.value)}
              placeholder="e.g., Synergy, Disruption"
              className="w-full px-4 py-2 border rounded-lg"
            />
            {buzzwords && (
              <FaTimesCircle
                onClick={() => setBuzzwords("")}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700"
              />
            )}
          </div>

          {/* Custom System Message */}
          <div className="relative">
            <label className="block font-medium mb-1 text-[#4A628A]">
              Custom System Instruction (Optional)
            </label>
            <textarea
              value={systemMessage}
              onChange={(e) => setSystemMessage(e.target.value)}
              placeholder="Custom instruction for the AI..."
              className="w-full px-4 py-2 border rounded-lg"
            />
            {systemMessage && (
              <FaTimesCircle
                onClick={() => setSystemMessage("")}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700"
              />
            )}
          </div>

          {/* Include Hashtags */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeHashtags}
              onChange={(e) => setIncludeHashtags(e.target.checked)}
              className="h-5 w-5"
            />
            <label className="text-[#4A628A]">Include Hashtags</label>
          </div>

          {/* Generate Button */}
          <button
            onClick={generatePost}
            disabled={loading}
            className={`w-full px-4 py-2 rounded-lg text-white ${
              loading
                ? "bg-[#7AB2D3] cursor-not-allowed"
                : "bg-[#4A628A] hover:bg-[#7AB2D3]"
            }`}
          >
            {loading ? "Generating..." : "Generate Post"}
          </button>
        </div>
      )}

      {isPreview && (
        <div className="max-w-4xl w-full bg-[#B9E5E8] shadow-xl rounded-lg p-6 space-y-6">
          <h1 className="text-2xl font-bold text-[#4A628A] mb-4">
            Generated LinkedIn Post
          </h1>
          <div className="p-4 bg-white rounded-lg whitespace-pre-wrap">
            <p className="text-gray-800">{post}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-[#7AB2D3] text-white rounded-lg hover:bg-[#4A628A]"
            >
              Copy to Clipboard
            </button>
            <button
              onClick={shareOnLinkedIn}
              className="px-4 py-2 bg-[#4A628A] text-white rounded-lg hover:bg-[#7AB2D3]"
            >
              Share on LinkedIn
            </button>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkedInGenerator;
