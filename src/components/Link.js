import React, { createContext, useContext } from 'react';

export const NavigateContext = createContext(null);

// Internal link that swaps pages without a full reload; external hrefs behave normally.
const Link = ({ to, onClick, children, ...props }) => {
  const navigate = useContext(NavigateContext);

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!navigate) return;
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};

export default Link;
