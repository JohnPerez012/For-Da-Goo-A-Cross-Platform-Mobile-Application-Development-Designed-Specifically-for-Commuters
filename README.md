# 🚌 FordaGo - Public Transportation Tracking App

A real-time location sharing and route tracking application for public transportation in Northern Cebu, Philippines. Built with React Native and Expo.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## 📱 Features

- ✅ **Real-time Location Sharing** - Share your location with other users in real-time
- 🗺️ **Interactive Map** - View public transportation routes on an interactive map
- 🚍 **Route Visualization** - Two main routes: Via Kawit and Via Bagay
- 📍 **Live User Tracking** - See all active users sharing their location
- 🔒 **Privacy Controls** - Start/stop sharing location anytime
- 🌐 **Cross-platform** - Works on iOS, Android, and Web
- ⚡ **Real-time Updates** - Location updates every 10 seconds
- 🎯 **Boundary Constraints** - Map stays focused on Northern Cebu area

## 🎯 Purpose

FordaGo aims to solve transportation challenges for students in Northern Cebu by:
- Making public transportation easier and safer
- Implementing tracking for public vehicles
- Ensuring proper time management for commuters
- Providing route information for Via Kawit and Via Bagay routes

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Expo Go app (for mobile testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/elijahtugad2005/Public-Transportation-Tracking-for-Students-in-Northern-Cebu.git
   cd Public-Transportation-Tracking-for-Students-in-Northern-Cebu
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and add your API keys
   ```

4. **Configure Firebase**
   - Follow the guide: [FIREBASE_SETUP_GUIDE.md](FIREBASE_SETUP_GUIDE.md)
   - Update `.env` with your Firebase credentials

5. **Start the development server**
   ```bash
   npx expo start
   ```

6. **Run on your device**
   - **Mobile**: Scan QR code with Expo Go app
   - **Web**: Press `w` in terminal
   - **Android Emulator**: Press `a` in terminal
   - **iOS Simulator**: Press `i` in terminal

## 📖 Documentation

- [Quick Start Guide](QUICK_START.md) - Get up and running in 5 minutes
- [Firebase Setup Guide](FIREBASE_SETUP_GUIDE.md) - Detailed Firebase configuration
- [Testing Guide](TESTING_GUIDE.md) - Comprehensive testing instructions
- [Share with Friends](SHARE_WITH_FRIENDS.md) - How to share your app
- [Easy Share Guide](EASY_SHARE.md) - Simple sharing methods

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Maps**: React Native Maps (Google Maps)
- **Database**: Firebase Realtime Database
- **Location**: Expo Location
- **Navigation**: Expo Router
- **Styling**: React Native StyleSheet

## 📂 Project Structure

```
├── app/                    # App screens and navigation
│   ├── (tabs)/            # Tab-based navigation
│   │   └── explore.tsx    # Main app screen with map
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── cebu-map.tsx      # Main map component
│   └── ui/               # UI components
├── hooks/                # Custom React hooks
│   └── use-location-sharing.ts  # Location sharing logic
├── config/               # Configuration files
│   └── firebase.ts       # Firebase configuration
├── constants/            # App constants
├── scripts/              # Utility scripts
│   ├── test-firebase.js  # Test Firebase connection
│   └── check-tunnel.js   # Check tunnel mode setup
└── assets/               # Images and static files
```

## 🗺️ Routes

### Via Kawit Route
- **Start**: Cebu North Terminal
- **Key Stops**: Dayhagon, Kawit, PayPay
- **End**: CTU Daanbantayan Campus
- **Color**: Blue line on map

### Via Bagay Route
- **Start**: Cebu North Terminal
- **Key Stops**: Bagay area
- **End**: CTU Daanbantayan Campus
- **Color**: Green line on map

## 🔧 Configuration

### Environment Variables

Create a `.env` file with:

```env
# Weather API
EXPO_PUBLIC_WEATHER_API_KEY=your_weather_api_key

# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Firebase Security Rules

```json
{
  "rules": {
    "sharedLocations": {
      ".read": true,
      ".write": true,
      "$userId": {
        ".validate": "newData.hasChildren(['userId', 'latitude', 'longitude', 'timestamp', 'isSharing'])"
      }
    }
  }
}
```

## 🧪 Testing

### Test Firebase Connection
```bash
npm run test-firebase
```

### Test Tunnel Mode
```bash
npm run check-tunnel
```

### Run on Web
```bash
npx expo start --web
```

### Run with Tunnel (for remote testing)
```bash
npx expo start --tunnel
```

## 📱 Usage

1. **Open the app** on your device
2. **Navigate to Explore tab**
3. **Scroll to "Track My Location"**
4. **Click "Start Sharing"** to share your location
5. **Grant location permission** when prompted
6. **View the map** to see your location and other users
7. **Toggle routes** using Via Kawit, Via Bagay, or Both buttons

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Team

**Cebu Technological University Students**
- Solving main problems of public transportation
- Making transportation easier and safer for students

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔐 Security

- Never commit `.env` or `google-services.json` files
- Rotate API keys if accidentally exposed
- Use Firebase security rules in production
- Implement proper authentication for production use

## 🐛 Troubleshooting

### Location not updating
- Check location permissions are granted
- Verify Firebase is configured correctly
- Check console logs for errors

### Can't see other users
- Ensure both users clicked "Start Sharing"
- Check Firebase Console for data
- Verify internet connection

### Firebase connection errors
- Run `npm run test-firebase` to check configuration
- Verify all environment variables are set
- Check Firebase Realtime Database is enabled

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check the documentation guides
- Review console logs for errors

## 🎓 About

This project is developed by students from Cebu Technological University as part of an initiative to improve public transportation accessibility and safety in Northern Cebu.

---

**Made with ❤️ by CTU Students**

*Improving public transportation, one route at a time.*
