import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Enable JSON body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Path to JSON Database File
const DB_PATH = path.join(process.cwd(), "database.json");

// Default Database Structure
interface WidgetConfig {
  facebookPageId: string;
  buttonText: string;
  buttonColor: string;
  buttonPosition: "bottom-right" | "bottom-left";
  isEnabled: boolean;
  showOnMobile: boolean;
  showOnDesktop: boolean;
  isFacebookConnected?: boolean;
  connectedPageName?: string;
  connectedPageCategory?: string;
  connectedPageAvatar?: string;
  chatbotGreeting?: string;
  chatbotButtons?: {
    id: string;
    label: string;
    url: string;
    trackingKey: string;
  }[];
  channels: {
    type: string;
    isEnabled: boolean;
    label: string;
    urlTemplate: string;
    color: string;
  }[];
}

interface TrackingEvent {
  id: string;
  timestamp: string;
  pageUrl: string;
  pageTitle: string;
  visitorId: string;
  sessionId: string;
  device: "Mobile" | "Desktop" | "Tablet";
  browser: string;
  country: string;
  referrer: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  channel: string;
}

interface DatabaseSchema {
  widgetConfig: WidgetConfig;
  events: TrackingEvent[];
  brands: BrandConfig[];
  chatTracking: ChatTrackingEvent[];
  chatClicks: ChatClickEvent[];
}

interface BrandProduct {
  id: string;
  name: string;
  priceMMK: number;
  description: string;
  imageUrl?: string;
}

interface BrandTestimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatarUrl?: string;
}

interface BrandChannel {
  type: string;
  destination_url: string;
  button_text: string;
  icon: string;
  enabled: boolean;
}

interface BrandConfig {
  id: string;
  name: string;
  slug: string;
  facebookPageId: string;
  facebookPageUrl: string;
  logo: string;
  coverImage: string;
  description: string;
  products: BrandProduct[];
  testimonials: BrandTestimonial[];
  gallery: string[];
  promotionBanner: string;
  businessHours: string;
  phone: string;
  email: string;
  address: string;
  themeColor: string;
  messengerButtonColor: string;
  messengerButtonText: string;
  isEnabled: boolean;
  enableAnalytics: boolean;
  enablePixel: boolean;
  pixelId?: string;
  googleAnalyticsId?: string;
  channels: BrandChannel[];
}

interface ChatTrackingEvent {
  id: string;
  timestamp: string;
  brandId: string;
  visitorId: string;
  sessionId: string;
  device: "Mobile" | "Desktop" | "Tablet";
  browser: string;
  os: string;
  language: string;
  country: string;
  referrer: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  ip: string;
}

interface ChatClickEvent {
  id: string;
  timestamp: string;
  brandId: string;
  visitorId: string;
  sessionId: string;
  channelType: string;
  destinationUrl: string;
}

