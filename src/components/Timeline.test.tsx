import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Timeline from './Timeline';

describe('Timeline', () => {
  it('renders correctly with ELECTION_PHASES', () => {
    render(<Timeline completedSteps={[]} onToggleStep={() => {}} />);
    
    expect(screen.getByText(/Registration/)).toBeInTheDocument();
    expect(screen.getByText(/Candidate Research/)).toBeInTheDocument();
  });

  it('calls onToggleStep when button is clicked', () => {
    const onToggleStep = vi.fn();
    render(<Timeline completedSteps={[]} onToggleStep={onToggleStep} />);

    // Since step 1 is expanded down automatically, click "Mark Step as Done"
    const btn = screen.getByText('Mark Step as Done');
    fireEvent.click(btn);
    
    expect(onToggleStep).toHaveBeenCalledWith(1);
  });
});
