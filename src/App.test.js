import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the home page with links to every section', () => {
  render(<App />);
  expect(screen.getByText('Rohit Bommisetti')).toBeInTheDocument();
  ['Writing', 'Bookshelf', 'Quotes', 'Trails', 'Places', 'Photos'].forEach((name) => {
    expect(screen.getByText(name)).toHaveAttribute('href', `/${name.toLowerCase()}`);
  });
});
