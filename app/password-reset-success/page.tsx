export default function PasswordResetSuccessPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Password Reset Successful
        </h1>
        <div className="text-gray-600 dark:text-gray-400">
          Your password has been successfully reset. You can now sign in with your new password.
        </div>
      </main>
    </div>
  );
}
