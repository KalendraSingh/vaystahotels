import React, { useState, useEffect, useRef } from "react";
import {
  getUserProfile,
  updateUserProfile,
} from "../../../../api/Customer/profileApi";
import { useAuth } from "../../../Hooks/useAuth";

import { FiUpload, FiX } from "react-icons/fi";
import { notification } from "antd";

function Profile() {
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("...............");
  const [email, setEmail] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    "https://res.cloudinary.com/sangamjone/image/upload/v1729827816/Img/wirewings/AoneHotel/3135715_r2qcdr.png"
  );
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const [toggleOptions, setToggleOptions] = useState([
    { label: "Email me for any Queries", checked: true },
    { label: "Notify me for any important updates", checked: false },
  ]);

  const { auth } = useAuth();

  const customerId = auth.data && auth.data.id;

  const fetchCustomerData = async () => {
    try {
      const res = await getUserProfile(customerId);
      if (res.status === 200) {
        setName(res.data.name);
        setEmail(res.data.email);
        setMobileNumber(res.data.phone);
        setPreviewUrl(res.data.profileImage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateCustomerProfile = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", mobileNumber);
    formData.append("profileImg", selectedImage);
    try {
      const res = await updateUserProfile(formData, customerId);
      if (res.status === 200) {
        notification.success({
          message: "Profile updated successfully",
        });
        fetchCustomerData();
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Error: In profile updating",
      });
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file (PNG, JPG, JPEG)");
        return;
      }

      if (file.size > maxSize) {
        setError("Image size should not exceed 5MB");
        return;
      }

      setSelectedImage(file);
      setError("");

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(
      "https://res.cloudinary.com/sangamjone/image/upload/v1729827816/Img/wirewings/AoneHotel/3135715_r2qcdr.png"
    );
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } };
      handleImageChange(fakeEvent);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const handleToggleChange = (index) => {
    const updatedOptions = [...toggleOptions];
    updatedOptions[index].checked = !updatedOptions[index].checked;
    setToggleOptions(updatedOptions);
  };

  const contactDetails = [
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/4b3adc8396f0d2349a4d7ef3c2c18b92dfbbf17f87886157703bc64162286385?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a",
      text: "+91 6307200050",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/1a11746ad4182d5a583c1fa6fb3c1decfd3879c3b67a26fc42a40d13ebf3c3fb?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a",
      text: "fgroupservicess.com",
    },
  ];

  const ContactInfo = ({ icon, text }) => (
    <div className="flex items-center gap-3">
      <div>
        <img
          loading="lazy"
          src={icon}
          alt=""
          className="object-contain shrink-0 my-auto aspect-square"
        />
      </div>
      <div className="basis-auto">{text}</div>
    </div>
  );

  return (
    <main className="flex flex-col rounded-none">
      <section className="flex flex-col gap-10 px-16 py-8 bg-white rounded-lg max-md:px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="flex flex-col items-center">
            <div className="max-w-md mx-auto p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Profile Image
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Upload a profile picture for your account
                  </p>
                </div>

                <div
                  className="relative w-48 h-48 mx-auto group"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={previewUrl}
                    alt="Profile preview"
                    className="w-full h-full object-cover rounded-full shadow-lg transition-all duration-300 border-4 border-white hover:brightness-90"
                  />
                  {selectedImage && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent file input trigger
                        handleRemoveImage();
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      aria-label="Remove image"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  )}

                  {/* Hidden file input for click-to-upload */}
                  <input
                    id="image-upload"
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                    aria-label="Upload profile image"
                  />

                  {/* Optional overlay on hover */}
                  <div className="absolute inset-0 rounded-full bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiUpload className="text-white w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Details Input Grid */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col">
              <label className="font-medium text-zinc-700" htmlFor="name">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                className="py-2 pl-4 mt-1.5 bg-white border border-zinc-300 rounded-md text-gray-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label
                className="font-medium text-zinc-700"
                htmlFor="mobileNumber"
              >
                Mobile Number
              </label>
              <input
                type="text"
                id="mobileNumber"
                className="py-2 pl-4 mt-1.5 bg-white border border-zinc-300 rounded-md text-gray-500"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-zinc-700" htmlFor="password">
                Password
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  id="password"
                  className="py-2 pl-4 mt-1.5 bg-white border border-zinc-300 rounded-md text-gray-500 flex-1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-zinc-700" htmlFor="email">
                Email Address
              </label>
              <input
                type="text"
                id="email"
                disabled={true}
                className="py-2 pl-4 mt-1.5 bg-white border border-zinc-300 rounded-md text-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              {/* Toggle Switches */}
              <div className="grid grid-cols-1 gap-5">
                {toggleOptions.map((option, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={option.checked}
                        onChange={() => handleToggleChange(index)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-yellow-400">
                        <div
                          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all ${
                            option.checked ? "translate-x-6" : ""
                          }`}
                        ></div>
                      </div>
                    </label>
                    <label className="text-sm text-gray-500">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              {/* Toggle Switches */}
              <div className="grid grid-cols-1  gap-5">
                <button
                  onClick={updateCustomerProfile}
                  className="cta py-2  rounded-md"
                >
                  Update Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="flex gap-5 grid grid-cols-1 md:grid-cols-2 mt-6 mb-4">
          <div className="flex flex-col font-medium rounded-none ">
            <div className="flex flex-col items-start px-9 py-5 w-full bg-white rounded-lg fill-white max-md:px-5 max-md:max-w-full">
              <header className="flex gap-4 w-full">
                <h2 className="grow text-xl text-zinc-700">
                  Account Verification
                </h2>
                <div className="flex gap-2 my-auto text-sm text-emerald-500 whitespace-nowrap">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/797e5eff490d227261a7b27c696d613d7a4ab4cc1d2422d1c5e57b5975c9b986?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a"
                    className="object-contain shrink-0 self-start aspect-square w-[19px]"
                    alt=""
                  />
                  <span>Verified</span>
                </div>
              </header>
              <p className="self-stretch mt-2.5 text-sm leading-5 text-gray-400 max-md:max-w-full">
                Your business is verified. Listing may be reviewed for quality
                and can take up to 3-5 business days to be published.
              </p>
              <a href="#" className="mt-2 text-sm text-sky-500">
                Learn More
              </a>
            </div>
          </div>

          {/* <div className='flex flex-col text-sm rounded-none'>
            <div className='flex flex-col items-start pt-5 pr-20 pb-8 pl-8 w-full bg-white rounded-lg fill-white max-md:px-5 max-md:max-w-full'>
              <h2 className='text-xl font-medium text-zinc-700'>
                Get in touch
              </h2>
              <p className='text-gray-400'>
                We'd love to hear from you, Here's how you can reach us...
              </p>
              <div className='flex gap-5 justify-between mt-4 max-w-full leading-8 text-zinc-700 '>
                {contactDetails.map((detail, index) => (
                  <ContactInfo
                    key={index}
                    icon={detail.icon}
                    text={detail.text}
                  />
                ))}
              </div>
            </div>
          </div> */}
        </div>
      </section>
    </main>
  );
}

export default Profile;
