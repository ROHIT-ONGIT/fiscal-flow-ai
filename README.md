# 🧠💰 Fiscal Flow AI

A cutting-edge personal finance management platform powered by artificial intelligence, built with Next.js 15, TypeScript, and Google AI Genkit.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=flat-square&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)
![Google AI](https://img.shields.io/badge/Google-AI-4285F4?style=flat-square&logo=google)

## ✨ Features

### 🤖 AI-Powered Financial Intelligence
- **Smart Budgeting Suggestions** - Personalized budget recommendations based on income, expenses, and goals
- **Cash Flow Forecasting** - Predict future financial trends with advanced AI algorithms
- **Investment Portfolio Analysis** - AI-driven insights for investment optimization
- **Debt Payoff Analysis** - Strategic debt elimination planning with AI assistance
- **Receipt OCR** - Automatic transaction extraction from receipt images
- **Smart Transaction Categorization** - Intelligent expense categorization

### 💼 Core Financial Management
- **Real-time Dashboard** - Comprehensive overview of your financial health
- **Transaction Management** - Track, categorize, and analyze all transactions
- **Budget Planning** - Create and monitor budgets with AI recommendations
- **Savings Goals** - Set and track progress toward financial objectives
- **Debt Calculator** - Advanced debt management and payoff strategies
- **Spending Analytics** - Detailed insights into spending patterns

### 🔐 Security & Authentication
- **Secure JWT Authentication** - Protected user sessions with token-based auth
- **MongoDB Integration** - Robust data storage with user privacy
- **Cookie-based Sessions** - Secure, persistent login sessions

### 🎨 Modern User Experience
- **Responsive Design** - Beautiful UI that works on all devices
- **Dark/Light Theme** - Customizable interface themes
- **Interactive Charts** - Dynamic data visualization with Recharts
- **Component Library** - Built with Radix UI and Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Google AI API key (for Genkit integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fiscal-flow-ai.git
   cd fiscal-flow-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # Authentication
   JWT_SECRET=your_jwt_secret_key
   
   # Google AI (Genkit)
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Start AI Services** (in a separate terminal)
   ```bash
   npm run genkit:dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:9002`

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Recharts** - Data visualization library
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing

### AI & Machine Learning
- **Google AI Genkit** - AI application framework
- **Custom AI Flows** - Specialized financial AI models
- **OCR Integration** - Receipt text extraction
- **Predictive Analytics** - Cash flow forecasting

## 📁 Project Structure

```
src/
├── ai/                          # AI integration and flows
│   ├── flows/                   # AI-powered financial flows
│   │   ├── ai-budgeting-suggestions.ts
│   │   ├── cash-flow-forecasting.ts
│   │   ├── debt-payoff-analysis.ts
│   │   ├── investment-portfolio-analysis.ts
│   │   ├── receipt-ocr.ts
│   │   └── smart-transaction-categorization.ts
│   ├── genkit.ts               # Genkit configuration
│   └── dev.ts                  # AI development server
├── app/                        # Next.js app directory
│   ├── (main)/                 # Main application routes
│   │   ├── dashboard/          # Financial dashboard
│   │   ├── transactions/       # Transaction management
│   │   ├── budgeting/         # Budget planning
│   │   ├── forecasting/       # Cash flow forecasting
│   │   ├── investments/       # Investment tracking
│   │   ├── debt-calculator/   # Debt management
│   │   └── settings/          # User settings
│   ├── api/                   # API routes
│   │   ├── auth/             # Authentication endpoints
│   │   ├── transactions/     # Transaction CRUD
│   │   └── savings-goals/    # Savings goals API
│   └── login/                # Authentication pages
├── components/                # Reusable UI components
│   ├── ui/                   # Base UI components
│   └── ai-components.tsx     # AI-specific components
├── hooks/                    # Custom React hooks
├── lib/                      # Utility libraries
├── models/                   # Database models
├── services/                 # Business logic services
└── types/                    # TypeScript type definitions
```

## 🎯 AI Features Deep Dive

### Smart Budgeting Suggestions
Uses machine learning to analyze spending patterns and provide personalized budget recommendations based on:
- Historical spending data
- Income patterns
- Financial goals
- Market trends

### Cash Flow Forecasting
Predicts future cash flow using:
- Transaction history analysis
- Seasonal spending patterns
- Income prediction models
- Economic indicators

### Investment Analysis
AI-powered portfolio optimization considering:
- Risk tolerance assessment
- Market analysis
- Diversification strategies
- Goal-based investing

## 📊 Available Scripts

```bash
# Development
npm run dev              # Start development server (port 9002)
npm run genkit:dev      # Start AI development server
npm run genkit:watch    # Start AI server in watch mode

# Production
npm run build           # Build for production
npm run start           # Start production server

# Quality
npm run lint            # Run ESLint
npm run typecheck       # TypeScript type checking
```

## 🔧 Configuration

### MongoDB Setup
1. Create a MongoDB database (local or cloud)
2. Add connection string to `.env.local`
3. Models will be automatically created on first run

### Google AI Setup
1. Get API key from Google AI Studio
2. Add to `.env.local` as `GOOGLE_AI_API_KEY`
3. Configure flows in `src/ai/flows/`

### Customization
- **Themes**: Modify `src/app/globals.css` and `tailwind.config.ts`
- **Components**: Extend UI components in `src/components/ui/`
- **AI Flows**: Add custom AI logic in `src/ai/flows/`

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@fiscalflowai.com
- 💬 Discord: [Join our community](https://discord.gg/fiscalflowai)
- 📖 Documentation: [docs.fiscalflowai.com](https://docs.fiscalflowai.com)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/fiscal-flow-ai/issues)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Google AI Genkit](https://firebase.google.com/docs/genkit) for AI capabilities
- [Radix UI](https://www.radix-ui.com/) for headless components
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities
- [MongoDB](https://www.mongodb.com/) for database solutions

---

<div align="center">
  <strong>Built with ❤️ for better financial health</strong>
  <br>
  <sub>Made with Next.js, TypeScript, and AI</sub>
</div>
