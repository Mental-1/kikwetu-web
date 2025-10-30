'use client';

import { useState } from 'react';
import Header from '@/components/navigation/Header';
import Footer from '@/components/layout/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Settings,
  User,
  Lock,
  Shield,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Camera,
  Eye,
  EyeOff,
  Menu,
  X,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { showToast } from '@/utils/toast';
import TwoFactorModal from '@/components/settings/TwoFactorModal';

type SettingsTab = 'profile' | 'security' | 'privacy' | 'account';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isTwoFactorModalOpen, setIsTwoFactorModalOpen] = useState(false);
  
  // Profile state
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+254 712 345 678',
    location: 'Nairobi, Kenya',
    bio: 'I love buying and selling quality items!',
    avatar: '/placeholder-avatar.jpg',
  });

  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Privacy state
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showLocation: true,
    allowMessages: true,
    showOnlineStatus: true,
  });

  const settingsTabs = [
    { id: 'profile' as SettingsTab, label: 'Profile', icon: User },
    { id: 'security' as SettingsTab, label: 'Security', icon: Lock },
    { id: 'privacy' as SettingsTab, label: 'Privacy', icon: Shield },
    { id: 'account' as SettingsTab, label: 'Account', icon: Settings },
  ];

  const handleProfileUpdate = () => {
    // TODO: Implement API call
    showToast.success('Profile Updated', 'Your profile has been updated successfully');
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      showToast.error('Password Mismatch', 'New password and confirm password do not match');
      return;
    }
    if (newPassword.length < 8) {
      showToast.error('Weak Password', 'Password must be at least 8 characters long');
      return;
    }
    // TODO: Implement API call
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast.success('Password Changed', 'Your password has been changed successfully');
  };

  const handleTwoFactorToggle = () => {
    if (twoFactorEnabled) {
      // Disable 2FA
      setTwoFactorEnabled(false);
      showToast.info('2FA Disabled', 'Two-factor authentication has been disabled');
    } else {
      // Enable 2FA - open modal
      setIsTwoFactorModalOpen(true);
    }
  };

  const handle2FAComplete = (verified: boolean) => {
    if (verified) {
      setTwoFactorEnabled(true);
    }
  };

  const handlePrivacyUpdate = () => {
    // TODO: Implement API call
    showToast.success('Privacy Settings Updated', 'Your privacy settings have been updated');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // TODO: Implement API call
      showToast.warning('Account Deletion', 'Account deletion requested. You will receive a confirmation email.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header isAuthenticated={true} />

      <div className="flex-1 container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="w-full"
              >
                {mobileSidebarOpen ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Close Menu
                  </>
                ) : (
                  <>
                    <Menu className="w-4 h-4 mr-2" />
                    Settings Menu
                  </>
                )}
              </Button>
            </div>

            {/* Sidebar */}
            <div
              className={cn(
                'lg:block bg-white rounded-lg border border-gray-200 shadow-sm p-4 md:p-6',
                mobileSidebarOpen ? 'block' : 'hidden'
              )}
            >
              {/* User Info */}
              <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-200">
                <Avatar className="w-20 h-20 mb-4">
                  <AvatarImage src={profile.avatar} alt={profile.firstName} />
                  <AvatarFallback className="bg-gray-200 text-gray-700 text-2xl">
                    {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-gray-900 text-center">
                  {profile.firstName} {profile.lastName}
                </h3>
                <p className="text-sm text-gray-500 text-center">{profile.email}</p>
              </div>

              {/* Tabs */}
              <nav className="space-y-1">
                {settingsTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors',
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {settingsTabs.find((t) => t.id === activeTab)?.label} Settings
                </CardTitle>
                <CardDescription>
                  Manage your {activeTab === 'profile' && 'profile information'}
                  {activeTab === 'security' && 'account security and password'}
                  {activeTab === 'privacy' && 'privacy preferences'}
                  {activeTab === 'account' && 'account settings'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    {/* Avatar Upload */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={profile.avatar} alt={profile.firstName} />
                        <AvatarFallback className="bg-gray-200 text-gray-700 text-3xl">
                          {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Button variant="outline" size="sm">
                          <Camera className="w-4 h-4 mr-2" />
                          Upload New Photo
                        </Button>
                        <p className="text-sm text-gray-500 mt-2">
                          JPG, PNG or GIF. Max size of 2MB.
                        </p>
                      </div>
                    </div>

                    <Separator className="bg-gray-200" />

                    {/* Profile Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="firstName" className="text-gray-900 font-medium">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          value={profile.firstName}
                          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                          className="mt-1 bg-white border-gray-300"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-gray-900 font-medium">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          value={profile.lastName}
                          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                          className="mt-1 bg-white border-gray-300"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-gray-900 font-medium">
                          Email
                        </Label>
                        <div className="relative mt-1">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            className="pl-10 bg-white border-gray-300"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-gray-900 font-medium">
                          Phone Number
                        </Label>
                        <div className="relative mt-1">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="phone"
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            className="pl-10 bg-white border-gray-300"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="location" className="text-gray-900 font-medium">
                          Location
                        </Label>
                        <div className="relative mt-1">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="location"
                            value={profile.location}
                            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                            className="pl-10 bg-white border-gray-300"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="bio" className="text-gray-900 font-medium">
                          Bio
                        </Label>
                        <textarea
                          id="bio"
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          rows={4}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </div>

                    <Separator className="bg-gray-200" />

                    <div className="flex justify-end">
                      <Button
                        onClick={handleProfileUpdate}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    {/* Change Password */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="currentPassword" className="text-gray-900 font-medium">
                            Current Password
                          </Label>
                          <div className="relative mt-1">
                            <Input
                              id="currentPassword"
                              type={showCurrentPassword ? 'text' : 'password'}
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className="pr-10 bg-white border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="newPassword" className="text-gray-900 font-medium">
                            New Password
                          </Label>
                          <div className="relative mt-1">
                            <Input
                              id="newPassword"
                              type={showNewPassword ? 'text' : 'password'}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="pr-10 bg-white border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showNewPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Must be at least 8 characters long
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword" className="text-gray-900 font-medium">
                            Confirm New Password
                          </Label>
                          <div className="relative mt-1">
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="pr-10 bg-white border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <Button
                          onClick={handlePasswordChange}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Update Password
                        </Button>
                      </div>
                    </div>

                    <Separator className="bg-gray-200" />

                    {/* Two-Factor Authentication */}
                    <div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Two-Factor Authentication
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Button
                          variant={twoFactorEnabled ? 'default' : 'outline'}
                          onClick={handleTwoFactorToggle}
                          className={cn(
                            twoFactorEnabled
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'border-gray-300'
                          )}
                        >
                          {twoFactorEnabled ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Enabled
                            </>
                          ) : (
                            'Enable'
                          )}
                        </Button>
                      </div>
                    </div>

                    <Separator className="bg-gray-200" />

                    {/* Active Sessions */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">This Device</p>
                            <p className="text-sm text-gray-600">Windows • Chrome • Last active: Now</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Revoke
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">iPhone 13</p>
                            <p className="text-sm text-gray-600">iOS • Safari • Last active: 2 hours ago</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Revoke
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Tab */}
                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Visibility</h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="profileVisibility"
                            value="public"
                            checked={privacySettings.profileVisibility === 'public'}
                            onChange={(e) =>
                              setPrivacySettings({
                                ...privacySettings,
                                profileVisibility: e.target.value,
                              })
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">Public</p>
                            <p className="text-sm text-gray-600">
                              Your profile is visible to everyone
                            </p>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="profileVisibility"
                            value="private"
                            checked={privacySettings.profileVisibility === 'private'}
                            onChange={(e) =>
                              setPrivacySettings({
                                ...privacySettings,
                                profileVisibility: e.target.value,
                              })
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">Private</p>
                            <p className="text-sm text-gray-600">
                              Only your followers can see your profile
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <Separator className="bg-gray-200" />

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Information Visibility
                      </h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                          <div>
                            <p className="font-medium text-gray-900">Show Email Address</p>
                            <p className="text-sm text-gray-600">
                              Allow others to see your email address
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={privacySettings.showEmail}
                            onChange={(e) =>
                              setPrivacySettings({
                                ...privacySettings,
                                showEmail: e.target.checked,
                              })
                            }
                            className="w-5 h-5 text-blue-600 rounded"
                          />
                        </label>
                        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                          <div>
                            <p className="font-medium text-gray-900">Show Phone Number</p>
                            <p className="text-sm text-gray-600">
                              Allow others to see your phone number
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={privacySettings.showPhone}
                            onChange={(e) =>
                              setPrivacySettings({
                                ...privacySettings,
                                showPhone: e.target.checked,
                              })
                            }
                            className="w-5 h-5 text-blue-600 rounded"
                          />
                        </label>
                        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                          <div>
                            <p className="font-medium text-gray-900">Show Location</p>
                            <p className="text-sm text-gray-600">
                              Display your location on your profile
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={privacySettings.showLocation}
                            onChange={(e) =>
                              setPrivacySettings({
                                ...privacySettings,
                                showLocation: e.target.checked,
                              })
                            }
                            className="w-5 h-5 text-blue-600 rounded"
                          />
                        </label>
                        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                          <div>
                            <p className="font-medium text-gray-900">Allow Messages</p>
                            <p className="text-sm text-gray-600">
                              Let others send you messages
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={privacySettings.allowMessages}
                            onChange={(e) =>
                              setPrivacySettings({
                                ...privacySettings,
                                allowMessages: e.target.checked,
                              })
                            }
                            className="w-5 h-5 text-blue-600 rounded"
                          />
                        </label>
                        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                          <div>
                            <p className="font-medium text-gray-900">Show Online Status</p>
                            <p className="text-sm text-gray-600">
                              Display when you're online
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={privacySettings.showOnlineStatus}
                            onChange={(e) =>
                              setPrivacySettings({
                                ...privacySettings,
                                showOnlineStatus: e.target.checked,
                              })
                            }
                            className="w-5 h-5 text-blue-600 rounded"
                          />
                        </label>
                      </div>
                    </div>

                    <Separator className="bg-gray-200" />

                    <div className="flex justify-end">
                      <Button
                        onClick={handlePrivacyUpdate}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}

                {/* Account Tab */}
                {activeTab === 'account' && (
                  <div className="space-y-6">
                    {/* Account Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Account Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Account Created</p>
                            <p className="text-sm text-gray-600">January 15, 2024</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Member Since</p>
                            <p className="text-sm text-gray-600">January 2024</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Total Listings</p>
                            <p className="text-sm text-gray-600">24 active listings</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-gray-200" />

                    {/* Data Export */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Data & Export</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Export Your Data</p>
                            <p className="text-sm text-gray-600">
                              Download a copy of your account data
                            </p>
                          </div>
                          <Button variant="outline">Export Data</Button>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-gray-200" />

                    {/* Danger Zone */}
                    <div>
                      <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
                      <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
                        <div className="flex items-start gap-3 mb-4">
                          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="font-medium text-red-900">Delete Account</p>
                            <p className="text-sm text-red-700 mt-1">
                              Once you delete your account, there is no going back. Please be certain.
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteAccount}
                          className="w-full sm:w-auto"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete My Account
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 2FA Modal */}
      <TwoFactorModal
        isOpen={isTwoFactorModalOpen}
        onClose={() => setIsTwoFactorModalOpen(false)}
        onComplete={handle2FAComplete}
      />

      <Footer />
    </div>
  );
}
