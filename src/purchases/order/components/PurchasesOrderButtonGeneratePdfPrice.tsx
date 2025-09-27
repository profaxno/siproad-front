import type { FC } from "react";
import { useState, useContext } from "react";
import Modal from "react-modal";

import { jsPDF } from "jspdf";
import autoTable, { CellHookData } from "jspdf-autotable";

import { AuthContext } from "../../../auth/context/AuthContext";

import { purchasesOrderContext } from "../context/purchases-order.context";

import defaultHeader from "../assets/defaultHeader210x26mm.jpg";
import defaultFooter from "../assets/defaultFooter210x26mm.jpg";

Modal.setAppElement("#root");

interface Props {
  className?: string;
  tooltip?: string;
}

export const PurchasesOrderButtonGeneratePdfPrice: FC<Props> = ({
  className,
  tooltip
}) => {

  // * hooks
  const context = useContext(purchasesOrderContext);
  if (!context) 
    throw new Error("PurchasesOrderButtonGeneratePdfPrice: PurchasesOrderContext must be used within an PurchasesOrderProvider");

  const { form } = context;

  const authContext = useContext(AuthContext);
  if (!authContext) 
    throw new Error("PurchasesOrderButtonGeneratePdfPrice: AuthContext must be used within an AuthProvider");

  const { authState } = authContext;
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleGeneratePDF = () => {
    if(!form.id){
      alert("No hay orden seleccionada para generar el PDF.");
      return;
    }

    generatePDF();
  };

  const generatePDF = async () => {
    try {

      // * load images
      const imgUrlHeader = authState.company.images?.find((value) => value.name === "header")?.image || defaultHeader;
            
      const [imgHeader, imgFooter] = await Promise.all([
        loadImage(imgUrlHeader),
        loadImage(defaultFooter),
      ]);

      // * prepare document
      const doc = new jsPDF({ format: "A4", unit: "mm" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;
      let cursorY = 10;


      // * add header image
      doc.addImage(imgHeader, "JPEG", 0, 0, 210, 26);
      

      // * add customer data
      const customerData = [
        ['RUT:'       , `${form.customerIdDoc?.toUpperCase()}`],
        ['Nombre:'    , `${formatCapitalized(form.customerName)}`],
        ['Email:'     , `${form.customerEmail?.toLowerCase()}`],
        ['Dirección:' , `${formatCapitalized(form.customerAddress)}`],
      ];

      cursorY += 30;
      autoTable(doc, {
        startY: cursorY,
        body: customerData,
        margin: { left: 10 },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 75 },
        },
        styles: {
          fontSize: 11,
          textColor: [0, 0, 0],
          lineColor: [255, 255, 255], // Color de los bordes (negro en este caso)
          lineWidth: 1, // Grosor del borde
          cellPadding: 1, // Espacio entre el contenido de la celda y los bordes
          halign: "left", // Alinear el texto horizontalmente en el centro
        },
        didParseCell: function (data: CellHookData) {
          if (data.section === "body" && data.column.index === 0) {
            // data.cell.styles.fillColor = [0, 0, 0];
            // data.cell.styles.textColor = [255, 255, 255];
            data.cell.styles.fontStyle = "bold";
          }

          data.cell.styles.fillColor = [255, 255, 255]
        },
      });
    

      // * add title
      cursorY += 40;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("COTIZACIÓN", pageWidth / 2, cursorY, { align: "center" });
      

      // * add products data
      const footerData = `${formatCapitalized(authState.company.address)} / ${authState.company.email?.toLowerCase()} / ${authState.company.phone}`;

      const productList: string[][] = form.productList.reduce((acc: string[][], value) => {
        if (value.status == 0) return acc;
      
        const code        = value.code    ? value.code.toUpperCase() : ""; 
        const product     = value.comment ? `${formatCapitalized(value.name)} (${value.comment})` : formatCapitalized(value.name);
        const qty         = formatNumber(value.qty ?? 0);
        const price       = formatNumber(value.price ?? 0);
        const discountPct = formatNumber(value.discountPct ?? 0);
        const subTotal    = formatNumber(value.subTotal ?? 0);
      
        acc.push([code, product, qty, price, `${discountPct} %`, subTotal]);
      
        return acc;
      }, []);

      cursorY += 5;
      autoTable(doc, {
        startY: cursorY,
        head: [["Código", "Producto", "Cantidad", "Precio", "Dcto", "SubTotal"]],
        body: productList,
        margin: { top: 10, left: margin, right: margin, bottom: 40},
        headStyles: {
          fillColor: [0, 0, 0], // Color de fondo para el encabezado (azul en este caso)
          textColor: [255, 255, 255], // Color del texto (blanco en este caso)
          fontStyle: "bold", // Hacer el texto en negrita
          halign: "center"
        },
        columnStyles: {
          0: { cellWidth: 30, halign: "left" }, // Ancho de la primera columna
          1: { cellWidth: 65, halign: "left" }, // Ancho de la segunda columna
          2: { cellWidth: 25, halign: "right" }, // Ancho de la segunda columna
          3: { cellWidth: 25, halign: "right" }, // Ancho de la segunda columna
          4: { cellWidth: 20, halign: "right" }, // Ancho de la segunda columna
          5: { cellWidth: 25, halign: "right" }, // Ancho de la segunda columna
        },
        styles: {
          fontSize: 11,
          // Definir bordes
          textColor: [0, 0, 0],
          lineColor: [100, 100, 100], // Color de los bordes (negro en este caso)
          lineWidth: 0.5, // Grosor del borde
          cellPadding: 2, // Espacio entre el contenido de la celda y los bordes
        },
        didDrawPage: () => {
          const pageNum = doc.getNumberOfPages();
          const footerY = pageHeight - 35;
          
          // 🔹 Imagen en el Footer
          
          doc.addImage(imgFooter, "JPEG", 0, footerY, 210, 26);
          doc.setFontSize(11);
          doc.setTextColor(255, 255, 255);
          doc.text(footerData, pageWidth / 2, footerY + 16, { align: "center" }); // Texto encima

          // 🔹 Número de página en cada hoja
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text(`Página ${pageNum}`, pageWidth - margin, pageHeight - 5, { align: "right" });
        },
        didDrawCell: (data) => {
          cursorY = data?.cursor?.y ?? cursorY; // Guarda la posición final de la tabla
        }
      });


      // calculate space for next table
      let finalY = cursorY + 25;
      const availableSpace = pageHeight - finalY;
      const alturaTablaTotales = 100; // Aproximadamente, o ajústalo si necesitas más precisión
      
      if (availableSpace < alturaTablaTotales) {
        doc.addPage(); // * add page
        finalY = 10; // * restart cursor
      }


       // * add totals data
      const subTotal  = formatNumber(form.subTotal ?? 0);
      const iva       = formatNumber(form.iva ?? 0);
      const total     = formatNumber(form.total ?? 0);

      const data = [
        ['SubTotal:' , `${subTotal}`],
        ['IVA:'       , `${iva}`],
        ['Total:'     , `${total}`]
      ];

      autoTable(doc, {
        startY: finalY,
        body: data,
        margin: { left: 150 },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 25 },
        },
        styles: {
          fontSize: 11,
          textColor: [0, 0, 0],
          lineColor: [100, 100, 100],
          lineWidth: 0.5,
          cellPadding: 2,
          halign: "right",
        },
        didParseCell: function (data) {
          if (data.section === "body" && data.column.index === 0) {
            // data.cell.styles.fillColor = [0, 0, 0];
            // data.cell.styles.textColor = [255, 255, 255];
            data.cell.styles.fontStyle = "bold";
          }
        },
        didDrawPage: () => {
          const pageNum = doc.getNumberOfPages();
          const footerY = pageHeight - 35;
          
          // 🔹 Imagen en el Footer
          
          doc.addImage(imgFooter, "JPEG", 0, footerY, 210, 26);
          doc.setFontSize(11);
          doc.setTextColor(255, 255, 255);
          doc.text(footerData, pageWidth / 2, footerY + 16, { align: "center" }); // Texto encima

          // 🔹 Número de página en cada hoja
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text(`Página ${pageNum}`, pageWidth - margin, pageHeight - 5, { align: "right" });
        },
        didDrawCell: () => {
          // console.log("didDrawCell", data?.cursor?.y ?? 'a');
          // cursorY = data?.cursor?.y ?? cursorY; // Guarda la posición final de la tabla
        }
      });


      // * add transfer data
      finalY += 5;
      doc.setFontSize(12);
      doc.text("Datos de Transferencia:", 10, finalY, { align: "left" });

      const transferData = [
        ['Nombre:', `${formatCapitalized(authState.company.name)}`],
        ['RUT:'   , `${authState.company.idDoc?.toUpperCase()}`],
        ['Tipo:'  , `${formatCapitalized(authState.company.bank?.accountType)}`],
        ['Cuenta:', `${authState.company.bank?.accountNumber}`],
        ['Banco:' , `${formatCapitalized(authState.company.bank?.name)}`],
        ['Email:' , `${authState.company.email?.toLowerCase()}`],
      ];

      autoTable(doc, {
        startY: finalY + 2,
        body: transferData,
        margin: { left: 10 },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 80 }
        },
        styles: {
          fontSize: 11,
          textColor: [0, 0, 0],
          lineColor: [255, 255, 255],
          lineWidth: 1,
          cellPadding: 0,
          halign: "left",
        },
        didParseCell: function (data) {
          if (data.section === "body" && data.column.index === 0) {
            // data.cell.styles.fillColor = [0, 0, 0];
            // data.cell.styles.textColor = [255, 255, 255];
            data.cell.styles.fontStyle = "bold";
          }

          data.cell.styles.fillColor = [255, 255, 255]
        },
      });


      // * add general info
      finalY += 40;
      doc.setFontSize(12);
      {form.comment ? doc.text("Información General:", 10, finalY, { align: "left" }) : ""};
      
      const orderData = [
        ['', `${form.comment}`],
      ];

      finalY += 2;
      autoTable(doc, {
        startY: finalY,
        body: orderData,
        margin: { left: 10 },
        columnStyles: {
          0: { cellWidth: 1 },
          1: { cellWidth: 99 },
        },
        styles: {
          fontSize: 11,
          textColor: [0, 0, 0],
          lineColor: [255, 255, 255],
          lineWidth: 0.5,
          cellPadding: 0,
          halign: "left",
        },
        didParseCell: function (data) {
          if (data.section === "body" && data.column.index === 0) {
            // data.cell.styles.fillColor = [0, 0, 0];
            // data.cell.styles.textColor = [255, 255, 255];
            data.cell.styles.fontStyle = "bold";
          }

          data.cell.styles.fillColor = [255, 255, 255]
        },
      });

      
      // * generate pdf base64
      const pdfOutput = doc.output("datauristring");

      setPreviewUrl(pdfOutput);
      setModalIsOpen(true);

    } catch (error) {
      console.error("generatePDF: Error", error);
    }
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  };

  const formatCapitalized = (value?: string) => {
    if (!value) 
      return "";
  
    return value
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // const formatParagraph = (value?: string) => {
  //   if (!value) 
  //     return "";

  //   return value.charAt(0).toUpperCase() + value.slice(1);
  // }

  const formatNumber = (value: number | string) => {
    const number = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("es-CL", { // TODO: la zona horaria es-CL debe ser un parametro de la empresa y llegar en el login
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <button
        className={className}
        onClick={handleGeneratePDF}
        title={tooltip}
      />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            width: "70vw", // 👈 60% del ancho del viewport
            height: "90vh",
            margin: "0 auto", // para centrarla horizontalmente
            overflow: "hidden"
          }
        }}
      >
        
        <div className="d-flex justify-content-end">
          <button
            className="btn-close"
            onClick={closeModal}
            // style={{ position: "absolute", top: "10px", right: "10px" }}
          />
        </div>

        {previewUrl && (
          <iframe
            title="Vista previa del PDF"
            src={previewUrl}
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        )}
      </Modal>
    </div>
  );
};
