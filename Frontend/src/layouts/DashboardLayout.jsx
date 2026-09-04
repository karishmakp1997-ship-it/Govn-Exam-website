import { Outlet, Navigate } from 'react-router-dom';
import Nav from '../components/layout/Nav';
import Footer from '../components/layout/Footer';
import ChatbotWidget from '../components/layout/ChatbotWidget';
import { useAuth } from '../context/AuthContext';

function DashboardLayout() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Nav isAuthenticated={true} />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ChatbotWidget />
    </div>
  );
}

export default DashboardLayout;