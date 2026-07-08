import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './store/authSlice';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import AgentLayout from './layouts/AgentLayout';

// Route Guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AgentRoute from './components/AgentRoute';

// Public Pages
import Home from './pages/Home';
import Listings from './pages/Listings';
import PropertyDetail from './pages/PropertyDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import UserProfile from './pages/user/UserProfile';
import UserWishlist from './pages/user/UserWishlist';
import UserProperties from './pages/user/UserProperties';
import UserBookings from './pages/user/UserBookings';
import RecentlyViewed from './pages/user/RecentlyViewed';
import ChangePassword from './pages/user/ChangePassword';
import UserMessages from './pages/user/UserMessages';

// Agent Pages
import AgentDashboard from './pages/agent/AgentDashboard';
import AgentProfile from './pages/agent/AgentProfile';
import AgentProperties from './pages/agent/AgentProperties';
import AgentBookings from './pages/agent/AgentBookings';
import AgentMessages from './pages/agent/AgentMessages';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ManageProperties from './pages/admin/ManageProperties';
import ManageUsers from './pages/admin/ManageUsers';
import ManageBookings from './pages/admin/ManageBookings';
import ManageAgents from './pages/admin/ManageAgents';
import ManageContacts from './pages/admin/ManageContacts';
import ManageCategories from './pages/admin/ManageCategories';
import ManageLocations from './pages/admin/ManageLocations';
import ManageReviews from './pages/admin/ManageReviews';
import Profile from './pages/admin/Profile';
import AdminChats from './pages/admin/AdminChats';

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch, token]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword/:resettoken" element={<ResetPassword />} />
        </Route>

        {/* User Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserDashboard />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="properties" element={<UserProperties />} />
          <Route path="wishlist" element={<UserWishlist />} />
          <Route path="recently-viewed" element={<RecentlyViewed />} />
          <Route path="bookings" element={<UserBookings />} />
          <Route path="messages" element={<UserMessages />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

        {/* Agent Routes */}
        <Route
          path="/agent"
          element={
            <AgentRoute>
              <AgentLayout />
            </AgentRoute>
          }
        >
          <Route index element={<AgentDashboard />} />
          <Route path="profile" element={<AgentProfile />} />
          <Route path="properties" element={<AgentProperties />} />
          <Route path="bookings" element={<AgentBookings />} />
          <Route path="messages" element={<AgentMessages />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="properties" element={<ManageProperties />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="agents" element={<ManageAgents />} />
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="contacts" element={<ManageContacts />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="locations" element={<ManageLocations />} />
          <Route path="reviews" element={<ManageReviews />} />
          <Route path="chats" element={<AdminChats />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
