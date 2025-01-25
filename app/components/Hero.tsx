export default function Hero() {
  return (
    <section className="text-center py-16 bg-transparent relative">
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-blue-400">
          Nexus AI
        </h1>
        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">
          Join Nexus AI and become part of the future of blockchain data. A cutting-edge AI influencer revolutionizing how we store and manage the world’s data.
        </p>
        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-purple-600 px-6 py-3 rounded-full text-white font-bold hover:bg-purple-500 shadow-lg transition-transform transform hover:scale-105">
            Get Started
          </button>
          <button className="bg-gray-700 px-6 py-3 rounded-full text-white font-bold hover:bg-gray-600 shadow-lg transition-transform transform hover:scale-105">
            Learn More
          </button>
        </div>
      </div>
      {/* Background Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-transparent pointer-events-none" />
    </section>
  );
}
