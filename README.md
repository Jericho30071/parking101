# 🚗 Smart Parking Dashboard

A modern, responsive React.js Admin Dashboard for monitoring parking space availability in real-time. This dashboard provides parking lot administrators with comprehensive tools to monitor parking occupancy, track vehicle activity, and manage parking operations efficiently.

## 📋 Project Overview

The Smart Parking Dashboard is part of the "Smart Parking Space Indicator System with Automated Time Tracking and Fee Calculation Using IoT" project. It serves as the frontend interface for administrators to monitor and manage parking facilities equipped with IoT sensors.

### 🎯 Key Features

- **Real-time Parking Monitoring**: Live updates of parking slot availability every 5 seconds
- **Visual Parking Grid**: Color-coded parking slots (Green = Available, Red = Occupied)
- **Activity Tracking**: Comprehensive vehicle entry/exit logs with timestamps
- **Statistics Dashboard**: Real-time metrics including occupancy rates and trends
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Professional UI**: Modern gradient-based design with smooth animations
- **Mock API Integration**: Simulated backend calls for realistic demonstrations

## 🛠️ Tech Stack

- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.3.1
- **Language**: JavaScript (ES6+)
- **Styling**: Pure CSS with CSS Grid and Flexbox
- **Icons**: Inline SVG icons for optimal performance

## 📁 Project Structure

```
parking101/
├── src/
│   ├── components/           # Reusable React components
│   │   ├── Header.jsx       # Dashboard header with admin profile
│   │   ├── SummaryCard.jsx  # Statistics cards component
│   │   ├── ParkingGrid.jsx  # Parking slots grid layout
│   │   ├── ParkingSlot.jsx  # Individual parking slot component
│   │   └── ActivityLogTable.jsx # Vehicle activity logs table
│   ├── data/                # Mock data files
│   │   └── mockParkingData.js # Sample parking and activity data
│   ├── utils/               # Utility functions
│   │   └── api.js           # Mock API functions and formatters
│   ├── App.jsx              # Main application component
│   ├── App.css              # Comprehensive styling
│   └── main.jsx             # Application entry point
├── public/                  # Static assets
├── package.json             # Project dependencies and scripts
└── README.md               # This documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm installed on your system
- Git for cloning the repository

### Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd parking101
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:5173
   ```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality checks

## 🎮 Features in Detail

### 1. Header Component
- System branding with logo and title
- Live date/time display updating every second
- Admin profile section with avatar
- Logout functionality (placeholder)

### 2. Summary Cards
- **Total Slots**: Shows total parking capacity
- **Occupied**: Number of currently occupied slots with trend indicators
- **Available**: Number of free slots with trend indicators
- **Occupancy Rate**: Real-time occupancy percentage

### 3. Parking Grid
- Visual representation of all parking slots
- Organized by rows (A, B, C, etc.)
- Color-coded status indicators
- Vehicle type icons for occupied slots
- Entry time display for parked vehicles
- Interactive slots with hover effects

### 4. Activity Log Table
- Recent vehicle entry/exit records
- Plate number badges
- Slot assignments
- Entry and exit timestamps
- Status indicators (Parked/Exited)
- Live update indicator with pulsing animation

## 🎨 Design System

### Color Palette
- **Primary**: Purple gradient (#667eea → #764ba2)
- **Success**: Green (#48bb78 → #38a169)
- **Danger**: Red (#f56565 → #e53e3e)
- **Info**: Blue (#4299e1 → #3182ce)
- **Warning**: Orange (#ed8936 → #dd6b20)
- **Background**: Light gray (#f5f7fa)
- **Text**: Dark gray (#2d3748)

### Typography
- **Font Family**: System fonts (San Francisco, Segoe UI, Roboto)
- **Headings**: Bold weights with proper hierarchy
- **Body**: Regular weight with optimal line height

### Animations
- Smooth hover transitions
- Loading spinners
- Pulsing live indicators
- Card lift effects on hover

## 📱 Responsive Design

The dashboard is fully responsive with breakpoints at:
- **Desktop**: 1200px+ (full layout)
- **Tablet**: 768px - 1199px (adjusted grid)
- **Mobile**: < 768px (stacked layout)

## 🔧 Mock Data System

The application includes a comprehensive mock data system:

### Parking Slots
- 15 parking slots across 3 rows (A, B, C)
- Random occupancy status
- Various vehicle types (car, SUV, motorcycle, truck)
- Entry time tracking

### Activity Logs
- Vehicle entry/exit records
- Plate numbers and slot assignments
- Timestamped activities
- Status tracking

### Real-time Simulation
- Automatic slot status changes every 5 seconds
- Random vehicle assignments
- Activity log updates
- API delay simulation

## 🔮 Future Enhancements

### Backend Integration
- Replace mock API with real REST endpoints
- WebSocket integration for real-time updates
- Authentication and authorization
- User role management

### Advanced Features
- Fee calculation and payment tracking
- Historical data analytics
- Export functionality (PDF, Excel)
- Mobile app companion
- IoT sensor management interface
- Parking reservation system
- Advanced filtering and search

### Performance Optimizations
- Code splitting and lazy loading
- Service worker implementation
- Caching strategies
- Bundle optimization

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Kill process on port 5173
   npx kill-port 5173
   # Or use different port
   npm run dev -- --port 3000
   ```

2. **Dependencies not installing**:
   ```bash
   # Clear cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Build errors**:
   ```bash
   # Check for linting issues
   npm run lint
   # Fix automatically
   npm run lint -- --fix
   ```

## 📄 License

This project is part of an educational IoT parking system demonstration. Feel free to use and modify for learning purposes.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For questions or issues regarding this dashboard:
- Check the troubleshooting section above
- Review the code comments for implementation details
- Test the live demo to understand functionality

---

**Built with ❤️ using React.js and modern web technologies**
