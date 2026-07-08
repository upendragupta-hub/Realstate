import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AgentRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="loader"></div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'agent' && user?.role !== 'admin') return <Navigate to="/" replace />; // Admins can also access agent panels

  return children;
};

export default AgentRoute;
