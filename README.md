# Web3 Next.js Application 🚀

A modern web3-enabled Next.js application with Graph API integration, Web3Modal support, and RainbowKit integration.

## ✨ Features

- 🌐 Web3 Integration with Web3Modal and RainbowKit
- 📊 Graph API Integration for blockchain data querying
- 🎨 Styled with TailwindCSS
- 🔍 Apollo Client for GraphQL queries
- ⚡ Built with Next.js and TypeScript
- 🎯 Font Awesome icons integration
- 📱 Fully responsive design

## 🛠 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Web3Modal Project ID
- A Graph API Key

## 🔑 Environment Setup

This project requires environment variables to be set up. Follow these steps:

1. Copy `.env.example` to a new file named `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in the required environment variables in `.env`:
   - `NEXT_PUBLIC_WEB3MODAL_PROJECT_ID`: Your Web3Modal project ID
   - `NEXT_PUBLIC_GRAPH_API_KEY`: Your Graph API key ([Watch setup video](https://www.youtube.com/watch?v=vVkhz6WTi5A))

### 📚 The Graph API Resources
- [Pricing Information](https://thegraph.com/studio-pricing/)
- [Query Documentation](https://thegraph.com/docs/en/subgraphs/querying/introduction/)

> ⚠️ Note: Never commit your `.env` file or share your API keys publicly.

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

2. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [Web3Modal](https://web3modal.com/) - Web3 integration
- [RainbowKit](https://www.rainbowkit.com/) - Wallet connection
- [Apollo Client](https://www.apollographql.com/docs/react/) - GraphQL client
- [The Graph](https://thegraph.com/) - Blockchain data indexing
- [Font Awesome](https://fontawesome.com/) - Icons
- [Wagmi](https://wagmi.sh/) - Web3 React Hooks

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT license.
