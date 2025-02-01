export default function Hero() {
  return (
    <section className="text-center py-20 sm:py-24 bg-transparent relative flex items-center justify-center">
      <div className="relative z-10">
        {/* Hero Heading */}
        <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 text-white">
          Nexus AI
        </h1>
        
        {/* Hero Subheading */}
        <p className="text-lg sm:text-xl text-gray-300 mb-6">
          Join Nexus AI and become part of the future of blockchain data.
        </p>
        
        {/* Buttons */}
        <div className="flex justify-center space-x-4 sm:space-x-6 flex-wrap">
          {/* Get Started Button */}
          <button
            aria-label="Get Started"
            className="bg-purple-600 px-6 py-3 rounded-full text-white font-bold hover:bg-purple-500 shadow-lg transition-transform transform motion-safe:hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            Get Started
          </button>

          {/* Learn More Button */}
          <button
            aria-label="Learn More"
            className="bg-gray-700 px-6 py-3 rounded-full text-white font-bold hover:bg-gray-600 shadow-lg transition-transform transform motion-safe:hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
