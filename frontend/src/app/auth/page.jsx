"use client";
import React, { useState } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import ShineBorder from "@/components/ui/shine-border";
import { AuroraText } from "@/components/ui/aurora-text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, LogIn, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AuthPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                if (isLogin) {
                    localStorage.setItem("token", data.token);
                    toast.success("Login successful!");
                    router.push("/");
                } else {
                    toast.success("Registration successful! Please login.");
                    setIsLogin(true);
                }
            } else {
                toast.error(data.error || "An error occurred");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuroraBackground className="flex items-center justify-center min-h-screen p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <ShineBorder
                    className="w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border border-white/20 shadow-2xl rounded-3xl overflow-hidden"
                    color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                >
                    <div className="p-8 w-full">
                        <div className="text-center mb-6">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                <AuroraText>{isLogin ? "Welcome Back" : "Join XBoost"}</AuroraText>
                            </h1>
                            <p className="text-muted-foreground mt-2 text-sm">
                                {isLogin
                                    ? "Sign in to continue generating viral tweets."
                                    : "Create an account to get started."}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                                    <Input
                                        name="username"
                                        placeholder="johndoe"
                                        onChange={handleChange}
                                        className="bg-white/50 dark:bg-black/50"
                                        required
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    onChange={handleChange}
                                    className="bg-white/50 dark:bg-black/50"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                <Input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    onChange={handleChange}
                                    className="bg-white/50 dark:bg-black/50"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-5 shadow-lg shadow-blue-500/20"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : isLogin ? (
                                    <>Sign In <LogIn className="ml-2 h-4 w-4" /></>
                                ) : (
                                    <>Sign Up <UserPlus className="ml-2 h-4 w-4" /></>
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-gray-500 dark:text-gray-400">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                            </span>
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="ml-2 font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors"
                            >
                                {isLogin ? "Sign up" : "Log in"}
                            </button>
                        </div>
                    </div>
                </ShineBorder>
            </motion.div>
        </AuroraBackground>
    );
}
