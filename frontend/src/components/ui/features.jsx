import { Zap, BarChart, Clock } from "lucide-react";

export const Features = () => {
  return (
    <section id="features" className="py-16 px-4 sm:px-8 lg:py-20">
      <div className="container mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          Powerful Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
            <Zap className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-4">
              Smart Automation
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Schedule and automate your posts to maintain a consistent presence
              without the constant effort.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
            <BarChart className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-4">
              Analytics Dashboard
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Track your growth, engagement, and the performance of each post to
              refine your strategy.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
            <Clock className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-4">
              Optimal Timing
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Our AI determines the best times to post for maximum engagement
              with your target audience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
