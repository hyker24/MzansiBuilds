import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/Auth'
import Feed from './pages/Feed'
import ProtectedRoute from './Components/ProtectedRoute'
import CreateProject from './pages/CreateProject'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import ProjectDetail from './pages/ProjectDetail' 
import EditProject from './pages/EditProject'
//import CelebrationWall from './pages/CelebrationWall'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
         <Route path="/Feed" element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        } /> 
         <Route path="/create-project" element={
          <ProtectedRoute>
            <CreateProject /> 
          </ProtectedRoute>
        } /> 
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } /> 
        <Route path="/edit-profile" element={
          <ProtectedRoute><EditProfile /></ProtectedRoute>
        } /> 
         <Route path="/project/:id" element={
          <ProtectedRoute><ProjectDetail /></ProtectedRoute>
        } /> 
         <Route path="/project/:id/edit" element={
          <ProtectedRoute><EditProject /></ProtectedRoute>
        } />
        {/* <Route path="/celebration-wall" element={
          <ProtectedRoute><CelebrationWall /></ProtectedRoute>
        } /> */}
      </Routes>
    </BrowserRouter>
  )
}