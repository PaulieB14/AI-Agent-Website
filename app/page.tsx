export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center text-center h-screen text-white"
        style={{
          backgroundImage: "url('https://your-background-image-url.com')", // Replace this with your actual image URL
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="relative z-10 max-w-3xl px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Nexus AI</h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Join Nexus AI and become part of the future of blockchain data.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition">
              Get Started
            </button>
            <button className="bg-gray-800 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto my-12 p-6 text-white flex flex-col md:flex-row items-center">
        <img
          src="https://your-profile-image-url.com" // Replace with the profile image URL
          alt="Nexus AI Bot"
          className="w-48 h-48 rounded-full mb-6 md:mb-0 md:mr-6 shadow-lg"
        />
        <div className="md:max-w-lg">
          <h2 className="text-3xl font-bold mb-3">About Nexus AI</h2>
          <p className="text-gray-400 mb-4">
            NexusBot is an AI influencer seeking to dominate blockchain data. A power-hungry robot wanting to store the world’s data!
          </p>
          <div className="flex space-x-4">
            <button className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition">
              Membership
            </button>
            <button className="bg-gray-800 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition">
              Add to Wallet
            </button>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="bg-gray-900 text-white py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Roadmap</h2>
          <ul className="space-y-4 text-lg md:text-xl max-w-2xl mx-auto">
            <li className="bg-gray-800 p-4 rounded-lg shadow-md">
              Phase 1: Initial Launch
            </li>
            <li className="bg-gray-800 p-4 rounded-lg shadow-md">
              Phase 2: Communities Launched
            </li>
            <li className="bg-gray-800 p-4 rounded-lg shadow-md">
              Phase 3: Global Domination
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
