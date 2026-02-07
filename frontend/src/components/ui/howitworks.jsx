export const Works = () => {
  return (
    <section className="container mx-auto py-16 px-4 sm:px-8 lg:py-20">
      <h2 className="text-3xl sm:text-4xl font-bold text-center tracking-wide mb-12">
        How XBoost Works
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {/* Step 1 */}
        <div className="text-center">
          <div className="bg-blue-100 rounded-full h-16 w-16 sm:h-20 sm:w-20 flex items-center justify-center mx-auto mb-4">
            <span className="text-blue-500 text-xl sm:text-2xl font-bold">
              1
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2">
            Connect Your Account
          </h3>
          <p className="tracking-tight text-gray-500/80 text-sm sm:text-base">
            Easily link your X account to XBoost with just a few clicks.
          </p>
        </div>

        {/* Step 2 */}
        <div className="text-center">
          <div className="bg-blue-100 rounded-full h-16 w-16 sm:h-20 sm:w-20 flex items-center justify-center mx-auto mb-4">
            <span className="text-blue-500 text-xl sm:text-2xl font-bold">
              2
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2">
            Set Your Strategy
          </h3>
          <p className="tracking-tight text-gray-500/80 text-sm sm:text-base">
            Define your content themes, posting schedule, and engagement goals.
          </p>
        </div>

        {/* Step 3 */}
        <div className="text-center">
          <div className="bg-blue-100 rounded-full h-16 w-16 sm:h-20 sm:w-20 flex items-center justify-center mx-auto mb-4">
            <span className="text-blue-500 text-xl sm:text-2xl font-bold">
              3
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2">
            Grow Your Audience
          </h3>
          <p className="tracking-tight text-gray-500/80 text-sm sm:text-base">
            Watch your followers and engagement grow as XBoost works its magic.
          </p>
        </div>
      </div>
    </section>
  );
};
