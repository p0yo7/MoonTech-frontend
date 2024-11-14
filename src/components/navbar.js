// ExpandableNavbar.js
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';

const ExpandableNavbar = ({ onNewProject }) => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : ''}`}>
      <button className="hamburger-button" onClick={toggleSidebar}>
        <MenuIcon />
      </button>
      {isExpanded && (
        <div className="sidebar-logo">Neoris Sage</div>
      )}
      <div className="sidebar-links">
        <button onClick={() => handleNavigation("/home")} className="sidebar-button">
          <HomeIcon />
          {isExpanded && " Dashboard"}
        </button>
        <button onClick={() => handleNavigation("/kanban")} className="sidebar-button">
          <DashboardIcon />
          {isExpanded && " Kanban"}
        </button>
        <button onClick={() => handleNavigation("/notifications")} className="sidebar-button">
          <NotificationsIcon />
          {isExpanded && " Notifications"}
        </button>
        <button onClick={() => handleNavigation("/settings")} className="sidebar-button">
          <SettingsIcon />
          {isExpanded && " Settings"}
        </button>
        <button onClick={() => handleNavigation("/login")} className="sidebar-button">
          <ExitToAppIcon />
          {isExpanded && " Log out"}
        </button>
        <button onClick={onNewProject} className="sidebar-button">
          <DashboardIcon />
          {isExpanded && " New Project"}
        </button>
      </div>
    </div>
  );
};

export default ExpandableNavbar;