import React, { useState, useEffect } from "react";
import axios from "axios";

const LinkedInGenerator: React.FC = () => {
  const [topic, setTopic] = useState<string>("");
  const [tone, setTone] = useState<string>("Inspirational");
  const [length, setLength] = useState<string>("Medium");
  const [buzzwords, setBuzzwords] = useState<string>("");
  const [includeHashtags, setIncludeHashtags] = useState<boolean>(true);
  const [post, setPost] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([]);

  // Save history and post to localStorage
  useEffect(() => {
    localStorage.setItem("postHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("currentPost", post);
  }, [post]);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedHistory = JSON.parse(
      localStorage.getItem("postHistory") || "[]"
    );
    const savedPost = localStorage.getItem("currentPost") || "";
    setHistory(savedHistory);
    setPost(savedPost);
  }, []);

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
        content:
          "You are an assistant that generates LinkedIn-style posts. Make them engaging and professional.",
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
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`, // Make sure this key is defined in your `.env`
          },
        }
      );

      const aiResponse = response.data.choices[0].message.content.trim();
      setPost(aiResponse);
      setHistory((prev) => [aiResponse, ...prev]);
    } catch (error: any) {
      console.error("Error generating post:", error.response || error.message);
      setPost("Failed to generate post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(post);
    alert("Copied to clipboard!");
  };

  const shareOnLinkedIn = (): void => {
    const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=https://yourapp.com&title=Generated%20Post&summary=${encodeURIComponent(
      post
    )}`;
    window.open(linkedInUrl, "_blank");
  };

  const savePost = (): void => {
    setHistory((prev) => [post, ...prev]);
    alert("Post saved to history!");
  };

  return (
    <div className="min-h-screen bg-[#DFF2EB] text-gray-800 flex flex-col items-center p-6">
      {/* Header */}
      <div className="w-full max-w-4xl p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#4A628A]">
          LinkedIn Post Generator
        </h1>
        <button
          onClick={() => setHistory([])}
          className="px-4 py-2 rounded-lg bg-[#B9E5E8] hover:bg-[#7AB2D3] text-[#4A628A]"
        >
          Clear History
        </button>
      </div>

      {/* Main Card */}
      <div className="max-w-4xl w-full bg-[#B9E5E8] shadow-xl rounded-lg p-8 space-y-6">
        <div>
          <label className="block font-medium mb-1 text-[#4A628A]">Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Leadership, Growth"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-medium mb-1 text-[#4A628A]">Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="Inspirational">Inspirational</option>
            <option value="Funny">Funny</option>
            <option value="Professional">Professional</option>
            <option value="Thought-Provoking">Thought-Provoking</option>
            <option value="Casual">Casual</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1 text-[#4A628A]">
            Post Length
          </label>
          <select
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="Short">Short</option>
            <option value="Medium">Medium</option>
            <option value="Long">Long</option>
          </select>
        </div>

        <div>
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
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={includeHashtags}
            onChange={(e) => setIncludeHashtags(e.target.checked)}
            className="h-5 w-5"
          />
          <label className="text-[#4A628A]">Include Hashtags</label>
        </div>

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

      {/* Live Preview */}
      {post && (
        <div className="max-w-4xl w-full mt-8 bg-[#B9E5E8] shadow-xl rounded-lg p-6">
          <h2 className="text-lg font-semibold text-[#4A628A] mb-4">
            Live Preview
          </h2>
          <div className="p-4 bg-white rounded-lg">
            <p className="text-gray-800 whitespace-pre-wrap">{post}</p>
          </div>
          <div className="flex gap-4 mt-4">
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
              onClick={savePost}
              className="px-4 py-2 bg-[#B9E5E8] text-[#4A628A] rounded-lg hover:bg-[#7AB2D3]"
            >
              Save Post
            </button>
          </div>
        </div>
      )}

      {/* Post History */}
      {history.length > 0 && (
        <div className="max-w-4xl w-full mt-8">
          <h2 className="text-lg font-semibold text-[#4A628A]">Saved Posts</h2>
          <ul className="space-y-4 mt-4">
            {history.map((item, index) => (
              <li
                key={index}
                className="p-4 bg-white rounded-lg text-gray-800 shadow"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LinkedInGenerator;
