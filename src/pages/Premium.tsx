import React from 'react';
import { Crown, Check, Star, Zap, Shield, Download, Play, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Premium: React.FC = () => {
  const { t, isRTL } = useLanguage();

  const features = [
    { icon: Play, key: 'premium.noAds' },
    { icon: Star, key: 'premium.hd' },
    { icon: Download, key: 'premium.offline' },
    { icon: Shield, key: 'premium.exclusive' },
    { icon: Zap, text: 'Priority Support' },
    { icon: Users, text: 'Family Sharing' },
  ];

  const plans = [
    {
      name: 'Basic',
      price: t('premium.price'),
      duration: '/month',
      features: ['No Ads', 'HD Quality', 'Mobile Download'],
      popular: false,
    },
    {
      name: 'Premium',
      price: '$19.99',
      duration: '/month',
      features: ['Everything in Basic', 'Offline Viewing', 'Exclusive Content', 'Priority Support'],
      popular: true,
    },
    {
      name: 'Family',
      price: '$29.99',
      duration: '/month',
      features: ['Everything in Premium', 'Up to 6 accounts', 'Parental Controls', 'Family Mix'],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-purple opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-gold rounded-full shadow-gold animate-pulse-custom">
                <Crown className="w-12 h-12 text-gray-900" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 text-shadow">
              {t('premium.title')}
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {t('premium.subtitle')}
            </p>
            <div className="flex justify-center">
              <button className="btn-gold text-lg px-8 py-4">
                {t('premium.subscribe')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Premium Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm border border-purple-600/30 rounded-xl p-6 hover:border-gold-500/50 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-gradient-gold rounded-lg">
                    <IconComponent className="w-6 h-6 text-gray-900" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {feature.key ? t(feature.key) : feature.text}
                  </h3>
                </div>
                <p className="text-gray-400">
                  Experience the best of video streaming with our premium features.
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Choose Your Plan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-gray-800/50 backdrop-blur-sm border rounded-xl p-8 transition-all duration-300 transform hover:scale-105 ${
                plan.popular
                  ? 'border-gold-500 shadow-gold'
                  : 'border-purple-600/30 hover:border-purple-500/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-gold text-gray-900 px-4 py-2 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gold-500">{plan.price}</span>
                  <span className="text-gray-400 ml-2">{plan.duration}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-gold-500 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 ${
                  plan.popular
                    ? 'bg-gradient-gold text-gray-900 shadow-gold'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-purple py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Go Premium?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join millions of users enjoying ad-free, high-quality video streaming.
          </p>
          <button className="btn-gold text-lg px-8 py-4">
            Start Free Trial
          </button>
          <p className="text-sm text-gray-400 mt-4">
            Cancel anytime. No commitments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Premium;