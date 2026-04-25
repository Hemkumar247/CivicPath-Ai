import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProgressBar from './ProgressBar';

describe('ProgressBar', () => {
  it('should render correct progress value', () => {
    const setLang = vi.fn();
    render(<ProgressBar progress={55} lang="en" setLang={setLang} />);
    
    expect(screen.getByText('55%')).toBeInTheDocument();
  });

  it('should call setLang when language buttons are clicked', () => {
    const setLang = vi.fn();
    render(<ProgressBar progress={10} lang="en" setLang={setLang} />);
    
    // Hindi button
    const hiButton = screen.getByText('हि');
    fireEvent.click(hiButton);
    expect(setLang).toHaveBeenCalledWith('hi');

    // Tamil button
    const taButton = screen.getByText('தமிழ்');
    fireEvent.click(taButton);
    expect(setLang).toHaveBeenCalledWith('ta');
  });
});
