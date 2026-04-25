export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Registration' | 'Polling' | 'Other';
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: '1',
    question: 'How do I register to vote?',
    answer: 'You can apply online via the Voter Helpline App or the Voter Portal (voters.eci.gov.in) by filling out Form 6. You must be 18 years old and an Indian citizen.',
    category: 'Registration'
  },
  {
    id: '2',
    question: 'What is an EPIC number?',
    answer: 'It is the Electors Photo Identity Card number, your unique 10-digit alphanumeric voter ID number. It is required to find your name on the electoral roll.',
    category: 'Registration'
  },
  {
    id: '3',
    question: 'Where is my polling booth?',
    answer: 'Your polling booth (Part Number) can be found using the ECI portal or Voter Helpline by searching with your EPIC number. Booths are usually open from 7:00 AM to 6:00 PM.',
    category: 'Polling'
  },
  {
    id: '4',
    question: 'What is a VVPAT?',
    answer: 'Voter Verifiable Paper Audit Trail (VVPAT) provides a printed slip showing the candidate and symbol you voted for. It is visible for 7 seconds behind a glass window before dropping into a sealed box.',
    category: 'Other'
  }
];

export interface Phase {
  id: number;
  title: string;
  description: string;
  details: string[];
}

export const ELECTION_PHASES: Phase[] = [
  {
    id: 1,
    title: 'Registration',
    description: 'Ensure your name is on the electoral roll.',
    details: [
      'Download the Voter Helpline App',
      'Fill Form 6 to register as a new voter',
      'Wait for your EPIC / Voter ID card'
    ]
  },
  {
    id: 2,
    title: 'Candidate Research',
    description: 'Know Your Candidate (KYC).',
    details: [
      'Download the ECI KYC App',
      'Review candidate criminal records & affidavits',
      'Understand the Model Code of Conduct'
    ]
  },
  {
    id: 3,
    title: 'Verification',
    description: 'Check your electoral roll status.',
    details: [
      'Verify details on the ECI portal',
      'Locate your exact Polling Station',
      'Note down your Part Number and Serial Number'
    ]
  },
  {
    id: 4,
    title: 'Polling Day',
    description: 'Cast your vote securely at the booth.',
    details: [
      'Take your EPIC or valid ID (Aadhaar, Passport)',
      'Press the button next to your chosen symbol on the EVM',
      'Verify via the VVPAT slip'
    ]
  }
];
