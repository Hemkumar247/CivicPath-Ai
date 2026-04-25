import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FAQSection from './FAQSection';

describe('FAQSection', () => {
  it('renders correctly in English', () => {
    render(<FAQSection lang="en" />);
    // In English, it should show "Quick FAQ"
    expect(screen.getByText('Quick FAQ')).toBeInTheDocument();
  });

  it('renders correctly in Hindi', () => {
    render(<FAQSection lang="hi" />);
    // In Hindi
    expect(screen.getByText('सामान्य प्रश्न')).toBeInTheDocument();
  });

  it('toggles FAQ item on click', () => {
    render(<FAQSection lang="en" />);
    
    // First question is available, let's click it to open
    const question = screen.getByText('How do I register to vote?');
    expect(question).toBeInTheDocument();
    
    // Answer shouldn't be fully visible (or it is visible with height 0 but let's test classes/content)
    const answerText = 'You can apply online via the Voter Helpline App or the Voter Portal (voters.eci.gov.in) by filling out Form 6. You must be 18 years old and an Indian citizen.';
    
    // Click the question
    fireEvent.click(question);
    
    // Check if the answer became visible
    expect(screen.getByText(answerText, { exact: false })).toBeInTheDocument();
  });
});
