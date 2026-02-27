export const checkRequiredFields = (body, requiredFields) => {
  const missingFields = requiredFields.filter((field) => !(field in body));
  if (missingFields.length > 0) {
    return {
      data: null,
      error: {
        message: 'Missing required fields',
        fields: missingFields,
      },
    };
  }
  return { data: body, error: null };
};
