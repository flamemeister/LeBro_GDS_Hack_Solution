import React from 'react';
import './ButtonList.css'; // Make sure to create a corresponding CSS file for styling

export default function ButtonList({ onFindAttractionsClick, onGoToMapClick, isOpen }) {
  return (
    <div className="action-button-bar">
      <button onClick={onFindAttractionsClick} className="action-btn">
        Тиісті көрікті жерлерді табыңыз
      </button>
      <button onClick={onGoToMapClick} className="action-btn">
        { isOpen ? 'картаны жабу' : 'картаны ашу' }
      </button>
    </div>
  );
};
