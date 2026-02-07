"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuroraBackground } from "@/components/ui/aurora-background";
import ShineBorder from "@/components/ui/shine-border";
import { Button } from "@/components/ui/button";
import { Loader2, Twitter, BarChart3, History, ExternalLink, RefreshCw, Zap, Users, Activity } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Reusable Card Components for cleanliness
const Card = ({ children, className = "" }) => (
    <div className={`bg-zinc-900/70 backdrop-blur-md border border-white/10 rounded-2xl p-6 ${className}`}>
        {children}
    </div>
);

const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
    <Card className="flex items-center space-x-4 hover:bg-zinc-900/80 transition-colors duration-200">
        <div className={`p-3 rounded-xl ${color.bg} ${color.text}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-zinc-400 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
            {subtext && <p className="text-xs text-zinc-500 mt-1">{subtext}</p>}
        </div>
    </Card>
);

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/auth");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Failed to fetch data");

            const result = await res.json();
            setData(result);
        } catch (error) {
            toast.error("Error loading dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <AuroraBackground className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin w-10 h-10 text-white" />
            </AuroraBackground>
        );
    }

    if (!data) return null;

    return (
        <AuroraBackground className="flex flex-col min-h-screen p-4 md:p-8 pt-24 text-zinc-100">
            <div className="max-w-7xl mx-auto w-full z-10 space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-8">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight text-white">
                            Dashboard
                        </h1>
                        <p className="text-zinc-400 text-lg">
                            Welcome back, <span className="text-white font-semibold">{data.user.username}</span>. Here's your agent's performance.
                        </p>
                    </div>
                    <Link href="/getstarted">
                        <Button className="bg-white text-black hover:bg-zinc-200 rounded-full px-8 py-6 font-semibold shadow-lg shadow-white/10 transition-all hover:scale-105">
                            <Zap className="w-4 h-4 mr-2 fill-current" />
                            Generate New Tweet
                        </Button>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Tweets"
                        value={data.stats.totalGenerated}
                        icon={BarChart3}
                        color={{ bg: "bg-purple-500/10", text: "text-purple-400" }}
                        subtext="Lifetime generated"
                    />
                    <StatCard
                        title="Daily Schedule"
                        value={data.schedule?.tweetsPerDay ? `${data.schedule.tweetsPerDay}/day` : "Manual"}
                        icon={Activity}
                        color={{ bg: "bg-green-500/10", text: "text-green-400" }}
                        subtext={data.schedule?.enabled ? "Active & Running" : "Paused"}
                    />
                    <StatCard
                        title="Followers"
                        value={data.stats.followers?.toLocaleString() || "N/A"}
                        icon={Users}
                        color={{ bg: "bg-blue-500/10", text: "text-blue-400" }}
                    />
                    <StatCard
                        title="Following"
                        value={data.stats.following?.toLocaleString() || "N/A"}
                        icon={Users}
                        color={{ bg: "bg-blue-500/10", text: "text-blue-400" }}
                    />
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Tweet History */}
                    <div className="col-span-1 lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                            <History className="w-5 h-5 text-zinc-400" />
                            Recent Activity
                        </h2>

                        <ShineBorder
                            className="w-full !bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
                            color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                        >
                            <div className="p-0">
                                {data.recentTweets.length === 0 ? (
                                    <div className="text-center py-16 text-zinc-500">
                                        <p>No tweets generated yet.</p>
                                        <p className="text-sm mt-2">Start your first campaign!</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-white/5">
                                        {data.recentTweets.map((tweet) => (
                                            <div key={tweet._id} className="p-6 hover:bg-white/5 transition-colors group">
                                                <div className="flex justify-between items-start gap-4">
                                                    <p className="text-zinc-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                                                        {tweet.content}
                                                    </p>
                                                    {tweet.tweetId && (
                                                        <a
                                                            href={tweet.tweetId.startsWith('reply-') ? '#' : `https://twitter.com/i/web/status/${tweet.tweetId}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex-shrink-0 text-zinc-500 hover:text-blue-400 transition-colors"
                                                            title="View on X"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                </div>
                                                <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500 font-medium font-mono">
                                                    <span className="flex items-center gap-1">
                                                        {new Date(tweet.postedAt).toLocaleDateString()} • {new Date(tweet.postedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {tweet.content.startsWith('[REPLY]') && (
                                                        <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                                                            Reply
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </ShineBorder>
                    </div>

                    {/* Sidebar: Account Status & Context */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                            <Zap className="w-5 h-5 text-zinc-400" />
                            Agent Status
                        </h2>

                        <Card className="space-y-6">
                            {/* Connection Status */}
                            <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${data.stats.followers !== undefined ? "bg-green-500" : "bg-red-500"} animate-pulse`} />
                                    <span className="text-sm font-medium text-zinc-300">X Connection</span>
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded bg-white/5 ${data.stats.followers !== undefined ? "text-green-400" : "text-red-400"}`}>
                                    {data.stats.followers !== undefined ? "ONLINE" : "OFFLINE"}
                                </span>
                            </div>

                            {/* Active Prompt Data */}
                            {data.schedule && data.schedule.promptData ? (
                                <div className="space-y-4">
                                    <div className="border-t border-white/10 pt-4">
                                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Active Campaign</h3>

                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-xs text-zinc-500 mb-1">Product</p>
                                                <p className="text-sm text-white font-medium bg-white/5 p-2 rounded border border-white/5">
                                                    {data.schedule.promptData.productName}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500 mb-1">Target</p>
                                                <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                                                    {data.schedule.promptData.productMarketing || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-sm text-center">
                                    No active campaign found.
                                </div>
                            )}

                            <Button
                                variant="outline"
                                className="w-full border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white transition-colors h-10"
                                onClick={fetchDashboardData}
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh Data
                            </Button>
                        </Card>
                    </div>

                </div>
            </div>
        </AuroraBackground>
    );
}
