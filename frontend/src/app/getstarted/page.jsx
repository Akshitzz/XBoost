"use client";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function GetStartedPage() {
  const [tweetcount, setTweetCount] = useState(0);
  const [formData, setFormData] = useState({
    username: "",
    productName: "",
    productDetails: "",
    productFeatures: "",
    productProblem: "",
    productMarketing: "",
    tweetCount: 0,
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/generate-tweet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      alert(`Generated Tweet: ${result.tweet}`);
    } catch (error) {
      console.error("Error generating tweet:", error);
    }
  };

  return (
    <AuroraBackground>
      <form onSubmit={handleSubmit}>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="w-full h-screen"
        >
          <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-gray-300/50 border w-2/5 h-4/5 rounded-3xl border-gray-400/20 lg:w-3/5">
            <div className="px-6 py-6 flex flex-col space-y-10">
              <h2 className="text-3xl text-blue-500 font-bold text-center">
                Welcome to XBoost Onboarding
              </h2>
              <div className="flex flex-col gap-2">
                <label className="text-gray-900 font-semibold">X Username</label>
                <input
                  type="text"
                  name="username"
                  className="border border-gray-400 p-2 rounded-md"
                  placeholder="@username"
                  onChange={handleChange}
                />

                <label className="text-gray-900 font-semibold">Product Name</label>
                <input
                  type="text"
                  name="productName"
                  className="w-full rounded-lg h-8"
                  onChange={handleChange}
                />

                <label className="text-gray-900 font-semibold">Product Details</label>
                <textarea
                  name="productDetails"
                  className="resize-none w-full rounded-lg"
                  onChange={handleChange}
                ></textarea>

                <label className="text-gray-900 font-semibold">Product Features</label>
                <textarea
                  name="productFeatures"
                  className="resize-none w-full rounded-lg"
                  onChange={handleChange}
                ></textarea>

                <label className="text-gray-900 font-semibold">Problem Your Product Solves</label>
                <textarea
                  name="productProblem"
                  className="resize-none w-full rounded-lg"
                  onChange={handleChange}
                ></textarea>

                <label className="text-gray-900 font-semibold">Marketing Focus</label>
                <input
                  type="text"
                  name="productMarketing"
                  className="rounded-lg"
                  onChange={handleChange}
                />

                <p>Set the number of tweets per day</p>
                <input
                  type="range"
                  min="0"
                  max="16"
                  step="1"
                  name="tweetCount"
                  value={formData.tweetCount}
                  onChange={(e) => {
                    setTweetCount(e.target.value);
                    handleChange(e);
                  }}
                />
                <div className="flex justify-between">
                  <p>0</p>
                  <p>{tweetcount}</p>
                </div>

                <button
                  type="submit"
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
                >
                  Generate Tweet
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </form>
    </AuroraBackground>
  );
}
