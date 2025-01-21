export const Works = ()=>{
    return (
        <section className="container mx-auto py-20">
        <h2 className="text-4xl font-bold text-center tracking-wide mb-12">How XBoost Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-500 text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect Your Account</h3>
            <p className="tracking-tight text-gray-500/60">Easily link your X account to XBoost with just a few clicks.</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-500 text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Set Your Strategy</h3>
            <p className="tracking-tight text-gray-500/60">Define your content themes, posting schedule, and engagement goals.</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-500 text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Grow Your Audience</h3>
            <p className="tracking-tight text-gray-500/60">Watch your followers and engagement grow as XBoost works its magic.</p>
          </div>
        </div>
      </section>

    )
}