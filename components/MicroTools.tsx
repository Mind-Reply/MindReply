'use client';

export default function MicroTools() {
  const tools = [
    { name: 'Text Refiner', icon: '✏️', credits: 1 },
    { name: 'Email Polisher', icon: '💌', credits: 2 },
    { name: 'Call Scripter', icon: '☎️', credits: 2 },
    { name: 'Tone Calibrator', icon: '🎚️', credits: 2 },
    { name: 'Planning Assistant', icon: '📋', credits: 1 },
    { name: 'Correction Engine', icon: '✅', credits: 1 },
  ];

  return (
    <section id="tools" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl font-serif font-bold text-mr-navy mb-4">One-Click Micro-Tools</h2>
          <p className="text-lg text-gray-600">
            Ten specialised instruments for instantaneous linguistic calibration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, idx) => (
            <div
              key={idx}
              className="micro-tool-card glass-card rounded-2xl p-6 border border-gray-100 hover:border-mr-gold/30 fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-mr-navy to-mr-accent rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
                  {tool.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-serif font-bold text-mr-navy">{tool.name}</h4>
                    <span className="credit-badge px-2 py-0.5 rounded-full text-xs font-bold">{tool.credits} Credits</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Instantly refine professional communication.</p>
                  <button className="text-xs font-medium text-mr-gold hover:underline mt-2">Use Now →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
