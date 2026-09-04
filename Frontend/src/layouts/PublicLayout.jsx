import { Outlet } from 'react-router-dom';
import Nav from '../components/layout/Nav';
import Footer from '../components/layout/Footer';
import ChatbotWidget from '../components/layout/ChatbotWidget';

function PublicLayout() {
  return (
    <div>
      <Nav isAuthenticated={false} />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ChatbotWidget />
    </div>
  );
}

export default PublicLayout;