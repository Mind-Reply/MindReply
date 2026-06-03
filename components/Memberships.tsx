'use client';

interface MembershipsProps {
  onConciergeClick?: () => void;
}

export default function Memberships({ onConciergeClick }: MembershipsProps) {
  const tiers = [
    {
      name: 'Curator',
      price: '$49',
      period: '/month',
      features: [
        'Access to 5 professional lexicons',
        '3 micro-tools access',
        'Monthly insights report',
        'Community forum access',
        '50 micro-tool credits monthly',
      ],
    },
    {
      name: 'Strategist',
      price: '$149',
      period: '/month',
      featured: true,
      features: [
        'All 20+ professional lexicons',
        'Full micro-tool suite access',
        'Advanced behavioral analytics',
        'Priority support',
        'Unlimited micro-tool credits',
        'Quarterly strategy consultation',
        'Exclusive webinar series',
      ],
    },
    {
      name: 'Sovereign',
      price: 'Custom',
      period: '',
      features: [
        'Everything in Strategist, plus:',
        'Dedicated communication architect',
        'Organization-wide customization',
        'Predictive behavioral modeling',
        'Crisis communication protocols',
        'Executive coaching integration',
        'Board-level reporting',
      ],
    },
  ];

  return (
    <section id="memberships" className="py-20 bg-gradient-to-b from-white to-mr-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl font-serif font-bold text-mr-navy mb-4">Exclusive Membership Tiers</h2>
          <p className="text-lg text-gray-600">
            Invitation-only access to premium communication intelligence.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-8 fade-in-up ${
                tier.featured
                  ? 'membership-premium text-white'
                  : 'glass-card border border-gray-100'
              }`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {tier.featured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="px-4 py-1 bg-mr-gold text-mr-navy text-xs font-bold rounded-full">
                    MOST SELECTED
                  </span>
                </div>
              )}
              <h3 className={`text-2xl font-serif font-bold mb-2 ${
                tier.featured ? 'text-white' : 'text-mr-navy'
              }`}>
                {tier.name}
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{tier.price}</span>
                <span className={tier.featured ? 'text-gray-300' : 'text-gray-500'}>{tier.period}</span>
              </div>
              <ul className={`space-y-3 mb-8 text-sm ${
                tier.featured ? 'text-gray-200' : 'text-gray-600'
              }`}>
                {tier.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-start gap-3">
                    <span className={tier.featured ? 'text-mr-gold' : 'text-mr-gold'}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={onConciergeClick}
                className={`w-full py-3 rounded-xl font-medium ${
                  tier.featured
                    ? 'bg-mr-gold hover:bg-yellow-600 text-mr-navy'
                    : 'bg-mr-navy hover:bg-mr-accent text-white border-2 border-mr-navy'
                }`}
              >
                {tier.featured ? 'Request Invitation' : 'Apply Now'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
