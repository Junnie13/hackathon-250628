# Quotable - AI Marketing Intelligence

Quotable is an AI-powered application designed to revolutionize international lead generation and marketing campaign optimization. Instead of relying on purchased lead lists and manual A/B campaigns, Quotable scrapes and qualifies high-value leads, automates targeted outreach, and continuously improves campaign performance through prescriptive analytics.

![Quotable Banner](https://via.placeholder.com/800x200/2F4FE0/FFFFFF?text=Quotable+-+AI+Marketing+Intelligence)

## 🚀 Overview

Quotable offers a systematic and iterative workflow that leverages AI to:

- Scrape and evaluate leads from public sources
- Launch AI-personalized email campaigns
- Track and analyze performance
- Diagnose failures and predict campaign ROI
- Optimize content based on cultural and behavioral insights

This MVP focuses on outbound email campaigns in the insurance vertical, targeting decision-makers internationally.

## 📋 Project Documentation

This repository contains the following documentation:

- **[ROADMAP.md](./ROADMAP.md)**: Detailed development roadmap with phases, milestones, and technical implementation details
- **[ENV_SETUP.md](./ENV_SETUP.md)**: Guide for setting up environment variables and securely storing API keys

## 🎨 Brand Identity

Quotable's brand identity is defined by:

- **Voice**: Smart, confident, globally aware
- **Vibe**: Strategic, actionable, sleek
- **Target Users**: Marketers, sales leaders, global expansion teams
- **Primary Color**: Deep Tech Blue (#2F4FE0)
- **Typography**: Poppins for headers, Inter for body text

## 🛠️ Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Supabase
- **Scraping**: Puppeteer (MVP), Crawl4AI (Phase 2)
- **AI & NLP**: OpenAI (API), Claude (backup), LangChain agents
- **RAG**: Supabase pgvector or Pinecone + LangChain
- **Email**: Gmail SMTP (MVP), Mailgun (Phase 2)
- **Analytics**: Pandas, Plotly, OpenAI function calling

## 🔍 Core Features

1. **Lead Scraping (Automated Collection)**
   - Scrape leads from Google Maps and LinkedIn
   - Extract key attributes (name, title, company, location, etc.)

2. **Lead Evaluation (Filtering & Enrichment)**
   - Use RAG to analyze lead profiles
   - Identify decision-makers and confirm industry relevance

3. **Campaign Automation (Outbound Email)**
   - Generate personalized email templates with GPT
   - Track open rates, click-through, and responses

4. **Campaign Performance Analysis**
   - Visualize performance metrics by campaign, persona, and market
   - Identify drop-off points in the funnel

5. **Root Cause Analysis**
   - Diagnose poor campaign results
   - Identify language tone mismatches and timing issues

6. **Predictive Benchmarking**
   - Estimate future performance metrics
   - Set industry and geography benchmarks

7. **Prescriptive Optimization**
   - Generate improved campaign emails
   - Provide actionable recommendations for future campaigns

## 🚦 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Supabase account
- OpenAI API key
- Gmail account (for SMTP)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/quotable.git
   cd quotable
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Follow the instructions in [ENV_SETUP.md](./ENV_SETUP.md)
   - Create a `.env` file based on `.env.example`

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## 📊 Development Process

Follow the development roadmap in [ROADMAP.md](./ROADMAP.md) for a structured approach to implementing features. The roadmap is designed to balance UI completion with AI feature implementation, ensuring a focused and efficient development process.

## 🔐 Security Considerations

- Never commit API keys or sensitive information to the repository
- Follow the security guidelines in [ENV_SETUP.md](./ENV_SETUP.md)
- Implement proper error handling for missing environment variables

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [OpenAI](https://openai.com/) for GPT models
- [Supabase](https://supabase.io/) for backend services
- [React](https://reactjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
