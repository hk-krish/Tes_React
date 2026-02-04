export function convertAmountToWords(amount) {
  function convertLessThanThousand(n) {
    if (n < 0) return false;
    const single_digit = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const double_digit = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const below_hundred = [
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    if (n === 0) return "Zero";
    function translate(n) {
      let word = "";
      if (n < 10) {
        return (word = single_digit[n] + " ");
      } else if (n < 20) {
        return (word = double_digit[n - 10] + " ");
      } else if (n < 100) {
        const rem = translate(n % 10);
        return (word = below_hundred[(n - (n % 10)) / 10 - 2] + " " + rem);
      } else if (n < 1000) {
        return (word =
          single_digit[Math.trunc(n / 100)] + " Hundred " + translate(n % 100));
      } else if (n < 1000000) {
        return (word =
          translate(parseInt(n / 1000)).trim() +
          " Thousand " +
          translate(n % 1000));
      } else if (n < 1000000000) {
        return (word =
          translate(parseInt(n / 1000000)).trim() +
          " Million " +
          translate(n % 1000000));
      } else {
        return (word =
          translate(parseInt(n / 1000000000)).trim() +
          " Billion " +
          translate(n % 1000000000));
      }
    }
    const result = translate(n);
    return result.trim();
  }

  function convert(num) {
    if (num === 0) {
      return "Zero";
    } else {
      return convertLessThanThousand(num);
    }
  }

  const [integerPart] = amount.toString().split(".");
  const words = convert(parseInt(integerPart));

  return words + " rupees only.";
}
