import jsPDF from "jspdf";

importScripts('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.3.1/jspdf.umd.min.js');
importScripts('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.2/html2canvas.min.js');

self.onmessage = async function (e) {
    const { imgData } = e.data;

    const pdf = new jsPDF('p', 'px', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 15, 15, pdfWidth - 25, pdfHeight);
    const pdfBlob = pdf.output("blob");
    self.postMessage({ pdfBlob });
};