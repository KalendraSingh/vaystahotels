import React, { useEffect, useState } from "react";
import { LuUser } from "react-icons/lu";
import { useStore } from "react-redux";
import { IoCloseCircle } from "react-icons/io5";
import { notification } from "antd";
import { AiOutlineDelete } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../Hooks/useAuth";
import {
  addRoomToCart,
  removeRoomToCart,
  getRoomToCart,
  decreaseRoomToCart,
  increaseRoomToCart,
} from "../../../api/Customer/cartApi";

import ButtonSpinner from "../../components/ButtonSpinner/ButtonSpinner";
import {
  setBookingDetails,
  updateRoomSelections,
  resetBookingDetails,
} from "../../Features/Booking/BookingSlice";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlinePersonOutline } from "react-icons/md";
import { Bed, Minus, Plus, Square, Users } from "lucide-react";

function RoomAmenity({ icon, text }) {
  return (
    <div className="flex gap-4 items-center  first:mt-0 ">
      <img src={icon} alt={text} className=" w-5 aspect-square " />
      <div className="mr-2 w-6">{text}</div>
    </div>
  );
}

function RoomDetails({ RoomDetails, fetchCartDetailes }) {
  const navigate = useNavigate();
  const {
    id,
    category,
    categoryImage,
    amenities,
    rooms,
    discountedPrice,
    discount,
    description,
    bedType,
    roomSize,
    perGuestPrice,
    price,
    adultCount,
  } = RoomDetails;

  console.log("RoomDetails", RoomDetails);

  // console.log("RoomDetails", RoomDetails);

  const [guest, setGuestCount] = useState(1);
  const [room, setRoomCount] = useState(1);
  const [cartData, setCartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { hotelId } = useParams();
  const { auth } = useAuth();
  const query = new URLSearchParams(window.location.search);
  useEffect(() => {
    // fetchCartDetailes();
    fetchCartData();
  }, [query.get("startDate"), query.get("endDate"), query.get("guests")]);

  const searchDetailes = useSelector((state) => state.searchDetailes);

  const dispatch = useDispatch();

  const customerId = auth.data && auth.data.id;

  const {
    amountWithGst,
    createdAt,
    endDate,
    nights,
    payAmount,
    roomSelections,
    startDate,
    totalAmount,
    totalDiscount,
    updatedAt,
  } = cartData || {};

  console.log("cartData", cartData);

  useEffect(() => {
    const counts =
      roomSelections &&
      roomSelections.map(({ roomCount, adultCount, roomCategoryId }) => ({
        cartRooms: roomCount,
        cartAdult: adultCount,
        roomCategoryId,
      }));

    const matchingCount =
      counts && counts.find((countItem) => countItem.roomCategoryId === id);

    if (matchingCount) {
      setRoomCount(matchingCount.cartRooms);
      setGuestCount(matchingCount.cartAdult);
    }
  }, [roomSelections, id]);

  const handleAddToCart = async () => {
    if (!customerId) {
      navigate("/login", { state: { from: `/hotelDetailed/${hotelId}` } });
    }
    setIsLoading(true);
    const cartData = {
      hotelId: hotelId,
      customerId: customerId,
      roomCategoryId: id,
      roomCount: parseInt(room),
      adultCount: parseInt(guest),
      startDate: searchDetailes.startDate,
      endDate: searchDetailes.endDate,
    };
    try {
      const res = await addRoomToCart(cartData);
      if (res.status === 201) {
        setIsLoading(false);
        fetchCartData();
        fetchCartDetailes();
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleIncreaseGuestCount = async () => {
    const cartData = {
      hotelId: hotelId,
      customerId: customerId,
      roomCategoryId: id,
      adultCount: 1,
    };

    try {
      const res = await increaseRoomToCart(cartData);
      if (res.status === 200) {
        fetchCartData();
        fetchCartDetailes();
      } else {
        notification.error({
          message: res.data.message,
        });
      }
    } catch (error) {
      notification.error({
        message: error,
      });
      console.log(error);
    }
  };

  const handleDecreaseGuestCount = async () => {
    const cartData = {
      hotelId: hotelId,
      customerId: customerId,
      roomCategoryId: id,
      adultCount: 1,
    };

    try {
      const res = await decreaseRoomToCart(cartData);
      if (res.status === 200) {
        fetchCartData();
        fetchCartDetailes();
      } else {
        notification.error({
          message: res.data.message,
        });
      }
    } catch (error) {
      notification.error({
        message: error.response.data.rerror.message,
      });
      console.log(error.response.data.rerror.message);
    }
  };

  const handleIncreaseRoomCount = async () => {
    const cartData = {
      hotelId: hotelId,
      customerId: customerId,
      roomCategoryId: id,
      roomCount: 1,
    };

    try {
      const res = await increaseRoomToCart(cartData);
      if (res.status === 200) {
        fetchCartData();
        fetchCartDetailes();
      } else {
        notification.error({
          message: res.data.message,
        });
      }
    } catch (error) {
      const errorr = error.response.data.rerror.message;
      notification.warning({
        message: errorr,
      });
    }
  };
  const handleDecreaseRoomCount = async () => {
    const cartData = {
      hotelId: hotelId,
      customerId: customerId,
      roomCategoryId: id,
      roomCount: 1,
    };

    try {
      const res = await decreaseRoomToCart(cartData);
      if (res.status === 200) {
        fetchCartData();
        fetchCartDetailes();
      }
    } catch (error) {
      notification.error({
        message: error.response.data.rerror.message,
      });
    }
  };

  const handleRemoveToCart = async () => {
    const cartData = {
      hotelId: hotelId,
      customerId: customerId,
      roomCategoryId: id,
    };

    setIsLoading(true);

    try {
      const res = await removeRoomToCart(cartData);
      if (res.status === 200) {
        setIsLoading(false);
        fetchCartData();
        fetchCartDetailes();
        setGuestCount(1);
        setRoomCount(1);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCartData();
    fetchCartDetailes();
  }, [room, guest]);

  const fetchCartData = async () => {
    if (!customerId) return;
    const cartData = {
      hotelId: hotelId,
      customerId: customerId,
    };

    try {
      const res = await getRoomToCart(cartData);
      if (res.status === 200) {
        setCartData(res.data.data);
        fetchCartDetailes();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isInCart =
    cartData &&
    cartData.roomSelections.some((room) => room.roomCategoryId == id);
  const isSelected =
    cartData &&
    roomSelections &&
    roomSelections.find((room) => room.roomCategoryId == id);

  return (
    <div className="group relative">
      {/* Premium badge for high-end rooms */}
      {discountedPrice > 5000 && (
        <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-purple-600 to-purple-800 text-[#7a6c00] px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
          <Star className="w-3 h-3 inline mr-1" />
          Premium
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:border-amber-300">
        {/* Mobile Layout */}
        <div className="block md:hidden">
          {/* Image Section - Mobile */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={categoryImage[0]}
              alt={category}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Overlay price badge */}
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
              <p className="text-2xl font-bold text-[#7a6c00]">
                ₹{discountedPrice.toLocaleString()}
              </p>
              <p className="text-xs text-[#B68F00]
              ">per night</p>
            </div>
          </div>

          {/* Content Section - Mobile */}
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-[#B68F00] mb-3 group-hover:text-amber-700 transition-colors">
                {category}
              </h3>

              {/* Room specs */}
              <div className="flex flex-wrap gap-4 text-sm text-[#B68F00]">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                  <Users className="w-4 h-4 text-[#B68F00]" />
                  <span>{adultCount} Guests</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                  <Bed className="w-4 h-4 text-[#B68F00]" />
                  <span>{bedType}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                  <Square className="w-4 h-4 text-[#B68F00]" />
                  <span>{roomSize} sqft</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-6">
              <h4 className="font-semibold text-[#B68F00] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                Room Amenities
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {amenities?.slice(0, 6).map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-[#B68F00] py-1"
                  >
                    <img
                      src={amenity.icon}
                      className="w-4 h-4 opacity-70"
                      alt=""
                    />
                    <span className="truncate">{amenity.name}</span>
                  </div>
                ))}
                {amenities?.length > 6 && (
                  <div className="text-xs text-[#B68F00] font-medium col-span-full">
                    +{amenities.length - 6} more amenities
                  </div>
                )}
              </div>
            </div>

            {/* Room & Guest Selection - Mobile */}
            {isSelected && (
              <div className="mb-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                <h4 className="font-semibold text-[#B68F00] mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  Customize Your Stay
                </h4>

                <div className="space-y-3">
                  {/* Rooms Counter */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Bed className="w-4 h-4 text-[#B68F00]" />
                      </div>
                      <span className="font-medium text-[#B68F00]">Rooms</span>
                    </div>
                    <div className="flex items-center bg-white border border-amber-200 rounded-lg shadow-sm">
                      <button
                        disabled={room === 1}
                        onClick={handleDecreaseRoomCount}
                        className="p-2 hover:bg-amber-50 transition-colors rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4 text-[#B68F00]" />
                      </button>
                      <span className="w-12 text-center font-semibold text-[#B68F00]">
                        {room}
                      </span>
                      <button
                        disabled={room === rooms.length}
                        onClick={handleIncreaseRoomCount}
                        className="p-2 hover:bg-amber-50 transition-colors rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4 text-[#B68F00]" />
                      </button>
                    </div>
                  </div>

                  {/* Guests Counter */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-[#B68F00]" />
                      </div>
                      <span className="font-medium text-[#B68F00]">Adults</span>
                    </div>
                    <div className="flex items-center bg-white border border-amber-200 rounded-lg shadow-sm">
                      <button
                        disabled={guest === 1}
                        onClick={handleDecreaseGuestCount}
                        className="p-2 hover:bg-amber-50 transition-colors rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4 text-[#B68F00]" />
                      </button>
                      <span className="w-12 text-center font-semibold text-[#B68F00]">
                        {guest}
                      </span>
                      <button
                        disabled={guest === room * adultCount}
                        onClick={handleIncreaseGuestCount}
                        className="p-2 hover:bg-amber-50 transition-colors rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4 text-[#B68F00]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button - Mobile */}
            <div className="pt-4 border-t border-gray-100">
              {isInCart ? (
                <button
                  onClick={handleRemoveToCart}
                  className="w-full bg-gradient-to-tr from-[#fff9e6] to-[#fff3cc]
 hover:from-[#D4AF37] hover:to-[#FFD700] text-[#B68F00] hover:text-[#7a6c00] font-semibold py-3 px-6 border border-[#E5C100] rounded-md transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                   
                  Remove from Selection
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-[#FFD700] to-[#E5C100]
  hover:brightness-110  text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl border border-[#E5C100]"
                >
                  Select This Room
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Desktop/Tablet Layout */}
        <div className="hidden md:grid md:grid-cols-5 lg:grid-cols-3">
          {/* Image Section - Desktop */}
          <div className="md:col-span-2 lg:col-span-1 relative h-full min-h-[400px]">
            <img
              src={categoryImage[0]}
              alt={category}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Overlay price badge */}
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
              <p className="text-2xl font-bold text-[#B68F00]">
                ₹{discountedPrice.toLocaleString()}
              </p>
              <p className="text-xs text-[#B68F00]">per night</p>
            </div>
          </div>

          {/* Content Section - Desktop */}
          <div className="md:col-span-3 lg:col-span-2 p-6 lg:p-8 flex flex-col">
            {/* Header */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-[#B68F00] mb-3 group-hover:text-amber-700 transition-colors">
                {category}
              </h3>

              {/* Room specs */}
              <div className="flex flex-wrap gap-4 text-sm text-[#B68F00]">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                  <Users className="w-4 h-4 text-[#B68F00]" />
                  <span>{adultCount} Guests</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                  <Bed className="w-4 h-4 text-[#B68F00]" />
                  <span>{bedType}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                  <Square className="w-4 h-4 text-[#B68F00]" />
                  <span>{roomSize} sqft</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-6 flex-grow">
              <h4 className="font-semibold text-[#B68F00] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                Room Amenities
              </h4>
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
                {amenities?.slice(0, 6).map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-[#B68F00] py-1"
                  >
                    <img
                      src={amenity.icon}
                      className="w-4 h-4 opacity-70"
                      alt=""
                    />
                    <span className="truncate">{amenity.name}</span>
                  </div>
                ))}
                {amenities?.length > 6 && (
                  <div className="text-xs text-[#B68F00] font-medium col-span-full">
                    +{amenities.length - 6} more amenities
                  </div>
                )}
              </div>
            </div>

            {/* Room & Guest Selection - Desktop */}
            {isSelected && (
              <div className="mb-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                <h4 className="font-semibold text-[#B68F00] mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  Customize Your Stay
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  {/* Rooms Counter */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Bed className="w-3 h-3 text-[#B68F00]" />
                      </div>
                      <span className="font-medium text-[#B68F00] text-sm">
                        Rooms
                      </span>
                    </div>
                    <div className="flex items-center bg-white border border-amber-200 rounded-lg shadow-sm">
                      <button
                        disabled={room === 1}
                        onClick={handleDecreaseRoomCount}
                        className="p-2 hover:bg-amber-50 transition-colors rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4 text-[#B68F00]" />
                      </button>
                      <span className="w-12 text-center font-semibold text-[#B68F00]">
                        {room}
                      </span>
                      <button
                        disabled={room === rooms.length}
                        onClick={handleIncreaseRoomCount}
                        className="p-2 hover:bg-amber-50 transition-colors rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4 text-[#B68F00]" />
                      </button>
                    </div>
                  </div>

                  {/* Guests Counter */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Users className="w-3 h-3 text-[#B68F00]" />
                      </div>
                      <span className="font-medium text-[#B68F00] text-sm">
                        Adults
                      </span>
                    </div>
                    <div className="flex items-center bg-white border border-amber-200 rounded-lg shadow-sm">
                      <button
                        disabled={guest === 1}
                        onClick={handleDecreaseGuestCount}
                        className="p-2 hover:bg-amber-50 transition-colors rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4 text-[#B68F00]" />
                      </button>
                      <span className="w-12 text-center font-semibold text-[#B68F00]">
                        {guest}
                      </span>
                      <button
                        disabled={guest === room * adultCount}
                        onClick={handleIncreaseGuestCount}
                        className="p-2 hover:bg-amber-50 transition-colors rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4 text-[#B68F00]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button - Desktop */}
            <div className="pt-4 border-t border-gray-100 mt-auto">
              {isInCart ? (
                <button
                  onClick={handleRemoveToCart}
                  className="w-full  bg-gradient-to-tr from-[#fff9e6] to-[#fff3cc]
 hover:from-[#D4AF37] hover:to-[#FFD700] text-[#B68F00] hover:text-[#7a6c00] font-semibold py-3 px-6 border border-[#E5C100] rounded-md transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  Remove from Selection
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="w-full  bg-gradient-to-r from-[#FFD700] to-[#E5C100]
  hover:brightness-110  text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl border border-[#E5C100]"
                >
                  Select This Room
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomDetails;
