import html2pdf from "html2pdf.js";

const exportToPDF = (includeBar, includeLine, includePie) => {
  setTimeout(() => {
    const element = document.createElement("div");

    // Get the existing data table
    const table = document.querySelector("#export-section table")?.cloneNode(true);
    if (table) {
      table.style.marginBottom = "20px"; // Add space below table
      element.appendChild(table);
    }

    // Function to capture and append chart images with proper page breaks
    const appendChartImage = (chartClass) => {
      const chartCanvas = document.querySelector(chartClass)?.querySelector("canvas");
      if (chartCanvas) {
        const img = new Image();
        img.src = chartCanvas.toDataURL("image/png");
        img.style.width = "100%"; // Scale image properly in PDF
        img.style.margin = "20px 0"; // Space between charts
        img.style.pageBreakBefore = "always"; // Ensure new chart goes on a new page
        img.style.pageBreakAfter = "avoid"; // Avoid breaking a single chart into two pages
        element.appendChild(img);
      }
    };

    // Append selected charts
    if (includeBar) appendChartImage(".bar-chart");
    if (includeLine) appendChartImage(".line-chart");
    if (includePie) appendChartImage(".pie-chart");

    if (!element.hasChildNodes()) {
      alert("No data or charts selected for export!");
      return;
    }

    const options = {
      margin: 10,
      filename: "report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(options).from(element).save();
  }, 500);
};

export default exportToPDF;
