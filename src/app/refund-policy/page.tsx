import Header from '@/app/components/Header';

export default function RefundPolicyPage() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen pt-20">
      <Header />

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-[#42deef]" />
            <span className="text-[#42deef] text-xs font-black uppercase tracking-[0.3em]">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase">Refund Policy</h1>
          <p className="text-gray-500 text-xs mt-3 uppercase tracking-widest">Last updated: March 2026</p>
        </div>

        <div className="space-y-8 text-gray-400 text-sm leading-relaxed">

          {/* Exchange Policy */}
          <div>
            <h2 className="text-[#42deef] font-black uppercase tracking-widest text-xs mb-1">Section A</h2>
            <h3 className="text-white font-black uppercase text-lg mb-4">Return / Exchange Policy (Size Exchange Only)</h3>
            <p>
              At Team Vamos, we want you to feel confident and satisfied with your purchase. If you need to exchange
              your item for a different size, we are happy to assist — provided the following terms and conditions are met.
            </p>
          </div>

          <div className="border-t border-[#1A1A1A] pt-6">
            <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">1. Eligibility for Exchange</h2>
            <ul className="space-y-2 pl-4">
              {[
                'Size exchanges are only applicable for Team Vamos Official Merchandise purchased directly from our official store.',
                'The item must be in its original condition, unworn, unwashed, and free from any damage, stains, or odour.',
                'All original tags, labels, and packaging must be included and remain intact.',
                'Any accompanying accessories, inserts, or promotional items received with the original purchase must also be returned together, in one complete set.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#42deef] mt-0.5 shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-[#1A1A1A] pt-6">
            <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">2. Exchange Approval</h2>
            <p>
              Once we receive your returned item, our team will conduct a quality inspection. If the item meets the
              exchange conditions, we will proceed with sending you the new size requested, subject to stock
              availability. If the returned item is found to be worn, damaged, or altered, Team Vamos reserves the
              right to decline the exchange and return the original item to the customer.
            </p>
          </div>

          <div className="border-t border-[#1A1A1A] pt-6">
            <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">3. Postage Fees</h2>
            <p className="mb-3">All shipping costs for the size exchange are fully borne by the customer:</p>
            <ul className="space-y-2 pl-4 mb-3">
              <li className="flex items-start gap-2">
                <span className="text-[#42deef] mt-0.5 shrink-0">•</span>
                <span>RM7.00 for Peninsular Malaysia</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#42deef] mt-0.5 shrink-0">•</span>
                <span>RM13.00 for Sabah &amp; Sarawak</span>
              </li>
            </ul>
            <p>
              Customers are required to make the postage payment before proceeding with the return. After payment,
              kindly share the payment receipt with our customer service team as proof of transaction.
            </p>
          </div>

          <div className="border-t border-[#1A1A1A] pt-6">
            <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">4. Return &amp; Delivery Process</h2>
            <p className="mb-3">Once the postage fee has been paid, send the item to:</p>
            <div className="bg-[#111] border border-[#1A1A1A] p-4 text-white text-sm font-bold uppercase tracking-wide mb-3">
              NO 10-G, JALAN ECO SANTUARI 8/1B, ECO SANTUARI<br />
              42500 TELOK PANGLIMA GARANG, SELANGOR, MALAYSIA
            </div>
            <p>
              After shipping, please share your tracking number with our customer service representative. Upon receiving
              and verifying the item, we will proceed with the exchange and notify you once the new item has been
              dispatched.
            </p>
          </div>

          <div className="border-t border-[#1A1A1A] pt-6">
            <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">5. Additional Notes</h2>
            <ul className="space-y-2 pl-4">
              {[
                'Team Vamos will not be held responsible for parcels lost or damaged during return transit.',
                'Exchanges are strictly for size changes only. Requests for product changes, refunds, or colour swaps are not applicable.',
                'We reserve the right to amend or update this policy without prior notice.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#42deef] mt-0.5 shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Refund Policy */}
          <div className="border-t-2 border-[#1A1A1A] pt-10 mt-10">
            <h2 className="text-[#42deef] font-black uppercase tracking-widest text-xs mb-1">Section B</h2>
            <h3 className="text-white font-black uppercase text-lg mb-4">Refund Policy</h3>
            <p>
              At Team Vamos, we strive to ensure every customer is satisfied with their purchase. However, we
              understand that situations may arise where a refund or return is necessary.
            </p>
          </div>

          <div className="border-t border-[#1A1A1A] pt-6">
            <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">1. Eligibility for Refunds</h2>
            <ul className="space-y-2 pl-4">
              {[
                'Refunds are only applicable for items purchased through our official website or verified sales channels.',
                'To be eligible, your item must be unused, in its original condition, and returned within 7 days from the date of receipt.',
                'All original packaging, tags, and accessories must be included.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#42deef] mt-0.5 shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-[#1A1A1A] pt-6">
            <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">2. Non-Refundable Items</h2>
            <ul className="space-y-2 pl-4">
              {[
                'We do not accept refunds or exchanges for items that have been worn, washed, or damaged after delivery.',
                'Limited edition, custom-made, or discounted items are non-refundable unless proven defective upon arrival.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#42deef] mt-0.5 shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-[#1A1A1A] pt-6">
            <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">3. Damaged or Incorrect Items</h2>
            <p>
              If you received a defective or incorrect item, please contact us within 3 days of receiving your order.
              Our team will review your case and arrange a replacement or refund once the returned item has been
              inspected. Please include clear photos or videos of the issue to help us expedite the process.
            </p>
          </div>

          <div className="border-t border-[#1A1A1A] pt-6">
            <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">4. Refund Process</h2>
            <p>
              Once your return is received and inspected, we will notify you via email or WhatsApp regarding the
              approval or rejection of your refund. If approved, your refund will be processed within 7–14 working
              days, depending on your payment provider. Refunds will be issued via the original method of payment.
            </p>
          </div>

          <div className="border-t border-[#1A1A1A] pt-6">
            <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">5. Contact Us</h2>
            <ul className="space-y-2">
              <li>
                Email:{' '}
                <a href="mailto:support@vamos.com.my" className="text-[#42deef] hover:underline">
                  support@vamos.com.my
                </a>
              </li>
              <li>WhatsApp: 017 731 9060</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
