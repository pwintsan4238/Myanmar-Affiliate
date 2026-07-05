import React, { useState, useMemo } from "react";
import {
  BookOpen,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  Award,
  DollarSign,
  Download,
  Clock,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Search,
  Check,
  Plus,
  Trash2,
  Lock,
  Eye,
  Settings,
  Info,
  Layers,
  Sparkles,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Copy,
  PlusCircle,
  TrendingDown,
  UserCheck,
  FileText,
  CreditCard,
  ShoppingBag,
  Percent,
  BarChart3,
  GitMerge,
  Globe,
  Shuffle,
  Megaphone,
  Laptop,
  Activity,
  MessageSquare,
  Edit2,
  Play,
  Coins,
  Phone,
  Mail,
  MapPin,
  Palette,
  Link2,
  Building2,
  MessageCircle,
  Layout,
  Compass
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { BrandLandingPage } from "./components/BrandLandingPage";

// --- Types & Interfaces ---
interface Product {
  id: string;
  name: string;
  priceMMK: number;
  commissionPercent: number;
  category: string;
  authorId: string;
  authorName: string;
  gravityScore: number;  // ClickBank's signature metric
  avgSaleMMK: number;     // Average earnings per affiliate sale
  hasRebill: boolean;     // Recurring subscription product support
  rebillMMK?: number;
}

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  productId: string;
  productName: string;
  grossAmount: number;
  paymentMethod: "Credit_Card" | "PayPal" | "KBZPay_Direct_API" | "WavePay_Direct_API";
  status: "Completed" | "Refunded" | "Chargebacked";
  createdAt: string;
  affiliateId: string | null;
  jvSplitsApplied: boolean;
}

interface ClickRecord {
  id: string;
  productId: string;
  affiliateId: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  socialChannel: "Facebook" | "TikTok" | "Telegram" | "Direct";
  tid?: string; // Tracking ID parameter (TID)
}

interface JVContract {
  id: string;
  productId: string;
  partnerName: string;
  partnerRole: string; // e.g. "Copywriter", "Technical Advisor"
  payoutPercent: number; // Split percent of the Vendor's Net Share
}

interface AdCampaign {
  id: string;
  advertiserName: string;
  tier: "Basic" | "Premium" | "Diamond VIP";
  targetCategory: string;
  budgetMMK: number;
  durationDays: number;
  adLengthSec: 15 | 30 | 60;
  status: "Active" | "Pending" | "Completed";
  createdAt: string;
  adType?: "image" | "gif" | "video";
  mediaUrl?: string;
  placementArea?: "VIP Header" | "Sidebar Row" | "Redirection Interstitial";
  clicksCount?: number;
  impressionsCount?: number;
}

interface PayoutRecord {
  id: string;
  method: string;
  accountNo: string;
  accountName: string;
  amount: number;
  status: "Completed" | "Pending";
  timestamp: string;
}

// --- Initial Mock Data ---
const INITIAL_PRODUCTS: Product[] = [
  { 
    id: "PROD-001", 
    name: "Myanmar Social Commerce Automation Suite", 
    priceMMK: 95000, 
    commissionPercent: 50, 
    category: "Software", 
    authorId: "VEND-101", 
    authorName: "Ko Aung Thu",
    gravityScore: 84.5, 
    avgSaleMMK: 42750, 
    hasRebill: true, 
    rebillMMK: 15000 
  },
  { 
    id: "PROD-002", 
    name: "Digital Marketing & AI Sales Masterclass", 
    priceMMK: 45000, 
    commissionPercent: 60, 
    category: "Education", 
    authorId: "VEND-102", 
    authorName: "Ko Htin Kyaw",
    gravityScore: 124.2, 
    avgSaleMMK: 24300, 
    hasRebill: false 
  },
  { 
    id: "PROD-003", 
    name: "React & TypeScript Enterprise Dev Manual", 
    priceMMK: 60000, 
    commissionPercent: 55, 
    category: "eBook & Code", 
    authorId: "VEND-103", 
    authorName: "Pwint Phyu",
    gravityScore: 45.1, 
    avgSaleMMK: 29700, 
    hasRebill: false 
  },
  { 
    id: "PROD-004", 
    name: "Financial Freedom & Investing Guide (Myanmar)", 
    priceMMK: 20000, 
    commissionPercent: 75, 
    category: "Education", 
    authorId: "VEND-104", 
    authorName: "U Myint Naing",
    gravityScore: 92.8, 
    avgSaleMMK: 13500, 
    hasRebill: true, 
    rebillMMK: 5000 
  },
  {
    id: "PROD-005",
    name: "Myanmar Yoga & Mental Wellness Blueprint",
    priceMMK: 30000,
    commissionPercent: 65,
    category: "Health",
    authorId: "VEND-105",
    authorName: "Daw Hla Hla",
    gravityScore: 61.2,
    avgSaleMMK: 19500,
    hasRebill: false
  },
  {
    id: "PROD-006",
    name: "AI-Powered Chatbot & Customer Support Builder",
    priceMMK: 120000,
    commissionPercent: 50,
    category: "Software",
    authorId: "VEND-101",
    authorName: "Ko Aung Thu",
    gravityScore: 71.9,
    avgSaleMMK: 60000,
    hasRebill: true,
    rebillMMK: 25000
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-CB7761",
    customerId: "CUST-401",
    customerName: "Min Hein",
    customerEmail: "minhein@example.com",
    productId: "PROD-001",
    productName: "Myanmar Social Commerce Automation Suite",
    grossAmount: 95000,
    paymentMethod: "Credit_Card",
    status: "Completed",
    createdAt: "2026-07-02 06:15",
    affiliateId: "AFF-202",
    jvSplitsApplied: true
  },
  {
    id: "ORD-CB7762",
    customerId: "CUST-402",
    customerName: "Ma Thida Aye",
    customerEmail: "thida.aye@example.com",
    productId: "PROD-002",
    productName: "Digital Marketing & AI Sales Masterclass",
    grossAmount: 45000,
    paymentMethod: "KBZPay_Direct_API",
    status: "Completed",
    createdAt: "2026-07-02 07:05",
    affiliateId: "AFF-101",
    jvSplitsApplied: true
  },
  {
    id: "ORD-CB7759",
    customerId: "CUST-403",
    customerName: "Zayar Lynn",
    customerEmail: "zayar.lynn@example.com",
    productId: "PROD-003",
    productName: "React & TypeScript Enterprise Dev Manual",
    grossAmount: 60000,
    paymentMethod: "PayPal",
    status: "Completed",
    createdAt: "2026-07-01 14:22",
    affiliateId: "AFF-101",
    jvSplitsApplied: false
  }
];

const INITIAL_JV_CONTRACTS: JVContract[] = [
  { id: "JV-201", productId: "PROD-001", partnerName: "Ko Sai Htun", partnerRole: "Co-Author / Script Developer", payoutPercent: 15 },
  { id: "JV-202", productId: "PROD-001", partnerName: "Ma Thiri", partnerRole: "Marketing Copywriter", payoutPercent: 10 },
  { id: "JV-203", productId: "PROD-003", partnerName: "Htet Naing Linn", partnerRole: "TypeScript Technical Reviewer", payoutPercent: 20 }
];

const INITIAL_AD_CAMPAIGNS: AdCampaign[] = [
  {
    id: "AD-901",
    advertiserName: "Myanmar Tech Academy",
    tier: "Premium",
    targetCategory: "Education",
    budgetMMK: 150000,
    durationDays: 30,
    adLengthSec: 30,
    status: "Active",
    createdAt: "2026-07-02 08:00",
    adType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
    placementArea: "Redirection Interstitial",
    clicksCount: 145,
    impressionsCount: 3200
  },
  {
    id: "AD-902",
    advertiserName: "Yangon Books & Cafe",
    tier: "Basic",
    targetCategory: "eBook & Code",
    budgetMMK: 45000,
    durationDays: 14,
    adLengthSec: 15,
    status: "Active",
    createdAt: "2026-07-01 10:15",
    adType: "gif",
    mediaUrl: "https://media.giphy.com/media/3oKIPnAiaMCws8nruE/giphy.gif",
    placementArea: "Sidebar Row",
    clicksCount: 32,
    impressionsCount: 950
  },
  {
    id: "AD-903",
    advertiserName: "Aura Luxury MPV Imports",
    tier: "Diamond VIP",
    targetCategory: "All",
    budgetMMK: 350000,
    durationDays: 60,
    adLengthSec: 60,
    status: "Active",
    createdAt: "2026-07-03 01:20",
    adType: "video",
    mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-subway-station-with-neon-lights-42488-large.mp4",
    placementArea: "Redirection Interstitial",
    clicksCount: 210,
    impressionsCount: 4500
  }
];

