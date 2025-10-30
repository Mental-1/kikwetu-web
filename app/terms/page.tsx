'use client';

import { useState } from 'react';
import Header from '@/components/navigation/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Search, Download } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  const [expandedSection, setExpandedSection] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    {
      id: 1,
      title: 'Acceptance of Terms',
      content: 'By accessing or using our services, you agree to be bound by these terms and conditions. If you disagree with any part of the terms, you may not access the service. This agreement applies to all visitors, users, and others who access or use the Service.'
    },
    {
      id: 2,
      title: 'User Accounts & Responsibilities',
      content: 'You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account or password.'
    },
    {
      id: 3,
      title: 'Listing Policies',
      content: 'All listings must comply with our community guidelines. Prohibited items include illegal goods, counterfeit products, and items that violate intellectual property rights.'
    },
    {
      id: 4,
      title: 'Prohibited Conduct',
      content: 'Users may not engage in fraudulent activities, spam, harassment, or any behavior that violates our community standards or applicable laws.'
    },
    {
      id: 5,
      title: 'Payments & Fees',
      content: 'Transaction fees and payment processing are handled securely through our payment partners. All fees are clearly disclosed before completing any transaction.'
    },
    {
      id: 6,
      title: 'Disputes & Resolutions',
      content: 'We provide dispute resolution services to help resolve conflicts between buyers and sellers. Our support team will mediate disputes according to our established policies.'
    },
    {
      id: 7,
      title: 'Intellectual Property',
      content: 'Users retain ownership of their content but grant us a license to use, display, and distribute their listings on our platform.'
    },
    {
      id: 8,
      title: 'Disclaimers',
      content: 'Our service is provided "as is" without warranties of any kind. We do not guarantee the accuracy, completeness, or reliability of user-generated content.'
    },
    {
      id: 9,
      title: 'Termination of Service',
      content: 'We reserve the right to terminate or suspend accounts that violate these terms. Users may also terminate their accounts at any time.'
    },
    {
      id: 10,
      title: 'Contact Information',
      content: 'For questions about these terms, please contact us at legal@marketplace.com or write to us at Marketplace Inc., 123 Market Street, Suite 100, San Francisco, CA 94103.'
    }
  ];

  const toggleSection = (id: number) => {
    setExpandedSection(expandedSection === id ? 0 : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header isAuthenticated={false} />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                ON THIS PAGE
              </h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => toggleSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      expandedSection === section.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {section.id}. {section.title}
                  </button>
                ))}
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
                    Terms and Conditions
                  </h1>
                  <p className="text-gray-600">
                    Last Updated: October 26, 2023
                  </p>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Print / Download PDF
                </Button>
              </div>

              {/* Search Bar */}
              <div className="mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search keywords in terms"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Terms Sections */}
              <div className="space-y-4">
                {sections.map((section) => (
                  <Card key={section.id} className="border border-gray-200">
                    <CardContent className="p-0">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-gray-900">
                          {section.id}. {section.title}
                        </h3>
                        {expandedSection === section.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      {expandedSection === section.id && (
                        <div className="px-6 pb-6">
                          <p className="text-gray-700 leading-relaxed">
                            {section.content}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}