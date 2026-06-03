# MindReply: Executive Communication Intelligence Ecosystem

> The #1 worldwide platform for behavioral communication intelligence.

## 🚀 Quick Start

```bash
cd MindReply
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## ✨ Features

- 🧠 **MRAgent**: AI-powered behavioral communication analysis
- 📚 **20+ Professional Lexicons**: Industry-specific vocabularies
- 🛠️ **10 Micro-Tools**: One-click communication refinement
- 👥 **Professional Booking**: Connect with vetted experts
- 💎 **3 Membership Tiers**: Curator, Strategist, Sovereign
- 🌍 **8+ Languages**: Global accessibility (including Bulgarian)
- ☁️ **Azure Integration**: Enterprise automation ready
- 📊 **Datadog Monitoring**: Real-time observability

## 📂 Project Structure

```
mindreply-ecosystem/
├── app/                    # Next.js 15 App Router
├── components/             # React components
├── lib/                    # Utilities & helpers
├── types/                  # TypeScript definitions
├── public/                 # Static assets
├── messages/               # i18n translations
├── azure/                  # Azure blueprints
├── datadog/                # Monitoring config
└── .cursor/rules/          # Development standards
```

## 🔧 Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

## 🏗️ Architecture

### Frontend
- Next.js 15 with App Router
- React 18.3 with hooks
- Tailwind CSS for styling
- next-intl for internationalization

### Backend
- Next.js API routes
- Axios for HTTP client
- React Query for data fetching
- Zustand for state management

### Integrations
- **Stripe**: Payment processing
- **Azure**: Cloud infrastructure
- **Datadog**: Monitoring & observability

## 🌐 Multilingual Support

Supported languages:
- English (en)
- Bulgarian (bg)
- German (de)
- French (fr)
- Spanish (es)
- Italian (it)
- Portuguese (pt)
- Japanese (ja)

## 📱 Responsive Design

- Mobile-first approach
- Desktop-optimized layouts
- Touch-friendly interactions
- Optimized typography

## 🔐 Security

- Environment variables for secrets
- API authentication ready
- CORS configuration
- Rate limiting prepared

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
- [.cursor/rules/mindreply.rules](./.cursor/rules/mindreply.rules) - Development standards

## 👥 Team

Built by the MindReply team for professionals worldwide.

## 📄 License

MIT License - See LICENSE file for details.
