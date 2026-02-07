"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuroraBackground } from "@/components/ui/aurora-background";
import ShineBorder from "@/components/ui/shine-border";
import { Button } from "@/components/ui/button";
import { Loader2, Twitter, BarChart3, History, ExternalLink, RefreshCw } from "lucide-react";
import Link from "next/link";

const DashboardInfoCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10 flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
            <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
    </div>
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
        <AuroraBackground className="flex flex-col min-h-screen p-4 md:p-8 pt-24">
            <div className="max-w-6xl mx-auto w-full z-10 space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Welcome, {data.user.username} 👋</h1>
                        <p className="text-gray-400">Here's your XBoost activity overview.</p>
                    </div>
                    <Link href="/getstarted">
                        <Button className="bg-blue-500 hover:bg-blue-600 rounded-full px-6">
                            Generate New Tweet
                        </Button>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DashboardInfoCard
                        title="Followers"
                        value={data.stats.followers?.toLocaleString() || "N/A"}
                        icon={Twitter}
                        color="text-blue-400"
                    />
                    <DashboardInfoCard
                        title="Following"
                        value={data.stats.following?.toLocaleString() || "N/A"}
                        icon={Twitter}
                        color="text-blue-400"
                    />
                    <DashboardInfoCard
                        title="Total Tweets Generated"
                        value={data.stats.totalGenerated}
                        icon={BarChart3}
                        color="text-purple-400"
                    />
                    <DashboardInfoCard
                        title="Daily Limit"
                        value={data.schedule?.tweetsPerDay ? `${data.schedule.tweetsPerDay}/day` : "Manual"}
                        icon={History}
                        color="text-green-400"
                    />
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Tweet History */}
                    <ShineBorder className="col-span-1 lg:col-span-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden" color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <History className="w-5 h-5 mr-2 text-purple-400" />
                                Recent Tweet History
                            </h2>

                            <div className="space-y-4">
                                {data.recentTweets.length === 0 ? (
                                    <div className="text-center py-10 text-gray-500">
                                        No tweets generated yet. Start boosting! 🚀
                                    </div>
                                ) : (
                                    data.recentTweets.map((tweet) => (
                                        <div key={tweet._id} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                            <p className="text-gray-200 text-sm mb-3">{tweet.content}</p>
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span>{new Date(tweet.postedAt).toLocaleString()}</span>
                                                {tweet.tweetId && (
                                                    <a
                                                        href={`https://twitter.com/i/web/status/${tweet.tweetId}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center text-blue-400 hover:underline"
                                                    >
                                                        View on X <ExternalLink className="w-3 h-3 ml-1" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </ShineBorder>

                    {/* Account Status / Prompt Data */}
                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-fit">
                        <h2 className="text-xl font-semibold text-white mb-4">Account Status</h2>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                <span className="text-gray-300">Connection</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${data.stats.followers !== undefined ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                                    {data.stats.followers !== undefined ? "Connected" : "Disconnected"}
                                </span>
                            </div>

                            {data.schedule && data.schedule.promptData && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Active Prompt Context</h3>
                                    <div className="bg-white/5 p-4 rounded-xl text-sm space-y-2">
                                        <p><span className="text-gray-500">Product:</span> <span className="text-white">{data.schedule.promptData.productName}</span></p>
                                        <p><span className="text-gray-500">Problem:</span> <span className="text-white line-clamp-1">{data.schedule.promptData.productProblem}</span></p>
                                        <p><span className="text-gray-500">Goal:</span> <span className="text-white line-clamp-1">{data.schedule.promptData.productMarketing}</span></p>
                                    </div>
                                </div>
                            )}

                            <Button
                                variant="outline"
                                className="w-full border-white/10 hover:bg-white/10 text-gray-300"
                                onClick={fetchDashboardData}
                            >
                                <RefreshCw className="w-4 h-4 mr-2" /> Refresh Data
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </AuroraBackground>
    );
}
