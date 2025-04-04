# SMS-POC

A modern React application with TypeScript, TailwindCSS, i18n internationalization, and dark mode support.

## Features

- 🌐 Multilingual support (English, French, Arabic)
- 🌓 Dark mode and light mode
- 🔒 Authentication and protected routes
- 📱 Fully responsive design
- 🎨 Modern UI with TailwindCSS
- 🚀 Performance optimized with lazy loading

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ADERALLE/sms-poc
cd sms-poc
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── assets/          # Static assets like images and fonts
├── components/      # Reusable components
│   ├── layout/      # Layout components
│   └── ui/          # UI components
├── contexts/        # React contexts
├── hooks/           # Custom React hooks
├── i18n/            # Internationalization
│   └── locales/     # Translation files
├── lib/             # Utility functions
├── pages/           # Page components
├── routes/          # Routing configuration
└── App.tsx          # Main application component
```

## Available Scripts

- `npm run dev` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from create-react-app