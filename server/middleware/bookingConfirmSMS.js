import axios from 'axios';
const sendSMS = async (phone, message) => {
  const API_KEY = process.env.OTP_API_KEY;
  const SENDER_ID = process.env.SMS_SENDER_ID;
  const URL = `https://msgn.mtalkz.com/api`;
  try {
    const response = await axios.get(URL, {
      params: {
        apikey: API_KEY,
        senderid: SENDER_ID,
        number: phone,
        message: message,
        format: 'json',
      },
    });
    return response.data; // Check the response status
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};
export default sendSMS;
