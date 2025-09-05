import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { VideoProvider } from './contexts/VideoContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { WalletProvider } from './contexts/WalletContext';
import { LiveProvider } from './contexts/LiveContext';
import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';
import Home from './pages/Home';
import Watch from './pages/Watch';
import Upload from './pages/Upload';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Premium from './pages/Premium';
import Rewards from './pages/Rewards';
import Wallet from './pages/Wallet';
import Live from './pages/Live';
import Podcasts from './pages/Podcasts';
import Playlists from './pages/Playlists';
import Search from './pages/Search';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminVideos from './pages/admin/Videos';
import AdminAnalytics from './pages/admin/Analytics';
import AdminLive from './pages/admin/Live';
import AdminWallet from './pages/admin/Wallet';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <WalletProvider>
          <LiveProvider>
            <VideoProvider>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
              <div className="vitimo-container">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin/*" element={
                    <AdminLayout>
                      <Routes>
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="/users" element={<AdminUsers />} />
                        <Route path="/videos" element={<AdminVideos />} />
                        <Route path="/analytics" element={<AdminAnalytics />} />
                        <Route path="/live" element={<AdminLive />} />
                        <Route path="/wallet" element={<AdminWallet />} />
                      </Routes>
                    </AdminLayout>
                  } />
                  <Route path="/*" element={
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/watch/:id" element={<Watch />} />
                        <Route path="/upload" element={<Upload />} />
                        <Route path="/profile/:id" element={<Profile />} />
                        <Route path="/premium" element={<Premium />} />
                        <Route path="/rewards" element={<Rewards />} />
                        <Route path="/wallet" element={<Wallet />} />
                        <Route path="/live" element={<Live />} />
                        <Route path="/podcasts" element={<Podcasts />} />
                        <Route path="/playlists" element={<Playlists />} />
                        <Route path="/search" element={<Search />} />
                      </Routes>
                    </Layout>
                  } />
                </Routes>
              </div>
              </div>
            </VideoProvider>
          </LiveProvider>
        </WalletProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;