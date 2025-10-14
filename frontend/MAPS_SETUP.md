# Google Maps API Setup Guide

## Overview
The CityCare application uses Google Maps Geocoding API to convert GPS coordinates to human-readable addresses when users click "Use my current location".

## How It Works
1. **Browser Geolocation**: Uses the browser's built-in `navigator.geolocation` API to get the user's current GPS coordinates (latitude/longitude)
2. **Geocoding**: Sends the coordinates to Google Maps Geocoding API to get the full address
3. **Fallback**: If the API key is not configured, it displays the coordinates instead

## Setup Instructions

### Step 1: Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Geocoding API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Geocoding API"
   - Click on it and press "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key

### Step 2: Add API Key to Your Project

1. Open the `.env` file in the `frontend` folder
2. Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual API key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```
3. Save the file

### Step 3: Restart the Development Server

```bash
# Stop the current server (Ctrl+C)
# Start it again
npm run dev
```

## Security Best Practices

### 1. Restrict Your API Key
In Google Cloud Console, restrict your API key to:
- **HTTP referrers**: Add your domain (e.g., `localhost:5173` for development, your production domain for live site)
- **API restrictions**: Only allow "Geocoding API"

### 2. Don't Commit API Keys
The `.env` file is already in `.gitignore` to prevent accidentally committing your API key to version control.

### 3. Set Usage Limits
In Google Cloud Console:
- Set daily quota limits to prevent unexpected charges
- Enable billing alerts

## Pricing
- Google Maps Geocoding API: First $200/month is free (covers ~40,000 requests)
- After free tier: $5 per 1,000 requests
- Most civic apps stay within the free tier

## Without API Key
If you don't configure the API key, the app will still work but will display coordinates instead of addresses:
```
Lat: 28.613939, Lng: 77.209023
```

Users can still manually enter their location in the text field.

## Testing

1. Open the "Report New Issue" page
2. Click "📍 Use my current location"
3. Your browser will ask for location permission - click "Allow"
4. The location field should populate with either:
   - Full address (if API key is configured)
   - Coordinates (if no API key)

## Troubleshooting

### "Geolocation is not supported"
- Use a modern browser (Chrome, Firefox, Edge, Safari)
- Geolocation requires HTTPS in production (works on localhost in development)

### "Unable to retrieve your location"
- Check browser permissions for location access
- Ensure GPS/location services are enabled on your device

### API Key Not Working
- Verify the API key is correct in `.env`
- Ensure Geocoding API is enabled in Google Cloud Console
- Check API key restrictions aren't blocking your domain
- Restart the development server after adding the key

### CORS Errors
- Google Maps API should work from any domain by default
- If restricted, add your domain to the HTTP referrer restrictions

## Alternative: OpenStreetMap (Free)
If you prefer a free alternative without API keys, you can use Nominatim (OpenStreetMap):
```javascript
const response = await fetch(
  `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
)
```
Note: Nominatim has rate limits and requires a User-Agent header.
