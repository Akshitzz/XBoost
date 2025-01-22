"use client"
import { Button } from "./button"
import { ArrowRight } from "lucide-react"
import { LineShadowText } from "./line-shadow-text"
import { useTheme } from "next-themes";
import { AuroraText } from "./aurora-text"

import DotPattern from "./dotpattern";
import Link from "next/link";

export function Herosection (){
        
      const theme = useTheme()
      const shadowColor = theme.resolvedTheme === "dark" ? "white" :"black";    
    return (
        <section className="relative overflow-hidden py-20 ">
            <DotPattern
                width={20}
                height={20}
                cx={1}
                cy={1}
                cr={1}
                className=
                    "[mask-image:radial-gradient(circle,transparent,white)] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full z-0"
                
            />
        <div className="container mx-auto text-center relative flex flex-col items-center pt-20 ">
        <div className=" flex flex-row justify-content gap-5">
        <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl   ">
          <AuroraText className="pt-4 pb-4 text-7xl">Supercharge </AuroraText>
          </h1>
          <h1 className="text-balance text-7xl font-semibold leading-none tracking-tighter sm:text-6xl md:text-7xl lg:text-7xl pt-5">
            <LineShadowText
             className="italic" shadowColor={shadowColor}
            >X Marketing
              </LineShadowText>
              </h1>
    
        </div>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-500 font-light">Automate your X presence and skyrocket your product&apos;s visibility.  XBoost empowers startups and businesses to effortlessly expand their audience and achieve unstoppable growth</p>
          <div className="flex justify-center space-x-4">
          
            <Link href={"/getstarted"}>
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600 "
            
            >
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            </Link>
            
            <Button size="lg" variant="outline">Watch Demo</Button>
          </div>
        </div>
      </section>
    )
}
{/* <ShineBorder>
<h1 className="text-6xl md:text-8xl font-bold mb-6"> </h1>
</ShineBorder> */}