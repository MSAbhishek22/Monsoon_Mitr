# 🌾 Monsoon Mitra - Smart Farming Weather App

A lightweight, mobile-first, farmer-friendly web application that provides weather-based farming recommendations. Built with React, TailwindCSS, and PWA support for offline functionality.

## 🎯 Features

- **🌤️ Real-time Weather Updates** - Current conditions, temperature, humidity, and rain probability
- **💧 Smart Irrigation Recommendations** - AI-powered suggestions based on weather data
- **🌍 Bilingual Support** - English and Hindi interface
- **📱 Mobile-First Design** - Optimized for low-end smartphones
- **🔌 Offline Support** - PWA with service worker caching
- **🎨 Farmer-Friendly UI** - Warm, earthy colors and intuitive design

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd monsoon-mitra
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 🏗️ Project Structure

```
monsoon-mitra/
├── src/
│   ├── components/
│   │   ├── TopBar.jsx          # App header with language toggle
│   │   ├── WeatherCard.jsx     # Weather information display
│   │   ├── RecommendationCard.jsx # Farming recommendations
│   │   └── InputSection.jsx    # Question input form
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles with TailwindCSS
├── service-worker.js           # PWA offline functionality
├── manifest.json               # PWA configuration
├── tailwind.config.js          # TailwindCSS customization
└── package.json                # Dependencies and scripts
```

## 🎨 Design System

### Color Palette
- **Primary Green**: `#2E7D32` - Represents growth and nature
- **Amber**: `#FFC107` - Warm, welcoming accent
- **Beige Background**: `#FFF8E1` - Easy on the eyes
- **Dark Text**: `#333333` - High contrast for readability

### Typography
- **Font Family**: Inter (system fallback)
- **Headings**: Bold, rounded, farmer-friendly
- **Body Text**: Large, easy-to-read on small screens

### Components
- **Cards**: Rounded corners, subtle shadows, paper-like appearance
- **Buttons**: Smooth hover effects, active states
- **Inputs**: Clear focus states, accessible design

## 🔧 Technical Features

### PWA Support
- Service Worker for offline caching
- Web App Manifest for app-like experience
- Responsive design for all screen sizes

### Performance Optimizations
- Lightweight bundle size
- Efficient component rendering
- Minimal external dependencies

### Accessibility
- High contrast colors
- Large touch targets
- Screen reader friendly
- Keyboard navigation support

## 🌐 API Integration

Currently uses mock weather data. Ready for integration with:
- **IMD (India Meteorological Department)** API
- **Open-Meteo** weather service
- **Custom weather stations**

## 📱 Mobile Optimization

- **Touch-friendly** interface elements
- **Fast loading** on slow connections
- **Offline-first** approach
- **Battery efficient** design

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag dist/ folder to Netlify
```

### GitHub Pages
```bash
npm run build
# Push dist/ folder to gh-pages branch
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built for Indian farmers and agricultural communities
- Inspired by the need for accessible weather information
- Designed with mobile-first, offline-first principles

---

**Made with ❤️ for farmers everywhere**