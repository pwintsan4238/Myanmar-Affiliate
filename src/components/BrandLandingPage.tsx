import React, { useEffect, useState } from "react";
import { 
  MessageSquare, Phone, Mail, MapPin, Clock, Sparkles, 
  ChevronRight, Star, Image as ImageIcon, Globe, Laptop, 
  Send, MessageCircle, Instagram, CheckCircle, AlertCircle, Loader, ArrowRight
} from "lucide-react";

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

interface BrandLandingPageProps {
  brandSlug: string;
  onBackToPlatform?: () => void;
}

export function BrandLandingPage({ brandSlug, onBackToPlatform }: BrandLandingPageProps) {
  const [brand, setBrand] = useState<BrandConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trackingDone, setTrackingDone] = useState(false);
  const [pixelLogs, setPixelLogs] = useState<string[]>([]);
  const [gaLogs, setGaLogs] = useState<string[]>([]);
  const [clickStatus, setClickStatus] = useState<string | null>(null);

  // Sponsor state managers
  const [adCampaigns, setAdCampaigns] = useState<any[]>([]);
  const [activeInterstitialAd, setActiveInterstitialAd] = useState<any | null>(null);
  const [interstitialSecondsRemaining, setInterstitialSecondsRemaining] = useState<number>(15);
  const [targetChannel, setTargetChannel] = useState<any | null>(null);
  const [interstitialOpen, setInterstitialOpen] = useState<boolean>(false);

  // Load campaigns from localStorage and record automatic banner impressions
  useEffect(() => {
    const saved = localStorage.getItem("akyoe_ad_campaigns");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAdCampaigns(parsed);
        
        // Log impressions for visible placements (VIP Header / Sidebar Row)
        const updated = parsed.map((ad: any) => {
          if (ad.placementArea === "VIP Header" || ad.placementArea === "Sidebar Row") {
            return { ...ad, impressionsCount: (ad.impressionsCount || 0) + 1 };
          }
          return ad;
        });
        localStorage.setItem("akyoe_ad_campaigns", JSON.stringify(updated));
      } catch (e) {
        console.error("Error setting ad impressions:", e);
      }
    }
  }, []);

  // Interstitial Countdown Timer Effect
  useEffect(() => {
    if (!interstitialOpen || !activeInterstitialAd) return;
    const interval = setInterval(() => {
      setInterstitialSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [interstitialOpen, activeInterstitialAd]);

  // Click handler for Sponsor banners
  const handleAdClick = (adId: string) => {
    setAdCampaigns(prev => {
      const next = prev.map(ad => {
        if (ad.id === adId) {
          return { ...ad, clicksCount: (ad.clicksCount || 0) + 1 };
        }
        return ad;
      });
      localStorage.setItem("akyoe_ad_campaigns", JSON.stringify(next));
      return next;
    });
    alert("Sponsor Advertisement Clicked! Your interaction has been logged successfully.");
  };

  // Parse UTM, Device, Browser information for tracking
  const getUTMParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
      utm_content: params.get("utm_content"),
      utm_term: params.get("utm_term"),
    };
  };

  const getVisitorInfo = () => {
    let visitorId = localStorage.getItem("akyoe_saas_visitor_id");
    if (!visitorId) {
      visitorId = "VIS-SaaS-" + Math.floor(100000 + Math.random() * 900000);
      localStorage.setItem("akyoe_saas_visitor_id", visitorId);
    }

    let sessionId = sessionStorage.getItem("akyoe_saas_session_id");
    if (!sessionId) {
      sessionId = "SES-SaaS-" + Math.floor(100000 + Math.random() * 900000);
      sessionStorage.setItem("akyoe_saas_session_id", sessionId);
    }

    const userAgent = navigator.userAgent;
    let browser = "Other";
    if (userAgent.indexOf("Chrome") > -1) browser = "Chrome";
    else if (userAgent.indexOf("Safari") > -1) browser = "Safari";
    else if (userAgent.indexOf("Firefox") > -1) browser = "Firefox";
    else if (userAgent.indexOf("Edge") > -1) browser = "Edge";

    let os = "Other";
    if (userAgent.indexOf("Windows") > -1) os = "Windows";
    else if (userAgent.indexOf("Macintosh") > -1) os = "macOS";
    else if (userAgent.indexOf("iPhone") > -1 || userAgent.indexOf("iPad") > -1) os = "iOS";
    else if (userAgent.indexOf("Android") > -1) os = "Android";

    let device: "Desktop" | "Mobile" | "Tablet" = "Desktop";
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      device = "Mobile";
      if (/iPad|Tablet/i.test(userAgent)) device = "Tablet";
    }

    return { visitorId, sessionId, browser, os, device, language: navigator.language || "my-MM" };
  };

  // Fetch brand configuration from database
  useEffect(() => {
    const fetchBrand = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/chat/config/${brandSlug}`);
        if (!res.ok) {
          throw new Error("Brand profile not found");
        }
        const data = await res.json();
        setBrand(data);
        setError(null);
      } catch (err: any) {
        console.error("Error loading brand configuration:", err);
        setError(err.message || "Something went wrong loading this brand profile.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrand();
  }, [brandSlug]);

  // Handle visit tracking
  useEffect(() => {
    if (!brand || trackingDone) return;

    const trackVisit = async () => {
      const visitor = getVisitorInfo();
      const utms = getUTMParams();

      const trackingPayload = {
        brandId: brand.id,
        visitorId: visitor.visitorId,
        sessionId: visitor.sessionId,
        device: visitor.device,
        browser: visitor.browser,
        os: visitor.os,
        language: visitor.language,
        country: "Myanmar", // Default to Myanmar for PPC simulation
        referrer: document.referrer || "Direct Traffic",
        ...utms,
        timestamp: new Date().toISOString()
      };

      try {
        const res = await fetch("/api/chat/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(trackingPayload)
        });
        if (res.ok) {
          setTrackingDone(true);
          console.log(`[Akyoe SaaS Tracking] Visit recorded successfully for brand ${brand.name}`);
        }
      } catch (err) {
        console.error("[Akyoe SaaS Tracking] Visit tracing failed:", err);
      }

      // Fire Meta Pixel and GA4 Events simulation if enabled
      if (brand.enablePixel && brand.pixelId) {
        const timestamp = new Date().toLocaleTimeString();
        setPixelLogs(prev => [
          ...prev, 
          `[${timestamp}] 📷 Meta Pixel ID (${brand.pixelId}) initialized!`,
          `[${timestamp}] 🚀 Fired: fbq('track', 'PageView')`
        ]);
      }

      if (brand.googleAnalyticsId) {
        const timestamp = new Date().toLocaleTimeString();
        setGaLogs(prev => [
          ...prev, 
          `[${timestamp}] 📈 GA4 ID (${brand.googleAnalyticsId}) connected!`,
          `[${timestamp}] 🚀 Sent: gtag('event', 'page_view', { brand: '${brand.slug}' })`
        ]);
      }
    };

    trackVisit();
  }, [brand, trackingDone]);

  // Handle CTA Click tracking
  const handleCtaClick = async (channel: BrandChannel) => {
    if (!brand) return;

    const visitor = getVisitorInfo();
    const clickPayload = {
      brandId: brand.id,
      visitorId: visitor.visitorId,
      sessionId: visitor.sessionId,
      channelType: channel.type,
      destinationUrl: channel.destination_url,
      timestamp: new Date().toISOString()
    };

    setClickStatus(`Recording redirect to ${channel.type}...`);

    try {
      await fetch("/api/chat/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clickPayload)
      });
    } catch (err) {
      console.error("[Akyoe SaaS Tracking] Click recording failed:", err);
    }

    // Fire simulated Pixel click/lead events
    if (brand.enablePixel && brand.pixelId) {
      const timestamp = new Date().toLocaleTimeString();
      setPixelLogs(prev => [
        ...prev, 
        `[${timestamp}] 🎯 Fired Pixel event: fbq('track', 'Lead', { content_name: 'Chat on Messenger' })`
      ]);
    }

    if (brand.googleAnalyticsId) {
      const timestamp = new Date().toLocaleTimeString();
      setGaLogs(prev => [
        ...prev, 
        `[${timestamp}] 🎯 Sent Analytics event: gtag('event', 'generate_lead', { channel: '${channel.type}' })`
      ]);
    }

    // Check if we have an active Redirection Interstitial Ad!
    const ads = adCampaigns.filter(ad => ad.placementArea === "Redirection Interstitial" && ad.status === "Active");
    if (ads.length > 0) {
      // Choose the highest paid campaign (highest budget/bid)
      const highestAd = [...ads].sort((a, b) => (b.budgetMMK || 0) - (a.budgetMMK || 0))[0];
      
      // Update interstitial impression
      setAdCampaigns(prev => {
        const next = prev.map(a => {
          if (a.id === highestAd.id) {
            return { ...a, impressionsCount: (a.impressionsCount || 0) + 1 };
          }
          return a;
        });
        localStorage.setItem("akyoe_ad_campaigns", JSON.stringify(next));
        return next;
      });

      // Show the interstitial overlay
      setActiveInterstitialAd(highestAd);
      setInterstitialSecondsRemaining(highestAd.adLengthSec || 15);
      setTargetChannel(channel);
      setInterstitialOpen(true);
      setClickStatus(null);
      return;
    }

    setClickStatus(`Redirecting in 1 second...`);
    
    // Smooth delay for user feedback and pixel tracing view before redirection
    setTimeout(() => {
      setClickStatus(null);
      window.open(channel.destination_url, "_blank", "noopener,noreferrer");
    }, 1200);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center space-y-4 max-w-md text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin" />
          <h2 className="text-xl font-semibold text-slate-800">မိတ်ဆက်စာမျက်နှာကို ဖွင့်နေပါသည်...</h2>
          <p className="text-sm text-slate-500">Akyoe Messenger SaaS Platform is loading the brand configurations and setting up analytics tracing engines.</p>
        </div>
      </div>
    );
  }

  if (error || !brand) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">မိတ်ဆက်စာမျက်နှာ မတွေ့ရှိပါ</h2>
            <p className="text-sm text-slate-500">The requested brand slug <code className="bg-slate-100 px-1.5 py-0.5 rounded text-red-600 font-mono">/chat/{brandSlug}</code> could not be matched with any connected Facebook Page.</p>
          </div>
          <div className="pt-2">
            {onBackToPlatform ? (
              <button 
                onClick={onBackToPlatform}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center space-x-2"
              >
                <span>Back to Akyoe Dashboard</span>
              </button>
            ) : (
              <a 
                href="/"
                className="w-full inline-flex bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition duration-200 items-center justify-center space-x-2"
              >
                <span>Go to Home Page</span>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Active channels
  const activeChannels = brand.channels?.filter(c => c.enabled) || [
    { type: "messenger", destination_url: brand.facebookPageUrl || `https://m.me/${brand.facebookPageId}`, button_text: brand.messengerButtonText || "Chat on Messenger", icon: "MessageSquare", enabled: true }
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#050505] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Floating Demo Bar */}
      <div className="bg-white/90 backdrop-blur border-b border-slate-200/80 py-3 px-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-700">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1877F2]"></span>
            </span>
            <span className="font-bold text-[#1877F2]">Akyoe SaaS Sandbox Live Preview</span>
            <span className="text-slate-400">| Brand:</span>
            <span className="font-mono bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-700">/{brand.slug}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            {onBackToPlatform && (
              <button 
                onClick={onBackToPlatform}
                className="bg-slate-100 hover:bg-slate-200 active:bg-slate-100 text-slate-700 font-bold py-1.5 px-3 rounded-lg border border-slate-200 transition duration-150 flex items-center space-x-1"
              >
                <Laptop className="w-3.5 h-3.5 text-slate-500" />
                <span>Exit Preview</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sponsor VIP Header Ad Banner */}
      {(() => {
        const vipAds = adCampaigns.filter(ad => ad.placementArea === "VIP Header" && ad.status === "Active");
        if (vipAds.length === 0) return null;
        const highestVipAd = [...vipAds].sort((a, b) => (b.budgetMMK || 0) - (a.budgetMMK || 0))[0];
        return (
          <div 
            onClick={() => handleAdClick(highestVipAd.id)}
            className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 pt-4 cursor-pointer"
          >
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-3.5 rounded-2xl text-white text-xs font-semibold flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md hover:brightness-105 transition-all duration-200 relative overflow-hidden group border border-indigo-400/30 animate-in fade-in slide-in-from-top-4">
              <div className="absolute top-0 right-0 p-1 bg-indigo-700 text-[8px] tracking-widest font-extrabold uppercase rotate-12 translate-x-3 -translate-y-1">SPONSOR</div>
              <div className="flex items-center space-x-3">
                <span className="flex h-2.5 w-2.5 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-400"></span>
                </span>
                <span className="font-extrabold bg-white/20 px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider shrink-0">VIP SPONSOR</span>
                <span className="font-bold text-white line-clamp-1">{highestVipAd.advertiserName} • {highestVipAd.category}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-yellow-300 group-hover:translate-x-0.5 transition-transform">
                <span>View Sponsor Offer</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        );
      })()}

      <div className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-4 md:p-6 space-y-6">
        
        {/* LANDING PAGE PREVIEW GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Landing Page Render (8 cols on lg) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm relative">
            
            {/* Brand Cover Image */}
            <div className="h-40 sm:h-48 md:h-56 relative bg-slate-200 overflow-hidden">
              <img 
                src={brand.coverImage} 
                alt={`${brand.name} Cover`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent"></div>
            </div>

            {/* Brand Header Section */}
            <div className="px-4 sm:px-6 pb-4 relative -mt-10 sm:-mt-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border-4 border-white overflow-hidden shadow-md z-10 shrink-0">
                  <img 
                    src={brand.logo} 
                    alt={`${brand.name} Logo`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-1">
                  <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 flex items-center flex-wrap gap-1.5">
                    {brand.name}
                    <CheckCircle className="w-5 h-5 text-[#1877F2] fill-[#1877F2] text-white shrink-0" />
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    Verified Messenger Merchant • @{brand.slug}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-6 py-5 space-y-6">
              
              {/* Promotion Banner */}
              {brand.promotionBanner && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-slate-800 text-xs sm:text-sm font-medium flex items-center space-x-3 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-1 bg-[#1877F2] text-white text-[8px] tracking-widest font-bold uppercase rotate-12 translate-x-4 -translate-y-1">PROMO</div>
                  <Sparkles className="w-5 h-5 text-[#1877F2] shrink-0 animate-pulse" />
                  <span className="pr-6 font-semibold text-slate-800 leading-relaxed">{brand.promotionBanner}</span>
                </div>
              )}

              {/* Description */}
              <div className="space-y-1.5">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">About Our Business</h3>
                <p className="text-slate-700 text-sm leading-relaxed">{brand.description}</p>
              </div>

              {/* Products Section */}
              {brand.products && brand.products.length > 0 && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">Product Catalog</h3>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono font-bold">{brand.products.length} Items</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {brand.products.map((p) => (
                      <div key={p.id} className="bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between hover:border-blue-200/80 transition duration-150">
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{p.description}</p>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-200/60">
                          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Price</span>
                          <span className="text-sm font-extrabold text-[#1877F2] font-mono">{p.priceMMK.toLocaleString()} MMK</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Testimonials */}
              {brand.testimonials && brand.testimonials.length > 0 && (
                <div className="space-y-3 pt-1">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono border-b border-slate-100 pb-1.5">Customer Feedback</h3>
                  <div className="space-y-3">
                    {brand.testimonials.map((t) => (
                      <div key={t.id} className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 space-y-3">
                        <p className="text-xs text-slate-600 italic leading-relaxed">"{t.content}"</p>
                        <div className="flex items-center space-x-2">
                          {t.avatarUrl ? (
                            <img src={t.avatarUrl} alt={t.name} className="w-6 h-6 rounded-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-[#1877F2]/10 flex items-center justify-center font-bold text-[#1877F2] text-[10px]">{t.name[0]}</div>
                          )}
                          <div>
                            <h5 className="text-xs font-bold text-slate-800">{t.name}</h5>
                            <p className="text-[9px] text-slate-400">{t.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {brand.gallery && brand.gallery.length > 0 && (
                <div className="space-y-3 pt-1">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono border-b border-slate-100 pb-1.5">Shop Gallery</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {brand.gallery.map((img, idx) => (
                      <div key={idx} className="h-28 sm:h-32 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative group">
                        <img src={img} alt="Gallery" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact & Hours */}
              <div className="border-t border-slate-200/80 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Working Hours</h4>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-700">{brand.businessHours || "Daily: 9:00 AM - 6:00 PM"}</span>
                  </p>
                  {brand.address && (
                    <p className="flex items-start gap-2 leading-relaxed text-slate-500 pt-0.5">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{brand.address}</span>
                    </p>
                  )}
                </div>
                <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Quick Contact</h4>
                  {brand.phone && (
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-mono font-semibold text-slate-700">{brand.phone}</span>
                    </p>
                  )}
                  {brand.email && (
                    <p className="flex items-center gap-2 text-slate-500">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-mono text-slate-600 truncate">{brand.email}</span>
                    </p>
                  )}
                </div>
              </div>

            </div>

            {/* Fixed Bottom Redirection CTA Bar */}
            <div className="border-t border-slate-200 bg-white p-4 sticky bottom-0 z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
              <div className="space-y-2">
                {clickStatus && (
                  <div className="text-xs text-center text-[#1877F2] flex items-center justify-center space-x-1.5 py-1">
                    <Loader className="w-3.5 h-3.5 animate-spin" />
                    <span className="font-semibold">{clickStatus}</span>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  {activeChannels.map((chan, idx) => {
                    const isMessenger = chan.type === "messenger";
                    // If it is Messenger, default to Facebook's signature blue color (#1877F2) if not customized
                    const btnColor = isMessenger ? (brand.themeColor || brand.messengerButtonColor || "#1877F2") : "#10B981";
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => handleCtaClick(chan)}
                        disabled={!!clickStatus}
                        style={{ backgroundColor: btnColor }}
                        className="w-full text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-sm transition duration-150 transform active:scale-[0.99] hover:brightness-105 disabled:opacity-50"
                      >
                        {isMessenger ? <MessageSquare className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                        <span className="tracking-wide text-sm">{chan.button_text}</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* Sandbox Tracing Panel (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Sponsor Sidebar Row Ad Banner */}
            {(() => {
              const sidebarAds = adCampaigns.filter(ad => ad.placementArea === "Sidebar Row" && ad.status === "Active");
              if (sidebarAds.length === 0) return null;
              const highestSidebarAd = [...sidebarAds].sort((a, b) => (b.budgetMMK || 0) - (a.budgetMMK || 0))[0];
              return (
                <div 
                  onClick={() => handleAdClick(highestSidebarAd.id)}
                  className="bg-white rounded-2xl border-2 border-indigo-200/80 p-5 space-y-4 shadow-sm hover:border-indigo-400 cursor-pointer transition-all duration-200 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-indigo-600 text-white text-[8px] tracking-widest font-extrabold uppercase rounded-bl">SPONSOR AD</div>
                  <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
                    <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" style={{ animationDuration: '4s' }} />
                    <span className="text-xs font-mono font-extrabold text-indigo-700 tracking-wider uppercase">Sponsor Highlight</span>
                  </div>
                  
                  {highestSidebarAd.mediaUrl && (
                    <div className="w-full h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                      {highestSidebarAd.adType === "video" ? (
                        <video 
                          src={highestSidebarAd.mediaUrl} 
                          className="w-full h-full object-cover"
                          autoPlay 
                          muted 
                          loop 
                          playsInline
                        />
                      ) : (
                        <img 
                          src={highestSidebarAd.mediaUrl} 
                          alt="Sponsor Media" 
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-350"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{highestSidebarAd.advertiserName}</h4>
                    <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">Premium Partner: "{highestSidebarAd.category}" - offering special promotions today.</p>
                  </div>
                  
                  <div className="pt-1.5 text-center">
                    <span className="inline-block w-full py-1.5 px-3 bg-indigo-50 group-hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold font-mono transition-all">
                      🔥 INTERACTIVE AD CONTENT
                    </span>
                  </div>
                </div>
              );
            })()}
            
            {/* Meta Ads Sandbox Console */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>Meta Ads Simulator</span>
                </h3>
                <span className="text-[9px] bg-blue-50 text-[#1877F2] font-mono px-2 py-0.5 rounded-full font-bold">CPC SANDBOX</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Clicking links below simulates a cold lead visiting this landing page from paid social channels with UTM tracking params attached.
              </p>
              
              <div className="space-y-2.5 pt-1">
                <a 
                  href={`/chat/${brand.slug}?utm_source=facebook&utm_medium=cpc&utm_campaign=summer_sale&utm_content=ad_creative_v1`}
                  className="block p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Facebook Feed Ad Click</span>
                    <span className="font-mono text-[9px] text-slate-400 font-bold">UTM</span>
                  </div>
                  <div className="font-mono text-[10px] text-slate-600 break-all leading-normal font-medium">
                    ?utm_source=facebook&utm_medium=cpc&utm_campaign=summer_sale
                  </div>
                </a>

                <a 
                  href={`/chat/${brand.slug}?utm_source=tiktok&utm_medium=bio_link&utm_campaign=yangon_beauty_expo`}
                  className="block p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">TikTok Bio Link Visit</span>
                    <span className="font-mono text-[9px] text-slate-400 font-bold">UTM</span>
                  </div>
                  <div className="font-mono text-[10px] text-slate-600 break-all leading-normal font-medium">
                    ?utm_source=tiktok&utm_medium=bio_link&utm_campaign=yangon_beauty_expo
                  </div>
                </a>

                <a 
                  href={`/chat/${brand.slug}?utm_source=google&utm_medium=organic_search&utm_campaign=skincare_deals`}
                  className="block p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Google Organic Search</span>
                    <span className="font-mono text-[9px] text-slate-400 font-bold">UTM</span>
                  </div>
                  <div className="font-mono text-[10px] text-slate-600 break-all leading-normal font-medium">
                    ?utm_source=google&utm_medium=organic_search&utm_campaign=skincare_deals
                  </div>
                </a>
              </div>
            </div>

            {/* Meta Pixel & GA4 Event Feed */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Laptop className="w-4 h-4 text-emerald-600" />
                  <span>Real-Time Tracing Logs</span>
                </h3>
                <span className="text-[9px] bg-emerald-50 text-emerald-600 font-mono px-2 py-0.5 rounded-full font-bold">MONITOR</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Simulated real-time pixel firing events triggered by this session. Complete analytics are automatically passed to your dashboard.
              </p>

              {/* Meta Pixel Terminal */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-bold text-slate-700 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></span>
                  <span>Meta Pixel Tracing Console</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono text-[10px] text-slate-600 space-y-1.5 min-h-[70px] max-h-[140px] overflow-y-auto leading-normal">
                  {brand.enablePixel ? (
                    pixelLogs.length > 0 ? (
                      pixelLogs.map((log, index) => <div key={index} className="text-pink-600 font-medium">{log}</div>)
                    ) : (
                      <div className="text-slate-400 italic">Waiting for visitor interaction...</div>
                    )
                  ) : (
                    <div className="text-slate-400 italic">Meta Pixel is currently disabled in brand settings.</div>
                  )}
                </div>
              </div>

              {/* GA4 Terminal */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-700 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                  <span>Google Analytics 4 Console</span>
                </div>
                <div className="bg-[#F8F9FA] border border-slate-200 rounded-xl p-3 font-mono text-[10px] text-slate-600 space-y-1.5 min-h-[70px] max-h-[140px] overflow-y-auto leading-normal">
                  {brand.googleAnalyticsId ? (
                    gaLogs.length > 0 ? (
                      gaLogs.map((log, index) => <div key={index} className="text-blue-600 font-medium">{log}</div>)
                    ) : (
                      <div className="text-slate-400 italic">Waiting for visitor interaction...</div>
                    )
                  ) : (
                    <div className="text-slate-400 italic">Google Analytics is disabled or not configured.</div>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Branded Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 mt-12 text-center text-xs text-slate-500 space-y-1.5 shadow-inner">
        <p className="font-bold text-slate-700">⚡ Powered by Akyoe Messenger-First Multi-Brand SaaS Platform</p>
        <p className="text-slate-400 max-w-md mx-auto">Providing seamless customer-to-merchant Messenger redirects with absolute analytics tracking.</p>
      </footer>

      {/* --- Sponsor Advertisement Redirection Interstitial Modal --- */}
      {interstitialOpen && activeInterstitialAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md transition-all duration-300">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col relative animate-in fade-in-50 zoom-in-95 duration-200">
            
            {/* Top Indicator */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">Sponsor Advertisement</span>
              </div>
              <div className="bg-white/20 font-mono text-xs px-2.5 py-1 rounded-full font-extrabold text-white flex items-center gap-1">
                <span>စက္ကန့်:</span>
                <span className="text-yellow-300 text-sm">{interstitialSecondsRemaining}</span>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="p-6 space-y-5 flex-1 overflow-y-auto">
              {/* Placement Title */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                    {activeInterstitialAd.advertiserName}
                  </h3>
                  <p className="text-[11px] text-indigo-600 font-bold uppercase tracking-wider mt-0.5">
                    {activeInterstitialAd.category} • Partner Sponsor
                  </p>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 font-mono text-[10px] font-bold px-2 py-0.5 rounded-lg">
                  Placement Area: Interstitial
                </div>
              </div>

              {/* Advertisement Media (Image, GIF, Video) */}
              {activeInterstitialAd.mediaUrl && (
                <div className="w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner relative max-h-[280px]">
                  {activeInterstitialAd.adType === "video" ? (
                    <video 
                      src={activeInterstitialAd.mediaUrl} 
                      className="w-full max-h-[280px] object-cover mx-auto"
                      autoPlay 
                      controls 
                      muted 
                      loop
                      playsInline
                    />
                  ) : (
                    <img 
                      src={activeInterstitialAd.mediaUrl} 
                      alt="Sponsor Content" 
                      className="w-full max-h-[280px] object-cover mx-auto"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              )}

              {/* Myanmar / English explanations of tracking and sponsors */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs text-slate-600 space-y-1.5 font-sans leading-relaxed">
                <p className="font-bold text-slate-800">💡 စပွန်ဆာကြော်ငြာများကို အားပေးခြင်း:</p>
                <p>
                  ဤကြော်ငြာသည် စပွန်ဆာမှ ပံ့ပိုးပေးထားသော ကြော်ငြာဖြစ်ပါသည်။ စပွန်ဆာပေးထားသော ကြော်ငြာပြီးဆုံးပါက သင်သွားလိုသည့် လင့်ခ်/Messenger သို့ အလိုအလျောက် ပို့ဆောင်ပေးမည် ဖြစ်ပါသည်။ ကြော်ငြာရှင်၏ ဝန်ဆောင်မှုကို စိတ်ဝင်စားပါက အောက်ပါခလုတ်ကို နှိပ်၍ သွားရောက်ကြည့်ရှုနိုင်ပါသည်။
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-slate-100 p-5 bg-slate-50 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => handleAdClick(activeInterstitialAd.id)}
                className="w-full sm:w-auto flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all duration-150"
              >
                <Globe className="w-4 h-4" />
                <span>Visit Sponsor Website</span>
              </button>

              <button
                disabled={interstitialSecondsRemaining > 0}
                onClick={() => {
                  setInterstitialOpen(false);
                  if (targetChannel) {
                    window.open(targetChannel.destination_url, "_blank", "noopener,noreferrer");
                  }
                }}
                className={`w-full sm:w-auto flex-1 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all duration-150 ${
                  interstitialSecondsRemaining > 0
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 pulse-btn animate-bounce"
                }`}
              >
                {interstitialSecondsRemaining > 0 ? (
                  <span>Skip Ad in {interstitialSecondsRemaining}s...</span>
                ) : (
                  <>
                    <span>Skip Ad & Proceed</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
