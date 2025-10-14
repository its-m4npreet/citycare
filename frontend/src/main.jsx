import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'

// Import your Clerk publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        layout: {
          socialButtonsPlacement: 'top',
          socialButtonsVariant: 'iconButton',
        },
        variables: {
          colorPrimary: '#10b981',
          colorBackground: '#ffffff',
          colorText: '#1f2937',
          colorTextSecondary: '#6b7280',
          colorInputBackground: '#ffffff',
          colorInputText: '#1f2937',
          colorDanger: '#ef4444',
          borderRadius: '0.5rem',
        },
        elements: {
          rootBox: 'bg-white',
          card: 'bg-white shadow-2xl border border-gray-200',
          headerTitle: 'text-gray-900 font-bold',
          headerSubtitle: 'text-gray-600',
          socialButtonsBlockButton: 
            'bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700',
          socialButtonsBlockButtonText: 'text-gray-700 font-medium',
          formButtonPrimary: 
            'bg-green-600 hover:bg-green-700 text-white font-semibold normal-case',
          formFieldLabel: 'text-gray-700 font-medium',
          formFieldInput: 
            'bg-white border-2 border-gray-300 text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-200',
          formFieldInputShowPasswordButton: 'text-gray-600 hover:text-gray-800',
          footerActionLink: 'text-green-600 hover:text-green-700 font-semibold',
          footerActionText: 'text-gray-600',
          identityPreviewText: 'text-gray-700',
          identityPreviewEditButton: 'text-green-600 hover:text-green-700',
          formResendCodeLink: 'text-green-600 hover:text-green-700',
          otpCodeFieldInput: 'border-2 border-gray-300 text-gray-900',
          formFieldErrorText: 'text-red-600',
          alertText: 'text-gray-800',
          dividerLine: 'bg-gray-300',
          dividerText: 'text-gray-500',
        },
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
)
