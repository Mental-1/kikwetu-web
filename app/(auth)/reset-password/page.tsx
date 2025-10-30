'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function PasswordResetPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password strength validation
  const passwordRequirements = {
    minLength: formData.password.length >= 8,
    hasNumber: /\d/.test(formData.password),
    hasUppercase: /[A-Z]/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordRequirements.minLength) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle password reset
      console.log('Password reset:', formData);
      // Redirect to success page
      router.push('/password-updated');
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Create a New Password
          </CardTitle>
          <p className="text-gray-600">
            Your new password must be different from previously used passwords.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your new password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={errors.password ? 'border-red-500' : ''}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={passwordRequirements.minLength}
                    className="w-4 h-4"
                  />
                  <span className={passwordRequirements.minLength ? 'text-gray-900' : 'text-gray-500'}>
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={passwordRequirements.hasNumber}
                    className="w-4 h-4"
                  />
                  <span className={passwordRequirements.hasNumber ? 'text-gray-900' : 'text-gray-500'}>
                    Contains a number
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={passwordRequirements.hasUppercase}
                    className="w-4 h-4"
                  />
                  <span className={passwordRequirements.hasUppercase ? 'text-gray-900' : 'text-gray-500'}>
                    Contains an uppercase letter
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={passwordRequirements.hasSpecialChar}
                    className="w-4 h-4"
                  />
                  <span className={passwordRequirements.hasSpecialChar ? 'text-gray-900' : 'text-gray-500'}>
                    Contains a special character
                  </span>
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <div className="flex items-center space-x-1 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.confirmPassword}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!passwordRequirements.minLength || !passwordRequirements.hasNumber}
            >
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-sm text-gray-600">
          Having trouble?{' '}
          <Link href="/contact-support" className="text-blue-600 hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </main>
  );
}
