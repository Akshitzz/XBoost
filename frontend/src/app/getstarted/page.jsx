"use client";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuroraBackground } from "@/components/ui/aurora-background";
import ShineBorder from "@/components/ui/shine-border";
import { AuroraText } from "@/components/ui/aurora-text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Sparkles, Copy, Check, Loader2 } from "lucide-react";

export default function GetStartedPage() {
  const router = useRouter();
  const [tweetcount, setTweetCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generatedTweet, setGeneratedTweet] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to continue.");
      router.push("/auth");
      return;
    }

    // Check Twitter connection status
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/status`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setIsConnected(data.isConnected);
        setCheckingStatus(false);
      })
      .catch(() => {
        setCheckingStatus(false);
        // Don't block usage if status check fails, but warn
        toast.error("Failed to check account status");
      });
  }, [router]);

  const handleConnectX = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/twitter`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to start connection");
      }
    } catch (err) {
      toast.error("Connection error");
    }
  };

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
    setLoading(true);
    setGeneratedTweet(null); // Reset previous result

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/generate-tweet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setGeneratedTweet(result.tweet);
        toast.success("Tweet generated successfully!");
      } else {
        toast.error(result.error || "Failed to generate tweet. Please try again.");
      }
    } catch (error) {
      console.error("Error generating tweet:", error);
      toast.error("An error occurred. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedTweet) {
      navigator.clipboard.writeText(generatedTweet);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (checkingStatus) {
    return (
      <AuroraBackground className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-white" />
      </AuroraBackground>
    );
  }

  return (
    <AuroraBackground className="flex items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Form Side */}
          <ShineBorder
            className="flex-1 w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border border-white/20 shadow-2xl rounded-3xl overflow-hidden"
            color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
          >
            <div className="p-8 w-full">
              <div className="mb-8 text-center lg:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  <AuroraText>XBoost Onboarding</AuroraText>
                </h1>
                <p className="text-muted-foreground mt-2">
                  Tell us about your product to generate viral tweets.
                </p>
              </div>

              {!isConnected ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                  <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
                    To start generating and scheduling tweets, please connect your X (Twitter) account.
                  </p>
                  <Button
                    onClick={handleConnectX}
                    className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-lg rounded-full flex items-center gap-2"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                    Connect X Account
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300">
                        X Username
                      </label>
                      <Input
                        name="username"
                        placeholder="@username"
                        onChange={handleChange}
                        className="bg-white/50 dark:bg-black/50"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300">
                        Product Name
                      </label>
                      <Input
                        name="productName"
                        placeholder="e.g. SuperGadget"
                        onChange={handleChange}
                        className="bg-white/50 dark:bg-black/50"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300">
                      Product Details
                    </label>
                    <textarea
                      name="productDetails"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-white/50 dark:bg-black/50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Briefly describe what your product does..."
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300">
                        Key Features
                      </label>
                      <textarea
                        name="productFeatures"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-white/50 dark:bg-black/50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Fast, Secure, Scalable..."
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300">
                        Problem Solved
                      </label>
                      <textarea
                        name="productProblem"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-white/50 dark:bg-black/50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Inefficiency, High costs..."
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300">
                      Marketing Focus
                    </label>
                    <Input
                      name="productMarketing"
                      placeholder="e.g. Speed, Innovation, Community"
                      onChange={handleChange}
                      className="bg-white/50 dark:bg-black/50"
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Daily Tweet Schedule
                      </label>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                        {tweetcount} tweets/day
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      name="tweetCount"
                      value={formData.tweetCount}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                      onChange={(e) => {
                        setTweetCount(e.target.value);
                        handleChange(e);
                      }}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0 (Manual only)</span>
                      <span>10 (Spam danger)</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-6 shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02]"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating Magic...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Generate & Schedule Tweets
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </ShineBorder>

          {/* Result Side - Animated Entrance */}
          <AnimatePresence>
            {generatedTweet && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-full lg:w-1/3 mt-8 lg:mt-0"
              >
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-2 border-blue-500/30 rounded-2xl shadow-2xl p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-50 text-6xl text-blue-500/10 pointer-events-none font-serif">
                    "
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="bg-green-100 text-green-700 p-1 rounded-md"><Check className="w-4 h-4" /></span>
                    Success!
                  </h3>

                  <div className="bg-gray-50 dark:bg-black/50 p-4 rounded-xl border border-gray-200 dark:border-gray-800 text-lg leading-relaxed text-gray-800 dark:text-gray-200 font-medium italic">
                    "{generatedTweet}"
                  </div>

                  <div className="mt-6">
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/30"
                    >
                      {copied ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy to Clipboard
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </AuroraBackground>
  );
}
