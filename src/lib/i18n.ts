export type Language = 'en' | 'hi' | 'ta';

export const DICTIONARY = {
  en: {
    heroTitle: "Your GPS for the Election",
    heroSub: "Democracy can be complicated. CivicPath simplifies the journey from registration to the ballot box.",
    readiness: "Your Readiness",
    signIn: "Sign In",
    navHome: "Voter Guide",
    navManifestos: "Local Manifestos",
    navAnalytics: "Analytics",
    navLearn: "Learning Hub",
    timelineTitle: "Election Timeline",
    jargonTitle: "Jargon-to-English",
    jargonSub: "AI-powered simple explanations.",
    faqTitle: "Quick FAQ",
    simulatorTitle: "My Voter ID Simulator",
    formFinderTitle: "ECI Form Finder",
    formFinderSub: "Tell us your situation, we'll find the form.",
    kycTitle: "Know Your Candidate (KYC)",
    inkIdTitle: "Ink & ID Checklist",
    dashboardTitle: "SVEEP Analytics Dashboard",
    disclaimer: "© 2024 CivicPath. Empowering voters. Verify with ECI."
  },
  hi: {
    heroTitle: "चुनाव के लिए आपका जीपीएस",
    heroSub: "लोकतंत्र जटिल हो सकता है। सिविकपाथ पंजीकरण से लेकर मतदान तक की यात्रा को सरल बनाता है।",
    readiness: "आपकी तैयारी",
    signIn: "साइन इन करें",
    navHome: "वोटर गाइड",
    navManifestos: "स्थानीय घोषणापत्र",
    navAnalytics: "एनालिटिक्स",
    navLearn: "लर्निंग हब",
    timelineTitle: "चुनाव की समयावधि",
    jargonTitle: "कठिन शब्दों का सरल अर्थ",
    jargonSub: "एआई-संचालित सरल स्पष्टीकरण।",
    faqTitle: "सामान्य प्रश्न",
    simulatorTitle: "मेरा वोटर आईडी",
    formFinderTitle: "ईसीआई फॉर्म फाइंडर",
    formFinderSub: "अपनी स्थिति बताएं, हम सही फॉर्म खोजेंगे।",
    kycTitle: "उम्मीदवार को जानें (KYC)",
    inkIdTitle: "स्याही और पहचान पत्र चेकलिस्ट",
    dashboardTitle: "संसाधन आवंटन डैशबोर्ड",
    disclaimer: "© 2024 सिविकपाथ। मतदाताओं को सशक्त बनाना। ECI से सत्यापित करें।"
  },
  ta: {
    heroTitle: "தேர்தலுக்கான உங்கள் ஜிபிஎஸ்",
    heroSub: "ஜனநாயகம் சிக்கலானதாக இருக்கலாம். பதிவு முதல் வாக்குச் சாவடி வரை உங்கள் பயணத்தை CivicPath எளிதாக்குகிறது.",
    readiness: "உங்கள் தயார்நிலை",
    signIn: "உள்நுழைய",
    navHome: "வாக்காளர் வழிகாட்டி",
    navManifestos: "உள்ளூர் வாக்குறுதிகள்",
    navAnalytics: "பகுப்பாய்வு",
    navLearn: "கற்றல் மையம்",
    timelineTitle: "தேர்தல் காலவரிசை",
    jargonTitle: "கடினமான வார்த்தைகளுக்கு விளக்கம்",
    jargonSub: "AI மூலம் எளிய விளக்கங்கள்.",
    faqTitle: "கேள்விகள்",
    simulatorTitle: "எனது வாக்காளர் அட்டை",
    formFinderTitle: "ECI படிவக் கண்டுபிடிப்பான்",
    formFinderSub: "உங்கள் நிலையைச் சொல்லுங்கள், சரியான படிவத்தைக் கண்டுபிடிப்போம்.",
    kycTitle: "வேட்பாளரைத் தெரிந்துகொள்ளுங்கள்",
    inkIdTitle: "மை மற்றும் அடையாள அட்டை சரிபார்ப்பு",
    dashboardTitle: "SVEEP பகுப்பாய்வு டேஷ்போர்டு",
    disclaimer: "© 2024 CivicPath. ECI உடன் சரிபார்க்கவும்."
  }
};

export function getTranslation(lang: Language, key: keyof typeof DICTIONARY.en) {
  return DICTIONARY[lang][key] || DICTIONARY['en'][key];
}
