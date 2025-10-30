'use client';

import { useState } from 'react';
import Header from '@/components/navigation/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, Info, FolderOpen, Circle, Share2, Cookie, Lock, User, Mail, Printer } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    { id: 'privacy-policy', title: 'Privacy Policy', icon: Globe },
    { id: 'introduction', title: 'Introduction', icon: Info },
    { id: 'information-collection', title: 'Information Collection', icon: FolderOpen },
    { id: 'use-of-information', title: 'Use of Information', icon: Circle },
    { id: 'data-sharing', title: 'Data Sharing', icon: Share2 },
    { id: 'cookies', title: 'Cookies', icon: Cookie },
    { id: 'data-security', title: 'Data Security', icon: Lock },
    { id: 'user-rights', title: 'User Rights', icon: User },
    { id: 'contact-us', title: 'Contact Us', icon: Mail }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'introduction':
        return (
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              This Privacy Policy describes how we collect, use, and protect your personal information 
              when you use our marketplace platform. We are committed to protecting your privacy and 
              ensuring the security of your personal data.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This policy applies to information we collect through our website, services, sales, 
              marketing, or events. By using our services, you agree to the collection and use of 
              information in accordance with this policy.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We believe in transparency and want you to understand how we handle your data. If you 
              have any questions about this Privacy Policy, please don&apos;t hesitate to contact us.
            </p>
          </div>
        );
      
      case 'information-collection':
        return (
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              We collect personal information that you voluntarily provide to us when you register 
              for an account, express an interest in obtaining information about us or our products 
              and services, or otherwise contact us.
            </p>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Personal Information</h4>
              <p className="text-gray-700 leading-relaxed">
                We may collect personal information such as your name, phone numbers, email addresses, 
                mailing addresses, usernames, passwords, contact preferences, and other similar information.
              </p>
              
              <h4 className="font-semibold text-gray-900">Transaction Data</h4>
              <p className="text-gray-700 leading-relaxed">
                We collect information about your purchases, including details about payments, products, 
                and services you have purchased from us.
              </p>
              
              <h4 className="font-semibold text-gray-900">Technical Data</h4>
              <p className="text-gray-700 leading-relaxed">
                We automatically collect certain information when you visit our website, including your 
                IP address, login data, browser type and version, time zone setting, location, and 
                information about your device&apos;s operating system and platform.
              </p>
            </div>
          </div>
        );
      
      case 'use-of-information':
        return (
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              We use your personal information for various business purposes, including legitimate 
              business interests, contract performance, user consent, and legal obligations.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This includes providing customer service, processing transactions, improving our services, 
              and communicating with you about products, services, and promotional offers.
            </p>
          </div>
        );
      
      case 'data-sharing':
        return (
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              We may process or share your data based on the following legal bases:
            </p>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Consent</h4>
              <p className="text-gray-700 leading-relaxed">
                We may process your data if you have given us specific consent to use your personal 
                information for a specific purpose.
              </p>
              
              <h4 className="font-semibold text-gray-900">Legitimate Interests</h4>
              <p className="text-gray-700 leading-relaxed">
                We may process your data when it is reasonably necessary to achieve our legitimate 
                business interests.
              </p>
              
              <h4 className="font-semibold text-gray-900">Performance of a Contract</h4>
              <p className="text-gray-700 leading-relaxed">
                We may process your personal information to fulfill the terms of our contract with you.
              </p>
            </div>
          </div>
        );
      
      case 'cookies':
        return (
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar tracking technologies to collect and use personal information 
              about you. For more information about our use of cookies and other tracking technologies, 
              please refer to our Cookie Policy.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Cookies are small text files that are placed on your device to help us provide you with 
              a better user experience and to analyze how our website is used.
            </p>
          </div>
        );
      
      case 'data-security':
        return (
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              We have implemented appropriate technical and organizational security measures designed 
              to protect the security of any personal information we process.
            </p>
            <p className="text-gray-700 leading-relaxed">
              However, please also remember that we cannot guarantee that the internet itself is 100% 
              secure. Although we will do our best to protect your personal information, transmission 
              of personal information to and from our website is at your own risk.
            </p>
          </div>
        );
      
      case 'user-rights':
        return (
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              In some regions (like the European Economic Area), you have certain rights under applicable 
              data protection laws. These may include the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Request access to and obtain a copy of your personal information</li>
              <li>Request rectification or erasure of your personal information</li>
              <li>Restrict the processing of your personal information</li>
              <li>Data portability</li>
              <li>Object to the processing of your personal information</li>
            </ul>
          </div>
        );
      
      case 'contact-us':
        return (
          <div className="space-y-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Globe className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Contact Us</h4>
                    <p className="text-gray-700 mb-4">
                      If you have any questions or comments about this Privacy Policy, please contact us:
                    </p>
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        Email: <Link href="mailto:privacy@marketplace.com" className="text-blue-600 hover:underline">privacy@marketplace.com</Link>
                      </p>
                      <div className="text-gray-700">
                        <p>Marketplace Inc.</p>
                        <p>Attn: Data Protection Officer</p>
                        <p>123 Market Street, Suite 100</p>
                        <p>San Francisco, CA 94103</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header isAuthenticated={false} />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-24">
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-3 ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {section.title}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Privacy Policy
                  </h1>
                  <p className="text-gray-600">
                    Last updated: October 26, 2023
                  </p>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
              </div>

              {/* Content */}
              <div className="prose max-w-none">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}