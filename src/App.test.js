import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the home page with links to writing and bookshelf', () => {
  render(<App />);
  expect(screen.getByText('Rohit Bommisetti')).toBeInTheDocument();
  expect(screen.getByText('Writing')).toHaveAttribute('href', '/writing');
  expect(screen.getByText('Bookshelf')).toHaveAttribute('href', '/bookshelf');
});
