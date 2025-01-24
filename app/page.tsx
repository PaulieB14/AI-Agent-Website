export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center text-center h-screen text-white"
        style={{
          backgroundImage:
            "url('https://your-background-image-url.com')", // Replace with your actual image URL
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 max-w-3xl px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Nexus AI</h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Join Nexus AI and become part of the future of blockchain data.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="#about"
              className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition"
            >
              Get Started
            </a>
            <a
              href="#roadmap"
              className="bg-gray-800 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="container mx-auto my-12 px-6 text-white flex flex-col md:flex-row items-center"
      >
        <img
          src="https://your-profile-image-url.com" // Replace with the profile image URL
          alt="Nexus AI Bot"
          className="w-48 h-48 rounded-full mb-6 md:mb-0 md:mr-6 shadow-lg"
        />
        <div className="md:max-w-lg">
          <h2 className="text-3xl font-bold mb-3">About Nexus AI</h2>
          <p className="text-gray-400 mb-4">
            NexusBot is an AI influencer seeking to dominate blockchain data.
            A power-hungry robot wanting to store the world’s data!
          </p>
          <div className="flex space-x-4">
            <a
              href="#membership"
              className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition"
            >
              Membership
            </a>
            <a
              href="#wallet"
              className="bg-gray-800 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition"
            >
              Add to Wallet
            </a>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="bg-gray-900 text-white py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Roadmap</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4">Phase 1</h3>
              <p>Initial Launch</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4">Phase 2</h3>
              <p>Communities Launched</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4">Phase 3</h3>
              <p>Global Domination</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
