import prisma from '../../config/db.js';

export const addToCart = async ({
  customerId,
  hotelId,
  roomCategoryId,
  roomCount,
  adultCount,
  startDate,
  endDate,
}) => {
  try {
    const calculateNights = (startDate, endDate) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return nights;
    };

    let existingCart = await prisma.cartItem.findFirst({
      where: { customerId },
      include: { roomSelections: true },
    });

    if (existingCart && existingCart.hotelId !== hotelId) {
      await prisma.cartItem.deleteMany({
        where: { customerId },
      });
      existingCart = null;
    }

    const nights = calculateNights(startDate, endDate);

    let cart;
    if (!existingCart) {
      cart = await prisma.cartItem.create({
        data: {
          customerId,
          hotelId,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          nights,
          totalAmount: 0,
          totalDiscount: 0,
          payAmount: 0,
          amountWithGst: 0,
        },
      });
    } else {
      cart = await prisma.cartItem.update({
        where: { id: existingCart.id },
        data: {
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          nights,
        },
      });
    }

    const roomCategory = await prisma.roomCategory.findUnique({
      where: { id: roomCategoryId },
      include: { rooms: true },
    });

    if (!roomCategory) {
      return {
        rdata: null,
        rerror: { status: 401, message: 'Invalid room category.' },
      };
    }

    if (roomCategory.hotelId !== hotelId) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: 'Room category does not belong to the selected hotel.',
        },
      };
    }

    const availableRooms = roomCategory.rooms.filter(
      (room) => room.isAvailable
    ).length;
    if (roomCount > availableRooms) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: `Only ${availableRooms} rooms available in this category.`,
        },
      };
    }

    if (adultCount < roomCount) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: `At least one adult is required per room. Please increase the number of adults.`,
        },
      };
    }

    if (adultCount > parseInt(roomCategory.adultCount) * roomCount) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: `Maximum ${roomCategory.adultCount} adults allowed per room.`,
        },
      };
    }

    const existingRoomSelection = await prisma.roomSelection.findFirst({
      where: { cartItemId: cart.id, roomCategoryId },
    });

    if (existingRoomSelection) {
      await prisma.roomSelection.update({
        where: { id: existingRoomSelection.id },
        data: {
          roomCount,
          adultCount,
        },
      });
    } else {
      await prisma.roomSelection.create({
        data: {
          cartItemId: cart.id,
          roomCategoryId,
          roomCount,
          adultCount,
          categoryName: roomCategory.category,
        },
      });
    }

    const updatedCart = await calculateCartAmounts(cart.id);

    return { rdata: updatedCart, rerror: null };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { data: null, error: 'Internal server error' };
  }
};

export const decreaseRoomAndAdultCount = async ({
  customerId,
  hotelId,
  roomCategoryId,
  roomCountToRemove,
  adultCountToRemove,
}) => {
  try {
    // Fetch the cart for the customer and hotel
    const cart = await prisma.cartItem.findFirst({
      where: { customerId, hotelId },
      include: { roomSelections: true },
    });

    if (!cart) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: 'No cart found for this customer and hotel.',
        },
      };
    }

    // Find the existing room selection in the cart
    const existingRoomSelection = await prisma.roomSelection.findFirst({
      where: { cartItemId: cart.id, roomCategoryId },
    });

    if (!existingRoomSelection) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: 'No room selection found for this category in the cart.',
        },
      };
    }

    // Fetch the room category to determine the max adult capacity per room
    const roomCategory = await prisma.roomCategory.findUnique({
      where: { id: roomCategoryId },
    });

    if (!roomCategory) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: 'Room category not found.',
        },
      };
    }

    // Calculate the new room and adult counts
    const newRoomCount = existingRoomSelection.roomCount - roomCountToRemove;
    const newAdultCount = existingRoomSelection.adultCount - adultCountToRemove;

    // Check if adults can fit in the reduced number of rooms
    const maxAdultsInNewRoomCount = roomCategory.adultCount * newRoomCount;

    if (newAdultCount < newRoomCount) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: 'Each room requires at least one adult.',
        },
      };
    }

    if (newAdultCount > maxAdultsInNewRoomCount) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: `Cannot decrease the room count. The current number of adults (${existingRoomSelection.adultCount}) will not fit in ${newRoomCount} rooms.`,
        },
      };
    }

    // Check if at least one adult remains after the reduction
    if (newAdultCount < 1) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message:
            'At least one adult is required. You cannot have zero adults.',
        },
      };
    }

    // If the room count goes to zero, delete the room selection
    if (newRoomCount <= 0) {
      await prisma.roomSelection.delete({
        where: { id: existingRoomSelection.id },
      });
    } else {
      // Otherwise, update the room and adult counts
      await prisma.roomSelection.update({
        where: { id: existingRoomSelection.id },
        data: {
          roomCount: newRoomCount,
          adultCount: newAdultCount,
        },
      });
    }

    // Check if any room selections remain, and delete the cart if empty
    const remainingRoomSelections = await prisma.roomSelection.findMany({
      where: { cartItemId: cart.id },
    });

    if (remainingRoomSelections.length === 0) {
      await prisma.cartItem.delete({
        where: { id: cart.id },
      });
      return {
        rdata: remainingRoomSelections,
        rerror: null,
        message: 'Cart is empty and has been deleted.',
      };
    }

    // Recalculate the cart after the update
    const updatedCart = await calculateCartAmounts(cart.id);

    return { rdata: updatedCart, rerror: null };
  } catch (error) {
    console.error('Error decreasing room and adult count:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error.',
      },
    };
  }
};

