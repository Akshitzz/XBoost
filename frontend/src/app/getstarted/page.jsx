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
import { Sparkles, Copy, Check, Loader2, Info, Twitter } from "lucide-react";

// Reusable Label Component
const Label = ({ children }) => (
  <label className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2 block">
    {children}
  </label>
);

export default function GetStartedPage() {
  const router = useRouter();
  const [tweetcount, setTweetCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generatedTweet, setGeneratedTweet] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const [formData, setFormData] = useState({
    username: "",
    productName: "",
    productDetails: "",
    productFeatures: "",
    productProblem: "",
    productMarketing: "",
    tweetCount: 0,
  });

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
    <AuroraBackground className="flex items-center justify-center min-h-screen p-4 pt-24 text-zinc-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl relative z-10"
      >
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Form Side */}
          <div className="flex-1 w-full space-y-6">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                <AuroraText>Create Campaign</AuroraText>
              </h1>
              <p className="text-zinc-400">
                Configure your autonomous agent to generate viral content.
              </p>
            </div>

            <div className="w-full bg-zinc-900/70 backdrop-blur-md border border-white/10 shadow-2xl rounded-3xl p-8 relative overflow-hidden">
              {/* Decorative sheen */}
              <div className="absolute top-0 right-0 p-32 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

              {!isConnected ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center">
                  <div className="p-4 bg-blue-500/10 rounded-full mb-2">
                    <Twitter className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="space-y-2 max-w-md">
                    <h3 className="text-xl font-bold text-white">Connect to X</h3>
                    <p className="text-zinc-400 text-sm">
                      To start generating and scheduling tweets, we need permission to post to your account.
                    </p>
                  </div>
                  <Button
                    onClick={handleConnectX}
                    className="bg-white text-black hover:bg-zinc-200 px-8 py-6 text-lg rounded-full font-semibold transition-all hover:scale-105"
                  >
                    Connect X Account
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>X Username</Label>
                      <Input
                        name="username"
                        placeholder="@username"
                        onChange={handleChange}
                        className="bg-zinc-800/50 border-white/10 focus:border-blue-500/50 text-white placeholder:text-zinc-600 h-10 rounded-xl"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Product Name</Label>
                      <Input
                        name="productName"
                        placeholder="e.g. SuperGadget"
                        onChange={handleChange}
                        className="bg-zinc-800/50 border-white/10 focus:border-blue-500/50 text-white placeholder:text-zinc-600 h-10 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Product Details</Label>
                    <textarea
                      name="productDetails"
                      className="flex min-h-[100px] w-full rounded-xl border border-white/10 bg-zinc-800/50 px-4 py-3 text-sm text-white shadow-sm placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500/50 resize-none"
                      placeholder="Briefly describe what your product does..."
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Key Features</Label>
                      <textarea
                        name="productFeatures"
                        className="flex min-h-[80px] w-full rounded-xl border border-white/10 bg-zinc-800/50 px-4 py-3 text-sm text-white shadow-sm placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500/50 resize-none"
                        placeholder="Fast, Secure, Scalable..."
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Problem Solved</Label>
                      <textarea
                        name="productProblem"
                        className="flex min-h-[80px] w-full rounded-xl border border-white/10 bg-zinc-800/50 px-4 py-3 text-sm text-white shadow-sm placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500/50 resize-none"
                        placeholder="Inefficiency, High costs..."
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Marketing Focus</Label>
                    <Input
                      name="productMarketing"
                      placeholder="e.g. Speed, Innovation, Community"
                      onChange={handleChange}
                      className="bg-zinc-800/50 border-white/10 focus:border-blue-500/50 text-white placeholder:text-zinc-600 h-10 rounded-xl"
                    />
                  </div>

                  <div className="space-y-4 pt-6 mt-6 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <Label>Daily Tweet Schedule</Label>
                      <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
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
                      className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                      onChange={(e) => {
                        setTweetCount(e.target.value);
                        handleChange(e);
                      }}
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                      <span>Manual Only</span>
                      <span>High Frequency</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-zinc-200 font-bold py-6 rounded-xl shadow-lg shadow-white/5 transition-all duration-300 hover:scale-[1.01] mt-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5 fill-current" />
                        Generate & Schedule
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Result Side - Sticky & Animated */}
          <AnimatePresence>
            {generatedTweet && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-full lg:w-1/3 lg:sticky lg:top-24 mt-8 lg:mt-0"
              >
                <ShineBorder
                  className="w-full !bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
                  color={["#10B981", "#3B82F6", "#6366F1"]}
                >
                  <div className="p-6 relative">
                    <div className="flex items-center gap-2 mb-6 text-green-400">
                      <div className="p-1 bg-green-500/20 rounded-full">
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold uppercase tracking-wider">Generated Successfully</span>
                    </div>

                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 text-lg leading-relaxed text-zinc-300 font-medium relative">
                      <span className="absolute -top-3 -left-2 text-4xl text-white/5 font-serif">"</span>
                      {generatedTweet}
                      <span className="absolute -bottom-6 -right-2 text-4xl text-white/5 font-serif">"</span>
                    </div>

                    <div className="mt-6">
                      <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        className="w-full border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white h-12 rounded-xl"
                      >
                        {copied ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Text
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/5 text-center">
                      <p className="text-xs text-zinc-500">
                        This tweet has been added to your schedule. <br />
                        Check <span className="text-zinc-400 underline cursor-pointer" onClick={() => router.push('/dashboard')}>Dashboard</span> for details.
                      </p>
                    </div>
                  </div>
                </ShineBorder>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </AuroraBackground>
  );
}
