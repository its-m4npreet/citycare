import { UserProfile } from '@clerk/clerk-react'

export default function Profile() {
  return (
    <div className="bg-gray-50 min-h-screen" style={{ padding: '40px' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 className="text-3xl font-bold text-gray-800" style={{ marginBottom: '8px' }}>Profile Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        {/* Clerk User Profile Component */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <UserProfile
            appearance={{
              variables: {
                colorPrimary: '#10b981',
                colorBackground: '#ffffff',
                colorText: '#1f2937',
                colorInputBackground: '#ffffff',
                colorInputText: '#1f2937',
              },
              elements: {
                rootBox: 'w-full',
                card: 'shadow-none border-0 w-full',
                navbar: 'bg-white border-r border-gray-200',
                navbarButton: 'text-gray-700 hover:bg-green-50 hover:text-green-600',
                navbarButtonActive: 'bg-green-50 text-green-600',
                profileSection: 'p-0',
                profileSectionPrimaryButton: 'bg-green-600 hover:bg-green-700',
                formButtonPrimary: 'bg-green-600 hover:bg-green-700',
                formFieldInput: 'border-gray-300 focus:border-green-500 focus:ring-green-500',
                pageScrollBox: 'p-8',
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
