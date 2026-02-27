import prisma from '../../../config/db.js';
export const addBankKYC = async (kycData) => {
  console.log(kycData);
  const {
    firstName,
    lastName,
    fatherFirstName,
    fatherLastName,
    maritalStatus,
    gender,
    dateOfBirth,
    nationality,
    email,
    phoneNumber,
    city,
    street,
    street2,
    state,
    postalCode,
    country,
    bankName,
    branchName,
    accountNumber,
    ifscCode,
    accountHolderName,
    pancardNumber,
    gstNumber,
    taxResidency,
    aadharNumber,
    passportNumber,
    drivingLicense,
    pancardDocument,
    aadharDocuments,
    gstDocument,
    signature,
    declarationFirstName,
    declarationLastName,
    vendorId,
  } = kycData;

  // Validate required fields (if needed here)
  const requiredFields = [
    firstName,
    lastName,
    fatherFirstName,
    fatherLastName,
    maritalStatus,
    gender,
    dateOfBirth,
    nationality,
    email,
    phoneNumber,
    street,
    city,
    state,
    postalCode,
    country,
    bankName,
    branchName,
    accountNumber,
    ifscCode,
    accountHolderName,
    pancardNumber,
    declarationFirstName,
    declarationLastName,
  ];

  if (requiredFields.some((field) => !field)) {
    return {
      rdata: null,
      rerror: {
        status: 400,
        message: 'All required fields must be provided!',
      },
    };
  }

  // Check for existing KYC entry
  const existingKYC = await prisma.bankKYC.findFirst({
    where: {
      OR: [{ email }, { phoneNumber }],
    },
  });

  if (existingKYC) {
    return {
      rdata: null,
      rerror: {
        status: 409,
        message: 'KYC entry with this email or phone number already exists!',
      },
    };
  }

  // Create new Bank KYC entry
  try {
    const newKYC = await prisma.bankKYC.create({
      data: {
        firstName,
        lastName,
        fatherFirstName,
        fatherLastName,
        maritalStatus,
        gender,
        dateOfBirth: new Date(dateOfBirth),
        nationality,
        email,
        phoneNumber,
        addressStreet: street,
        addressStreet2: street2,
        city,
        state,
        postalCode,
        country,
        bankName,
        branchName,
        accountNumber,
        ifscCode,
        accountHolderName,
        pancardNumber,
        gstNumber,
        taxResidency,
        aadharNumber,
        passportNumber,
        drivingLicense,
        pancardDocument,
        aadharDocuments,
        gstDocument,
        signature,
        declarationFirstName,
        declarationLastName,
        vendorId,
      },
    });

    return { rdata: newKYC, rerror: null };
  } catch (error) {
    console.error('Error in creating Bank KYC:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

export const getBankKYCById = async (id) => {
  try {
    // Retrieve KYC by ID
    const kycData = await prisma.bankKYC.findUnique({
      where: { id },
    });

    return { rdata: kycData, rerror: null };
  } catch (error) {
    console.error('Error in retrieving Bank KYC by ID:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};
export const getBankKYCByVendor = async (vendorId) => {
  try {
    // Retrieve KYC records by vendor ID
    const kycData = await prisma.bankKYC.findMany({
      where: { vendorId },
    });

    return { rdata: kycData, rerror: null };
  } catch (error) {
    console.error('Error in retrieving Bank KYC by vendor:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};
export const deleteBankKYC = async (id) => {
  try {
    // Delete KYC by ID
    await prisma.bankKYC.delete({
      where: { id },
    });

    return { rdata: null, rerror: null };
  } catch (error) {
    console.error('Error in deleting Bank KYC:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};
