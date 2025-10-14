import { SignedIn, SignedOut, SignInButton, SignUpButton, useUser } from '@clerk/clerk-react'

export default function Navbar() {
  const { user } = useUser();

  return (
    <nav 
      className="bg-white border-b border-gray-200 sticky top-0 z-50"
      style={{ 
        padding: '20px 32px',
        borderBottom: '1px solid #e5e7eb'
      }}
    >
      <div className="flex justify-between items-center">
        {/* Left side - CityCare Title */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold" style={{ fontSize: '24px', fontWeight: '700' }}>
            <span className="text-gray-800">City</span>
            <span className="text-green-600">Care</span>
          </h1>
        </div>

        {/* Right side - Auth Buttons / User Profile */}
        <div className="flex items-center" style={{ gap: '12px' }}>
          {/* When User is NOT Logged In - Show Login and Register buttons */}
          <SignedOut>
            <SignInButton 
              mode="modal"
              appearance={{
                variables: {
                  colorPrimary: '#10b981',
                  colorBackground: '#ffffff',
                },
                elements: {
                  formButtonPrimary: 'bg-green-600 hover:bg-green-700',
                  card: 'shadow-2xl bg-white',
                  modalContent: 'bg-white',
                },
              }}
            >
              <button 
                className="border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold rounded-lg transition-colors"
                style={{ padding: '10px 24px' }}
              >
                Login
              </button>
            </SignInButton>
            
            <SignUpButton 
              mode="modal"
              appearance={{
                variables: {
                  colorPrimary: '#10b981',
                  colorBackground: '#ffffff',
                },
                elements: {
                  formButtonPrimary: 'bg-green-600 hover:bg-green-700',
                  card: 'shadow-2xl bg-white',
                  modalContent: 'bg-white',
                },
              }}
            >
              <button 
                className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                style={{ padding: '10px 24px' }}
              >
                Register
              </button>
            </SignUpButton>
          </SignedOut>
          
          {/* When User IS Logged In - Show User Profile */}
          <SignedIn>
            <div className="flex items-center" style={{ gap: '12px' }}>
              <img
                src={user?.imageUrl}
                alt={user?.firstName || 'User'}
                className="rounded-full border-2 border-green-500"
                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800" style={{ fontSize: '14px', fontWeight: '600' }}>
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="text-xs text-green-600" style={{ fontSize: '12px' }}>Active</span>
              </div>
            </div>
          </SignedIn>
        </div>
      </div>
    </nav>
  )
}
