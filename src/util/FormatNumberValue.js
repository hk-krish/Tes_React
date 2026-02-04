export const numberFormatFlotValue = (value) =>
  new Intl.NumberFormat("en-IN", {
    currency: "INR",
    minimumIntegerDigits: 2,
    minimumFractionDigits: 2, // Ensure at least 2 decimal places
    maximumFractionDigits: 2, // Limit to 2 decimal places
  }).format(value);

export const numberFormatValue = (value) =>
  new Intl.NumberFormat("en-IN", {
    currency: "INR",
    minimumIntegerDigits: 2,
  }).format(value);