export default function App() {
  // --- Path Routing Detection ---
  const pathname = window.location.pathname;
  const isChatRoute = pathname.startsWith("/chat/");
  const brandSlug = isChatRoute ? pathname.split("/chat/")[1] : null;

  if (isChatRoute && brandSlug) {
    return <BrandLandingPage brandSlug={brandSlug} onBackToPlatform={() => window.location.href = "/"} />;
  }

  // --- Layout State ---
  const [userRole, setUserRole] = useState<"affiliate" | "brand" | "sponsor">("affiliate");
  const [activeTab, setActiveTab] = useState<string>("marketplace");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // --- Brand Side States ---
  const [brandLandingUrl, setBrandLandingUrl] = useState("https://mybrand.com/landing");
  const [brandSelectedProd, setBrandSelectedProd] = useState("PROD-001");
  const [brandCustomAffiliate, setBrandCustomAffiliate] = useState("AFF-101");
  const [brandCustomTid, setBrandCustomTid] = useState("brand_campaign_fb");
  
  // Custom Product Form
  const [brandProdName, setBrandProdName] = useState("");
  const [brandProdPrice, setBrandProdPrice] = useState(65000);
  const [brandProdComm, setBrandProdComm] = useState(55);
  const [brandProdCat, setBrandProdCat] = useState("Software");
  const [brandProdRebill, setBrandProdRebill] = useState(false);
  const [brandProdRebillAmount, setBrandProdRebillAmount] = useState(15000);

  // Simulated Brand Pixel Event Logs
  const [pixelLogs, setPixelLogs] = useState<Array<{
    id: string;
    timestamp: string;
    eventType: "click" | "page_view" | "purchase";
    productId: string;
    affiliateId: string;
    tid?: string;
    details: string;
  }>>([
    { id: "PXL-001", timestamp: "2026-07-02 08:30:15", eventType: "click", productId: "PROD-001", affiliateId: "AFF-202", tid: "fb_ad_campaign_A", details: "Referral click detected from Facebook" },
    { id: "PXL-002", timestamp: "2026-07-02 08:30:18", eventType: "page_view", productId: "PROD-001", affiliateId: "AFF-202", tid: "fb_ad_campaign_A", details: "Landing Page Rendered: Cookies and LocalStorage saved successfully" },
    { id: "PXL-003", timestamp: "2026-07-02 08:32:00", eventType: "purchase", productId: "PROD-001", affiliateId: "AFF-202", tid: "fb_ad_campaign_A", details: "Order Complete! Paid 95,000 Ks. Commission of 42,750 Ks awarded to affiliate." },
  ]);

  // --- Myanmar User Guide States ---
  const [activeGuideTab, setActiveGuideTab] = useState<"affiliate" | "vendor" | "customer">("affiliate");
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [showCalcPresets, setShowCalcPresets] = useState<boolean>(false);
  const [showCookieSandbox, setShowCookieSandbox] = useState<boolean>(false);
  const [guideStep, setGuideStep] = useState<number>(0);

  // --- Simulation States ---
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [jvContracts, setJvContracts] = useState<JVContract[]>(INITIAL_JV_CONTRACTS);
  
  // Real-time Hop Click Analytics Tracker
  const [clickLogs, setClickLogs] = useState<ClickRecord[]>([
    { id: "HOP-98211", productId: "PROD-001", affiliateId: "AFF-202", ipAddress: "103.83.218.45", userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5...)", timestamp: "2026-07-02 05:45", socialChannel: "Facebook", tid: "fb_ad_campaign_A" },
    { id: "HOP-98212", productId: "PROD-002", affiliateId: "AFF-101", ipAddress: "103.25.12.112", userAgent: "Mozilla/5.0 (Linux; Android 13; SM-S901B...)", timestamp: "2026-07-02 06:30", socialChannel: "Telegram", tid: "tele_channel_crypto" },
    { id: "HOP-98213", productId: "PROD-003", affiliateId: "AFF-101", ipAddress: "103.25.12.112", userAgent: "Mozilla/5.0 (Linux; Android 13; SM-S901B...)", timestamp: "2026-07-01 13:10", socialChannel: "TikTok", tid: "tiktok_bio_link" }
  ]);

  // ClickBank Dashboard Financial Indicators
  const [networkBalances, setNetworkBalances] = useState({
    affiliateEarnings: 155350,
    vendorEarnings: 122400,
    jvPartnerPayouts: 18750,
    platformFeeAccrued: 13700,
    commercialTaxDue: 13700
  });

  // --- Live Sandbox Inputs ---
  const [selectedProductId, setSelectedProductId] = useState<string>("PROD-001");
  const [activeAffiliateInput, setActiveAffiliateInput] = useState<string>("AFF-101");
  const [activeTidInput, setActiveTidInput] = useState<string>("my_campaign_01");
  const [generatedHoplink, setGeneratedHoplink] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Instant Checkout Form variables
  const [checkoutName, setCheckoutName] = useState<string>("Maung Maung");
  const [checkoutEmail, setCheckoutEmail] = useState<string>("maungmaung@example.com");
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<"Credit_Card" | "PayPal" | "KBZPay_Direct_API" | "WavePay_Direct_API">("Credit_Card");
  const [cardNumber, setCardNumber] = useState<string>("4111 2222 3333 4444");
  const [cardExpiry, setCardExpiry] = useState<string>("12/28");
  const [cardCVV, setCardCVV] = useState<string>("123");
  
  // Additional simulated payment methods credentials
  const [paypalEmail, setPaypalEmail] = useState<string>("user@paypal.com");
  const [paypalPassword, setPaypalPassword] = useState<string>("••••••••");
  const [kbzPayPhone, setKbzPayPhone] = useState<string>("09777666555");
  const [kbzPayOtp, setKbzPayOtp] = useState<string>("123456");
  const [wavePayPhone, setWavePayPhone] = useState<string>("09999888777");
  const [wavePayOtp, setWavePayOtp] = useState<string>("654321");

  // Popup / Modal states
  const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState<boolean>(false);
  const [tempSelectedMethod, setTempSelectedMethod] = useState<"Credit_Card" | "PayPal" | "KBZPay_Direct_API" | "WavePay_Direct_API" | null>(null);

  // Compact Right Panel simulation tab state
  const [simulatorTab, setSimulatorTab] = useState<"hoplink" | "sales">("hoplink");
  const [affiliateSidebarTab, setAffiliateSidebarTab] = useState<"hoplink" | "ads" | "cookies" | "purchase">("hoplink");
  const [lastSimulatedPurchaseResult, setLastSimulatedPurchaseResult] = useState<any>(null);
  const [showSimulator, setShowSimulator] = useState<boolean>(true);
  const [isPromoting, setIsPromoting] = useState<boolean>(false);

  // Advanced Analytics Filtering / Date Simulation
  const [filterAffiliateId, setFilterAffiliateId] = useState<string>("AFF-101");

  // --- Affiliate Stats, Impressions, Clicks and Payout States ---
  const [adImpressions, setAdImpressions] = useState<number>(14250);
  const [adClicks, setAdClicks] = useState<number>(348);
  const [payoutAmountInput, setPayoutAmountInput] = useState<string>("");
  const [payoutMethodInput, setPayoutMethodInput] = useState<string>("KBZPay");
  const [payoutAccountNoInput, setPayoutAccountNoInput] = useState<string>("");
  const [payoutAccountNameInput, setPayoutAccountNameInput] = useState<string>("");
  const [payoutHistory, setPayoutHistory] = useState<PayoutRecord[]>([
    { id: "PAY-9101", method: "KBZPay", accountNo: "0977******3", accountName: "Sai Htun", amount: 45000, status: "Completed", timestamp: "2026-06-25 14:30" },
    { id: "PAY-9102", method: "WavePay", accountNo: "0996******8", accountName: "Sai Htun", amount: 30000, status: "Completed", timestamp: "2026-06-29 09:15" },
  ]);

  // --- Advertisements (Advertiser Portal & Creator Toggle) States ---
  const [allowAdvertisements, setAllowAdvertisements] = useState<boolean>(true);
  const [adCampaigns, setAdCampaigns] = useState<AdCampaign[]>(() => {
    const saved = localStorage.getItem("akyoe_ad_campaigns");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_AD_CAMPAIGNS;
      }
    }
    return INITIAL_AD_CAMPAIGNS;
  });
  const [newAdAdvertiserName, setNewAdAdvertiserName] = useState<string>("");
  const [newAdTier, setNewAdTier] = useState<"Basic" | "Premium" | "Diamond VIP">("Basic");
  const [newAdTargetCategory, setNewAdTargetCategory] = useState<string>("Software");
  const [newAdBudget, setNewAdBudget] = useState<number>(75000);
  const [newAdDuration, setNewAdDuration] = useState<number>(14);
  const [newAdLength, setNewAdLength] = useState<15 | 30 | 60>(30);
  const [newAdMediaType, setNewAdMediaType] = useState<"image" | "gif" | "video">("image");
  const [newAdMediaUrl, setNewAdMediaUrl] = useState<string>("");
  const [newAdPlacementArea, setNewAdPlacementArea] = useState<"VIP Header" | "Sidebar Row" | "Redirection Interstitial">("Redirection Interstitial");
  const [activeAdSimId, setActiveAdSimId] = useState<string>("AD-901");
  const [adPlaySecondsRemaining, setAdPlaySecondsRemaining] = useState<number>(30);
  const [isAdPlaying, setIsAdPlaying] = useState<boolean>(false);
  const [selectedAdCategories, setSelectedAdCategories] = useState<string[]>(["Any"]);

  // --- Manual Cookie Setter States ---
  const [manualCookieAffiliate, setManualCookieAffiliate] = useState("AFF-101");
  const [manualCookieProduct, setManualCookieProduct] = useState("PROD-001");
  const [manualCookieTid, setManualCookieTid] = useState("manual_override");

  // --- PPC Simulation States ---
  const [ppcRecentIps, setPpcRecentIps] = useState<string[]>([]);
  const [currentSimulatedIp, setCurrentSimulatedIp] = useState<string>("103.83.218.45");
  const [lastClickWasDuplicate, setLastClickWasDuplicate] = useState<boolean | null>(null);

  // --- SaaS Messenger Widget & Analytics States ---
  const [widgetSubTab, setWidgetSubTab] = useState<"settings" | "analytics">("settings");
  const [widgetConfig, setWidgetConfig] = useState({
    facebookPageId: "AkyoeNetwork.Official",
    buttonText: "ချက်တင် စကားပြောမည်",
    buttonColor: "#0084FF",
    buttonPosition: "bottom-right" as "bottom-right" | "bottom-left",
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
    ] as { id: string; label: string; url: string; trackingKey: string; }[]
  });
  const [widgetAnalytics, setWidgetAnalytics] = useState({
    totalClicks: 0,
    uniqueVisitors: 0,
    clickRate: 0,
    dailyClicks: 0,
    weeklyClicks: 0,
    monthlyClicks: 0,
    topLandingPages: [] as { url: string; count: number }[],
    trafficSources: [] as { source: string; count: number }[],
    utmCampaignPerformance: [] as { campaign: string; count: number }[],
    deviceBreakdown: [] as { device: string; count: number }[],
    daysTrend: [] as { day: string; clicks: number }[],
    chatbotButtonClicks: [] as { key: string; count: number }[],
  });
  const [isSavingWidget, setIsSavingWidget] = useState(false);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  // --- Simulated FB connection & Chatbot Builder states ---
  const [isFbConnectOpen, setIsFbConnectOpen] = useState(false);
  const [tempPageName, setTempPageName] = useState("Akyoe Digital Store");
  const [tempPageCategory, setTempPageCategory] = useState("E-commerce Business");
  const [tempPageAvatar, setTempPageAvatar] = useState("");
  const [isAddingButton, setIsAddingButton] = useState(false);
  const [newBtnLabel, setNewBtnLabel] = useState("");
  const [newBtnUrl, setNewBtnUrl] = useState("");
  const [newBtnTracking, setNewBtnTracking] = useState("");

  // Control floating widget chat bubble state in dashboard preview
  const [isPreviewChatOpen, setIsPreviewChatOpen] = useState(false);

  // --- Advertisement Countdown Timer ---
  React.useEffect(() => {
    if (!isAdPlaying) return;
    const interval = setInterval(() => {
      setAdPlaySecondsRemaining((prev) => {
        if (prev <= 1) {
          setIsAdPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isAdPlaying]);

  React.useEffect(() => {
    localStorage.setItem("akyoe_ad_campaigns", JSON.stringify(adCampaigns));
  }, [adCampaigns]);

  // --- SaaS Multi-Brand Platform States & API Handlers ---
  const [saasBrands, setSaasBrands] = useState<any[]>([]);
  const [selectedAnalyticsBrand, setSelectedAnalyticsBrand] = useState<string>("all");
  const [saasAnalyticsData, setSaasAnalyticsData] = useState<any>(null);
  const [isBrandFormOpen, setIsBrandFormOpen] = useState(false);
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);

  // Form states for Brand Landing Pages
  const [bName, setBName] = useState("");
  const [bSlug, setBSlug] = useState("");
  const [bFbId, setBFbId] = useState("");
  const [bFbUrl, setBFbUrl] = useState("");
  const [bLogo, setBLogo] = useState("");
  const [bCover, setBCover] = useState("");
  const [bDesc, setBDesc] = useState("");
  const [bPromo, setBPromo] = useState("");
  const [bHours, setBHours] = useState("Daily: 9:00 AM - 6:00 PM");
  const [bPhone, setBPhone] = useState("");
  const [bEmail, setBEmail] = useState("");
  const [bAddress, setBAddress] = useState("");
  const [bTheme, setBTheme] = useState("#0084FF");
  const [bPixelId, setBPixelId] = useState("");
  const [bGaId, setBGaId] = useState("");

  const fetchSaasBrands = async () => {
    try {
      const res = await fetch("/api/chat/brands");
      if (res.ok) {
        const data = await res.json();
        setSaasBrands(data);
      }
    } catch (err) {
      console.error("Error loading SaaS brands:", err);
    }
  };

  const fetchSaasAnalytics = async (brandIdOrSlug?: string) => {
    try {
      let url = "/api/chat/analytics";
      if (brandIdOrSlug && brandIdOrSlug !== "all") {
        url += `?brandId=${brandIdOrSlug}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setSaasAnalyticsData(data);
      }
    } catch (err) {
      console.error("Error loading SaaS analytics:", err);
    }
  };

  // --- SaaS Messenger API Integration Functions ---
  const fetchWidgetConfig = async () => {
    try {
      const res = await fetch("/api/widget/config");
      if (res.ok) {
        const data = await res.json();
        setWidgetConfig(data);
      }
    } catch (err) {
      console.error("Error fetching widget config:", err);
    }
  };

  const fetchWidgetAnalytics = async () => {
    setIsLoadingAnalytics(true);
    try {
      const res = await fetch("/api/analytics/messenger");
      if (res.ok) {
        const data = await res.json();
        setWidgetAnalytics(data);
      }
    } catch (err) {
      console.error("Error fetching widget analytics:", err);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  const saveWidgetSettings = async (updatedSettings: typeof widgetConfig) => {
    setIsSavingWidget(true);
    try {
      const res = await fetch("/api/widget/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedSettings)
      });
      if (res.ok) {
        const data = await res.json();
        setWidgetConfig(data.config);
        // Refresh analytics as settings might alter display state
        fetchWidgetAnalytics();
        return true;
      }
    } catch (err) {
      console.error("Error saving widget settings:", err);
    } finally {
      setIsSavingWidget(false);
    }
    return false;
  };

  // Sync widget configuration & analytics on mount and active role/tab changes
  React.useEffect(() => {
    fetchWidgetConfig();
    fetchWidgetAnalytics();
    if (activeTab === "saas-landing-pages") {
      fetchSaasBrands();
    } else if (activeTab === "saas-analytics") {
      fetchSaasBrands();
      fetchSaasAnalytics(selectedAnalyticsBrand);
    }
  }, [activeTab, selectedAnalyticsBrand]);

  const handleMessengerWidgetClick = async () => {
    if (widgetConfig.isFacebookConnected) {
      setIsPreviewChatOpen(!isPreviewChatOpen);
      return;
    }

    const userAgent = navigator.userAgent;
    let browser = "Other";
    if (userAgent.indexOf("Chrome") > -1) browser = "Chrome";
    else if (userAgent.indexOf("Safari") > -1) browser = "Safari";
    else if (userAgent.indexOf("Firefox") > -1) browser = "Firefox";

    let device: "Desktop" | "Mobile" | "Tablet" = "Desktop";
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      device = "Mobile";
      if (/iPad/i.test(userAgent)) device = "Tablet";
    }

    const payload = {
      timestamp: new Date().toISOString(),
      pageUrl: window.location.href,
      pageTitle: document.title,
      visitorId: "VIS-" + Math.floor(100000 + Math.random() * 900000),
      sessionId: "SES-" + Math.floor(100000 + Math.random() * 900000),
      device,
      browser,
      country: "Myanmar",
      referrer: document.referrer || "Direct/None",
      utm_source: "in_app_preview",
      utm_medium: "float_button",
      utm_campaign: "organic_test",
      channel: "messenger"
    };

    try {
      const res = await fetch("/api/tracking/messenger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchWidgetAnalytics();
        alert(`⚡ Messenger Click Fired & Logged!\n\n• Metadata Captured!\n• Auto-detected Meta Pixel and GA4 if installed.\n• Redirecting to Messenger link: https://m.me/${widgetConfig.facebookPageId}`);
      }
    } catch (err) {
      console.error("Failed to trace preview widget click", err);
    }

    window.open(`https://m.me/${widgetConfig.facebookPageId}`, "_blank", "noopener,noreferrer");
  };

  const handlePreviewChatbotButtonClick = async (trackingKey: string, url: string) => {
    const userAgent = navigator.userAgent;
    let browser = "Other";
    if (userAgent.indexOf("Chrome") > -1) browser = "Chrome";
    else if (userAgent.indexOf("Safari") > -1) browser = "Safari";
    else if (userAgent.indexOf("Firefox") > -1) browser = "Firefox";

    let device: "Desktop" | "Mobile" | "Tablet" = "Desktop";
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      device = "Mobile";
      if (/iPad/i.test(userAgent)) device = "Tablet";
    }

    const payload = {
      timestamp: new Date().toISOString(),
      pageUrl: window.location.href,
      pageTitle: document.title,
      visitorId: "VIS-PREVIEW-" + Math.floor(10000 + Math.random() * 90000),
      sessionId: "SES-PREVIEW-" + Math.floor(10000 + Math.random() * 90000),
      device,
      browser,
      country: "Myanmar",
      referrer: document.referrer || "Direct/None",
      utm_source: "in_app_preview",
      utm_medium: "chatbot_button",
      utm_campaign: "tracking_sandbox",
      channel: "btn_" + trackingKey
    };

    try {
      const res = await fetch("/api/tracking/messenger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchWidgetAnalytics();
        alert(`🎯 Chatbot Button Click Traced & Recorded!\n\n• Captured Event: "${trackingKey}"\n• Logged as: "btn_${trackingKey}"\n• This maps instantly on your Analytics sub-tab!\n• Opening Destination: ${url}`);
      }
    } catch (err) {
      console.error("Failed to trace preview button click", err);
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Joint Venture Contract Creation Forms
  const [newJvProduct, setNewJvProduct] = useState<string>("PROD-001");
  const [newJvPartner, setNewJvPartner] = useState<string>("");
  const [newJvRole, setNewJvRole] = useState<string>("");
  const [newJvPercent, setNewJvPercent] = useState<number>(10);

  // --- Commission & Split Calculator variables (Configurable Tab) ---
  const [calcPrice, setCalcPrice] = useState<number>(75000);
  const [calcCommission, setCalcCommission] = useState<number>(50);
  const [calcPlatformFeePercent, setCalcPlatformFeePercent] = useState<number>(7.5); // ClickBank standard: ~7.5% + $1
  const [calcTaxPercent, setCalcTaxPercent] = useState<number>(5); // 5% Myanmar Commercial Tax

  // --- Computations for Splits ---
  const computedSplit = useMemo(() => {
    const gross = calcPrice;
    const commercialTax = Math.round(gross * (calcTaxPercent / 100));
    const platformFee = Math.round(gross * (calcPlatformFeePercent / 100)) + 1500; // Flat fee component of 1,500 Ks (~$0.70 USD)
    
    // Remaining Pool for Splits
    const netPool = gross - platformFee - commercialTax;
    
    // Affiliate Share (Percent of the remaining Net Pool)
    const affiliateShare = Math.round(netPool * (calcCommission / 100));
    const vendorShareBase = netPool - affiliateShare;

    // Joint Venture contract splits (if any exist for calculated sample product)
    const associatedJV = jvContracts.filter(j => j.productId === selectedProductId);
    const jvSplits = associatedJV.map(j => {
      const share = Math.round(vendorShareBase * (j.payoutPercent / 100));
      return {
        partnerName: j.partnerName,
        role: j.partnerRole,
        percent: j.payoutPercent,
        amount: share
      };
    });

    const totalJvPayout = jvSplits.reduce((sum, j) => sum + j.amount, 0);
    const netVendorShare = vendorShareBase - totalJvPayout;

    return {
      gross,
      commercialTax,
      platformFee,
      netPool,
      affiliateShare,
      vendorShareBase,
      jvSplits,
      totalJvPayout,
      netVendorShare
    };
  }, [calcPrice, calcCommission, calcPlatformFeePercent, calcTaxPercent, jvContracts, selectedProductId]);

  // --- Selected Product Details Helper ---
  const activeProduct = useMemo(() => {
    return products.find(p => p.id === selectedProductId) || products[0];
  }, [selectedProductId, products]);

  // --- Filtered Products for Marketplace ---
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // --- ClickBank Signature Calculations ---
  // Gravity score rises on active sales, falls over time.
  const topProduct = useMemo(() => {
    return [...products].sort((a, b) => b.gravityScore - a.gravityScore)[0];
  }, [products]);

  // Advanced Stats
  const conversionRatePercent = useMemo(() => {
    const hops = clickLogs.length;
    const completedSales = orders.filter(o => o.status === "Completed").length;
    if (hops === 0) return 0;
    return parseFloat(((completedSales / hops) * 100).toFixed(1));
  }, [clickLogs, orders]);

  const epcMMK = useMemo(() => {
    const hops = clickLogs.length;
    const totalAffEarnings = orders
      .filter(o => o.status === "Completed")
      .reduce((sum, o) => {
        const p = products.find(prod => prod.id === o.productId) || products[0];
        const netPool = o.grossAmount - (o.grossAmount * 0.075 + 1500) - (o.grossAmount * 0.05);
        const share = Math.round(netPool * (p.commissionPercent / 100));
        return sum + (o.affiliateId ? share : 0);
      }, 0);
    if (hops === 0) return 0;
    return Math.round(totalAffEarnings / hops);
  }, [clickLogs, orders, products]);

  // --- Handlers ---
  const handleGenerateHoplink = (productId: string, affiliate: string) => {
    const cleanAff = affiliate.trim().toUpperCase() || "AFFILIATE";
    const cleanTid = activeTidInput.trim() ? `&tid=${encodeURIComponent(activeTidInput.trim())}` : "";
    const link = `https://hop.akyoe.com/?affiliate=${cleanAff}&vendor=${productId}${cleanTid}`;
    setGeneratedHoplink(link);
    setCopiedLink(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedHoplink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSetManualCookie = (affId: string, prodId: string, tidVal: string) => {
    const cleanAff = affId.trim().toUpperCase() || "AFF-101";
    const cleanTid = tidVal.trim() || undefined;
    const prod = products.find(p => p.id === prodId) || products[0];

    const hopId = `HOP-${Math.floor(10000 + Math.random() * 90000)}`;
    const newHop: ClickRecord = {
      id: hopId,
      productId: prodId,
      affiliateId: cleanAff,
      ipAddress: "127.0.0.1 (Manual Overwrite)",
      userAgent: "Mozilla/5.0 (Manual Cookie Setter)",
      timestamp: new Date().toLocaleTimeString(),
      socialChannel: "Direct",
      tid: cleanTid
    };

    setClickLogs(prev => [newHop, ...prev]);

    const newPixelLog = {
      id: `PXL-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toLocaleTimeString(),
      eventType: "click" as const,
      productId: prodId,
      affiliateId: cleanAff,
      tid: cleanTid,
      details: `🍪 Manual Cookie Set: Affiliate "${cleanAff}" has been tracked for product "${prod.name}".`
    };
    setPixelLogs(prev => [newPixelLog, ...prev]);

    try {
      localStorage.setItem(`akyoe_aff_cookie_${prodId}`, JSON.stringify({ affiliateId: cleanAff, tid: cleanTid, timestamp: Date.now() }));
    } catch (e) {
      console.warn(e);
    }

    alert(`🍪 Virtual Affiliate Cookie Injected!\n\n• Product: ${prod.name}\n• Affiliate ID: ${cleanAff}\n• Campaign ID (TID): ${cleanTid || "None"}\n\nAny test purchases of this product in the sandbox will now credit this affiliate with a commission split!`);
  };

  const handleClearAllCookies = () => {
    setClickLogs([]);
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith("akyoe_aff_cookie_")) {
          localStorage.removeItem(key);
        }
      }
    } catch (e) {}
    alert("🧹 Stored affiliate tracking cookies and visitor logs have been cleared successfully.");
  };

  const handleTriggerHopClick = () => {
    const hopId = `HOP-${Math.floor(10000 + Math.random() * 90000)}`;
    const socialChannels: ClickRecord["socialChannel"][] = ["Facebook", "TikTok", "Telegram", "Direct"];
    const randomSocial = socialChannels[Math.floor(Math.random() * socialChannels.length)];
    
    const newHop: ClickRecord = {
      id: hopId,
      productId: selectedProductId,
      affiliateId: activeAffiliateInput.trim().toUpperCase() || "AFF-101",
      ipAddress: `103.${Math.floor(20 + Math.random() * 80)}.${Math.floor(10 + Math.random() * 200)}.${Math.floor(1 + Math.random() * 254)}`,
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5...)",
      timestamp: new Date().toLocaleTimeString(),
      socialChannel: randomSocial,
      tid: activeTidInput.trim() || undefined
    };

    setClickLogs(prev => [newHop, ...prev]);

    // Anti-Fraud Checks (ClickBank-style Self-Buying block)
    if (newHop.affiliateId === "AFF-101" && checkoutEmail === "affiliate101@example.com") {
      alert("ClickBank Fraud Alert: System detected Affiliate (AFF-101) attempting self-purchase simulation. Commision splits will automatically default to 0% to prevent self-buy discount abuse.");
    }
  };

  const handleSimulatePurchase = () => {
    // Determine affiliate tracking
    const lastMatchingHop = clickLogs.find(h => h.productId === selectedProductId);
    const affiliateId = lastMatchingHop ? lastMatchingHop.affiliateId : null;

    // Calculate Platform Split Logic
    const p = products.find(prod => prod.id === selectedProductId) || products[0];
    const gross = p.priceMMK;
    const tax = Math.round(gross * 0.05); // 5% Commercial Tax
    const platformFee = Math.round(gross * 0.075) + 1500; // ClickBank style 7.5% + 1500 Ks
    const netPool = gross - platformFee - tax;

    // Affiliate Commission
    const affCommissionAmount = affiliateId ? Math.round(netPool * (p.commissionPercent / 100)) : 0;
    const vendorBase = netPool - affCommissionAmount;

    // JV splits
    const associatedJV = jvContracts.filter(j => j.productId === selectedProductId);
    let totalJvPayout = 0;
    associatedJV.forEach(j => {
      const share = Math.round(vendorBase * (j.payoutPercent / 100));
      totalJvPayout += share;
    });

    const netVendor = vendorBase - totalJvPayout;

    // Anti-Fraud mitigation: Self-buying validation
    const finalAffiliate = (affiliateId === "AFF-101" && checkoutEmail === "affiliate101@example.com") ? null : affiliateId;
    const finalAffShare = finalAffiliate ? affCommissionAmount : 0;
    const finalNetVendor = finalAffiliate ? netVendor : (vendorBase + affCommissionAmount - totalJvPayout);

    // Create ClickBank Automated Order ID
    const orderId = `ORD-CB${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderId,
      customerId: `CUST-${Math.floor(100 + Math.random() * 900)}`,
      customerName: checkoutName,
      customerEmail: checkoutEmail,
      productId: selectedProductId,
      productName: p.name,
      grossAmount: gross,
      paymentMethod: checkoutPaymentMethod,
      status: "Completed",
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      affiliateId: finalAffiliate,
      jvSplitsApplied: associatedJV.length > 0
    };

    // Update balances
    setOrders(prev => [newOrder, ...prev]);
    setNetworkBalances(prev => ({
      affiliateEarnings: prev.affiliateEarnings + finalAffShare,
      vendorEarnings: prev.vendorEarnings + finalNetVendor,
      jvPartnerPayouts: prev.jvPartnerPayouts + totalJvPayout,
      platformFeeAccrued: prev.platformFeeAccrued + platformFee,
      commercialTaxDue: prev.commercialTaxDue + tax
    }));

    // Update Gravity Score incrementally like ClickBank
    setProducts(prev => prev.map(prod => {
      if (prod.id === selectedProductId) {
        return {
          ...prod,
          gravityScore: parseFloat((prod.gravityScore + 1.2).toFixed(1))
        };
      }
      return prod;
    }));

    // Save detailed breakdown for interactive UI testing console
    setLastSimulatedPurchaseResult({
      orderId,
      productName: p.name,
      grossAmount: gross,
      taxAmount: tax,
      platformFee,
      netPool,
      affiliateId: finalAffiliate,
      affShare: finalAffShare,
      jvSplits: associatedJV.map(j => ({
        partnerName: j.partnerName,
        payoutPercent: j.payoutPercent,
        share: Math.round(vendorBase * (j.payoutPercent / 100))
      })),
      netVendorShare: finalNetVendor,
      buyerName: checkoutName,
      buyerEmail: checkoutEmail,
      paymentMethod: checkoutPaymentMethod,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    });

    alert(`Order ${orderId} completed successfully! Payment processed via automated direct gateway integration. Split commission disbursed automatically.`);
  };

  const handleProcessRefund = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId && o.status !== "Refunded") {
        const p = products.find(prod => prod.id === o.productId) || products[0];
        const tax = Math.round(o.grossAmount * 0.05);
        const platformFee = Math.round(o.grossAmount * 0.075) + 1500;
        const netPool = o.grossAmount - platformFee - tax;
        const affShare = o.affiliateId ? Math.round(netPool * (p.commissionPercent / 100)) : 0;
        const vendorShare = netPool - affShare;

        // Deduct from balances
        setNetworkBalances(b => ({
          ...b,
          affiliateEarnings: Math.max(0, b.affiliateEarnings - affShare),
          vendorEarnings: Math.max(0, b.vendorEarnings - vendorShare),
          platformFeeAccrued: Math.max(0, b.platformFeeAccrued - 1500), // ClickBank charges smaller fee on refunds
          commercialTaxDue: Math.max(0, b.commercialTaxDue - tax)
        }));

        // Gravity score drops on refunds
        setProducts(prods => prods.map(pr => {
          if (pr.id === o.productId) {
            return { ...pr, gravityScore: parseFloat(Math.max(0, pr.gravityScore - 0.8).toFixed(1)) };
          }
          return pr;
        }));

        return { ...o, status: "Refunded" as const };
      }
      return o;
    }));
    alert("Refund processed successfully. Commission splits clawed back from vendor and affiliate balances.");
  };

  const handleDownloadBatchCSV = () => {
    const csvContent = [
      ["Payout_ID", "Recipient_Type", "Recipient_Name", "Payout_Method", "Amount_MMK", "Status", "Reference_Code"],
      ["PAY-1001", "Affiliate", "Ko Sai Htun", "Direct_Deposit", networkBalances.affiliateEarnings.toString(), "PENDING", "AKYOE-AFF-PAYOUT"],
      ["PAY-1002", "Vendor", "Pwint Phyu", "Direct_Deposit", networkBalances.vendorEarnings.toString(), "PENDING", "AKYOE-VEND-PAYOUT"]
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Akyoe_Network_Affiliate_Payout_Batch.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // --- Brand Side Simulators ---
  const rotateSimulatedIp = () => {
    const newIp = `103.${Math.floor(20 + Math.random() * 80)}.${Math.floor(10 + Math.random() * 200)}.${Math.floor(1 + Math.random() * 254)}`;
    setCurrentSimulatedIp(newIp);
    setLastClickWasDuplicate(null);
  };

  const handleSimulateBrandClick = () => {
    const affiliateIdUpper = brandCustomAffiliate.trim().toUpperCase() || "AFF-101";
    const randomSocial = ["Facebook", "TikTok", "Telegram", "Direct"][Math.floor(Math.random() * 4)];
    
    // Check if current IP has already been clicked (24-hour IP deduplication mockup)
    if (ppcRecentIps.includes(currentSimulatedIp)) {
      setLastClickWasDuplicate(true);
      
      const duplicatePixelLog = {
        id: `PXL-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: new Date().toLocaleTimeString(),
        eventType: "click" as const,
        productId: brandSelectedProd,
        affiliateId: affiliateIdUpper,
        tid: brandCustomTid || undefined,
        details: `⚠️ PPC Duplicate Click Blocked (IP: ${currentSimulatedIp}) from ${randomSocial}. Fraud prevented, no charge applied.`
      };
      setPixelLogs(prev => [duplicatePixelLog, ...prev]);

      alert(`🛑 Duplicate Click Detected - Fraud Prevented!\n\nIP address ${currentSimulatedIp} has already triggered a PPC click recently.\n\nTo protect the vendor's budget, consecutive clicks from the same IP within a 24-hour window are deduplicated. No fees have been deducted from the Vendor's balance.`);
      return;
    }

    // Capture Unique PPC Click
    setLastClickWasDuplicate(false);
    setPpcRecentIps(prev => [...prev, currentSimulatedIp]);

    // Deduct flat fee (100 Ks) from Vendor sales balance and credit to Affiliate earnings
    setNetworkBalances(prev => ({
      ...prev,
      vendorEarnings: Math.max(0, prev.vendorEarnings - 100),
      affiliateEarnings: prev.affiliateEarnings + 100
    }));

    // Increment overall ad clicks count
    setAdClicks(prev => prev + 1);

    const hopId = `HOP-${Math.floor(10000 + Math.random() * 90000)}`;
    const newHop = {
      id: hopId,
      productId: brandSelectedProd,
      affiliateId: affiliateIdUpper,
      ipAddress: currentSimulatedIp,
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5; Like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
      timestamp: new Date().toLocaleTimeString(),
      socialChannel: randomSocial as any,
      tid: brandCustomTid.trim() || undefined
    };

    setClickLogs(prev => [newHop, ...prev]);

    const newPixelLog = {
      id: `PXL-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toLocaleTimeString(),
      eventType: "click" as const,
      productId: brandSelectedProd,
      affiliateId: affiliateIdUpper,
      tid: brandCustomTid || undefined,
      details: `⚡ PPC Unique Click Captured (IP: ${currentSimulatedIp}) via landing page ${brandLandingUrl}. +100 Ks credited to Affiliate.`
    };

    const newPagePixelLog = {
      id: `PXL-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toLocaleTimeString(),
      eventType: "page_view" as const,
      productId: brandSelectedProd,
      affiliateId: affiliateIdUpper,
      tid: brandCustomTid || undefined,
      details: `Visitor Page View Pixel: Read stored cookie of "${affiliateIdUpper}". Linked session successfully.`
    };

    setPixelLogs(prev => [newPagePixelLog, newPixelLog, ...prev]);
    
    alert(`⚡ PPC Unique Click Captured!\n\n• Unique IP: ${currentSimulatedIp}\n• Product ID: ${brandSelectedProd}\n• Affiliate ID: ${affiliateIdUpper}\n\nFlat PPC fee of 100 Ks has been deducted from your Vendor Sales Balance and credited to the Affiliate's balance successfully!`);
  };

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(payoutAmountInput);
    if (isNaN(amount) || amount <= 0) {
      alert("⚠️ Please enter a valid payout amount.");
      return;
    }
    if (amount < 5000) {
      alert("⚠️ Minimum payout withdrawal amount is 5,000 Ks.");
      return;
    }
    if (amount > networkBalances.affiliateEarnings) {
      alert("⚠️ Insufficient balance. Your current affiliate balance is " + networkBalances.affiliateEarnings.toLocaleString() + " Ks.");
      return;
    }
    if (!payoutAccountNoInput.trim() || !payoutAccountNameInput.trim()) {
      alert("⚠️ Please fill in all account details (Account/Phone number and Account Holder name).");
      return;
    }

    // Deduct from affiliate balance
    setNetworkBalances(prev => ({
      ...prev,
      affiliateEarnings: prev.affiliateEarnings - amount
    }));

    // Add to payout history log
    const newPayout: PayoutRecord = {
      id: `PAY-${Math.floor(10000 + Math.random() * 90000)}`,
      method: payoutMethodInput,
      accountNo: payoutAccountNoInput.trim(),
      accountName: payoutAccountNameInput.trim(),
      amount: amount,
      status: "Completed",
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setPayoutHistory(prev => [newPayout, ...prev]);
    setPayoutAmountInput("");
    setPayoutAccountNoInput("");
    setPayoutAccountNameInput("");
    alert(`🎉 Payout of ${amount.toLocaleString()} Ks requested successfully! Disbursed instantly to ${newPayout.accountName} via ${newPayout.method}.`);
  };

  const handleAddJVContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJvPartner.trim() || !newJvRole.trim()) {
      alert("Please fill in all partner and role fields.");
      return;
    }

    const currentSplitsTotal = jvContracts
      .filter(j => j.productId === newJvProduct)
      .reduce((sum, j) => sum + j.payoutPercent, 0);

    if (currentSplitsTotal + newJvPercent > 80) {
      alert("Error: Total JV splits for a single product cannot exceed 80% of the vendor's net earnings.");
      return;
    }

    const newJv: JVContract = {
      id: `JV-${Math.floor(300 + Math.random() * 699)}`,
      productId: newJvProduct,
      partnerName: newJvPartner.trim(),
      partnerRole: newJvRole.trim(),
      payoutPercent: newJvPercent
    };

    setJvContracts(prev => [...prev, newJv]);
    setNewJvPartner("");
    setNewJvRole("");
    alert("Joint Venture contract registered successfully!");
  };

  const handleRemoveJVContract = (id: string) => {
    setJvContracts(prev => prev.filter(j => j.id !== id));
  };

  // --- Advertisement Handlers ---
  const handleRegisterAdCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdAdvertiserName.trim()) {
      alert("Please fill in the Advertiser Name.");
      return;
    }

    const newCampaign: AdCampaign = {
      id: `AD-${Math.floor(900 + Math.random() * 100)}`,
      advertiserName: newAdAdvertiserName.trim(),
      tier: newAdTier,
      targetCategory: newAdTargetCategory,
      budgetMMK: newAdBudget,
      durationDays: newAdDuration,
      adLengthSec: newAdLength,
      status: "Active",
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setAdCampaigns(prev => [newCampaign, ...prev]);
    // Optionally deduct/add budget simulation
    alert(`Success: ${newAdTier} ad campaign registered! Under ClickBank guidelines, target traffic will receive simulated views on relevant category pages.`);
    
    // Reset form fields
    setNewAdAdvertiserName("");
    setNewAdBudget(50000);
    setNewAdDuration(14);
  };

  const handleRemoveAdCampaign = (id: string) => {
    setAdCampaigns(prev => prev.filter(campaign => campaign.id !== id));
  };

  const handleSimulateAdPlay = (campaignId: string) => {
    const campaign = adCampaigns.find(c => c.id === campaignId);
    if (!campaign) return;
    setActiveAdSimId(campaignId);
    setAdPlaySecondsRemaining(campaign.adLengthSec);
    setIsAdPlaying(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* --- ClickBank Style Top Navigation Header --- */}
      <nav className="min-h-16 h-auto py-3 bg-white border-b border-slate-200 flex flex-col md:flex-row items-center justify-between px-6 shrink-0 sticky top-0 z-50 shadow-sm gap-4">
        <div className="flex items-center gap-8 justify-between w-full md:w-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold font-display shadow-md shadow-emerald-600/10">A</div>
            <span className="text-xl font-bold tracking-tight text-slate-800 font-display">AKYOE <span className="text-emerald-600">Network</span></span>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-slate-500 font-semibold tracking-wider uppercase">
            <span>Automated ClickBank Style Marketplace</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-400">Region: MM (Kyat)</span>
          </div>
        </div>

        {/* --- Account Mode Switcher (Affiliate/Creator vs Brand/Merchant vs Sponsor Advertisement) --- */}
        <div className="bg-slate-100 p-1 rounded-2xl flex flex-wrap sm:flex-nowrap items-center gap-1 border border-slate-200/50 w-full sm:w-auto justify-center shadow-inner">
          <button
            onClick={() => {
              setUserRole("affiliate");
              setActiveTab("marketplace");
            }}
            className={`px-4 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center gap-2 transition-all duration-200 flex-1 sm:flex-none justify-center ${
              userRole === "affiliate"
                ? "bg-white text-emerald-800 shadow-sm border border-slate-200/30 font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            ညွှန်းပို့သူ (Affiliate)
          </button>
          <button
            onClick={() => {
              setUserRole("brand");
              setActiveTab("brand-dashboard");
            }}
            className={`px-4 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center gap-2 transition-all duration-200 flex-1 sm:flex-none justify-center ${
              userRole === "brand"
                ? "bg-emerald-600 text-white shadow-sm font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            လုပ်ငန်းရှင် (Brand)
          </button>
          <button
            onClick={() => {
              setUserRole("sponsor");
              setActiveTab("sponsor-dashboard");
            }}
            className={`px-4 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center gap-2 transition-all duration-200 flex-1 sm:flex-none justify-center ${
              userRole === "sponsor"
                ? "bg-indigo-600 text-white shadow-sm font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Megaphone className="w-3.5 h-3.5 text-indigo-400" />
            စပွန်ဆာ (Sponsor)
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 justify-between w-full md:w-auto">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className={`px-2.5 sm:px-3 py-1.5 rounded-2xl text-[10.5px] font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              showGuide
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/15"
                : "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/60"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            {showGuide ? "Guide Active" : "📖 Guide"}
          </button>

          <button
            onClick={() => setShowSimulator(!showSimulator)}
            className={`px-2.5 sm:px-3 py-1.5 rounded-2xl text-[10.5px] font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              showSimulator
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/15"
                : "bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200/60"
            }`}
          >
            <Shuffle className="w-3.5 h-3.5 shrink-0 animate-spin-slow" />
            {showSimulator ? "Simulator: ON" : "📡 Simulator"}
          </button>

          <div className="bg-slate-100 rounded-full px-4 py-1.5 flex items-center gap-2 text-[10px] font-bold font-mono">
            <span className="text-slate-400 uppercase">Mode:</span>
            <span className={userRole === "brand" ? "text-emerald-600" : "text-indigo-600"}>
              {userRole === "brand" ? "BRAND & VENDOR" : "AFFILIATE & CREATOR"}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-xs uppercase shadow-sm font-mono shrink-0">
            MM
          </div>
        </div>
      </nav>

      {/* --- Main Dashboard Content Grid --- */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* --- Left Column Sidebar: Controls, Account Balances & Tabs --- */}
        <aside className="lg:w-64 flex-shrink-0 space-y-4">
          
          {/* Bento Wallet Balance Card */}
          <div className="bg-emerald-900 rounded-3xl p-6 text-white flex flex-col justify-between shadow-lg shadow-emerald-950/15 relative">
            {userRole === "brand" ? (
              <div>
                <p className="text-emerald-300/80 text-[11px] font-bold uppercase tracking-wider font-mono mb-1">စုစုပေါင်း ပစ္စည်းရောင်းရငွေ (Vendor Sales Balance)</p>
                <h2 className="text-3xl font-bold font-display text-white">
                  {networkBalances.vendorEarnings.toLocaleString()} <span className="text-lg font-normal">Ks</span>
                </h2>
              </div>
            ) : (
              <div>
                <p className="text-emerald-300/80 text-[11px] font-bold uppercase tracking-wider font-mono mb-1">စုစုပေါင်း ညွှန်းခရငွေ (Affiliate Balance)</p>
                <h2 className="text-3xl font-bold font-display text-white">
                  {networkBalances.affiliateEarnings.toLocaleString()} <span className="text-lg font-normal">Ks</span>
                </h2>
              </div>
            )}
            <div className="space-y-3 mt-6">
              {userRole === "brand" ? (
                <div className="flex justify-between text-xs border-b border-emerald-800/50 pb-2">
                  <span className="text-emerald-300/70 font-mono uppercase">Affiliate Comm Paid</span>
                  <span className="font-semibold underline">{(orders.filter(o => o.affiliateId).length * 25000).toLocaleString()} Ks</span>
                </div>
              ) : (
                <div className="flex justify-between text-xs border-b border-emerald-800/50 pb-2">
                  <span className="text-emerald-300/70 font-mono uppercase">Vendor Balance</span>
                  <span className="font-semibold underline">{networkBalances.vendorEarnings.toLocaleString()} Ks</span>
                </div>
              )}
              {userRole === "brand" ? (
                <button 
                  onClick={() => {
                    alert("Simulated Action: Downloading Brand's Sales Ledger Invoice CSV...");
                  }}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold py-2.5 rounded-xl transition-all font-mono text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" /> Brand Sales (CSV)
                </button>
              ) : (
                <button 
                  onClick={handleDownloadBatchCSV}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold py-2.5 rounded-xl transition-all font-mono text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" /> Payout Batch (CSV)
                </button>
              )}
            </div>

            {/* 💡 USER GUIDE TOOLTIP/CALLOUT (AFFILIATE STEP 4 OR VENDOR STEP 3) */}
            {showGuide && ((activeGuideTab === "affiliate" && guideStep === 3) || (activeGuideTab === "vendor" && guideStep === 2)) && (
              <div className="absolute left-0 lg:left-full top-0 lg:top-4 lg:ml-4 mt-12 lg:mt-0 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl p-4 shadow-2xl shadow-emerald-950/40 border border-emerald-500/40 w-72 text-xs animate-bounce-short">
                <div className="absolute -top-1.5 lg:top-6 left-6 lg:-left-1.5 w-3 h-3 bg-slate-950 rotate-45 border-l border-t lg:border-t-0 lg:border-l-2 lg:border-b-2 border-emerald-500/40" />
                <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1 font-display">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  {activeGuideTab === "affiliate" ? "အဆင့် ၄: စုစုပေါင်း ကော်မရှင်ဝင်ငွေ" : "အဆင့် ၃: ပစ္စည်းရောင်းရငွေဝေစု"}
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                  {activeGuideTab === "affiliate" 
                    ? "ဝယ်ယူသူများက သင့်လင့်ခ်မှ ဝယ်ယူပြီးပါက သင်ရရှိမည့် ကော်မရှင်များကို ဤစုစုပေါင်း ညွှန်းခရငွေ (Affiliate Balance) ထဲတွင် တိုက်ရိုက် ချက်ချင်း တွေ့မြင်ရပါမည်!"
                    : "ဝယ်ယူသူများမှ KBZPay, WavePay တို့ဖြင့် ဝယ်ယူလိုက်သည်နှင့် သင့်အတွက် သတ်မှတ်ထားသော ပစ္စည်းရောင်းရငွေဝေစု (Vendor Balance) ကို ဤနေရာတွင် စနစ်က အလိုအလျောက် တိုက်ရိုက် ခွဲဝေထည့်သွင်းပေးပါမည်!"}
                </p>
                <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-800 font-sans">
                  <button
                    onClick={() => setGuideStep(prev => Math.max(0, prev - 1))}
                    className="text-[10px] text-slate-400 hover:text-white font-bold transition-colors"
                  >
                    ← နောက်သို့
                  </button>
                  <button
                    onClick={() => {
                      setShowGuide(false);
                    }}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md shadow-emerald-950/40 transition-all"
                  >
                    လမ်းညွှန်ပိတ်မည် ✓
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Module Navigation */}
          <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase block mb-3">
              {userRole === "brand" ? "Brand Merchant Modules" : userRole === "sponsor" ? "Sponsor Modules" : "Marketplace Modules"}
            </span>
            <nav className="space-y-1">
              {userRole === "brand" ? (
                [
                  { id: "brand-dashboard", label: "Brand Overview", icon: BarChart3 },
                  { id: "brand-products", label: "Merchant Product Catalog", icon: ShoppingBag },
                  { id: "tracking-setup", label: "PPC Tracking & Logs", icon: Shuffle },
                  { id: "saas-landing-pages", label: "Branded Landing Pages (SaaS)", icon: Globe },
                  { id: "saas-analytics", label: "SaaS Analytics (No Web)", icon: Activity },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-medium transition-all duration-150 ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600 font-bold shadow-sm"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                      {tab.label}
                    </button>
                  );
                })
              ) : userRole === "sponsor" ? (
                [
                  { id: "sponsor-dashboard", label: "Sponsor Overview", icon: BarChart3 },
                  { id: "sponsor-campaigns", label: "Sponsor Campaigns", icon: Megaphone },
                  { id: "sponsor-bidding", label: "Sponsor Pay & Placement", icon: Percent },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-medium transition-all duration-150 ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 font-bold shadow-sm"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                      {tab.label}
                    </button>
                  );
                })
              ) : (
                [
                  { id: "marketplace", label: "Marketplace & Hoplinks", icon: ShoppingBag },
                  { id: "analytics", label: "Performance & Earnings", icon: BarChart3 },
                  { id: "split-calculator", label: "JV Split Calculator", icon: Percent },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <div key={tab.id} className="relative">
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-medium transition-all duration-150 ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600 font-bold shadow-sm"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                        {tab.label}
                      </button>

                      {/* 💡 USER GUIDE TOOLTIP FOR TRANSITIONING TO MARKETPLACE (AFFILIATE STEP 1) */}
                      {showGuide && activeGuideTab === "affiliate" && guideStep === 0 && tab.id === "marketplace" && activeTab !== "marketplace" && (
                        <div className="absolute left-0 lg:left-full top-0 lg:top-1 lg:ml-4 mt-12 lg:mt-0 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl p-4 shadow-2xl shadow-emerald-950/40 border border-emerald-500/40 w-72 text-xs animate-bounce-short">
                          <div className="absolute -top-1.5 lg:-top-0 left-6 lg:-left-1.5 lg:top-4 w-3 h-3 bg-slate-950 rotate-45 border-l border-t lg:border-t-0 lg:border-l-2 lg:border-b-2 border-emerald-500/40" />
                          <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1 font-display">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                            အဆင့် ၁: ကော်မရှင် စတင်ရှာရန်
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                            အကျိုးအမြတ်စတင်ရှာဖွေရန် ဤ 'Marketplace & Hoplinks' စာမျက်နှာသို့ သွားရောက်ပြီး ပစ္စည်းတစ်ခုကို ရွေးချယ်ပါ။
                          </p>
                          <div className="flex justify-end mt-2.5 pt-2 border-t border-slate-800 font-sans">
                            <button
                              onClick={() => {
                                setActiveTab("marketplace");
                              }}
                              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md shadow-emerald-950/40 transition-all"
                            >
                              စာမျက်နှာ ဖွင့်မည် →
                            </button>
                          </div>
                        </div>
                      )}

                      {/* 💡 USER GUIDE TOOLTIP FOR TRANSITIONING TO JV SPLIT CALCULATOR (VENDOR STEP 1) */}
                      {showGuide && activeGuideTab === "vendor" && guideStep === 0 && tab.id === "split-calculator" && activeTab !== "split-calculator" && (
                        <div className="absolute left-0 lg:left-full top-0 lg:top-1 lg:ml-4 mt-12 lg:mt-0 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl p-4 shadow-2xl shadow-emerald-950/40 border border-emerald-500/40 w-72 text-xs animate-bounce-short">
                          <div className="absolute -top-1.5 lg:-top-0 left-6 lg:-left-1.5 lg:top-4 w-3 h-3 bg-slate-950 rotate-45 border-l border-t lg:border-t-0 lg:border-l-2 lg:border-b-2 border-emerald-500/40" />
                          <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1 font-display">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                            အဆင့် ၁: ပစ္စည်း တင်သွင်းရန် / တွက်ချက်ရန်
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                            ထုတ်လုပ်သူ (Vendor) အနေဖြင့် သင့်သင်တန်း သို့မဟုတ် စာအုပ်များ၏ ကော်မရှင်နှင့် JV ခွဲဝေမှုနှုန်းများကို တွက်ချက်ရန် 'JV Split Calculator' သို့ သွားပါ။
                          </p>
                          <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-800 font-sans">
                            <span className="text-[9px] text-slate-400">1/3 Steps</span>
                            <button
                              onClick={() => {
                                setActiveTab("split-calculator");
                              }}
                              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md shadow-emerald-950/40 transition-all"
                            >
                              စာမျက်နှာ ဖွင့်မည် →
                            </button>
                          </div>
                        </div>
                      )}

                      {/* 💡 USER GUIDE TOOLTIP FOR TRANSITIONING TO MARKETPLACE (VENDOR STEP 2) */}
                      {showGuide && activeGuideTab === "vendor" && guideStep === 1 && tab.id === "marketplace" && activeTab !== "marketplace" && (
                        <div className="absolute left-0 lg:left-full top-0 lg:top-1 lg:ml-4 mt-12 lg:mt-0 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl p-4 shadow-2xl shadow-emerald-950/40 border border-emerald-500/40 w-72 text-xs animate-bounce-short">
                          <div className="absolute -top-1.5 lg:-top-0 left-6 lg:-left-1.5 lg:top-4 w-3 h-3 bg-slate-950 rotate-45 border-l border-t lg:border-t-0 lg:border-l-2 lg:border-b-2 border-emerald-500/40" />
                          <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1 font-display">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                            အဆင့် ၂: ညွှန်းပို့သူများဖြင့် ရောင်းချရန်
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                            သင့်ထုတ်ကုန်များကို အခြားသူများက လူမှုကွန်ရက်ပေါ်တွင် သီးသန့်လင့်ခ်များဖြင့် သင့်ကိုယ်စား ဝိုင်းဝန်းကြော်ငြာရောင်းချပေးနိုင်ရန် ဤ 'Marketplace Offers' သို့ သွားပါ။
                          </p>
                          <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-800 font-sans">
                            <button
                              onClick={() => {
                                setGuideStep(0);
                                setActiveTab("split-calculator");
                              }}
                              className="text-[10px] text-slate-400 hover:text-white font-bold transition-colors"
                            >
                              ← နောက်သို့
                            </button>
                            <button
                              onClick={() => {
                                setActiveTab("marketplace");
                              }}
                              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md shadow-emerald-950/40 transition-all"
                            >
                              စာမျက်နှာ ဖွင့်မည် →
                            </button>
                          </div>
                        </div>
                      )}

                      {/* 💡 USER GUIDE TOOLTIP FOR TRANSITIONING TO MARKETPLACE (CUSTOMER STEP 1) */}
                      {showGuide && activeGuideTab === "customer" && guideStep === 0 && tab.id === "marketplace" && activeTab !== "marketplace" && (
                        <div className="absolute left-0 lg:left-full top-0 lg:top-1 lg:ml-4 mt-12 lg:mt-0 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl p-4 shadow-2xl shadow-emerald-950/40 border border-emerald-500/40 w-72 text-xs animate-bounce-short">
                          <div className="absolute -top-1.5 lg:-top-0 left-6 lg:-left-1.5 lg:top-4 w-3 h-3 bg-slate-950 rotate-45 border-l border-t lg:border-t-0 lg:border-l-2 lg:border-b-2 border-emerald-500/40" />
                          <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1 font-display">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                            အဆင့် ၁: လင့်ကို နှိပ်ရန်
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                            Customer အနေဖြင့် ဝယ်ယူမှုစတင်ရန် ညွှန်းပို့သူပေးသောလင့်ခ်ကို နှိပ်သည့်ပုံစံမျိုးစမ်းသပ်ရန် 'Marketplace & Hoplinks' စာမျက်နှာရှိ 'Simulate Click' ခလုတ်ကို နှိပ်ရန် လိုအပ်ပါသည်။
                          </p>
                          <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-emerald-800 font-sans">
                            <span className="text-[9px] text-slate-400">1/3 Steps</span>
                            <button
                              onClick={() => {
                                setActiveTab("marketplace");
                              }}
                              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md shadow-emerald-950/40 transition-all"
                            >
                              စာမျက်နှာ ဖွင့်မည် →
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </nav>
          </div>

          {/* Real-time ClickBank Gravity Insight */}
          {userRole === "affiliate" && (
            <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl space-y-3 shadow-sm text-xs">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <TrendingUp className="w-4 h-4 animate-bounce" />
                <span>Gravity Leader</span>
              </div>
              <p className="text-slate-600 leading-relaxed font-sans">
                <strong>{topProduct.name}</strong> has a Gravity score of <strong>{topProduct.gravityScore}</strong>. Gravity measures active sales with a decay multiplier.
              </p>
            </div>
          )}

        </aside>

        {/* --- Central Main Content Workspace --- */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start"
            >
              
              {/* --- Left Tab-Specific Content Panel --- */}
              <section className={`${showSimulator ? "xl:col-span-8" : "xl:col-span-12"} bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5 transition-all duration-300`}>
                
                {/* 🛡️ TAB: SPONSOR OVERVIEW */}
                {activeTab === "sponsor-dashboard" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-lg font-display font-bold text-slate-800">Sponsor Dashboard Overview</h2>
                      </div>
                      <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-bold font-mono">Sponsor Space Active</span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      Welcome to the **Sponsor & Advertiser Control Center**. Here you can manage your high-impact ads, track live impressions, and optimize your conversion-boosting bids across the Akyoe Network.
                    </p>

                    {/* Sponsor Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                        <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase">Total Paid</span>
                        <div className="text-sm font-extrabold text-indigo-600 font-mono mt-1">
                          {adCampaigns.reduce((acc, curr) => acc + (curr.budgetMMK || 0), 0).toLocaleString()} Ks
                        </div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                        <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase">Active Ads</span>
                        <div className="text-sm font-extrabold text-slate-800 font-mono mt-1">
                          {adCampaigns.length}
                        </div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                        <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase">Impressions</span>
                        <div className="text-sm font-extrabold text-slate-800 font-mono mt-1">
                          {adCampaigns.reduce((acc, curr) => acc + (curr.impressionsCount || 0), 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                        <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase">Ad Clicks</span>
                        <div className="text-sm font-extrabold text-emerald-600 font-mono mt-1">
                          {adCampaigns.reduce((acc, curr) => acc + (curr.clicksCount || 0), 0).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Active Ads list with progress bars */}
                    <div className="bg-slate-50/50 rounded-3xl border border-slate-200/60 p-5 space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                        <h3 className="text-xs font-bold font-mono text-slate-700 uppercase tracking-wider">Your Live Campaigns & Performance</h3>
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded">Real-time stats</span>
                      </div>

                      <div className="space-y-4">
                        {adCampaigns.map((ad) => {
                          const ctr = ad.impressionsCount ? ((ad.clicksCount || 0) / ad.impressionsCount * 100).toFixed(1) : "0.0";
                          return (
                            <div key={ad.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-slate-800 text-xs">{ad.advertiserName}</h4>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                      ad.tier === "Diamond VIP" ? "bg-indigo-600 text-white" : ad.tier === "Premium" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"
                                    }`}>
                                      {ad.tier}
                                    </span>
                                  </div>
                                  <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">ID: {ad.id} | Placement: {ad.placementArea || "Redirection Interstitial"} | Type: {ad.adType || "video"}</span>
                                </div>
                                <button
                                  onClick={() => setAdCampaigns(prev => prev.filter(c => c.id !== ad.id))}
                                  className="text-rose-500 hover:text-rose-700 p-1.5 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Progress bar of budget and impressions */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-bold text-slate-400 font-mono">
                                  <span>IMPRESSIONS PROGRESS</span>
                                  <span className="text-indigo-600">{ad.impressionsCount || 0} views / CTR {ctr}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${Math.min(100, (((ad.impressionsCount || 0) + 10) / 5000) * 100)}%` }}></div>
                                </div>
                              </div>

                              <div className="grid grid-cols-4 gap-2 pt-1 text-center text-[10px] font-mono border-t border-slate-100">
                                <div>
                                  <div className="text-slate-400">Budget Paid</div>
                                  <div className="font-bold text-indigo-600 mt-0.5">{(ad.budgetMMK || 0).toLocaleString()} Ks</div>
                                </div>
                                <div>
                                  <div className="text-slate-400">Duration</div>
                                  <div className="font-bold text-slate-700 mt-0.5">{ad.durationDays} Days</div>
                                </div>
                                <div>
                                  <div className="text-slate-400">Max Length</div>
                                  <div className="font-bold text-slate-700 mt-0.5">{ad.adLengthSec} Sec</div>
                                </div>
                                <div>
                                  <div className="text-slate-400">Category</div>
                                  <div className="font-bold text-slate-700 mt-0.5">{ad.targetCategory}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 📢 TAB: SPONSOR CAMPAIGNS MANAGER */}
                {activeTab === "sponsor-campaigns" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <Megaphone className="w-5 h-5 text-indigo-600" />
                      <div>
                        <h2 className="text-lg font-display font-bold text-slate-800">Launch Sponsor Campaign</h2>
                        <p className="text-xs text-slate-500 font-sans mt-0.5">Add sponsors' interactive ad links to be shown prior to destination pages</p>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-5 rounded-3xl space-y-2 shadow-md">
                      <h3 className="font-bold font-display text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" /> Sponsored Interstitial Redirection Network
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        Sponsor advertisements are displayed instantly to buyers clicking **"Chat on Messenger"** or any redirection link. Media files (Images, GIFs, or high-speed MP4s) run on a countdown timer. 
                        The placement and allowed duration automatically upgrade based on your bidding budget!
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-12 bg-slate-50 p-5 rounded-3xl border border-slate-200">
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          if (!newAdAdvertiserName.trim()) return alert("Enter advertiser business name");
                          
                          // Determine Tier & Placement automatically based on Budget
                          let calculatedTier: "Basic" | "Premium" | "Diamond VIP" = "Basic";
                          let calculatedPlacement: "VIP Header" | "Sidebar Row" | "Redirection Interstitial" = "Sidebar Row";
                          
                          if (newAdBudget >= 180000) {
                            calculatedTier = "Diamond VIP";
                            calculatedPlacement = "Redirection Interstitial";
                          } else if (newAdBudget >= 75000) {
                            calculatedTier = "Premium";
                            calculatedPlacement = "VIP Header";
                          } else {
                            calculatedTier = "Basic";
                            calculatedPlacement = "Sidebar Row";
                          }

                          const newAd: AdCampaign = {
                            id: `AD-${Math.floor(900 + Math.random() * 100)}`,
                            advertiserName: newAdAdvertiserName.trim(),
                            tier: calculatedTier,
                            targetCategory: newAdTargetCategory,
                            budgetMMK: newAdBudget,
                            durationDays: newAdDuration,
                            adLengthSec: newAdLength,
                            adType: newAdMediaType,
                            mediaUrl: newAdMediaUrl.trim() || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80",
                            placementArea: newAdPlacementArea,
                            status: "Active",
                            createdAt: new Date().toISOString().replace("T", " ").substring(0,16),
                            clicksCount: 0,
                            impressionsCount: 0
                          };

                          setAdCampaigns(prev => [newAd, ...prev]);
                          alert(`Congratulations! Launched ${calculatedTier} campaign with ${newAdLength}s ${newAdMediaType} ad in "${newAdPlacementArea}" placement area.`);
                          
                          // Reset
                          setNewAdAdvertiserName("");
                          setNewAdMediaUrl("");
                        }} className="space-y-4 text-xs">
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">1. Sponsor / Business Name</label>
                              <input 
                                type="text"
                                value={newAdAdvertiserName}
                                onChange={(e) => setNewAdAdvertiserName(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-sans"
                                placeholder="e.g. MyanMart Ecommerce"
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">2. Target Category</label>
                              <select 
                                value={newAdTargetCategory}
                                onChange={(e) => setNewAdTargetCategory(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-indigo-500 font-sans"
                              >
                                <option value="All">All Categories</option>
                                <option value="Education">Education & Courses</option>
                                <option value="Software">Software & SaaS</option>
                                <option value="eBook & Code">eBooks & Manuals</option>
                                <option value="Automobile">Automobile & Luxury</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">3. Ad Format Type</label>
                              <select 
                                value={newAdMediaType}
                                onChange={(e) => setNewAdMediaType(e.target.value as any)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-indigo-500 font-sans"
                              >
                                <option value="image">Static Image</option>
                                <option value="gif">Animated GIF</option>
                                <option value="video">Short-form MP4 Video</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">4. Paid Bidding Budget (MMK)</label>
                              <input 
                                type="number"
                                min="10000"
                                step="5000"
                                value={newAdBudget}
                                onChange={(e) => setNewAdBudget(parseInt(e.target.value) || 10000)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                              />
                              <span className="text-[9px] text-indigo-500 font-bold block mt-1">
                                {newAdBudget >= 180000 ? "⚡ Diamond VIP placement auto-assigned" : newAdBudget >= 75000 ? "⭐ Premium placement auto-assigned" : "Basic placement assigned"}
                              </span>
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">5. Ad Countdown Length</label>
                              <select 
                                value={newAdLength}
                                onChange={(e) => setNewAdLength(parseInt(e.target.value) as any)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-indigo-500 font-sans"
                              >
                                <option value={15}>15 Seconds (Short)</option>
                                <option value={30}>30 Seconds (Standard)</option>
                                <option value={60}>60 Seconds (Full Play Max)</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">6. Preferred Placement Area</label>
                            <div className="grid grid-cols-3 gap-2">
                              {([
                                { id: "Sidebar Row", label: "Sidebar Row Banner" },
                                { id: "VIP Header", label: "VIP Header Banner" },
                                { id: "Redirection Interstitial", label: "Redirection Interstitial (Popup)" }
                              ] as const).map((p) => (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => setNewAdPlacementArea(p.id)}
                                  className={`py-2 px-1 text-[10px] sm:text-xs font-semibold rounded-xl border transition-all ${
                                    newAdPlacementArea === p.id
                                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                                  }`}
                                >
                                  {p.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="block text-[10px] uppercase text-slate-500 font-mono font-bold">7. Media Asset URL</label>
                              <span className="text-[9px] text-slate-400">Or pick one of our premium demo links below:</span>
                            </div>
                            <input 
                              type="text"
                              value={newAdMediaUrl}
                              onChange={(e) => setNewAdMediaUrl(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                              placeholder="e.g. https://domain.com/ad-creative.mp4 or image url"
                            />

                            {/* Demo links helper */}
                            <div className="flex flex-wrap gap-2 mt-2">
                              {[
                                { label: "📚 Learn Online Image", type: "image", url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80" },
                                { label: "💻 Cyber Security GIF", type: "gif", url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3Zpc3p6dG9oODg3ODlhNWk0MWVzNDg0NmdsNTRvNDlyMXF2dTFoayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPnAiaMCws8nruE/giphy.gif" },
                                { label: "🚀 Neon Subway Loop MP4", type: "video", url: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-subway-station-with-neon-lights-42488-large.mp4" },
                                { label: "💼 Financial Growth MP4", type: "video", url: "https://assets.mixkit.co/videos/preview/mixkit-business-charts-and-statistics-on-a-digital-screen-42352-large.mp4" }
                              ].map((item, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    setNewAdMediaUrl(item.url);
                                    setNewAdMediaType(item.type as any);
                                  }}
                                  className="text-[9px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded transition-all border border-indigo-100"
                                >
                                  {item.label} ({item.type})
                                </button>
                              ))}
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all uppercase tracking-wider font-mono shadow-md shadow-indigo-600/15"
                          >
                            Create Sponsor Campaign
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                {/* 🧮 TAB: SPONSOR PAY & PLACEMENT OPTIMIZER */}
                {activeTab === "sponsor-bidding" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <Percent className="w-5 h-5 text-indigo-600" />
                      <h2 className="text-lg font-display font-bold text-slate-800">Sponsor Pay & Placement Optimizer</h2>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      Our dynamic ad network leverages a **Bidding Tier Algorithm**. The higher your paid budget, the higher quality your placement and the longer the countdown duration allowed to guarantee views.
                    </p>

                    <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">Drag to Simulate Your Bidding Amount (Ks)</label>
                        <input 
                          type="range"
                          min="10000"
                          max="500000"
                          step="10000"
                          value={newAdBudget}
                          onChange={(e) => setNewAdBudget(parseInt(e.target.value))}
                          className="w-full accent-indigo-600 cursor-pointer"
                        />
                        <div className="flex justify-between text-xs font-mono font-bold text-indigo-600 mt-1">
                          <span>10,000 Ks</span>
                          <span>{newAdBudget.toLocaleString()} MMK</span>
                          <span>500,000 Ks</span>
                        </div>
                      </div>

                      {/* dynamic bidding table result */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-4 text-xs space-y-3.5">
                        <div className="flex justify-between border-b border-slate-100 pb-2">
                          <span className="text-slate-500 font-sans">Bidding Placement Grade:</span>
                          <span className={`font-mono font-bold ${
                            newAdBudget >= 180000 ? "text-indigo-600 text-sm" : newAdBudget >= 75000 ? "text-amber-600 text-sm" : "text-slate-600"
                          }`}>
                            {newAdBudget >= 180000 ? "💎 Diamond VIP" : newAdBudget >= 75000 ? "⭐ Gold Premium" : "⚙️ Silver Basic"}
                          </span>
                        </div>

                        <div className="flex justify-between border-b border-slate-100 pb-2">
                          <span className="text-slate-500 font-sans">Placement Area Assigned:</span>
                          <span className="font-mono font-bold text-slate-800">
                            {newAdBudget >= 180000 ? "Redirection Interstitial Modal" : newAdBudget >= 75000 ? "VIP Top Header Banner" : "Sidebar Row Banner"}
                          </span>
                        </div>

                        <div className="flex justify-between border-b border-slate-100 pb-2">
                          <span className="text-slate-500 font-sans">Allowed Play Duration:</span>
                          <span className="font-mono font-bold text-slate-800">
                            {newAdBudget >= 180000 ? "60 Seconds max (Full duration)" : newAdBudget >= 75000 ? "30 Seconds max" : "15 Seconds max"}
                          </span>
                        </div>

                        <div className="flex justify-between border-b border-slate-100 pb-2">
                          <span className="text-slate-500 font-sans">Placement Rotation Priority:</span>
                          <span className="font-mono font-bold text-indigo-600">
                            {newAdBudget >= 180000 ? "95% (Top priority / Full Interception)" : newAdBudget >= 75000 ? "60% Rotation Probability" : "30% Rotation Probability"}
                          </span>
                        </div>

                        <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 text-[11px] text-indigo-800 leading-relaxed font-sans">
                          <strong>💡 Bidding Recommendation:</strong> {
                            newAdBudget >= 180000 
                              ? "Excellent! At this Diamond bidding tier, your video, image, or gif advertisement is guaranteed to play as a mandatory redirection intercept screen prior to visitors reaching the seller's chat, capturing 100% of the customer's focused attention!"
                              : newAdBudget >= 75000
                              ? "At the Gold Premium tier, your ad will occupy the VIP Header layout of our partner landing pages, driving very high secondary click-throughs."
                              : "Silver Basic placement is perfect for high-frequency low-cost branding, rotating dynamically inside the sidebars of connected SaaS pages."
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 📊 TAB: BRAND DASHBOARD */}
                {activeTab === "brand-dashboard" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-emerald-600" />
                        <h2 className="text-lg font-display font-bold text-slate-800">လုပ်ငန်းရှင် မျက်နှာစာ (Brand Dashboard)</h2>
                      </div>
                      <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-bold font-mono">Merchant Account Live</span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      ဤနေရာသည် သင့်လုပ်ငန်း (Brand/Vendor) ၏ စုစုပေါင်းရောင်းအား၊ ကြော်ငြာဝေစုနှင့် ညွှန်းပို့သူများ (Affiliates) သို့ ခွဲဝေပေးပြီးသော ကော်မရှင်များကို အလွယ်တကူ စောင့်ကြည့်နိုင်သော နေရာဖြစ်ပါသည်။
                    </p>

                    {/* Quick KPIs Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                        <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">စုစုပေါင်းရောင်းအား (Gross Sales)</span>
                        <span className="text-lg font-bold font-display text-slate-800">
                          {(orders.reduce((sum, o) => sum + o.grossAmount, 0)).toLocaleString()} Ks
                        </span>
                        <div className="text-[9px] text-emerald-600 font-semibold mt-1">
                          Orders: {orders.length} completed
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                        <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">ညွှန်းခပေးပြီးမှု (Commissions Paid)</span>
                        <span className="text-lg font-bold font-display text-emerald-600">
                          {networkBalances.affiliateEarnings.toLocaleString()} Ks
                        </span>
                        <div className="text-[9px] text-slate-400 font-mono mt-1">
                          Affiliate share of net pool
                        </div>
                      </div>
                    </div>

                    {/* Conversion Stats & Analytics */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-3">
                      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">Affiliate Traffic Conversion Funnel</h3>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                            <span>Hops (Click-through Traffic)</span>
                            <span className="font-bold font-mono">{clickLogs.length} clicks</span>
                          </div>
                          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: "100%" }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                            <span>Conversions (Successful Checkouts)</span>
                            <span className="font-bold font-mono text-emerald-600">
                              {orders.filter(o => o.status === "Completed").length} sales
                            </span>
                          </div>
                          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full transition-all" 
                              style={{ width: `${Math.min(100, clickLogs.length > 0 ? (orders.filter(o => o.status === "Completed").length / clickLogs.length) * 100 : 0)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 leading-relaxed font-sans pt-1">
                        * Akyoe uses an automated tracking script that identifies affiliate referrals instantly using browser cookies and IP tracking. No manual setup is needed!
                      </div>
                    </div>

                    {/* Active Products List */}
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">My Marketplace Products ({products.length})</h3>
                      <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden max-h-52 overflow-y-auto">
                        {products.map(p => (
                          <div key={p.id} className="p-3 bg-white hover:bg-slate-50/50 flex items-center justify-between transition-colors">
                            <div>
                              <p className="text-xs font-bold text-slate-800">{p.name}</p>
                              <span className="text-[9px] text-slate-400 font-mono">ID: {p.id} | Price: {p.priceMMK.toLocaleString()} Ks</span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold text-emerald-600 block">{p.commissionPercent}% Comm</span>
                              <span className="text-[9px] text-slate-400 font-mono">Gravity: {p.gravityScore}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 🔗 TAB: TRACKING INTEGRATION SETUP */}
                {activeTab === "tracking-setup" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 gap-4">
                      <div className="flex items-center gap-2">
                        <Shuffle className="w-5 h-5 text-emerald-600" />
                        <h2 className="text-lg font-display font-bold text-slate-800">PPC Tracking & SaaS Widgets</h2>
                      </div>
                      
                      {/* Active Status Badge */}
                      <div className="flex items-center gap-2 text-[10px] uppercase font-mono font-bold">
                        <span className="text-slate-400">Messenger Widget:</span>
                        <span className={`px-2 py-0.5 rounded-lg border ${
                          widgetConfig.isEnabled 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse" 
                            : "bg-slate-50 text-slate-400 border-slate-200"
                        }`}>
                          {widgetConfig.isEnabled ? "ACTIVE" : "DISABLED"}
                        </span>
                      </div>
                    </div>

                    {/* SUB-TAB BAR */}
                    <div className="flex bg-slate-100 p-1 rounded-2xl gap-1 max-w-xl text-xs font-sans">
                      <button
                        type="button"
                        onClick={() => setWidgetSubTab("settings")}
                        className={`flex-1 py-2.5 px-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${widgetSubTab === "settings" ? "bg-white text-emerald-700 shadow-sm font-extrabold" : "text-slate-500 hover:text-slate-800"}`}
                      >
                        <Settings className="w-4 h-4" /> 💬 Messenger Setup
                      </button>
                      <button
                        type="button"
                        onClick={() => setWidgetSubTab("analytics")}
                        className={`flex-1 py-2.5 px-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${widgetSubTab === "analytics" ? "bg-white text-emerald-700 shadow-sm font-extrabold" : "text-slate-500 hover:text-slate-800"}`}
                      >
                        <BarChart3 className="w-4 h-4" /> 📊 Click Analytics
                      </button>
                      <button
                        type="button"
                        onClick={() => setWidgetSubTab("spoofer" as any)}
                        className={`flex-1 py-2.5 px-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${widgetSubTab as any === "spoofer" ? "bg-white text-emerald-700 shadow-sm font-extrabold" : "text-slate-500 hover:text-slate-800"}`}
                      >
                        <Layers className="w-4 h-4" /> 🍪 Global Cookies
                      </button>
                    </div>

                    {/* --- SUB-TAB 1: MESSENGER ADMIN SETTINGS --- */}
                    {widgetSubTab === "settings" && (
                      <div className="space-y-6">
                        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-5">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider font-mono">💬 Messenger Floating Button Configuration</h3>
                              <p className="text-[10px] text-slate-400 font-sans mt-0.5">Customize your button visual appearance, redirection target, and display options.</p>
                            </div>
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-mono font-bold px-2 py-0.5 rounded-lg border border-indigo-100 shrink-0">
                              SaaS Portal
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-sans">
                            <div className="space-y-4">
                              <div>
                                <label className="block text-[10px] uppercase text-slate-500 mb-1.5 font-mono font-bold">Facebook Page ID / Username</label>
                                <div className="flex items-center rounded-2xl bg-slate-50/50 border border-slate-200/85 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all duration-200 px-3 py-1">
                                  <span className="text-slate-400 font-mono text-xs select-none mr-1.5">m.me/</span>
                                  <input 
                                    type="text"
                                    value={widgetConfig.facebookPageId}
                                    onChange={(e) => setWidgetConfig(prev => ({ ...prev, facebookPageId: e.target.value }))}
                                    className="w-full bg-transparent py-2 text-xs focus:outline-none font-mono font-bold text-slate-700"
                                    placeholder="yourpageusername"
                                  />
                                </div>
                                <span className="text-[9px] text-slate-400 font-sans mt-1 block">ဝယ်သူမှ နှိပ်လိုက်ပါက ဤ Page ID ဖြင့် Messenger App သို့ တိုက်ရိုက် ရောက်ရှိသွားပါမည်။</span>
                              </div>

                              <div>
                                <label className="block text-[10px] uppercase text-slate-500 mb-1.5 font-mono font-bold">Button Display Text</label>
                                <div className="relative flex items-center">
                                  <MessageSquare className="absolute left-3.5 w-4 h-4 text-slate-400" />
                                  <input 
                                    type="text"
                                    value={widgetConfig.buttonText}
                                    onChange={(e) => setWidgetConfig(prev => ({ ...prev, buttonText: e.target.value }))}
                                    className="w-full bg-slate-50/50 border border-slate-200/85 hover:border-slate-300 rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 font-semibold text-slate-700 transition-all duration-200"
                                    placeholder="ချက်တင် စကားပြောမည်"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[10px] uppercase text-slate-500 mb-1.5 font-mono font-bold">Button Theme Color</label>
                                  <div className="flex gap-2 items-center">
                                    <input 
                                      type="color"
                                      value={widgetConfig.buttonColor}
                                      onChange={(e) => setWidgetConfig(prev => ({ ...prev, buttonColor: e.target.value }))}
                                      className="w-10 h-9.5 border border-slate-200/80 rounded-xl cursor-pointer shrink-0"
                                    />
                                    <div className="relative flex items-center w-full">
                                      <Palette className="absolute left-3 w-4 h-4 text-slate-400" />
                                      <input 
                                        type="text"
                                        value={widgetConfig.buttonColor}
                                        onChange={(e) => setWidgetConfig(prev => ({ ...prev, buttonColor: e.target.value }))}
                                        className="w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl pl-9.5 pr-3 py-2 text-xs font-mono text-slate-700"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-[10px] uppercase text-slate-500 mb-1.5 font-mono font-bold">Widget Position</label>
                                  <select
                                    value={widgetConfig.buttonPosition}
                                    onChange={(e) => setWidgetConfig(prev => ({ ...prev, buttonPosition: e.target.value as any }))}
                                    className="w-full bg-slate-50/50 border border-slate-200/85 hover:border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 text-slate-700 font-bold transition-all"
                                  >
                                    <option value="bottom-right">Bottom-Right (ညာဘက်အောက်)</option>
                                    <option value="bottom-left">Bottom-Left (ဘယ်ဘက်အောက်)</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                              <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider font-mono">Display Toggles & Settings</h4>
                              
                              <div className="space-y-3">
                                <label className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-150 cursor-pointer shadow-sm">
                                  <input 
                                    type="checkbox"
                                    checked={widgetConfig.isEnabled}
                                    onChange={(e) => setWidgetConfig(prev => ({ ...prev, isEnabled: e.target.checked }))}
                                    className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                                  />
                                  <div>
                                    <span className="font-bold text-slate-800 text-xs block">Enable Floating Button</span>
                                    <span className="text-[9px] text-slate-400">အသုံးပြုရန် ဖွင့်ထားမည် သို့မဟုတ် ပိတ်ထားမည်</span>
                                  </div>
                                </label>

                                <label className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-150 cursor-pointer shadow-sm">
                                  <input 
                                    type="checkbox"
                                    checked={widgetConfig.showOnMobile}
                                    onChange={(e) => setWidgetConfig(prev => ({ ...prev, showOnMobile: e.target.checked }))}
                                    className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                                  />
                                  <div>
                                    <span className="font-bold text-slate-800 text-xs block">Show on Mobile</span>
                                    <span className="text-[9px] text-slate-400">မိုဘိုင်းဖုန်းဖြင့် ဝင်ရောက်ကြည့်ရှုချိန်တွင် ပြသမည့်အခြေအနေ</span>
                                  </div>
                                </label>

                                <label className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-150 cursor-pointer shadow-sm">
                                  <input 
                                    type="checkbox"
                                    checked={widgetConfig.showOnDesktop}
                                    onChange={(e) => setWidgetConfig(prev => ({ ...prev, showOnDesktop: e.target.checked }))}
                                    className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                                  />
                                  <div>
                                    <span className="font-bold text-slate-800 text-xs block">Show on Desktop</span>
                                    <span className="text-[9px] text-slate-400">ကွန်ပြူတာများဖြင့် ဝင်ရောက်ကြည့်ရှုချိန်တွင် ပြသမည့်အခြေအနေ</span>
                                  </div>
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={async () => {
                                const ok = await saveWidgetSettings(widgetConfig);
                                if (ok) alert("✓ Widget Configuration saved successfully to database!");
                              }}
                              disabled={isSavingWidget}
                              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all flex items-center gap-2 shadow-md shadow-emerald-950/10"
                            >
                              {isSavingWidget ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  Saving Config...
                                </>
                              ) : (
                                "သိမ်းဆည်းမည် (Save Changes) ✓"
                              )}
                            </button>
                          </div>
                        </div>

                        {/* --- FACEBOOK CONNECTION & CHATBOT QUICK REPLIES BUILDER --- */}
                        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 gap-2">
                            <div>
                              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider font-mono flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${widgetConfig.isFacebookConnected ? "bg-emerald-500 animate-pulse" : "bg-blue-600"}`}></span> 
                                Facebook Integration (ManyChat Style Chatbot)
                              </h3>
                              <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                                Connect your official Facebook Business Page to unlock dynamic chatbot quick-reply menus and individual button tracking.
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2.5 shrink-0">
                              <span className="text-[10px] font-mono text-slate-400 font-bold">Connection State:</span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (widgetConfig.isFacebookConnected) {
                                    setWidgetConfig(prev => ({
                                      ...prev,
                                      isFacebookConnected: false,
                                      connectedPageAvatar: "",
                                      connectedPageName: "Akyoe Digital Store"
                                    }));
                                  } else {
                                    // Open simulated Facebook authentication dialog
                                    setTempPageName("Akyoe Digital Store");
                                    setTempPageCategory("Social Commerce Tools");
                                    setTempPageAvatar("");
                                    setIsFbConnectOpen(true);
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all flex items-center gap-1.5 shadow-sm ${
                                  widgetConfig.isFacebookConnected 
                                    ? "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100" 
                                    : "bg-blue-600 hover:bg-blue-500 text-white"
                                }`}
                              >
                                {widgetConfig.isFacebookConnected ? "Disconnect Page ✕" : "Connect with Facebook 🚀"}
                              </button>
                            </div>
                          </div>

                          {!widgetConfig.isFacebookConnected ? (
                            <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center space-y-3">
                              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-blue-100">
                                <Lock className="w-6 h-6 text-blue-600" />
                              </div>
                              <div className="max-w-md mx-auto space-y-1">
                                <h4 className="font-bold text-slate-700 text-xs">Chatbot Mode is Off</h4>
                                <p className="text-[10.5px] text-slate-400 leading-relaxed">
                                  Connect your Facebook page above. Once verified, you can replace standard direct links with an elegant, in-app messaging pop-up with custom tracked action buttons.
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs font-sans">
                              {/* Connected Page Status Card & Customizer */}
                              <div className="lg:col-span-4 space-y-4">
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-3.5">
                                  <h4 className="font-bold text-slate-700 text-[10px] uppercase font-mono tracking-wider">Connected Profile</h4>
                                  
                                  <div className="flex items-center gap-3">
                                    {widgetConfig.connectedPageAvatar ? (
                                      <img src={widgetConfig.connectedPageAvatar} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                                    ) : (
                                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-lg uppercase border-2 border-white shadow-sm">
                                        {widgetConfig.connectedPageName.charAt(0)}
                                      </div>
                                    )}
                                    <div className="space-y-0.5">
                                      <p className="font-bold text-slate-800 text-xs">{widgetConfig.connectedPageName}</p>
                                      <span className="text-[9px] text-slate-400 font-mono block">{widgetConfig.connectedPageCategory}</span>
                                      <span className="text-[8px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 px-1.5 py-0.2 rounded-full font-mono uppercase inline-block">● Verified</span>
                                    </div>
                                  </div>

                                  <div className="pt-2 border-t border-slate-200/60 space-y-3">
                                    <div>
                                      <label className="block text-[9px] uppercase text-slate-400 font-mono font-bold mb-1">Modify Connected Name</label>
                                      <input
                                        type="text"
                                        value={widgetConfig.connectedPageName}
                                        onChange={(e) => setWidgetConfig(prev => ({ ...prev, connectedPageName: e.target.value }))}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-bold focus:outline-none focus:border-blue-500"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] uppercase text-slate-400 font-mono font-bold mb-1">Page Category / Label</label>
                                      <input
                                        type="text"
                                        value={widgetConfig.connectedPageCategory}
                                        onChange={(e) => setWidgetConfig(prev => ({ ...prev, connectedPageCategory: e.target.value }))}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-bold focus:outline-none focus:border-blue-500"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] uppercase text-slate-400 font-mono font-bold mb-1">Custom Avatar URL (Optional)</label>
                                      <input
                                        type="text"
                                        value={widgetConfig.connectedPageAvatar}
                                        onChange={(e) => setWidgetConfig(prev => ({ ...prev, connectedPageAvatar: e.target.value }))}
                                        placeholder="https://example.com/avatar.png"
                                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-700 font-mono focus:outline-none focus:border-blue-500"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Chatbot Builder: Greeting & Dynamic List of Buttons */}
                              <div className="lg:col-span-8 space-y-4">
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-[10px] uppercase text-slate-500 mb-1.5 font-mono font-bold flex items-center justify-between">
                                      <span>Chatbot Greeting Bubble Text</span>
                                      <span className="text-slate-400 font-normal">Max 250 chars</span>
                                    </label>
                                    <textarea
                                      rows={2}
                                      value={widgetConfig.chatbotGreeting}
                                      onChange={(e) => setWidgetConfig(prev => ({ ...prev, chatbotGreeting: e.target.value }))}
                                      placeholder="သတ်မှတ်ထားသော Greeting စာသားကို ဤနေရာတွင် ရေးသားပါ..."
                                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-500 leading-relaxed"
                                    />
                                  </div>

                                  <div className="space-y-2.5">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider font-mono">Chatbot Tracking Buttons ({widgetConfig.chatbotButtons.length}/5)</h4>
                                      
                                      {widgetConfig.chatbotButtons.length < 5 && !isAddingButton && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setNewBtnLabel("");
                                            setNewBtnUrl("https://");
                                            setNewBtnTracking(`action_${Date.now().toString().slice(-4)}`);
                                            setIsAddingButton(true);
                                          }}
                                          className="text-[10px] text-blue-600 hover:text-blue-500 font-bold flex items-center gap-1"
                                        >
                                          <Plus className="w-3.5 h-3.5" /> Add Tracked Button
                                        </button>
                                      )}
                                    </div>

                                    {/* Form for adding a new button */}
                                    {isAddingButton && (
                                      <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3 text-xs">
                                        <div className="flex items-center justify-between">
                                          <span className="font-bold text-blue-800 text-[10px] uppercase font-mono">Configure New Tracking Button</span>
                                          <button 
                                            type="button"
                                            onClick={() => setIsAddingButton(false)}
                                            className="text-slate-400 hover:text-slate-600 font-bold"
                                          >
                                            Cancel
                                          </button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                          <div>
                                            <label className="block text-[9px] text-slate-500 font-mono uppercase mb-1">Button Label (e.g. 📦 စျေးနှုန်းများ)</label>
                                            <input
                                              type="text"
                                              value={newBtnLabel}
                                              onChange={(e) => setNewBtnLabel(e.target.value)}
                                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none text-slate-700 font-bold"
                                              placeholder="📦 ဝန်ဆောင်မှုနှုန်းထားများ"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-[9px] text-slate-500 font-mono uppercase mb-1">Destination Link (URL)</label>
                                            <input
                                              type="text"
                                              value={newBtnUrl}
                                              onChange={(e) => setNewBtnUrl(e.target.value)}
                                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none text-slate-700 font-mono"
                                              placeholder="https://akyoenetwork.com/pricing"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-[9px] text-slate-500 font-mono uppercase mb-1">Tracking ID (Event Name)</label>
                                            <input
                                              type="text"
                                              value={newBtnTracking}
                                              onChange={(e) => setNewBtnTracking(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none text-slate-700 font-mono"
                                              placeholder="pricing_view"
                                            />
                                          </div>
                                        </div>

                                        <div className="flex justify-end pt-1">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              if (!newBtnLabel || !newBtnUrl || !newBtnTracking) {
                                                alert("Please fill all properties correctly.");
                                                return;
                                              }
                                              const newBtn = {
                                                id: `btn-${Date.now()}`,
                                                label: newBtnLabel,
                                                url: newBtnUrl,
                                                trackingKey: newBtnTracking
                                              };
                                              setWidgetConfig(prev => ({
                                                ...prev,
                                                chatbotButtons: [...prev.chatbotButtons, newBtn]
                                              }));
                                              setIsAddingButton(false);
                                            }}
                                            className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow"
                                          >
                                            Add Button & Tracking ✓
                                          </button>
                                        </div>
                                      </div>
                                    )}

                                    {/* List of active buttons */}
                                    <div className="space-y-2">
                                      {widgetConfig.chatbotButtons.length === 0 ? (
                                        <p className="text-slate-400 italic text-center py-4">No buttons configured. Click "Add Tracked Button" above to add some!</p>
                                      ) : (
                                        widgetConfig.chatbotButtons.map((btn) => (
                                          <div key={btn.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-slate-300 transition-all shadow-sm">
                                            <div className="space-y-0.5">
                                              <p className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: widgetConfig.buttonColor }}></span>
                                                {btn.label}
                                              </p>
                                              <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                                                <span className="truncate max-w-[120px] sm:max-w-xs block" title={btn.url}>Link: {btn.url}</span>
                                                <span>|</span>
                                                <span className="text-blue-600 font-bold shrink-0">Event ID: btn_{btn.trackingKey}</span>
                                              </div>
                                            </div>

                                            <button
                                              type="button"
                                              onClick={() => {
                                                setWidgetConfig(prev => ({
                                                  ...prev,
                                                  chatbotButtons: prev.chatbotButtons.filter(b => b.id !== btn.id)
                                                }));
                                              }}
                                              className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                                              title="Remove Button"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </div>
                                        ))
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={async () => {
                                const ok = await saveWidgetSettings(widgetConfig);
                                if (ok) alert("✓ Full Chatbot & Page Configuration saved successfully to database!");
                              }}
                              disabled={isSavingWidget}
                              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all flex items-center gap-2 shadow-md shadow-indigo-950/10"
                            >
                              {isSavingWidget ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  Saving Setup...
                                </>
                              ) : (
                                "သိမ်းဆည်းမည် (Save Full Setup) ✓"
                              )}
                            </button>
                          </div>
                        </div>

                        {/* --- SIMULATED FACEBOOK CONNECT AUTHORIZATION MODAL --- */}
                        <AnimatePresence>
                          {isFbConnectOpen && (
                            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999999] flex items-center justify-center p-4">
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                                className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 font-sans"
                              >
                                {/* Facebook Branded Header */}
                                <div className="bg-[#1877F2] text-white p-5 flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white text-[#1877F2] font-extrabold flex items-center justify-center text-xl">
                                      f
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-sm">Akyoe SaaS Facebook Connect</h4>
                                      <p className="text-[10px] opacity-85">Secure OAuth Sandbox Authorization</p>
                                    </div>
                                  </div>
                                  <button 
                                    type="button"
                                    onClick={() => setIsFbConnectOpen(false)}
                                    className="text-white/80 hover:text-white text-xl font-bold"
                                  >
                                    &times;
                                  </button>
                                </div>

                                {/* Modal Body */}
                                <div className="p-6 space-y-4">
                                  <div className="space-y-1.5 text-xs">
                                    <h5 className="font-bold text-slate-800 text-xs">Authorize Page Access</h5>
                                    <p className="text-[10.5px] text-slate-500 leading-relaxed">
                                      In production, this opens Facebook's official OAuth window. For this sandbox, you can simulate authorization by naming your page and selecting a category.
                                    </p>
                                  </div>

                                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-3.5 text-xs">
                                    <div>
                                      <label className="block text-[9px] uppercase font-mono font-bold text-slate-400 mb-1">Select / Write Facebook Page Name</label>
                                      <input
                                        type="text"
                                        value={tempPageName}
                                        onChange={(e) => setTempPageName(e.target.value)}
                                        placeholder="e.g. Akyoe Digital Shop"
                                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-700 focus:outline-none focus:border-[#1877F2]"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-[9px] uppercase font-mono font-bold text-slate-400 mb-1">Business Category</label>
                                      <select
                                        value={tempPageCategory}
                                        onChange={(e) => setTempPageCategory(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-700 focus:outline-none"
                                      >
                                        <option value="Social Commerce Tools">Social Commerce Tools</option>
                                        <option value="Online Retailer & Shop">Online Retailer & Shop</option>
                                        <option value="Digital Marketing Agency">Digital Marketing Agency</option>
                                        <option value="Local Service Business">Local Service Business</option>
                                      </select>
                                    </div>

                                    <div>
                                      <label className="block text-[9px] uppercase font-mono font-bold text-slate-400 mb-1">Simulated Profile Picture (Avatar URL - Optional)</label>
                                      <input
                                        type="text"
                                        value={tempPageAvatar}
                                        onChange={(e) => setTempPageAvatar(e.target.value)}
                                        placeholder="https://images.unsplash.com/photo-..."
                                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-[10px] text-slate-600 focus:outline-none"
                                      />
                                      <span className="text-[8.5px] text-slate-400 mt-1 block">Leave empty to auto-generate a sleek initial avatar.</span>
                                    </div>
                                  </div>

                                  <div className="text-[10px] text-slate-400 flex items-start gap-1.5 leading-relaxed bg-blue-50/40 p-2.5 rounded-xl border border-blue-100/30">
                                    <Info className="w-4 h-4 text-[#1877F2] shrink-0 mt-0.5" />
                                    <span>By clicking Continue, Akyoe will receive public page metadata and permission to render chat widgets and track analytics logs.</span>
                                  </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-2 text-xs">
                                  <button
                                    type="button"
                                    onClick={() => setIsFbConnectOpen(false)}
                                    className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!tempPageName.trim()) {
                                        alert("Please enter a page name.");
                                        return;
                                      }
                                      // Set connection states
                                      setWidgetConfig(prev => ({
                                        ...prev,
                                        isFacebookConnected: true,
                                        connectedPageName: tempPageName,
                                        connectedPageCategory: tempPageCategory,
                                        connectedPageAvatar: tempPageAvatar.trim() || ""
                                      }));
                                      setIsFbConnectOpen(false);
                                      alert(`✓ Facebook Integration Active!\n\nPage "${tempPageName}" connected successfully to your Akyoe dashboard.`);
                                    }}
                                    className="bg-[#1877F2] hover:bg-[#156bec] text-white px-5 py-2 rounded-xl font-bold shadow-md shadow-[#1877f2]/10"
                                  >
                                    Continue as {tempPageName.split(" ")[0] || "User"}
                                  </button>
                                </div>
                              </motion.div>
                            </div>
                          )}
                        </AnimatePresence>

                        {/* --- ONE SCRIPT INSTALLATION MODULE --- */}
                        <div className="bg-slate-900 text-slate-200 p-5 rounded-3xl border border-slate-800 space-y-4 shadow-lg">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="p-1.5 bg-emerald-950 text-emerald-400 rounded-lg">
                                <PlusCircle className="w-4 h-4 text-emerald-400" />
                              </span>
                              <div>
                                <h4 className="font-bold font-mono text-xs sm:text-sm text-slate-200">🚀 Standalone Widget Copy & Paste Tag</h4>
                                <p className="text-[9px] text-slate-500 font-sans mt-0.5">Place this code block right before your closing body tag on any external website to embed tracking floating chat.</p>
                              </div>
                            </div>
                            <span className="text-[9px] bg-emerald-950 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded-lg border border-emerald-800">
                              Instant Integration
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                            သင့် Brand ၏ မည်သည့်ပြင်ပ Website (WordPress, Shopify, Elementor သို့မဟုတ် HTML ဆိုက်) တွင်မဆို ဤ **တစ်လိုင်းတည်းသော Script Tag** ကိုထည့်သွင်းရုံဖြင့် Floating Messenger ခလုတ်ကို အလိုအလျောက် ပေါ်ထွက်စေပြီး click နှိပ်မှုများကို ၁၀၀% တိကျစွာ လမ်းညွှန်ခြေရာခံနိုင်ပါပြီ။
                          </p>

                          <div className="relative">
                            <pre className="bg-slate-950 p-4 rounded-xl text-[10px] font-mono text-emerald-400 overflow-x-auto leading-relaxed border border-slate-850">
{`<!-- Akyoe Messenger SaaS Widget & Tracking Script -->
<script src="${window.location.origin}/widget.js"></script>`}
                            </pre>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`<!-- Akyoe Messenger SaaS Widget & Tracking Script -->\n<script src="${window.location.origin}/widget.js"></script>`);
                                alert("SaaS Widget Script copied to clipboard!");
                              }}
                              className="absolute top-2.5 right-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 border border-slate-700"
                            >
                              <Copy className="w-3 h-3" /> Copy Script
                            </button>
                          </div>

                          <div className="text-[9px] text-slate-500 font-mono flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
                            <span>Auto-detection for GA4 & Meta Pixel is fully enabled in this script. No additional pixel mapping is needed!</span>
                          </div>
                        </div>

                        {/* --- FUTURE PROOF MULTI CHANNEL ARCHITECTURE LIST --- */}
                        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                          <h3 className="font-bold text-slate-800 text-xs sm:text-sm uppercase tracking-wider font-mono">📡 SaaS Omni-Channel Future-Ready Integration</h3>
                          <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                            ကျွန်ုပ်တို့၏ Widget စနစ်ကို Omni-Channel ပုံစံဖြင့် တည်ဆောက်ထားသောကြောင့် နောင်တွင် ဝဘ်ဆိုက်ကုဒ်များကို လုံးဝပြင်ဆင်စရာမလိုဘဲ အောက်ပါ Chat လိုင်းသစ်များကို Admin Panel မှ ချက်ချင်း ဖွင့်လှစ် ခြေရာခံနိုင်ပါမည်။
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
                            <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-800">WhatsApp Chat</span>
                                <span className="text-[8px] bg-slate-200 text-slate-500 font-bold px-1.5 py-0.5 rounded uppercase">Coming Soon</span>
                              </div>
                              <p className="text-[10px] text-slate-400">Auto-routes customers directly to WhatsApp chat thread with template click tracking.</p>
                            </div>

                            <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-800">Telegram Channel</span>
                                <span className="text-[8px] bg-slate-200 text-slate-500 font-bold px-1.5 py-0.5 rounded uppercase">Coming Soon</span>
                              </div>
                              <p className="text-[10px] text-slate-400">Directly redirects users to your official channel or bot thread with automated pixel signals.</p>
                            </div>

                            <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-800">AI Support Bot</span>
                                <span className="text-[8px] bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold px-1.5 py-0.5 rounded uppercase animate-pulse">Researching</span>
                              </div>
                              <p className="text-[10px] text-slate-400">Smart Gemini-powered Myanmar conversational assistant that handles inquiries and reports conversions.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* --- SUB-TAB 2: REAL-TIME ANALYTICS DASHBOARD --- */}
                    {widgetSubTab === "analytics" && (
                      <div className="space-y-6 font-sans">
                        {/* Period summary stats widgets */}
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
                          <div className="bg-white p-4 rounded-2xl border border-slate-200/85 shadow-sm text-center space-y-1">
                            <span className="text-[9px] font-mono uppercase text-slate-400 font-bold">Total Clicks</span>
                            <p className="text-xl font-bold font-mono text-indigo-600">{widgetAnalytics.totalClicks}</p>
                            <span className="text-[8px] text-emerald-600 block font-mono font-bold">↑ 100% Tracking</span>
                          </div>

                          <div className="bg-white p-4 rounded-2xl border border-slate-200/85 shadow-sm text-center space-y-1">
                            <span className="text-[9px] font-mono uppercase text-slate-400 font-bold">Unique Visitors</span>
                            <p className="text-xl font-bold font-mono text-slate-800">{widgetAnalytics.uniqueVisitors}</p>
                            <span className="text-[8px] text-slate-400 block font-sans">Cookie deduplicated</span>
                          </div>

                          <div className="bg-white p-4 rounded-2xl border border-slate-200/85 shadow-sm text-center space-y-1">
                            <span className="text-[9px] font-mono uppercase text-slate-400 font-bold">Click-Through Rate</span>
                            <p className="text-xl font-bold font-mono text-emerald-600">{widgetAnalytics.clickRate}%</p>
                            <span className="text-[8px] text-emerald-600 block font-sans font-bold">Average conversion</span>
                          </div>

                          <div className="bg-white p-4 rounded-2xl border border-slate-200/85 shadow-sm text-center space-y-1">
                            <span className="text-[9px] font-mono uppercase text-slate-400 font-bold">Clicks (Today)</span>
                            <p className="text-xl font-bold font-mono text-slate-800">{widgetAnalytics.dailyClicks}</p>
                            <span className="text-[8px] text-slate-400 block font-sans">Past 24 hours</span>
                          </div>

                          <div className="bg-white p-4 rounded-2xl border border-slate-200/85 shadow-sm text-center space-y-1">
                            <span className="text-[9px] font-mono uppercase text-slate-400 font-bold">Clicks (Weekly)</span>
                            <p className="text-xl font-bold font-mono text-slate-800">{widgetAnalytics.weeklyClicks}</p>
                            <span className="text-[8px] text-slate-400 block font-sans">Past 7 days</span>
                          </div>

                          <div className="bg-white p-4 rounded-2xl border border-slate-200/85 shadow-sm text-center space-y-1">
                            <span className="text-[9px] font-mono uppercase text-slate-400 font-bold">Clicks (Monthly)</span>
                            <p className="text-xl font-bold font-mono text-slate-800">{widgetAnalytics.monthlyClicks}</p>
                            <span className="text-[8px] text-slate-400 block font-sans">Past 30 days</span>
                          </div>
                        </div>

                        {/* CHARTS CONTAINER (Recharts) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {/* Left: Weekly Trend line chart */}
                          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">📈 Weekly Click Volume Trend</h3>
                              <span className="text-[9px] text-slate-400 font-sans">Active Event Streams</span>
                            </div>

                            <div className="h-60 w-full text-xs font-mono">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={widgetAnalytics.daysTrend}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                  <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={9} />
                                  <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={9} />
                                  <RechartsTooltip />
                                  <Line type="monotone" dataKey="clicks" stroke="#0084FF" strokeWidth={3} activeDot={{ r: 8 }} dot={{ r: 4 }} />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          {/* Right: Device pie chart */}
                          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">📱 Device Breakdown Share</h3>
                              <span className="text-[9px] text-slate-400 font-sans">Deduplicated Vis</span>
                            </div>

                            <div className="h-60 w-full flex flex-col items-center justify-center">
                              {widgetAnalytics.totalClicks === 0 ? (
                                <p className="text-slate-400 text-xs italic">No device data logged yet. Click the floating widget on the bottom right to track some clicks!</p>
                              ) : (
                                <div className="w-full h-full flex items-center justify-between">
                                  <div className="w-1/2 h-full text-xs font-mono">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <PieChart>
                                        <Pie
                                          data={widgetAnalytics.deviceBreakdown}
                                          cx="50%"
                                          cy="50%"
                                          innerRadius={45}
                                          outerRadius={70}
                                          paddingAngle={4}
                                          dataKey="count"
                                          nameKey="device"
                                        >
                                          {widgetAnalytics.deviceBreakdown.map((entry, index) => {
                                            const COLORS = ["#6366F1", "#10B981", "#F59E0B"];
                                            return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                                          })}
                                        </Pie>
                                        <RechartsTooltip />
                                      </PieChart>
                                    </ResponsiveContainer>
                                  </div>
                                  <div className="w-1/2 space-y-2 text-[10px] font-mono">
                                    {widgetAnalytics.deviceBreakdown.map((d, index) => {
                                      const COLORS = ["#6366F1", "#10B981", "#F59E0B"];
                                      const pct = widgetAnalytics.totalClicks > 0 ? ((d.count / widgetAnalytics.totalClicks) * 100).toFixed(0) : 0;
                                      return (
                                        <div key={d.device} className="flex items-center justify-between p-1 border-b border-slate-50">
                                          <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                                            <span className="font-bold text-slate-600">{d.device}</span>
                                          </div>
                                          <span className="font-bold text-slate-800">{d.count} clicks ({pct}%)</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* DATA TABLES (Referrers, Pages, UTMs, Chatbot Buttons) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-xs font-sans">
                          {/* 1. Landing Pages Table */}
                          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                              <span className="p-1 bg-indigo-50 text-indigo-600 rounded">
                                <Globe className="w-3.5 h-3.5" />
                              </span>
                              <h4 className="font-bold text-slate-700">Top Landing Pages</h4>
                            </div>

                            <div className="space-y-1.5 max-h-56 overflow-y-auto">
                              {widgetAnalytics.topLandingPages.length === 0 ? (
                                <p className="text-slate-400 text-center py-6 italic text-[11px]">No pages logged yet.</p>
                              ) : (
                                widgetAnalytics.topLandingPages.map((page, idx) => (
                                  <div key={idx} className="p-2 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100/40">
                                    <span className="font-mono text-[10px] text-slate-600 truncate max-w-[120px]" title={page.url}>{page.url}</span>
                                    <span className="font-mono font-bold text-slate-800 shrink-0">{page.count} clicks</span>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {/* 2. Traffic Sources Table */}
                          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                              <span className="p-1 bg-emerald-50 text-emerald-600 rounded">
                                <Users className="w-3.5 h-3.5" />
                              </span>
                              <h4 className="font-bold text-slate-700">Top Traffic Sources</h4>
                            </div>

                            <div className="space-y-1.5 max-h-56 overflow-y-auto">
                              {widgetAnalytics.trafficSources.length === 0 ? (
                                <p className="text-slate-400 text-center py-6 italic text-[11px]">No source data logged.</p>
                              ) : (
                                widgetAnalytics.trafficSources.map((source, idx) => (
                                  <div key={idx} className="p-2 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100/40">
                                    <span className="font-bold text-slate-600 truncate max-w-[120px]">{source.source}</span>
                                    <span className="font-mono font-bold text-slate-800 shrink-0">{source.count} clicks</span>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {/* 3. UTM Campaigns Table */}
                          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                              <span className="p-1 bg-amber-50 text-amber-600 rounded">
                                <Megaphone className="w-3.5 h-3.5" />
                              </span>
                              <h4 className="font-bold text-slate-700">UTM Campaign Clicks</h4>
                            </div>

                            <div className="space-y-1.5 max-h-56 overflow-y-auto">
                              {widgetAnalytics.utmCampaignPerformance.length === 0 ? (
                                <p className="text-slate-400 text-center py-6 italic text-[11px]">No active campaigns traced yet.</p>
                              ) : (
                                widgetAnalytics.utmCampaignPerformance.map((camp, idx) => (
                                  <div key={idx} className="p-2 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100/40">
                                    <span className="font-mono text-[10px] font-bold text-slate-600 truncate max-w-[120px]">{camp.campaign}</span>
                                    <span className="font-mono font-bold text-slate-800 shrink-0">{camp.count} clicks</span>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {/* 4. Chatbot Buttons Table */}
                          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                              <span className="p-1 bg-sky-50 text-sky-600 rounded">
                                <MessageSquare className="w-3.5 h-3.5" />
                              </span>
                              <h4 className="font-bold text-slate-700">Chatbot Button Clicks</h4>
                            </div>

                            <div className="space-y-1.5 max-h-56 overflow-y-auto">
                              {!widgetConfig.isFacebookConnected ? (
                                <p className="text-slate-400 text-center py-6 italic text-[11px]">Facebook is disconnected. Turn on Chatbot Mode to track buttons.</p>
                              ) : !widgetAnalytics.chatbotButtonClicks || widgetAnalytics.chatbotButtonClicks.length === 0 ? (
                                <p className="text-slate-400 text-center py-6 italic text-[11px]">No custom button clicks logged yet.</p>
                              ) : (
                                widgetAnalytics.chatbotButtonClicks.map((btn, idx) => {
                                  const matchingConfig = widgetConfig.chatbotButtons.find(c => c.trackingKey === btn.key);
                                  const label = matchingConfig ? matchingConfig.label : btn.key;
                                  return (
                                    <div key={idx} className="p-2 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100/40">
                                      <div className="truncate max-w-[120px]">
                                        <p className="font-bold text-[11px] text-slate-700 truncate" title={label}>{label}</p>
                                        <span className="font-mono text-[8px] text-slate-400 block">Key: {btn.key}</span>
                                      </div>
                                      <span className="font-mono font-bold text-slate-800 shrink-0">{btn.count} clicks</span>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* --- SUB-TAB 3: COOKIE SPOOFER & MANUAL INJECTOR (Original Content) --- */}
                    {(widgetSubTab as any) === "spoofer" && (
                      <div className="space-y-6">
                        {/* Interactive Code Generator Tool */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-4 font-sans">
                          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">Dynamic Tracking Code Builder</h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Your Website Landing Page URL</label>
                              <input 
                                type="text"
                                value={brandLandingUrl}
                                onChange={(e) => setBrandLandingUrl(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 font-mono text-slate-700"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Select Mapping Product</label>
                              <select
                                value={brandSelectedProd}
                                onChange={(e) => setBrandSelectedProd(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 font-sans text-slate-700"
                              >
                                {products.map(p => (
                                  <option key={p.id} value={p.id}>{p.name} ({p.priceMMK.toLocaleString()} Ks)</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="space-y-4 pt-2">
                            {/* Visitor Pixel script */}
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-bold text-indigo-700 font-mono uppercase bg-indigo-50 px-2 py-0.5 rounded-md">အဆင့် ၁: Global Visitor Traffic Pixel (Landing Page ပေါ်တွင် ထည့်ရန်)</span>
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(`<!-- Akyoe Global Visitor Traffic Pixel -->\n<script>\n  (function(w,d,s,l,i){\n    w['AkyoePixel']=w['AkyoePixel']||function(){(w['AkyoePixel'].q=w['AkyoePixel'].q||[]).push(arguments)};\n    var f=d.getElementsByTagName(s)[0], j=d.createElement(s);\n    j.async=true; j.src='https://pixel.akyoe.com/sdk.js?id='+i;\n    f.parentNode.insertBefore(j,f);\n  })(window,document,'script','akyoe','${brandSelectedProd}');\n</script>`);
                                    alert("Visitor Pixel Code copied to clipboard!");
                                  }}
                                  className="text-[10px] text-emerald-600 hover:underline font-bold"
                                >
                                  Copy Code
                                </button>
                              </div>
                              <pre className="bg-slate-900 text-slate-300 rounded-xl p-3 text-[10px] font-mono overflow-x-auto leading-relaxed max-h-40">
{`<!-- Akyoe Global Visitor Traffic Pixel -->
<script>
  (function(w,d,s,l,i){
    w['AkyoePixel']=w['AkyoePixel']||function(){(w['AkyoePixel'].q=w['AkyoePixel'].q||[]).push(arguments)};
    var f=d.getElementsByTagName(s)[0], j=d.createElement(s);
    j.async=true; j.src='https://pixel.akyoe.com/sdk.js?id='+i;
    f.parentNode.insertBefore(j,f);
  })(window,document,'script','akyoe','${brandSelectedProd}');
</script>`}
                              </pre>
                            </div>

                            {/* Purchase conversion Pixel */}
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-bold text-emerald-700 font-mono uppercase bg-emerald-50 px-2 py-0.5 rounded-md">အဆင့် ၂: Purchase Conversion Pixel (ကျေးဇူးတင်လွှာစာမျက်နှာ / Thank You Page တွင် ထည့်ရန်)</span>
                                <button 
                                  onClick={() => {
                                    const matched = products.find(p => p.id === brandSelectedProd) || products[0];
                                    navigator.clipboard.writeText(`<!-- Akyoe Purchase Conversion Pixel -->\n<script>\n  window.AkyoePixel && window.AkyoePixel('track', 'Purchase', {\n    value: ${matched.priceMMK},\n    currency: 'MMK',\n    product_id: '${brandSelectedProd}'\n  });\n</script>`);
                                    alert("Conversion Pixel Code copied to clipboard!");
                                  }}
                                  className="text-[10px] text-emerald-600 hover:underline font-bold"
                                >
                                  Copy Code
                                </button>
                              </div>
                              <pre className="bg-slate-900 text-slate-300 rounded-xl p-3 text-[10px] font-mono overflow-x-auto leading-relaxed">
{`<!-- Akyoe Purchase Conversion Pixel -->
<script>
  window.AkyoePixel && window.AkyoePixel('track', 'Purchase', {
    value: ${(products.find(p => p.id === brandSelectedProd) || products[0]).priceMMK},
    currency: 'MMK',
    product_id: '${brandSelectedProd}'
  });
</script>`}
                              </pre>
                            </div>
                          </div>
                        </div>

                        {/* 🍪 Live Cookie Spoofer & Manual Cookie Injector */}
                        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                                <Settings className="w-4 h-4 text-indigo-500" />
                              </span>
                              <div>
                                <h3 className="font-bold text-slate-800 text-xs sm:text-sm uppercase tracking-wider font-mono">🍪 Live Cookie Spoofer & Manual Injector</h3>
                                <p className="text-[10px] text-slate-400 font-sans mt-0.5">Directly inject, update, or clear affiliate cookies to test referral attribution</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] bg-amber-50 text-amber-700 font-mono font-bold px-2 py-0.5 rounded-lg border border-amber-100 hidden sm:inline-block">
                                Sandbox Spoofer
                              </span>
                              <button
                                type="button"
                                onClick={() => setShowCookieSandbox(!showCookieSandbox)}
                                className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100/70 border border-indigo-200/50 px-2.5 py-1 rounded-xl transition-all font-sans shrink-0"
                              >
                                {showCookieSandbox ? "✕ Close Sandbox" : "⚙️ Open Sandbox"}
                              </button>
                            </div>
                          </div>

                          {showCookieSandbox && (
                            <div className="space-y-4 pt-3 border-t border-slate-100 animate-fade-in">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                                <div>
                                  <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">1. Select Target Product</label>
                                  <select
                                    value={manualCookieProduct}
                                    onChange={(e) => setManualCookieProduct(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-700"
                                  >
                                    {products.map(p => (
                                      <option key={p.id} value={p.id}>{p.name} ({p.priceMMK.toLocaleString()} Ks)</option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">2. Affiliate ID (ညွှန်းပို့သူ)</label>
                                  <input
                                    type="text"
                                    value={manualCookieAffiliate}
                                    onChange={(e) => setManualCookieAffiliate(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-mono uppercase font-bold text-slate-700"
                                    placeholder="e.g. AFF-101"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">3. Campaign TID (TID)</label>
                                  <input
                                    type="text"
                                    value={manualCookieTid}
                                    onChange={(e) => setManualCookieTid(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-mono text-slate-700"
                                    placeholder="e.g. fb_campaign"
                                  />
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleSetManualCookie(manualCookieAffiliate, manualCookieProduct, manualCookieTid)}
                                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-2 shadow-sm"
                                >
                                  <PlusCircle className="w-4 h-4" /> Inject Cookie Instantly ⚡
                                </button>
                                <button
                                  type="button"
                                  onClick={handleClearAllCookies}
                                  className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 font-bold py-2.5 rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4 text-slate-400" /> Clear All Cookies
                                </button>
                              </div>

                              {/* Visual Repository of Cookie Logs */}
                              <div className="pt-3 border-t border-slate-100 space-y-2">
                                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Active Cookie Repository ({clickLogs.length})</span>
                                {clickLogs.length === 0 ? (
                                  <div className="p-4 text-center text-slate-400 text-xs italic bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    No active cookies saved. Use the tool above to set or mock a cookie instantly!
                                  </div>
                                ) : (
                                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden max-h-40 overflow-y-auto bg-slate-50/50">
                                    {clickLogs.map((h, i) => {
                                      const matchedProd = products.find(p => p.id === h.productId);
                                      return (
                                        <div key={h.id || i} className="p-2.5 flex justify-between items-center text-xs bg-white">
                                          <div className="space-y-0.5">
                                            <div className="flex items-center gap-1.5">
                                              <span className="font-bold text-slate-800 font-mono bg-slate-100 px-1 py-0.5 rounded text-[10px]">{h.affiliateId}</span>
                                              <span className="text-slate-300">|</span>
                                              <span className="text-[10px] text-indigo-600 font-semibold">{matchedProd?.name || h.productId}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                                              <span>TID: {h.tid || "direct"}</span>
                                              <span>•</span>
                                              <span>{h.timestamp}</span>
                                            </div>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setClickLogs(prev => prev.filter(item => item.id !== h.id));
                                              alert(`Cleared cookie for affiliate "${h.affiliateId}" on product "${h.productId}".`);
                                            }}
                                            className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-100 transition-all shrink-0"
                                            title="Delete cookie"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Simple Myanmar Explanation card */}
                        <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl space-y-2.5 text-xs text-slate-700 leading-relaxed font-sans">
                          <div className="flex items-center gap-2 text-emerald-800 font-bold">
                            <Info className="w-4 h-4 text-emerald-600" />
                            <span>ခြေရာခံပုံစံ အကျဉ်းချုပ်ရှင်းလင်းချက် (How it works?)</span>
                          </div>
                          <ol className="list-decimal list-inside space-y-1.5 text-slate-600 pl-1 text-[11px]">
                            <li>
                              ညွှန်းပို့သူက ညွှန်းလင့်ခ် (Hoplink) ကို လူမှုကွန်ရက်တွင် ဝေမျှပြီး ဝယ်ယူသူက နှိပ်လိုက်သောအခါ Akyoe Network မှ ဝယ်သူ၏ Browser တွင် Affiliate ID Cookie တစ်လိုအလျောက် သတ်မှတ်လိုက်ပါမည်။
                            </li>
                            <li>
                              ဝယ်သူသည် သင့် Website Landing Page သို့ ရောက်ရှိချိန်တွင် <strong>Global Traffic Pixel</strong> က အဆိုပါ Cookie ကို ဖတ်ယူပြီး IP, Session တို့ဖြင့် ချိတ်ဆက်လိုက်ပါမည်။
                            </li>
                            <li>
                              ဝယ်ယူသူ ငွေပေးချေမှုအောင်မြင်ပြီး သင့်ဆိုက်ရှိ ကျေးဇူးတင်လွှာစာမျက်နှာသို့ ရောက်ရှိသွားချိန်တွင် <strong>Purchase Conversion Pixel</strong> ကုဒ် စတင်အလုပ်လုပ်ပြီး ညွှန်းပို့သူကို ကော်မရှင်ခွဲဝေမှု (Commission Split) စနစ်တကျ အလိုအလျောက် ပေးအပ်လိုက်ပါမည်။
                            </li>
                          </ol>
                        </div>

                        {/* 📡 Live Traffic & Pixel Tracker merged here for minimalism */}
                        <div className="pt-4 border-t border-slate-150 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Activity className="w-4 h-4 text-emerald-600" />
                              <h3 className="font-bold text-slate-800 text-xs sm:text-sm uppercase tracking-wider font-mono">Traffic & Pixel Real-time Tracker</h3>
                            </div>
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-mono font-bold px-2 py-0.5 rounded-lg border border-emerald-100 animate-pulse">
                              Live event stream
                            </span>
                          </div>

                          <div className="bg-slate-950 text-emerald-400 rounded-2xl p-4 font-mono text-[11px] space-y-3 shadow-inner border border-slate-850">
                            <div className="flex justify-between items-center text-[10px] text-slate-500 border-b border-slate-900 pb-2">
                              <span>📡 Live Pixel Event Stream</span>
                              <span>Auto-refresh active</span>
                            </div>

                            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                              {pixelLogs.length === 0 ? (
                                <div className="text-slate-600 text-center py-6">No traffic log detected yet. Simulate some link clicks above!</div>
                              ) : (
                                pixelLogs.map((log) => (
                                  <div key={log.id} className="space-y-1 border-b border-slate-900 pb-2 last:border-0 last:pb-0">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                                          log.eventType === "purchase"
                                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                            : log.eventType === "page_view"
                                              ? "bg-indigo-950 text-indigo-300 border border-indigo-800"
                                              : "bg-slate-900 text-slate-400 border border-slate-800"
                                        }`}>
                                          {log.eventType}
                                        </span>
                                        <span className="text-[9px] text-slate-500">{log.timestamp}</span>
                                      </div>
                                      <span className="text-[8px] text-slate-650">{log.id}</span>
                                    </div>
                                    <p className="text-slate-300 leading-relaxed text-[11px]">{log.details}</p>
                                    <div className="flex gap-4 text-[9px] text-slate-500">
                                      <span>Product: <strong className="text-slate-400">{log.productId}</strong></span>
                                      <span>Affiliate: <strong className="text-slate-400">{log.affiliateId}</strong></span>
                                      {log.tid && <span>TID: <strong className="text-slate-400">{log.tid}</strong></span>}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 📦 TAB: MERCHANT PRODUCT CATALOG */}
                {activeTab === "brand-products" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-emerald-600" />
                        <h2 className="text-lg font-display font-bold text-slate-800">ကိုယ်ပိုင်ထုတ်ကုန်များ (Merchant Catalog)</h2>
                      </div>
                    </div>

                    {/* Add Product Form */}
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!brandProdName.trim()) {
                        alert("Please fill in the Product Name.");
                        return;
                      }
                      const newId = `PROD-${Math.floor(100 + Math.random() * 900)}`;
                      const newProduct = {
                        id: newId,
                        name: brandProdName.trim(),
                        priceMMK: brandProdPrice,
                        commissionPercent: brandProdComm,
                        category: brandProdCat,
                        authorId: "BRAND-VEND",
                        authorName: "My Brand (You)",
                        gravityScore: 0,
                        avgSaleMMK: Math.round(brandProdPrice * (brandProdComm / 100)),
                        hasRebill: brandProdRebill,
                        rebillMMK: brandProdRebill ? brandProdRebillAmount : undefined
                      };
                      setProducts(prev => [newProduct, ...prev]);
                      alert(`အောင်မြင်ပါသည်: "${brandProdName}" ကို Marketplace Offer Directory ထဲသို့ အောင်မြင်စွာ ပေါင်းထည့်ပြီးပါပြီ! ညွှန်းပို့သူများက ဤထုတ်ကုန်ကို ချက်ချင်း စတင် ပရိုမိုးရှင်း လုပ်နိုင်ပါပြီ।`);
                      setBrandProdName("");
                    }} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-4">
                      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <Plus className="w-4 h-4 text-emerald-600" />
                        Marketplace သို့ ထုတ်ကုန်အသစ်တင်သွင်းရန်
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Product Name</label>
                          <input 
                            type="text"
                            value={brandProdName}
                            onChange={(e) => setBrandProdName(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 font-sans text-slate-800"
                            placeholder="e.g. Chatbot Builder Software Course"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Product Category</label>
                          <select
                            value={brandProdCat}
                            onChange={(e) => setBrandProdCat(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 font-sans text-slate-700"
                          >
                            <option value="Software">Software & Tech</option>
                            <option value="Education">Education & Courses</option>
                            <option value="Health">Health & Fitness</option>
                            <option value="E-Commerce">E-Commerce & Retail</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Product Price (Ks)</label>
                          <input 
                            type="number"
                            value={brandProdPrice}
                            onChange={(e) => setBrandProdPrice(parseInt(e.target.value) || 0)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 font-mono text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Affiliate Commission Split (%)</label>
                          <input 
                            type="number"
                            value={brandProdComm}
                            onChange={(e) => setBrandProdComm(parseInt(e.target.value) || 0)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 font-mono text-slate-800"
                            min="0"
                            max="100"
                          />
                        </div>

                        <div className="sm:col-span-2 pt-1 flex items-center gap-2">
                          <input 
                            type="checkbox"
                            id="hasRebillBrand"
                            checked={brandProdRebill}
                            onChange={(e) => setBrandProdRebill(e.target.checked)}
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <label htmlFor="hasRebillBrand" className="text-[11px] text-slate-600 font-sans select-none">
                            Enable Subscription/Monthly Rebill (လစဉ်ကြေးစနစ် ဖွင့်မည်)
                          </label>
                        </div>

                        {brandProdRebill && (
                          <div className="sm:col-span-2 bg-white p-3 rounded-xl border border-slate-200/50">
                            <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Monthly Rebill Amount (Ks)</label>
                            <input 
                              type="number"
                              value={brandProdRebillAmount}
                              onChange={(e) => setBrandProdRebillAmount(parseInt(e.target.value) || 0)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 font-mono text-slate-800"
                            />
                          </div>
                        )}
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl transition-all text-xs font-sans shadow-md shadow-emerald-950/10"
                      >
                        Marketplace ပေါ်သို့ ထုတ်ကုန် တင်သွင်းမည် ✓
                      </button>
                    </form>

                    {/* Catalog Guide */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-xs text-slate-500 leading-relaxed font-sans space-y-1">
                      <p className="font-bold text-slate-700">📌 Marketplace Offers Note:</p>
                      <p>
                        လုပ်ငန်းရှင် (Brand) တင်လိုက်သော ထုတ်ကုန်မှန်သမျှကို Marketplace အပိုင်းသို့ ပြောင်းလဲကြည့်ရှုပါက ချက်ချင်းတွေ့မြင်ရမည်ဖြစ်ပြီး Affiliate များမှ Hoplinks ထုတ်ယူ၍ လူမှုကွန်ရက်တွင် ဝိုင်းဝန်းကြော်ငြာပေးနိုင်ပါသည်။
                      </p>
                    </div>
                  </div>
                )}



                {/* 🌐 TAB: BRANDED LANDING PAGES (SaaS Engine) */}
                {activeTab === "saas-landing-pages" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-lg font-display font-bold text-slate-800">Branded Landing Pages (SaaS)</h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingBrandId(null);
                          setBName("");
                          setBSlug("");
                          setBFbId("");
                          setBFbUrl("");
                          setBLogo("");
                          setBCover("");
                          setBDesc("");
                          setBPromo("");
                          setBHours("Daily: 9:00 AM - 6:00 PM");
                          setBPhone("");
                          setBEmail("");
                          setBAddress("");
                          setBTheme("#0084FF");
                          setBPixelId("");
                          setBGaId("");
                          setIsBrandFormOpen(true);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" /> Create Landing Page
                      </button>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      Create highly optimized, zero-website-required branded landing pages for your business. Visitors from Facebook, TikTok, or Google Ads are tracked dynamically before transitioning seamlessly to your Facebook Messenger.
                    </p>

                    {/* FORM FOR ADDING / EDITING LANDING PAGE */}
                    {isBrandFormOpen && (
                      <div className="bg-slate-50 p-5 rounded-2xl border border-indigo-100/80 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <h3 className="text-xs font-bold font-mono uppercase text-indigo-800">
                            {editingBrandId ? "Edit Landing Page Profile" : "Configure New Landing Page"}
                          </h3>
                          <button
                            type="button"
                            onClick={() => setIsBrandFormOpen(false)}
                            className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        </div>

                        {/* Presets Row to make it easy */}
                        {!editingBrandId && (
                          <div className="p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100/50 space-y-1.5">
                            <span className="text-[10px] font-bold text-indigo-700 font-mono block">⚡ Quick Setup Demo Presets:</span>
                            <div className="flex flex-wrap gap-2 text-[10px]">
                              <button
                                type="button"
                                onClick={() => {
                                  setBName("Grace Fashion & Accessories");
                                  setBSlug("grace-fashion");
                                  setBFbId("grace.fashion.mm");
                                  setBFbUrl("https://facebook.com/grace.fashion.mm");
                                  setBLogo("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150&auto=format&fit=crop&q=80");
                                  setBCover("https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80");
                                  setBDesc("Premium imported ladies wear, shoes, and handbags. High-quality items sourced directly from Bangkok & Seoul.");
                                  setBPromo("✨ Bangkok Premium Arrival! GET 10% OFF plus Free Delivery when you click to chat on Messenger!");
                                  setBHours("Daily: 8:00 AM - 10:00 PM");
                                  setBPhone("+95 9 1234 5678");
                                  setBEmail("gracefashion.mm@gmail.com");
                                  setBAddress("No. 124, Pyay Road, Kamayut Township, Yangon");
                                  setBTheme("#EC4899");
                                }}
                                className="px-2.5 py-1 bg-white hover:bg-pink-50 text-pink-700 rounded-lg border border-pink-100 font-bold transition-all"
                              >
                                Boutique Shop 👗
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setBName("Lotus Dental Clinic");
                                  setBSlug("lotus-dental");
                                  setBFbId("lotus.dental.yangon");
                                  setBFbUrl("https://facebook.com/lotus.dental.yangon");
                                  setBLogo("https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=150&auto=format&fit=crop&q=80");
                                  setBCover("https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80");
                                  setBDesc("Professional, safe, and modern family dental care in Yangon. Cosmetic dentistry, implants, braces, and general scaling services.");
                                  setBPromo("🦷 Free Consultation Coupon! Tap 'Chat on Messenger' and send 'FREE_CONSULT' to secure yours.");
                                  setBHours("Monday - Saturday: 9:00 AM - 8:00 PM");
                                  setBPhone("+95 9 8765 4321");
                                  setBEmail("info@lotusdental.com.mm");
                                  setBAddress("Lotus Plaza, Kabar Aye Pagodarow Road, Bahan Township, Yangon");
                                  setBTheme("#10B981");
                                }}
                                className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 font-bold transition-all"
                              >
                                Dental Clinic 🦷
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setBName("Aura Automotive");
                                  setBSlug("aura-auto");
                                  setBFbId("aura.auto.mm");
                                  setBFbUrl("https://facebook.com/aura.auto.mm");
                                  setBLogo("https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=150&auto=format&fit=crop&q=80");
                                  setBCover("https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80");
                                  setBDesc("Luxury car importing, premium support, and authentic custom upgrades. Explore premium vehicles from Tokyo and Munich.");
                                  setBPromo("🚗 Book a VIP showroom test-drive session. Click below to message our premium concierge!");
                                  setBHours("Daily: 9:00 AM - 6:00 PM");
                                  setBPhone("+95 9 5555 4444");
                                  setBEmail("contact@auramm.com");
                                  setBAddress("Aura Hub, Ward (5), Hlaing Township, Yangon");
                                  setBTheme("#F59E0B");
                                }}
                                className="px-2.5 py-1 bg-white hover:bg-amber-50 text-amber-700 rounded-lg border border-amber-100 font-bold transition-all"
                              >
                                Luxury Cars 🚗
                              </button>
                            </div>
                          </div>
                        )}

                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            if (!bName.trim() || !bSlug.trim() || !bFbId.trim()) {
                              alert("Please fill in Brand Name, URL Slug, and Facebook Page Username.");
                              return;
                            }
                            const payload = {
                              name: bName,
                              slug: bSlug.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                              logo: bLogo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
                              cover: bCover || "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&auto=format&fit=crop&q=80",
                              description: bDesc,
                              facebookPageId: bFbId,
                              facebookPageUrl: bFbUrl || `https://facebook.com/${bFbId}`,
                              promotionBanner: bPromo,
                              businessHours: bHours,
                              phone: bPhone,
                              email: bEmail,
                              address: bAddress,
                              themeColor: bTheme,
                              metaPixelId: bPixelId,
                              googleAnalyticsId: bGaId,
                              products: []
                            };

                            try {
                              const url = editingBrandId ? `/api/chat/brands/${editingBrandId}` : "/api/chat/brands";
                              const method = editingBrandId ? "PUT" : "POST";
                              const res = await fetch(url, {
                                method,
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(payload)
                              });

                              if (res.ok) {
                                alert(editingBrandId ? "✓ Branded Landing Page profile updated successfully!" : "✓ Branded Landing Page created successfully!");
                                setIsBrandFormOpen(false);
                                setEditingBrandId(null);
                                fetchSaasBrands();
                              } else {
                                const err = await res.json();
                                alert(`Error: ${err.message || "Failed to save Brand landing page"}`);
                              }
                            } catch (err) {
                              console.error("Error saving brand:", err);
                              alert("Failed to communicate with SaaS API server.");
                            }
                          }}
                          className="space-y-6 text-xs font-sans"
                        >
                          {/* SECTION 1: PRIMARY PROFILE */}
                          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                            <h4 className="text-xs font-bold text-indigo-900 font-mono flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold">1</span>
                              PRIMARY BRAND PROFILE
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1 font-bold">1. Business Name (လုပ်ငန်းအမည်) *</label>
                                <div className="relative flex items-center">
                                  <Building2 className="absolute left-3.5 w-4 h-4 text-slate-400" />
                                  <input
                                    type="text"
                                    value={bName}
                                    onChange={(e) => setBName(e.target.value)}
                                    className="w-full bg-slate-50/50 border border-slate-200/80 hover:border-slate-350 rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 font-bold text-slate-800 transition-all"
                                    placeholder="e.g. Grace Boutique"
                                    required
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1 font-bold">2. Landing URL Slug (mydomain.com/chat/slug) *</label>
                                <div className="relative flex items-center">
                                  <Link2 className="absolute left-3.5 w-4 h-4 text-slate-400" />
                                  <input
                                    type="text"
                                    value={bSlug}
                                    onChange={(e) => setBSlug(e.target.value)}
                                    disabled={!!editingBrandId}
                                    className="w-full bg-slate-50/50 border border-slate-200/80 hover:border-slate-350 rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 font-mono text-indigo-600 font-bold disabled:bg-slate-100 transition-all"
                                    placeholder="e.g. grace-fashion"
                                    required
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1 font-bold">3. Facebook Page Username/ID *</label>
                                <div className="relative flex items-center">
                                  <MessageCircle className="absolute left-3.5 w-4 h-4 text-slate-400" />
                                  <input
                                    type="text"
                                    value={bFbId}
                                    onChange={(e) => setBFbId(e.target.value)}
                                    className="w-full bg-slate-50/50 border border-slate-200/80 hover:border-slate-350 rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 font-mono text-slate-850 transition-all"
                                    placeholder="e.g. grace.boutique.yangon (used in m.me link)"
                                    required
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1 font-bold">4. Facebook Page Link (Full URL)</label>
                                <div className="relative flex items-center">
                                  <ExternalLink className="absolute left-3.5 w-4 h-4 text-slate-400" />
                                  <input
                                    type="text"
                                    value={bFbUrl}
                                    onChange={(e) => setBFbUrl(e.target.value)}
                                    className="w-full bg-slate-50/50 border border-slate-200/80 hover:border-slate-350 rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 font-sans text-slate-800 transition-all"
                                    placeholder="https://facebook.com/grace.boutique.yangon"
                                  />
                                </div>
                              </div>

                              <div className="md:col-span-2">
                                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1 font-bold">5. Business Description (လုပ်ငန်းအကြောင်းအကျဉ်း)</label>
                                <div className="relative">
                                  <FileText className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                                  <textarea
                                    value={bDesc}
                                    onChange={(e) => setBDesc(e.target.value)}
                                    rows={2}
                                    className="w-full bg-slate-50/50 border border-slate-200/80 hover:border-slate-350 rounded-2xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 text-slate-700 transition-all"
                                    placeholder="Tell visitors about your products, high-quality sourcing, policy, etc."
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* SECTION 2: BRANDING & MARKETING */}
                          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                            <h4 className="text-xs font-bold text-indigo-900 font-mono flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold">2</span>
                              VISUAL THEME & MARKETING BANNERS
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">6. Business Logo (Image URL)</label>
                                <div className="relative flex items-center">
                                  <Compass className="absolute left-3.5 w-4 h-4 text-slate-400" />
                                  <input
                                    type="text"
                                    value={bLogo}
                                    onChange={(e) => setBLogo(e.target.value)}
                                    className="w-full bg-slate-50/50 border border-slate-200/80 hover:border-slate-350 rounded-2xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 font-mono text-slate-600 transition-all"
                                    placeholder="https://images.unsplash.com/..."
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">7. Business Cover Banner (Image URL)</label>
                                <div className="relative flex items-center">
                                  <Layout className="absolute left-3.5 w-4 h-4 text-slate-400" />
                                  <input
                                    type="text"
                                    value={bCover}
                                    onChange={(e) => setBCover(e.target.value)}
                                    className="w-full bg-slate-50/50 border border-slate-200/80 hover:border-slate-350 rounded-2xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 font-mono text-slate-600 transition-all"
                                    placeholder="https://images.unsplash.com/..."
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">8. Theme Brand Color</label>
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="color"
                                    value={bTheme}
                                    onChange={(e) => setBTheme(e.target.value)}
                                    className="w-10 h-9.5 border border-slate-200 rounded-xl cursor-pointer shrink-0"
                                  />
                                  <div className="relative flex items-center w-full">
                                    <Palette className="absolute left-3.5 w-4 h-4 text-slate-400" />
                                    <input
                                      type="text"
                                      value={bTheme}
                                      onChange={(e) => setBTheme(e.target.value)}
                                      className="w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl pl-9.5 pr-4 py-2 text-xs font-mono text-slate-700 transition-all focus:outline-none focus:border-indigo-500"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">9. Promotion Banner Text (လတ်တလောပရိုမိုးရှင်း)</label>
                                <div className="relative flex items-center">
                                  <Sparkles className="absolute left-3.5 w-4 h-4 text-slate-400" />
                                  <input
                                    type="text"
                                    value={bPromo}
                                    onChange={(e) => setBPromo(e.target.value)}
                                    className="w-full bg-slate-50/50 border border-slate-200/80 hover:border-slate-350 rounded-2xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 text-slate-700 transition-all"
                                    placeholder="e.g. ✨ New Collection Sales! Get 10% OFF!"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* SECTION 3: CONTACT & INTEGRATIONS */}
                          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                            <h4 className="text-xs font-bold text-indigo-900 font-mono flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold">3</span>
                              CONTACT INFORMATION & ANALYTICS
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">10. Contact Phone (ဖုန်းနံပါတ်)</label>
                                <div className="relative flex items-center">
                                  <Phone className="absolute left-3.5 w-4 h-4 text-slate-400" />
                                  <input
                                    type="text"
                                    value={bPhone}
                                    onChange={(e) => setBPhone(e.target.value)}
                                    className="w-full bg-slate-50/50 border border-slate-200/80 hover:border-slate-350 rounded-2xl pl-10 pr-4 py-2 text-xs font-mono transition-all focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 text-slate-700"
                                    placeholder="+95 9 1234 5678"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">11. Contact Email (အီးမေးလ်)</label>
                                <div className="relative flex items-center">
                                  <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
                                  <input
                                    type="text"
                                    value={bEmail}
                                    onChange={(e) => setBEmail(e.target.value)}
                                    className="w-full bg-slate-50/50 border border-slate-200/80 hover:border-slate-350 rounded-2xl pl-10 pr-4 py-2 text-xs font-mono transition-all focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 text-slate-700"
                                    placeholder="contact@gracefashion.com"
                                  />
                                </div>
                              </div>

                              <div className="md:col-span-2">
                                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">12. Business Address (လိပ်စာအပြည့်အစုံ)</label>
                                <div className="relative flex items-center">
                                  <MapPin className="absolute left-3.5 w-4 h-4 text-slate-400" />
                                  <input
                                    type="text"
                                    value={bAddress}
                                    onChange={(e) => setBAddress(e.target.value)}
                                    className="w-full bg-slate-50/50 border border-slate-200/80 hover:border-slate-350 rounded-2xl pl-10 pr-4 py-2 text-xs font-sans transition-all focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 text-slate-700"
                                    placeholder="No. 123, Pyay Road, Bahan, Yangon"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1 font-bold">13. Meta Pixel Tracking ID (Optional)</label>
                                <div className="relative flex items-center">
                                  <Settings className="absolute left-3.5 w-4 h-4 text-slate-400" />
                                  <input
                                    type="text"
                                    value={bPixelId}
                                    onChange={(e) => setBPixelId(e.target.value)}
                                    className="w-full bg-slate-50/50 border border-slate-200/80 hover:border-slate-350 rounded-2xl pl-10 pr-4 py-2 text-xs font-mono transition-all focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 text-slate-700"
                                    placeholder="e.g. 543120987654321"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1 font-bold">14. Google Analytics ID (GA4) (Optional)</label>
                                <div className="relative flex items-center">
                                  <Activity className="absolute left-3.5 w-4 h-4 text-slate-400" />
                                  <input
                                    type="text"
                                    value={bGaId}
                                    onChange={(e) => setBGaId(e.target.value)}
                                    className="w-full bg-slate-50/50 border border-slate-200/80 hover:border-slate-350 rounded-2xl pl-10 pr-4 py-2 text-xs font-mono transition-all focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 text-slate-700"
                                    placeholder="e.g. G-ABC123XYZ"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => setIsBrandFormOpen(false)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
                            >
                              Discard
                            </button>
                            <button
                              type="submit"
                              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md shadow-indigo-950/10 transition-all hover:scale-[1.02]"
                            >
                              {editingBrandId ? "Save Profile Changes ✓" : "Launch Website Landing Page 🚀"}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* BRANDS LIST CARD MATRIX */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {saasBrands.length === 0 ? (
                        <div className="col-span-2 p-10 bg-slate-50 border border-dashed border-slate-200 text-center space-y-3 rounded-2xl">
                          <p className="text-slate-400 text-xs italic">No branded landing pages registered yet. Use the presets above to deploy your very first website substitute!</p>
                        </div>
                      ) : (
                        saasBrands.map((brand) => (
                          <div
                            key={brand.id}
                            className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
                          >
                            {/* Cover banner frame */}
                            <div className="h-28 relative bg-slate-100 overflow-hidden shrink-0">
                              <img
                                src={brand.cover || "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&auto=format&fit=crop&q=80"}
                                alt={brand.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-slate-900/75 backdrop-blur-md text-white py-1 px-2.5 rounded-full text-[9px] font-mono font-bold">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: brand.themeColor || "#0084FF" }}></span>
                                {brand.slug}
                              </div>
                            </div>

                            {/* Body block with overlap logo */}
                            <div className="p-4 pt-1.5 flex-1 flex flex-col relative">
                              {/* Circle Brand logo */}
                              <div className="w-12 h-12 rounded-full border-2 border-white bg-white overflow-hidden shadow absolute -top-6 left-4 shrink-0">
                                <img
                                  src={brand.logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80"}
                                  alt={brand.name}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>

                              <div className="pl-14 pt-0.5 space-y-1 flex-1">
                                <h3 className="font-bold text-slate-800 text-sm whitespace-normal break-words" title={brand.name}>{brand.name}</h3>
                                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed h-8 mb-2">
                                  {brand.description || "No description provided."}
                                </p>

                                {/* Contact snippet details */}
                                <div className="space-y-0.5 text-[9.5px] text-slate-500 font-mono">
                                  <div className="flex items-center gap-1">
                                    <MessageSquare className="w-3 h-3 text-indigo-500 shrink-0" />
                                    <span className="break-all">Page: <span className="text-indigo-600 font-bold">{brand.facebookPageId}</span></span>
                                  </div>
                                  {brand.phone && (
                                    <div className="flex items-center gap-1">
                                      <Activity className="w-3 h-3 text-slate-400 shrink-0" />
                                      <span>Call: {brand.phone}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Landing link line */}
                              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[9.5px] font-mono font-bold text-slate-400">Live Landing link:</span>
                                <a
                                  href={`/chat/${brand.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                                >
                                  /chat/{brand.slug} <ExternalLink className="w-3 h-3 text-indigo-400" />
                                </a>
                              </div>

                              {/* SaaS Control Action Buttons */}
                              <div className="mt-3 grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingBrandId(brand.id);
                                    setBName(brand.name);
                                    setBSlug(brand.slug);
                                    setBFbId(brand.facebookPageId);
                                    setBFbUrl(brand.facebookPageUrl || "");
                                    setBLogo(brand.logo);
                                    setBCover(brand.cover);
                                    setBDesc(brand.description);
                                    setBPromo(brand.promotionBanner || "");
                                    setBHours(brand.businessHours || "Daily: 9:00 AM - 6:00 PM");
                                    setBPhone(brand.phone || "");
                                    setBEmail(brand.email || "");
                                    setBAddress(brand.address || "");
                                    setBTheme(brand.themeColor || "#0084FF");
                                    setBPixelId(brand.metaPixelId || "");
                                    setBGaId(brand.googleAnalyticsId || "");
                                    setIsBrandFormOpen(true);
                                  }}
                                  className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-[10px] font-semibold flex items-center justify-center gap-1"
                                >
                                  <Edit2 className="w-3 h-3" /> Edit Profile
                                </button>

                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (!confirm(`Are you sure you want to delete ${brand.name}? This cannot be undone.`)) return;
                                    try {
                                      const res = await fetch(`/api/chat/brands/${brand.id}`, { method: "DELETE" });
                                      if (res.ok) {
                                        alert("✓ Landing Page deleted successfully.");
                                        fetchSaasBrands();
                                      } else {
                                        alert("Failed to delete brand.");
                                      }
                                    } catch (err) {
                                      console.error("Error deleting brand:", err);
                                    }
                                  }}
                                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-xl text-[10px] font-semibold flex items-center justify-center gap-1"
                                >
                                  <Trash2 className="w-3 h-3" /> Delete Page
                                </button>

                                <button
                                  type="button"
                                  onClick={async () => {
                                    // Simulated PPC traffic generator for this brand
                                    try {
                                      const payload = {
                                        brandId: brand.id,
                                        brandSlug: brand.slug,
                                        utmSource: ["facebook", "google", "tiktok", "instagram", "qr_code", "newsletter"][Math.floor(Math.random() * 6)],
                                        utmMedium: ["ppc", "cpc", "social", "qr", "email"][Math.floor(Math.random() * 5)],
                                        utmCampaign: ["spring_deal", "chatbot_promo_v1", "mega_ads_yangon", "aff_referral"][Math.floor(Math.random() * 4)],
                                        referrer: ["https://facebook.com", "https://google.com.mm", "https://tiktok.com", "Direct"][Math.floor(Math.random() * 4)],
                                        browser: ["Chrome", "Safari", "Firefox", "Edge"][Math.floor(Math.random() * 4)],
                                        os: ["iOS", "Android", "Windows", "MacOS"][Math.floor(Math.random() * 4)],
                                        device: ["Mobile", "Desktop", "Tablet"][Math.floor(Math.random() * 3)],
                                        country: ["Myanmar", "Thailand", "Singapore", "Japan"][Math.floor(Math.random() * 4)],
                                        simulateClick: Math.random() > 0.35 // 65% chance they also click "Chat on Messenger"!
                                      };

                                      // Send dynamic tracking record
                                      const trackRes = await fetch("/api/chat/track", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                          brandId: payload.brandId,
                                          brandSlug: payload.brandSlug,
                                          utmSource: payload.utmSource,
                                          utmMedium: payload.utmMedium,
                                          utmCampaign: payload.utmCampaign,
                                          referrer: payload.referrer,
                                          browser: payload.browser,
                                          os: payload.os,
                                          device: payload.device,
                                          country: payload.country,
                                          language: "my-MM"
                                        })
                                      });

                                      if (trackRes.ok) {
                                        const trackingData = await trackRes.json();
                                        if (payload.simulateClick && trackingData.visitorId) {
                                          // Immediately simulate a CTA Click on Messenger
                                          await fetch("/api/chat/click", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({
                                              brandId: payload.brandId,
                                              brandSlug: payload.brandSlug,
                                              visitorId: trackingData.visitorId,
                                              sessionId: trackingData.sessionId,
                                              utmSource: payload.utmSource,
                                              utmMedium: payload.utmMedium,
                                              utmCampaign: payload.utmCampaign,
                                              destinationUrl: `https://m.me/${brand.facebookPageId}`
                                            })
                                          });
                                        }

                                        alert(`✓ [PPC Sandbox Simulated Visit Logged!] Registered visit from ${payload.country} via ${payload.utmSource} (${payload.device}). ${payload.simulateClick ? "User clicked 'Chat on Messenger'!" : "User bounced."}`);
                                      }
                                    } catch (err) {
                                      console.error("Traffic simulator error:", err);
                                    }
                                  }}
                                  className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1"
                                  title="Simulate a cold PPC ad visit & click to check SaaS Analytics"
                                >
                                  <Play className="w-3.5 h-3.5 text-indigo-600 animate-pulse" /> Spoofer Ads
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}


                {/* 📊 TAB: SAAS ANALYTICS (No Web) */}
                {activeTab === "saas-analytics" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 gap-2">
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-lg font-display font-bold text-slate-800">SaaS Traffic Analytics (No Web Platform)</h2>
                      </div>

                      {/* Brand selector dropdown */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Select Brand:</span>
                        <select
                          value={selectedAnalyticsBrand}
                          onChange={(e) => {
                            setSelectedAnalyticsBrand(e.target.value);
                            fetchSaasAnalytics(e.target.value);
                          }}
                          className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-bold focus:outline-none focus:border-indigo-500"
                        >
                          <option value="all">All Branded Landing Pages</option>
                          {saasBrands.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      Real-time granular traffic analysis tracking landing page visits, referral channels, UTM campaigns, and direct Messenger clicks. This acts as the complete central command center for headless social media commerce traffic monitoring.
                    </p>

                    {/* KPI widgets blocks */}
                    {!saasAnalyticsData ? (
                      <div className="p-8 text-center bg-slate-50 rounded-2xl">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto text-slate-400 mb-1" />
                        <span className="text-xs text-slate-400 italic">Compiling SaaS metrics...</span>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Visitor Sessions</span>
                            <span className="text-xl font-bold font-mono text-slate-800">
                              {saasAnalyticsData.totalVisits || 0}
                            </span>
                            <div className="text-[9px] text-slate-400 mt-1">Unique page loads</div>
                          </div>

                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Messenger Clicks</span>
                            <span className="text-xl font-bold font-mono text-indigo-600">
                              {saasAnalyticsData.totalClicks || 0}
                            </span>
                            <div className="text-[9px] text-slate-400 mt-1">Conversations started</div>
                          </div>

                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Click-Through Rate (CTR)</span>
                            <span className="text-xl font-bold font-mono text-emerald-600">
                              {saasAnalyticsData.ctrRate || 0}%
                            </span>
                            <div className="text-[9px] text-slate-400 mt-1">Visit-to-Chat ratio</div>
                          </div>

                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Deduplicated Visitors</span>
                            <span className="text-xl font-bold font-mono text-slate-800">
                              {saasAnalyticsData.uniqueVisitors || 0}
                            </span>
                            <div className="text-[9px] text-slate-400 mt-1">Cookie-tracked users</div>
                          </div>
                        </div>

                        {/* Visual Chart Trends & Devices Share */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          {/* Daily Trend line */}
                          <div className="md:col-span-2 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">📅 Past 7 Days Traffic Trend</h3>
                              <span className="text-[9px] text-slate-400 font-mono">Daily volume</span>
                            </div>

                            <div className="h-60 w-full text-xs font-mono">
                              {(!saasAnalyticsData.trendSeries || saasAnalyticsData.trendSeries.length === 0) ? (
                                <div className="h-full flex items-center justify-center text-slate-400 italic">No trend data available. Use Spoofer Ads generator on the Branded Landing Pages tab!</div>
                              ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={saasAnalyticsData.trendSeries}>
                                    <defs>
                                      <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                                      </linearGradient>
                                      <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                      </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" stroke="#94A3B8" fontSize={9} />
                                    <YAxis stroke="#94A3B8" fontSize={9} />
                                    <RechartsTooltip />
                                    <Area type="monotone" dataKey="visits" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#colorVisits)" name="Visits" />
                                    <Area type="monotone" dataKey="clicks" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorClicks)" name="Messenger Chats" />
                                  </AreaChart>
                                </ResponsiveContainer>
                              )}
                            </div>
                          </div>

                          {/* Devices split */}
                          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">📱 Device Split Share</h3>
                              <span className="text-[9px] text-slate-400 font-mono">Mobile dominance</span>
                            </div>

                            <div className="h-60 w-full flex flex-col justify-center items-center">
                              {(!saasAnalyticsData.deviceBreakdown || saasAnalyticsData.deviceBreakdown.length === 0 || saasAnalyticsData.totalVisits === 0) ? (
                                <div className="text-slate-400 text-xs italic text-center py-10">No device data logged yet.</div>
                              ) : (
                                <div className="w-full h-full flex flex-col justify-between p-2">
                                  <div className="h-2/3 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <PieChart>
                                        <Pie
                                          data={saasAnalyticsData.deviceBreakdown}
                                          cx="50%"
                                          cy="50%"
                                          innerRadius={40}
                                          outerRadius={65}
                                          paddingAngle={5}
                                          dataKey="count"
                                          nameKey="device"
                                        >
                                          {saasAnalyticsData.deviceBreakdown.map((entry: any, index: number) => {
                                            const COLORS = ["#4F46E5", "#10B981", "#F59E0B"];
                                            return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                                          })}
                                        </Pie>
                                        <RechartsTooltip />
                                      </PieChart>
                                    </ResponsiveContainer>
                                  </div>
                                  <div className="space-y-1.5 text-[9px] font-mono">
                                    {saasAnalyticsData.deviceBreakdown.map((d: any, index: number) => {
                                      const COLORS = ["#4F46E5", "#10B981", "#F59E0B"];
                                      const pct = saasAnalyticsData.totalVisits > 0 ? ((d.count / saasAnalyticsData.totalVisits) * 100).toFixed(0) : 0;
                                      return (
                                        <div key={d.device} className="flex items-center justify-between p-1 bg-slate-50 rounded-lg">
                                          <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                            <span className="font-bold text-slate-600">{d.device}</span>
                                          </div>
                                          <span className="font-bold text-slate-800">{d.count} ({pct}%)</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Traffic lists grids */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
                          {/* UTM campaigns */}
                          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                              <span className="p-1 bg-indigo-50 text-indigo-600 rounded">
                                <Megaphone className="w-3.5 h-3.5" />
                              </span>
                              <h4 className="font-bold text-slate-700">Top UTM Campaigns</h4>
                            </div>

                            <div className="space-y-1.5 max-h-52 overflow-y-auto">
                              {(!saasAnalyticsData.utmCampaigns || saasAnalyticsData.utmCampaigns.length === 0) ? (
                                <p className="text-slate-400 text-center py-6 italic text-[11px]">No campaign records.</p>
                              ) : (
                                saasAnalyticsData.utmCampaigns.map((camp: any, idx: number) => (
                                  <div key={idx} className="p-2 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100/40">
                                    <span className="font-mono text-[10px] font-bold text-slate-600 truncate max-w-[120px]">{camp.campaign}</span>
                                    <span className="font-mono font-bold text-slate-800 shrink-0">{camp.count} views</span>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {/* Referrers */}
                          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                              <span className="p-1 bg-emerald-50 text-emerald-600 rounded">
                                <Users className="w-3.5 h-3.5" />
                              </span>
                              <h4 className="font-bold text-slate-700">Traffic Referrers</h4>
                            </div>

                            <div className="space-y-1.5 max-h-52 overflow-y-auto">
                              {(!saasAnalyticsData.referrers || saasAnalyticsData.referrers.length === 0) ? (
                                <p className="text-slate-400 text-center py-6 italic text-[11px]">No referrer records.</p>
                              ) : (
                                saasAnalyticsData.referrers.map((ref: any, idx: number) => (
                                  <div key={idx} className="p-2 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100/40">
                                    <span className="font-bold text-slate-600 truncate max-w-[120px]">{ref.referrer}</span>
                                    <span className="font-mono font-bold text-slate-800 shrink-0">{ref.count} views</span>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {/* Country */}
                          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                              <span className="p-1 bg-amber-50 text-amber-600 rounded">
                                <Globe className="w-3.5 h-3.5" />
                              </span>
                              <h4 className="font-bold text-slate-700">Countries Breakdown</h4>
                            </div>

                            <div className="space-y-1.5 max-h-52 overflow-y-auto">
                              {(!saasAnalyticsData.countries || saasAnalyticsData.countries.length === 0) ? (
                                <p className="text-slate-400 text-center py-6 italic text-[11px]">No country data yet.</p>
                              ) : (
                                saasAnalyticsData.countries.map((c: any, idx: number) => (
                                  <div key={idx} className="p-2 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100/40">
                                    <span className="font-bold text-slate-600 truncate max-w-[120px]">{c.country}</span>
                                    <span className="font-mono font-bold text-slate-800 shrink-0">{c.count} views</span>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {/* Browser */}
                          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                              <span className="p-1 bg-sky-50 text-sky-600 rounded">
                                <Settings className="w-3.5 h-3.5" />
                              </span>
                              <h4 className="font-bold text-slate-700">Browser Share</h4>
                            </div>

                            <div className="space-y-1.5 max-h-52 overflow-y-auto">
                              {(!saasAnalyticsData.browsers || saasAnalyticsData.browsers.length === 0) ? (
                                <p className="text-slate-400 text-center py-6 italic text-[11px]">No browser data logged.</p>
                              ) : (
                                saasAnalyticsData.browsers.map((b: any, idx: number) => (
                                  <div key={idx} className="p-2 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100/40">
                                    <span className="font-mono font-bold text-slate-600 truncate max-w-[120px]">{b.browser}</span>
                                    <span className="font-mono font-bold text-slate-800 shrink-0">{b.count} views</span>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}



                {/* 🛒 TAB: MARKETPLACE OFFERS */}
                {activeTab === "marketplace" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-emerald-600" />
                        <h2 className="text-lg font-display font-bold text-slate-800">Affiliate Offer Marketplace</h2>
                      </div>
                    </div>

                    {!isPromoting && (
                      <>
                        {/* Two-Column Category Sub-Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      
                      {/* Left Sidebar: Categories List */}
                      <aside className="md:col-span-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/80 space-y-3">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                            ကဏ္ဍများ (Categories)
                          </span>
                        </div>
                        <div className="space-y-1">
                          {[
                            { id: "All", name: "All Categories", myanName: "ကဏ္ဍအားလုံး", count: products.length, icon: Globe },
                            { id: "Software", name: "Software & SaaS", myanName: "ဆော့ဖ်ဝဲလ်", count: products.filter(p => p.category === "Software").length, icon: Laptop },
                            { id: "Education", name: "Education & Courses", myanName: "ဗီဒီယိုသင်တန်း", count: products.filter(p => p.category === "Education").length, icon: BookOpen },
                            { id: "eBook & Code", name: "eBooks & Guides", myanName: "ဒစ်ဂျစ်တယ်စာအုပ်", count: products.filter(p => p.category === "eBook & Code").length, icon: FileText },
                            { id: "Health", name: "Health & Wellness", myanName: "ကျန်းမာရေး", count: products.filter(p => p.category === "Health").length, icon: Activity },
                          ].map((cat) => {
                            const Icon = cat.icon;
                            const isActive = selectedCategory === cat.id;
                            return (
                              <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-150 border text-xs ${
                                  isActive
                                    ? "bg-emerald-50 border-emerald-100 text-emerald-800 font-bold shadow-sm"
                                    : "bg-white border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                                  <div className="truncate">
                                    <span className="block font-medium">{cat.name}</span>
                                    <span className="block text-[10px] text-slate-400 font-normal leading-tight">{cat.myanName}</span>
                                  </div>
                                </div>
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold shrink-0 ${
                                  isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                                }`}>
                                  {cat.count}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </aside>

                      {/* Right Panel: Lists of Brands to Promote */}
                      <div className="md:col-span-8 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                            ရွေးချယ်ထားသော ကဏ္ဍမှ ပစ္စည်းများ ({filteredProducts.length})
                          </span>
                        </div>

                        {/* Search Field inside right panel */}
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                          <input
                            type="text"
                            placeholder="အမည် သို့မဟုတ် ဖန်တီးသူဖြင့် ရှာဖွေရန်..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-emerald-500 font-sans"
                          />
                        </div>

                        {/* Offers Cards */}
                        <div className="space-y-3">
                          {filteredProducts.map((p, idx) => (
                            <div key={p.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-emerald-500/40 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative">
                              <div className="space-y-1.5 flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 bg-white border border-slate-200 text-slate-600 rounded-md shadow-sm">{p.category}</span>
                                  {p.hasRebill && (
                                    <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md flex items-center gap-1">
                                      <Clock className="w-2.5 h-2.5" /> Rebill
                                    </span>
                                  )}
                                </div>
                                <h4 className="font-bold text-slate-800 font-display text-sm whitespace-normal break-words">{p.name}</h4>
                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-mono text-slate-400 pt-0.5">
                                  <span>ဖန်တီးသူ: <strong className="text-slate-600">{p.authorName}</strong></span>
                                  <span>•</span>
                                  <span>ဈေးနှုန်း: <strong className="text-slate-600">{p.priceMMK.toLocaleString()} Ks</strong></span>
                                </div>
                              </div>

                              <div className="flex sm:flex-col items-end gap-3.5 w-full sm:w-auto shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                                <div className="text-right flex-1 sm:flex-none">
                                  <div className="text-[9px] uppercase font-bold text-slate-400">ပျှမ်းမျှကော်မရှင်</div>
                                  <div className="text-xs font-bold text-emerald-600 font-mono">{p.avgSaleMMK.toLocaleString()} Ks</div>
                                </div>
                                <div className="text-right hidden sm:block">
                                  <div className="text-[9px] uppercase font-bold text-slate-400">Gravity Score</div>
                                  <div className="text-[11px] font-bold text-indigo-600 font-mono">{p.gravityScore}</div>
                                </div>

                                <div className="relative inline-block w-full sm:w-auto">
                                  <button
                                    onClick={() => {
                                      setSelectedProductId(p.id);
                                      setIsPromoting(true);
                                      setAffiliateSidebarTab("hoplink");
                                      handleGenerateHoplink(p.id, activeAffiliateInput);
                                      if (showGuide && activeGuideTab === "affiliate" && guideStep === 0) {
                                        setGuideStep(1);
                                      }
                                    }}
                                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all shrink-0 hover:scale-[1.03]"
                                  >
                                    Promote <ArrowRight className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}

                          {filteredProducts.length === 0 && (
                            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed">
                              ရှာဖွေမှုနှင့် ကိုက်ညီသော ပစ္စည်းများ မရှိသေးပါ။
                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* 💡 SLEEK MINIMALIST HINT BANNER */}
                    <div className="bg-emerald-50/80 border border-emerald-200/50 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs text-slate-700 mt-6 shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-sans">
                          စနစ်အသုံးပြုပုံကို တစ်ဆင့်ချင်း လေ့လာရန် ထိပ်ဆုံးဘားရှိ <strong className="text-emerald-700">📖 How It Works</strong> ခလုတ်ကို နှိပ်ပြီး လမ်းညွှန်ချက် Popup ကို ကြည့်ရှုနိုင်ပါသည်။
                        </span>
                      </div>
                      <button
                        onClick={() => setShowGuide(true)}
                        className="text-emerald-600 hover:text-emerald-700 font-bold font-sans text-[11.5px] underline shrink-0 whitespace-nowrap"
                      >
                        လမ်းညွှန်ဖွင့်မည် →
                      </button>
                    </div>

                    {/* 🔗 SECURE HOPLINK ENGINE & CREATOR AD-NETWORK CONTROL PANEL */}
                    <div id="hoplink-generator-panel" className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8 shadow-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs uppercase tracking-wider font-mono">
                          <Shuffle className="w-4 h-4 text-emerald-600 animate-pulse" />
                          <span>Secure Hoplink Engine & Ad Settings</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                          ဤစနစ်အား ညာဘက်ခြမ်းရှိ <strong className="text-emerald-700">Secure Hoplink Engine & Ad Settings</strong> ကတ်တွင် ပိုမိုပြည့်စုံစွာ ပေါင်းစပ်ထားရှိပြီး ဖြစ်ပါသည်။
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const panel = document.getElementById("combined-hoplink-sidebar-panel");
                          panel?.scrollIntoView({ behavior: "smooth" });
                          // Add a temporary subtle highlight effect
                          panel?.classList.add("ring-2", "ring-emerald-500", "transition-all");
                          setTimeout(() => {
                            panel?.classList.remove("ring-2", "ring-emerald-500");
                          }, 1500);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shrink-0 transition-all shadow-sm flex items-center gap-1 hover:scale-[1.02]"
                      >
                        ညာဘက်ကတ်သို့ သွားမည် <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}

                {isPromoting && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Selected Product Summary Header & Back Button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 shadow-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg shadow-sm">Active Promotion</span>
                          <span className="text-xs text-slate-500">for</span>
                          <span className="font-bold text-slate-800 text-sm">{(products.find(p => p.id === selectedProductId) || products[0]).name}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                          သင့်အတွက် ကော်မရှင်ခွဲဝေမှုနှုန်း: <strong className="text-emerald-700">{(products.find(p => p.id === selectedProductId) || products[0]).commissionPercent}%</strong> (ပျှမ်းမျှ {(products.find(p => p.id === selectedProductId) || products[0]).avgSaleMMK.toLocaleString()} Ks)
                        </p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => setIsPromoting(false)}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md transition-all shrink-0 hover:scale-[1.02]"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Products List
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                        <Shuffle className="w-5 h-5 text-emerald-600 animate-pulse" />
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm sm:text-base font-display">Secure Hoplink Engine & Ad Settings</h3>
                          <p className="text-[10px] sm:text-xs text-slate-500 font-sans mt-0.5">Generate tracking links and configure sponsored interstitial advertisement preferences for your traffic.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Hoplink Generator Form Card */}
                        <div className="lg:col-span-6 bg-white p-5 rounded-3xl border border-slate-200/80 space-y-4 shadow-sm">
                          <div className="border-b border-slate-100 pb-2">
                            <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider font-mono">Hoplink Generator Control Panel</h4>
                          </div>

                          <div className="space-y-4 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">1. Select Target Product</label>
                                <select 
                                  value={selectedProductId}
                                  onChange={(e) => setSelectedProductId(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-500"
                                >
                                  {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                  ))}
                                </select>
                              </div>

                              <div className="relative">
                                <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">2. Affiliate Account Nickname</label>
                                <input 
                                  type="text"
                                  value={activeAffiliateInput}
                                  onChange={(e) => setActiveAffiliateInput(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-800 font-mono"
                                  placeholder="e.g. MYAFF-101"
                                />

                                {/* 💡 USER GUIDE TOOLTIP FOR GENERATING HOPLINK (AFFILIATE STEP 2) */}
                                {showGuide && activeGuideTab === "affiliate" && guideStep === 1 && (
                                  <div className="absolute left-0 top-full mt-2.5 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl p-4 shadow-2xl shadow-emerald-950/40 border border-emerald-500/40 w-72 text-xs animate-bounce-short">
                                    <div className="absolute -top-1.5 left-6 w-3 h-3 bg-slate-950 rotate-45 border-l border-t border-emerald-500/40" />
                                    <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1 font-display">
                                      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                      အဆင့် ၂: လင့်ခ် ထုတ်ယူရန်
                                    </div>
                                    <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                                      ဤနေရာတွင် သင့်အကောင့်အမည် (Affiliate Account ID) ကို ထည့်သွင်းပြီး အောက်ရှိ 'Generate Encrypted Hoplink' ခလုတ်ကို နှိပ်ပါ။
                                    </p>
                                    <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-800 font-sans">
                                      <button
                                        onClick={() => setGuideStep(0)}
                                        className="text-[10px] text-slate-400 hover:text-white font-bold transition-colors"
                                      >
                                        ← နောက်သို့
                                      </button>
                                      <button
                                        onClick={() => {
                                          handleGenerateHoplink(selectedProductId, activeAffiliateInput);
                                          setGuideStep(2);
                                        }}
                                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md shadow-emerald-950/40 transition-all"
                                      >
                                        လင့်ခ်ထုတ်ပြီး ရှေ့သို့ →
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">3. Tracking ID Parameter (TID) (Optional)</label>
                              <input 
                                type="text"
                                value={activeTidInput}
                                onChange={(e) => setActiveTidInput(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-800 font-mono"
                                placeholder="e.g. facebook_ad_campaign_july"
                              />
                            </div>

                            <button
                              onClick={() => handleGenerateHoplink(selectedProductId, activeAffiliateInput)}
                              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider font-mono transition-all shadow-sm"
                            >
                              Generate Encrypted Hoplink
                            </button>
                          </div>

                          {generatedHoplink && (
                            <div className="bg-emerald-50/70 border border-emerald-100 p-4 rounded-2xl space-y-3 pt-3.5">
                              <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase block">Generated Hoplink Result</span>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="text" 
                                  readOnly 
                                  value={generatedHoplink}
                                  className="bg-white border border-emerald-200 text-xs font-mono rounded-xl px-3 py-2 flex-1 text-emerald-800 focus:outline-none"
                                />
                                <button
                                  onClick={handleCopyLink}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1"
                                >
                                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copiedLink ? "Copied" : "Copy"}
                                </button>
                              </div>
                              <div className="flex gap-2 pt-1">
                                <div className="relative inline-block w-full">
                                  <button
                                    onClick={handleTriggerHopClick}
                                    className="w-full sm:w-auto bg-white hover:bg-emerald-100 border border-emerald-200 text-[10px] font-mono font-bold text-emerald-700 px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5 animate-pulse" /> Simulate Click (Hop)
                                  </button>

                                  {/* 💡 USER GUIDE TOOLTIP FOR SIMULATING CLICK (AFFILIATE STEP 3 & CUSTOMER STEP 1) */}
                                  {showGuide && ((activeGuideTab === "affiliate" && guideStep === 2) || (activeGuideTab === "customer" && guideStep === 0)) && (
                                    <div className="absolute left-0 top-full mt-2.5 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl p-4 shadow-2xl shadow-emerald-950/40 border border-emerald-500/40 w-72 text-xs animate-bounce-short">
                                      <div className="absolute -top-1.5 left-6 w-3 h-3 bg-slate-950 rotate-45 border-l border-t border-emerald-500/40" />
                                      <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1 font-display">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                        {activeGuideTab === "affiliate" ? "အဆင့် ၃: လင့်ခ် နှိပ်မှု စမ်းသပ်ခြင်း" : "အဆင့် ၁: လင့်ခ်ကို နှိပ်ရန်"}
                                      </div>
                                      <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                                        {activeGuideTab === "affiliate"
                                          ? "ဤ 'Simulate Click' ခလုတ်ကို နှိပ်လိုက်ခြင်းဖြင့် customer တစ်ဦး သင့်လင့်ခ်ကို နှိပ်ပြီး ဝင်လာသည့် Cookie/Fingerprint ပုံစံတူစမ်းသပ်မှုကို ပြုလုပ်နိုင်ပါသည်!"
                                          : "ဤနေရာရှိ 'Simulate Click' ခလုတ်ကို နှိပ်ပြီး ညွှန်းဆိုသူ ပေးပို့လိုက်သောလင့်ခ်မှ ဝယ်ယူသူ ဝင်ရောက်လာသည့်ပုံစံကို စမ်းသပ်လိုက်ပါ!"}
                                      </p>
                                      <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-800 font-sans">
                                        <button
                                          onClick={() => setGuideStep(prev => Math.max(0, prev - 1))}
                                          className="text-[10px] text-slate-400 hover:text-white font-bold transition-colors"
                                        >
                                          ← နောက်သို့
                                        </button>
                                        <button
                                          onClick={() => {
                                            handleTriggerHopClick();
                                            setSimulatorTab("sales");
                                            setGuideStep(activeGuideTab === "affiliate" ? 3 : 1);
                                          }}
                                          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md shadow-emerald-950/40 transition-all"
                                        >
                                          နှိပ်ပြီး ရှေ့သို့ →
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Creator & Affiliate Ad-Revenue Sharing Control Panel */}
                        <div className="lg:col-span-6 bg-white p-5 rounded-3xl border border-slate-200/80 space-y-4 shadow-sm relative overflow-hidden">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <span className="p-1 bg-indigo-50 text-indigo-700 rounded-lg shrink-0">
                                <Megaphone className="w-4 h-4" />
                              </span>
                              <h4 className="font-bold text-slate-800 font-display text-xs sm:text-sm">ကြော်ငြာပြသမှု တံခါးပေါက် (Ad Switch)</h4>
                            </div>
                            
                            {/* Toggle Switch */}
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setAllowAdvertisements(!allowAdvertisements);
                                  if (isAdPlaying) setIsAdPlaying(false);
                                }}
                                className={`w-11 h-5.5 flex items-center rounded-full p-0.5 transition-all ${
                                  allowAdvertisements ? "bg-indigo-600" : "bg-slate-350"
                                }`}
                              >
                                <div
                                  className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-all duration-200 ${
                                    allowAdvertisements ? "translate-x-5.5" : "translate-x-0"
                                  }`}
                                />
                              </button>
                            </div>
                          </div>
                          
                          <div className="text-[10.5px] text-slate-500 font-sans leading-relaxed space-y-1">
                            <p className="font-bold text-indigo-800">💡 ဖန်တီးသူနှင့် ညွှန်းပို့သူများအတွက် အသုံးဝင်ပုံ လမ်းညွှန်:</p>
                            <ul className="list-disc pl-4 space-y-0.5">
                              <li><strong>ကြော်ငြာဖွင့်ထားလျှင် (On):</strong> KBZPay/WavePay Checkout သို့မဟုတ် Hoplink စာမျက်နှာတွင် အခြားလုပ်ငန်းရှင်များ၏ ကြော်ငြာများကို ၁၅ စက္ကန့်၊ စက္ကန့် ၃၀ သို့မဟုတ် စက္ကန့် ၆၀ တိုတောင်းသော ဗီဒီယို/စာတန်း ပုံစံဖြင့် ပြသမည်ဖြစ်ပြီး သင့်အတွက် အပိုဆုကြေး (Ad Premium) ၂.၅% ကို ချက်ချင်း ပေါင်းထည့်ပေးပါမည်။</li>
                              <li><strong>ကြော်ငြာပိတ်ထားလျှင် (Off):</strong> မည်သည့်ကြော်ငြာမျှ ပြသမည်မဟုတ်ဘဲ အခြေခံ ကော်မရှင်ခွဲဝေမှုစနစ်အတိုင်းသာ ဆက်လက်လည်ပတ်မည် ဖြစ်ပါသည်။</li>
                            </ul>
                          </div>

                          <AnimatePresence initial={false}>
                            {allowAdvertisements ? (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden pt-2 border-t border-slate-100"
                              >
                                <div className="space-y-3">
                                  <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase block">ခွင့်ပြုလိုသည့် ကြော်ငြာအမျိုးအစားများ (Allowed Ad Categories)</span>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                    {[
                                      { id: "Any", name: "Any Category", nameMm: "Any (မည်သည့်ကြော်ငြာမဆို)" },
                                      { id: "Food", name: "Food & Restaurant", nameMm: "Food (အစားအသောက်)" },
                                      { id: "Cosmetics", name: "Cosmetics & Beauty", nameMm: "Cosmetics (အလှကုန်)" },
                                      { id: "Gambling", name: "Gambling & Betting", nameMm: "Gambling (လောင်းကစား)" },
                                      { id: "Games", name: "Mobile & PC Games", nameMm: "Games (ဂိမ်းများ)" },
                                      { id: "Education", name: "Education & Courses", nameMm: "Education (ပညာရေး)" },
                                    ].map((cat) => {
                                      const isSelected = selectedAdCategories.includes(cat.id);
                                      return (
                                        <button
                                          key={cat.id}
                                          type="button"
                                          onClick={() => {
                                            if (cat.id === "Any") {
                                              setSelectedAdCategories(["Any"]);
                                            } else {
                                              setSelectedAdCategories((prev) => {
                                                const filtered = prev.filter((c) => c !== "Any");
                                                if (filtered.includes(cat.id)) {
                                                  const next = filtered.filter((c) => c !== cat.id);
                                                  return next.length === 0 ? ["Any"] : next;
                                                } else {
                                                  return [...filtered, cat.id];
                                                }
                                              });
                                            }
                                          }}
                                          className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                                            isSelected
                                              ? "border-indigo-500 bg-indigo-50/40 text-indigo-950 font-semibold"
                                              : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white hover:bg-slate-50/50"
                                          }`}
                                        >
                                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                                            isSelected
                                              ? "border-indigo-600 bg-indigo-600 text-white"
                                              : "border-slate-350 bg-white"
                                          }`}>
                                            {isSelected && (
                                              <div className="w-2 h-2 rounded-full bg-white transition-transform scale-100" />
                                            )}
                                          </div>
                                          
                                          <div className="font-sans leading-tight">
                                            <div className="text-[10px] font-bold text-slate-800">{cat.nameMm}</div>
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </motion.div>
                            ) : (
                              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-[10px] text-slate-400 font-sans">
                                ⚠️ Ads are currently disabled by the creator. Switch allow advertisements ON to configure allowed categories.
                              </div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                  </div>
                )}

                {/* 📊 TAB: PERFORMANCE & EARNINGS DASHBOARD */}
                {activeTab === "analytics" && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Header Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-xl">
                            <BarChart3 className="w-5 h-5 animate-pulse" />
                          </span>
                          <h2 className="text-lg font-display font-bold text-slate-800">သင့်ကော်မရှင်ဝင်ငွေနှင့် စာရင်းဇယားများ (Performance & Earnings Dashboard)</h2>
                        </div>
                        <p className="text-xs text-slate-500 font-sans mt-0.5 font-semibold">
                          Track real-time traffic statistics, ad impressions, and withdraw accumulated earnings to mobile wallets instantly.
                        </p>
                      </div>
                      <select
                        value={filterAffiliateId}
                        onChange={(e) => setFilterAffiliateId(e.target.value)}
                        className="text-xs font-mono font-bold bg-slate-100 border border-slate-200 rounded-xl p-2 self-start sm:self-center focus:outline-none focus:border-emerald-500"
                      >
                        <option value="All">All Traffic Filters</option>
                        <option value="AFF-101">Filter AFF-101</option>
                        <option value="AFF-202">Filter AFF-202</option>
                      </select>
                    </div>

                    {/* Beginner Quick Guide Grid (Horizontal row of 3 steps) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-slate-50/60 rounded-2xl border border-slate-100/80 flex items-start gap-3">
                        <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold font-mono text-xs shrink-0">1</span>
                        <div>
                          <h4 className="font-bold text-slate-800 text-xs font-sans">လင့်ခ်မျှဝေပါ (Promote)</h4>
                          <p className="text-[10px] text-slate-500 font-sans mt-0.5 leading-relaxed font-semibold">သင့်ရောင်းချမှုလင့်ခ်ကို လူမှုကွန်ရက်တွင် မျှဝေပါ။ တစ်ဦး နှိပ်လိုက်တိုင်း ၅၀ ကျပ် စနစ်က ချက်ချင်း ဆုကြေးပေးပါသည်။</p>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50/60 rounded-2xl border border-slate-100/80 flex items-start gap-3">
                        <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold font-mono text-xs shrink-0">2</span>
                        <div>
                          <h4 className="font-bold text-slate-800 text-xs font-sans">ဝင်ငွေစုဆောင်းပါ (Collect)</h4>
                          <p className="text-[10px] text-slate-500 font-sans mt-0.5 leading-relaxed font-semibold">သင့်လင့်ခ်မှ ဝယ်ယူသူတိုင်းအတွက် ကော်မရှင် (၅,၀၀0 ကျပ်မှ ၁၀,၀၀၀ ကျပ်အထိ) ကို သင့်ပိုက်ဆံအိတ်ထဲ တိုက်ရိုက်ရပါမည်။</p>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50/60 rounded-2xl border border-slate-100/80 flex items-start gap-3">
                        <span className="p-2 bg-amber-50 text-amber-600 rounded-xl font-bold font-mono text-xs shrink-0">3</span>
                        <div>
                          <h4 className="font-bold text-slate-800 text-xs font-sans">ချက်ချင်းထုတ်ယူပါ (Payout)</h4>
                          <p className="text-[10px] text-slate-500 font-sans mt-0.5 leading-relaxed font-semibold">အနည်းဆုံး ၅,၀၀၀ ကျပ် ပြည့်သည်နှင့် KBZPay သို့မဟုတ် WavePay သို့ အချိန်မရွေး ချက်ချင်း ငွေထုတ်ယူနိုင်ပါသည်။</p>
                        </div>
                      </div>
                    </div>

                    {/* Metrics Dashboard Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* PPC Click Progress */}
                      <div className="p-5 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Hop Clicks Traffic</span>
                            <span className="text-xl font-bold font-mono text-slate-800 mt-1 block">{(clickLogs.length).toLocaleString()} Clicks</span>
                          </div>
                          <span className="text-[9px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-lg uppercase font-mono border border-slate-200">
                            +50 Ks / click
                          </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between text-[10px] font-mono text-slate-400">
                            <span>Milestone Goal</span>
                            <span>{Math.min(clickLogs.length, 100)} / 100 clicks</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-indigo-600 h-full transition-all duration-300"
                              style={{ width: `${Math.min((clickLogs.length / 100) * 100, 100)}%` }}
                            />
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-semibold">PPC Click Earnings:</span>
                          <span className="font-bold text-indigo-600 font-mono">{(clickLogs.length * 50).toLocaleString()} Ks</span>
                        </div>
                      </div>

                      {/* Ad View Earnings */}
                      <div className="p-5 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Embedded Ad Views</span>
                            <span className="text-xl font-bold font-mono text-slate-800 mt-1 block">
                              {((adClicks / (adImpressions || 1)) * 100).toFixed(1)}% <span className="text-xs text-slate-400 font-normal font-sans">CTR</span>
                            </span>
                          </div>
                          <span className="text-[9px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-lg uppercase font-mono border border-indigo-100">
                            CPM Active
                          </span>
                        </div>

                        <div className="text-[10px] text-slate-400 font-sans flex justify-between pt-1">
                          <span>Views: {adImpressions.toLocaleString()}</span>
                          <span>Ad Click: {adClicks.toLocaleString()}</span>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-semibold">Ad View Earnings:</span>
                          <span className="font-bold text-indigo-600 font-mono">
                            {(Math.round((adImpressions * 10) + (adClicks * 200))).toLocaleString()} Ks
                          </span>
                        </div>
                      </div>

                      {/* Withdrawable Balance */}
                      <div className="p-5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl space-y-4 shadow-md relative overflow-hidden">
                        <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/5 rounded-full translate-x-8 translate-y-8 blur-lg" />
                        
                        <div>
                          <span className="text-[10px] uppercase font-bold text-emerald-100 block font-mono tracking-wider">Withdrawable Balance</span>
                          <span className="text-3xl font-bold font-mono mt-1 block">
                            {networkBalances.affiliateEarnings.toLocaleString()} Ks
                          </span>
                        </div>

                        <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[10px] text-emerald-100 font-sans">
                          <span>⚡ 0% Processing Fee</span>
                          <span className="font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">Instant Disburse</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Payout Form & Ledger Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {/* Payout Request Card (Left Col - 7 Span) */}
                      <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                        <div className="border-b border-slate-100 pb-3">
                          <h3 className="font-bold text-slate-800 text-sm font-display flex items-center gap-2">
                            <span className="p-1 bg-emerald-50 text-emerald-600 rounded-lg">
                              <DollarSign className="w-4 h-4" />
                            </span>
                            ငွေထုတ်ယူမည့် အသေးစိတ်အချက်အလက် (Withdrawal Details)
                          </h3>
                        </div>

                        <form onSubmit={handleRequestPayout} className="space-y-5">
                          {/* Payment Gateway selector CARDS */}
                          <div className="space-y-2">
                            <label className="block text-[10px] uppercase text-slate-500 font-mono font-bold">
                              ၁။ ငွေထုတ်ယူမည့် စနစ်ရွေးချယ်ပါ (Select Gateway)
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {[
                                { id: "KBZPay", label: "KBZPay Applet", color: "border-blue-500 bg-blue-50/30 text-blue-900" },
                                { id: "WavePay", label: "WavePay Applet", color: "border-amber-500 bg-amber-50/30 text-amber-900" },
                                { id: "KBZ Bank", label: "KBZ Bank", color: "border-rose-500 bg-rose-50/30 text-rose-900" },
                                { id: "CB Bank", label: "CB Bank", color: "border-sky-500 bg-sky-50/30 text-sky-900" },
                                { id: "AYA Bank", label: "AYA Bank", color: "border-red-500 bg-red-50/30 text-red-900" }
                              ].map((gw) => {
                                const isSelected = payoutMethodInput === gw.id;
                                return (
                                  <button
                                    key={gw.id}
                                    type="button"
                                    onClick={() => setPayoutMethodInput(gw.id)}
                                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between h-20 transition-all ${
                                      isSelected 
                                        ? `${gw.color} ring-2 ring-emerald-500 border-transparent shadow-sm` 
                                        : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? "border-emerald-500" : "border-slate-300"}`}>
                                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                      </span>
                                      <span className="text-[10px] font-mono font-bold opacity-60">Instant</span>
                                    </div>
                                    <span className="text-xs font-bold font-sans">{gw.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Payout Amount with Quick Select Buttons */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <label className="block text-[10px] uppercase text-slate-500 font-mono font-bold">
                                ၂။ ထုတ်ယူလိုသော ငွေပမာဏ (Withdrawal Amount)
                              </label>
                              <span className="text-[10px] text-slate-400 font-mono">Available: {networkBalances.affiliateEarnings.toLocaleString()} Ks</span>
                            </div>

                            <div className="relative">
                              <input
                                type="number"
                                min="5000"
                                placeholder="ဥပမာ - ၁၅၀၀၀"
                                value={payoutAmountInput}
                                onChange={(e) => setPayoutAmountInput(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 font-mono text-slate-800"
                              />
                              <span className="absolute right-4 top-3 text-slate-400 text-xs font-bold font-mono">KS</span>
                            </div>

                            {/* Quick Select Amount Pills */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {[5000, 10000, 20000, 50000].map((amt) => (
                                <button
                                  key={amt}
                                  type="button"
                                  onClick={() => setPayoutAmountInput(amt.toString())}
                                  className="text-[10px] font-bold font-mono px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all border border-slate-200/40"
                                >
                                  +{amt.toLocaleString()} Ks
                                </button>
                              ))}
                              <button
                                type="button"
                                onClick={() => setPayoutAmountInput(networkBalances.affiliateEarnings.toString())}
                                className="text-[10px] font-bold font-mono px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-all border border-emerald-200/50"
                              >
                                အကုန်ထုတ်ယူမည် (All)
                              </button>
                            </div>
                          </div>

                          {/* Account fields */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">
                                ၃။ ဖုန်းနံပါတ် / အကောင့်နံပါတ် (Phone / Account No.)
                              </label>
                              <input
                                type="text"
                                placeholder="ဥပမာ - ၀၉၇၇၇၆၆၆၅၅၅"
                                value={payoutAccountNoInput}
                                onChange={(e) => setPayoutAccountNoInput(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 font-mono text-slate-800"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">
                                ၄။ အကောင့်အမည် (Account Holder Name)
                              </label>
                              <input
                                type="text"
                                placeholder="ဥပမာ - ဦးဘ"
                                value={payoutAccountNameInput}
                                onChange={(e) => setPayoutAccountNameInput(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 font-sans text-slate-800"
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-2xl text-xs uppercase tracking-wider font-mono transition-all shadow-md hover:shadow-emerald-200"
                          >
                            💸 Request Instant Withdrawal
                          </button>
                        </form>

                        {/* Payout History (Slightly integrated) */}
                        <div className="border-t border-slate-100 pt-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-800 text-xs font-display uppercase tracking-wider">
                              Payout History (ထုတ်ယူမှုမှတ်တမ်း)
                            </h4>
                            <span className="text-[10px] bg-slate-100 text-slate-600 font-mono font-bold px-2 py-0.5 rounded-lg">
                              {payoutHistory.length} logs
                            </span>
                          </div>

                          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                            {payoutHistory.length === 0 ? (
                              <div className="p-8 text-center text-slate-400 text-xs font-sans border border-dashed border-slate-200 rounded-2xl">
                                ငွေထုတ်ယူမှုမှတ်တမ်း မရှိသေးပါ။
                              </div>
                            ) : (
                              payoutHistory.map((p) => (
                                <div key={p.id} className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-2xl space-y-2 text-xs">
                                  <div className="flex justify-between items-center border-b border-slate-200/40 pb-1.5">
                                    <span className="text-[10px] font-mono font-bold text-slate-400">#{p.id}</span>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-100">
                                      <Check className="w-3 h-3" /> {p.status}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <div>
                                      <div className="font-bold text-slate-800">{p.method}</div>
                                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{p.accountName} ({p.accountNo})</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-bold text-emerald-600 font-mono">{p.amount.toLocaleString()} Ks</div>
                                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{p.timestamp}</div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Performance Analytics Column (Right Col - 5 Span) */}
                      <div className="lg:col-span-5 space-y-6">
                        {/* Traffic Overview */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                            <h3 className="font-bold text-slate-800 text-xs sm:text-sm font-display uppercase tracking-wider">
                              Traffic Performance
                            </h3>
                            <span className="text-[10px] bg-slate-100 text-slate-600 font-mono font-bold px-2 py-0.5 rounded-lg">
                              Live Rates
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-center">
                            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                              <div className="text-[9px] uppercase font-bold text-slate-400 font-mono">Conversion Rate</div>
                              <div className="text-xl font-bold font-mono text-emerald-600 mt-1">{conversionRatePercent}%</div>
                            </div>
                            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                              <div className="text-[9px] uppercase font-bold text-slate-400 font-mono">EPC (Avg Ks)</div>
                              <div className="text-xl font-bold font-mono text-indigo-600 mt-1">{epcMMK.toLocaleString()}</div>
                            </div>
                          </div>

                          {/* Hop Clicks Stream Logs Table */}
                          <div className="space-y-3 pt-2">
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Incoming Hop Traffic Streams (Real-Time)</span>
                            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                              <table className="w-full text-left text-xs text-slate-600">
                                <thead className="bg-slate-50 text-[10px] uppercase text-slate-400 font-mono font-bold border-b border-slate-100">
                                  <tr>
                                    <th className="px-3 py-2">Affiliate</th>
                                    <th className="px-3 py-2">Tracking (TID)</th>
                                    <th className="px-3 py-2 text-right">Time</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 font-mono text-[11px]">
                                  {clickLogs.length === 0 ? (
                                    <tr>
                                      <td colSpan={3} className="px-3 py-4 text-center text-slate-400">No clicks tracked yet.</td>
                                    </tr>
                                  ) : (
                                    clickLogs.slice(0, 5).map((log) => (
                                      <tr key={log.id} className="hover:bg-slate-50">
                                        <td className="px-3 py-2 font-bold text-slate-800">{log.affiliateId}</td>
                                        <td className="px-3 py-2 text-indigo-600 font-bold max-w-[80px] truncate">{log.tid || "—"}</td>
                                        <td className="px-3 py-2 text-right text-slate-500 text-[10px]">{log.timestamp.split("T")[1]?.slice(0, 5) || log.timestamp}</td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}



                {/* 📢 TAB: ADVERTISING PORTAL */}
                {activeTab === "ads-portal" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <Megaphone className="w-5 h-5 text-indigo-600" />
                      <div className="flex-1">
                        <h2 className="text-lg font-display font-bold text-slate-800">Integrated Advertising & Marketing Portal</h2>
                        <p className="text-xs text-slate-500 font-sans mt-0.5 font-semibold">Setup, track, and optimize micro-campaigns targeted across the Akyoe Network</p>
                      </div>
                    </div>

                    {/* Myanmar localization introduction banner */}
                    <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-5 rounded-3xl space-y-2 shadow-md">
                      <h3 className="font-bold font-display text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" /> ကြော်ငြာရှင်များအတွက် သီးသန့်စနစ် (Advertiser Account Space)
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        မြန်မာနိုင်ငံရှိ ဒစ်ဂျစ်တယ်စာအုပ်၊ သင်တန်းဖန်တီးသူများနှင့် ဆော့ဖ်ဝဲလ်ရေးသားသူများ၏ Checkout ဝင်ရောက်မှုစာမျက်နှာများတွင် သင့်လုပ်ငန်း သို့မဟုတ် ထုတ်ကုန်များကို ၁၅ စက္ကန့်၊ စက္ကန့် ၃၀ သို့မဟုတ် စက္ကန့် ၆၀ တိုတောင်းသော ဗီဒီယို/စာတန်းများဖြင့် တိုက်ရိုက်ထိရောက်စွာ ကြော်ငြာနိုင်ပါသည်။
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Campaign Registration Form */}
                      <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200/80 space-y-4 shadow-sm">
                        <div className="border-b border-slate-100 pb-2">
                          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-mono">Create New Ad Campaign</h4>
                          <p className="text-[10px] text-slate-400 font-sans mt-0.5">Configure your marketing tier and rotation scope</p>
                        </div>

                        <form onSubmit={handleRegisterAdCampaign} className="space-y-3.5">
                          <div>
                            <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">1. Advertiser / Business Name</label>
                            <input
                              type="text"
                              value={newAdAdvertiserName}
                              onChange={(e) => setNewAdAdvertiserName(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-sans text-slate-800"
                              placeholder="e.g. Myanmar Tech Hub"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">2. Service Tier</label>
                              <select
                                value={newAdTier}
                                onChange={(e) => setNewAdTier(e.target.value as "Basic" | "Premium")}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-indigo-500 font-sans"
                              >
                                <option value="Basic">Basic Tier</option>
                                <option value="Premium">Premium VIP</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">3. Targeting Scope</label>
                              <select
                                value={newAdTargetCategory}
                                onChange={(e) => setNewAdTargetCategory(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-indigo-500 font-sans"
                              >
                                <option value="Education">Education & Courses</option>
                                <option value="Software">Software & SaaS</option>
                                <option value="eBook & Code">eBooks & Manuals</option>
                                <option value="All">All Categories</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">4. Budget (MMK)</label>
                              <input
                                type="number"
                                min="10000"
                                step="5000"
                                value={newAdBudget}
                                onChange={(e) => setNewAdBudget(parseInt(e.target.value) || 0)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-mono text-slate-800"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">5. Duration (Days)</label>
                              <input
                                type="number"
                                min="1"
                                max="180"
                                value={newAdDuration}
                                onChange={(e) => setNewAdDuration(parseInt(e.target.value) || 0)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-mono text-slate-800"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">6. Ad Video Length (Seconds)</label>
                            <div className="grid grid-cols-3 gap-2">
                              {([15, 30, 60] as const).map((length) => (
                                <button
                                  key={length}
                                  type="button"
                                  onClick={() => setNewAdLength(length)}
                                  className={`py-2 text-xs font-mono font-bold rounded-xl border transition-all ${
                                    newAdLength === length
                                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                                  }`}
                                >
                                  {length} Sec
                                </button>
                              ))}
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider font-mono transition-all shadow-md shadow-indigo-600/15 flex items-center justify-center gap-2"
                          >
                            <Plus className="w-3.5 h-3.5" /> Launch Ad Campaign
                          </button>
                        </form>
                      </div>

                      {/* Campaigns Grid List */}
                      <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-slate-200/80 space-y-4 shadow-sm">
                        <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-mono">Active Marketing Campaigns</h4>
                            <p className="text-[10px] text-slate-400 font-sans mt-0.5 font-semibold">Active rotating impressions pool</p>
                          </div>
                          <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold font-mono px-2 py-0.5 rounded-lg">
                            {adCampaigns.length} Active
                          </span>
                        </div>

                        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                          {adCampaigns.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-xs font-sans border border-dashed border-slate-200 rounded-2xl">
                              No active ad campaigns yet.
                            </div>
                          ) : (
                            adCampaigns.map((camp) => (
                              <div key={camp.id} className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-2 text-xs">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                                      {camp.advertiserName}
                                      <span className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-bold ${
                                        camp.tier === "Premium" ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-700"
                                      }`}>
                                        {camp.tier}
                                      </span>
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {camp.id} | Targeting: {camp.targetCategory}</div>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveAdCampaign(camp.id)}
                                    className="text-red-500 hover:text-red-700 p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-all"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-2 font-mono text-[10px] text-slate-500">
                                  <div>
                                    <div className="text-slate-400 font-sans font-bold">Budget</div>
                                    <div className="font-bold text-indigo-600">{camp.budgetMMK.toLocaleString()} Ks</div>
                                  </div>
                                  <div>
                                    <div className="text-slate-400 font-sans font-bold">Duration</div>
                                    <div className="font-bold text-slate-700">{camp.durationDays} Days</div>
                                  </div>
                                  <div>
                                    <div className="text-slate-400 font-sans font-bold">Video Length</div>
                                    <div className="font-bold text-slate-700">{camp.adLengthSec} Sec</div>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 🧮 TAB: COMMISSION CALCULATOR */}
                {activeTab === "split-calculator" && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-xl">
                          <Percent className="w-5 h-5" />
                        </span>
                        <div>
                          <h2 className="text-base sm:text-lg font-display font-bold text-slate-800">Automated Split Engine Simulator</h2>
                          <p className="text-[10px] text-slate-500 font-sans">Interactive Net Pool Commission Distribution Calculator</p>
                        </div>
                      </div>
                    </div>

                    {/* Collapsible Explainer & Quick Product Presets block */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-150 p-4 space-y-3 shadow-sm">
                      <button
                        type="button"
                        onClick={() => setShowCalcPresets(!showCalcPresets)}
                        className="w-full flex items-center justify-between text-xs font-bold font-sans text-slate-700 hover:text-emerald-700 transition-all focus:outline-none"
                      >
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse shrink-0" />
                          အသုံးပြုနည်းရှင်းလင်းချက်နှင့် ⚡ Quick Presets ပုံစံငယ်များ
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-white border border-slate-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          {showCalcPresets ? "✕ ပိတ်မည်" : "📖 ဖွင့်မည်"}
                        </span>
                      </button>

                      {showCalcPresets && (
                        <div className="space-y-4 pt-2.5 border-t border-slate-200/60 animate-fade-in">
                          <p className="text-xs text-slate-600 font-sans leading-relaxed">
                            ClickBank's commission splits are calculated strictly based on the <strong>Net Payout Pool</strong> after network processing fees and national taxes (like Myanmar’s 5% Commercial Tax) are deducted first.
                          </p>

                          {/* Quick Preset Buttons */}
                          <div className="space-y-2">
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">⚡ Quick Product Presets (စမ်းသပ်ရန် ပုံစံငယ်များ)</span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {[
                                { name: "eBook Standard", price: 30000, comm: 75, icon: "📚" },
                                { name: "Premium Course", price: 150000, comm: 50, icon: "🎓" },
                                { name: "SaaS Software", price: 85000, comm: 40, icon: "💻" },
                                { name: "High-Ticket Pro", price: 450000, comm: 30, icon: "🚀" }
                              ].map((preset) => {
                                const isMatch = calcPrice === preset.price && calcCommission === preset.comm;
                                return (
                                  <button
                                    key={preset.name}
                                    type="button"
                                    onClick={() => {
                                      setCalcPrice(preset.price);
                                      setCalcCommission(preset.comm);
                                    }}
                                    className={`p-2.5 rounded-xl border text-left transition-all text-xs flex flex-col justify-between gap-1.5 ${
                                      isMatch
                                        ? "border-emerald-500 bg-emerald-50/40 text-emerald-950 font-semibold ring-1 ring-emerald-500"
                                        : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <span className="text-[10px] font-mono font-bold text-slate-400">{preset.icon}</span>
                                      {isMatch && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                                    </div>
                                    <div>
                                      <span className="block font-sans font-bold text-[11px] leading-tight text-slate-800">{preset.name}</span>
                                      <span className="block font-mono text-[10px] text-slate-500 mt-0.5">{preset.price.toLocaleString()} Ks • {preset.comm}%</span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      {/* Left: Input Parameters */}
                      <div className="md:col-span-6 space-y-5 bg-slate-50/50 p-5 rounded-3xl border border-slate-150">
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/50">
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Configure Parameters</span>
                          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Live Reactive</span>
                        </div>

                        {/* Parameter 1: Price */}
                        <div className="space-y-2 bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-slate-200/80">
                          <div className="flex justify-between items-center text-xs">
                            <label className="font-bold text-slate-800 font-sans flex items-center gap-1.5">
                              <Coins className="w-4 h-4 text-emerald-600" />
                              Product Offer Price
                            </label>
                            <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">{calcPrice.toLocaleString()} Ks</span>
                          </div>
                          <input 
                            type="range"
                            min="10000"
                            max="1000000"
                            step="5000"
                            value={calcPrice}
                            onChange={(e) => setCalcPrice(parseInt(e.target.value) || 50000)}
                            className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
                          />
                          <div className="flex justify-between text-[9px] text-slate-400 font-mono px-0.5">
                            <span>10,000 Ks</span>
                            <span>500,000 Ks</span>
                            <span>1,000,000 Ks</span>
                          </div>
                          <div className="relative flex items-center">
                            <Coins className="absolute left-3 w-4 h-4 text-slate-400" />
                            <input 
                              type="number"
                              step="5000"
                              value={calcPrice}
                              onChange={(e) => setCalcPrice(Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-full bg-slate-50/50 border border-slate-200/80 hover:border-slate-350 rounded-2xl pl-9.5 pr-10 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 font-mono font-bold transition-all"
                            />
                            <span className="absolute right-4 text-slate-400 text-[10px] font-mono font-bold">Ks</span>
                          </div>
                        </div>

                        {/* Parameter 2: Commission Rate (%) */}
                        <div className="space-y-2 bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-slate-200/80">
                          <div className="flex justify-between items-center text-xs">
                            <label className="font-bold text-slate-800 font-sans flex items-center gap-1.5">
                              <Percent className="w-4 h-4 text-indigo-600" />
                              Affiliate Commission
                            </label>
                            <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">{calcCommission}%</span>
                          </div>
                          <input 
                            type="range"
                            min="1"
                            max="100"
                            step="1"
                            value={calcCommission}
                            onChange={(e) => setCalcCommission(parseInt(e.target.value) || 50)}
                            className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
                          />
                          <div className="flex justify-between text-[9px] text-slate-400 font-mono px-0.5">
                            <span>1%</span>
                            <span>50%</span>
                            <span>100%</span>
                          </div>
                          <div className="relative flex items-center">
                            <Percent className="absolute left-3 w-4 h-4 text-slate-400" />
                            <input 
                              type="number"
                              min="1"
                              max="100"
                              value={calcCommission}
                              onChange={(e) => setCalcCommission(Math.min(100, Math.max(1, parseInt(e.target.value) || 0)))}
                              className="w-full bg-slate-50/50 border border-slate-200/80 hover:border-slate-350 rounded-2xl pl-9.5 pr-8 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 font-mono font-bold transition-all"
                            />
                            <span className="absolute right-4 text-slate-400 text-[10px] font-mono font-bold">%</span>
                          </div>
                        </div>

                        {/* Parameters 3 & 4 (Advanced Settings) */}
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 font-sans block">Network Fee (%)</label>
                            <input 
                              type="number"
                              step="0.1"
                              value={calcPlatformFeePercent}
                              onChange={(e) => setCalcPlatformFeePercent(Math.max(0, parseFloat(e.target.value) || 0))}
                              className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none font-mono font-semibold"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 font-sans block">Commercial Tax (%)</label>
                            <input 
                              type="number"
                              step="1"
                              value={calcTaxPercent}
                              onChange={(e) => setCalcTaxPercent(Math.max(0, parseFloat(e.target.value) || 0))}
                              className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none font-mono font-semibold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: Calculations Visualization */}
                      <div className="md:col-span-6 space-y-4">
                        {/* Main Ledger Breakdown Card */}
                        <div className="bg-slate-900 text-slate-100 p-5 rounded-3xl border border-slate-800 shadow-xl space-y-4 font-sans relative overflow-hidden">
                          {/* Ambient glow accent */}
                          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                          
                          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Financial Ledger Breakdown</span>
                            <span className="text-[10px] text-emerald-400 font-mono font-bold">100% Accountable</span>
                          </div>

                          <div className="space-y-3 text-xs">
                            <div className="flex justify-between items-center py-0.5">
                              <span className="text-slate-400 font-sans">Gross Product Offer Price:</span>
                              <span className="font-mono font-bold text-slate-200">{computedSplit.gross.toLocaleString()} Ks</span>
                            </div>

                            <div className="flex justify-between items-center py-0.5 text-rose-400">
                              <span className="font-sans flex items-center gap-1">
                                <span>Commercial Tax ({calcTaxPercent}%):</span>
                              </span>
                              <span className="font-mono font-semibold">-{computedSplit.commercialTax.toLocaleString()} Ks</span>
                            </div>

                            <div className="flex justify-between items-center py-0.5 text-rose-400 border-b border-slate-800/60 pb-3">
                              <span className="font-sans flex items-center gap-1">
                                <span>Network Fee ({calcPlatformFeePercent}% + 1,500 Ks):</span>
                              </span>
                              <span className="font-mono font-semibold">-{computedSplit.platformFee.toLocaleString()} Ks</span>
                            </div>

                            <div className="flex justify-between items-center py-1.5 text-emerald-400 bg-emerald-950/40 px-3 rounded-xl border border-emerald-900/30">
                              <span className="font-sans font-bold">Net Payout Pool (Drawn Splits):</span>
                              <span className="font-mono font-extrabold text-[13px]">{computedSplit.netPool > 0 ? computedSplit.netPool.toLocaleString() : 0} Ks</span>
                            </div>

                            {/* Payout distributions */}
                            <div className="pt-2 space-y-2">
                              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Split Distributions</span>
                              
                              <div className="flex justify-between items-center py-1 px-2.5 bg-slate-800/40 rounded-xl">
                                <span className="text-slate-300 font-medium">Affiliate Commission ({calcCommission}%):</span>
                                <span className="font-mono font-bold text-indigo-400">{computedSplit.affiliateShare.toLocaleString()} Ks</span>
                              </div>

                              <div className="flex justify-between items-center py-1 px-2.5 bg-slate-800/40 rounded-xl">
                                <span className="text-slate-300 font-medium">Vendor Base Payout:</span>
                                <span className="font-mono font-bold text-slate-200">{computedSplit.vendorShareBase.toLocaleString()} Ks</span>
                              </div>

                              {computedSplit.jvSplits.length > 0 && (
                                <div className="pl-3 py-1.5 border-l-2 border-amber-500/50 space-y-1.5">
                                  <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-wider block">JV co-creator Deductions</span>
                                  {computedSplit.jvSplits.map((jv, idx) => (
                                    <div key={idx} className="flex justify-between text-[11px] text-amber-300">
                                      <span>{jv.partnerName} ({jv.percent}%):</span>
                                      <span className="font-mono">-{jv.amount.toLocaleString()} Ks</span>
                                    </div>
                                  ))}
                                  <div className="flex justify-between text-[11px] text-slate-400 border-t border-slate-800/40 pt-1">
                                    <span>Total JV payout:</span>
                                    <span className="font-mono">-{computedSplit.totalJvPayout.toLocaleString()} Ks</span>
                                  </div>
                                </div>
                              )}

                              <div className="flex justify-between items-center py-1.5 px-3 bg-indigo-950/40 rounded-xl border border-indigo-900/40 text-[13px] text-white">
                                <span className="font-bold font-sans">Net Creator/Vendor Payout:</span>
                                <span className="font-mono font-black text-indigo-400">{computedSplit.netVendorShare.toLocaleString()} Ks</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Split Gauge Visualizer */}
                        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 space-y-3 shadow-sm">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Visual Split Bar (Distribution Ratio)</span>
                          {computedSplit.netPool > 0 ? (
                            <div className="space-y-2">
                              {/* Stacked Percentage Bar */}
                              <div className="w-full h-5 rounded-full overflow-hidden flex font-mono text-[9px] font-extrabold text-white text-center">
                                <div 
                                  style={{ width: `${Math.max(12, (computedSplit.commercialTax / computedSplit.gross) * 100)}%` }}
                                  className="bg-rose-500 flex items-center justify-center transition-all"
                                  title="Commercial Tax"
                                >
                                  Tax
                                </div>
                                <div 
                                  style={{ width: `${Math.max(12, (computedSplit.platformFee / computedSplit.gross) * 100)}%` }}
                                  className="bg-amber-500 flex items-center justify-center transition-all"
                                  title="Network Fee"
                                >
                                  Fees
                                division
                                </div>
                                <div 
                                  style={{ width: `${Math.max(12, (computedSplit.affiliateShare / computedSplit.gross) * 100)}%` }}
                                  className="bg-indigo-600 flex items-center justify-center transition-all"
                                  title="Affiliate Share"
                                >
                                  Aff ({calcCommission}%)
                                </div>
                                <div 
                                  style={{ width: `${Math.max(12, (computedSplit.netVendorShare / computedSplit.gross) * 100)}%` }}
                                  className="bg-emerald-600 flex items-center justify-center transition-all"
                                  title="Creator Net"
                                >
                                  Creator
                                </div>
                              </div>
                              {/* Legend */}
                              <div className="grid grid-cols-4 gap-1 text-[10px] font-sans font-semibold text-slate-500 pt-1">
                                <div className="flex items-center gap-1 justify-center">
                                  <span className="w-2 h-2 rounded bg-rose-500 shrink-0" />
                                  <span>Tax</span>
                                </div>
                                <div className="flex items-center gap-1 justify-center">
                                  <span className="w-2 h-2 rounded bg-amber-500 shrink-0" />
                                  <span>Fees</span>
                                </div>
                                <div className="flex items-center gap-1 justify-center">
                                  <span className="w-2 h-2 rounded bg-indigo-600 shrink-0" />
                                  <span>Affiliate</span>
                                </div>
                                <div className="flex items-center gap-1 justify-center">
                                  <span className="w-2 h-2 rounded bg-emerald-600 shrink-0" />
                                  <span>Vendor</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center text-xs text-slate-400 py-2 italic font-sans">
                              Enter a valid product price to view dynamic split allocations.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {showSimulator && (
                <section className="xl:col-span-4 animate-fade-in">
                  {userRole === "sponsor" ? (
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
                    <div className="bg-indigo-900 text-white p-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                        <h3 className="text-xs font-bold font-mono uppercase tracking-wider">🎯 Sponsor Ad Live Simulator</h3>
                      </div>
                      <p className="text-[10px] text-slate-300 mt-1 font-sans">
                        Test and preview how your dynamic sponsor advertisement renders to end-users prior to redirection.
                      </p>
                    </div>

                    <div className="p-5 space-y-4 text-xs">
                      {/* Form Inputs */}
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">1. Select Campaign Ad to Simulate</label>
                          <select 
                            value={activeAdSimId}
                            onChange={(e) => {
                              const campaignId = e.target.value;
                              setActiveAdSimId(campaignId);
                              const c = adCampaigns.find(camp => camp.id === campaignId);
                              if (c) setAdPlaySecondsRemaining(c.adLengthSec);
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-mono font-semibold"
                          >
                            {adCampaigns.map(camp => (
                              <option key={camp.id} value={camp.id}>{camp.advertiserName} ({camp.adLengthSec}s {camp.adType || "video"}) - {camp.tier}</option>
                            ))}
                          </select>
                        </div>

                        {/* Simulate Ad Play */}
                        {!isAdPlaying ? (
                          <button
                            type="button"
                            onClick={() => {
                              const c = adCampaigns.find(camp => camp.id === activeAdSimId);
                              if (c) {
                                setAdPlaySecondsRemaining(c.adLengthSec);
                                setIsAdPlaying(true);
                              }
                            }}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl transition-all font-mono uppercase tracking-wider"
                          >
                            ▶️ Run Ad Simulation
                          </button>
                        ) : (
                          <div className="space-y-3 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-slate-700 animate-pulse">📺 Playing Interstitial Ad...</span>
                              <span className="bg-rose-100 text-rose-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                                {adPlaySecondsRemaining}s remaining
                              </span>
                            </div>

                            {/* Actual ad renderer preview */}
                            <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 aspect-video flex items-center justify-center text-white">
                              {(() => {
                                const activeAd = adCampaigns.find(c => c.id === activeAdSimId);
                                if (!activeAd) return <div>No active ad found</div>;
                                
                                if (activeAd.adType === "video" && activeAd.mediaUrl) {
                                  return (
                                    <video 
                                      src={activeAd.mediaUrl} 
                                      autoPlay 
                                      loop 
                                      muted 
                                      playsInline 
                                      className="w-full h-full object-cover animate-fade-in"
                                    />
                                  );
                                } else if (activeAd.mediaUrl) {
                                  return (
                                    <img 
                                      src={activeAd.mediaUrl} 
                                      className="w-full h-full object-contain animate-fade-in"
                                      alt="Sponsor Ad"
                                    />
                                  );
                                } else {
                                  return <div className="text-[10px] text-slate-400">Media URL missing</div>;
                                }
                              })()}

                              {/* Intercept overlay Skip button indicator */}
                              <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white px-3 py-1 rounded-lg">
                                Skip Ad in {adPlaySecondsRemaining}s
                              </div>
                            </div>

                            <div className="flex items-center gap-2 justify-between">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsAdPlaying(false);
                                }}
                                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 py-1.5 rounded-lg text-[11px] font-bold"
                              >
                                Stop Simulation
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  // Simulate an ad click!
                                  setAdCampaigns(prev => prev.map(c => {
                                    if (c.id === activeAdSimId) {
                                      return { ...c, clicksCount: (c.clicksCount || 0) + 1 };
                                    }
                                    return c;
                                  }));
                                }}
                                className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 py-1.5 rounded-lg text-[11px] font-bold text-center"
                              >
                                Simulate Ad Click
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Sponsor Stats Guide / Diagnosis */}
                      <div className="bg-slate-900 text-slate-300 font-mono text-[10px] rounded-xl p-4 space-y-2 shadow-inner">
                        <p className="text-slate-500 font-bold">// Ad Network Variables:</p>
                        <p>Interstitial Host: <span className="text-indigo-400">akyoe.net/interstitial</span></p>
                        <p>Active Ad Rotations: <span className="text-amber-400 font-bold">{adCampaigns.length} ads</span></p>
                        <p>Target Traffic Stream: <span className="text-slate-400">All outbound brand links</span></p>
                        <p className="text-[9px] text-slate-500">Guide: Click 'Run Ad Simulation' to inspect how image/gif/video creatives behave inside our redirection intercept screen.</p>
                      </div>
                    </div>
                  </div>
                ) : userRole === "brand" ? (
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
                    {/* Header */}
                    <div className="bg-slate-50 border-b border-slate-100 p-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <h3 className="text-xs font-bold font-mono text-slate-700 uppercase tracking-wider">📡 Brand Sandbox Simulator</h3>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 font-sans">
                        သင့်ခြေရာခံကုဒ် (Pixel Tracker) ၏ ဝက်ဘ်ဆိုက်လည်ပတ်မှုနှင့် ဝယ်ယူမှုများကို ဤနေရာတွင် တိုက်ရိုက် စမ်းသပ်နိုင်ပါသည်။
                      </p>
                    </div>

                    <div className="p-5 space-y-4">
                      {/* Form Inputs */}
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">1. Select Target Product</label>
                          <select 
                            value={brandSelectedProd}
                            onChange={(e) => setBrandSelectedProd(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                          >
                            {products.map(p => (
                              <option key={p.id} value={p.id}>{p.name} ({p.priceMMK.toLocaleString()} Ks)</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">2. Custom Affiliate ID to test</label>
                          <input 
                            type="text"
                            value={brandCustomAffiliate}
                            onChange={(e) => setBrandCustomAffiliate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                            placeholder="e.g. AFF-101"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">3. Custom Campaign Tracking ID (tid)</label>
                          <input 
                            type="text"
                            value={brandCustomTid}
                            onChange={(e) => setBrandCustomTid(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                            placeholder="e.g. facebook_ads"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-[10px] uppercase text-slate-500 font-mono font-bold">4. Simulated Device IP</label>
                            <button
                              type="button"
                              onClick={rotateSimulatedIp}
                              className="text-[9px] text-emerald-600 hover:text-emerald-700 font-bold font-sans flex items-center gap-1"
                            >
                              🔄 Change IP / New Device
                            </button>
                          </div>
                          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 flex justify-between items-center">
                            <span>{currentSimulatedIp}</span>
                            <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded uppercase font-bold font-sans scale-90">
                              {ppcRecentIps.includes(currentSimulatedIp) ? "Clicked (24h)" : "Fresh IP"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Actions */}
                      <div className="space-y-2.5 pt-2">
                        <button
                          onClick={handleSimulateBrandClick}
                          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          လင့်ခ်နှိပ်ခြင်း စမ်းသပ်မည် (Simulate Visit)
                        </button>
                      </div>

                      {/* Diagnostic console recap */}
                      <div className="bg-slate-900 rounded-xl p-4 text-[10px] text-slate-300 font-mono space-y-1.5 shadow-inner">
                        <p className="text-slate-500 font-bold">// Debugger Variables:</p>
                        <p>Click Captured: <span className={lastClickWasDuplicate === false ? "text-emerald-400 font-bold" : lastClickWasDuplicate === true ? "text-rose-400 font-bold" : "text-slate-400"}>{lastClickWasDuplicate === false ? "True" : lastClickWasDuplicate === true ? "False" : "Waiting..."}</span></p>
                        <p>PPC Rate: <span className="text-amber-400 font-bold">100 Ks / Unique Click</span></p>
                        <p>Target Destination: <span className="text-indigo-400 underline">https://m.me/brandname (Facebook Messenger Bridge)</span></p>
                        <p>Simulated IP: <span className="text-slate-400">{currentSimulatedIp}</span></p>
                        <p className="text-[9px] text-slate-500">Cookie: akyoe_aff_cookie="{brandCustomAffiliate.toUpperCase()}"</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div id="combined-hoplink-sidebar-panel" className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4 transition-all duration-300">
                    {/* Header */}
                    <div className="border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-xl">
                          <Shuffle className="w-5 h-5 text-emerald-600 animate-pulse" />
                        </span>
                        <div>
                          <h3 className="font-bold text-slate-800 text-xs sm:text-sm font-display uppercase tracking-wider">
                            Secure Hoplink Engine & Ad Settings
                          </h3>
                          <p className="text-[10px] text-slate-400 mt-1 font-sans">
                            ညွှန်းဆိုလင့်ခ်ထုတ်ယူရန်၊ ကွတ်ကီးစစ်ဆေးရန်နှင့် ကြော်ငြာများကို ပြင်ဆင်ရန် ဖြစ်ပါသည်။
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Sub-Tabs */}
                    <div className="grid grid-cols-4 gap-0.5 bg-slate-100 p-0.5 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setAffiliateSidebarTab("hoplink")}
                        className={`py-1.5 px-1 rounded-lg text-[10px] font-bold font-sans transition-all text-center leading-none ${
                          affiliateSidebarTab === "hoplink"
                            ? "bg-white text-emerald-700 shadow-sm font-semibold"
                            : "text-slate-600 hover:text-slate-950"
                        }`}
                        title="Hoplinks"
                      >
                        🔗 Hoplink
                      </button>
                      <button
                        type="button"
                        onClick={() => setAffiliateSidebarTab("ads")}
                        className={`py-1.5 px-1 rounded-lg text-[10px] font-bold font-sans transition-all text-center leading-none ${
                          affiliateSidebarTab === "ads"
                            ? "bg-white text-indigo-700 shadow-sm font-semibold"
                            : "text-slate-600 hover:text-slate-950"
                        }`}
                        title="Ads"
                      >
                        📢 Ads
                      </button>
                      <button
                        type="button"
                        onClick={() => setAffiliateSidebarTab("cookies")}
                        className={`py-1.5 px-1 rounded-lg text-[10px] font-bold font-sans transition-all text-center leading-none ${
                          affiliateSidebarTab === "cookies"
                            ? "bg-white text-indigo-700 shadow-sm font-semibold"
                            : "text-slate-600 hover:text-slate-950"
                        }`}
                        title="Cookies"
                      >
                        🍪 Cookie
                      </button>
                      <button
                        type="button"
                        onClick={() => setAffiliateSidebarTab("purchase")}
                        className={`py-1.5 px-1 rounded-lg text-[10px] font-bold font-sans transition-all text-center leading-none ${
                          affiliateSidebarTab === "purchase"
                            ? "bg-white text-rose-700 shadow-sm font-semibold"
                            : "text-slate-600 hover:text-slate-950"
                        }`}
                        title="Simulate Purchase"
                      >
                        💳 Purchase
                      </button>
                    </div>

                    {/* TAB 1: HOPLINK GENERATOR */}
                    {affiliateSidebarTab === "hoplink" && (
                      <div className="space-y-4 text-xs animate-fade-in">
                        <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                          လင့်ခ်ထုတ်ယူရန် ပစ္စည်းကိုရွေးချယ်ပြီး သင့်အကောင့်အမည် ထည့်သွင်းပါ။ ညွှန်းဆိုလင့်ခ် (Hoplink) ကို အလိုအလျောက် ထုတ်ပေးမည်ဖြစ်ပါသည်။
                        </p>

                        <div>
                          <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">1. Select Target Product</label>
                          <select 
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-500 font-mono font-semibold"
                          >
                            {products.map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="relative">
                          <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">2. Affiliate Account Nickname</label>
                          <input 
                            type="text"
                            value={activeAffiliateInput}
                            onChange={(e) => setActiveAffiliateInput(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-800 font-mono font-bold uppercase"
                            placeholder="e.g. MYAFF-101"
                          />

                          {/* 💡 USER GUIDE TOOLTIP FOR GENERATING HOPLINK (AFFILIATE STEP 2) */}
                          {showGuide && activeGuideTab === "affiliate" && guideStep === 1 && (
                            <div className="absolute left-0 top-full mt-2.5 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl p-4 shadow-2xl shadow-emerald-950/40 border border-emerald-500/40 w-72 text-xs animate-bounce-short">
                              <div className="absolute -top-1.5 left-6 w-3 h-3 bg-slate-950 rotate-45 border-l border-t border-emerald-500/40" />
                              <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1 font-display">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                အဆင့် ၂: လင့်ခ် ထုတ်ယူရန်
                              </div>
                              <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                                ဤနေရာတွင် သင့်အကောင့်အမည် (Affiliate Account ID) ကို ထည့်သွင်းပြီး အောက်ရှိ 'Generate Encrypted Hoplink' ခလုတ်ကို နှိပ်ပါ။
                              </p>
                              <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-800 font-sans">
                                <button
                                  type="button"
                                  onClick={() => setGuideStep(0)}
                                  className="text-[10px] text-slate-400 hover:text-white font-bold transition-colors"
                                >
                                  ← နောက်သို့
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleGenerateHoplink(selectedProductId, activeAffiliateInput);
                                    setGuideStep(2);
                                  }}
                                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md shadow-emerald-950/40 transition-all"
                                >
                                  လင့်ခ်ထုတ်ပြီး ရှေ့သို့ →
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">3. Tracking ID Parameter (TID) (Optional)</label>
                          <input 
                            type="text"
                            value={activeTidInput}
                            onChange={(e) => setActiveTidInput(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-800 font-mono"
                            placeholder="e.g. facebook_ad_july"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleGenerateHoplink(selectedProductId, activeAffiliateInput)}
                          className="w-full bg-slate-950 hover:bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider font-mono transition-all shadow-sm"
                        >
                          Generate Encrypted Hoplink
                        </button>

                        {generatedHoplink && (
                          <div className="bg-emerald-50/70 border border-emerald-100 p-3 rounded-2xl space-y-3 pt-3 mt-2 animate-fade-in">
                            <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase block">Generated Hoplink Result</span>
                            <div className="flex items-center gap-2">
                              <input 
                                type="text" 
                                readOnly 
                                value={generatedHoplink}
                                className="bg-white border border-emerald-200 text-xs font-mono rounded-xl px-3 py-2 flex-1 text-emerald-800 focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={handleCopyLink}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1"
                              >
                                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copiedLink ? "Copied" : "Copy"}
                              </button>
                            </div>
                            <div className="flex gap-2 pt-1">
                              <div className="relative inline-block w-full">
                                <button
                                  type="button"
                                  onClick={handleTriggerHopClick}
                                  className="w-full bg-white hover:bg-emerald-100 border border-emerald-200 text-[10px] font-mono font-bold text-emerald-700 px-3.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                >
                                  <ExternalLink className="w-3.5 h-3.5 animate-pulse" /> Simulate Click (Hop)
                                </button>

                                {/* 💡 USER GUIDE TOOLTIP FOR SIMULATING CLICK (AFFILIATE STEP 3 & CUSTOMER STEP 1) */}
                                {showGuide && ((activeGuideTab === "affiliate" && guideStep === 2) || (activeGuideTab === "customer" && guideStep === 0)) && (
                                  <div className="absolute left-0 top-full mt-2.5 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl p-4 shadow-2xl shadow-emerald-950/40 border border-emerald-500/40 w-72 text-xs animate-bounce-short">
                                    <div className="absolute -top-1.5 left-6 w-3 h-3 bg-slate-950 rotate-45 border-l border-t border-emerald-500/40" />
                                    <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1 font-display">
                                      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                      {activeGuideTab === "affiliate" ? "အဆင့် ၃: လင့်ခ် နှိပ်မှု စမ်းသပ်ခြင်း" : "အဆင့် ၁: လင့်ခ်ကို နှိပ်ရန်"}
                                    </div>
                                    <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                                      {activeGuideTab === "affiliate"
                                        ? "ဤ 'Simulate Click' ခလုတ်ကို နှိပ်လိုက်ခြင်းဖြင့် customer တစ်ဦး သင့်လင့်ခ်ကို နှိပ်ပြီး ဝင်လာသည့် Cookie/Fingerprint ပုံစံတူစမ်းသပ်မှုကို ပြုလုပ်နိုင်ပါသည်!"
                                        : "ဤနေရာရှိ 'Simulate Click' ခလုတ်ကို နှိပ်ပြီး ညွှန်းဆိုသူ ပေးပို့လိုက်သောလင့်ခ်မှ ဝယ်ယူသူ ဝင်ရောက်လာသည့်ပုံစံကို စမ်းသပ်လိုက်ပါ!"}
                                    </p>
                                    <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-800 font-sans">
                                      <button
                                        type="button"
                                        onClick={() => setGuideStep(prev => Math.max(0, prev - 1))}
                                        className="text-[10px] text-slate-400 hover:text-white font-bold transition-colors"
                                      >
                                        ← နောက်သို့
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          handleTriggerHopClick();
                                          setAffiliateSidebarTab("cookies");
                                          setGuideStep(activeGuideTab === "affiliate" ? 3 : 1);
                                        }}
                                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md shadow-emerald-950/40 transition-all"
                                      >
                                        နှိပ်ပြီး ရှေ့သို့ →
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 2: AD SETTINGS */}
                    {affiliateSidebarTab === "ads" && (
                      <div className="space-y-4 text-xs animate-fade-in">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="p-1 bg-indigo-50 text-indigo-700 rounded-lg shrink-0">
                              <Megaphone className="w-4 h-4 text-indigo-600" />
                            </span>
                            <h4 className="font-bold text-slate-800 font-sans text-xs">ကြော်ငြာပြသမှု တံခါးပေါက် (Ad Switch)</h4>
                          </div>
                          
                          {/* Toggle Switch */}
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setAllowAdvertisements(!allowAdvertisements);
                                if (isAdPlaying) setIsAdPlaying(false);
                              }}
                              className={`w-11 h-5.5 flex items-center rounded-full p-0.5 transition-all ${
                                allowAdvertisements ? "bg-indigo-600" : "bg-slate-350"
                              }`}
                            >
                              <div
                                className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-all duration-200 ${
                                  allowAdvertisements ? "translate-x-5.5" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-[10.5px] text-slate-500 font-sans leading-relaxed space-y-1 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                          <p className="font-bold text-indigo-800">💡 ဖန်တီးသူနှင့် ညွှန်းပို့သူများအတွက် အသုံးဝင်ပုံ လမ်းညွှန်:</p>
                          <ul className="list-disc pl-4 space-y-1">
                            <li><strong>ကြော်ငြာဖွင့်ထားလျှင် (On):</strong> KBZPay/WavePay Checkout သို့မဟုတ် Hoplink စာမျက်နှာတွင် အခြားလုပ်ငန်းရှင်များ၏ ကြော်ငြာများကို ပြသမည်ဖြစ်ပြီး သင့်အတွက် အပိုဆုကြေး (Ad Premium) ၂.၅% ကို ချက်ချင်း ပေါင်းထည့်ပေးပါမည်။</li>
                            <li><strong>ကြော်ငြာပိတ်ထားလျှင် (Off):</strong> မည်သည့်ကြော်ငြာမျှ ပြသမည်မဟုတ်ဘဲ အခြေခံ ကော်မရှင်ခွဲဝေမှုစနစ်အတိုင်းသာ ဆက်လက်လည်ပတ်မည် ဖြစ်ပါသည်။</li>
                          </ul>
                        </div>

                        <AnimatePresence initial={false}>
                          {allowAdvertisements ? (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden pt-2 border-t border-slate-100"
                            >
                              <div className="space-y-3">
                                <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase block">ခွင့်ပြုလိုသည့် ကြော်ငြာအမျိုးအစားများ (Allowed Ad Categories)</span>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                  {[
                                    { id: "Any", name: "Any Category", nameMm: "Any (မည်သည့်ကြော်ငြာမဆို)" },
                                    { id: "Food", name: "Food & Restaurant", nameMm: "Food (အစားအသောက်)" },
                                    { id: "Cosmetics", name: "Cosmetics & Beauty", nameMm: "Cosmetics (အလှကုန်)" },
                                    { id: "Gambling", name: "Gambling & Betting", nameMm: "Gambling (လောင်းကစား)" },
                                    { id: "Games", name: "Mobile & PC Games", nameMm: "Games (ဂิမ်းများ)" },
                                    { id: "Education", name: "Education & Courses", nameMm: "Education (ပညာရေး)" },
                                  ].map((cat) => {
                                    const isSelected = selectedAdCategories.includes(cat.id);
                                    return (
                                      <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => {
                                          if (cat.id === "Any") {
                                            setSelectedAdCategories(["Any"]);
                                          } else {
                                            setSelectedAdCategories((prev) => {
                                              const filtered = prev.filter((c) => c !== "Any");
                                              if (filtered.includes(cat.id)) {
                                                const next = filtered.filter((c) => c !== cat.id);
                                                return next.length === 0 ? ["Any"] : next;
                                              } else {
                                                return [...filtered, cat.id];
                                              }
                                            });
                                          }
                                        }}
                                        className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                                          isSelected
                                            ? "border-indigo-500 bg-indigo-50/40 text-indigo-950 font-semibold"
                                            : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white hover:bg-slate-50/50"
                                        }`}
                                      >
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                                          isSelected
                                            ? "border-indigo-600 bg-indigo-600 text-white"
                                            : "border-slate-350 bg-white"
                                        }`}>
                                          {isSelected && (
                                            <div className="w-2 h-2 rounded-full bg-white transition-transform scale-100" />
                                          )}
                                        </div>
                                        
                                        <div className="font-sans leading-tight">
                                          <div className="text-[10px] font-bold text-slate-800">{cat.nameMm}</div>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </motion.div>
                          ) : (
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-[10px] text-slate-400 font-sans">
                              ⚠️ Ads are currently disabled. Toggle Ad Switch to "On" to customize categories.
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* TAB 3: COOKIES & SANDBOX */}
                    {affiliateSidebarTab === "cookies" && (
                      <div className="space-y-4 text-xs animate-fade-in">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-[10px] uppercase text-slate-500 font-mono font-bold">Simulated Device IP</label>
                            <button
                              type="button"
                              onClick={rotateSimulatedIp}
                              className="text-[9px] text-emerald-600 hover:text-emerald-700 font-bold font-sans flex items-center gap-1"
                            >
                              🔄 Change IP / New Device
                            </button>
                          </div>
                          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 flex justify-between items-center">
                            <span>{currentSimulatedIp}</span>
                            <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded uppercase font-bold font-sans scale-90">
                              {ppcRecentIps.includes(currentSimulatedIp) ? "Clicked (24h)" : "Fresh IP"}
                            </span>
                          </div>
                        </div>

                        {(() => {
                          const activeCookie = clickLogs.find(h => h.productId === selectedProductId);
                          return (
                            <div className="space-y-3 pt-1">
                              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl space-y-1.5 text-xs text-indigo-800">
                                <div className="flex items-center gap-2 font-bold text-indigo-900">
                                  <Info className="w-4 h-4 text-indigo-600 shrink-0" />
                                  <span>ကွတ်ကီးအခြေအနေ (Active Tracking Cookie)</span>
                                </div>
                                <div className="pl-6 space-y-1">
                                  {activeCookie ? (
                                    <>
                                      <p className="font-sans">ညွှန်းပို့သူ: <strong className="text-indigo-950 font-mono bg-indigo-100/60 px-1.5 py-0.5 rounded-md">{activeCookie.affiliateId}</strong></p>
                                      {activeCookie.tid && <p className="font-sans">TID (Tracking ID): <strong className="text-indigo-950 font-mono">{activeCookie.tid}</strong></p>}
                                      <p className="text-[10px] text-slate-400 font-mono">Timestamp: {activeCookie.timestamp}</p>
                                    </>
                                  ) : (
                                    <p className="text-slate-500 font-semibold italic font-sans">ကွတ်ကီး မရှိသေးပါ (No active cookie detected for this product)</p>
                                  )}
                                </div>
                              </div>
                              
                              {/* 🍪 Quick Cookie Overwrite */}
                              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3 space-y-2.5">
                                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">🍪 Quick Cookie Overwrite</span>
                                <div className="flex gap-2">
                                  <input 
                                    type="text"
                                    placeholder="Affiliate ID"
                                    value={manualCookieAffiliate}
                                    onChange={(e) => setManualCookieAffiliate(e.target.value)}
                                    className="flex-1 min-w-0 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-indigo-500 uppercase font-bold"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleSetManualCookie(manualCookieAffiliate, selectedProductId, "quick_override")}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1 shrink-0 shadow-sm"
                                  >
                                    Set Cookie
                                  </button>
                                  {activeCookie && (
                                    <button
                                      type="button"
                                      onClick={handleClearAllCookies}
                                      className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 font-bold px-2.5 py-1.5 rounded-xl text-xs transition-all shrink-0"
                                      title="Clear Cookies"
                                    >
                                      Clear
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* TAB 4: PURCHASE SIMULATOR */}
                    {affiliateSidebarTab === "purchase" && (
                      <div className="space-y-4 text-xs animate-fade-in">
                        <div className="p-3 bg-rose-50 border border-rose-100/50 rounded-2xl space-y-1 text-xs text-rose-800">
                          <div className="flex items-center gap-1.5 font-bold text-rose-900">
                            <CreditCard className="w-4 h-4 text-rose-600" />
                            <span>အလိုအလျောက်ဝယ်ယူမှုစမ်းသပ်ခြင်း</span>
                          </div>
                          <p className="text-[11px] text-rose-700 font-sans leading-relaxed">
                            ဝယ်ယူမှုပြုလုပ်ပြီး စုစုပေါင်းရရှိငွေကို စနစ်မှ Affiliate, JV Partner နှင့် Platform Fee အလိုအလျောက်ခွဲဝေပေးပုံကို လေ့လာပါ။
                          </p>
                        </div>

                        {/* Product selection */}
                        <div>
                          <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">Product to Purchase</label>
                          <select 
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-rose-500 font-mono font-semibold"
                          >
                            {products.map(p => (
                              <option key={p.id} value={p.id}>{p.name} ({p.priceMMK.toLocaleString()} Ks)</option>
                            ))}
                          </select>
                        </div>

                        {/* Active Referral Cookie status indicator */}
                        {(() => {
                          const activeCookie = clickLogs.find(h => h.productId === selectedProductId);
                          const matchedProduct = products.find(p => p.id === selectedProductId) || products[0];
                          return (
                            <div className="space-y-3">
                              <div>
                                <span className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">Active Cookie Referral Tracker</span>
                                {activeCookie ? (
                                  <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl text-[11px] text-emerald-800 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 font-bold">
                                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                      <span>Referral Cookie Active:</span>
                                    </div>
                                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-950 font-bold uppercase shrink-0">
                                      {activeCookie.affiliateId} ({matchedProduct.commissionPercent}%)
                                    </span>
                                  </div>
                                ) : (
                                  <div className="bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl text-[11px] text-slate-500 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 font-medium">
                                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                                      <span>Direct / No Referral Cookie</span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-sans italic font-semibold shrink-0">0% Commission</span>
                                  </div>
                                )}
                              </div>

                              {/* Customer Information inputs */}
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">Customer Name</label>
                                  <input 
                                    type="text"
                                    value={checkoutName}
                                    onChange={(e) => setCheckoutName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-rose-500 font-sans font-semibold"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">Customer Email</label>
                                  <input 
                                    type="email"
                                    value={checkoutEmail}
                                    onChange={(e) => setCheckoutEmail(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-rose-500 font-mono text-[11px]"
                                  />
                                </div>
                              </div>

                              {/* Payment Method Selector */}
                              <div>
                                <label className="block text-[10px] uppercase text-slate-500 mb-1.5 font-mono font-bold">Payment Gateway Method</label>
                                <div className="grid grid-cols-2 gap-1.5">
                                  {[
                                    { id: "KBZPay_Direct_API", label: "KBZPay Direct", icon: "📱" },
                                    { id: "WavePay_Direct_API", label: "WavePay Direct", icon: "📲" },
                                    { id: "Credit_Card", label: "Credit Card", icon: "💳" },
                                    { id: "PayPal", label: "PayPal Web", icon: "🌐" }
                                  ].map((m) => (
                                    <button
                                      key={m.id}
                                      type="button"
                                      onClick={() => setCheckoutPaymentMethod(m.id as any)}
                                      className={`p-2 border rounded-xl text-left transition-all flex items-center gap-1.5 ${
                                        checkoutPaymentMethod === m.id
                                          ? "border-rose-500 bg-rose-50/50 text-rose-950 font-bold ring-1 ring-rose-500"
                                          : "border-slate-200 hover:border-slate-300 bg-white text-slate-600"
                                      }`}
                                    >
                                      <span className="text-xs shrink-0">{m.icon}</span>
                                      <span className="text-[10px] leading-tight truncate">{m.label}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Interactive sub-credentials forms based on selected payment gateway */}
                              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-3 space-y-2.5">
                                <div className="flex justify-between items-center pb-1 border-b border-slate-200/50">
                                  <span className="text-[9px] uppercase font-mono font-bold text-slate-400">Gateway Virtual Credentials</span>
                                  <span className="text-[9px] bg-slate-200 text-slate-600 px-1 py-0.2 rounded font-mono font-bold uppercase scale-90">Auto-filled</span>
                                </div>

                                {checkoutPaymentMethod === "Credit_Card" && (
                                  <div className="space-y-2">
                                    <div>
                                      <label className="block text-[9px] uppercase text-slate-400 font-mono font-bold">Card Number</label>
                                      <input 
                                        type="text"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-mono focus:outline-none text-slate-700"
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <label className="block text-[9px] uppercase text-slate-400 font-mono font-bold">Expiry</label>
                                        <input 
                                          type="text"
                                          value={cardExpiry}
                                          onChange={(e) => setCardExpiry(e.target.value)}
                                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-mono focus:outline-none text-slate-700"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] uppercase text-slate-400 font-mono font-bold">CVV</label>
                                        <input 
                                          type="password"
                                          value={cardCVV}
                                          onChange={(e) => setCardCVV(e.target.value)}
                                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-mono focus:outline-none text-slate-700"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {checkoutPaymentMethod === "PayPal" && (
                                  <div className="space-y-2">
                                    <div>
                                      <label className="block text-[9px] uppercase text-slate-400 font-mono font-bold">PayPal Account Email</label>
                                      <input 
                                        type="email"
                                        value={paypalEmail}
                                        onChange={(e) => setPaypalEmail(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-mono focus:outline-none text-slate-700"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] uppercase text-slate-400 font-mono font-bold">Password</label>
                                      <input 
                                        type="password"
                                        value={paypalPassword}
                                        onChange={(e) => setPaypalPassword(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-mono focus:outline-none text-slate-700"
                                      />
                                    </div>
                                  </div>
                                )}

                                {checkoutPaymentMethod === "KBZPay_Direct_API" && (
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="block text-[9px] uppercase text-slate-400 font-mono font-bold">KBZPay Phone</label>
                                      <input 
                                        type="text"
                                        value={kbzPayPhone}
                                        onChange={(e) => setKbzPayPhone(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-mono focus:outline-none text-slate-700"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] uppercase text-slate-400 font-mono font-bold">OTP Code (6-digit)</label>
                                      <input 
                                        type="text"
                                        maxLength={6}
                                        value={kbzPayOtp}
                                        onChange={(e) => setKbzPayOtp(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-mono focus:outline-none text-slate-700"
                                      />
                                    </div>
                                  </div>
                                )}

                                {checkoutPaymentMethod === "WavePay_Direct_API" && (
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="block text-[9px] uppercase text-slate-400 font-mono font-bold">WavePay Phone</label>
                                      <input 
                                        type="text"
                                        value={wavePayPhone}
                                        onChange={(e) => setWavePayPhone(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-mono focus:outline-none text-slate-700"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] uppercase text-slate-400 font-mono font-bold">OTP Code (6-digit)</label>
                                      <input 
                                        type="text"
                                        maxLength={6}
                                        value={wavePayOtp}
                                        onChange={(e) => setWavePayOtp(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-mono focus:outline-none text-slate-700"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Simulate Button */}
                              <button
                                type="button"
                                onClick={handleSimulatePurchase}
                                className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider font-sans transition-all shadow-md flex items-center justify-center gap-1.5"
                              >
                                <CreditCard className="w-4 h-4" /> Simulate Completed Purchase ({matchedProduct.priceMMK.toLocaleString()} Ks)
                              </button>

                              {/* Dynamic split result breakdown */}
                              {lastSimulatedPurchaseResult && (
                                <div className="bg-slate-900 text-slate-100 rounded-2xl p-3.5 space-y-3.5 border border-slate-800 shadow-xl mt-3 animate-fade-in font-mono text-[10px]">
                                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                                    <div className="flex items-center gap-1">
                                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                      <span className="font-bold text-white text-[11px]">{lastSimulatedPurchaseResult.orderId}</span>
                                    </div>
                                    <span className="text-[9px] text-slate-500">{lastSimulatedPurchaseResult.timestamp}</span>
                                  </div>

                                  <div className="space-y-1 text-slate-300">
                                    <div className="flex justify-between">
                                      <span>Gross Received:</span>
                                      <span className="text-white font-bold">{lastSimulatedPurchaseResult.grossAmount.toLocaleString()} Ks</span>
                                    </div>
                                    <div className="flex justify-between text-rose-400">
                                      <span>- Commercial Tax (5%):</span>
                                      <span>{lastSimulatedPurchaseResult.taxAmount.toLocaleString()} Ks</span>
                                    </div>
                                    <div className="flex justify-between text-amber-400">
                                      <span>- Platform Fee (7.5% + 1.5k):</span>
                                      <span>{lastSimulatedPurchaseResult.platformFee.toLocaleString()} Ks</span>
                                    </div>
                                    <div className="h-px bg-slate-800 my-1" />
                                    <div className="flex justify-between text-emerald-400 font-bold">
                                      <span>Net Pool for Splits:</span>
                                      <span>{lastSimulatedPurchaseResult.netPool.toLocaleString()} Ks</span>
                                    </div>
                                  </div>

                                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 space-y-2">
                                    <span className="text-[8px] uppercase tracking-wider font-bold text-slate-500 block">Automated Split Engine Allocations:</span>
                                    
                                    {lastSimulatedPurchaseResult.affiliateId ? (
                                      <div className="flex justify-between text-indigo-300 font-bold">
                                        <span>Affiliate ({lastSimulatedPurchaseResult.affiliateId}):</span>
                                        <span>{lastSimulatedPurchaseResult.affShare.toLocaleString()} Ks</span>
                                      </div>
                                    ) : (
                                      <div className="flex justify-between text-slate-500">
                                        <span>Affiliate Share:</span>
                                        <span>0 Ks (Direct traffic)</span>
                                      </div>
                                    )}

                                    {lastSimulatedPurchaseResult.jvSplits && lastSimulatedPurchaseResult.jvSplits.map((jv: any, idx: number) => (
                                      <div key={idx} className="flex justify-between text-amber-300">
                                        <span>JV Partner ({jv.partnerName} - {jv.payoutPercent}%):</span>
                                        <span>{jv.share.toLocaleString()} Ks</span>
                                      </div>
                                    ))}

                                    <div className="h-px bg-slate-800 my-1" />
                                    <div className="flex justify-between text-emerald-300 font-bold">
                                      <span>Net Creator/Vendor Share:</span>
                                      <span>{lastSimulatedPurchaseResult.netVendorShare.toLocaleString()} Ks</span>
                                    </div>
                                  </div>

                                  <div className="flex justify-between items-center text-[9px] text-slate-500">
                                    <span>Buyer: {lastSimulatedPurchaseResult.buyerName}</span>
                                    <span className="uppercase">{lastSimulatedPurchaseResult.paymentMethod.replace(/_/g, " ")}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </section>
              )}

            </motion.div>
          </AnimatePresence>
        </main>

      </div>

      {/* --- Footer Bar --- */}
      <footer className="h-10 bg-white border-t border-slate-200 flex items-center justify-between px-6 shrink-0 mt-auto shadow-sm text-xs text-slate-400 font-sans">
        <div className="flex gap-4 uppercase font-bold text-[10px]">
          <span>Version: 1.1.0-ClickBank-Engine</span>
          <span>Node: Yangon-01</span>
          <span>Gateway: Direct Pay Integration</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">System Online</span>
        </div>
      </footer>

      {/* 💳 PAYMENT ENTRY POPUP MODAL */}
      {isPaymentPopupOpen && tempSelectedMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                <CreditCard className="w-4 h-4 animate-pulse" />
              </span>
              <div>
                <h4 className="font-bold font-display text-sm text-slate-800">ငွေပေးချေမှု အချက်အလက်</h4>
                <p className="text-[10px] text-slate-400 font-mono">Payment details configuration</p>
              </div>
            </div>

            <div className="space-y-3.5">
              {tempSelectedMethod === "Credit_Card" && (
                <>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">ကတ်နံပါတ် (Card Number)</label>
                    <input 
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                      placeholder="4111 2222 3333 4444"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">သက်တမ်းကုန်ရက် (Expiry)</label>
                      <input 
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                        placeholder="12/28"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">CVV ကုဒ်</label>
                      <input 
                        type="password"
                        value={cardCVV}
                        onChange={(e) => setCardCVV(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </>
              )}

              {tempSelectedMethod === "PayPal" && (
                <>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">PayPal Email Address</label>
                    <input 
                      type="email"
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                      placeholder="buyer@paypal.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">Password</label>
                    <input 
                      type="password"
                      value={paypalPassword}
                      onChange={(e) => setPaypalPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                      placeholder="••••••••"
                    />
                  </div>
                </>
              )}

              {tempSelectedMethod === "KBZPay_Direct_API" && (
                <>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">KBZPay ဖုန်းနံပါတ်</label>
                    <input 
                      type="text"
                      value={kbzPayPhone}
                      onChange={(e) => setKbzPayPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                      placeholder="09777666555"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">OTP ကုဒ် (၆ လုံး)</label>
                    <input 
                      type="text"
                      maxLength={6}
                      value={kbzPayOtp}
                      onChange={(e) => setKbzPayOtp(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                      placeholder="123456"
                    />
                  </div>
                </>
              )}

              {tempSelectedMethod === "WavePay_Direct_API" && (
                <>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">WavePay ဖုန်းနံပါတ်</label>
                    <input 
                      type="text"
                      value={wavePayPhone}
                      onChange={(e) => setWavePayPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                      placeholder="09999888777"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">OTP ကုဒ် (၆ လုံး)</label>
                    <input 
                      type="text"
                      maxLength={6}
                      value={wavePayOtp}
                      onChange={(e) => setWavePayOtp(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                      placeholder="654321"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsPaymentPopupOpen(false);
                  setTempSelectedMethod(null);
                }}
                className="w-1/2 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-all font-sans"
              >
                පယ်ဖျက်မည်
              </button>
              <button
                type="button"
                onClick={() => {
                  if (tempSelectedMethod) {
                    setCheckoutPaymentMethod(tempSelectedMethod);
                  }
                  setIsPaymentPopupOpen(false);
                  setTempSelectedMethod(null);
                }}
                className="w-1/2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm font-sans"
              >
                အတည်ပြုမည်
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 💬 LIVE MESSENGER WIDGET PREVIEW */}
      {widgetConfig.isEnabled && (
        <div 
          style={{
            position: "fixed",
            bottom: "80px",
            left: widgetConfig.buttonPosition === "bottom-left" ? "24px" : "auto",
            right: widgetConfig.buttonPosition === "bottom-right" ? "24px" : "auto",
            zIndex: 9999
          }}
          className="transition-all duration-300 md:block hidden"
        >
          <button
            onClick={handleMessengerWidgetClick}
            style={{ backgroundColor: widgetConfig.buttonColor }}
            className="text-white font-bold py-3 px-5 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all text-xs border border-white/20 animate-pulse"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span>{widgetConfig.buttonText}</span>
          </button>
        </div>
      )}

      {/* 📖 GLOBAL POPUP MYANMAR USER GUIDE MODAL */}
      {showGuide && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 space-y-4 shadow-[0_0_50px_rgba(0,0,0,0.6)] relative overflow-hidden text-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Decorative background blur */}
            <div className="absolute -right-12 -top-12 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl opacity-60 pointer-events-none" />
            
            <div className="flex items-start justify-between relative">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-emerald-950/80 text-emerald-400 border border-emerald-800/30 rounded-lg shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-white font-display text-sm sm:text-base">အကျိုး (Akyoe) အသုံးပြုနည်း လမ်းညွှန်</h3>
                </div>
              </div>
              <button 
                onClick={() => setShowGuide(false)}
                className="text-slate-400 hover:text-white p-1 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800 transition-all shrink-0 text-xs font-bold font-sans"
              >
                ✕ ပိတ်မည်
              </button>
            </div>

            {/* Interactive Role Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 relative z-10">
              <button
                type="button"
                onClick={() => { setActiveGuideTab("affiliate"); setGuideStep(0); }}
                className={`py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                  activeGuideTab === "affiliate"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/50"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Users className="w-3.5 h-3.5 shrink-0" /> ညွှန်းပို့သူ
              </button>
              <button
                type="button"
                onClick={() => { setActiveGuideTab("vendor"); setGuideStep(0); }}
                className={`py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                  activeGuideTab === "vendor"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/50"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 shrink-0" /> ထုတ်လုပ်သူ
              </button>
              <button
                type="button"
                onClick={() => { setActiveGuideTab("customer"); setGuideStep(0); }}
                className={`py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                  activeGuideTab === "customer"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/50"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 shrink-0" /> ဝယ်ယူသူ
              </button>
            </div>

            {/* Step Details */}
            {(() => {
              const currentSteps = activeGuideTab === "affiliate" ? [
                {
                  title: "ပစ္စည်း ရွေးချယ်ရန်",
                  desc: "ဈေးကွက်စာရင်းထဲမှ မိမိ စိတ်ဝင်စားသော သင်တန်း သို့မဟုတ် စာအုပ်များ၏ ဘေးရှိ Promote ခလုတ်ကို နှိပ်ပါ။"
                },
                {
                  title: "လင့်ခ် ထုတ်ယူရန်",
                  desc: "သင့်အသုံးပြုသူအမည် ထည့်သွင်းပြီး သင့်အတွက် သီးသန့်ရောင်းချရန်လင့်ခ်ကို ကူးယူပါ။"
                },
                {
                  title: "အလိုအလျောက် မှတ်သားမှုစနစ်",
                  desc: "လူတစ်ဦးဦးက သင့်လင့်ခ်ကို နှိပ်လိုက်သည်နှင့် ၎င်းတို့၏ Cookies နှင့် စက်ပစ္စည်း Fingerprint တို့ကို စနစ်က အလိုအလျောက် မှတ်သားထားမည်ဖြစ်ပါသည်။"
                },
                {
                  title: "ဝေစု ရယူရန်",
                  desc: "ဝယ်ယူမှုပြီးမြောက်သွားသည်နှင့် ရောင်းရငွေဝေစုကို သင့်ပိုက်ဆံအိတ်ထဲသို့ စနစ်မှ အလိုအလျောက် ချက်ချင်း ထည့်သွင်းပေးပါမည်။"
                }
              ] : activeGuideTab === "vendor" ? [
                {
                  title: "ပစ္စည်း တင်သွင်းရန်",
                  desc: "သင်ရောင်းချလိုသော ဗီဒီယိုသင်တန်း၊ စာအုပ် သို့မဟုတ် ဆော့ဖ်ဝဲလ်များကို ကော်မရှင်ရာခိုင်နှုန်း သတ်မှတ်ပြီး စနစ်တွင် စာရင်းသွင်းပါ။"
                },
                {
                  title: "ညွှန်းပို့သူများဖြင့် ရောင်းချရန်",
                  desc: "သင့်ပစ္စည်းကို အခြားသူများက လူမှုကွန်ရက်ပေါ်တွင် သီးသန့်လင့်ခ်များဖြင့် သင့်ကိုယ်စား ဝိုင်းဝန်းကြော်ငြာပေးပါလိမ့်မည်။"
                },
                {
                  title: "အလိုအလျောက် ခွဲဝေမှုစနစ်",
                  desc: "ဝယ်ယူသူမှ ငွေပေးချေပြီးသည်နှင့် သင့်အတွက်ဝေစုနှင့် ညွှန်းပို့သူအတွက် ကော်မရှင်ကို စနစ်မှ အလိုအလျောက် ချက်ချင်း ခွဲဝေပေးပါမည်။"
                }
              ] : [
                {
                  title: "လင့်ခ်ကို နှိပ်ရန်",
                  desc: "ညွှန်းပို့သူများ၏ ကြော်ငြာလင့်ခ်များမှတစ်ဆင့် ပစ္စည်းဝယ်ယူသည့်စာမျက်နှာသို့ ဝင်ရောက်ပါ။"
                },
                {
                  title: "ငွေပေးချေရန်",
                  desc: "KBZPay၊ WavePay သို့မဟုတ် ကတ်ပြားများဖြင့် လုံခြုံစွာ တိုက်ရိုက်ငွေပေးချေနိုင်ပါသည်။"
                },
                {
                  title: "ပစ္စည်း ချက်ချင်းရယူရန်",
                  desc: "ငွေပေးချေမှု အောင်မြင်သည်နှင့် ဒေါင်းလုဒ်လင့်ခ် သို့မဟုတ် သင်တန်းဝင်ခွင့်ကို စနစ်က ချက်ချင်း ထုတ်ပေးပါမည်။"
                }
              ];

              const step = Math.min(guideStep, currentSteps.length - 1);

              return (
                <div className="space-y-4">
                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-emerald-400 font-mono font-bold">
                      <span>အဆင့် {step + 1} / {currentSteps.length}</span>
                      <span>{Math.round(((step + 1) / currentSteps.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full transition-all duration-300"
                        style={{ width: `${((step + 1) / currentSteps.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800 space-y-1.5 min-h-[100px] flex flex-col justify-center">
                    <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-[10px] border border-emerald-800/50 shrink-0 font-mono">
                        {step + 1}
                      </span>
                      {currentSteps[step]?.title}
                    </h4>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {currentSteps[step]?.desc}
                    </p>
                  </div>

                  {/* Next/Prev Pagination Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      disabled={step === 0}
                      onClick={() => setGuideStep(prev => Math.max(0, prev - 1))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        step === 0
                          ? "bg-slate-950 text-slate-600 border-slate-900 cursor-not-allowed opacity-40"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 shadow-sm"
                      }`}
                    >
                      ← နောက်သို့
                    </button>

                    <button
                      type="button"
                      disabled={step === currentSteps.length - 1}
                      onClick={() => setGuideStep(prev => Math.min(currentSteps.length - 1, prev + 1))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        step === currentSteps.length - 1
                          ? "bg-slate-950 text-slate-600 border-slate-900 cursor-not-allowed opacity-40"
                          : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-emerald-500/50 shadow-md shadow-emerald-950/40"
                      }`}
                    >
                      ရှေ့သို့ →
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Practical simulation notification */}
            <div className="flex items-start gap-2.5 text-[11px] text-emerald-300 bg-emerald-950/40 border border-emerald-900/50 px-3 py-2.5 rounded-2xl">
              <Info className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>လက်တွေ့စမ်းသပ်ရန် ညာဘက်ခြမ်းရှိ <strong>Instant Checkout Simulator</strong> တွင် ဝယ်ယူမှုများပြုလုပ်ပြီး ကော်မရှင်ခွဲဝေပုံကို လေ့လာနိုင်ပါသည်။</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