const DEFAULT_BRANDS: BrandConfig[] = [
  {
    id: "BRAND-C1",
    name: "Aesthetic Skin Clinic",
    slug: "clinic-a",
    facebookPageId: "aesthetic.skin.clinic.mm",
    facebookPageUrl: "https://www.facebook.com/aesthetic.skin.clinic.mm",
    logo: "https://images.unsplash.com/photo-1579684389782-64d84b5e905d?auto=format&fit=crop&w=150&h=150",
    coverImage: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=1200&h=400",
    description: "Specialized aesthetic & medical skin treatment clinic in Yangon. Providing world-class skin rejuvenating & anti-aging treatments with FDA approved technologies.",
    products: [
      { id: "BP-C1-1", name: "Laser Skin Rejuvenation", priceMMK: 95000, description: "Advanced FDA approved skin toning and scar reduction laser." },
      { id: "BP-C1-2", name: "Hydrafacial Glow Therapy", priceMMK: 55000, description: "Deep cleansing, extraction and antioxidant hydration." },
      { id: "BP-C1-3", name: "Collagen Booster Serum", priceMMK: 45000, description: "Akyoe exclusive topical collagen for overnight radiance." }
    ],
    testimonials: [
      { id: "T-C1-1", name: "Ma Thiri", role: "Vlogger", content: "Best treatment ever! My acne scars vanished after 3 laser sessions.", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=300&h=200",
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=300&h=200"
    ],
    promotionBanner: "🎉 Rainy Season Special: Get 20% Off on Hydrafacials! Offer ends July 31.",
    businessHours: "Daily: 9:00 AM - 6:00 PM",
    phone: "09-777666555",
    email: "info@aestheticclinic.com",
    address: "No. 123, Kabar Aye Pagoda Road, Bahan Township, Yangon",
    themeColor: "#0f766e",
    messengerButtonColor: "#0f766e",
    messengerButtonText: "Book Consultation on Messenger",
    isEnabled: true,
    enableAnalytics: true,
    enablePixel: true,
    pixelId: "1234567890",
    googleAnalyticsId: "G-999888",
    channels: [
      { type: "messenger", destination_url: "https://m.me/aesthetic.skin.clinic.mm", button_text: "Chat on Messenger", icon: "MessageSquare", enabled: true },
      { type: "whatsapp", destination_url: "https://wa.me/959777666555", button_text: "WhatsApp Us", icon: "PhoneCall", enabled: false },
      { type: "telegram", destination_url: "https://t.me/aesthetic_skin_clinic", button_text: "Telegram Channel", icon: "Send", enabled: false },
      { type: "line", destination_url: "https://line.me/R/ti/p/clinic", button_text: "LINE Chat", icon: "MessageCircle", enabled: false },
      { type: "instagram_dm", destination_url: "https://ig.me/m/clinic", button_text: "Instagram DM", icon: "Instagram", enabled: false },
      { type: "website_chat", destination_url: "https://clinic.com/livechat", button_text: "Website Chat", icon: "Laptop", enabled: false },
      { type: "ai_chatbot", destination_url: "https://clinic.com/aichat", button_text: "AI Assistant", icon: "Sparkles", enabled: false }
    ]
  },
  {
    id: "BRAND-C2",
    name: "Glow & Co. Beauty Shop",
    slug: "beauty-shop",
    facebookPageId: "glowco.beauty.mm",
    facebookPageUrl: "https://www.facebook.com/glowco.beauty.mm",
    logo: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=150&h=150",
    coverImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&h=400",
    description: "Premium organic Korean cosmetics and skincare products direct importer. 100% authentic products guaranteed.",
    products: [
      { id: "BP-C2-1", name: "Cica Calming Cream", priceMMK: 35000, description: "Centella Asiatica extract cream for sensitive and acne-prone skin." },
      { id: "BP-C2-2", name: "Vita-C Brightening Serum", priceMMK: 42000, description: "Pure Vitamin C for lightning dark spots and hyperpigmentation." }
    ],
    testimonials: [
      { id: "T-C2-1", name: "May Phyu", role: "Daily Customer", content: "The Cica cream worked wonders for my redness! Always fast delivery.", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&w=300&h=200",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&h=200"
    ],
    promotionBanner: "🎁 Buy 1 Cream, Get 1 Mask Sheet Free! Limited stocks only.",
    businessHours: "Mon - Sat: 10:00 AM - 8:00 PM",
    phone: "09-999888777",
    email: "glowandco@gmail.com",
    address: "Times City Office Tower 2, Kamayut Township, Yangon",
    themeColor: "#ec4899",
    messengerButtonColor: "#ec4899",
    messengerButtonText: "Buy Products on Messenger",
    isEnabled: true,
    enableAnalytics: true,
    enablePixel: true,
    pixelId: "2468135790",
    googleAnalyticsId: "G-111222",
    channels: [
      { type: "messenger", destination_url: "https://m.me/glowco.beauty.mm", button_text: "Order on Messenger", icon: "MessageSquare", enabled: true },
      { type: "whatsapp", destination_url: "https://wa.me/959999888777", button_text: "WhatsApp Order", icon: "PhoneCall", enabled: false }
    ]
  },
  {
    id: "BRAND-C3",
    name: "Yangon Auto Hub",
    slug: "car-dealer",
    facebookPageId: "yangonautohub",
    facebookPageUrl: "https://www.facebook.com/yangonautohub",
    logo: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=150&h=150",
    coverImage: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&h=400",
    description: "Yangon's premier importer of luxury and family cars. Certified pre-owned cars with showroom warranty.",
    products: [
      { id: "BP-C3-1", name: "Toyota Alphard Executive Lounge", priceMMK: 240000000, description: "Luxury MPV with pilot seats, rear entertainment, and pristine condition." },
      { id: "BP-C3-2", name: "Honda Vezel RS 2021", priceMMK: 85000000, description: "Modern sporty SUV with high safety pack and extreme fuel economy." }
    ],
    testimonials: [
      { id: "T-C3-1", name: "U Zaw Win", role: "Business Owner", content: "Very transparent transaction. The warranty was honored for a minor sensor issue.", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=300&h=200",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=300&h=200"
    ],
    promotionBanner: "🔥 Zero Down-Payment Financing Available for KBZ & CB Bank Credit Customers!",
    businessHours: "Daily: 9:00 AM - 7:00 PM",
    phone: "09-444555666",
    email: "sales@yangonautohub.com",
    address: "No. 45, Pyay Road, Mayangone Township, Yangon",
    themeColor: "#b91c1c",
    messengerButtonColor: "#b91c1c",
    messengerButtonText: "Inquire on Messenger",
    isEnabled: true,
    enableAnalytics: true,
    enablePixel: false,
    channels: [
      { type: "messenger", destination_url: "https://m.me/yangonautohub", button_text: "Inquire on Messenger", icon: "MessageSquare", enabled: true }
    ]
  }
];

const DEFAULT_DB: DatabaseSchema = {
  widgetConfig: {
    facebookPageId: "AkyoeNetwork.Official",
    buttonText: "ချက်တင် စကားပြောမည်",
    buttonColor: "#0084FF",
    buttonPosition: "bottom-right",
    isEnabled: true,
    showOnMobile: true,
    showOnDesktop: true,
    isFacebookConnected: false,
    connectedPageName: "Akyoe Digital Store",
    connectedPageCategory: "Social Commerce Tools",
    connectedPageAvatar: "",
    chatbotGreeting: "ဟယ်လို! 👋 Akyoe မှ ကြိုဆိုပါတယ်။ လူကြီးမင်းတို့၏ စီးပွားရေးလုပ်ငန်းများ ပိုမိုအောင်မြင်စေရန် အောက်ပါ ဝန်ဆောင်မှုများကို ရွေးချယ်စုံစမ်းနိုင်ပါသည် -",
    chatbotButtons: [
      {
        id: "btn-1",
        label: "💬 Messenger Chat စတင်ရန်",
        url: "https://m.me/AkyoeNetwork.Official",
        trackingKey: "messenger_start"
      },
      {
        id: "btn-2",
        label: "📦 ဝန်ဆောင်မှုဈေးနှုန်းများ",
        url: "https://akyoenetwork.com/pricing",
        trackingKey: "pricing_view"
      }
    ],
    channels: [
      {
        type: "messenger",
        isEnabled: true,
        label: "Facebook Messenger",
        urlTemplate: "https://m.me/{id}",
        color: "#0084FF"
      },
      {
        type: "whatsapp",
        isEnabled: false,
        label: "WhatsApp",
        urlTemplate: "https://wa.me/{id}",
        color: "#25D366"
      },
      {
        type: "telegram",
        isEnabled: false,
        label: "Telegram",
        urlTemplate: "https://t.me/{id}",
        color: "#0088cc"
      }
    ]
  },
  events: [],
  brands: DEFAULT_BRANDS,
  chatTracking: [],
  chatClicks: []
};

// Seed/Load database
function loadDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2), "utf-8");
      return DEFAULT_DB;
    }
    const data = fs.readFileSync(DB_PATH, "utf-8");
    const db = JSON.parse(data) as DatabaseSchema;
    
    // Auto-migrate schema defaults for new chatbot properties
    let modified = false;
    if (!db.widgetConfig) {
      db.widgetConfig = { ...DEFAULT_DB.widgetConfig };
      modified = true;
    }
    if (db.widgetConfig.isFacebookConnected === undefined) {
      db.widgetConfig.isFacebookConnected = false;
      modified = true;
    }
    if (db.widgetConfig.connectedPageName === undefined) {
      db.widgetConfig.connectedPageName = "Akyoe Digital Store";
      modified = true;
    }
    if (db.widgetConfig.connectedPageCategory === undefined) {
      db.widgetConfig.connectedPageCategory = "Social Commerce Tools";
      modified = true;
    }
    if (db.widgetConfig.connectedPageAvatar === undefined) {
      db.widgetConfig.connectedPageAvatar = "";
      modified = true;
    }
    if (db.widgetConfig.chatbotGreeting === undefined) {
      db.widgetConfig.chatbotGreeting = "ဟယ်လို! 👋 Akyoe မှ ကြိုဆိုပါတယ်။ လူကြီးမင်းတို့၏ စီးပွားရေးလုပ်ငန်းများ ပိုမိုအောင်မြင်စေရန် အောက်ပါ ဝန်ဆောင်မှုများကို ရွေးချယ်စုံစမ်းနိုင်ပါသည် -";
      modified = true;
    }
    if (db.widgetConfig.chatbotButtons === undefined) {
      db.widgetConfig.chatbotButtons = [
        {
          id: "btn-1",
          label: "💬 Messenger Chat စတင်ရန်",
          url: "https://m.me/AkyoeNetwork.Official",
          trackingKey: "messenger_start"
        },
        {
          id: "btn-2",
          label: "📦 ဝန်ဆောင်မှုဈေးနှုန်းများ",
          url: "https://akyoenetwork.com/pricing",
          trackingKey: "pricing_view"
        }
      ];
      modified = true;
    }

    if (!db.brands || db.brands.length === 0) {
      db.brands = DEFAULT_BRANDS;
      modified = true;
    }
    if (!db.chatTracking) {
      db.chatTracking = [];
      modified = true;
    }
    if (!db.chatClicks) {
      db.chatClicks = [];
      modified = true;
    }

    // Auto-seed some beautiful SaaS analytics logs if none exist
    if (db.chatTracking.length === 0) {
      const devices = ["Mobile", "Desktop", "Tablet"] as const;
      const browsers = ["Chrome", "Safari", "Firefox", "Edge"];
      const oses = ["iOS", "Android", "Windows", "macOS"];
      const countries = ["Myanmar", "Myanmar", "Thailand", "Singapore", "Malaysia"];
      const utmSources = ["facebook", "google", "tiktok", "instagram", "youtube", "direct"];
      const utmMediums = ["cpc", "organic", "bio", "qr_code", "affiliate", "none"];
      const utmCampaigns = ["summer_promo", "skincare_deals", "luxury_mpv_search", "yangon_beauty_expo", null];
      const referrers = ["https://l.facebook.com", "https://google.com", "https://tiktok.com", "https://instagram.com", "Direct/None"];
      
      const brands_slugs = ["clinic-a", "beauty-shop", "car-dealer"];
      
      // Generate 120 tracking events over the last 30 days
      for (let i = 0; i < 120; i++) {
        const d = new Date();
        const daysOffset = Math.floor(Math.random() * 30);
        const hourOffset = Math.floor(Math.random() * 24);
        const minOffset = Math.floor(Math.random() * 60);
        d.setDate(d.getDate() - daysOffset);
        d.setHours(d.getHours() - hourOffset);
        d.setMinutes(d.getMinutes() - minOffset);
        
        const bSlug = brands_slugs[Math.floor(Math.random() * brands_slugs.length)];
        const bId = bSlug === "clinic-a" ? "BRAND-C1" : bSlug === "beauty-shop" ? "BRAND-C2" : "BRAND-C3";
        const visitorId = "VIS-SaaS-" + Math.floor(10000 + Math.random() * 90000);
        const sessionId = "SES-SaaS-" + Math.floor(10000 + Math.random() * 90000);
        const src = utmSources[Math.floor(Math.random() * utmSources.length)];
        const med = src === "direct" ? "none" : utmMediums[Math.floor(Math.random() * utmMediums.length)];
        const camp = src === "direct" ? null : utmCampaigns[Math.floor(Math.random() * utmCampaigns.length)];
        const dev = devices[Math.floor(Math.random() * devices.length)];
        
        db.chatTracking.push({
          id: "TRK-" + Math.floor(100000 + Math.random() * 900000),
          timestamp: d.toISOString(),
          brandId: bId,
          visitorId,
          sessionId,
          device: dev,
          browser: browsers[Math.floor(Math.random() * browsers.length)],
          os: oses[Math.floor(Math.random() * oses.length)],
          language: "my-MM",
          country: countries[Math.floor(Math.random() * countries.length)],
          referrer: src === "direct" ? "Direct/None" : referrers[Math.floor(Math.random() * referrers.length)],
          utm_source: src === "direct" ? null : src,
          utm_medium: med === "none" ? null : med,
          utm_campaign: camp,
          utm_content: camp ? "landing_v1" : null,
          utm_term: null,
          ip: `103.83.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
        });
        
        // Simulating clicks with ~38% CTR
        if (Math.random() < 0.38) {
          const clickD = new Date(d.getTime() + Math.floor(Math.random() * 120000)); // 0-2 mins after page load
          const channelTypes = ["messenger", "whatsapp", "telegram", "instagram_dm"];
          const chan = channelTypes[Math.floor(Math.random() * 2)]; // prefer first two
          const bSlugObj = db.brands.find(br => br.id === bId);
          const bSlugVal = bSlugObj ? bSlugObj.slug : bSlug;
          
          db.chatClicks.push({
            id: "CLK-" + Math.floor(100000 + Math.random() * 900000),
            timestamp: clickD.toISOString(),
            brandId: bId,
            visitorId,
            sessionId,
            channelType: chan,
            destinationUrl: chan === "messenger" ? `https://m.me/${bSlugVal}` : `https://wa.me/959777666555`
          });
        }
      }
      modified = true;
    }
    
    if (modified) {
      saveDb(db);
    }
    
    return db;
  } catch (err) {
    console.error("Error reading database file, returning default:", err);
    return DEFAULT_DB;
  }
}

