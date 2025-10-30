'use client';

import { useState } from 'react';
import Header from '@/components/navigation/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, ChevronUp, Search, Send } from 'lucide-react';
import Link from 'next/link';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(1);
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'you@example.com',
    subject: '',
    message: ''
  });

  const categories = [
    { id: 'getting-started', label: 'Getting Started' },
    { id: 'buying', label: 'Buying' },
    { id: 'selling', label: 'Selling' },
    { id: 'account-profile', label: 'Account & Profile' },
    { id: 'safety-trust', label: 'Safety & Trust' }
  ];

  const faqs = {
    'getting-started': [
      {
        id: 1,
        question: 'How do I create an account?',
        answer: 'To create an account, click the "Sign Up" button in the top-right corner of the page. You can sign up using your email address or by connecting your Google or Facebook account. Follow the on-screen instructions to complete your profile.'
      },
      {
        id: 2,
        question: 'How do I post my first ad?',
        answer: 'After creating an account, click the "Post Ad" button in the header. Fill out the required information including title, description, price, and upload photos. Review your listing and publish it to make it live.'
      },
      {
        id: 3,
        question: 'Is it free to list items for sale?',
        answer: 'Yes, basic listings are completely free. We offer premium features like featured placement and enhanced visibility for a small fee, but you can start selling without any upfront costs.'
      }
    ],
    'buying': [
      {
        id: 4,
        question: 'How can I contact a seller?',
        answer: 'Click on any listing to view details, then use the "Contact Seller" button to send a message. You can also call or text if the seller has provided their contact information.'
      },
      {
        id: 5,
        question: 'What payment methods do you accept?',
        answer: 'We support various payment methods including credit cards, PayPal, bank transfers, and cash payments. The available options depend on the seller\'s preferences.'
      }
    ],
    'selling': [
      {
        id: 6,
        question: 'How do I manage my listings?',
        answer: 'Go to "My Account" and select "My Listings" to view, edit, or delete your active listings. You can also track views, messages, and performance metrics.'
      },
      {
        id: 7,
        question: 'What are the selling fees?',
        answer: 'Basic listings are free. Premium features like featured placement cost $5-15 depending on the category and duration. We also take a small commission on successful sales.'
      }
    ],
    'account-profile': [
      {
        id: 8,
        question: 'How do I update my profile?',
        answer: 'Go to "My Account" and select "Profile Settings" to update your personal information, contact details, and preferences.'
      },
      {
        id: 9,
        question: 'Can I change my username?',
        answer: 'Yes, you can change your username once every 30 days. Go to Profile Settings and click "Edit Username" to make changes.'
      }
    ],
    'safety-trust': [
      {
        id: 10,
        question: 'What should I do if I suspect a scam?',
        answer: 'If you encounter suspicious activity, report it immediately using the "Report" button on the listing or user profile. Never send money before meeting in person or receiving the item.'
      },
      {
        id: 11,
        question: 'How do you verify sellers?',
        answer: 'We verify seller accounts through email confirmation, phone verification, and social media connections. Verified sellers have a blue checkmark next to their name.'
      }
    ]
  };

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? 0 : id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header isAuthenticated={false} />
      
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/help" className="hover:text-gray-900">Help Center</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">FAQ</span>
          </nav>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search for questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        <Tabs defaultValue="getting-started" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="space-y-4">
                {faqs[category.id as keyof typeof faqs]?.map((faq) => (
                  <Card key={faq.id} className="border border-gray-200">
                    <CardContent className="p-0">
                      <button
                        onClick={() => toggleFAQ(faq.id)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-gray-900">
                          {faq.question}
                        </h3>
                        {expandedFAQ === faq.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      {expandedFAQ === faq.id && (
                        <div className="px-6 pb-6">
                          <p className="text-gray-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Contact Form */}
        <div className="max-w-4xl mx-auto mt-16">
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Still have questions?
                </h2>
                <p className="text-gray-600">
                  If you can&apos;t find the answer you&apos;re looking for in our FAQ, please fill out 
                  the form below to get in touch with our support team.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Your message here..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Submit Question
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}