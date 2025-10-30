'use client';

import { useState } from 'react';
import Header from '@/components/navigation/Header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Settings,
  Bell,
  Lock,
  Database,
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type PreferenceTab = 'general' | 'notifications' | 'account-security' | 'data-privacy';
type ThemeOption = 'light' | 'dark' | 'system';

export default function PreferencesPage() {
  const [activeTab, setActiveTab] = useState<PreferenceTab>('general');
  const [theme, setTheme] = useState<ThemeOption>('light');
  const [language, setLanguage] = useState('en-us');
  const [currency, setCurrency] = useState('usd');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Email notification preferences
  const [emailPrefs, setEmailPrefs] = useState({
    newMessages: true,
    itemUpdates: true,
    promotionalOffers: false,
    weeklyDigest: false,
  });

  const toggleEmailPref = (key: keyof typeof emailPrefs) => {
    setEmailPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    // TODO: Implement save logic
    console.log('Saving preferences...', {
      theme,
      language,
      currency,
      emailPrefs,
    });
  };

  const handleReset = () => {
    setTheme('light');
    setLanguage('en-us');
    setCurrency('usd');
    setEmailPrefs({
      newMessages: true,
      itemUpdates: true,
      promotionalOffers: false,
      weeklyDigest: false,
    });
  };

  const preferenceTabs = [
    { id: 'general' as PreferenceTab, label: 'General', icon: Settings },
    { id: 'notifications' as PreferenceTab, label: 'Notifications', icon: Bell },
    { id: 'account-security' as PreferenceTab, label: 'Account & Security', icon: Lock },
    { id: 'data-privacy' as PreferenceTab, label: 'Data & Privacy', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header isAuthenticated={true} />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6 lg:gap-8">
          {/* Mobile Sidebar Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-20 left-4 z-40 bg-white shadow-md"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          {/* Mobile Sidebar Overlay */}
          {mobileSidebarOpen && (
            <>
              <div
                className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <aside className="lg:hidden fixed inset-y-0 left-0 w-64 bg-white z-40 shadow-xl overflow-y-auto">
                <div className="p-4">
                  {/* User Info */}
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="/placeholder-avatar.jpg" alt="John Doe" />
                      <AvatarFallback className="bg-green-100 text-green-700">JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">John Doe</h3>
                      <p className="text-sm text-gray-600">john.doe@email.com</p>
                    </div>
                  </div>

                  {/* Navigation */}
                  <nav className="space-y-1">
                    {preferenceTabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id);
                            setMobileSidebarOpen(false);
                          }}
                          className={cn(
                            'w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center gap-3',
                            isActive
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          )}
                        >
                          <Icon className="w-4 h-4" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </aside>
            </>
          )}

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                {/* User Info */}
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="John Doe" />
                    <AvatarFallback className="bg-green-100 text-green-700">JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">John Doe</h3>
                    <p className="text-sm text-gray-600">john.doe@email.com</p>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                  {preferenceTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          'w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center gap-3',
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Preferences</h1>

            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-8">
                {/* Appearance Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Appearance</h2>
                  <p className="text-gray-600 mb-6">Customize the look and feel of the app.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(['light', 'dark', 'system'] as ThemeOption[]).map((option) => {
                      const icons = {
                        light: Sun,
                        dark: Moon,
                        system: Monitor,
                      };
                      const labels = {
                        light: 'Light',
                        dark: 'Dark',
                        system: 'System',
                      };
                      const Icon = icons[option];
                      const isSelected = theme === option;

                      return (
                        <button
                          key={option}
                          onClick={() => setTheme(option)}
                          className={cn(
                            'p-4 rounded-lg border-2 transition-all text-left',
                            isSelected
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          )}
                        >
                          <div className={cn('flex items-center gap-3', isSelected && 'text-blue-600')}>
                            <Icon className="w-5 h-5" />
                            <span className={cn('font-medium', isSelected ? 'text-blue-600' : 'text-gray-900')}>
                              {labels[option]}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Language & Currency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Language
                    </label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-us">English (United States)</SelectItem>
                        <SelectItem value="en-gb">English (United Kingdom)</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="sw">Swahili</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Currency
                    </label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD - US Dollar</SelectItem>
                        <SelectItem value="kes">KES - Kenyan Shilling</SelectItem>
                        <SelectItem value="eur">EUR - Euro</SelectItem>
                        <SelectItem value="gbp">GBP - British Pound</SelectItem>
                        <SelectItem value="tzs">TZS - Tanzanian Shilling</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Notifications</h2>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Notifications</h3>
                  <p className="text-gray-600 mb-6">Choose which emails you&apos;d like to receive.</p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="new-messages"
                          checked={emailPrefs.newMessages}
                          onCheckedChange={() => toggleEmailPref('newMessages')}
                        />
                        <label
                          htmlFor="new-messages"
                          className="text-sm font-medium text-gray-900 cursor-pointer"
                        >
                          New Messages
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="item-updates"
                          checked={emailPrefs.itemUpdates}
                          onCheckedChange={() => toggleEmailPref('itemUpdates')}
                        />
                        <label
                          htmlFor="item-updates"
                          className="text-sm font-medium text-gray-900 cursor-pointer"
                        >
                          Item Updates & Bids
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="promotional"
                          checked={emailPrefs.promotionalOffers}
                          onCheckedChange={() => toggleEmailPref('promotionalOffers')}
                        />
                        <label
                          htmlFor="promotional"
                          className="text-sm font-medium text-gray-900 cursor-pointer"
                        >
                          Promotional Offers
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="weekly-digest"
                          checked={emailPrefs.weeklyDigest}
                          onCheckedChange={() => toggleEmailPref('weeklyDigest')}
                        />
                        <label
                          htmlFor="weekly-digest"
                          className="text-sm font-medium text-gray-900 cursor-pointer"
                        >
                          Weekly Digest
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Account & Security Tab */}
            {activeTab === 'account-security' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Account & Security</h2>
                <p className="text-gray-600">Account & Security settings will be implemented here.</p>
              </div>
            )}

            {/* Data & Privacy Tab */}
            {activeTab === 'data-privacy' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Data & Privacy</h2>
                <p className="text-gray-600">Data & Privacy settings will be implemented here.</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handleReset}
                className="w-full sm:w-auto"
              >
                Reset to Defaults
              </Button>
              <Button
                onClick={handleSave}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save Changes
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
