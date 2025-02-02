export default function Roadmap() {
    const phases = [
      "Phase 1: Initial Launch",
      "Phase 2: Communities Launched",
      "Phase 3: Global Domination",
    ];
  
    return (
      <section className="bg-gray-900 py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8">Roadmap</h2>
          <ul className="space-y-4 text-base md:text-lg max-w-2xl mx-auto">
            {phases.map((phase, index) => (
              <li 
                key={index} 
                className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-md hover:bg-gray-750 transition-colors duration-200 ease-in-out"
              >
                {phase}
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }
