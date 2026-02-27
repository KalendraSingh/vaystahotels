import react, { lazy, Suspense, useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { HeaderFooterContext } from './Context/HeaderFooter';
//public routes
import TopHeader from './components/common/Header/TopHeader';
import Header from './components/common/Header/Header';
import Footer from './components/common/Footer/Footer';
import NotFound from './components/NotFound/NotFound';
import HotelList from './pages/HotelList/HotelList';
import Home from './pages/Home/Index';
import HotelDetails from './pages/HotelDetailed/HotelDetailed';
//const HotelDetails = lazy(() => import('./pages/HotelDetailed/HotelDetails'));
import Contact from './pages/Contact/Contact';
//import About from './pages/About/About';
import AllCities from './pages/AllCities/AllCities';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
//Customer routes
import Login from './pages/Customer/Login/Login';
import Signup from './pages/Customer/Signup/Signup';
import ForgotPasssword from './components/ForgotPassword/ResetPassword';
import NewPassword from './components/ForgotPassword/NewPassword';
import UserPersist from './pages/Customer/Login/UserPersist';
import UserRequireAuth from './pages/Customer/Login/UserRequireAuth';
import Profile from './pages/Customer/Profile/Profile';
import MyBookings from './pages/Customer/MyBooking/BookingsPage';
import BookingDetails from './pages/Customer/BookingDetails/BookingDetails';
import Dashboard from './pages/Customer/Dashboard/Index';
import EmailVerification from './pages/Customer/EmailVerification/EmailVerification';
import Checkout from './pages/Checkout/Checkout';
import BookingConfirmation from './pages/Customer/ConfirmBooking/ConfirmBooking';

//Admin routes
import AdminLogin from './pages/Admin/Login/Login';
import AdminPersist from './pages/Admin/Login/AdminPersist';
import AdminRequireAuth from './pages/Admin/Login/AdminRequireAuth';
import AdminMainContent from './pages/Admin/Dashboard/MainContent';
import AdminDashboard from './pages/Admin/Dashboard/Index';
import AdminProfile from './pages/Admin/Profile/Profile';
import Customers from './pages/Admin/Customers/Customers';
import Vendors from './pages/Admin/Vendors/Vendors';
import HotelManagement from './pages/Admin/HotelManagement/AllHotel';
import Payments from './pages/Admin/Payments/Payments';

//Vendor routes
import CustomerBookingTesting from './pages/CustomerBookingTesting/BookingCard';
import AllHotel from './pages/Vendor/HotelManagement/AllHotel';
import VendorLogin from './pages/Vendor/Login/Login';
import VendorSignup from './pages/Vendor/Signup/Singnup';
import VendorResetPassword from './pages/Vendor/ForgotPassword/ResetPassword';
import VendorNewPassword from './pages/Vendor/ForgotPassword/NewPassword';
import VendorEmailVerification from './pages/Vendor/EmailVerification/EmailVerification';
import VendorDashboard from './pages/Vendor/Dashboard/Index';
import MainContent from './pages/Vendor/Dashboard/MainContent';
import VendorProfile from './pages/Vendor/Profile/Profile';
import VendorAddHotel from './pages/Vendor/AddHotel/AddNewHotel';
import VendorAddRoom from './pages/Vendor/AddRoom/AddNewRoom';
import VendorPromotion from './pages/Vendor/Promotion/Promotion';
import VendorRevenue from './pages/Vendor/Revenue/RevenueOverview';
import VendorRating from './pages/Vendor/RatingReview/RatingReview';
import VendorProperty from './pages/Vendor/HotelManagement/AllHotel';
import CategoryDetailes from './pages/Vendor/HotelManagement/CategoryDetails';
import VendorPolicy from './pages/Vendor/Policy/Policy';
import VendorHotelImages from './pages/Vendor/AddHotel/AddHotelImages';
import VendorRoomImages from './pages/Vendor/AddRoom/AddRoomImages';
import VendorPersist from './pages/Vendor/Login/VendorPersist';
import VendorRequireAuth from './pages/Vendor/Login/VendorRequireAuth';
import Faq from './pages/Faq/Faq';
import VendorTransactions from './pages/Vendor/Transactions/VendorTransactions';
import Kycform from './pages/Vendor/KycForm/KycForm';
import Bookings from './pages/Vendor/Bookings/Bookings';
import ManagePermission from './pages/Vendor/ManagePermission/ManagePermission';
import DataLoading from './components/DataLoading/DataLoading';
import AddStaff from './pages/Admin/Staff/AddStaff';
import CreateRole from './pages/Admin/Role/CreateRole';
import ManagePermissions from './pages/Admin/ManagePermissions/ManagePermissions';
import ManageStaff from './pages/Admin/Staff/ManageStaff';
import BookingConfirmationAtHotel from './pages/Customer/ConfirmBooking/ConfirmBookingAtHotel';
import AdminBookings from './pages/Admin/Bookings/Bookings';
import AdminBookingDetails from './pages/Admin/Bookings/BookinDetails';
import VendorAddStaff from './pages/Vendor/Staff/VendorAddStaff';
import VendorManageStaff from './pages/Vendor/Staff/VendorManageStaff';


// new added pages
import MobileNav from "./pages/Home/MobileNav";
import Favorites from './pages/Home/Favorites';
import VenderHeader from './pages/Home/VenderHeader';
function App() {
  const { isHeader, isFooter } = useContext(HeaderFooterContext);
  return (
    <>
      {/* {isHeader && <Header />} */}
      
      <Routes>
       
        <Route path='/contact' element={<Contact />} />
        {/* <Route path='/about' element={<About />} /> */}
        <Route path='/policy' element={<PrivacyPolicy />} />
        <Route path='/faq' element={<Faq />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/forgot-password' element={<ForgotPasssword />} />
    
        <Route
          path='/customer-forgot-password/:token'
          element={<NewPassword />}
        />

        <Route path='' element={<UserPersist />}>
          <Route path='/' element={<Home />} />
          <Route path='/allCities' element={<AllCities />} />
          <Route path='/verify-email/:id' element={<EmailVerification />} />
          <Route path='/payment' element={<CustomerBookingTesting />} />
          <Route path='/hotels' element={<HotelList />} />
          <Route path='/hotels-in/:city' element={<HotelList />} />

          <Route
            path='/hotelDetailed/:hotelId'
            element={
              <Suspense fallback={<DataLoading />}>
                <HotelDetails />
              </Suspense>
            }
          />

          <Route path='' element={<UserRequireAuth />}>
            <Route path='/checkout' element={<Checkout />} />
            <Route
              path='/checkout/booking-confirm'
              element={<BookingConfirmation />}
            />
            <Route
              path='/checkout/booking-confirm/atHotel'
              element={<BookingConfirmationAtHotel />}
            />
            <Route element={<Dashboard />}>
              <Route path='/customer-profile' element={<Profile />} />
              <Route path='/my-booking' element={<MyBookings />} />
              <Route path='/favorites' element={<Favorites />} />
              <Route path='/booking-details/:id' element={<BookingDetails />} />
            </Route>
          </Route>
        </Route>
        <Route
          path='/verify-vendor-email/:id'
          element={<VendorEmailVerification />}
        />
        <Route path='/vendor-login' element={<VendorLogin />} />
        <Route path='/vendor-signup' element={<VendorSignup />} />
        <Route
          path='/vendor-new-password/:token'
          element={<VendorNewPassword />}
        />
        <Route
          path='/vendor-forgot-password'
          element={<VendorResetPassword />}
        />

        <Route path='' element={<VendorPersist />}>
          <Route path='' element={<VendorRequireAuth />}>
            <Route path='/vendor-dashboard' element={<VendorDashboard />}>
              <Route path='/vendor-dashboard' element={<MainContent />} />
              <Route
                path='/vendor-dashboard/profile'
                element={<VendorProfile />}
              />
              <Route
                path='/vendor-dashboard/addHotel'
                element={<VendorAddHotel />}
              />
              <Route
                path='/vendor-dashboard/images'
                element={<VendorHotelImages />}
              />
              <Route
                path='/vendor-dashboard/addRoom'
                element={<VendorAddRoom />}
              />
              <Route path='/vendor-dashboard/kycform' element={<Kycform />} />

              <Route
                path='/vendor-dashboard/addRoom/images'
                element={<VendorRoomImages />}
              />

              <Route
                path='/vendor-dashboard/policy'
                element={<VendorPolicy />}
              />
              <Route
                path='/vendor-dashboard/manage-hotels'
                element={<AllHotel />}
              />
              <Route
                path='/vendor-dashboard/manage-hotels/category/:id'
                element={<CategoryDetailes />}
              />

              <Route
                path='/vendor-dashboard/transactions'
                element={<VendorTransactions />}
              />

              <Route
                path='/vendor-dashboard/promotion'
                element={<VendorPromotion />}
              />
              <Route
                path='/vendor-dashboard/Revenue'
                element={<VendorRevenue />}
              />
              <Route
                path='/vendor-dashboard/ratingReview'
                element={<VendorRating />}
              />
              <Route
                path='/vendor-dashboard/manageProperty'
                element={<VendorProperty />}
              />
              <Route
                path='/vendor-dashboard/add-staff'
                element={<VendorAddStaff />}
              />
              <Route
                path='/vendor-dashboard/manage-staff'
                element={<VendorManageStaff />}
              />
              <Route
                path='/vendor-dashboard/manage-permission'
                element={<ManagePermission />}
              />
              <Route path='/vendor-dashboard/bookings' element={<Bookings />} />
              <Route
                path='/vendor-dashboard/bookings/booking-details/:id'
                element={<BookingDetails />}
              />
            </Route>
          </Route>
        </Route>

        <Route path='/v-admin' element={<AdminLogin />} />
        {/* <Route path='/admin-dashboard' element={<VendorDashboard />}> */}
        <Route path='' element={<AdminPersist />}>
          <Route path='' element={<AdminRequireAuth />}>
            <Route path='/admin-dashboard' element={<AdminDashboard />}>
              <Route index element={<AdminMainContent />} />
              <Route
                path='/admin-dashboard/profile'
                element={<AdminProfile />}
              />
              <Route path='/admin-dashboard/addStaff' element={<AddStaff />} />
              <Route
                path='/admin-dashboard/createRole'
                element={<CreateRole />}
              />
              <Route
                path='/admin-dashboard/managePermissions'
                element={<ManagePermissions />}
              />
              <Route
                path='/admin-dashboard/manageStaff'
                element={<ManageStaff />}
              />
              <Route
                path='/admin-dashboard/customers'
                element={<Customers />}
              />
              <Route path='/admin-dashboard/vendors' element={<Vendors />} />
              <Route
                path='/admin-dashboard/hotels'
                element={<HotelManagement />}
              />
              <Route path='/admin-dashboard/payments' element={<Payments />} />
              <Route
                path='/admin-dashboard/bookings'
                element={<AdminBookings />}
              />
              <Route
                path='/admin-dashboard/bookingDetails/:bookingId'
                element={<AdminBookingDetails />}
              />
              <Route
                path='/admin-dashboard/manage-hotels'
                element={<HotelManagement />}
              />
              <Route
                path='/admin-dashboard/Revenue'
                element={<VendorRevenue />}
              />
            </Route>
          </Route>
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
      {/* Mobile Bottom Navigation - Always Visible */}
   
        <MobileNav />
      {isFooter && <Footer />}
    </>
  );
}

export default App;
