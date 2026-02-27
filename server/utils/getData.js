export const getData = async ({ model, page, pageSize, where }) => {
  let skip;
  let take;

  if (page) skip = (page - 1) * pageSize;
  if (pageSize) take = Number.parseInt(pageSize);
  const data = await model.findMany({
    where,
    take,
    skip,
  });

  const totalData = await model.count({
    where,
  });

  let totalPages;
  let prev;
  let next;
  let currentPage;

  if (page && pageSize) {
    page = Number.parseInt(page);
    pageSize = Number.parseInt(pageSize);
    totalPages = Math.ceil(totalData / pageSize);
    prev = page > 1 ? page - 1 : null;
    next = page < totalPages ? page + 1 : null;
    currentPage = Number.parseInt(page);
  } else {
    totalPages = 1;
    currentPage = 1;
    prev = null;
    next = null;
    pageSize = totalData;
  }

  return {
    data,
    totalPages,
    totalData,
    currentPage,
    pagesize: pageSize,
    prev,
    next,
  };
};

export const getPagenationData = async ({ page, pageSize, totalData }) => {
  let totalPages;
  let prev;
  let next;
  let currentPage;

  if (page && pageSize) {
    page = Number.parseInt(page);
    pageSize = Number.parseInt(pageSize);
    totalPages = Math.ceil(totalData / pageSize);
    prev = page > 1 ? page - 1 : null;
    next = page < totalPages ? page + 1 : null;
    currentPage = Number.parseInt(page);
  } else {
    totalPages = 1;
    currentPage = 1;
    prev = null;
    next = null;
    pageSize = totalData;
  }

  return {
    totalPages,
    currentPage,
    pagesize: pageSize,
    prev,
    next,
  };
};
