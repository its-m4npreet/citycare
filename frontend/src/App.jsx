import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import ReportNewIssue from './pages/ReportNewIssue'
import MyReports from './pages/MyReports'
import Map from './pages/Map'
import Profile from './pages/Profile'

// Protected Route Component
function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}

export default function App(){
  return (
    <BrowserRouter>
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        {/* Navbar - Full Width */}
        <Navbar />
        
        {/* Sidebar and Main Content */}
        <div className="flex flex-1 overflow-hidden">
          <SignedIn>
            <Sidebar />
          </SignedIn>
          
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Dashboard/>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/map" 
                element={
                  <ProtectedRoute>
                    <Map/>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/report-new-issue" 
                element={
                  <ProtectedRoute>
                    <ReportNewIssue/>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-reports" 
                element={
                  <ProtectedRoute>
                    <MyReports/>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile/>
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
