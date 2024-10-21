export const calcPaginationData = ({ count, page, perPage }) => {
  const totalPages = Math.ceil(count / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};
