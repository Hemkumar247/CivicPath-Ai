import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CountdownTimer from './CountdownTimer';

describe('CountdownTimer', () => {
  it('renders without crashing and displays correct localized title', () => {
    const { rerender } = render(<CountdownTimer lang="en" />);
    expect(screen.getByText('Next General Election')).toBeInTheDocument();

    rerender(<CountdownTimer lang="hi" />);
    expect(screen.getByText('अगला आम चुनाव')).toBeInTheDocument();

    rerender(<CountdownTimer lang="ta" />);
    expect(screen.getByText('அடுத்த பொதுத் தேர்தல்')).toBeInTheDocument();
  });

  it('renders Days, Hrs, and Min elements', () => {
    render(<CountdownTimer lang="en" />);
    expect(screen.getByText('Days', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Hrs', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Min', { exact: false })).toBeInTheDocument();
  });
});
