import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, FileText, Edit, Settings, User, Shield, Clock, CheckCircle, AlertCircle, Download, Eye, Home, Users, Heart, Gavel } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { getUserDisplayName } from '../lib/utils';
import { getUserForms } from '../lib/supabaseForms';
import AuthForm from '../components/AuthForm';

// Auth Modal Portal Component
function AuthModalPortal({ show, onClose, children }) {
  if (!show) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}

const MyWill = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [will, setWill] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (!user) navigate('/landing');
    });
  }, [navigate]);

  useEffect(() => {
    if (user) {
      getUserForms()
        .then(forms => {
          const willData = forms && forms.length > 0 ? forms[0].form_data : null;
          setWill(willData);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error loading will:', err);
          setError('There was an error loading your will. Please try again later.');
          setIsLoading(false);
        });
    }
  }, [user]);

  // Add effect to refresh user data when returning from account page
  useEffect(() => {
    const refreshUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    };

    // Listen for focus events to refresh user data when returning to the page
    const handleFocus = () => {
      refreshUserData();
    };

    window.addEventListener('focus', handleFocus);
    
    // Also refresh when the location changes (e.g., navigating from account page)
    refreshUserData();

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [location?.pathname]); // Refresh when route changes

  // Helper functions to build clearer, more distinguishable asset labels for each asset type
  const formatPropertyLabel = (details = {}) => {
    const parts = [];
    if (details.address) parts.push(details.address);
    const cityState = [details.city, details.state].filter(Boolean).join(', ');
    if (cityState) parts.push(cityState);
    if (details.zipCode) parts.push(details.zipCode);

    // Fallback: show first two provided details if we couldn't build a meaningful label
    if (parts.length === 0) {
      return Object.entries(details)
        .slice(0, 2)
        .map(([key, value]) => `${key}: ${value}`)
        .join(' • ');
    }
    return parts.join(', ');
  };

  const getAssetDisplayLabel = (asset = {}) => {
    const { type, details = {} } = asset;
    
    switch (type) {
      case 'Property':
        return formatPropertyLabel(details);
      
      case 'Investment':
        const investmentType = details.investmentType === 'Other' ? details.otherInvestmentType : details.investmentType;
        const accountNumber = details.accountNumber;
        return [investmentType, accountNumber].filter(Boolean).join(' • ');
      
      case 'Bank':
        return [details.bankName, details.accountNumber].filter(Boolean).join(' • ');
      
      case 'Jewellery':
        return ['Jewellery', details.description].filter(Boolean).join(' • ');
      
      case 'Vehicles':
        return ['Vehicle', details.description].filter(Boolean).join(' • ');
      
      case 'Loans':
        return ['Loans', details.description].filter(Boolean).join(' • ');
      
      case 'Income':
        return ['Income', details.description].filter(Boolean).join(' • ');
      
      case 'Other':
        return ['Other', details.description].filter(Boolean).join(' • ');
      
      default:
        // Fallback for any other types
        return Object.entries(details)
          .slice(0, 2)
          .map(([key, value]) => `${key}: ${value}`)
          .join(' • ');
    }
  };

  const getAssetAllocationDisplayLabel = (type, details = {}) => {
    switch (type) {
      case 'Property':
        return formatPropertyLabel(details);
      
      case 'Investment':
        const investmentType = details.investmentType === 'Other' ? details.otherInvestmentType : details.investmentType;
        const accountNumber = details.accountNumber;
        return [investmentType, accountNumber].filter(Boolean).join(' • ');
      
      case 'Bank':
        return [details.bankName, details.accountNumber].filter(Boolean).join(' • ');
      
      case 'Jewellery':
        return ['Jewellery', details.description].filter(Boolean).join(' • ');
      
      case 'Vehicles':
        return ['Vehicle', details.description].filter(Boolean).join(' • ');
      
      case 'Loans':
        return ['Loans', details.description].filter(Boolean).join(' • ');
      
      case 'Income':
        return ['Income', details.description].filter(Boolean).join(' • ');
      
      case 'Other':
        return ['Other', details.description].filter(Boolean).join(' • ');
      
      default:
        // Fallback for any other types
        return Object.entries(details)
          .slice(0, 2)
          .map(([key, value]) => `${key}: ${value}`)
          .join(' • ');
    }
  };

  const openAuthModal = () => {
    setShowAuth(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGetStarted = () => {
    if (user) navigate('/personal-details');
    else openAuthModal();
  };

  if (!user) return null;
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <div className="text-red-600 text-lg font-semibold mb-4">{error}</div>
          <button
            onClick={() => navigate('/account')}
            className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
          >
            Go to Account Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Auth Modal (Portal) */}
      <AuthModalPortal show={showAuth} onClose={() => setShowAuth(false)}>
        <AuthForm />
      </AuthModalPortal>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-2xl border-b border-white/20' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/landing')}>
              Banyyan Legacies
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => navigate('/how-it-works')} className="relative text-gray-700 hover:text-purple-600 transition-colors group">
                How It Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-orange-500 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button onClick={() => navigate('/testimonials')} className="relative text-gray-700 hover:text-purple-600 transition-colors group">
                Testimonials
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-orange-500 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button onClick={() => navigate('/pricing')} className="relative text-gray-700 hover:text-purple-600 transition-colors group">
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-orange-500 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button onClick={() => navigate('/faq')} className="relative text-gray-700 hover:text-purple-600 transition-colors group">
                FAQ
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-orange-500 group-hover:w-full transition-all duration-300"></span>
              </button>
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700">{getUserDisplayName(user)}</span>
                  <button 
                    onClick={() => navigate('/my-will')} 
                    className="text-sm font-medium text-purple-600 px-4 py-2 rounded-full border border-purple-600 hover:bg-purple-600 hover:text-white transition-all hover:scale-105"
                  >
                    My Will
                  </button>
                  <button 
                    onClick={async () => { await supabase.auth.signOut(); }} 
                    className="text-sm font-medium text-gray-500 px-3 py-2 rounded-full hover:text-gray-700 transition-colors"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowAuth(true)}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Log In / Sign Up
                </button>
              )}
            </div>

            <button 
              className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200 animate-slide-down">
              <div className="flex flex-col space-y-4 pt-4">
                <button onClick={() => navigate('/how-it-works')} className="text-left text-gray-700 hover:text-purple-600 transition-colors">
                  How It Works
                </button>
                <button onClick={() => navigate('/testimonials')} className="text-left text-gray-700 hover:text-purple-600 transition-colors">
                  Testimonials
                </button>
                <button onClick={() => navigate('/pricing')} className="text-left text-gray-700 hover:text-purple-600 transition-colors">
                  Pricing
                </button>
                <button onClick={() => navigate('/faq')} className="text-left text-gray-700 hover:text-purple-600 transition-colors">
                  FAQ
                </button>
                {user ? (
                  <>
                    <button 
                      onClick={() => navigate('/my-will')} 
                      className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-full text-center hover:from-purple-700 hover:to-purple-800 transition-all"
                    >
                      My Will
                    </button>
                    <button 
                      onClick={async () => { await supabase.auth.signOut(); }} 
                      className="text-left text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setShowAuth(true)}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-full text-center hover:from-purple-700 hover:to-purple-800 transition-all"
                  >
                    Log In / Sign Up
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-8">
              <User className="mx-auto mb-6 text-purple-600" size={64} />
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                  My Will Dashboard
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Manage your will, track progress, and access your account settings
              </p>
            </div>
          </div>
        </section>

        {/* Will Status Section */}
        <section className="pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Will Status Card */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-8">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <FileText className="text-white" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-semibold text-gray-800">Will Status</h3>
                    <p className="text-gray-600">Current state of your will</p>
                  </div>
                </div>
                
                {will ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="text-green-500" size={20} />
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Will Created
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      Your will has been created and is ready for review. You can edit or update it anytime.
                    </p>
                    <button 
                       onClick={() => navigate('/review')}
                       className="w-full bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center"
                     >
                       <Edit className="mr-2" size={18} />
                       Edit Will
                       <ArrowRight className="ml-2" size={18} />
                     </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="text-orange-500" size={20} />
                      <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                        No Will Created
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      Create your first will to secure your family's future. Our step-by-step process makes it simple.
                    </p>
                    <button 
                      onClick={() => navigate('/personal-details')}
                      className="w-full bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center"
                    >
                      <FileText className="mr-2" size={18} />
                      Create Your Will
                      <ArrowRight className="ml-2" size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* Account Management Card */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-8">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Settings className="text-white" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-semibold text-gray-800">Account Settings</h3>
                    <p className="text-gray-600">Manage your account</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="text-blue-500" size={20} />
                    <span className="text-gray-700 font-medium">Secure Account</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Access your account settings, update your password, view will history, and manage security preferences.
                  </p>
                  <button 
                    onClick={() => navigate('/account')}
                    className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center border border-gray-300"
                  >
                    <Settings className="mr-2" size={18} />
                    Manage Account
                    <ArrowRight className="ml-2" size={18} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Distribution Maps Section */}
            {will && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Asset Distribution Map */}
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <Home className="text-white" size={24} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-2xl font-semibold text-gray-800">Asset Distribution Map</h3>
                      <p className="text-gray-600">How your assets are distributed</p>
                    </div>
                  </div>
                  
                  {(() => {
                    const assets = JSON.parse(localStorage.getItem('assets') || '[]');
                    const beneficiaries = JSON.parse(localStorage.getItem('beneficiaries') || '[]');
                    const charities = JSON.parse(localStorage.getItem('charities') || '[]');
                    
                    if (assets.length === 0) {
                      return <div className="text-gray-400">No assets to display distribution for.</div>;
                    }
                    
                    return (
                      <div className="space-y-6 max-h-96 overflow-y-auto">
                        <p className="text-sm text-gray-600 mb-4">Visual representation of how each asset is distributed among beneficiaries and charities.</p>
                        {assets.map((asset, idx) => {
                          const hasDistribution = asset.distribution && Object.keys(asset.distribution).length > 0;
                          if (!hasDistribution) return null;
                          
                          return (
                            <div key={idx} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <Home className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">{asset.type}</h3>
                                  <p className="text-sm text-gray-600">
                                    {getAssetDisplayLabel(asset)}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(asset.distribution).map(([recipientId, percentage]) => {
                                  const recipient = beneficiaries.find(b => b.id === recipientId) || charities.find(c => c.id === recipientId);
                                  const recipientName = recipient?.name || recipient?.charityName || 'Unknown Recipient';
                                  const isCharity = charities.find(c => c.id === recipientId);
                                  
                                  return (
                                    <div key={recipientId} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className={`p-1.5 rounded-full ${
                                          isCharity ? 'bg-green-100' : 'bg-purple-100'
                                        }`}>
                                          {isCharity ? (
                                            <Heart className="h-4 w-4 text-green-600" />
                                          ) : (
                                            <Users className="h-4 w-4 text-purple-600" />
                                          )}
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">{recipientName}</span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">
                                          {isCharity ? 'Charity' : recipient?.relation || 'Beneficiary'}
                                        </span>
                                        <span className="text-lg font-bold text-blue-600">{percentage}%</span>
                                      </div>
                                      <div className="mt-2 bg-gray-200 rounded-full h-2">
                                        <div 
                                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                          style={{ width: `${percentage}%` }}
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
                
                {/* Beneficiary & Charity Distribution Map */}
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="text-white" size={24} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-2xl font-semibold text-gray-800">Beneficiary & Charity Map</h3>
                      <p className="text-gray-600">What each recipient receives</p>
                    </div>
                  </div>
                  
                  {(() => {
                    const assets = JSON.parse(localStorage.getItem('assets') || '[]');
                    const beneficiaries = JSON.parse(localStorage.getItem('beneficiaries') || '[]');
                    const charities = JSON.parse(localStorage.getItem('charities') || '[]');
                    const genericAssetDistribution = JSON.parse(localStorage.getItem('genericAssetDistribution') || '{}');
                    
                    // Create a map of recipients and their asset allocations
                    const recipientMap = new Map();
                  
                  // Process specific asset distributions
                  assets.forEach(asset => {
                    if (asset.distribution) {
                      Object.entries(asset.distribution).forEach(([recipientId, percentage]) => {
                        if (!recipientMap.has(recipientId)) {
                          recipientMap.set(recipientId, { assets: [], genericPercentage: 0 });
                        }
                        recipientMap.get(recipientId).assets.push({
                          type: asset.type,
                          percentage: parseFloat(percentage),
                          details: asset.details
                        });
                      });
                    }
                  });
                  
                  // Process generic asset distributions
                  Object.entries(genericAssetDistribution).forEach(([recipientId, percentage]) => {
                    if (parseFloat(percentage) > 0) {
                      if (!recipientMap.has(recipientId)) {
                        recipientMap.set(recipientId, { assets: [], genericPercentage: 0 });
                      }
                      recipientMap.get(recipientId).genericPercentage = parseFloat(percentage);
                    }
                  });
                  
                  if (recipientMap.size === 0) {
                    return <div className="text-gray-400">No distributions to display.</div>;
                  }
                  
                  return (
                    <div className="space-y-6 max-h-96 overflow-y-auto">
                      <p className="text-sm text-gray-600 mb-4">Visual representation of what each beneficiary and charity will receive.</p>
                      {Array.from(recipientMap.entries()).map(([recipientId, data]) => {
                        const recipient = beneficiaries.find(b => b.id === recipientId) || charities.find(c => c.id === recipientId);
                        const recipientName = recipient?.name || recipient?.charityName || 'Unknown Recipient';
                        const isCharity = charities.find(c => c.id === recipientId);
                        const totalAssets = data.assets.length + (data.genericPercentage > 0 ? 1 : 0);
                        
                        return (
                          <div key={recipientId} className={`rounded-xl p-6 border-2 ${
                            isCharity 
                              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                              : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
                          }`}>
                            <div className="flex items-center gap-3 mb-4">
                              <div className={`p-3 rounded-full ${
                                isCharity ? 'bg-green-100' : 'bg-purple-100'
                              }`}>
                                {isCharity ? (
                                  <Heart className="h-6 w-6 text-green-600" />
                                ) : (
                                  <Users className="h-6 w-6 text-purple-600" />
                                )}
                              </div>
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900">{recipientName}</h3>
                                <p className="text-sm text-gray-600">
                                  {isCharity ? 'Charity' : recipient?.relation || 'Beneficiary'} • Receiving {totalAssets} allocation{totalAssets !== 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              {/* Specific Assets */}
                              {data.assets.map((assetAllocation, idx) => (
                                <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <Home className="h-4 w-4 text-blue-600" />
                                      <span className="font-medium text-gray-900">{assetAllocation.type}</span>
                                    </div>
                                    <span className="text-lg font-bold text-blue-600">{assetAllocation.percentage}%</span>
                                  </div>
                                  <p className="text-xs text-gray-500 mb-2">
                                    {getAssetAllocationDisplayLabel(assetAllocation.type, assetAllocation.details)}
                                  </p>
                                  <div className="bg-gray-200 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full transition-all duration-300 ${
                                        isCharity 
                                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                          : 'bg-gradient-to-r from-purple-500 to-pink-500'
                                      }`}
                                      style={{ width: `${assetAllocation.percentage}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                              
                              {/* Generic Assets */}
                              {data.genericPercentage > 0 && (
                                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <Gavel className="h-4 w-4 text-orange-600" />
                                      <span className="font-medium text-gray-900">Generic Assets (Residuary)</span>
                                    </div>
                                    <span className="text-lg font-bold text-orange-600">{data.genericPercentage}%</span>
                                  </div>
                                  <p className="text-xs text-gray-500 mb-2">
                                    Any assets not specifically mentioned in the will
                                  </p>
                                  <div className="bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${data.genericPercentage}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                  })()}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4">Banyyan Legacies</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Preserving what matters most for generations to come
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <button 
                onClick={() => navigate('/how-it-works')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                How It Works
              </button>
              <button 
                onClick={() => navigate('/testimonials')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Testimonials
              </button>
              <button 
                onClick={() => navigate('/faq')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                FAQ
              </button>
              <button 
                onClick={() => navigate('/privacy')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => navigate('/terms')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Terms of Service
              </button>
            </div>
            
            <div className="text-center text-gray-400">
              <p>&copy; 2025 Banyyan Legacies. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default MyWill;