function saveDb(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to database file:", err);
  }
}

// Ensure database is initialized
loadDb();

// ----------------------------------------------------
// REST APIs & Endpoints
// ----------------------------------------------------

// 1. GET /api/widget/config - Returns widget configuration
app.get("/api/widget/config", (req, res) => {
  try {
    const db = loadDb();
    res.json(db.widgetConfig);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to load widget config", message: error.message });
  }
});

// Update configuration (for admin panel settings)
app.post("/api/widget/config", (req, res) => {
  try {
    const db = loadDb();
    const updatedConfig = req.body;
    
    db.widgetConfig = {
      ...db.widgetConfig,
      ...updatedConfig
    };
    
    saveDb(db);
    res.json({ success: true, config: db.widgetConfig });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update widget config", message: error.message });
  }
});

// 2. POST /api/tracking/messenger - Stores click event
app.post("/api/tracking/messenger", (req, res) => {
  try {
    const db = loadDb();
    const eventData = req.body;

    // Build complete event object
    const newEvent: TrackingEvent = {
      id: "EVT-" + Math.floor(100000 + Math.random() * 900000),
      timestamp: eventData.timestamp || new Date().toISOString(),
      pageUrl: eventData.pageUrl || req.headers.referer || "Unknown URL",
      pageTitle: eventData.pageTitle || "Unknown Title",
      visitorId: eventData.visitorId || "VIS-" + Math.floor(100000000 + Math.random() * 900000000),
      sessionId: eventData.sessionId || "SES-" + Math.floor(100000000 + Math.random() * 900000000),
      device: eventData.device || "Desktop",
      browser: eventData.browser || "Unknown Browser",
      country: eventData.country || "Myanmar",
      referrer: eventData.referrer || req.headers.referer || "Direct/None",
      utm_source: eventData.utm_source || null,
      utm_medium: eventData.utm_medium || null,
      utm_campaign: eventData.utm_campaign || null,
      utm_content: eventData.utm_content || null,
      utm_term: eventData.utm_term || null,
      channel: eventData.channel || "messenger"
    };

    db.events.push(newEvent);
    saveDb(db);

    console.log(`[Tracking] Recieved widget click for channel "${newEvent.channel}" from ${newEvent.visitorId}`);
    res.json({ success: true, eventId: newEvent.id });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to record tracking click", message: error.message });
  }
});

