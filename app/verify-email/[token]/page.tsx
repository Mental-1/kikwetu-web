interface VerifyEmailPageProps {
  params: {
    token: string;
  };
}

export default function VerifyEmailPage({ params }: VerifyEmailPageProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Verify Email
        </h1>
        <div className="text-gray-600 dark:text-gray-400">
          Email verification will be implemented here
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-500 mt-4">
          Token: {params.token}
        </div>
      </main>
    </div>
  );
}
