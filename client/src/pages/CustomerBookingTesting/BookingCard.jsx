import React from 'react';
import BookingPaymentCard from './BookingPaymentCard';

const BookingCard = () => {
  return (
    <>
      <BookingPaymentCard
        customer={{
          id: '70968caa-f426-4e86-8968-a900101ccc09',
          name: 'John Doe',
          email: 'john@example.com',
        }}
        room={{
          id: 'ff6c2d19-f651-46f8-ad09-b638e852ddb2',
          hotelId: 'f9b2019d-3ba9-499e-8774-04593ac0e1da',
          name: 'Deluxe Room',
          price: 500,
          adultCount: 2,
          roomCount: 1,
          image:
            'https://res.cloudinary.com/sangamjone/image/upload/v1725603430/Img/wirewings/AoneHotel/image_3_owa0wx.png',
        }}
        startDate='2024-09-20'
        endDate='2024-09-25'
      />
    </>
  );
};

export default BookingCard;