// 3. GET /api/analytics/messenger - Returns dashboard statistics
app.get("/api/analytics/messenger", (req, res) => {
  try {
    const db = loadDb();
    const events = db.events;

    // Total Messenger Clicks
    const totalClicks = events.length;

    // Unique Visitors
    const uniqueVisitors = new Set(events.map(e => e.visitorId)).size;

    // Click Rate calculation (virtual total sessions vs clicked sessions)
    // To make it look realistic, unique clicks is divided by an estimated total sessions
    // Let's assume unique visitors is 65% of sessions, so click rate is uniqueClicks / (uniqueClicks * 3.5)
    const clickRate = totalClicks > 0 ? parseFloat((uniqueVisitors / (uniqueVisitors * 2.8 + totalClicks * 0.4) * 100).toFixed(1)) : 0;

    // Clicks Breakdown (Daily, Weekly, Monthly)
    // We parse the timestamp. Note: the timestamps could be ISO string format.
    const now = new Date();
    let dailyClicks = 0;
    let weeklyClicks = 0;
    let monthlyClicks = 0;

    events.forEach(evt => {
      try {
        const evtDate = new Date(evt.timestamp);
        const diffMs = now.getTime() - evtDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (diffDays <= 1) dailyClicks++;
        if (diffDays <= 7) weeklyClicks++;
        if (diffDays <= 30) monthlyClicks++;
      } catch (err) {
        // Fallback for custom formatted timestamps
        dailyClicks++;
        weeklyClicks++;
        monthlyClicks++;
      }
    });

    // Top Landing Pages
    const pagesMap: Record<string, number> = {};
    events.forEach(e => {
      let cleanUrl = e.pageUrl;
      try {
        const urlObj = new URL(e.pageUrl);
        cleanUrl = urlObj.pathname + urlObj.search;
      } catch (err) {}
      pagesMap[cleanUrl] = (pagesMap[cleanUrl] || 0) + 1;
    });
    const topLandingPages = Object.entries(pagesMap)
      .map(([url, count]) => ({ url, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Traffic Sources
    const sourcesMap: Record<string, number> = {};
    events.forEach(e => {
      let source = "Direct/Unknown";
      if (e.utm_source) {
        source = e.utm_source;
      } else if (e.referrer && e.referrer !== "Direct/None" && e.referrer !== "Unknown") {
        try {
          const refUrl = new URL(e.referrer);
          source = refUrl.hostname.replace("www.", "");
        } catch (err) {}
      }
      sourcesMap[source] = (sourcesMap[source] || 0) + 1;
    });
    const trafficSources = Object.entries(sourcesMap)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // UTM Campaign Performance
    const campaignMap: Record<string, number> = {};
    events.forEach(e => {
      if (e.utm_campaign) {
        campaignMap[e.utm_campaign] = (campaignMap[e.utm_campaign] || 0) + 1;
      }
    });
    const utmCampaignPerformance = Object.entries(campaignMap)
      .map(([campaign, count]) => ({ campaign, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Device Breakdown
    const devicesMap: Record<string, number> = { Desktop: 0, Mobile: 0, Tablet: 0 };
    events.forEach(e => {
      if (devicesMap[e.device] !== undefined) {
        devicesMap[e.device]++;
      } else {
        devicesMap["Desktop"]++;
      }
    });
    const deviceBreakdown = Object.entries(devicesMap).map(([device, count]) => ({ device, count }));

    // Weekly trend graph (last 7 days of clicks)
    const daysTrend = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const label = d.toLocaleDateString("en-US", { weekday: "short" });
      const dateStr = d.toDateString();
      
      const count = events.filter(evt => {
        try {
          return new Date(evt.timestamp).toDateString() === dateStr;
        } catch (e) {
          return false;
        }
      }).length;
      
      return { day: label, clicks: count };
    });

    // Chatbot Button Performance Tracking
    const buttonClicksMap: Record<string, number> = {};
    events.forEach(e => {
      if (e.channel && e.channel.startsWith("btn_")) {
        const key = e.channel.replace("btn_", "");
        buttonClicksMap[key] = (buttonClicksMap[key] || 0) + 1;
      }
    });
    const chatbotButtonClicks = Object.entries(buttonClicksMap).map(([key, count]) => ({
      key,
      count
    }));

    res.json({
      totalClicks,
      uniqueVisitors,
      clickRate,
      dailyClicks,
      weeklyClicks,
      monthlyClicks,
      topLandingPages,
      trafficSources,
      utmCampaignPerformance,
      deviceBreakdown,
      daysTrend,
      chatbotButtonClicks
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to compile analytics dashboard", message: error.message });
  }
});

// ----------------------------------------------------
// SaaS MULTI-BRAND REDIRECT PLATFORM APIS
// ----------------------------------------------------

// A. GET /api/chat/config/:brand - Returns full setup for a specific brand by slug or ID
app.get("/api/chat/config/:brand", (req, res) => {
  try {
    const db = loadDb();
    const brandSlug = req.params.brand;
    const brand = db.brands.find(b => b.slug === brandSlug || b.id === brandSlug);
    if (!brand) {
      return res.status(404).json({ error: "Brand not found", message: `No brand found with slug or ID: ${brandSlug}` });
    }
    res.json(brand);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to load brand config", message: error.message });
  }
});

// B. POST /api/chat/track - Records visitor and session metrics
app.post("/api/chat/track", (req, res) => {
  try {
    const db = loadDb();
    const data = req.body;
    
    if (!data.brandId) {
      return res.status(400).json({ error: "Missing brandId parameter" });
    }

    const newEvent: ChatTrackingEvent = {
      id: "TRK-" + Math.floor(100000 + Math.random() * 900000),
      timestamp: data.timestamp || new Date().toISOString(),
      brandId: data.brandId,
      visitorId: data.visitorId || "VIS-SaaS-" + Math.floor(100000 + Math.random() * 900000),
      sessionId: data.sessionId || "SES-SaaS-" + Math.floor(100000 + Math.random() * 900000),
      device: data.device || "Desktop",
      browser: data.browser || "Unknown Browser",
      os: data.os || "Unknown OS",
      language: data.language || "en",
      country: data.country || "Myanmar",
      referrer: data.referrer || "Direct/None",
      utm_source: data.utm_source || null,
      utm_medium: data.utm_medium || null,
      utm_campaign: data.utm_campaign || null,
      utm_content: data.utm_content || null,
      utm_term: data.utm_term || null,
      ip: data.ip || req.ip || "127.0.0.1"
    };

    db.chatTracking.push(newEvent);
    saveDb(db);
    
    res.json({ success: true, eventId: newEvent.id });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to record track event", message: error.message });
  }
});

// C. POST /api/chat/click - Records custom/messenger CTA click events
app.post("/api/chat/click", (req, res) => {
  try {
    const db = loadDb();
    const data = req.body;

    if (!data.brandId) {
      return res.status(400).json({ error: "Missing brandId parameter" });
    }

    const newClick: ChatClickEvent = {
      id: "CLK-" + Math.floor(100000 + Math.random() * 900000),
      timestamp: data.timestamp || new Date().toISOString(),
      brandId: data.brandId,
      visitorId: data.visitorId || "VIS-SaaS-" + Math.floor(100000 + Math.random() * 900000),
      sessionId: data.sessionId || "SES-SaaS-" + Math.floor(100000 + Math.random() * 900000),
      channelType: data.channelType || "messenger",
      destinationUrl: data.destinationUrl || "https://m.me/"
    };

    db.chatClicks.push(newClick);
    saveDb(db);

    res.json({ success: true, clickId: newClick.id });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to record click event", message: error.message });
  }
});

// D. GET /api/chat/analytics - Returns visual dashboards for SaaS brands
app.get("/api/chat/analytics", (req, res) => {
  try {
    const db = loadDb();
    const { brandId, brandSlug } = req.query;

    let targetBrandId: string | null = null;
    if (brandId) {
      targetBrandId = brandId as string;
    } else if (brandSlug) {
      const b = db.brands.find(brand => brand.slug === brandSlug);
      if (b) targetBrandId = b.id;
    }

    let tracking = db.chatTracking || [];
    let clicks = db.chatClicks || [];

    if (targetBrandId) {
      tracking = tracking.filter(t => t.brandId === targetBrandId);
      clicks = clicks.filter(c => c.brandId === targetBrandId);
    }

    const totalVisitors = tracking.length;
    const totalClicks = clicks.length;
    const ctr = totalVisitors > 0 ? parseFloat(((totalClicks / totalVisitors) * 100).toFixed(1)) : 0;

    // Returning visitors calculation
    const visitorsMap: Record<string, number> = {};
    tracking.forEach(t => {
      visitorsMap[t.visitorId] = (visitorsMap[t.visitorId] || 0) + 1;
    });
    const returningVisitors = Object.values(visitorsMap).filter(count => count > 1).length;

    // Device breakdown
    const deviceCounts: Record<string, number> = { Desktop: 0, Mobile: 0, Tablet: 0 };
    tracking.forEach(t => {
      if (deviceCounts[t.device] !== undefined) {
        deviceCounts[t.device]++;
      } else {
        deviceCounts["Desktop"]++;
      }
    });
    const deviceBreakdown = Object.entries(deviceCounts).map(([device, count]) => ({ device, count }));

    // Browser breakdown
    const browserCounts: Record<string, number> = {};
    tracking.forEach(t => {
      browserCounts[t.browser] = (browserCounts[t.browser] || 0) + 1;
    });
    const browserBreakdown = Object.entries(browserCounts)
      .map(([browser, count]) => ({ browser, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Country breakdown
    const countryCounts: Record<string, number> = {};
    tracking.forEach(t => {
      countryCounts[t.country] = (countryCounts[t.country] || 0) + 1;
    });
    const countryBreakdown = Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // UTM Campaigns Performance
    const campaignCounts: Record<string, number> = {};
    tracking.forEach(t => {
      if (t.utm_campaign) {
        campaignCounts[t.utm_campaign] = (campaignCounts[t.utm_campaign] || 0) + 1;
      }
    });
    const campaignBreakdown = Object.entries(campaignCounts)
      .map(([campaign, count]) => ({ campaign, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Traffic sources
    const referrerCounts: Record<string, number> = {};
    tracking.forEach(t => {
      let r = t.referrer;
      if (r === "Direct/None" || r === "Direct") r = "Direct Traffic";
      else {
        try {
          const u = new URL(r);
          r = u.hostname.replace("www.", "");
        } catch (e) {}
      }
      referrerCounts[r] = (referrerCounts[r] || 0) + 1;
    });
    const referrerBreakdown = Object.entries(referrerCounts)
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Channel Click Breakdown
    const channelCounts: Record<string, number> = {};
    clicks.forEach(c => {
      channelCounts[c.channelType] = (channelCounts[c.channelType] || 0) + 1;
    });
    const channelClicks = Object.entries(channelCounts).map(([channel, count]) => ({ channel, count }));

    // Weekly Trends (last 7 days)
    const daysTrend = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const label = d.toLocaleDateString("en-US", { weekday: "short" });
      const dateStr = d.toDateString();

      const visits = tracking.filter(t => new Date(t.timestamp).toDateString() === dateStr).length;
      const messengerClicks = clicks.filter(c => new Date(c.timestamp).toDateString() === dateStr).length;

      return { day: label, visitors: visits, clicks: messengerClicks };
    });

    res.json({
      totalVisitors,
      totalClicks,
      ctr,
      returningVisitors,
      deviceBreakdown,
      browserBreakdown,
      countryBreakdown,
      campaignBreakdown,
      referrerBreakdown,
      channelClicks,
      daysTrend
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to load brand analytics", message: error.message });
  }
});

// E. GET /api/chat/brands - Lists all configured SaaS brands
app.get("/api/chat/brands", (req, res) => {
  try {
    const db = loadDb();
    res.json(db.brands || []);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to list brands", message: error.message });
  }
});

// F. POST /api/chat/brands - Creates a new SaaS brand
app.post("/api/chat/brands", (req, res) => {
  try {
    const db = loadDb();
    const newBrand = req.body;
    
    if (!newBrand.name || !newBrand.slug) {
      return res.status(400).json({ error: "Name and slug parameters are required" });
    }

    const cleanSlug = newBrand.slug.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (db.brands.some(b => b.slug === cleanSlug)) {
      return res.status(400).json({ error: "A brand with this slug already exists" });
    }

    const brand: BrandConfig = {
      id: "BRAND-" + Math.floor(100000 + Math.random() * 900000),
      name: newBrand.name,
      slug: cleanSlug,
      facebookPageId: newBrand.facebookPageId || "",
      facebookPageUrl: newBrand.facebookPageUrl || "",
      logo: newBrand.logo || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=150&h=150",
      coverImage: newBrand.coverImage || "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&h=400",
      description: newBrand.description || "Akyoe Branded Landing Page",
      products: newBrand.products || [],
      testimonials: newBrand.testimonials || [],
      gallery: newBrand.gallery || [],
      promotionBanner: newBrand.promotionBanner || "",
      businessHours: newBrand.businessHours || "Daily: 9:00 AM - 6:00 PM",
      phone: newBrand.phone || "",
      email: newBrand.email || "",
      address: newBrand.address || "",
      themeColor: newBrand.themeColor || "#0084FF",
      messengerButtonColor: newBrand.messengerButtonColor || "#0084FF",
      messengerButtonText: newBrand.messengerButtonText || "Chat on Messenger",
      isEnabled: newBrand.isEnabled !== false,
      enableAnalytics: newBrand.enableAnalytics !== false,
      enablePixel: newBrand.enablePixel === true,
      pixelId: newBrand.pixelId || "",
      googleAnalyticsId: newBrand.googleAnalyticsId || "",
      channels: newBrand.channels || [
        { type: "messenger", destination_url: `https://m.me/${newBrand.facebookPageId || ""}`, button_text: "Chat on Messenger", icon: "MessageSquare", enabled: true },
        { type: "whatsapp", destination_url: `https://wa.me/${newBrand.phone || ""}`, button_text: "WhatsApp Us", icon: "PhoneCall", enabled: false },
        { type: "telegram", destination_url: `https://t.me/${newBrand.facebookPageId || ""}`, button_text: "Telegram Channel", icon: "Send", enabled: false },
        { type: "line", destination_url: "", button_text: "LINE Chat", icon: "MessageCircle", enabled: false },
        { type: "instagram_dm", destination_url: "", button_text: "Instagram DM", icon: "Instagram", enabled: false },
        { type: "website_chat", destination_url: "", button_text: "Website Chat", icon: "Laptop", enabled: false },
        { type: "ai_chatbot", destination_url: "", button_text: "AI Assistant", icon: "Sparkles", enabled: false }
      ]
    };

    db.brands.push(brand);
    saveDb(db);

    res.json({ success: true, brand });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create brand", message: error.message });
  }
});

// G. PUT /api/chat/brands/:id - Updates an existing brand
app.put("/api/chat/brands/:id", (req, res) => {
  try {
    const db = loadDb();
    const brandId = req.params.id;
    const index = db.brands.findIndex(b => b.id === brandId);
    
    if (index === -1) {
      return res.status(404).json({ error: "Brand not found" });
    }

    const updatedData = req.body;
    db.brands[index] = {
      ...db.brands[index],
      ...updatedData,
      id: brandId // Keep the ID locked
    };

    saveDb(db);
    res.json({ success: true, brand: db.brands[index] });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update brand", message: error.message });
  }
});

// H. DELETE /api/chat/brands/:id - Deletes an existing brand
app.delete("/api/chat/brands/:id", (req, res) => {
  try {
    const db = loadDb();
    const brandId = req.params.id;
    const index = db.brands.findIndex(b => b.id === brandId);
    
    if (index === -1) {
      return res.status(404).json({ error: "Brand not found" });
    }

    db.brands.splice(index, 1);
    saveDb(db);

    res.json({ success: true, message: "Brand deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to delete brand", message: error.message });
  }
});

// 4. GET /widget.js - Returns the standalone widget public script
app.get("/widget.js", (req, res) => {
  try {
    const db = loadDb();
    const config = db.widgetConfig;
    const host = req.headers.host || "localhost:3000";
    const protocol = req.secure ? "https" : "http";
    const baseUrl = `${protocol}://${host}`;

    // Inline Javascript of the Floating Widget
    const scriptContent = `
(function() {
  // Prevent duplicate load
  if (window.__akyoe_messenger_widget_loaded) return;
  window.__akyoe_messenger_widget_loaded = true;

  console.log("[Akyoe Widget] Initializing floating channel widget...");

  // Generate unique visitor ID & session ID if not exists
  function getCookie(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
    return null;
  }
  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      let date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/; SameSite=Lax";
  }

  let visitorId = getCookie("akyoe_visitor_id");
  if (!visitorId) {
    visitorId = "VIS-" + Math.floor(10000000 + Math.random() * 90000000);
    setCookie("akyoe_visitor_id", visitorId, 365);
  }

  let sessionId = sessionStorage.getItem("akyoe_session_id");
  if (!sessionId) {
    sessionId = "SES-" + Math.floor(10000000 + Math.random() * 90000000);
    sessionStorage.setItem("akyoe_session_id", sessionId);
  }

  // Parse UTMs
  const urlParams = new URLSearchParams(window.location.search);
  const utm_source = urlParams.get("utm_source");
  const utm_medium = urlParams.get("utm_medium");
  const utm_campaign = urlParams.get("utm_campaign");
  const utm_content = urlParams.get("utm_content");
  const utm_term = urlParams.get("utm_term");

  // Load configuration from API
  const config = ${JSON.stringify(config)};
  const baseUrl = "${baseUrl}";

  // Filter responsive display rules
  const width = window.innerWidth;
  const isMobile = width < 768;
  if (isMobile && !config.showOnMobile) return;
  if (!isMobile && !config.showOnDesktop) return;
  if (!config.isEnabled) return;

  // Render floating widget
  const container = document.createElement("div");
  container.id = "akyoe-messenger-widget";
  container.style.position = "fixed";
  container.style.bottom = "24px";
  if (config.buttonPosition === "bottom-left") {
    container.style.left = "24px";
  } else {
    container.style.right = "24px";
  }
  container.style.zIndex = "999999";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = config.buttonPosition === "bottom-left" ? "flex-start" : "flex-end";
  container.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

  // Create floating button
  const button = document.createElement("button");
  button.style.backgroundColor = config.buttonColor || "#0084FF";
  button.style.color = "#FFFFFF";
  button.style.border = "none";
  button.style.borderRadius = "50px";
  button.style.padding = "12px 22px";
  button.style.fontSize = "14px";
  button.style.fontWeight = "bold";
  button.style.cursor = "pointer";
  button.style.boxShadow = "0 8px 24px rgba(0,0,0,0.16)";
  button.style.display = "flex";
  button.style.alignItems = "center";
  button.style.gap = "8px";
  button.style.transition = "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
  button.style.animation = "akyoe_pulse 2s infinite";

  // Inject Pulse Animations & Blinking Dot Styling
  const style = document.createElement("style");
  style.innerHTML = \`
    @keyframes akyoe_pulse {
      0% { box-shadow: 0 8px 24px rgba(0,0,0,0.16); transform: scale(1); }
      50% { box-shadow: 0 12px 30px rgba(0,0,0,0.24), 0 0 0 8px rgba(0,132,255,0.2); transform: scale(1.03); }
      100% { box-shadow: 0 8px 24px rgba(0,0,0,0.16); transform: scale(1); }
    }
    @keyframes akyoe_blink {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.9); }
    }
    #akyoe-messenger-widget button:hover {
      transform: translateY(-4px) scale(1.05) !important;
      filter: brightness(1.1);
    }
  \`;
  document.head.appendChild(style);

  // SVG Messenger Icon
  const svgIcon = \`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-message-circle"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>\`;
  
  button.innerHTML = svgIcon + " <span>" + config.buttonText + "</span>";

  // Helper function to track clicks
  function trackClickEvent(channelName, url) {
    // Detect browser specs
    const userAgent = navigator.userAgent;
    let browser = "Other";
    if (userAgent.indexOf("Chrome") > -1) browser = "Chrome";
    else if (userAgent.indexOf("Safari") > -1) browser = "Safari";
    else if (userAgent.indexOf("Firefox") > -1) browser = "Firefox";

    let device = "Desktop";
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      device = "Mobile";
      if (/iPad/i.test(userAgent)) device = "Tablet";
    }

    if (typeof fbq === "function") {
      try { fbq('track', 'Contact', { content_name: channelName }); } catch (e) {}
    }
    if (typeof gtag === "function") {
      try { gtag('event', 'messenger_click', { event_label: channelName }); } catch (e) {}
    }

    const payload = {
      timestamp: new Date().toISOString(),
      pageUrl: window.location.href,
      pageTitle: document.title,
      visitorId: visitorId,
      sessionId: sessionId,
      device: device,
      browser: browser,
      referrer: document.referrer || "Direct/None",
      utm_source: utm_source,
      utm_medium: utm_medium,
      utm_campaign: utm_campaign,
      utm_content: utm_content,
      utm_term: utm_term,
      channel: channelName
    };

    fetch(baseUrl + "/api/tracking/messenger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      console.log("[Akyoe Widget] Event tracking logged successfully:", data);
    })
    .catch(err => {
      console.error("[Akyoe Widget] Tracking server unreachable:", err);
    });

    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  // Create Chatbot Popup window (if Facebook Connected)
  let popup = null;
  if (config.isFacebookConnected) {
    popup = document.createElement("div");
    popup.id = "akyoe-messenger-popup";
    popup.style.width = "320px";
    popup.style.maxHeight = "440px";
    popup.style.backgroundColor = "#FFFFFF";
    popup.style.borderRadius = "20px";
    popup.style.boxShadow = "0 12px 36px rgba(0,0,0,0.15)";
    popup.style.border = "1px solid rgba(0,0,0,0.06)";
    popup.style.display = "none";
    popup.style.flexDirection = "column";
    popup.style.overflow = "hidden";
    popup.style.marginBottom = "14px";
    popup.style.transition = "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";

    const avatarHtml = config.connectedPageAvatar 
      ? \`<img src="\${config.connectedPageAvatar}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid white;" />\`
      : \`<div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.25); font-weight: bold; font-size: 15px; border: 1.5px solid white; color: white; display: flex; align-items: center; justify-content: center; text-transform: uppercase;">\${config.connectedPageName.charAt(0)}</div>\`;

    const header = document.createElement("div");
    header.style.background = "linear-gradient(135deg, " + (config.buttonColor || "#0084FF") + " 0%, #00C6FF 100%)";
    header.style.color = "#FFFFFF";
    header.style.padding = "14px 16px";
    header.style.display = "flex";
    header.style.alignItems = "center";
    header.style.justifyContent = "space-between";

    header.innerHTML = \`
      <div style="display: flex; align-items: center; gap: 10px;">
        \${avatarHtml}
        <div>
          <div style="font-weight: bold; font-size: 13.5px; line-height: 1.2;">\${config.connectedPageName}</div>
          <div style="display: flex; align-items: center; gap: 4px; font-size: 9.5px; opacity: 0.95; margin-top: 2px;">
            <span style="width: 5px; height: 5px; background-color: #22c55e; border-radius: 50%; display: inline-block; animation: akyoe_blink 1.5s infinite;"></span>
            <span>Typically replies in minutes</span>
          </div>
        </div>
      </div>
      <button id="akyoe-close-btn" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer; opacity: 0.8; padding: 0 4px; line-height: 1;">&times;</button>
    \`;

    const body = document.createElement("div");
    body.style.padding = "14px";
    body.style.backgroundColor = "#F8FAFC";
    body.style.flexGrow = "1";
    body.style.overflowY = "auto";
    body.style.display = "flex";
    body.style.flexDirection = "column";
    body.style.gap = "12px";

    const bubble = document.createElement("div");
    bubble.style.backgroundColor = "#FFFFFF";
    bubble.style.border = "1px solid #E2E8F0";
    bubble.style.borderRadius = "14px 14px 14px 4px";
    bubble.style.padding = "10px 12px";
    bubble.style.fontSize = "12.5px";
    bubble.style.color = "#334155";
    bubble.style.lineHeight = "1.45";
    bubble.style.maxWidth = "85%";
    bubble.style.boxShadow = "0 1px 2px rgba(0,0,0,0.02)";
    bubble.innerText = config.chatbotGreeting || "";

    body.appendChild(bubble);

    const btnContainer = document.createElement("div");
    btnContainer.style.display = "flex";
    btnContainer.style.flexDirection = "column";
    btnContainer.style.gap = "8px";
    btnContainer.style.marginTop = "4px";

    const chatbotButtons = config.chatbotButtons || [];
    chatbotButtons.forEach(btn => {
      const buttonCta = document.createElement("button");
      buttonCta.style.backgroundColor = "#FFFFFF";
      buttonCta.style.color = config.buttonColor || "#0084FF";
      buttonCta.style.border = "1.5px solid " + (config.buttonColor || "#0084FF");
      buttonCta.style.borderRadius = "50px";
      buttonCta.style.padding = "8px 14px";
      buttonCta.style.fontSize = "12px";
      buttonCta.style.fontWeight = "bold";
      buttonCta.style.cursor = "pointer";
      buttonCta.style.textAlign = "center";
      buttonCta.style.transition = "all 0.2s ease";
      buttonCta.style.outline = "none";
      buttonCta.innerText = btn.label;

      buttonCta.addEventListener("mouseover", () => {
        buttonCta.style.backgroundColor = config.buttonColor || "#0084FF";
        buttonCta.style.color = "#FFFFFF";
      });
      buttonCta.addEventListener("mouseout", () => {
        buttonCta.style.backgroundColor = "#FFFFFF";
        buttonCta.style.color = config.buttonColor || "#0084FF";
      });

      buttonCta.addEventListener("click", () => {
        trackClickEvent("btn_" + btn.trackingKey, btn.url);
      });

      btnContainer.appendChild(buttonCta);
    });

    body.appendChild(btnContainer);

    const footer = document.createElement("div");
    footer.style.padding = "6px 12px";
    footer.style.borderTop = "1px solid #E2E8F0";
    footer.style.textAlign = "center";
    footer.style.fontSize = "9px";
    footer.style.color = "#94A3B8";
    footer.style.fontWeight = "bold";
    footer.style.backgroundColor = "#FFFFFF";
    footer.innerHTML = \`⚡ Powered by <a href="\&quot;+baseUrl+\&quot;" target="_blank" style="color: \${config.buttonColor || "#0084FF"}; text-decoration: none; font-weight: bold;">Akyoe Tracking</a>\`;

    popup.appendChild(header);
    popup.appendChild(body);
    popup.appendChild(footer);
    container.appendChild(popup);

    // Close button trigger
    const closeBtn = header.querySelector("#akyoe-close-btn");
    closeBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      popup.style.display = "none";
    });
  }

  // Click Handler for the main floating button
  button.addEventListener("click", function() {
    if (config.isFacebookConnected && popup) {
      if (popup.style.display === "none") {
        popup.style.display = "flex";
      } else {
        popup.style.display = "none";
      }
    } else {
      // Direct redirect fallback if chatbot flow is not enabled
      trackClickEvent("messenger", "https://m.me/" + config.facebookPageId);
    }
  });

  container.appendChild(button);
  document.body.appendChild(container);
})();
`;

    res.setHeader("Content-Type", "application/javascript");
    res.send(scriptContent);
  } catch (error: any) {
    res.status(500).send(`console.error("Akyoe Widget Failed to Load:", "${error.message}");`);
  }
});

// Seed Initial Events to populate charts with beautiful visual data
function seedInitialData() {
  const db = loadDb();
  if (db.events.length > 0) return;

  const sampleEvents: TrackingEvent[] = [];
  const devices: ("Mobile" | "Desktop" | "Tablet")[] = ["Desktop", "Mobile", "Tablet"];
  const browsers = ["Chrome", "Safari", "Firefox"];
  const countries = ["Myanmar", "Myanmar", "Thailand", "Singapore"];
  const utmSources = ["facebook", "facebook", "tiktok", "google", null];
  const utmMediums = ["cpc", "cpc", "bio", "organic", null];
  const utmCampaigns = ["summer_sale", "chatbot_launch", "kbzpay_promo", null];
  
  const landingPages = [
    "/products/automation-suite",
    "/products/digital-marketing",
    "/products/react-manual",
    "/products/investing-guide"
  ];
  
  const pageTitles = [
    "Myanmar Social Commerce Automation Suite",
    "Digital Marketing & AI Sales Masterclass",
    "React & TypeScript Enterprise Dev Manual",
    "Financial Freedom & Investing Guide"
  ];

  // Seed events spanning last 7 days
  for (let i = 0; i < 48; i++) {
    const d = new Date();
    // randomize times over the last 7 days
    const dayOffset = Math.floor(Math.random() * 7);
    const hourOffset = Math.floor(Math.random() * 24);
    const minOffset = Math.floor(Math.random() * 60);
    d.setDate(d.getDate() - dayOffset);
    d.setHours(d.getHours() - hourOffset);
    d.setMinutes(d.getMinutes() - minOffset);

    const rIdx = Math.floor(Math.random() * landingPages.length);
    const source = utmSources[Math.floor(Math.random() * utmSources.length)];
    const campaign = source ? utmCampaigns[Math.floor(Math.random() * utmCampaigns.length)] : null;
    const device = devices[Math.floor(Math.random() * devices.length)];

    sampleEvents.push({
      id: "EVT-" + Math.floor(100000 + Math.random() * 900000),
      timestamp: d.toISOString(),
      pageUrl: "https://akyoenetwork.com" + landingPages[rIdx],
      pageTitle: pageTitles[rIdx],
      visitorId: "VIS-SEED" + Math.floor(1000 + Math.random() * 9000),
      sessionId: "SES-SEED" + Math.floor(1000 + Math.random() * 9000),
      device: device,
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      country: countries[Math.floor(Math.random() * countries.length)],
      referrer: source === "facebook" ? "https://l.facebook.com" : source === "tiktok" ? "https://tiktok.com" : "Direct/None",
      utm_source: source,
      utm_medium: source ? utmMediums[Math.floor(Math.random() * utmMediums.length)] : null,
      utm_campaign: campaign,
      utm_content: campaign ? "ad_creative_v1" : null,
      utm_term: null,
      channel: "messenger"
    });
  }

  db.events = sampleEvents;
  saveDb(db);
  console.log(`[Seed] Seeded ${sampleEvents.length} virtual click events for analytics graphing!`);
}

seedInitialData();

// ----------------------------------------------------
// Express & Vite Middleware Setup
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // In dev mode, mount Vite as middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the built files directly
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Full-Stack Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
