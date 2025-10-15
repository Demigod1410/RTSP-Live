# RTSP Live - Stream Viewer with Custom Overlays

RTSP Live is a modern web application for viewing and customizing RTSP video streams with interactive overlays. Built with Next.js 15.5.5, this full-stack solution offers a seamless experience for streaming video content with real-time customizable overlay elements.

![RTSP Live Screenshot](https://placeholder-for-screenshot.com)

## Features

- **RTSP Stream Playback**: Watch real-time RTSP video streams directly in your browser
- **Custom Overlays**: Add, edit, and position text and image overlays on top of your video stream
- **Persistence**: All overlay settings are stored in MongoDB for easy retrieval
- **Modern UI**: Beautiful, responsive interface with animations powered by Framer Motion
- **Live Controls**: Play, pause, and adjust volume of your stream
- **Drag & Drop**: Easily position overlays anywhere on the video
- **Customization Options**: Adjust font sizes, colors, opacity, and more for each overlay

## Tech Stack

- **Frontend**:
  - Next.js 15.5.5
  - React 18
  - Framer Motion for animations
  - TailwindCSS for styling
  - ReactPlayer for video streaming
  - Zustand for state management

- **Backend**:
  - Next.js API Routes
  - MongoDB with Mongoose
  - TypeScript for type safety

- **Features**:
  - Custom hooks for overlay management
  - Streaming settings persistence
  - Debounced video error handling
  - Responsive design

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Demigod1410/RTSP-Live.git
   cd next-stream
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your MongoDB connection string
   ```
   MONGODB_URI=mongodb://localhost:27017/next-stream
   NODE_ENV=development
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Home Page**: Visit the landing page to see the animated hero section
2. **Start Streaming**: Click the "Start Streaming" button to navigate to the live stream page
3. **Add Overlays**: Use the overlay controls to add text or image overlays
4. **Customize**: Select any overlay to edit its properties (text, font, color, size, etc.)
5. **Positioning**: Drag overlays to position them anywhere on the video
6. **Persistence**: All changes are automatically saved to the database

## API Endpoints

- **GET/POST/PUT** `/api/stream-settings` - Manage stream settings
- **GET/POST** `/api/overlays` - List all overlays or create new ones
- **GET/PUT/DELETE** `/api/overlays/[id]` - Manage specific overlay by ID

## Project Structure

- `/src/app` - Next.js application routes and API endpoints
- `/src/components` - React components including VideoPlayer and overlays
- `/src/hooks` - Custom hooks for managing overlays and stream settings
- `/src/lib` - Core libraries, models, and store definitions
- `/src/types` - TypeScript type definitions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with Next.js and React
- UI components inspired by modern streaming platforms
- Special thanks to the open-source community
