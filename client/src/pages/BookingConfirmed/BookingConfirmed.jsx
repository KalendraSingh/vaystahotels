import React from 'react';
import {
  Check,
  MapPin,
  Calendar,
  Users,
  Phone,
  Mail,
  Building2,
  Receipt,
  CreditCard,
  Download,
  Printer,
} from 'lucide-react';

export default function BookingConfirmed() {
  // In a real app, this would come from the booking response
  const bookingDetails = {
    bookingId: 'BK-2025-03-14-001',
    hotelImage:
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1470',
    hotelName: 'Grand Plaza Hotel & Resorts',
    hotelAddress: '123 Luxury Avenue, Downtown, City 12345',
    checkIn: '2025-03-14',
    checkOut: '2025-03-16',
    rooms: [
      { name: 'Deluxe Room', count: 1, guests: 2, pricePerRoom: 199 },
      { name: 'Executive Suite', count: 1, guests: 2, pricePerRoom: 299 },
    ],
    guest: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 234 567 8900',
      gstDetails: {
        number: '29ABCDE1234F1Z5',
        companyName: 'Tech Corp Ltd',
        address: '456 Business Park, Tech City 67890',
      },
    },
    payment: {
      method: 'Credit Card',
      last4: '4242',
      amount: 537.84,
      status: 'Confirmed',
    },
    subtotal: 498,
    gst: 89.64,
    discount: 49.8,
    total: 537.84,
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white py-12'>
      <div className='max-w-4xl mx-auto px-4'>
        {/* Main Card */}
        <div className='bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl'>
          {/* Success Banner */}
          <div className='bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-12 text-white text-center relative overflow-hidden'>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMjggNjZMMCA1MEwyOCAzNGwyOCAxNkwyOCA2NnpNMjggMzRMMCA1MEwyOCA2NmwyOC0xNkwyOCAzNHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNncmlkKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-10" />
            <div className='relative'>
              <div className='mb-6 flex justify-center'>
                <div className='h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-500 hover:scale-110'>
                  <Check className='h-10 w-10 text-green-500' />
                </div>
              </div>
              <h1 className='text-4xl font-bold mb-3'>Booking Confirmed!</h1>
              <p className='text-lg opacity-90'>
                Booking ID: {bookingDetails.bookingId}
              </p>
            </div>
          </div>

          {/* Hotel Details */}
          <div className='p-8 border-b border-gray-100'>
            <div className='flex flex-col md:flex-row gap-8'>
              <div className='md:w-1/3'>
                <div className='relative rounded-xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105'>
                  <img
                    src={bookingDetails.hotelImage}
                    alt={bookingDetails.hotelName}
                    className='w-full h-48 object-cover'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />
                </div>
              </div>
              <div className='md:w-2/3'>
                <h2 className='text-3xl font-bold text-gray-800 mb-3'>
                  {bookingDetails.hotelName}
                </h2>
                <div className='flex items-start gap-2 text-gray-600 mb-6'>
                  <MapPin className='w-5 h-5 mt-0.5 flex-shrink-0' />
                  <span>{bookingDetails.hotelAddress}</span>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <div className='bg-blue-50 rounded-xl p-4 transform transition-all duration-300 hover:shadow-md'>
                    <div className='flex items-center gap-3'>
                      <Calendar className='w-5 h-5 text-blue-600' />
                      <div>
                        <div className='text-sm text-gray-600'>Check-in</div>
                        <div className='font-semibold text-blue-900'>
                          {formatDate(bookingDetails.checkIn)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='bg-blue-50 rounded-xl p-4 transform transition-all duration-300 hover:shadow-md'>
                    <div className='flex items-center gap-3'>
                      <Calendar className='w-5 h-5 text-blue-600' />
                      <div>
                        <div className='text-sm text-gray-600'>Check-out</div>
                        <div className='font-semibold text-blue-900'>
                          {formatDate(bookingDetails.checkOut)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='bg-blue-50 rounded-xl p-4 transform transition-all duration-300 hover:shadow-md'>
                    <div className='flex items-center gap-3'>
                      <Users className='w-5 h-5 text-blue-600' />
                      <div>
                        <div className='text-sm text-gray-600'>Guests</div>
                        <div className='font-semibold text-blue-900'>
                          {bookingDetails.rooms.reduce(
                            (total, room) => total + room.guests,
                            0
                          )}{' '}
                          Persons
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guest Details */}
          <div className='p-8 border-b border-gray-100'>
            <h3 className='text-xl font-bold mb-6 text-gray-800'>
              Guest Information
            </h3>
            <div className='grid md:grid-cols-2 gap-6'>
              <div className='bg-gray-50 rounded-xl p-4 flex items-center gap-4'>
                <Users className='w-6 h-6 text-gray-600' />
                <div>
                  <div className='text-sm text-gray-600'>Guest Name</div>
                  <div className='font-semibold text-gray-900'>
                    {bookingDetails.guest.name}
                  </div>
                </div>
              </div>
              <div className='bg-gray-50 rounded-xl p-4 flex items-center gap-4'>
                <Phone className='w-6 h-6 text-gray-600' />
                <div>
                  <div className='text-sm text-gray-600'>Phone</div>
                  <div className='font-semibold text-gray-900'>
                    {bookingDetails.guest.phone}
                  </div>
                </div>
              </div>
              <div className='bg-gray-50 rounded-xl p-4 flex items-center gap-4'>
                <Mail className='w-6 h-6 text-gray-600' />
                <div>
                  <div className='text-sm text-gray-600'>Email</div>
                  <div className='font-semibold text-gray-900'>
                    {bookingDetails.guest.email}
                  </div>
                </div>
              </div>
              {bookingDetails.guest.gstDetails && (
                <div className='bg-gray-50 rounded-xl p-4 flex items-center gap-4'>
                  <Building2 className='w-6 h-6 text-gray-600' />
                  <div>
                    <div className='text-sm text-gray-600'>GST Number</div>
                    <div className='font-semibold text-gray-900'>
                      {bookingDetails.guest.gstDetails.number}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Details */}
          <div className='p-8 border-b border-gray-100'>
            <h3 className='text-xl font-bold mb-6 text-gray-800'>
              Payment Details
            </h3>
            <div className='grid md:grid-cols-2 gap-8'>
              <div className='space-y-6'>
                <div className='bg-gray-50 rounded-xl p-4 flex items-center gap-4'>
                  <CreditCard className='w-6 h-6 text-gray-600' />
                  <div>
                    <div className='text-sm text-gray-600'>Payment Method</div>
                    <div className='font-semibold text-gray-900'>
                      {bookingDetails.payment.method} (****{' '}
                      {bookingDetails.payment.last4})
                    </div>
                  </div>
                </div>
                <div className='bg-gray-50 rounded-xl p-4 flex items-center gap-4'>
                  <Receipt className='w-6 h-6 text-gray-600' />
                  <div>
                    <div className='text-sm text-gray-600'>Status</div>
                    <div className='font-semibold text-green-600'>
                      {bookingDetails.payment.status}
                    </div>
                  </div>
                </div>
              </div>
              <div className='bg-gray-50 rounded-xl p-6'>
                <div className='space-y-3'>
                  <div className='flex justify-between text-gray-600'>
                    <span>Subtotal</span>
                    <span>${bookingDetails.subtotal.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between text-gray-600'>
                    <span>GST (18%)</span>
                    <span>${bookingDetails.gst.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between text-green-600'>
                    <span>Discount (10%)</span>
                    <span>-${bookingDetails.discount.toFixed(2)}</span>
                  </div>
                  <div className='pt-3 mt-3 border-t border-gray-200'>
                    <div className='flex justify-between text-lg font-bold text-gray-900'>
                      <span>Total Paid</span>
                      <span>${bookingDetails.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
