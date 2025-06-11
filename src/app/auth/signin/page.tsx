"use client";
import AuthButton from '@/components/auth/AuthButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function SignInPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/'); // Redirect if already logged in
    }
  }, [user, loading, router]);

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Sign In to AI Scribe</CardTitle>
          <CardDescription>
            Access your history and more by signing in with your Google account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <AuthButton />
          </div>
          <div className="text-center">
             <Button variant="link" asChild>
              <Link href="/" className="text-sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home (Guest Access)
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
