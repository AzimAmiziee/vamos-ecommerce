import Header from '@/app/components/Header';

const SECTIONS = [
  {
    id: 'overview',
    title: 'Overview',
    content: `This website is operated by Team Vamos. Throughout the site, the terms "we", "us" and "our" refer to Team Vamos. Team Vamos offers this website, including all information, tools and Services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.

By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service"), including those additional terms and conditions and policies referenced herein. These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.

Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service.`,
  },
  {
    id: 's1',
    title: 'Section 1 — Online Store Terms',
    content: `By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you have given us your consent to allow any of your minor dependents to use this site.
You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction.
You must not transmit any worms or viruses or any code of a destructive nature.
A breach or violation of any of the Terms will result in an immediate termination of your Services.`,
  },
  {
    id: 's2',
    title: 'Section 2 — General Conditions',
    content: `We reserve the right to refuse Service to anyone for any reason at any time.
You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service without express written permission by us.`,
  },
  {
    id: 's3',
    title: 'Section 3 — Accuracy, Completeness and Timeliness of Information',
    content: `We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon as the sole basis for making decisions. We reserve the right to modify the contents of this site at any time.`,
  },
  {
    id: 's4',
    title: 'Section 4 — Modifications to the Service and Prices',
    content: `Prices for our products are subject to change without notice.
We reserve the right at any time to modify or discontinue the Service without notice. We shall not be liable to you or any third-party for any modification, price change, suspension or discontinuance of the Service.`,
  },
  {
    id: 's5',
    title: 'Section 5 — Products or Services',
    content: `Certain products or Services may be available exclusively online through the website. These products may have limited quantities and are subject to return or exchange only according to our Refund Policy.
We have made every effort to display as accurately as possible the colours and images of our products. We cannot guarantee that your monitor's display of any colour will be accurate.`,
  },
  {
    id: 's6',
    title: 'Section 6 — Accuracy of Billing and Account Information',
    content: `We reserve the right to refuse any order you place with us. We may limit or cancel quantities purchased per person, per household or per order.
You agree to provide current, complete and accurate purchase and account information for all purchases made at our store.`,
  },
  {
    id: 's12',
    title: 'Section 12 — Prohibited Uses',
    content: `In addition to other prohibitions as set forth in the Terms of Service, you are prohibited from using the site or its content: (a) for any unlawful purpose; (b) to solicit others to perform unlawful acts; (c) to violate any regulations, rules, or laws; (d) to infringe upon our intellectual property rights or those of others; (e) to harass, abuse, or discriminate; (f) to submit false or misleading information; (g) to upload viruses or malicious code; (h) to collect personal information of others; (i) to spam, phish, or scrape; or (k) to interfere with the security features of the Service.`,
  },
  {
    id: 's13',
    title: 'Section 13 — Disclaimer of Warranties; Limitation of Liability',
    content: `We do not guarantee that your use of our Service will be uninterrupted, timely, secure or error-free.
The Service is provided 'as is' and 'as available' without any representation, warranties or conditions of any kind.
In no case shall Team Vamos be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind.`,
  },
  {
    id: 's18',
    title: 'Section 18 — Governing Law',
    content: `These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of Malaysia.`,
  },
  {
    id: 's20',
    title: 'Section 20 — Contact Information',
    content: `Questions about the Terms of Service should be sent to us at admin@vamos.com.my.`,
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen pt-20">
      <Header />

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-[#42deef]" />
            <span className="text-[#42deef] text-xs font-black uppercase tracking-[0.3em]">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase">Terms of Service</h1>
          <p className="text-gray-500 text-xs mt-3 uppercase tracking-widest">Last updated: March 2026</p>
        </div>

        <div className="space-y-8">
          <div className="bg-[#111] border border-[#1A1A1A] p-4 text-xs text-gray-500 uppercase tracking-widest">
            VAMOS ESPORTS SDN. BHD. · 202401000356 (1546207-A)<br />
            NO. 10-G, JALAN ECO SANTUARI 8/1B, ECO SANTUARI, 42500 TELOK PANGLIMA GARANG, SELANGOR
          </div>

          {SECTIONS.map((section) => (
            <div key={section.id} className="border-t border-[#1A1A1A] pt-6">
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">{section.title}</h2>
              <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{section.content}</div>
            </div>
          ))}

          <div className="border-t border-[#1A1A1A] pt-6">
            <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">Contact</h2>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                Email:{' '}
                <a href="mailto:admin@vamos.com.my" className="text-[#42deef] hover:underline">
                  admin@vamos.com.my
                </a>
              </li>
              <li>Phone: 017B770 9890</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
