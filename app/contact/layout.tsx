import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — Let\'s build something',
  description: 'Get in touch with Hatem Rihan for your next website, product, or automation project.',
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
