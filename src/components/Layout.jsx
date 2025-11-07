import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx'; // We will create this component next

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">

      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-gray-100 p-4 text-center text-gray-500">
        &copy; 2025 TalentLink. All rights reserved.
      </footer>
    </div>
  );
}

export default Layout;