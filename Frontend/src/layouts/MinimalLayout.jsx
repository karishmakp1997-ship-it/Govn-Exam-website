import { Outlet } from 'react-router-dom';

function MinimalLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default MinimalLayout;