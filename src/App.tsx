import React, { useState, useMemo } from "react";
import {
  BookOpen,
  TrendingUp,
  ArrowRight,
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
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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
  tier: "Basic" | "Premium";
  targetCategory: string;
  budgetMMK: number;
  durationDays: number;
  adLengthSec: 15 | 30 | 60;
  status: "Active" | "Pending" | "Completed";
  createdAt: string;
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
    createdAt: "2026-07-02 08:00"
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
    createdAt: "2026-07-01 10:15"
  }
];

export default function App() {
  // --- Layout State ---
  const [userRole, setUserRole] = useState<"affiliate" | "brand">("affiliate");
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
  const [showGuide, setShowGuide] = useState<boolean>(true);
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
  const [simulatorTab, setSimulatorTab] = useState<"checkout" | "sales">("checkout");

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
  const [adCampaigns, setAdCampaigns] = useState<AdCampaign[]>(INITIAL_AD_CAMPAIGNS);
  const [newAdAdvertiserName, setNewAdAdvertiserName] = useState<string>("");
  const [newAdTier, setNewAdTier] = useState<"Basic" | "Premium">("Basic");
  const [newAdTargetCategory, setNewAdTargetCategory] = useState<string>("Software");
  const [newAdBudget, setNewAdBudget] = useState<number>(75000);
  const [newAdDuration, setNewAdDuration] = useState<number>(14);
  const [newAdLength, setNewAdLength] = useState<15 | 30 | 60>(30);
  const [activeAdSimId, setActiveAdSimId] = useState<string>("AD-901");
  const [adPlaySecondsRemaining, setAdPlaySecondsRemaining] = useState<number>(30);
  const [isAdPlaying, setIsAdPlaying] = useState<boolean>(false);
  const [selectedAdCategories, setSelectedAdCategories] = useState<string[]>(["Any"]);

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
  const handleSimulateBrandClick = () => {
    const hopId = `HOP-${Math.floor(10000 + Math.random() * 90000)}`;
    const socialChannels = ["Facebook", "TikTok", "Telegram", "Direct"];
    const randomSocial = socialChannels[Math.floor(Math.random() * socialChannels.length)];
    
    const newHop = {
      id: hopId,
      productId: brandSelectedProd,
      affiliateId: brandCustomAffiliate.trim().toUpperCase() || "AFF-101",
      ipAddress: `103.${Math.floor(20 + Math.random() * 80)}.${Math.floor(10 + Math.random() * 200)}.${Math.floor(1 + Math.random() * 254)}`,
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5...)",
      timestamp: new Date().toLocaleTimeString(),
      socialChannel: randomSocial,
      tid: brandCustomTid.trim() || undefined
    };

    setClickLogs(prev => [newHop, ...prev]);

    const newPixelLog = {
      id: `PXL-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toLocaleTimeString(),
      eventType: "click" as const,
      productId: brandSelectedProd,
      affiliateId: brandCustomAffiliate.toUpperCase() || "AFF-101",
      tid: brandCustomTid || undefined,
      details: `Referral Link Click: Visitor from ${randomSocial} landed on landing page ${brandLandingUrl}. Cookie stored.`
    };
    const newPagePixelLog = {
      id: `PXL-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toLocaleTimeString(),
      eventType: "page_view" as const,
      productId: brandSelectedProd,
      affiliateId: brandCustomAffiliate.toUpperCase() || "AFF-101",
      tid: brandCustomTid || undefined,
      details: `Visitor Page View Pixel: Read stored cookie of "${brandCustomAffiliate.toUpperCase()}". Linked session successfully.`
    };

    setPixelLogs(prev => [newPagePixelLog, newPixelLog, ...prev]);
    alert(`Live Pixel Success:\n1. Visitor clicked the generated hoplink.\n2. Akyoe Global Visitor Pixel fired on your landing page (${brandLandingUrl}) and linked this visitor to affiliate ${brandCustomAffiliate.toUpperCase()}!`);
  };

  const handleSimulateBrandPurchase = () => {
    const matchedProd = products.find(p => p.id === brandSelectedProd) || products[0];
    const rawPrice = matchedProd.priceMMK;
    const commPercent = matchedProd.commissionPercent;
    
    const tax = Math.round(rawPrice * 0.05);
    const platformFee = Math.round(rawPrice * 0.075) + 1500;
    const netPool = rawPrice - platformFee - tax;
    const affShare = Math.round(netPool * (commPercent / 100));
    const vendorShare = Math.round(netPool - affShare);

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: orderId,
      customerId: `CUST-${Math.floor(100 + Math.random() * 900)}`,
      customerName: "Kyaw Kyaw (Simulated)",
      customerEmail: "kyawkyaw@simulated.com",
      productId: brandSelectedProd,
      productName: matchedProd.name,
      grossAmount: rawPrice,
      paymentMethod: "KBZPay_Direct_API" as const,
      status: "Completed" as const,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      affiliateId: brandCustomAffiliate.toUpperCase() || "AFF-101",
      jvSplitsApplied: false
    };

    setOrders(prev => [newOrder, ...prev]);

    setNetworkBalances(prev => ({
      ...prev,
      vendorEarnings: prev.vendorEarnings + vendorShare,
      affiliateEarnings: prev.affiliateEarnings + affShare,
      platformFeeAccrued: prev.platformFeeAccrued + platformFee,
      commercialTaxDue: prev.commercialTaxDue + tax
    }));

    setProducts(prev => prev.map(prod => {
      if (prod.id === brandSelectedProd) {
        return {
          ...prod,
          gravityScore: parseFloat((prod.gravityScore + 1.5).toFixed(1))
        };
      }
      return prod;
    }));

    const newPixelLog = {
      id: `PXL-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toLocaleTimeString(),
      eventType: "purchase" as const,
      productId: brandSelectedProd,
      affiliateId: brandCustomAffiliate.toUpperCase() || "AFF-101",
      tid: brandCustomTid || undefined,
      details: `Conversion Pixel Fired! Order ${orderId} successfully matched. Paid: ${rawPrice.toLocaleString()} Ks. Merchant earned: ${vendorShare.toLocaleString()} Ks. Affiliate ${brandCustomAffiliate.toUpperCase()} earned: ${affShare.toLocaleString()} Ks!`
    };

    setPixelLogs(prev => [newPixelLog, ...prev]);
    alert(`Success: Simulated Customer Purchase Complete!\n\n- Product: ${matchedProd.name}\n- Price: ${rawPrice.toLocaleString()} Ks\n- Merchant Share: +${vendorShare.toLocaleString()} Ks\n- Affiliate Share (+${commPercent}%): +${affShare.toLocaleString()} Ks\n\nYour Brand Overview and Affiliate Balance have been updated in real-time!`);
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

        {/* --- Account Mode Switcher (Affiliate/Creator vs Brand/Merchant) --- */}
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200/50 w-full sm:w-auto max-w-sm justify-center shadow-inner">
          <button
            onClick={() => {
              setUserRole("affiliate");
              setActiveTab("marketplace");
            }}
            className={`px-4 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center gap-2 transition-all duration-200 w-1/2 sm:w-auto justify-center ${
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
            className={`px-4 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center gap-2 transition-all duration-200 w-1/2 sm:w-auto justify-center ${
              userRole === "brand"
                ? "bg-emerald-600 text-white shadow-sm font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            လုပ်ငန်းရှင် (Brand Side)
          </button>
        </div>

        <div className="flex items-center gap-4 justify-between w-full md:w-auto">
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
              {userRole === "brand" ? "Brand Merchant Modules" : "Marketplace Modules"}
            </span>
            <nav className="space-y-1">
              {userRole === "brand" ? (
                [
                  { id: "brand-dashboard", label: "Brand Overview", icon: BarChart3 },
                  { id: "tracking-setup", label: "Tracking & Codes Setup", icon: Shuffle },
                  { id: "brand-products", label: "Merchant Product Catalog", icon: ShoppingBag },
                  { id: "brand-campaigns", label: "Sponsor Ad Portal", icon: Megaphone },
                  { id: "conversion-logs", label: "Traffic & Pixel Logs", icon: Activity },
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
              ) : (
                [
                  { id: "marketplace", label: "Marketplace Offers", icon: ShoppingBag },
                  { id: "hoplink-generator", label: "Hoplink Engine", icon: Shuffle },
                  { id: "analytics", label: "Conversion Analytics", icon: BarChart3 },
                  { id: "earnings-payout", label: "My Earnings & Payouts", icon: Award },
                  { id: "ads-portal", label: "Advertising Portal", icon: Megaphone },
                  { id: "jv-splits", label: "JV Profit Sharing", icon: GitMerge },
                  { id: "split-calculator", label: "ClickBank Split Calc", icon: Percent },
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

                      {/* 💡 USER GUIDE TOOLTIP FOR TRANSITIONING TO HOPLINK ENGINE (AFFILIATE STEP 2) */}
                      {showGuide && activeGuideTab === "affiliate" && guideStep === 1 && tab.id === "hoplink-generator" && activeTab !== "hoplink-generator" && (
                        <div className="absolute left-0 lg:left-full top-0 lg:top-1 lg:ml-4 mt-12 lg:mt-0 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl p-4 shadow-2xl shadow-emerald-950/40 border border-emerald-500/40 w-72 text-xs animate-bounce-short">
                          <div className="absolute -top-1.5 lg:-top-0 left-6 lg:-left-1.5 lg:top-4 w-3 h-3 bg-slate-950 rotate-45 border-l border-t lg:border-t-0 lg:border-l-2 lg:border-b-2 border-emerald-500/40" />
                          <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1 font-display">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                            အဆင့် ၂: လင့်ခ် ထုတ်ယူရန်
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                            'Promote' ကို နှိပ်ပြီးပါက သင့်အတွက် သီးသန့် ရောင်းချရန်လင့်ခ် (Hoplink) ထုတ်ယူရန် ဤ 'Hoplink Engine' စာမျက်နှာကို နှိပ်ပါ။
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
                                setActiveTab("hoplink-generator");
                              }}
                              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md shadow-emerald-950/40 transition-all"
                            >
                              စာမျက်နှာ ဖွင့်မည် →
                            </button>
                          </div>
                        </div>
                      )}

                      {/* 💡 USER GUIDE TOOLTIP FOR TRANSITIONING TO JV SPLITS (VENDOR STEP 1) */}
                      {showGuide && activeGuideTab === "vendor" && guideStep === 0 && tab.id === "jv-splits" && activeTab !== "jv-splits" && (
                        <div className="absolute left-0 lg:left-full top-0 lg:top-1 lg:ml-4 mt-12 lg:mt-0 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl p-4 shadow-2xl shadow-emerald-950/40 border border-emerald-500/40 w-72 text-xs animate-bounce-short">
                          <div className="absolute -top-1.5 lg:-top-0 left-6 lg:-left-1.5 lg:top-4 w-3 h-3 bg-slate-950 rotate-45 border-l border-t lg:border-t-0 lg:border-l-2 lg:border-b-2 border-emerald-500/40" />
                          <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1 font-display">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                            အဆင့် ၁: ပစ္စည်း တင်သွင်းရန်
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                            ထုတ်လုပ်သူ (Vendor) အနေဖြင့် သင့်သင်တန်း သို့မဟုတ် စာအုပ်များကို ကော်မရှင်ခွဲဝေမှုနှုန်းသတ်မှတ်ပြီး ဤနေရာရှိ 'JV Profit Sharing' တွင် စာရင်းသွင်းပါ။
                          </p>
                          <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-800 font-sans">
                            <span className="text-[9px] text-slate-400">1/3 Steps</span>
                            <button
                              onClick={() => {
                                setActiveTab("jv-splits");
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
                                setActiveTab("jv-splits");
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

                      {/* 💡 USER GUIDE TOOLTIP FOR TRANSITIONING TO HOPLINK ENGINE (CUSTOMER STEP 1) */}
                      {showGuide && activeGuideTab === "customer" && guideStep === 0 && tab.id === "hoplink-generator" && activeTab !== "hoplink-generator" && (
                        <div className="absolute left-0 lg:left-full top-0 lg:top-1 lg:ml-4 mt-12 lg:mt-0 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl p-4 shadow-2xl shadow-emerald-950/40 border border-emerald-500/40 w-72 text-xs animate-bounce-short">
                          <div className="absolute -top-1.5 lg:-top-0 left-6 lg:-left-1.5 lg:top-4 w-3 h-3 bg-slate-950 rotate-45 border-l border-t lg:border-t-0 lg:border-l-2 lg:border-b-2 border-emerald-500/40" />
                          <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1 font-display">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                            အဆင့် ၁: လင့်ကို နှိပ်ရန်
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                            Customer အနေဖြင့် ဝယ်ယူမှုစတင်ရန် ညွှန်းပို့သူပေးသောလင့်ခ်ကို နှိပ်သည့်ပုံစံမျိုးစမ်းသပ်ရန် 'Hoplink Engine' စာမျက်နှာရှိ 'Simulate Click' ခလုတ်ကို နှိပ်ရန် လိုအပ်ပါသည်။
                          </p>
                          <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-emerald-800 font-sans">
                            <span className="text-[9px] text-slate-400">1/3 Steps</span>
                            <button
                              onClick={() => {
                                setActiveTab("hoplink-generator");
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
          <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl space-y-3 shadow-sm text-xs">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <TrendingUp className="w-4 h-4 animate-bounce" />
              <span>Gravity Leader</span>
            </div>
            <p className="text-slate-600 leading-relaxed font-sans">
              <strong>{topProduct.name}</strong> has a Gravity score of <strong>{topProduct.gravityScore}</strong>. Gravity measures active sales with a decay multiplier.
            </p>
          </div>

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
              
              {/* --- Left Tab-Specific Content Panel (7 cols) --- */}
              <section className="xl:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                
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
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Shuffle className="w-5 h-5 text-emerald-600" />
                        <h2 className="text-lg font-display font-bold text-slate-800">ခြေရာခံကုဒ် ထည့်သွင်းခြင်း (Tracking Setup)</h2>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      သင့်ကိုယ်ပိုင် Website (Landing Page) သို့မဟုတ် ကျေးဇူးတင်လွှာစာမျက်နှာ (Thank You Page) ပေါ်တွင် ညွှန်းပို့သူများ၏ ညွှန်းလင့်ခ် (Hoplink) အောင်မြင်စွာ အလုပ်လုပ်စေရန် ဤ ခြေရာခံကုဒ် (JavaScript SDK) ကို ထည့်သွင်းပေးရန် လိုအပ်ပါသည်။
                    </p>

                    {/* Interactive Code Generator Tool */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-4">
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
    w['AkyoePixel']=w['AkyoePixel']||function(){
      (w['AkyoePixel'].q=w['AkyoePixel'].q||[]).push(arguments)
    };
    var f=d.getElementsByTagName(s)[0], j=d.createElement(s);
    j.async=true; j.src='https://pixel.akyoe.com/sdk.js?id='+i;
    f.parentNode.insertBefore(j,f);
  })(window,document,'script','akyoe','${brandSelectedProd}');
</script>`}
                          </pre>
                        </div>

                        {/* Conversion Pixel script */}
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

                    {/* Simple Myanmar Explanation card */}
                    <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl space-y-2.5 text-xs text-slate-700 leading-relaxed font-sans">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold">
                        <Info className="w-4 h-4 text-emerald-600" />
                        <span>ခြေရာခံပုံစံ အကျဉ်းချုပ်ရှင်းလင်းချက် (How it works?)</span>
                      </div>
                      <ol className="list-decimal list-inside space-y-1.5 text-slate-600 pl-1 text-[11px]">
                        <li>
                          ညွှန်းပို့သူက ညွှန်းလင့်ခ် (Hoplink) ကို လူမှုကွန်ရက်တွင် ဝေမျှပြီး ဝယ်ယူသူက နှိပ်လိုက်သောအခါ Akyoe Network မှ ဝယ်သူ၏ Browser တွင် Affiliate ID Cookie တစ်ခုကို အလိုအလျောက် သတ်မှတ်လိုက်ပါမည်။
                        </li>
                        <li>
                          ဝယ်သူသည် သင့် Website Landing Page သို့ ရောက်ရှိချိန်တွင် <strong>Global Traffic Pixel</strong> က အဆိုပါ Cookie ကို ဖတ်ယူပြီး IP, Session တို့ဖြင့် ချိတ်ဆက်လိုက်ပါမည်။
                        </li>
                        <li>
                          ဝယ်ယူသူ ငွေပေးချေမှုအောင်မြင်ပြီး သင့်ဆိုက်ရှိ ကျေးဇူးတင်လွှာစာမျက်နှာသို့ ရောက်ရှိသွားချိန်တွင် <strong>Purchase Conversion Pixel</strong> ကုဒ် စတင်အလုပ်လုပ်ပြီး ညွှန်းပို့သူကို ကော်မရှင်ခွဲဝေမှု (Commission Split) စနစ်တကျ အလိုအလျောက် ပေးအပ်လိုက်ပါမည်။
                        </li>
                      </ol>
                    </div>
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

                {/* 📣 TAB: SPONSOR AD PORTAL */}
                {activeTab === "brand-campaigns" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Megaphone className="w-5 h-5 text-emerald-600" />
                        <h2 className="text-lg font-display font-bold text-slate-800">Sponsor Ads Management</h2>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      Akyoe Network တွင် ကြော်ငြာဘတ်ဂျက် ထည့်သွင်းပြီး Affiliate Portal ၏ ထိပ်ဆုံးတွင် သင့်ကုန်ပစ္စည်း ကြော်ငြာဘန်နာများ စပွန်ဆာအဖြစ် ချိတ်ဆက် ပြသနိုင်ပါသည်။
                    </p>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-3.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-700 uppercase tracking-wider font-mono">Active Sponsor Campaigns</span>
                        <span className="text-[10px] text-slate-400 font-mono font-bold">Cost Per Click (CPC)</span>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 bg-white border border-slate-200/60 rounded-xl space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-slate-800">Brand Banner Promo (Special Offer)</span>
                            <span className="font-mono text-emerald-600 font-bold">Budget: 15,000 Ks / Remaining</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: "65%" }}></div>
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                            <span>Status: ACTIVE (Displaying in Affiliate Portal)</span>
                            <span>CPC: 500 Ks / Click</span>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => alert("Simulated: Sponsor Ad Campaign budget topped up with 20,000 Ks!")}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl transition-all text-xs font-sans shadow-sm"
                      >
                        ကြော်ငြာဘတ်ဂျက် ထပ်မံ ဖြည့်သွင်းမည် +
                      </button>
                    </div>
                  </div>
                )}

                {/* 📡 TAB: LIVE TRAFFIC & PIXEL LOGS */}
                {activeTab === "conversion-logs" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-emerald-600" />
                        <h2 className="text-lg font-display font-bold text-slate-800">Traffic & Pixel Real-time Tracker</h2>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      သင့် Website တွင် ထည့်သွင်းထားသော JavaScript Pixel ကုဒ်များမှ ထွက်ပေါ်လာသည့် Live Event မှတ်တမ်းများကို စက္ကန့်နှင့်အမျှ ဤနေရာတွင် တိုက်ရိုက် စောင့်ကြည့်နိုင်ပါသည်။
                    </p>

                    <div className="bg-slate-950 text-emerald-400 rounded-3xl p-5 font-mono text-[11px] space-y-4 shadow-xl border border-slate-800">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 border-b border-slate-800 pb-2">
                        <span>📡 Live Pixel Event Stream</span>
                        <span>Auto-refresh active</span>
                      </div>

                      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                        {pixelLogs.map((log) => (
                          <div key={log.id} className="space-y-1 border-b border-slate-900 pb-2.5 last:border-0 last:pb-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                  log.eventType === "purchase"
                                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                    : log.eventType === "page_view"
                                      ? "bg-indigo-950 text-indigo-300 border border-indigo-800"
                                      : "bg-slate-900 text-slate-400 border border-slate-800"
                                }`}>
                                  {log.eventType}
                                </span>
                                <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                              </div>
                              <span className="text-[9px] text-slate-600">{log.id}</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed text-xs">{log.details}</p>
                            <div className="flex gap-4 text-[9px] text-slate-500">
                              <span>Product: <strong className="text-slate-400">{log.productId}</strong></span>
                              <span>Affiliate: <strong className="text-slate-400">{log.affiliateId}</strong></span>
                              {log.tid && <span>TID: <strong className="text-slate-400">{log.tid}</strong></span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
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

                    {/* 📖 MYANMAR USER GUIDE (USER-FRIENDLY & ACCESSIBLE) */}
                    {showGuide ? (() => {
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
                          desc: "KBZPay, WavePay သို့မဟုတ် ကတ်ပြားများဖြင့် လုံခြုံစွာ တိုက်ရိုက်ငွေပေးချေနိုင်ပါသည်။"
                        },
                        {
                          title: "ပစ္စည်း ချက်ချင်းရယူရန်",
                          desc: "ငွေပေးချေမှု အောင်မြင်သည်နှင့် ဒေါင်းလုဒ်လင့်ခ် သို့မဟုတ် သင်တန်းဝင်ခွင့်ကို စနစ်က ချက်ချင်း ထုတ်ပေးပါမည်။"
                        }
                      ];

                      return (
                        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-5 space-y-4 shadow-[0_0_30px_rgba(0,0,0,0.4)] relative overflow-hidden text-white">
                          {/* Decorative background element */}
                          <div className="absolute -right-12 -top-12 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl opacity-60" />
                          
                          <div className="flex items-start justify-between relative">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="p-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800/30 rounded-lg">
                                  <BookOpen className="w-4 h-4" />
                                </span>
                                <h3 className="font-bold text-white font-display text-sm sm:text-base">အကျိုး (Akyoe) အသုံးပြုနည်း လမ်းညွှန်</h3>
                              </div>
                              <p className="text-xs text-slate-400 font-sans">နည်းပညာ မကျွမ်းကျင်သူများအတွက် အလွယ်ကူဆုံး ရှင်းလင်းချက်</p>
                            </div>
                            <button 
                              onClick={() => setShowGuide(false)}
                              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-800/50 transition-all shrink-0"
                              title="ခေတ္တပိတ်ထားရန်"
                            >
                              <span className="text-[10px] font-bold px-2 py-1 bg-slate-900 text-slate-400 rounded-lg border border-slate-800 hover:border-slate-700 hover:text-white transition-all">✕ ပိတ်မည်</span>
                            </button>
                          </div>

                          {/* Interactive Role Tabs */}
                          <div className="grid grid-cols-3 gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 relative z-10">
                            <button
                              onClick={() => { setActiveGuideTab("affiliate"); setGuideStep(0); }}
                              className={`py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                                activeGuideTab === "affiliate"
                                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/50"
                                  : "text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              <Users className="w-3.5 h-3.5" /> ညွှန်းပို့သူ (Affiliate)
                            </button>
                            <button
                              onClick={() => { setActiveGuideTab("vendor"); setGuideStep(0); }}
                              className={`py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                                activeGuideTab === "vendor"
                                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/50"
                                  : "text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              <ShoppingBag className="w-3.5 h-3.5" /> ထုတ်လုပ်သူ (Vendor)
                            </button>
                            <button
                              onClick={() => { setActiveGuideTab("customer"); setGuideStep(0); }}
                              className={`py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                                activeGuideTab === "customer"
                                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/50"
                                  : "text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              <CreditCard className="w-3.5 h-3.5" /> ဝယ်ယူသူ (Customer)
                            </button>
                          </div>

                          {/* Dynamic Guides Content with Process Pagination / Progress Bar */}
                          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-xl p-4 space-y-4 relative z-10">
                            {/* Sleek progress bar */}
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400">
                                <span className="flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
                                  အဆင့် {guideStep + 1} / {currentSteps.length}
                                </span>
                                <span className="text-slate-400">{Math.round(((guideStep + 1) / currentSteps.length) * 100)}% ပြီးစီးမှု</span>
                              </div>
                              <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-300"
                                  style={{ width: `${((guideStep + 1) / currentSteps.length) * 100}%` }}
                                />
                              </div>
                            </div>

                            {/* Clickable Step Pagination Bullets */}
                            <div className="flex items-center justify-start gap-1.5 pb-1">
                              {currentSteps.map((_, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setGuideStep(idx)}
                                  className={`h-5 px-2 rounded-md text-[10px] font-bold transition-all border ${
                                    guideStep === idx
                                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-500/50 text-white shadow-sm"
                                      : "bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-300"
                                  }`}
                                >
                                  {idx + 1}
                                </button>
                              ))}
                            </div>

                            {/* Step Details */}
                            <div className="bg-slate-950/40 rounded-xl p-3 border border-slate-800/80 space-y-1.5 min-h-[90px] flex flex-col justify-center">
                              <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                                <span className="w-4 h-4 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-[9px] border border-emerald-800/50 shrink-0 font-mono">
                                  {guideStep + 1}
                                </span>
                                {currentSteps[guideStep].title}
                              </h4>
                              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                                {currentSteps[guideStep].desc}
                              </p>
                            </div>

                            {/* Next/Prev Pagination Buttons */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                              <button
                                disabled={guideStep === 0}
                                onClick={() => setGuideStep(prev => Math.max(0, prev - 1))}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ${
                                  guideStep === 0
                                    ? "bg-slate-950 text-slate-600 border-slate-900 cursor-not-allowed opacity-50"
                                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 shadow-sm"
                                }`}
                              >
                                ← နောက်သို့
                              </button>

                              <button
                                disabled={guideStep === currentSteps.length - 1}
                                onClick={() => setGuideStep(prev => Math.min(currentSteps.length - 1, prev + 1))}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ${
                                  guideStep === currentSteps.length - 1
                                    ? "bg-slate-950 text-slate-600 border-slate-900 cursor-not-allowed opacity-50"
                                    : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-emerald-500/50 shadow-md shadow-emerald-950/40"
                                }`}
                              >
                                ရှေ့သို့ →
                              </button>
                            </div>
                          </div>

                          {/* Practical simulation notification */}
                          <div className="flex items-center gap-2.5 text-[11px] text-emerald-300 bg-emerald-950/40 border border-emerald-900/50 px-3 py-2.5 rounded-xl">
                            <Info className="w-4 h-4 shrink-0 text-emerald-400" />
                            <span>လက်တွေ့စမ်းသပ်ရန် ညာဘက်ခြမ်းရှိ <strong>Instant Checkout Simulator</strong> တွင် ဝယ်ယူမှုများပြုလုပ်ပြီး ကော်မရှင်ခွဲဝေပုံကို လေ့လာနိုင်ပါသည်။</span>
                          </div>
                        </div>
                      );
                    })() : (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowGuide(true)}
                          className="flex items-center gap-1.5 text-xs text-emerald-400 bg-slate-900 hover:bg-slate-850 px-4 py-2 rounded-xl border border-emerald-500/30 font-bold transition-all shadow-md shadow-emerald-950/20 hover:border-emerald-500/50"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> 📖 အသုံးပြုနည်း လမ်းညွှန်ကို ပြန်ဖွင့်ရန် (Myanmar Guide)
                        </button>
                      </div>
                    )}

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
                                <h4 className="font-bold text-slate-800 font-display text-sm truncate">{p.name}</h4>
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
                                      handleGenerateHoplink(p.id, activeAffiliateInput);
                                      setActiveTab("hoplink-generator");
                                      if (showGuide && activeGuideTab === "affiliate" && guideStep === 0) {
                                        setGuideStep(1);
                                      }
                                    }}
                                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all shrink-0 hover:scale-[1.03]"
                                  >
                                    Promote <ArrowRight className="w-3 h-3" />
                                  </button>

                                  {/* 💡 USER GUIDE TOOLTIP FOR PROMOTING FIRST PRODUCT (AFFILIATE STEP 1) */}
                                  {showGuide && activeGuideTab === "affiliate" && guideStep === 0 && idx === 0 && (
                                    <div className="absolute right-0 top-full mt-2.5 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl p-4 shadow-2xl shadow-emerald-950/40 border border-emerald-500/40 w-72 text-xs animate-bounce-short">
                                      <div className="absolute -top-1.5 right-6 w-3 h-3 bg-slate-950 rotate-45 border-l border-t border-emerald-500/40" />
                                      <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1 font-display">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                        အဆင့် ၁: ကော်မရှင် စတင်ရှာရန်
                                      </div>
                                      <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                                        ဤ 'Promote' ခလုတ်ကို နှိပ်ပြီး ဤပစ္စည်းကို ရောင်းချရန် သင့်အတွက် သီးသန့်လင့်ခ် (Hoplink) ထုတ်ယူရန် စတင်လိုက်ပါ!
                                      </p>
                                      <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-800 font-sans">
                                        <span className="text-[9px] text-slate-400 font-mono">1/4 Steps</span>
                                        <button
                                          onClick={() => {
                                            setSelectedProductId(p.id);
                                            handleGenerateHoplink(p.id, activeAffiliateInput);
                                            setActiveTab("hoplink-generator");
                                            setGuideStep(1);
                                          }}
                                          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-2 py-1 rounded text-[10px] font-bold shadow-md shadow-emerald-950/40 transition-all"
                                        >
                                          နှိပ်မည် →
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                  {/* 💡 USER GUIDE TOOLTIP FOR VENDOR CONFIRMING PRODUCT LISTED (VENDOR STEP 2) */}
                                  {showGuide && activeGuideTab === "vendor" && guideStep === 1 && idx === 0 && (
                                    <div className="absolute right-0 top-full mt-2.5 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl p-4 shadow-2xl shadow-emerald-950/40 border border-emerald-500/40 w-72 text-xs animate-bounce-short">
                                      <div className="absolute -top-1.5 right-6 w-3 h-3 bg-slate-950 rotate-45 border-l border-t border-emerald-500/40" />
                                      <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1 font-display">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                        အဆင့် ၂: ညွှန်းပို့သူများဖြင့် ရောင်းချခြင်း
                                      </div>
                                      <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                                        သင်တင်သွင်းလိုက်သော ပစ္စည်းများကို Affiliate များက Promote လုပ်ပြီး လူမှုကွန်ရက်ပေါ်တွင် သီးသန့်လင့်ခ်များဖြင့် သင့်ကိုယ်စား စတင်ဝိုင်းဝန်းကြော်ငြာရောင်းချပေးနိုင်ပါပြီ!
                                      </p>
                                      <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-800 font-sans">
                                        <button
                                          onClick={() => {
                                            setGuideStep(0);
                                            setActiveTab("jv-splits");
                                          }}
                                          className="text-[10px] text-slate-400 hover:text-white font-bold transition-colors"
                                        >
                                          ← နောက်သို့
                                        </button>
                                        <button
                                          onClick={() => {
                                            setGuideStep(2);
                                          }}
                                          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md shadow-emerald-950/40 transition-all"
                                        >
                                          နားလည်ပါပြီ ရှေ့သို့ →
                                        </button>
                                      </div>
                                    </div>
                                  )}
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
                  </div>
                )}

                {/* 🔄 TAB: HOPLINK ENGINE */}
                {activeTab === "hoplink-generator" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <Shuffle className="w-5 h-5 text-emerald-600" />
                      <h2 className="text-lg font-display font-bold text-slate-800">Secure Hoplink Engine</h2>
                    </div>

                    <div className="text-xs text-slate-600 space-y-4 font-sans leading-relaxed">
                      <p>
                        In a modern automated affiliate network, <strong>Hoplinks</strong> automatically trace browser cookies and device fingerprints when clicked. When a purchase is completed through an active click session, commission splits are automatically assigned to the designated affiliate.
                      </p>

                      <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-4">
                        <h4 className="font-bold text-slate-700">Hoplink Generator Control Panel</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">1. Select Affiliate Target Product</label>
                            <select 
                              value={selectedProductId}
                              onChange={(e) => setSelectedProductId(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-500"
                            >
                              {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                              ))}
                            </select>
                          </div>

                          <div className="relative">
                            <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">2. Your Affiliate Account Nickname</label>
                            <input 
                              type="text"
                              value={activeAffiliateInput}
                              onChange={(e) => setActiveAffiliateInput(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
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
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                            placeholder="e.g. facebook_ad_campaign_july"
                          />
                        </div>

                        <button
                          onClick={() => handleGenerateHoplink(selectedProductId, activeAffiliateInput)}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider font-mono transition-all"
                        >
                          Generate Encrypted Hoplink
                        </button>
                      </div>

                      {generatedHoplink && (
                        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl space-y-3">
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
                          <div className="flex gap-2 pt-1.5">
                            <div className="relative inline-block w-full">
                              <button
                                onClick={handleTriggerHopClick}
                                className="w-full sm:w-auto bg-white hover:bg-emerald-100 border border-emerald-200 text-[10px] font-mono font-bold text-emerald-700 px-3.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                              >
                                <ExternalLink className="w-3.5 h-3.5" /> Simulate Click (Hop)
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
                                        setSimulatorTab("checkout");
                                        setGuideStep(activeGuideTab === "affiliate" ? 3 : 1);
                                        if (activeGuideTab === "affiliate") {
                                          setActiveTab("marketplace");
                                        }
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

                      {/* 📢 Creator & Affiliate Ad-Revenue Sharing Control Panel */}
                      <div className="bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100 rounded-3xl p-5 space-y-4 shadow-sm relative overflow-hidden">
                        <div className="absolute -right-8 -top-8 w-24 h-24 bg-indigo-100 rounded-full blur-xl opacity-50" />
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="p-1 bg-indigo-100 text-indigo-700 rounded-lg">
                                <Megaphone className="w-4 h-4" />
                              </span>
                              <h3 className="font-bold text-slate-800 font-display text-xs sm:text-sm">ကြော်ငြာများ ပြသခွင့်ပြုမှု တံခါးပေါက် (Creator Ad-Network Switch)</h3>
                            </div>
                            <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                              သင့်ထုတ်ကုန် သို့မဟုတ် ညွှန်းဆိုမှု စာမျက်နှာများတွင် ကြော်ငြာများ ပြသခွင့်ပြုပြီး စုစုပေါင်းလည်ပတ်မှုအပေါ် အပိုဝင်ငွေရယူပါ
                            </p>
                          </div>
                          
                          {/* Toggle Switch */}
                          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
                            <span className={`text-[10px] font-mono font-bold uppercase ${allowAdvertisements ? "text-indigo-600" : "text-slate-400"}`}>
                              {allowAdvertisements ? "ALLOWED (ဖွင့်ထားသည်)" : "BLOCKED (ပိတ်ထားသည်)"}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setAllowAdvertisements(!allowAdvertisements);
                                if (isAdPlaying) setIsAdPlaying(false);
                              }}
                              className={`w-12 h-6 flex items-center rounded-full p-1 transition-all ${
                                allowAdvertisements ? "bg-indigo-600" : "bg-slate-300"
                              }`}
                            >
                              <div
                                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all duration-200 ${
                                  allowAdvertisements ? "translate-x-6" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        {/* Myanmar language instructions */}
                        <div className="text-[11px] text-slate-600 leading-relaxed space-y-1.5 border-t border-slate-200/60 pt-3 relative z-10">
                          <p className="font-bold text-indigo-800">💡 ဖန်တီးသူနှင့် ညွှန်းပို့သူများအတွက် အသုံးဝင်ပုံ လမ်းညွှန်:</p>
                          <ul className="list-disc pl-4 space-y-1">
                            <li><strong>ကြော်ငြာဖွင့်ထားလျှင် (On):</strong> KBZPay/WavePay Checkout သို့မဟုတ် Hoplink စာမျက်နှာတွင် အခြားလုပ်ငန်းရှင်များ၏ ကြော်ငြာများကို ၁၅ စက္ကန့်၊ စက္ကန့် ၃၀ သို့မဟုတ် စက္ကန့် ၆၀ တိုတောင်းသော ဗီဒီယို/စာတန်း ပုံစံဖြင့် ပြသမည်ဖြစ်ပြီး သင့်အတွက် အပိုဆုကြေး (Ad Premium) ၂.၅% ကို ချက်ချင်း ပေါင်းထည့်ပေးပါမည်။</li>
                            <li><strong>ကြော်ငြာပိတ်ထားလျှင် (Off):</strong> မည်သည့်ကြော်ငြာမျှ ပြသမည်မဟုတ်ဘဲ အခြေခံ ကော်မရှင်ခွဲဝေမှုစနစ်အတိုင်းသာ ဆက်လက်လည်ပတ်မည် ဖြစ်ပါသည်။</li>
                          </ul>
                        </div>

                        {/* Interactive Ad Player Simulator with smooth-folding motion */}
                        <AnimatePresence initial={false}>
                          {allowAdvertisements ? (
                            <motion.div
                              initial={{ height: 0, opacity: 0, marginTop: 0 }}
                              animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                              exit={{ height: 0, opacity: 0, marginTop: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="bg-white rounded-2xl p-4 border border-indigo-100/50 space-y-4 relative z-10">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                  <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase">ခွင့်ပြုလိုသည့် ကြော်ငြာအမျိုးအစားများ (Allowed Ad Categories)</span>
                                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-lg">Round Checkboxes</span>
                                </div>

                                <div className="space-y-3">
                                  <label className="block text-xs font-semibold text-slate-700 font-sans">
                                    ပြသခွင့်ပြုမည့် ကြော်ငြာအမျိုးအစားများကို ရွေးချယ်ပါ (Select categories of advertisement allowed):
                                  </label>

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
                                          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                                            isSelected
                                              ? "border-indigo-500 bg-indigo-50/40 text-indigo-950 font-semibold"
                                              : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white hover:bg-slate-50/50"
                                          }`}
                                        >
                                          {/* Round Checkbox */}
                                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                            isSelected
                                              ? "border-indigo-600 bg-indigo-600 text-white"
                                              : "border-slate-300 bg-white"
                                          }`}>
                                            {isSelected && (
                                              <div className="w-2.5 h-2.5 rounded-full bg-white transition-transform scale-100" />
                                            )}
                                          </div>
                                          
                                          <div className="font-sans leading-tight">
                                            <div className="text-xs font-bold text-slate-800">{cat.nameMm}</div>
                                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{cat.name}</div>
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl text-center text-xs text-slate-400 font-sans">
                                ⚠️ Ads are currently disabled by the creator. Switch allow advertisements ON to configure allowed categories.
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Note: Affiliate Progress & Instant Payout Hub has been moved to its own dedicated 'earnings-payout' tab for a cleaner, simplified, and beginner-friendly user experience. */}
                    </div>
                  </div>
                )}

                {/* 📊 TAB: ANALYTICS & REPORTS */}
                {activeTab === "analytics" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-emerald-600" />
                        <h2 className="text-lg font-display font-bold text-slate-800">Affiliate Traffic Analytics</h2>
                      </div>
                      <select
                        value={filterAffiliateId}
                        onChange={(e) => setFilterAffiliateId(e.target.value)}
                        className="text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg p-1.5"
                      >
                        <option value="All">All Traffic Filters</option>
                        <option value="AFF-101">Filter AFF-101</option>
                        <option value="AFF-202">Filter AFF-202</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Hop clicks</div>
                        <div className="text-2xl font-bold font-mono text-slate-800 mt-1">{clickLogs.length}</div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Sales count</div>
                        <div className="text-2xl font-bold font-mono text-slate-800 mt-1">
                          {orders.filter(o => o.status === "Completed").length}
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Conversion Rate</div>
                        <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">{conversionRatePercent}%</div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
                        <div className="text-[10px] uppercase font-bold text-slate-400">EPC (Avg Ks)</div>
                        <div className="text-2xl font-bold font-mono text-indigo-600 mt-1">{epcMMK.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Hop Clicks Stream Logs Table */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Incoming Hop Traffic Streams (Real-Time)</span>
                      <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                        <table className="w-full text-left text-xs text-slate-600">
                          <thead className="bg-slate-50 text-[10px] uppercase text-slate-400 font-mono font-bold border-b border-slate-100">
                            <tr>
                              <th className="px-4 py-2">Click ID</th>
                              <th className="px-4 py-2">Affiliate</th>
                              <th className="px-4 py-2">Source</th>
                              <th className="px-4 py-2">Tracking (TID)</th>
                              <th className="px-4 py-2 text-right">Time</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50 font-mono">
                            {clickLogs.map((log) => (
                              <tr key={log.id} className="hover:bg-slate-50">
                                <td className="px-4 py-2.5 text-slate-500 font-semibold">{log.id}</td>
                                <td className="px-4 py-2.5 font-bold text-slate-800">{log.affiliateId}</td>
                                <td className="px-4 py-2.5 text-slate-600">{log.socialChannel}</td>
                                <td className="px-4 py-2.5 text-indigo-600 font-bold">{log.tid || "—"}</td>
                                <td className="px-4 py-2.5 text-right text-slate-500">{log.timestamp}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* 🏆 TAB: MY EARNINGS & INSTANT PAYOUTS */}
                {activeTab === "earnings-payout" && (
                  <div className="space-y-6">
                    {/* Header Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="p-1 bg-emerald-50 text-emerald-600 rounded-lg">
                            <Award className="w-5 h-5" />
                          </span>
                          <h2 className="text-lg font-display font-bold text-slate-800">သင့်ပိုက်ဆံအိတ်နှင့် ချက်ချင်းငွေထုတ်စနစ် (My Wallet & Instant Payout)</h2>
                        </div>
                        <p className="text-xs text-slate-500 font-sans mt-0.5 font-semibold">
                          ၁၀၀% အခမဲ့ဖြစ်ပြီး မည်သည့်စပေါ်ငွေမျှ မလိုပါ။ လူကြိုက်များသော မိုဘိုင်းလ်ပိုက်ဆံအိတ်များဖြင့် စက္ကန့်ပိုင်းအတွင်း ချက်ချင်း ငွေထုတ်ယူလိုက်ပါ!
                        </p>
                      </div>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-100 uppercase font-mono tracking-wider self-start sm:self-center">
                        🟢 100% Free Account
                      </span>
                    </div>

                    {/* Beginner Quick Guide Grid (Reduces words to high-impact cards) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-slate-50/60 rounded-2xl border border-slate-100 flex items-start gap-3">
                        <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold font-mono text-xs shrink-0">1</span>
                        <div>
                          <h4 className="font-bold text-slate-800 text-xs font-sans">လင့်ခ်မျှဝေပါ (Promote)</h4>
                          <p className="text-[10.5px] text-slate-500 font-sans mt-0.5 leading-relaxed font-semibold">သင့်ရောင်းချမှုလင့်ခ်ကို လူမှုကွန်ရက်တွင် မျှဝေပါ။ တစ်ဦး နှိပ်လိုက်တိုင်း ၅၀ ကျပ် စနစ်က ချက်ချင်း ဆုကြေးပေးပါသည်။</p>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50/60 rounded-2xl border border-slate-100 flex items-start gap-3">
                        <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold font-mono text-xs shrink-0">2</span>
                        <div>
                          <h4 className="font-bold text-slate-800 text-xs font-sans">ဝင်ငွေစုဆောင်းပါ (Collect)</h4>
                          <p className="text-[10.5px] text-slate-500 font-sans mt-0.5 leading-relaxed font-semibold">သင့်လင့်ခ်မှ ဝယ်ယူသူတိုင်းအတွက် ကော်မရှင် (၅,၀၀၀ ကျပ် မှ ၁၀,၀၀၀ ကျပ်အထိ) ကို သင့်ပိုက်ဆံအိတ်ထဲ တိုက်ရိုက်ရပါမည်။</p>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50/60 rounded-2xl border border-slate-100 flex items-start gap-3">
                        <span className="p-2 bg-amber-50 text-amber-600 rounded-xl font-bold font-mono text-xs shrink-0">3</span>
                        <div>
                          <h4 className="font-bold text-slate-800 text-xs font-sans">ချက်ချင်းထုတ်ယူပါ (Payout)</h4>
                          <p className="text-[10.5px] text-slate-500 font-sans mt-0.5 leading-relaxed font-semibold">အနည်းဆုံး ၅,၀၀၀ ကျပ် ပြည့်သည်နှင့် KBZPay သို့မဟုတ် WavePay သို့ အချိန်မရွေး ချက်ချင်း ငွေထုတ်ယူနိုင်ပါသည်။</p>
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
                            <span className="text-2xl font-bold font-mono text-slate-800 mt-1 block">{(clickLogs.length).toLocaleString()} Clicks</span>
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
                            <span className="text-2xl font-bold font-mono text-slate-800 mt-1 block">
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
                      {/* Payout Request Card */}
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
                          {/* Payment Gateway selector CARDS instead of standard dropdown (Sleek and beginner friendly) */}
                          <div className="space-y-2">
                            <label className="block text-[10px] uppercase text-slate-500 font-mono font-bold">
                              ၁။ ငွေထုတ်ယူမည့် စနစ်ရွေးချယ်ပါ (Select Gateway)
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {[
                                { id: "KBZPay", label: "KBZPay Applet", color: "border-blue-500 bg-blue-50/30 text-blue-900", iconColor: "bg-blue-600" },
                                { id: "WavePay", label: "WavePay Applet", color: "border-amber-500 bg-amber-50/30 text-amber-900", iconColor: "bg-amber-500" },
                                { id: "KBZ Bank", label: "KBZ Bank", color: "border-rose-500 bg-rose-50/30 text-rose-900", iconColor: "bg-rose-600" },
                                { id: "CB Bank", label: "CB Bank", color: "border-sky-500 bg-sky-50/30 text-sky-900", iconColor: "bg-sky-600" },
                                { id: "AYA Bank", label: "AYA Bank", color: "border-red-500 bg-red-50/30 text-red-900", iconColor: "bg-red-600" }
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

                            {/* Quick Select Amount Pills (Extremely beginner friendly) */}
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
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">
                                ၄။ အကောင့်အမည် (Account Holder Name)
                              </label>
                              <input
                                type="text"
                                placeholder="ဥပမာ - ကိုစိုင်းထွန်း"
                                value={payoutAccountNameInput}
                                onChange={(e) => setPayoutAccountNameInput(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 text-slate-800"
                                required
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider font-mono shadow-md shadow-emerald-950/20 transition-all hover:scale-[1.01]"
                          >
                            Confirm & Withdraw Commission (ချက်ချင်းထုတ်ယူမည်)
                          </button>
                        </form>
                      </div>

                      {/* Ledger History List Card */}
                      <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                          <h3 className="font-bold text-slate-800 text-xs sm:text-sm font-display uppercase tracking-wider">
                            Payout History (ထုတ်ယူမှုမှတ်တမ်း)
                          </h3>
                          <span className="text-[10px] bg-indigo-50 text-indigo-700 font-mono font-bold px-2 py-0.5 rounded-lg">
                            {payoutHistory.length} logs
                          </span>
                        </div>

                        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
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
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <Percent className="w-5 h-5 text-emerald-600" />
                      <h2 className="text-lg font-display font-bold text-slate-800">Automated Split Engine Simulator</h2>
                    </div>

                    <p className="text-xs text-slate-600 font-sans leading-relaxed">
                      ClickBank's commission splits are calculated strictly based on the <strong>Net Payout Pool</strong> after network processing fees and national taxes (like Myanmar’s 5% Commercial Tax) are deducted first.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-3xl border border-slate-200">
                      <div className="space-y-4">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Interactive Parameters</span>
                        <div>
                          <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono">Product Offer Price (Ks)</label>
                          <input 
                            type="number"
                            step="5000"
                            value={calcPrice}
                            onChange={(e) => setCalcPrice(parseInt(e.target.value) || 50000)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono">Affiliate Commission Split (%)</label>
                          <input 
                            type="number"
                            min="0"
                            max="100"
                            value={calcCommission}
                            onChange={(e) => setCalcCommission(parseInt(e.target.value) || 50)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono font-bold"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Accrued Taxes & Platform Fees</span>
                        <div>
                          <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono">ClickBank Processing Fee (%)</label>
                          <input 
                            type="number"
                            step="0.5"
                            value={calcPlatformFeePercent}
                            onChange={(e) => setCalcPlatformFeePercent(parseFloat(e.target.value) || 7.5)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono">Myanmar Commercial Tax (%)</label>
                          <input 
                            type="number"
                            value={calcTaxPercent}
                            onChange={(e) => setCalcTaxPercent(parseInt(e.target.value) || 5)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Breakdown Invoice Output */}
                    <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-3xl space-y-3.5 text-xs text-slate-600 font-mono">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase block font-display">Calculated Ledger Split Invoicing</span>
                      
                      <div className="flex justify-between border-b border-slate-200/50 pb-2">
                        <span>1. Product Retail Price</span>
                        <span className="font-bold text-slate-800">{computedSplit.gross.toLocaleString()} Ks</span>
                      </div>
                      <div className="flex justify-between">
                        <span>- ClickBank Platform Fee (7.5% + 1,500 Ks)</span>
                        <span className="text-red-600 font-medium">-{computedSplit.platformFee.toLocaleString()} Ks</span>
                      </div>
                      <div className="flex justify-between">
                        <span>- Myanmar Union Commercial Tax (5% CT)</span>
                        <span className="text-red-600 font-medium">-{computedSplit.commercialTax.toLocaleString()} Ks</span>
                      </div>
                      <div className="flex justify-between border-b border-dashed border-emerald-200 pb-2">
                        <span>Net Pool for Splits</span>
                        <span className="font-bold text-indigo-600">{computedSplit.netPool.toLocaleString()} Ks</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-emerald-800 font-semibold">2. Affiliate Share ({calcCommission}%)</span>
                        <span className="font-bold text-emerald-700">{computedSplit.affiliateShare.toLocaleString()} Ks</span>
                      </div>
                      <div className="flex justify-between">
                        <span>3. Vendor Share Base</span>
                        <span className="font-bold text-slate-800">{computedSplit.vendorShareBase.toLocaleString()} Ks</span>
                      </div>

                      {computedSplit.jvSplits.length > 0 && (
                        <div className="pl-4 border-l border-indigo-200 space-y-1 my-2">
                          <span className="text-[10px] text-indigo-700 font-bold block uppercase font-display">Contract splits applied:</span>
                          {computedSplit.jvSplits.map((jv, idx) => (
                            <div key={idx} className="flex justify-between text-[11px] text-indigo-800">
                              <span>Partner ({jv.partnerName} - {jv.percent}%)</span>
                              <span>-{jv.amount.toLocaleString()} Ks</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-between border-t border-slate-200 pt-2 text-slate-800 font-bold">
                        <span>Net Vendor Payout (Take-Home)</span>
                        <span className="text-indigo-600">{computedSplit.netVendorShare.toLocaleString()} Ks</span>
                      </div>
                    </div>
                  </div>
                )}

              </section>

              {/* --- Right Interactive Column: Simulator Panels (5 cols) --- */}
              <section className="xl:col-span-5">
                {userRole === "brand" ? (
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
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
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
                        
                        <button
                          onClick={handleSimulateBrandPurchase}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          ဝယ်ယူမှု ပြီးမြောက်ကြောင်း စမ်းသပ်မည် (Simulate Purchase)
                        </button>
                      </div>

                      {/* Diagnostic console recap */}
                      <div className="bg-slate-900 rounded-xl p-3 text-[10px] text-slate-300 font-mono space-y-1">
                        <p className="text-slate-500">// Debugger Variables:</p>
                        <p>Cookie: <span className="text-amber-400">akyoe_aff_cookie="{brandCustomAffiliate.toUpperCase()}"</span></p>
                        <p>Mapping Url: <span className="text-indigo-400">{brandLandingUrl}</span></p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Tab Selector Header */}
                    <div className="flex border-b border-slate-100 bg-slate-50/50">
                      <button
                        onClick={() => setSimulatorTab("checkout")}
                        className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all ${
                          simulatorTab === "checkout"
                            ? "border-emerald-600 text-emerald-700 bg-white font-bold"
                            : "border-transparent text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        🛒 ဝယ်ယူမှုစမ်းသပ်ရန် (Checkout)
                      </button>
                      <button
                        onClick={() => setSimulatorTab("sales")}
                        className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all ${
                          simulatorTab === "sales"
                            ? "border-emerald-600 text-emerald-700 bg-white font-bold"
                            : "border-transparent text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        📋 အရောင်းမှတ်တမ်း ({orders.length})
                      </button>
                    </div>

                    <div className="p-5 space-y-4">
                      {simulatorTab === "checkout" ? (
                        <div className="space-y-4 animate-fade-in">
                          <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                            ဝယ်သူအချက်အလက်ကို ဖြည့်သွင်းပြီး ငွေပေးချေမှုကို စမ်းသပ်နိုင်ပါသည်။
                          </p>

                          <div>
                            <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">Customer Full Name</label>
                            <input 
                              type="text"
                              value={checkoutName}
                              onChange={(e) => setCheckoutName(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                              placeholder="e.g. Min Hein"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">Customer Email Address</label>
                            <input 
                              type="email"
                              value={checkoutEmail}
                              onChange={(e) => setCheckoutEmail(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                              placeholder="e.g. buyer@example.com"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">Payment Method</label>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { id: "Credit_Card", label: "Credit Card" },
                                { id: "PayPal", label: "PayPal" },
                                { id: "KBZPay_Direct_API", label: "KBZPay API" },
                                { id: "WavePay_Direct_API", label: "WavePay API" }
                              ].map((method) => (
                                <button
                                  key={method.id}
                                  type="button"
                                  onClick={() => {
                                    setTempSelectedMethod(method.id as any);
                                    setIsPaymentPopupOpen(true);
                                  }}
                                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-center transition-all border ${
                                    checkoutPaymentMethod === method.id
                                      ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                                      : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                                  }`}
                                >
                                  {method.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Recap of payment details inside form to save space */}
                          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] space-y-1 text-slate-600">
                            <span className="font-bold text-[10px] uppercase text-slate-400 block mb-0.5">Payment details:</span>
                            {checkoutPaymentMethod === "Credit_Card" && (
                              <div className="flex justify-between font-mono text-[10px]">
                                <span>💳 Visa Card</span>
                                <span>•••• •••• •••• {cardNumber.replace(/\s+/g, '').slice(-4) || "4444"}</span>
                              </div>
                            )}
                            {checkoutPaymentMethod === "PayPal" && (
                              <div className="flex justify-between font-mono text-[10px]">
                                <span>✉️ PayPal ID</span>
                                <span className="truncate max-w-[150px]">{paypalEmail}</span>
                              </div>
                            )}
                            {checkoutPaymentMethod === "KBZPay_Direct_API" && (
                              <div className="flex justify-between font-mono text-[10px]">
                                <span>📱 KBZPay Mobile</span>
                                <span>{kbzPayPhone}</span>
                              </div>
                            )}
                            {checkoutPaymentMethod === "WavePay_Direct_API" && (
                              <div className="flex justify-between font-mono text-[10px]">
                                <span>📱 WavePay Mobile</span>
                                <span>{wavePayPhone}</span>
                              </div>
                            )}
                          </div>

                          {/* Active Hoplink Cookie Info Banner */}
                          <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-2 text-[11px] text-indigo-700">
                            <Info className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              ညွှန်းပို့သူ <strong>{clickLogs[0]?.affiliateId || "မရှိပါ"}</strong> ၏ ကော်မရှင် ကွတ်ကီး သိမ်းဆည်းထားပြီးဖြစ်ပါသည်။
                            </span>
                          </div>

                          <div className="relative">
                            <button
                              onClick={() => {
                                handleSimulatePurchase();
                                setSimulatorTab("sales"); // auto-switch tab to sales logs after purchase
                                if (showGuide && activeGuideTab === "customer" && guideStep === 1) {
                                  setGuideStep(2);
                                }
                              }}
                              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-2xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                            >
                              Authorize Payment
                            </button>
                            {showGuide && activeGuideTab === "customer" && guideStep === 1 && (
                              <div className="absolute right-0 bottom-full mb-2.5 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl p-4 shadow-2xl shadow-emerald-950/40 border border-emerald-500/40 w-72 text-xs animate-bounce-short text-left font-sans">
                                <div className="absolute -bottom-1.5 right-12 w-3 h-3 bg-slate-950 rotate-45 border-r border-b border-emerald-500/40" />
                                <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1 font-display">
                                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                  အဆင့် ၂: စမ်းသပ်ငွေချေခြင်း
                                </div>
                                <p className="text-slate-300 text-[11px] leading-relaxed">
                                  KBZPay, WavePay သို့မဟုတ် ကတ်အချက်အလက်များကို ဖြည့်သွင်းပြီးပါက ဤ 'Authorize Payment' ကို နှိပ်ပြီး ဝယ်ယူမှုကို အောင်မြင်အောင် ပြုလုပ်ပါ။
                                </p>
                                <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-800">
                                  <button
                                    onClick={() => setGuideStep(0)}
                                    className="text-[10px] text-slate-400 hover:text-white font-bold transition-colors"
                                    type="button"
                                  >
                                    ← နောက်သို့
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleSimulatePurchase();
                                      setSimulatorTab("sales");
                                      setGuideStep(2);
                                    }}
                                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-2 py-1 rounded text-[10px] font-bold shadow-md shadow-emerald-950/40 transition-all"
                                    type="button"
                                  >
                                    ဝယ်ယူပြီး ရှေ့သို့ →
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 animate-fade-in">
                          <div className="relative">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-400 uppercase">Gateway logs</span>
                              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                                {orders.length} orders
                              </span>
                            </div>
                            {showGuide && activeGuideTab === "customer" && guideStep === 2 && (
                              <div className="absolute right-0 top-full mt-2.5 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl p-4 shadow-2xl shadow-emerald-950/40 border border-emerald-500/40 w-72 text-xs animate-bounce-short text-left font-sans">
                                <div className="absolute -top-1.5 right-12 w-3 h-3 bg-slate-950 rotate-45 border-l border-t border-emerald-500/40" />
                                <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1 font-display">
                                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                  အဆင့် ၃: အရောင်းမှတ်တမ်း စစ်ဆေးခြင်း
                                </div>
                                <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                                  ဝယ်ယူမှုပြီးမြောက်သွားသည့်အတွက် ဤနေရာတွင် သင့်အရောင်းစနစ် ledger မှတ်တမ်းကို စနစ်က အလိုအလျောက် ရေးသွင်းထားသည်ကို လေ့လာပါ! ကော်မရှင်ခွဲဝေမှုများကို တွေ့မြင်နိုင်ပါပြီ။
                                </p>
                                <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-800 font-sans">
                                  <button
                                    onClick={() => {
                                      setSimulatorTab("checkout");
                                      setGuideStep(1);
                                    }}
                                    className="text-[10px] text-slate-400 hover:text-white font-bold transition-colors"
                                    type="button"
                                  >
                                    ← နောက်သို့
                                  </button>
                                  <button
                                    onClick={() => {
                                      setShowGuide(false);
                                    }}
                                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-2 py-1 rounded text-[10px] font-bold shadow-md shadow-emerald-950/40 transition-all"
                                    type="button"
                                  >
                                    ပြီးစီးပါပြီ ✓
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                            {orders.map((o) => (
                              <div key={o.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <span className="font-mono text-slate-400 text-[10px] block">{o.id}</span>
                                    <span className="font-bold text-slate-800 text-[13px] block">{o.productName}</span>
                                    <span className="text-[10px] text-slate-500 block">{o.customerName} ({o.customerEmail})</span>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="font-bold font-mono text-slate-800 text-[13px] block">{o.grossAmount.toLocaleString()} Ks</span>
                                    <span className={`px-2 py-0.5 text-[9px] font-mono rounded-full font-bold inline-block mt-1 ${
                                      o.status === "Completed" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                                    }`}>
                                      {o.status}
                                    </span>
                                  </div>
                                </div>

                                {o.status === "Completed" && (
                                  <div className="flex justify-between items-center pt-2 border-t border-slate-200/50">
                                    <div className="text-[10px] text-slate-500">
                                      Affiliate: <strong className="text-indigo-600">{o.affiliateId || "None"}</strong>
                                    </div>
                                    <button
                                      onClick={() => handleProcessRefund(o.id)}
                                      className="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 text-[10px] px-2.5 py-0.5 rounded-lg transition-all font-bold"
                                    >
                                      Refund
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}

                            {orders.length === 0 && (
                              <div className="text-center text-slate-400 py-8 font-sans">
                                အရောင်းမှတ်တမ်း မရှိသေးပါ။
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </section>border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                              placeholder="e.g. buyer@example.com"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">Payment Method</label>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { id: "Credit_Card", label: "Credit Card" },
                                { id: "PayPal", label: "PayPal" },
                                { id: "KBZPay_Direct_API", label: "KBZPay API" },
                                { id: "WavePay_Direct_API", label: "WavePay API" }
                              ].map((method) => (
                                <button
                                  key={method.id}
                                  type="button"
                                  onClick={() => {
                                    setTempSelectedMethod(method.id as any);
                                    setIsPaymentPopupOpen(true);
                                  }}
                                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-center transition-all border ${
                                    checkoutPaymentMethod === method.id
                                      ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                                      : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                                  }`}
                                >
                                  {method.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Recap of payment details inside form to save space */}
                          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] space-y-1 text-slate-600">
                            <span className="font-bold text-[10px] uppercase text-slate-400 block mb-0.5">Payment details:</span>
                            {checkoutPaymentMethod === "Credit_Card" && (
                              <div className="flex justify-between font-mono text-[10px]">
                                <span>💳 Visa Card</span>
                                <span>•••• •••• •••• {cardNumber.replace(/\s+/g, '').slice(-4) || "4444"}</span>
                              </div>
                            )}
                            {checkoutPaymentMethod === "PayPal" && (
                              <div className="flex justify-between font-mono text-[10px]">
                                <span>✉️ PayPal ID</span>
                                <span className="truncate max-w-[150px]">{paypalEmail}</span>
                              </div>
                            )}
                            {checkoutPaymentMethod === "KBZPay_Direct_API" && (
                              <div className="flex justify-between font-mono text-[10px]">
                                <span>📱 KBZPay Mobile</span>
                                <span>{kbzPayPhone}</span>
                              </div>
                            )}
                            {checkoutPaymentMethod === "WavePay_Direct_API" && (
                              <div className="flex justify-between font-mono text-[10px]">
                                <span>📱 WavePay Mobile</span>
                                <span>{wavePayPhone}</span>
                              </div>
                            )}
                          </div>

                          {/* Active Hoplink Cookie Info Banner */}
                          <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-2 text-[11px] text-indigo-700">
                            <Info className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              ညွှန်းပို့သူ <strong>{clickLogs[0]?.affiliateId || "မရှိပါ"}</strong> ၏ ကော်မရှင် ကွတ်ကီး သိမ်းဆည်းထားပြီးဖြစ်ပါသည်။
                            </span>
                          </div>

                          <div className="relative">
                            <button
                              onClick={() => {
                                handleSimulatePurchase();
                                setSimulatorTab("sales"); // auto-switch tab to sales logs after purchase
                                if (showGuide && activeGuideTab === "customer" && guideStep === 1) {
                                  setGuideStep(2);
                                }
                              }}
                              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-2xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                            >
                              Authorize Payment
                            </button>
                            {showGuide && activeGuideTab === "customer" && guideStep === 1 && (
                              <div className="absolute right-0 bottom-full mb-2.5 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl p-4 shadow-2xl shadow-emerald-950/40 border border-emerald-500/40 w-72 text-xs animate-bounce-short text-left font-sans">
                                <div className="absolute -bottom-1.5 right-12 w-3 h-3 bg-slate-950 rotate-45 border-r border-b border-emerald-500/40" />
                                <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1 font-display">
                                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                  အဆင့် ၂: စမ်းသပ်ငွေချေခြင်း
                                </div>
                                <p className="text-slate-300 text-[11px] leading-relaxed">
                                  KBZPay, WavePay သို့မဟုတ် ကတ်အချက်အလက်များကို ဖြည့်သွင်းပြီးပါက ဤ 'Authorize Payment' ကို နှိပ်ပြီး ဝယ်ယူမှုကို အောင်မြင်အောင် ပြုလုပ်ပါ။
                                </p>
                                <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-800">
                                  <button
                                    onClick={() => setGuideStep(0)}
                                    className="text-[10px] text-slate-400 hover:text-white font-bold transition-colors"
                                    type="button"
                                  >
                                    ← နောက်သို့
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleSimulatePurchase();
                                      setSimulatorTab("sales");
                                      setGuideStep(2);
                                    }}
                                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-2 py-1 rounded text-[10px] font-bold shadow-md shadow-emerald-950/40 transition-all"
                                    type="button"
                                  >
                                    ဝယ်ယူပြီး ရှေ့သို့ →
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 animate-fade-in">
                          <div className="relative">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-400 uppercase">Gateway logs</span>
                              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                                {orders.length} orders
                              </span>
                            </div>
                            {showGuide && activeGuideTab === "customer" && guideStep === 2 && (
                              <div className="absolute right-0 top-full mt-2.5 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl p-4 shadow-2xl shadow-emerald-950/40 border border-emerald-500/40 w-72 text-xs animate-bounce-short text-left font-sans">
                                <div className="absolute -top-1.5 right-12 w-3 h-3 bg-slate-950 rotate-45 border-l border-t border-emerald-500/40" />
                                <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1 font-display">
                                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                  အဆင့် ၃: အရောင်းမှတ်တမ်း စစ်ဆေးခြင်း
                                </div>
                                <p className="text-slate-300 text-[11px] leading-relaxed">
                                  ဝယ်ယူမှုပြီးမြောက်သွားသည့်အတွက် ဤနေရာတွင် သင့်အရောင်းစနစ် ledger မှတ်တမ်းကို စနစ်က အလိုအလျောက် ရေးသွင်းထားသည်ကို လေ့လာပါ! ကော်မရှင်ခွဲဝေမှုများကို တွေ့မြင်နိုင်ပါပြီ။
                                </p>
                                <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-800 font-sans">
                                  <button
                                    onClick={() => {
                                      setSimulatorTab("checkout");
                                      setGuideStep(1);
                                    }}
                                    className="text-[10px] text-slate-400 hover:text-white font-bold transition-colors"
                                    type="button"
                                  >
                                    ← နောက်သို့
                                  </button>
                                  <button
                                    onClick={() => {
                                      setShowGuide(false);
                                    }}
                                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-2 py-1 rounded text-[10px] font-bold shadow-md shadow-emerald-950/40 transition-all"
                                    type="button"
                                  >
                                    ပြီးစီးပါပြီ ✓
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                            {orders.map((o) => (
                              <div key={o.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <span className="font-mono text-slate-400 text-[10px] block">{o.id}</span>
                                    <span className="font-bold text-slate-800 text-[13px] block">{o.productName}</span>
                                    <span className="text-[10px] text-slate-500 block">{o.customerName} ({o.customerEmail})</span>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="font-bold font-mono text-slate-800 text-[13px] block">{o.grossAmount.toLocaleString()} Ks</span>
                                    <span className={`px-2 py-0.5 text-[9px] font-mono rounded-full font-bold inline-block mt-1 ${
                                      o.status === "Completed" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                                    }`}>
                                      {o.status}
                                    </span>
                                  </div>
                                </div>

                                {o.status === "Completed" && (
                                  <div className="flex justify-between items-center pt-2 border-t border-slate-200/50">
                                    <div className="text-[10px] text-slate-500">
                                      Affiliate: <strong className="text-indigo-600">{o.affiliateId || "None"}</strong>
                                    </div>
                                    <button
                                      onClick={() => handleProcessRefund(o.id)}
                                      className="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 text-[10px] px-2.5 py-0.5 rounded-lg transition-all font-bold"
                                    >
                                      Refund
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}

                            {orders.length === 0 && (
                              <div className="text-center text-slate-400 py-8 font-sans">
                                အရောင်းမှတ်တမ်း မရှိသေးပါ။
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </section>cus:border-emerald-500"
                            placeholder="e.g. Min Hein"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">Customer Email Address</label>
                          <input 
                            type="email"
                            value={checkoutEmail}
                            onChange={(e) => setCheckoutEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                            placeholder="e.g. buyer@example.com"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase text-slate-500 mb-1 font-mono font-bold">Payment Method</label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: "Credit_Card", label: "Credit Card" },
                              { id: "PayPal", label: "PayPal" },
                              { id: "KBZPay_Direct_API", label: "KBZPay API" },
                              { id: "WavePay_Direct_API", label: "WavePay API" }
                            ].map((method) => (
                              <button
                                key={method.id}
                                type="button"
                                onClick={() => {
                                  setTempSelectedMethod(method.id as any);
                                  setIsPaymentPopupOpen(true);
                                }}
                                className={`px-3 py-2 rounded-xl text-xs font-semibold text-center transition-all border ${
                                  checkoutPaymentMethod === method.id
                                    ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                                    : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                                }`}
                              >
                                {method.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Recap of payment details inside form to save space */}
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] space-y-1 text-slate-600">
                          <span className="font-bold text-[10px] uppercase text-slate-400 block mb-0.5">Payment details:</span>
                          {checkoutPaymentMethod === "Credit_Card" && (
                            <div className="flex justify-between font-mono text-[10px]">
                              <span>💳 Visa Card</span>
                              <span>•••• •••• •••• {cardNumber.replace(/\s+/g, '').slice(-4) || "4444"}</span>
                            </div>
                          )}
                          {checkoutPaymentMethod === "PayPal" && (
                            <div className="flex justify-between font-mono text-[10px]">
                              <span>✉️ PayPal ID</span>
                              <span className="truncate max-w-[150px]">{paypalEmail}</span>
                            </div>
                          )}
                          {checkoutPaymentMethod === "KBZPay_Direct_API" && (
                            <div className="flex justify-between font-mono text-[10px]">
                              <span>📱 KBZPay Mobile</span>
                              <span>{kbzPayPhone}</span>
                            </div>
                          )}
                          {checkoutPaymentMethod === "WavePay_Direct_API" && (
                            <div className="flex justify-between font-mono text-[10px]">
                              <span>📱 WavePay Mobile</span>
                              <span>{wavePayPhone}</span>
                            </div>
                          )}
                        </div>

                        {/* Active Hoplink Cookie Info Banner */}
                        <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-2 text-[11px] text-indigo-700">
                          <Info className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            ညွှန်းပို့သူ <strong>{clickLogs[0]?.affiliateId || "မရှိပါ"}</strong> ၏ ကော်မရှင် ကွတ်ကီး သိမ်းဆည်းထားပြီးဖြစ်ပါသည်။
                          </span>
                        </div>

                        <div className="relative">
                          <button
                            onClick={() => {
                              handleSimulatePurchase();
                              setSimulatorTab("sales"); // auto-switch tab to sales logs after purchase
                              if (showGuide && activeGuideTab === "customer" && guideStep === 1) {
                                setGuideStep(2);
                              }
                            }}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-2xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                          >
                            Authorize Payment
                          </button>
                          {showGuide && activeGuideTab === "customer" && guideStep === 1 && (
                            <div className="absolute right-0 bottom-full mb-2.5 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl p-4 shadow-2xl shadow-emerald-950/40 border border-emerald-500/40 w-72 text-xs animate-bounce-short text-left font-sans">
                              <div className="absolute -bottom-1.5 right-12 w-3 h-3 bg-slate-950 rotate-45 border-r border-b border-emerald-500/40" />
                              <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1 font-display">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                အဆင့် ၂: စမ်းသပ်ငွေချေခြင်း
                              </div>
                              <p className="text-slate-300 text-[11px] leading-relaxed">
                                KBZPay, WavePay သို့မဟုတ် ကတ်အချက်အလက်များကို ဖြည့်သွင်းပြီးပါက ဤ 'Authorize Payment' ကို နှိပ်ပြီး ဝယ်ယူမှုကို အောင်မြင်အောင် ပြုလုပ်ပါ။
                              </p>
                              <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-800">
                                <button
                                  onClick={() => setGuideStep(0)}
                                  className="text-[10px] text-slate-400 hover:text-white font-bold transition-colors"
                                  type="button"
                                >
                                  ← နောက်သို့
                                </button>
                                <button
                                  onClick={() => {
                                    handleSimulatePurchase();
                                    setSimulatorTab("sales");
                                    setGuideStep(2);
                                  }}
                                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-2 py-1 rounded text-[10px] font-bold shadow-md shadow-emerald-950/40 transition-all"
                                  type="button"
                                >
                                  ဝယ်ယူပြီး ရှေ့သို့ →
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 animate-fade-in">
                        <div className="relative">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400 uppercase">Gateway logs</span>
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                              {orders.length} orders
                            </span>
                          </div>
                          {showGuide && activeGuideTab === "customer" && guideStep === 2 && (
                            <div className="absolute right-0 top-full mt-2.5 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl p-4 shadow-2xl shadow-emerald-950/40 border border-emerald-500/40 w-72 text-xs animate-bounce-short text-left font-sans">
                              <div className="absolute -top-1.5 right-12 w-3 h-3 bg-slate-950 rotate-45 border-l border-t border-emerald-500/40" />
                              <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1 font-display">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                အဆင့် ၃: အရောင်းမှတ်တမ်း စစ်ဆေးခြင်း
                              </div>
                              <p className="text-slate-300 text-[11px] leading-relaxed">
                                ဝယ်ယူမှုပြီးမြောက်သွားသည့်အတွက် ဤနေရာတွင် သင့်အရောင်းစနစ် ledger မှတ်တမ်းကို စနစ်က အလိုအလျောက် ရေးသွင်းထားသည်ကို လေ့လာပါ! ကော်မရှင်ခွဲဝေမှုများကို တွေ့မြင်နိုင်ပါပြီ။
                              </p>
                              <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-800 font-sans">
                                <button
                                  onClick={() => {
                                    setSimulatorTab("checkout");
                                    setGuideStep(1);
                                  }}
                                  className="text-[10px] text-slate-400 hover:text-white font-bold transition-colors"
                                  type="button"
                                >
                                  ← နောက်သို့
                                </button>
                                <button
                                  onClick={() => {
                                    setShowGuide(false);
                                  }}
                                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-2 py-1 rounded text-[10px] font-bold shadow-md shadow-emerald-950/40 transition-all"
                                  type="button"
                                >
                                  ပြီးစီးပါပြီ ✓
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                          {orders.map((o) => (
                            <div key={o.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="font-mono text-slate-400 text-[10px] block">{o.id}</span>
                                  <span className="font-bold text-slate-800 text-[13px] block">{o.productName}</span>
                                  <span className="text-[10px] text-slate-500 block">{o.customerName} ({o.customerEmail})</span>
                                </div>
                                <div className="text-right shrink-0">
                                  <span className="font-bold font-mono text-slate-800 text-[13px] block">{o.grossAmount.toLocaleString()} Ks</span>
                                  <span className={`px-2 py-0.5 text-[9px] font-mono rounded-full font-bold inline-block mt-1 ${
                                    o.status === "Completed" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                                  }`}>
                                    {o.status}
                                  </span>
                                </div>
                              </div>

                              {o.status === "Completed" && (
                                <div className="flex justify-between items-center pt-2 border-t border-slate-200/50">
                                  <div className="text-[10px] text-slate-500">
                                    Affiliate: <strong className="text-indigo-600">{o.affiliateId || "None"}</strong>
                                  </div>
                                  <button
                                    onClick={() => handleProcessRefund(o.id)}
                                    className="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 text-[10px] px-2.5 py-0.5 rounded-lg transition-all font-bold"
                                  >
                                    Refund
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}

                          {orders.length === 0 && (
                            <div className="text-center text-slate-400 py-8 font-sans">
                              အရောင်းမှတ်တမ်း မရှိသေးပါ။
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

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
    </div>
  );
}
