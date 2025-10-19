# AI Scale Pro - React Application

A modern React-based project utilizing the latest frontend technologies and tools for building responsive web applications.

## 🚀 Features

- **React 18** - React version with improved rendering and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **Redux Toolkit** - State management with simplified Redux setup
- **TailwindCSS** - Utility-first CSS framework with extensive customization
- **React Router v6** - Declarative routing for React applications
- **Data Visualization** - Integrated Recharts for powerful data visualization
- **Form Management** - React Hook Form for efficient form handling
- **Animation** - Framer Motion for smooth UI animations
- **State Management** - Zustand for lightweight state management
- **UI Components** - Radix UI primitives for accessible components

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
   
2. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. Build for production:
   ```bash
   npm run build
   # or
   yarn build
   ```

## 📁 Project Structure

```
webapp/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── styles/         # Global styles and Tailwind configuration
│   ├── store/          # State management (Zustand)
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API services
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main application component
│   ├── Routes.jsx      # Application routes
│   └── index.jsx       # Application entry point
├── .env                # Environment variables
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
├── postcss.config.js   # PostCSS configuration
└── vite.config.js      # Vite configuration
```

## 🧩 Available Pages

- **Home** - Landing page with hero section and features
- **Dashboard** - Interactive dashboard with data visualization
- **About** - About page with company information
- **Contact** - Contact form with validation

## 🎨 Styling

This project uses Tailwind CSS for styling with:

- Custom color palette
- Responsive design utilities
- Dark mode support
- Animation utilities
- Custom components

## 📱 Responsive Design

The app is built with mobile-first responsive design using Tailwind CSS breakpoints:
- `sm` - 640px
- `md` - 768px
- `lg` - 1024px
- `xl` - 1280px
- `2xl` - 1536px

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📦 Deployment

Build the application for production:

```bash
npm run build
```

The build output will be in the `dist` directory, ready for deployment to any static hosting service.

## 🙏 Acknowledgments

- Built with React and Vite
- Styled with Tailwind CSS
- UI components from Radix UI
- Icons from Lucide React

Built with ❤️ using modern web technologies