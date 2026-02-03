

export const generateOrderNumber = () => {

  const date = new Date();
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `ORD${ymd}-${random}`;
};
