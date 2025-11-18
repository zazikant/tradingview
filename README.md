# 🎯 Doji Candle Identifier https://tradingview-livid-rho.vercel.app/

A modern web application for analyzing candlestick patterns and identifying Doji formations. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Real-time Analysis**: Enter OHLC (Open, High, Low, Close) prices and get instant Doji identification
- **Multiple Doji Types**: Identifies Standard, Dragonfly, Gravestone, and Long-legged Doji patterns
- **Detailed Metrics**: View comprehensive candle measurements and criteria checks
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode Support**: Includes built-in dark mode support

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

### Method 1: Deploy with Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Method 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Click "Deploy"

Vercel will automatically detect Next.js and configure the build settings.

## Doji Identification Criteria

The application uses the following criteria to identify Doji candles:

- **Wick Similarity**: Upper and lower wicks must be within 30% similarity
- **Minimum Wick Size**: Each wick must be at least 1% of the close price
- **Small Body**: Body must be less than 30% of the total price range

### Doji Types

1. **Standard Doji ⭐**: Balanced wicks indicating market indecision
2. **Dragonfly Doji 🐉**: Long lower wick, bullish reversal signal
3. **Gravestone Doji 🪦**: Long upper wick, bearish reversal signal
4. **Long-legged Doji 🦵**: Long wicks on both sides, high volatility

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## Project Structure

```
doji-identifier/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── doji-identifier.tsx
│   └── ui/
│       ├── card.tsx
│       ├── input.tsx
│       ├── button.tsx
│       ├── badge.tsx
│       └── separator.tsx
├── lib/
│   └── utils.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## License

MIT

## Author

Based on the Doji Candle Identifier Jupyter notebook
