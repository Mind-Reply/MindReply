'use client';

export default function ProfessionalLexicons() {
  const professionals = [
    { name: 'Clinical Psychologist', icon: '👨‍⚕️' },
    { name: 'Legal Counsel', icon: '⚖️' },
    { name: 'Financial Advisor', icon: '📈' },
    { name: 'HR Director', icon: '👥' },
    { name: 'Event Strategist', icon: '📅' },
    { name: 'Executive Coach', icon: '🎯' },
  ];

  return (
    <section id="professionals" className="py-20 bg-mr-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl font-serif font-bold text-mr-navy mb-4">
            Specialised Professional Lexicons Toolkit
          </h2>
          <p className="text-lg text-gray-600">
            Subconscious communication frameworks for 20+ professional categories.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {professionals.map((prof, idx) => (
            <div
              key={idx}
              className="glass-card rounded-xl p-5 border border-gray-100 hover:border-mr-gold/40 cursor-pointer fade-in-up"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="w-10 h-10 bg-mr-navy rounded-lg flex items-center justify-center mb-3 text-lg">
                {prof.icon}
              </div>
              <h4 className="font-medium text-mr-navy text-sm">{prof.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
