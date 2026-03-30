import Header from '@/app/components/Header';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen pt-20">
      <Header />

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-[#42deef]" />
            <span className="text-[#42deef] text-xs font-black uppercase tracking-[0.3em]">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase">Privacy Policy</h1>
          <p className="text-gray-500 text-xs mt-3 uppercase tracking-widest">Last updated: March 2026</p>
        </div>

        <div className="space-y-8 text-gray-400 text-sm leading-relaxed">
          <p>
            At Team Vamos, we value your privacy and are committed to protecting your personal information. This Privacy
            Policy explains how we collect, use, and safeguard your data when you visit our website or make a purchase
            from us.
          </p>

          <div className="border-t border-[#1A1A1A] pt-6">
            <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              We may collect personal information that you voluntarily provide when interacting with our website,
              including but not limited to:
            </p>
            <ul className="space-y-2 pl-4">
              {[
                'Full name',
                'Email address',
                'Contact number',
                'Shipping and billing address',
                'Payment information (processed securely via our payment gateway)',
                'Any communication you send to our customer support',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#42deef] mt-0.5 shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              We may also automatically collect non-personal data such as IP addresses, browser type, device
              information, and website usage statistics to help improve our site's performance and user experience.
            </p>
          </div>

          <div className="border-t border-[#1A1A1A] pt-6">
            <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">Your information is collected for the following purposes:</p>
            <ul className="space-y-2 pl-4">
              {[
                'To process and fulfill your orders',
                'To provide updates on order status and shipping',
                'To improve our products, services, and website experience',
                'To respond to your inquiries and provide customer support',
                'To send you promotional updates (only if you have opted in)',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#42deef] mt-0.5 shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              We will never sell, rent, or disclose your personal information to any third party except as required by
              law or to trusted partners who assist in order processing, payment, and delivery — and who are bound by
              strict confidentiality obligations.
            </p>
          </div>

          <div className="border-t border-[#1A1A1A] pt-6">
            <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">3. Data Protection and Security</h2>
            <p>
              We take all reasonable measures to protect your personal data from unauthorized access, misuse, or
              disclosure. All transactions and sensitive information are processed through secure, encrypted connections
              (SSL) and managed via trusted third-party payment providers.
            </p>
          </div>

          <div className="border-t border-[#1A1A1A] pt-6">
            <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">4. Cookies</h2>
            <p>
              Our website may use cookies to enhance user experience, track analytics, and remember preferences. You
              can choose to disable cookies through your browser settings, but some website functions may not work
              properly without them.
            </p>
          </div>

          <div className="border-t border-[#1A1A1A] pt-6">
            <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">5. Your Rights</h2>
            <p className="mb-4">Under Malaysia's Personal Data Protection Act (PDPA), you have the right to:</p>
            <ul className="space-y-2 pl-4">
              {[
                'Access, update, or correct your personal information',
                'Withdraw consent for data processing (subject to applicable terms)',
                'Request deletion of your data from our systems',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#42deef] mt-0.5 shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us at{' '}
              <a href="mailto:support@teamvamos.asia" className="text-[#42deef] hover:underline">
                support@teamvamos.asia
              </a>
              .
            </p>
          </div>

          <div className="border-t border-[#1A1A1A] pt-6">
            <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">6. Updates to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our business or legal
              requirements. The latest version will always be available on our website.
            </p>
          </div>

          <div className="border-t border-[#1A1A1A] pt-6">
            <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">7. Contact Us</h2>
            <ul className="space-y-2">
              <li className="text-gray-400">
                Email:{' '}
                <a href="mailto:support@vamos.com.my" className="text-[#42deef] hover:underline">
                  support@vamos.com.my
                </a>
              </li>
              <li className="text-gray-400">
                Website:{' '}
                <a href="https://www.vamos.com.my" className="text-[#42deef] hover:underline">
                  www.vamos.com.my
                </a>
              </li>
              <li className="text-gray-400">WhatsApp: 017 731 9060</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
