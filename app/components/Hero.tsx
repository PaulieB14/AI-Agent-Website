import React from 'react';

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
      </div>
    </section>
  );
}
