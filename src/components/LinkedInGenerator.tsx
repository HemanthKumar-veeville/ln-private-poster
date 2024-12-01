import React, { useState } from "react";
import axios from "axios";
import {
  FaChevronDown,
  FaTimesCircle,
  FaLinkedin,
  FaCopy,
  FaShareSquare,
  FaRedo,
} from "react-icons/fa";

const LinkedInGenerator: React.FC = () => {
  const [scenario, setScenario] = useState<string>("");
  const [includeScenario, setIncludeScenario] = useState<boolean>(false);
  const [post, setPost] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState<boolean>(false);

  const buttonClasses = `
    px-4 py-2 rounded-lg text-white flex items-center justify-center gap-2
    transition-all duration-200 bg-primary hover:bg-primaryDark
    focus:ring-2 focus:ring-offset-2 focus:ring-primaryDark
    disabled:bg-secondary disabled:cursor-not-allowed disabled:opacity-70
  `;

  const inputClasses = `
    w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1
    focus:ring-primaryDark focus:border-primaryDark
    border-secondary bg-lightest text-gray-800
  `;

  const generatePost = async (): Promise<void> => {
    setLoading(true);
    setPost("");

    const prompt =
      includeScenario && scenario
        ? `Write a funny, creative LinkedIn-style post in the following format:
---
🥄 *[Insert a quirky or humorous title related to the situation here]*

Describe the situation: "${scenario}" in a playful, engaging, and lighthearted tone. Narrate it from my perspective ('I', 'I'm'). Use relatable humor and emojis to add flair.

Conclude with:
🔑 *Moral of the story?*
- Include 2-3 concise, witty takeaways from the story.
- Frame these insights positively, making them motivational or funny.

End with relevant hashtags like #OfficeWisdom or #LifeLessons.
---
Make the story concise and entertaining while keeping the format exactly like the one above.`
        : `Write a funny, creative LinkedIn-style post in the following format:
---
🥄 *[Insert a quirky or humorous title related to an everyday situation]*

Describe a random, relatable situation in a playful, engaging, and lighthearted tone. Narrate it from my perspective ('I', 'I'm'). Use relatable humor and emojis to add flair.

Conclude with:
🔑 *Moral of the story?*
- Include 2-3 concise, witty takeaways from the story.
- Frame these insights positively, making them motivational or funny.

End with relevant hashtags like #OfficeWisdom or #LifeLessons.
---
Make the story concise and entertaining while keeping the format exactly like the one above.`;

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a creative assistant who writes dynamic, engaging, and hilariously funny LinkedIn posts in a specific format. Posts should include a catchy title with an emoji, a humorous and relatable narrative, a moral with concise takeaways, and end with relevant hashtags.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 300,
          temperature: 0.8,
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

  const handleBack = (): void => {
    setIsPreview(false);
    setPost("");
  };

  return (
    <div className="min-h-screen bg-lightest text-gray-800 flex items-center justify-center p-4 md:p-6">
      {!isPreview ? (
        <div className="max-w-4xl w-full bg-white shadow-xl rounded-lg p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaLinkedin className="text-primary w-8 h-8 md:w-10 md:h-10" />
              <h1 className="text-xl md:text-2xl font-bold text-primaryDark ml-4">
                LinkedIn Fun Post Generator
              </h1>
            </div>
          </div>

          {/* Include Scenario Option */}
          <div
            className="flex items-center gap-4 bg-lightest border border-secondary p-3 rounded-lg cursor-pointer transition-colors duration-200 hover:border-primaryDark"
            onClick={() => setIncludeScenario(!includeScenario)}
          >
            <div className="relative">
              <input
                type="checkbox"
                id="includeScenario"
                checked={includeScenario}
                onChange={(e) => setIncludeScenario(e.target.checked)}
                className="peer hidden"
              />
              <div className="w-6 h-6 rounded-md border-2 border-secondary flex items-center justify-center peer-checked:bg-primary peer-checked:border-primary cursor-pointer transition-colors duration-200">
                {includeScenario && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="white"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </div>
            <label
              htmlFor="includeScenario"
              className="text-primaryDark font-medium cursor-pointer peer-checked:text-primary transition-colors duration-200"
            >
              Provide a specific scenario
            </label>
          </div>

          {/* Scenario Text Area */}
          {includeScenario && (
            <div className="relative">
              <label className="block font-medium mb-1 text-primaryDark">
                Describe your scenario
              </label>
              <textarea
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                placeholder="e.g., My cat knocked over my coffee, and it spiraled into chaos..."
                className={inputClasses}
              />
              {scenario && (
                <FaTimesCircle
                  onClick={() => setScenario("")}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 w-5 h-5 text-secondary cursor-pointer hover:text-primary"
                />
              )}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={generatePost}
            disabled={loading}
            className={`${buttonClasses} ${loading && "cursor-not-allowed"}`}
          >
            {loading ? <FaRedo className="animate-spin" /> : <FaChevronDown />}
            {loading ? "Generating..." : "Generate Post"}
          </button>
        </div>
      ) : (
        <div className="max-w-4xl w-full bg-white shadow-xl rounded-lg p-6 md:p-8 space-y-6">
          {/* Generated Post Preview */}
          <h1 className="text-xl md:text-2xl font-bold text-primaryDark mb-4">
            Your Fun LinkedIn Post
          </h1>
          <div className="p-4 bg-lightest rounded-lg whitespace-pre-wrap border border-secondary">
            <p className="text-gray-800">{post}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigator.clipboard.writeText(post)}
              className={buttonClasses}
            >
              <FaCopy />
              Copy to Clipboard
            </button>
            <button
              onClick={() =>
                window.open(
                  `https://www.linkedin.com/shareArticle?mini=true&url=https://yourapp.com&title=Generated%20Post&summary=${encodeURIComponent(
                    post
                  )}`,
                  "_blank"
                )
              }
              className={buttonClasses}
            >
              <FaShareSquare />
              Share on LinkedIn
            </button>
            <button onClick={handleBack} className={buttonClasses}>
              <FaTimesCircle />
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkedInGenerator;
