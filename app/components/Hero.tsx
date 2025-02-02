export default function Hero() {
  return (
    <section className="text-center py-12 md:py-20 lg:py-24 bg-transparent relative flex items-center justify-center px-4">
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Hero Heading */}
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold mb-4 text-white leading-tight">
          Nexus AI
        </h1>
        
        {/* Hero Subheading */}
        <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join Nexus AI and become part of the future of blockchain data.
        </p>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 px-4">
          {/* Get Started Button */}
          <button
            aria-label="Get Started"
            className="w-full sm:w-auto min-w-[160px] bg-purple-600 px-6 py-3 rounded-full text-white font-bold hover:bg-purple-500 shadow-lg transition-transform transform motion-safe:hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 text-base md:text-lg"
          >
            Get Started
          </button>

          {/* Learn More Button */}
          <button
            aria-label="Learn More"
            className="w-full sm:w-auto min-w-[160px] bg-gray-700 px-6 py-3 rounded-full text-white font-bold hover:bg-gray-600 shadow-lg transition-transform transform motion-safe:hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 text-base md:text-lg"
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
