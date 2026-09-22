import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    app_title: 'CYCLONE-X',
    tagline: 'From Forecast to Action Before Landfall.',
    prototype_badge: 'DISASTER OPS PLATFORM',
    disclaimer: 'Operational decision-support platform combining GEE Sentinel-1 SAR, IMD hydrodynamics, and Gemini reasoning.',
    command_centre: 'Command Center',
    impact_map: 'Impact GIS Map',
    evacuation_planner: 'Evacuation Planner',
    critical_infrastructure: 'Critical Infrastructure',
    scenario_simulator: 'Scenario Simulator',
    ai_briefing: 'AI Situation Brief',
    alert_centre: 'CAP Alert Center',
    historical_analysis: 'Historical Benchmark',
    data_methodology: 'Data & Provenance',
    status_label: 'Storm Status',
    lead_time: 'Est. Landfall',
    wind_sustained: 'Max Sustained Wind',
    pop_exposed: 'Population Exposed',
    assets_at_risk: 'Critical Assets at Risk',
    shelters_available: 'Shelters Available',
    roads_at_risk: 'Roads at Risk',
    generate_ai_briefing: 'Generate AI Briefing',
    simulated_dispatch: 'Simulated Dispatch Only',
    p0_action: 'Immediate Evacuation Required',
    rerouted_alert: 'REROUTED TO SAFE SHELTER',
    role_officer: 'District Emergency Officer',
    active_scenario: 'Cyclone Varuna (T-24h Scenario)',
  },
  hi: {
    app_title: 'CYCLONE-X',
    tagline: 'पूर्वानुमान से लैंडफॉल पूर्व त्वरित कार्रवाई।',
    prototype_badge: 'आपदा संचालन केंद्र',
    disclaimer: 'यह प्रणाली निर्णय समर्थन हेतु है। सभी निर्देश जिला नियंत्रण कक्ष द्वारा मान्य हैं।',
    command_centre: 'कमांड सेंटर',
    impact_map: 'प्रभाव जीआईएस मानचित्र',
    evacuation_planner: 'निकासी योजनाकार',
    critical_infrastructure: 'महत्वपूर्ण बुनियादी ढांचा',
    scenario_simulator: 'परिदृश्य सिम्युलेटर',
    ai_briefing: 'एआई स्थिति रिपोर्ट',
    alert_centre: 'सीएपी चेतावनी केंद्र',
    historical_analysis: 'ऐतिहासिक विश्लेषण',
    data_methodology: 'डेटा और पद्धति',
    status_label: 'तूफान की स्थिति',
    lead_time: 'अनुमानित लैंडफॉल',
    wind_sustained: 'अधिकतम निरंतर हवा',
    pop_exposed: 'प्रभावित जनसंख्या',
    assets_at_risk: 'जोखिम में महत्वपूर्ण संपत्तियां',
    shelters_available: 'उपलब्ध आश्रय',
    roads_at_risk: 'जोखिम में सड़कें',
    generate_ai_briefing: 'एआई ब्रीफिंग उत्पन्न करें',
    simulated_dispatch: 'केवल सिमुलेटेड प्रेषण',
    p0_action: 'तत्काल निकासी आवश्यक',
    rerouted_alert: 'सुरक्षित आश्रय की ओर पुनर्निर्देशित',
    role_officer: 'जिला आपातकालीन अधिकारी',
    active_scenario: 'चक्रवात वरुणा (T-24h परिदृश्य)',
  },
  bn: {
    app_title: 'সাইক্লোনশিল্ড এআই',
    tagline: 'পূর্বাভাস। সুরক্ষা। প্রতিক্রিয়া।',
    prototype_badge: 'প্রোটোটাইপ সিমুলেশন',
    disclaimer: 'এই প্রোটোটাইপটি সিদ্ধান্ত সহায়তার জন্য এবং অফিসিয়াল IMD/NDMA সতর্কতার বিকল্প নয়।',
    command_centre: 'কমান্ড সেন্টার',
    impact_map: 'ইমপ্যাক্ট ম্যাপ',
    evacuation_planner: 'স্থানান্তর পরিকল্পনাকারী',
    critical_infrastructure: 'গুরুত্বপূর্ণ পরিকাঠামো',
    scenario_simulator: 'দৃশ্যপট সিমুলেটর',
    ai_briefing: 'এআই ব্রিফিং',
    alert_centre: 'সতর্কতা কেন্দ্র',
    data_methodology: 'উপাত্ত ও পদ্ধতি',
    status_label: 'ঝড়ের অবস্থা',
    lead_time: 'ল্যান্ডফলের সময়',
    wind_sustained: 'সর্বোচ্চ বাতাসের গতি',
    pop_exposed: 'বিপদাপন্ন জনসংখ্যা',
    assets_at_risk: 'ঝুঁকিতে থাকা সম্পদ',
    shelters_available: 'উপলব্ধ আশ্রয়কেন্দ্র',
    roads_at_risk: 'ঝুঁকিপূর্ণ সড়ক',
    generate_ai_briefing: 'এআই ব্রিফিং তৈরি করুন',
    simulated_dispatch: 'শুধুমাত্র পরীক্ষামূলক প্রেরণ',
    p0_action: 'জরুরি স্থানান্তর প্রয়োজন',
    rerouted_alert: 'নিরাপদ আশ্রয়ে পাঠানো হয়েছে',
    role_officer: 'জেলা দুর্যোগ ব্যবস্থাপনা কর্মকর্তা',
    active_scenario: 'ঘূর্ণিঝড় বরুণ (T-24h দৃশ্যপট)',
  },
  or: {
    app_title: 'ସାଇକ୍ଲୋନସିଲ୍ଡ ଏଆଇ',
    tagline: 'ପୂର୍ବାନୁମାନ। ସୁରକ୍ଷା। ପ୍ରତିକ୍ରିୟା।',
    prototype_badge: 'ପ୍ରୋଟୋଟାଇପ୍ ସିମୁଲେସନ',
    disclaimer: 'ଏହି ପ୍ରୋଟୋଟାଇପ୍ କେବଳ ସହାୟତା ପାଇଁ ଏବଂ ସରକାରୀ IMD/NDMA ଚେତାବନୀର ବିକଳ୍ପ ନୁହେଁ।',
    command_centre: 'କମାଣ୍ଡ ସେଣ୍ଟର',
    impact_map: 'ପ୍ରଭାବ ମାନଚିତ୍ର',
    evacuation_planner: 'ସ୍ଥାନାନ୍ତର ଯୋଜନା',
    critical_infrastructure: 'ମୁଖ୍ୟ ଭିତ୍ତିଭୂମି',
    scenario_simulator: 'ସିମ୍ୟୁଲେଟର',
    ai_briefing: 'ଏଆଇ ବ୍ରିଫିଂ',
    alert_centre: 'ଆଲର୍ଟ ସେଣ୍ଟର',
    data_methodology: 'ତଥ୍ୟ ଓ ପଦ୍ଧତି',
    status_label: 'ବାତ୍ୟା ସ୍ଥିତି',
    lead_time: 'ସ୍ଥଳଭାଗ ଛୁଇଁବା ସମୟ',
    wind_sustained: 'ପବନର ବେଗ',
    pop_exposed: 'ବିପଦରେ ଥିବା ଜନସଂଖ୍ୟା',
    assets_at_risk: 'ବିପଦରେ ଥିବା ସମ୍ପତ୍ତି',
    shelters_available: 'ଉପଲବ୍ଧ ବାତ୍ୟା ଆଶ୍ରୟସ୍ଥଳୀ',
    roads_at_risk: 'ଜଳମଗ୍ନ ରାସ୍ତା',
    generate_ai_briefing: 'ଏଆଇ ବ୍ରିଫିଂ ପ୍ରସ୍ତୁତ କରନ୍ତୁ',
    simulated_dispatch: 'କେବଳ ପରୀକ୍ଷାମୂଳକ ପ୍ରେରଣ',
    p0_action: 'ତୁରନ୍ତ ସ୍ଥାନାନ୍ତର ଆବଶ୍ୟକ',
    rerouted_alert: 'ସୁରକ୍ଷିତ ଆଶ୍ରୟସ୍ଥଳୀକୁ ସ୍ଥାନାନ୍ତରିତ',
    role_officer: 'ଜିଲ୍ଲା ଜରୁରୀକାଳୀନ ଅଧିକାରୀ',
    active_scenario: 'ବାତ୍ୟା ବରୁଣ (T-24h ଦୃଶ୍ୟପଟ)',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
