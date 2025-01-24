export default function Roadmap() {
    const phases = [
      "Phase 1: Initial Launch",
      "Phase 2: Communities Launched",
      "Phase 3: Global Domination",
    ];
  
    return (
      <section className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Roadmap</h2>
          <ul className="space-y-4 text-lg">
            {phases.map((phase, index) => (
              <li key={index} className="bg-gray-800 p-4 rounded-lg">
                {phase}
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }
  