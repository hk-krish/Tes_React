import * as XLSX from "xlsx";
import * as json2csv from "json2csv";
import { message } from "antd";

export const downloadCSV = (data, filename) => {
  try {
    // Convert JSON data to CSV
    const csv = json2csv.parse(data, {
      withBOM: true, // Ensure BOM (Byte Order Mark) is included for UTF-8 encoding
    });

    // Create a Blob with UTF-8 encoding
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    // Generate a download link and trigger the download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.appendChild(link); // Append to the DOM for triggering
    link.click();
    document.body.removeChild(link); // Clean up after the download
  } catch (error) {
    console.error("Error converting to CSV: ", error);
    message.error("Error while downloading CSV");
  }
};

export const downloadExcel = (data, filename) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const downloadOrUpdateExcel = (newData, filename) => {
  let wb;
  try {
    wb = XLSX.utils.book_new();
  } catch (error) {
    console.error("Error creating workbook:", error);
    return;
  }

  // Check and truncate long text values in newData
  const truncatedData = newData.map((row) => {
    const truncatedRow = {};
    for (const key in row) {
      const cellValue = row[key];
      // console.log("cellValue-----",cellValue)
      truncatedRow[key] =
        typeof cellValue === "string" && cellValue.length > 32767
          ? cellValue.slice(0, 32767) // Truncate to 32,767 characters
          : cellValue;
    }
    return truncatedRow;
  });

  // Convert new (truncated) data to worksheet
  const newWs = XLSX.utils.json_to_sheet(truncatedData);

  // Append or create sheet in workbook
  XLSX.utils.book_append_sheet(wb, newWs, "Sheet 1");

  // Write workbook to a downloadable file
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.xlsx`;
  link.click();
};


// Amount wise create sheet in excel
// export const downloadOrUpdateExcel = (data, filename, groupByKey) => {
//   try {
//     // Create a new workbook
//     const wb = XLSX.utils.book_new();

//     // Group data based on the specified key (e.g., "amount")
//     const groupedData = data.reduce((acc, row) => {
//       console.log("row-----", row);
//       const groupKey = row[groupByKey] || "Others"; // Use "Others" for undefined or empty values
//       acc[groupKey] = acc[groupKey] || [];
//       acc[groupKey].push(row);
//       return acc;
//     }, {});

//     // Create a sheet for each group
//     Object.entries(groupedData).forEach(([group, rows]) => {
//       // Truncate long text values in each group
//       const truncatedData = rows.map((row) => {
//         const truncatedRow = {};
//         for (const key in row) {
//           const cellValue = row[key];
//           truncatedRow[key] =
//             typeof cellValue === "string" && cellValue.length > 32767
//               ? cellValue.slice(0, 32767) // Truncate to 32,767 characters
//               : cellValue;
//         }
//         return truncatedRow;
//       });

//       // Convert truncated data to worksheet
//       const ws = XLSX.utils.json_to_sheet(truncatedData);

//       // Append the worksheet to the workbook with the group name as the sheet name
//       XLSX.utils.book_append_sheet(wb, ws, group);
//     });

//     // Write the workbook to a downloadable file
//     const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//     const blob = new Blob([wbout], { type: "application/octet-stream" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = `${filename}.xlsx`;
//     link.click();
//   } catch (error) {
//     console.error("Error creating Excel file:", error);
//   }
// };

// Amount And Count Show in Excel
// export const downloadOrUpdateExcel = (data, filename) => {
//   try {
//     // Create a new workbook
//     const wb = XLSX.utils.book_new();

//     // Convert data to worksheet
//     const ws = XLSX.utils.json_to_sheet(data);

//     // Append the worksheet to the workbook
//     XLSX.utils.book_append_sheet(wb, ws, "Report");

//     // Write the workbook to a downloadable file
//     const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//     const blob = new Blob([wbout], { type: "application/octet-stream" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = `${filename}.xlsx`;
//     link.click();
//   } catch (error) {
//     console.error("Error creating Excel file:", error);
//   }
// };

