export default function Hero() {
  return (
    <section className="text-center py-20 bg-transparent relative">
      <div className="relative z-10">
        <h1 className="text-6xl font-extrabold mb-4 text-white">Nexus AI</h1>
        <p className="text-xl text-gray-300 mb-6">
          Join Nexus AI and become part of the future of blockchain data.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-purple-600 px-6 py-3 rounded-full text-white font-bold hover:bg-purple-500 shadow-lg transition-transform transform hover:scale-105">
            Get Started
          </button>
          <button className="bg-gray-700 px-6 py-3 rounded-full text-white font-bold hover:bg-gray-600 shadow-lg transition-transform transform hover:scale-105">
            Learn More
          </button>
        </div>
      </div>
      {/* Ensure the Hero section doesn't block content scrolling */}
      <div className="absolute top-0 left-0 w-full h-full bg-transparent pointer-events-none" />
    </section>
  );
}
