import { Zap } from "lucide-react"
import { BarChart } from "lucide-react"
import { Clock } from "lucide-react"
export const Features = ()=>{
    return (
        <section id="features" className="py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <Zap className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Smart Automation</h3>
              <p>Schedule and automate your posts to maintain a consistent presence without the constant effort.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <BarChart className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Analytics Dashboard</h3>
              <p>Track your growth, engagement, and the performance of each post to refine your strategy.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <Clock className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Optimal Timing</h3>
              <p>Our AI determines the best times to post for maximum engagement with your target audience.</p>
            </div>
          </div>
        </div>
      </section>
    )
}