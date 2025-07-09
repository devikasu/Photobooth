# Photobooth App

A fun and interactive photobooth application built with React, TypeScript, and Vite. This app simulates a classic photobooth experience with coin insertion, camera capture, and various photo filters.

## Features

- **Coin Insertion**: Interactive coin insertion animation to start the photobooth session
- **Camera Capture**: Webcam integration for taking photos
- **Photo Filters**: Multiple filter options including:
  - None (original)
  - Grayscale
  - Sepia
  - Pink Glow
  - Contrast+
  - Blur
  - Cool (hue rotation)
- **Countdown Timer**: Visual countdown with heart animations before each photo
- **Multiple Photos**: Takes up to 3 photos per session
- **Responsive Design**: Modern UI with smooth animations

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- A modern web browser with camera access

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd photobooth
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Insert Coin**: Click on the "Insert Coin" button to start the photobooth session
2. **Start Session**: Click "Okiee, let's start!" to begin
3. **Choose Filter**: Use the arrow buttons to cycle through different photo filters
4. **Take Photos**: Click the camera icon to start the countdown and take a photo
5. **Complete Session**: The app will automatically take 3 photos and complete the session

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and development server
- **Tailwind CSS** - Styling
- **ESLint** - Code linting

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── App.tsx          # Main application component
├── App.css          # Application styles
├── main.tsx         # Application entry point
└── index.css        # Global styles
```
