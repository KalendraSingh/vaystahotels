import { axiosPrivate } from '../axios';

export const adminGetAllPayments = ({
  startDate,
  endDate,
  vendorName,
  status,
  maxAmount,
  sortBy,
  sortOrder,
  page,
  pageSize,
}) => {
  return axiosPrivate.get('/admin/vendor/getPayments', {
    params: {
      startDate,
      endDate,
      vendorName,
      status,
      maxAmount,
      sortBy,
      sortOrder,
      page,
      pageSize,
    },
  });
};
