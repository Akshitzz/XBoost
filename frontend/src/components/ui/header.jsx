"use client";
import Link from "next/link";
import { Button } from "./button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const XLogo = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
  </svg>
)

export const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <header className="fixed top-4 left-4 right-4  backdrop-blur-md bg-background-light/75  text-light   rounded-3xl border  z-50">
      <div className="container mx-auto ">
        <nav className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <XLogo />
            <span className="text-2xl font-bold">XBoost</span>
          </div>
          <div className="hidden md:flex space-x-6 items-center">
            <Link href="#features" className="text-gray-600 hover:text-blue-500 transition-colors">Features</Link>
            <Link href="#pricing" className="text-gray-600 hover:text-blue-500 transition-colors">Pricing</Link>
            <Link href="#faq" className="text-gray-600 hover:text-blue-500 transition-colors">FAQ</Link>

            {isLoggedIn ? (
              <>
                <Link href="/getstarted">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-3xl p-5">Dashboard</Button>
                </Link>
                <Button variant="outline" className="ml-4 p-5 rounded-3xl" onClick={handleLogout}>Log Out</Button>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="outline" className="ml-4 p-5 rounded-3xl">Log In</Button>
                </Link>
                <Link href="/auth">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-3xl p-5">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
          <Button variant="ghost" className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </Button>
        </nav>
      </div>
    </header>
  )
}