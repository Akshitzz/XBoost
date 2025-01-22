"use client"
import {motion} from "framer-motion"
import React from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { useState } from "react";
export default function GetStartedPage() {
  const  [tweetcount,setweetcount] = useState(0)
  return (
      <AuroraBackground>
   <form action="
   ">
       <motion.div 
       initial={{ opacity: 0.0, y: 40 }}
       whileInView={{ opacity: 1, y: 0 }}
       transition={{
         delay: 0.3,
         duration: 0.8,
         ease: "easeInOut",
       }}
      className="w-full h-screen ">
       <div className=" absolute  -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-gray-300/50  border w-2/5 h-4/5 rounded-3xl   border-gray-400/20 lg:w-3/5">
      <div className="px-6 py-6 flex flex-col justify-content space-y-10 space-x-2">
        <div className=" w-full  h-40 gap-5 flex flex-col justify-center">
        <h2 className=" pt-4 pl-24 text-3xl whitespace-nowrap text-blue-500 font-bold ">Welcome to XBoost OnBoarding</h2>
          <p className=" pl-24 tracking-tight font-sans text-gray-900/50">Let&apos;s get you set up with XBoost .This will only take a few minutes.</p>
        </div>
        <div className="flex flex-col gap-2">
        <h2 className="text-base/7 font-semibold text-gray-900">Enter your X username</h2>
       <input type="text" className="border border-gray-400 focus:border-transparent focus:outline-none focus:placeholder-transparent p-2 rounded-md"placeholder="@username"  />
       <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                Product Name</label>
       <input type="text"  className="w-full rounded-lg h-8"/>
       <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                Product Details</label>
       
       <textarea name="" id="" className="resize-none overflow-hidden w-full rounded-lg" ></textarea>
       <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                Product Features</label>
                <textarea name="" id="" className="resize-none overflow-hidden w-full rounded-lg" ></textarea>
       <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                Problem your product solves</label>
                <textarea name="" id="" className="resize-none overflow-hidden w-full rounded-lg" ></textarea>
       <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                What you want to market about your product</label>
            <input type="text"  className="rounded-lg"/>
       <p> Set the no of tweets of your  product in a day </p>
       <input type="range" min="0" max="16" step="1" onChange={(e)=>setweetcount(e.target.value)} id="tweetcount" name="tweetcount"/>
       <div className="flex flex-row w-full justify-between">
        <p>0</p>
        <p>{tweetcount}</p>
       </div>
        </div>
        </div>
       </div>
      </motion.div>
   </form>
      </AuroraBackground>
    );
  }
  