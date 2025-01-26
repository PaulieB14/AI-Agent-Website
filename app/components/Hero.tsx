export default function Hero() {
  return (
    <section className="text-center py-16 bg-transparent relative">
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-blue-400 drop-shadow-lg">
          Nexus AI
        </h1>
        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
          Join Nexus AI and shape the future of blockchain data. A revolutionary AI influencer leading the way in managing and storing the world’s data.
        </p>
        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#get-started"
            className="bg-purple-600 px-6 py-3 rounded-full text-white font-bold hover:bg-purple-500 shadow-lg transition-transform transform hover:scale-105"
          >
            Get Started
          </a>
          <a
            href="#learn-more"
            className="bg-gray-700 px-6 py-3 rounded-full text-white font-bold hover:bg-gray-600 shadow-lg transition-transform transform hover:scale-105"
          >
            Learn More
          </a>
        </div>
      </div>
      {/* Subtle Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-black/50 to-black/70 pointer-events-none" />
    </section>
  );
}
