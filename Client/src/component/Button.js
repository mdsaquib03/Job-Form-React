// src/components/Button/Button.js
import React from 'react';
import PropTypes from 'prop-types';

Button.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  icon: PropTypes.element,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  color: 'blue',
  size: 'medium',
  icon: null,
  onClick: null,
};

function Button({ label, color, size, icon, onClick }) {
  const buttonStyle = {
    background: color,
    fontSize: size === 'large' ? '20px' : '16px',
  };

  return (
    <button style={buttonStyle} onClick={onClick}>
      {icon && <span className="icon">{icon}</span>}
      {label}
    </button>
  );
}

export default Button;
