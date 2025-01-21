import { ArrowRight } from "lucide-react"
import { Button } from "./button"
export const Pricing = ()=>{
    return (
        <section id="pricing" className="bg-gray-50 py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Starter</h3>
              <p className="text-3xl font-bold mb-4">$29<span className="text-lg font-normal">/mo</span></p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-blue-500" /> Up to 3 X accounts</li>
                <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-blue-500" /> 50 scheduled posts per month</li>
                <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-blue-500" /> Basic analytics</li>
              </ul>
              <Button className="w-full">Get Started</Button>
            </div>
            <div className="bg-blue-500 text-white p-8 rounded-lg shadow-md transform scale-105">
              <h3 className="text-xl font-semibold mb-4">Pro</h3>
              <p className="text-3xl font-bold mb-4">$79<span className="text-lg font-normal">/mo</span></p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2" /> Up to 10 X accounts</li>
                <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2" /> Unlimited scheduled posts</li>
                <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2" /> Advanced analytics and reporting</li>
                <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2" /> AI-powered content suggestions</li>
              </ul>
              <Button className="w-full bg-white text-blue-500 hover:bg-gray-100">Get Started</Button>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Enterprise</h3>
              <p className="text-3xl font-bold mb-4">Custom</p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-blue-500" /> Unlimited X accounts</li>
                <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-blue-500" /> Dedicated account manager</li>
                <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-blue-500" /> Custom integrations</li>
                <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-blue-500" /> Priority support</li>
              </ul>
              <Button variant="outline" className="w-full">Contact Sales</Button>
            </div>
          </div>
        </div>
      </section>
    )
}