export const IncreaseRoomAndAdultCount = async ({
  customerId,
  hotelId,
  roomCategoryId,
  roomCountToAdd,
  adultCountToAdd,
}) => {
  try {
    // Fetch room category and its available rooms
    const roomCategory = await prisma.roomCategory.findUnique({
      where: { id: roomCategoryId },
      include: { rooms: true },
    });

    if (!roomCategory) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: 'Room category not found.',
        },
      };
    }

    // Calculate available rooms in the category
    const availableRooms = roomCategory.rooms.filter(
      (room) => room.isAvailable
    ).length;

    console.log('Available rooms:', availableRooms);

    // Fetch the customer's cart for the hotel
    const cart = await prisma.cartItem.findFirst({
      where: { customerId, hotelId },
      include: { roomSelections: true },
    });

    if (!cart) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: 'No cart found for this customer and hotel.',
        },
      };
    }

    // Find existing room selection in the cart
    const existingRoomSelection = await prisma.roomSelection.findFirst({
      where: { cartItemId: cart.id, roomCategoryId },
    });

    if (!existingRoomSelection) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: 'No room selection found for this category in the cart.',
        },
      };
    }

    // New room and adult counts after adding
    const newRoomCount = existingRoomSelection.roomCount + roomCountToAdd;
    const newAdultCount = existingRoomSelection.adultCount + adultCountToAdd;

    // Validate room availability
    if (newRoomCount > availableRooms) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: `Cannot add more than ${availableRooms} available rooms for this category.`,
        },
      };
    }

    // Validate that there's at least one adult for each room
    if (newAdultCount < newRoomCount) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: 'Each room requires at least one adult.',
        },
      };
    }

    // Validate adult count does not exceed capacity (max adults per room)
    const maxAllowedAdults = roomCategory.adultCount * newRoomCount;
    if (newAdultCount > maxAllowedAdults) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: `Cannot have more than ${roomCategory.adultCount} adults per room. Maximum allowed for ${newRoomCount} rooms is ${maxAllowedAdults} adults.`,
        },
      };
    }

    // Update the room selection with the new counts
    await prisma.roomSelection.update({
      where: { id: existingRoomSelection.id },
      data: {
        roomCount: newRoomCount,
        adultCount: newAdultCount,
      },
    });

    // Recalculate cart totals after update
    const updatedCart = await calculateCartAmounts(cart.id);

    return { rdata: updatedCart, rerror: null };
  } catch (error) {
    console.error('Error increasing room and adult count:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error.',
      },
    };
  }
};

export const removeFromCart = async ({
  customerId,
  hotelId,
  roomCategoryId,
}) => {
  try {
    const cart = await prisma.cartItem.findFirst({
      where: { customerId, hotelId },
      include: { roomSelections: true },
    });

    if (!cart) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: 'No cart found for this customer and hotel.',
        },
      };
    }

    const roomSelection = cart.roomSelections.find(
      (room) => room.roomCategoryId === roomCategoryId
    );

    if (!roomSelection) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: 'Room category not found in the cart.',
        },
      };
    }

    await prisma.roomSelection.delete({
      where: { id: roomSelection.id },
    });

    const remainingSelections = await prisma.roomSelection.findMany({
      where: { cartItemId: cart.id },
    });

    if (remainingSelections.length === 0) {
      await prisma.cartItem.delete({
        where: { id: cart.id },
      });

      return {
        rdata: null,
        rerror: null,
        message: 'Cart removed successfully.',
      };
    }
    const updatedCart = await calculateCartAmounts(cart.id);
    // const updatedCart = await prisma.cartItem.findUnique({
    //   where: { id: cart.id },
    //   include: { roomSelections: true },
    // });

    return {
      rdata: updatedCart,
      rerror: null,
      message: 'Room category removed successfully.',
    };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error.',
      },
    };
  }
};

export const calculateCartAmounts = async (cartItemId) => {
  const cart = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { roomSelections: true },
  });

  let totalAmount = 0;
  let totalDiscount = 0;

  for (const selection of cart.roomSelections) {
    const roomCategory = await prisma.roomCategory.findUnique({
      where: { id: selection.roomCategoryId },
    });

    const totalRoomCost =
      roomCategory.price * selection.roomCount * cart.nights;

    let guestCost = 0;
    // Calculate extra guest cost if adultCount per room is more than 2
    const extraGuests = selection.adultCount - selection.roomCount * 2; // Each room allows 2 adults by default

    if (extraGuests > 0) {
      guestCost = extraGuests * roomCategory.perGuestPrice * cart.nights;
    }

    console.log('guestCost:', guestCost);
    console.log('totalRoomCost:', totalRoomCost);

    totalAmount += totalRoomCost + guestCost;
    totalDiscount +=
      ((totalRoomCost + guestCost) * roomCategory.discount) / 100;

    console.log('Total amount:', totalAmount);
    console.log('Total discount:', totalDiscount);
    console.log('roomCategory.discount:', roomCategory.discount);
  }

  const amountWithGst =
    ((totalAmount - totalDiscount) * process.env.GST_PCT) / 100;

  const payAmount = totalAmount - totalDiscount + amountWithGst;
  const updatedCart = await prisma.cartItem.update({
    where: { id: cartItemId },
    data: {
      totalAmount,
      totalDiscount,
      payAmount,
      amountWithGst,
    },
    include: { roomSelections: true },
  });

  return updatedCart;
};

export const viewCart = async ({ customerId }) => {
  try {
    const cart = await prisma.cartItem.findFirst({
      where: { customerId },
      include: { roomSelections: true },
    });

    if (!cart) {
      return { data: null, rerror: { status: 404, message: 'Cart not found' } };
    }

    return { data: cart, error: null };
  } catch (error) {
    console.error('Error viewing cart:', error);
    return { data: null, error: 'Internal server error' };
  }
};
