export const generateTransactionId = () => {
  const timestamp = Date.now().toString();
  const randomString = Math.random()
    .toString(36)
    .substring(2, 10)
    .toUpperCase();
  return `TXN-${timestamp}-${randomString}`;
};
