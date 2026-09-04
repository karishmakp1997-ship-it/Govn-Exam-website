import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f6f8fc' }}>
      <Outlet />
    </div>
  );
}

export default AuthLayout;