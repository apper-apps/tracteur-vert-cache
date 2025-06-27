import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import HomePage from '@/components/pages/HomePage'
import ListingDetailPage from '@/components/pages/ListingDetailPage'
import PostListingPage from '@/components/pages/PostListingPage'
import SearchResultsPage from '@/components/pages/SearchResultsPage'
import SavedListingsPage from '@/components/pages/SavedListingsPage'
import MessagesPage from '@/components/pages/MessagesPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/listing/:id" element={<ListingDetailPage />} />
            <Route path="/post-listing" element={<PostListingPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/saved" element={<SavedListingsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  )
}

export default App