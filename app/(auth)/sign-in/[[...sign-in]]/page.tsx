import { SignIn } from '@clerk/nextjs';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
};

export default function SignInPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <SignIn />
    </div>
  );
}
