import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact TOM | Let\'s Build Something',
  description: 'Get in touch  for your next software engineering, full-stack, or automation project.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
