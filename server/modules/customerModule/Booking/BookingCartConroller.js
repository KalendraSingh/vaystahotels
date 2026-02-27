import {
  addToCart,
  decreaseRoomAndAdultCount,
  viewCart,
  removeFromCart,
  calculateCartAmounts,
  IncreaseRoomAndAdultCount,
} from '../../booking/BookingCartService.js';

export const addToCartController = async (req, res) => {
  const {
    customerId,
    hotelId,
    startDate,
    endDate,
    roomCategoryId,
    roomCount,
    adultCount,
  } = req.body;
  if (
    !customerId ||
    !hotelId ||
    !startDate ||
    !endDate ||
    !roomCategoryId ||
    !roomCount ||
    !adultCount
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { rdata, rerror } = await addToCart({
      customerId,
      hotelId,
      startDate,
      endDate,
      roomCategoryId,
      roomCount,
      adultCount,
    });

    if (rerror) {
      return res.status(500).json({ error: rerror });
    }
    res.status(201).json({ message: 'Cart updated successfully', data: rdata });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const decreaseCartController = async (req, res) => {
  const { customerId, hotelId, roomCategoryId, roomCount, adultCount } =
    req.body;

  if (!customerId || !hotelId || !roomCategoryId) {
    return res
      .status(400)
      .json({ rerror: { status: 400, message: 'Missing required fields' } });
  }

  try {
    const result = await decreaseRoomAndAdultCount({
      customerId,
      hotelId,
      roomCategoryId,
      roomCountToRemove: roomCount || 0,
      adultCountToRemove: adultCount || 0,
    });

    if (result.rerror) {
      return res.status(result.rerror.status).json({ rerror: result.rerror });
    }

    res
      .status(200)
      .json({ message: 'Cart updated successfully', data: result.rdata });
  } catch (error) {
    console.error('Error in decreaseCartController:', error);
    res
      .status(500)
      .json({ rerror: { status: 500, message: 'Internal server error' } });
  }
};

export const increaseCartController = async (req, res) => {
  const { customerId, hotelId, roomCategoryId, roomCount, adultCount } =
    req.body;

  console.log(req.body);

  if (!customerId || !hotelId || !roomCategoryId) {
    return res
      .status(400)
      .json({ rerror: { status: 400, message: 'Missing required fields' } });
  }

  try {
    const result = await IncreaseRoomAndAdultCount({
      customerId,
      hotelId,
      roomCategoryId,
      roomCountToAdd: roomCount || 0,
      adultCountToAdd: adultCount || 0,
    });

    if (result.rerror) {
      return res.status(result.rerror.status).json({ rerror: result.rerror });
    }

    res
      .status(200)
      .json({ message: 'Cart updated successfully', data: result.rdata });
  } catch (error) {
    console.error('Error in increaseCartController:', error);
    res
      .status(500)
      .json({ rerror: { status: 500, message: 'Internal server error' } });
  }
};

export const removeFromCartController = async (req, res) => {
  const { customerId, hotelId, roomCategoryId } = req.body;

  if (!customerId || !hotelId || !roomCategoryId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { rdata, rerror } = await removeFromCart({
      customerId,
      hotelId,
      roomCategoryId,
    });

    if (rerror) {
      return res.status(500).json({ rerror });
    }

    res.status(200).json({
      message: 'Room removed from cart successfully',
      data: rdata,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const viewCartController = async (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }

  try {
    const result = await viewCart({ customerId });

    if (result.error) {
      return res.status(404).json({ error: result.error });
    }

    res.status(200).json({ data: result.data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const calculateCartAmountsController = async (req, res) => {
  const { cartItemId } = req.body;

  if (!cartItemId) {
    return res.status(400).json({ error: 'Missing cartItemId' });
  }

  try {
    const result = await calculateCartAmounts(cartItemId);

    if (result.error) {
      return res.status(500).json({ error: result.error });
    }

    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
