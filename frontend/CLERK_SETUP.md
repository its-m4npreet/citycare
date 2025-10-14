# CityCare - Clerk Authentication Setup

## Setup Instructions

### 1. Create a Clerk Account
1. Go to [https://clerk.com](https://clerk.com)
2. Sign up for a free account
3. Create a new application

### 2. Get Your API Keys
1. In your Clerk Dashboard, go to **API Keys**
2. Copy your **Publishable Key**
3. It should look like: `pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 3. Configure Environment Variables
1. Open the `.env` file in the `frontend` folder
2. Replace `your_clerk_publishable_key_here` with your actual Clerk Publishable Key:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

### 4. Configure Clerk Settings (Optional)
In your Clerk Dashboard, you can customize:
- **User Profile**: Enable/disable fields like username, phone number, etc.
- **Social Connections**: Add Google, Facebook, GitHub login
- **Email/SMS**: Configure email templates and SMS providers
- **Appearance**: Customize the look of sign-in/sign-up forms

### 5. Start the Application
```bash
npm run dev
```

## Features Implemented

✅ **Sign In/Sign Up**: Modal-based authentication
✅ **User Button**: Profile dropdown with account management
✅ **Protected Routes**: All dashboard routes require authentication
✅ **User Display**: Shows logged-in user's name in navbar
✅ **Sign Out**: Built into the UserButton dropdown

## Authentication Flow

1. **Unauthenticated User**: 
   - Sees "Sign In" button in navbar
   - Cannot access dashboard, reports, or sidebar
   - Clicking "Sign In" opens authentication modal

2. **Authenticated User**:
   - Sees their name and profile picture in navbar
   - Full access to all features
   - Can manage account via UserButton dropdown
   - Can sign out from UserButton menu

## Clerk Features Used

- `ClerkProvider`: Wraps the entire app
- `SignedIn`: Shows content only to authenticated users
- `SignedOut`: Shows content only to unauthenticated users
- `SignInButton`: Triggers sign-in modal
- `UserButton`: User profile dropdown menu
- `useUser`: Hook to access user information
- `RedirectToSignIn`: Redirects unauthenticated users

## Next Steps

1. Get your Clerk API key from [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Add it to the `.env` file
3. Restart your dev server
4. Test sign in/sign up functionality

## Support

For more information, visit [Clerk Documentation](https://clerk.com/docs)
