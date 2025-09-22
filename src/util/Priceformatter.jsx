export const formatINR = (value) => {
  if (!value) return "Rs. 0/-";
  return `Rs. ${value.toLocaleString("en-IN")}/-`;
};
