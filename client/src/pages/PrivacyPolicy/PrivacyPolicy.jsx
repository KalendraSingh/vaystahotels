import React, { useState } from 'react';

export default function PrivacyPlicy() {
  const [activeTab, setActiveTab] = useState('terms');

  const tabContent = {
    terms: {
      title: 'Terms And Conditions',
      content: `1. Acceptance of Terms
By accessing and using our hotel booking services, you agree to comply with and be bound by the following terms and conditions, along with our Privacy Policy.
2. Booking Confirmation
Your booking is confirmed upon receipt of a confirmation email from our website. The confirmation email serves as proof of your booking and includes details about your stay, payment, and cancellation policies.
3. User Responsibilities
Users are responsible for providing accurate information during booking, including names, contact details, and payment information.
It is the user’s responsibility to review all booking details in the confirmation email. If there are discrepancies, users should contact us immediately.
4. Room Rates and Charges
Room rates are displayed in the currency specified on the website and may vary based on season, availability, and other factors.
Rates may not include additional charges, such as taxes, service fees, and resort fees, which will be clearly indicated during the booking process.
5. Check-in and Check-out
Check-in and check-out times are specified on the booking confirmation page. Early check-in or late check-out requests may incur additional charges and are subject to availability.
6. Guest Conduct
Guests are expected to adhere to hotel policies during their stay, including non-smoking rules, quiet hours, and maximum occupancy limits.
The hotel reserves the right to refuse service or remove guests from the property for violating hotel policies or engaging in inappropriate behavior.
7. Limitation of Liability
The hotel and booking website are not liable for any direct or indirect damages, including loss of enjoyment or incidental expenses, arising from your stay or use of the website.
We are not responsible for force majeure events, such as natural disasters or unforeseen circumstances, which may impact your stay.
8. Privacy Policy
All personal information provided during booking is handled in accordance with our Privacy Policy, which outlines how we collect, use, and protect your data.`,
    },
    cancellation: {
      title: 'Conditions for Cancellation',
      content: `1. General Cancellation Policy
Cancellations made within 24 hours of booking are eligible for a full refund.
For cancellations made more than 48 hours before the scheduled check-in date, users will receive a full refund, minus any applicable service fees.
Cancellations made within 48 hours of the check-in date will incur a one-night stay charge plus any service fees.
2. Non-Refundable Rates
Certain rates, including promotional and discounted bookings, are non-refundable and cannot be canceled or modified. These terms are specified at the time of booking.
3. Modification of Reservation
Changes to a confirmed booking (dates, room type, etc.) are subject to availability and may incur additional fees.
Modifications requested within 48 hours of check-in are not permitted, and standard cancellation charges will apply if the booking is canceled.
4. No-Shows
Guests who do not arrive on the scheduled check-in date without prior notice will be considered a no-show. The reservation will be canceled, and no refund will be provided.
5. Cancellation Due to Extraordinary Circumstances
In cases of force majeure events (e.g., natural disasters, government-imposed travel restrictions), cancellation policies may be adjusted, and refunds may be provided on a case-by-case basis.
`,
    },
    payments: {
      title: 'Payments',
      content: `1. Payment Methods
We accept major credit and debit cards, online banking, and other forms of payment as specified on the website. Cash payments may not be accepted.
Full or partial payment is required at the time of booking, depending on the rate type and reservation policy.
2. Deposit Policy
Certain bookings may require a deposit at the time of reservation. The deposit amount will be specified during the booking process and may be non-refundable.
3. Final Payment
For bookings with partial payments, the balance is due upon check-in. Failure to complete the payment may result in cancellation without refund.
4. Currency and Exchange Rates
All charges are processed in the currency specified on the website. Guests are responsible for any applicable currency exchange fees imposed by their payment provider.
5. Refunds
Refunds for cancellations (where applicable) will be processed to the original payment method within 7–10 business days. Any delays due to external payment processors are beyond our control.
Service fees, currency exchange charges, and other incidental costs may not be refundable.
6. Chargebacks and Disputes
If a chargeback or payment dispute is initiated, we reserve the right to cancel the reservation and recover any outstanding amounts, including legal fees, from the guest.
7. Fraud Prevention
To protect against fraud, we may require additional verification or identification for certain bookings. Failure to provide requested documentation may result in booking cancellation.
`,
    },
  };

  return (
    <div className=' w-full md:w-[1200px] mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Terms And Conditions</h1>
      <div className='mb-4'>
        <div className='flex border-b'>
          {Object.keys(tabContent).map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 text-[10px] sm:text-[12px] md:text-[16px] ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-blue-500'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tabContent[tab].title}
            </button>
          ))}
        </div>
      </div>
      <div className='bg-white rounded-lg shadow '>
        <div className='p-6'>
          <h2 className='text-xl font-semibold mb-4'>
            {tabContent[activeTab].title}
          </h2>
          <div className=''>
            <p className='text-gray-700 whitespace-pre-line'>
              {tabContent[activeTab].content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
