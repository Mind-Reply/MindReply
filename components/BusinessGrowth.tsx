'use client';

export default function BusinessGrowth() {
  return (
    <section id="growth" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl font-serif font-bold text-mr-navy mb-4">Accelerate Professional Growth</h2>
          <p className="text-lg text-gray-600">
            Transform subconscious communication excellence into tangible business outcomes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="fade-in-up space-y-4">
            {[
              { title: 'Client Retention', desc: '+34% average increase', icon: '📈' },
              { title: 'Deal Velocity', desc: '22% faster negotiation cycles', icon: '⚡' },
              { title: 'Team Alignment', desc: '41% reduction in miscommunication delays', icon: '👥' },
              { title: 'Risk Mitigation', desc: '67% fewer compliance incidents', icon: '🛡️' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-mr-navy rounded-xl flex items-center justify-center text-lg">
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium text-mr-navy">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="growth-chart rounded-2xl p-8 border border-gray-100 fade-in-up delay-1">
            <h4 className="font-serif font-bold text-mr-navy mb-6 text-center">
              Communication Impact Trajectory
            </h4>
            <div className="h-64 flex items-end justify-around px-4 pb-4 border-b border-gray-200">
              {['M1', 'M3', 'M6', 'M12'].map((month, idx) => (
                <div key={idx} className="text-center">
                  <div
                    className="w-16 rounded-t-lg mb-2 bg-mr-gold/20 border-t-2 border-mr-gold"
                    style={{ height: `${40 + idx * 40}px` }}
                  />
                  <p className="text-xs text-gray-500">{month}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                <span className="font-bold text-mr-navy">+187%</span> average growth in 12 months
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
