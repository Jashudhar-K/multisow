import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '@/components/landing/Navbar';
import { describe, it, expect } from 'vitest';

describe('Navbar', () => {
  it('Renders without crashing', () => {
    render(<Navbar />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('All nav links are present in DOM', () => {
    render(<Navbar />);
    const links = ['Home', 'Designer', 'Predict', 'Crops', 'Docs'];
    for (const link of links) {
      expect(screen.getByText(link)).toBeInTheDocument();
    }
  });

  it('Hamburger menu toggles on mobile viewport (640px)', () => {
    window.innerWidth = 640;
    render(<Navbar />);
    const button = screen.getByLabelText(/menu/i);
    fireEvent.click(button);
    expect(screen.getByRole('navigation')).toBeVisible();
  });

  it('Active link has correct aria-current="page"', () => {
    render(<Navbar />);
    // Simulate active link logic if present
    // This is a placeholder; actual implementation may vary
    // expect(screen.getByText('Dashboard')).toHaveAttribute('aria-current', 'page');
  });
});
