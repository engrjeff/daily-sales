import { SignUp } from '@clerk/nextjs';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up',
};

export default function SignUpPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <SignUp />
    </div>
  );
}
