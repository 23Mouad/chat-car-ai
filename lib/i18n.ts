// ─── All UI translations ─────────────────────────────────────────────────────

export type Lang = "en" | "fr" | "ar" | "tr";

export const LANGS: { code: Lang; label: string; flag: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "EN", flag: "🇬🇧", dir: "ltr" },
  { code: "fr", label: "FR", flag: "🇫🇷", dir: "ltr" },
  { code: "ar", label: "AR", flag: "🇸🇦", dir: "rtl" },
  { code: "tr", label: "TR", flag: "🇹🇷", dir: "ltr" },
];

export const translations = {
  en: {
    dir: "ltr" as const,
    nav: {
      chat: "Chat",
      features: "Features",
      about: "About",
      startChatting: "Start Chatting",
    },
    hero: {
      badge: "AI-Powered Car Expert",
      title1: "Your AI co-pilot for",
      title2: "everything cars.",
      subtitle:
        "Ask about models, specs, buying advice, maintenance, EVs, or motorsport. Talk Cars knows cars inside out — powered by next-gen AI.",
      cta: "Start chatting",
      ctaSecondary: "See features",
    },
    empty: {
      greeting: "Hello there! 👋",
      subtitle: "I'm Talk Cars — your AI car expert. Ask me anything about cars!",
      pills: ["🏎️ Compare cars", "🔋 Best EVs", "💰 Find deals", "🔧 Fix it"],
    },
    langPicker: {
      title: "Choose Your Language",
      subtitle: "How would you like Talk Cars to speak?",
    },
    features: {
      heading: "Everything cars, nothing else.",
      subheading:
        "Talk Cars stays laser-focused on automotive topics — so every answer is genuinely useful.",
      items: [
        { title: "Compare Any Two Cars", desc: "Side-by-side specs, pricing, and real-world pros/cons in seconds." },
        { title: "Find Your Next Car", desc: "Tell me your budget, lifestyle, and needs — I'll find your perfect match." },
        { title: "Maintenance Advice", desc: "Get expert guidance on service intervals, common issues, and DIY fixes." },
        { title: "EV Deep Dives", desc: "Range anxiety, charging networks, battery health — all the EV answers." },
        { title: "Market & Pricing", desc: "Understand depreciation, resale value, and when to buy or sell." },
        { title: "Motorsport & History", desc: "F1, WRC, Le Mans, car culture — if it has wheels and a story, I know it." },
      ],
    },
    footer: {
      builtBy: "Built & Powered by",
      tagline:
        "Your trusted technology partner to transform your ideas into innovative digital solutions.",
      contact: "Contact Algorix",
      rights: "All rights reserved.",
      productOf: "Talk Cars is a product of",
      launchChat: "Launch Chat",
    },
    chat: {
      online: "Car Expert AI",
      newChat: "New conversation",
      history: "Open chat history",
      error: "Connection lost. Please try again.",
      errorDismiss: "Dismiss error",
    },
  },

  fr: {
    dir: "ltr" as const,
    nav: {
      chat: "Chat",
      features: "Fonctionnalités",
      about: "À propos",
      startChatting: "Commencer",
    },
    hero: {
      badge: "Expert Auto par IA",
      title1: "Votre co-pilote IA pour",
      title2: "tout ce qui est voitures.",
      subtitle:
        "Posez des questions sur les modèles, les specs, les conseils d'achat, l'entretien, les VE ou le sport auto. Talk Cars connaît les voitures sur le bout des doigts.",
      cta: "Commencer à chatter",
      ctaSecondary: "Voir les fonctionnalités",
    },
    empty: {
      greeting: "Bonjour ! 👋",
      subtitle: "Je suis Talk Cars — votre expert auto IA. Posez-moi n'importe quelle question sur les voitures !",
      pills: ["🏎️ Comparer", "🔋 Meilleurs VE", "💰 Bonnes affaires", "🔧 Réparations"],
    },
    langPicker: {
      title: "Choisissez votre langue",
      subtitle: "Comment souhaitez-vous que Talk Cars vous parle ?",
    },
    features: {
      heading: "Tout sur les voitures, rien d'autre.",
      subheading:
        "Talk Cars se concentre uniquement sur l'automobile — chaque réponse est vraiment utile.",
      items: [
        { title: "Comparez n'importe quelles voitures", desc: "Specs côte à côte, prix et avantages/inconvénients en secondes." },
        { title: "Trouvez votre prochaine voiture", desc: "Dites-moi votre budget et vos besoins — je trouverai le match parfait." },
        { title: "Conseils d'entretien", desc: "Intervalles de service, problèmes courants et réparations DIY." },
        { title: "Plongée VE", desc: "Autonomie, réseaux de recharge, santé de la batterie — toutes les réponses VE." },
        { title: "Marché & Prix", desc: "Comprendre la dépréciation, la valeur de revente et le bon moment d'achat." },
        { title: "Sport auto & Histoire", desc: "F1, WRC, Le Mans, culture auto — si ça a des roues, je le connais." },
      ],
    },
    footer: {
      builtBy: "Conçu & Propulsé par",
      tagline:
        "Votre partenaire technologique de confiance pour transformer vos idées en solutions digitales innovantes.",
      contact: "Contacter Algorix",
      rights: "Tous droits réservés.",
      productOf: "Talk Cars est un produit de",
      launchChat: "Lancer le chat",
    },
    chat: {
      online: "Expert Auto IA",
      newChat: "Nouvelle conversation",
      history: "Historique des chats",
      error: "Connexion perdue. Veuillez réessayer.",
      errorDismiss: "Fermer",
    },
  },

  ar: {
    dir: "rtl" as const,
    nav: {
      chat: "الدردشة",
      features: "المميزات",
      about: "عن التطبيق",
      startChatting: "ابدأ الدردشة",
    },
    hero: {
      badge: "خبير السيارات بالذكاء الاصطناعي",
      title1: "مساعدك الذكي لكل",
      title2: "ما يتعلق بالسيارات.",
      subtitle:
        "اسأل عن الموديلات، المواصفات، نصائح الشراء، الصيانة، السيارات الكهربائية، أو رياضة السيارات. Talk Cars يعرف السيارات من الداخل والخارج.",
      cta: "ابدأ المحادثة",
      ctaSecondary: "اكتشف المميزات",
    },
    empty: {
      greeting: "مرحباً! 👋",
      subtitle: "أنا Talk Cars — خبير السيارات الذكي. اسألني أي شيء عن السيارات!",
      pills: ["🏎️ مقارنة السيارات", "🔋 أفضل كهربائية", "💰 أفضل الصفقات", "🔧 إصلاح"],
    },
    langPicker: {
      title: "اختر لغتك",
      subtitle: "كيف تريد أن يتحدث معك Talk Cars؟",
    },
    features: {
      heading: "كل شيء عن السيارات، لا شيء غيرها.",
      subheading:
        "Talk Cars يركز حصرياً على موضوعات السيارات — لتكون كل إجابة مفيدة حقاً.",
      items: [
        { title: "قارن بين أي سيارتين", desc: "مواصفات جنباً إلى جنب، أسعار، ومزايا وعيوب في ثوانٍ." },
        { title: "اعثر على سيارتك القادمة", desc: "أخبرني بميزانيتك واحتياجاتك — سأجد لك التطابق المثالي." },
        { title: "نصائح الصيانة", desc: "إرشادات الخبراء حول مواعيد الخدمة والمشكلات الشائعة والإصلاحات." },
        { title: "تعمق في السيارات الكهربائية", desc: "قلق الشحن، شبكات الشحن، صحة البطارية — كل إجابات الكهربائية." },
        { title: "السوق والأسعار", desc: "افهم الاستهلاك، قيمة إعادة البيع، ومتى تشتري أو تبيع." },
        { title: "رياضة السيارات والتاريخ", desc: "F1، WRC، لومان، ثقافة السيارات — إذا كان له عجلات وقصة، أعرفه." },
      ],
    },
    footer: {
      builtBy: "مبني ومدعوم من",
      tagline:
        "شريكك التقني الموثوق لتحويل أفكارك إلى حلول رقمية مبتكرة وفعّالة.",
      contact: "تواصل مع Algorix",
      rights: "جميع الحقوق محفوظة.",
      productOf: "Talk Cars منتج من",
      launchChat: "فتح الدردشة",
    },
    chat: {
      online: "خبير السيارات الذكي",
      newChat: "محادثة جديدة",
      history: "سجل المحادثات",
      error: "انقطع الاتصال. حاول مرة أخرى.",
      errorDismiss: "إغلاق",
    },
  },

  tr: {
    dir: "ltr" as const,
    nav: {
      chat: "Sohbet",
      features: "Özellikler",
      about: "Hakkında",
      startChatting: "Sohbete Başla",
    },
    hero: {
      badge: "Yapay Zeka Araba Uzmanı",
      title1: "Arabalarla ilgili her şey için",
      title2: "yapay zeka co-pilotunuz.",
      subtitle:
        "Modeller, özellikler, satın alma tavsiyeleri, bakım, EV'ler veya motor sporları hakkında sorun. Talk Cars arabaları içten dışa biliyor.",
      cta: "Sohbete Başla",
      ctaSecondary: "Özellikleri Gör",
    },
    empty: {
      greeting: "Merhaba! 👋",
      subtitle: "Ben Talk Cars — yapay zeka araba uzmanınız. Arabalar hakkında her şeyi sorun!",
      pills: ["🏎️ Karşılaştır", "🔋 En İyi EV", "💰 Fırsatlar", "🔧 Tamir"],
    },
    langPicker: {
      title: "Dilinizi Seçin",
      subtitle: "Talk Cars sizinle nasıl konuşsun?",
    },
    features: {
      heading: "Her şey arabalar hakkında, başka hiçbir şey değil.",
      subheading:
        "Talk Cars yalnızca otomotiv konularına odaklanır — bu yüzden her cevap gerçekten faydalıdır.",
      items: [
        { title: "Herhangi İki Arabayı Karşılaştır", desc: "Yan yana özellikler, fiyatlar ve gerçek avantaj/dezavantajlar saniyeler içinde." },
        { title: "Sonraki Arabana Bul", desc: "Bütçeni ve ihtiyaçlarını söyle — mükemmel eşleşmeni bulacağım." },
        { title: "Bakım Tavsiyesi", desc: "Servis aralıkları, yaygın sorunlar ve kendin yap düzeltmeleri hakkında uzman rehberliği." },
        { title: "EV Derinlemesine", desc: "Menzil endişesi, şarj ağları, batarya sağlığı — tüm EV cevapları." },
        { title: "Piyasa ve Fiyatlandırma", desc: "Değer kaybı, yeniden satış değeri ve alım/satım zamanlamasını anlayın." },
        { title: "Motor Sporları ve Tarih", desc: "F1, WRC, Le Mans, araba kültürü — tekerlekleri ve hikayesi varsa, biliyorum." },
      ],
    },
    footer: {
      builtBy: "Tarafından Geliştirildi",
      tagline:
        "Fikirlerinizi yenilikçi dijital çözümlere dönüştürmek için güvenilir teknoloji ortağınız.",
      contact: "Algorix İletişim",
      rights: "Tüm hakları saklıdır.",
      productOf: "Talk Cars'ın bir ürünü",
      launchChat: "Sohbeti Başlat",
    },
    chat: {
      online: "Araba Uzmanı AI",
      newChat: "Yeni sohbet",
      history: "Sohbet geçmişi",
      error: "Bağlantı kesildi. Lütfen tekrar deneyin.",
      errorDismiss: "Kapat",
    },
  },
};

export interface Translations {
  dir: "ltr" | "rtl";
  nav: {
    chat: string;
    features: string;
    about: string;
    startChatting: string;
  };
  hero: {
    badge: string;
    title1: string;
    title2: string;
    subtitle: string;
    cta: string;
    ctaSecondary: string;
  };
  empty: {
    greeting: string;
    subtitle: string;
    pills: string[];
  };
  langPicker: {
    title: string;
    subtitle: string;
  };
  features: {
    heading: string;
    subheading: string;
    items: { title: string; desc: string }[];
  };
  footer: {
    builtBy: string;
    tagline: string;
    contact: string;
    rights: string;
    productOf: string;
    launchChat: string;
  };
  chat: {
    online: string;
    newChat: string;
    history: string;
    error: string;
    errorDismiss: string;
  };
}
