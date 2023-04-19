import React from 'react';

import "../../styles/DMModerationMenu.css"; // Importing styling
const DMModerationMenu = () => {
  // Handle DM moderation logic here

  return (
    <div className="dm-moderation-menu">
      {/* Render the three-dot (ellipsis) icon */}
      <div className="ellipsis-icon">
        {/* Add your ellipsis icon SVG or use a library like Material-UI icons */}
        ...
      </div>
      {/* Render the DM moderation menu items */}
      <ul className="dm-moderation-menu-items">
        {/* Add your DM moderation menu items as needed */}
        <li>Block User</li>
        <li>Report Message</li>
        <li>Delete Message</li>
      </ul>
    </div>
  );
};

export default DMModerationMenu;
