"use client";

import { useState } from "react";
import { LoginForm } from "@/app/auth/login/LoginForm";
import { SignUpForm } from "@/app/auth/signup/SignUpForm";
import { MessageCircle } from "lucide-react";

export function LandingPage() {
    const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white">
            <div className="mb-12">
                <div className="flex items-center justify-center gap-3">
                    <MessageCircle className="w-8 h-8 text-gray-900" strokeWidth={1.5} />
                    <h1 className="text-3xl font-light text-gray-900 tracking-tight">
                        Chat App
                    </h1>
                </div>
            </div>

            <div className="w-full max-w-md px-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab("login")}
                            className={`flex-1 py-3 px-6 font-medium transition-all duration-200 ${activeTab === "login"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setActiveTab("signup")}
                            className={`flex-1 py-3 px-6 font-medium transition-all duration-200 ${activeTab === "signup"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <div className="p-8">
                        <div
                            className={`transition-all duration-300 ${activeTab === "login" ? "opacity-100" : "opacity-0 hidden"
                                }`}
                        >
                            {activeTab === "login" && <LoginForm standalone={false} />}
                        </div>
                        <div
                            className={`transition-all duration-300 ${activeTab === "signup" ? "opacity-100" : "opacity-0 hidden"
                                }`}
                        >
                            {activeTab === "signup" && <SignUpForm standalone={false} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
