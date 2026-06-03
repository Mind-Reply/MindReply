'use client';

export default function SubconciousSection() {
  return (
    <section id="subconscious" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl font-serif font-bold text-mr-navy mb-4">
            Subconscious Communication Intelligence
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our proprietary framework decodes the subconscious behavioral patterns in professional correspondence, enabling intentional expression that aligns with your strategic objectives while resonating authentically with recipients.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {['Behavioral Intent Mapping', 'Lexical Precision Engine', 'Strategic Dialogue Architecture'].map(
            (title, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-8 border border-gray-100 hover:border-mr-gold/30 fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-mr-navy rounded-xl flex items-center justify-center mb-6">
                  <span className="text-mr-gold text-2xl">🧠</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-mr-navy mb-3">{title}</h3>
                <p className="text-gray-600">
                  Advanced behavioral analysis and communication refinement for maximum professional impact.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
