import { useState, useEffect, useContext } from "react";

import { AuthContext } from "../../../auth/context/AuthContext";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Modal from "react-modal";

import defaultHeader from "../../assets/defaultHeader210x26mm.jpg";
import defaultFooter from "../../assets/defaultFooter210x26mm.jpg";

Modal.setAppElement("#root"); // Especificamos el elemento principal de la app

export const SalesOrderButtonGeneratePdfPrice = ({className, actionName, orderData, onConfirm, tooltip, imgPath, imgStyle}) => {

  // * hooks
  const { authState } = useContext(AuthContext);
  const [previewUrl, setPreviewUrl] = useState(null); // Estado para el preview
  const [modalIsOpen, setModalIsOpen] = useState(false); // Estado para controlar el modal
  const [order, setOrder] = useState(orderData); // Estado para almacenar la orden

  // console.log(`rendered...`);

  useEffect(() => {
    // console.log(`useEffect...`);
    setOrder(orderData);
  }, [orderData]);

  // Función para cargar imágenes
  const handleGeneratePDF = () => {
    if(onConfirm()) {
      generatePDF();
    }
  }

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  };

  const generatePDF = async () => {
    try {

      const productList = order.productList.reduce( (acc, value) => {
        if(value.status == 0)
          return acc;
  
        const code        = value.code        ? value.code.toUpperCase() : ""; 
        const product     = value.comment     ? `${formatCapitalized(value.name)} ${formatCapitalized(value.comment)}` : formatCapitalized(value.name);
        const qty         = value.qty         ? parseFloat(value.qty).toFixed(2)          : '0.00';
        const price       = value.price       ? parseFloat(value.price).toFixed(2)        : '0.00';
        const discountPct = value.discountPct ? parseFloat(value.discountPct).toFixed(2)  : '0.00';
        const subTotal    = value.subTotal    ? parseFloat(value.subTotal).toFixed(2)     : '0.00';

        acc.push([code, product, qty, price, `${discountPct} %`, subTotal]);
    
        return acc;
      }, [])


      const imgUrlHeader = authState.company.images?.find((value) => value.name === "header")?.image || defaultHeader;
            
      // Cargar las imágenes de forma sincrónica
      const [imgHeader, imgFooter] = await Promise.all([
        loadImage(imgUrlHeader),
        loadImage(defaultFooter),
      ]);

      const doc = new jsPDF({ format: "A4", unit: "mm" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;
      let cursorY = 10;

      // 🔹 Header con Logo
      doc.addImage(imgHeader, "JPEG", 0, 0, 210, 27);
      // doc.addImage(imgLogo, "PNG", margin + 5, cursorY + 5, 30, 5);

      // 🔹 Datos del Cliente
      const customerData = [
        ['RUT:'       , `${order.customerIdDoc?.toUpperCase()}`],
        ['Nombre:'    , `${formatCapitalized(order.customerName)}`],
        ['Email:'     , `${order.customerEmail?.toLowerCase()}`],
        ['Dirección:' , `${formatCapitalized(order.customerAddress)}`],
      ];

      cursorY += 30;
      autoTable(doc, {
        startY: cursorY,
        body: customerData,
        margin: { left: 10 },
        columnStyles: {
          0: { cellWidth: 25 }, // Ancho de la primera columna
          1: { cellWidth: 75 }, // Ancho de la segunda columna
        },
        styles: {
          // Definir bordes
          fontSize: 11,
          textColor: [0, 0, 0],
          lineColor: [255, 255, 255], // Color de los bordes (negro en este caso)
          lineWidth: 1, // Grosor del borde
          cellPadding: 1, // Espacio entre el contenido de la celda y los bordes
          halign: "left", // Alinear el texto horizontalmente en el centro
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


      // doc.setFontSize(12);
      // doc.text(`RUT: ${order.customerIdDoc}`, margin, cursorY);
      // doc.text(`Nombre: ${order.customerName}`, margin, cursorY + 5);
      // doc.text(`Email: ${order.customerEmail}`, margin, cursorY + 10);
      // doc.text(`Dirección: ${order.customerAddress}`, margin, cursorY + 15);

      // 🔹 Título
      cursorY += 40;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("COTIZACIÓN", pageWidth / 2, cursorY, { align: "center" });
      

      const footerData = `${formatCapitalized(authState.company.address)} / ${authState.company.email?.toLowerCase()} / ${authState.company.phone}`;

      let finalY = cursorY + 5;
      let lastPage = 1;

      // 🔹 Generar tabla con productos
      autoTable(doc, {
        startY: finalY,
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
        didDrawPage: (data) => {
          const pageNum = doc.internal.getNumberOfPages();
          lastPage = pageNum;
          const footerY = pageHeight - 35; // Espacio para footer
          
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
          finalY = data.cursor.y; // Guarda la posición final de la tabla
        },
      });

      finalY += 30;

      // 🔹 Ir a la última página para agregar Totales
      
      const espacioDisponible = pageHeight - finalY; // Espacio restante en la página
      const alturaTablaTotales = 30; // Aproximadamente, o ajústalo si necesitas más precisión
      
      if (espacioDisponible < alturaTablaTotales + 40) {
        doc.addPage();
        finalY = 20; // Reinicia el cursor Y en la nueva página
      }

      // * transfer data
      const transferData = [
        ['Nombre:', `${formatCapitalized(authState.company.name)}`],
        ['RUT:'   , `${authState.company.idDoc?.toUpperCase()}`],
        ['Tipo:'  , `${formatCapitalized(authState.company.bank?.accountType)}`],
        ['Cuenta:', `${authState.company.bank?.accountNumber}`],
        ['Banco:' , `${formatCapitalized(authState.company.bank?.name)}`],
        ['Email:' , `${authState.company.email?.toLowerCase()}`],
      ];

      doc.setFontSize(14);
      doc.text("Datos de Transferencia:", 10, finalY, { align: "left" });

      autoTable(doc, {
        startY: finalY + 5,
        body: transferData,
        margin: { left: 10 },
        columnStyles: {
          0: { cellWidth: 20 }, // Ancho de la primera columna
          1: { cellWidth: 80 }, // Ancho de la segunda columna
        },
        styles: {
          // Definir bordes
          fontSize: 11,
          textColor: [0, 0, 0],
          lineColor: [255, 255, 255], // Color de los bordes (negro en este caso)
          lineWidth: 1, // Grosor del borde
          cellPadding: 0, // Espacio entre el contenido de la celda y los bordes
          halign: "left", // Alinear el texto horizontalmente en el centro
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

      // Totales
      const subTotal  = order.subTotal  ? parseFloat(order.subTotal).toFixed(2) : '0.00';
      const iva       = order.iva       ? parseFloat(order.iva).toFixed(2)      : '0.00';
      const total     = order.total     ? parseFloat(order.total).toFixed(2)    : '0.00';

      const data = [
        ['SubTotal:' , `${subTotal}`],
        ['IVA:'       , `${iva}`],
        ['Total:'     , `${total}`]
      ];

      // doc.addImage(imgTransferData, "JPG", margin, finalY, 85, 30);

      autoTable(doc, {
        startY: finalY,
        body: data,
        margin: { left: 150 },
        columnStyles: {
          0: { cellWidth: 25 }, // Ancho de la primera columna
          1: { cellWidth: 25 }, // Ancho de la segunda columna
        },
        styles: {
          fontSize: 11,
          // Definir bordes
          textColor: [0, 0, 0],
          lineColor: [100, 100, 100], // Color de los bordes (negro en este caso)
          lineWidth: 0.5, // Grosor del borde
          cellPadding: 2, // Espacio entre el contenido de la celda y los bordes
          halign: "right", // Alinear el texto horizontalmente en el centro
        },
        didParseCell: function (data) {
          if (data.section === "body" && data.column.index === 0) {
            // data.cell.styles.fillColor = [0, 0, 0];
            // data.cell.styles.textColor = [255, 255, 255];
            data.cell.styles.fontStyle = "bold";
          }
        },
        didDrawPage: (data) => {
          const pageNum = doc.internal.getNumberOfPages();
          lastPage = pageNum;
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
        }
      });


      

      // 🔹 Obtener el PDF en formato base64
      const pdfOutput = doc.output("datauristring");

      // Mostrar el PDF en un iframe (vista previa)
      setPreviewUrl(pdfOutput); // Guardar la URL de vista previa
      setModalIsOpen(true); // Abrir el modal
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false); // Cerrar el modal
  };

  const formatParagraph = (text) => {
    if (!text) 
      return "";
    
    const cleanText = text.trim().replace(/\s+/g, " ");
    return cleanText.charAt(0).toUpperCase() + cleanText.slice(1);
  }

  const formatCapitalized = (text) => {
    if (!text) return "";
  
    return text
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // const formatParagraphCapitalized = (text) => {
  //   if (!text) 
  //     return "";
  
  //   const cleanText = text.trim().replace(/\s+/g, " ");
  
  //   // Divide en oraciones usando punto seguido, signos de interrogación o exclamación
  //   const sentences = cleanText.split(/([.!?]+)\s*/g);
  
  //   // Recorre cada parte y capitaliza solo las frases (ignora signos que quedan como tokens sueltos)
  //   const formatted = sentences
  //     .map((part, index) => {
  //       if (index % 2 === 0) {
  //         return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  //       }
  //       return part; // devuelve los signos intactos
  //     })
  //     .join("");
  
  //   return formatted;
  // };

  return (
    <div>

      {/* <button className={className} onClick={handleGeneratePDF} title={tooltip}>
        {imgPath && (
          <img
            src={imgPath}
            style={imgStyle}
          />
        )}
        {actionName}
      </button> */}
      
      <button className={className} onClick={handleGeneratePDF} title={tooltip}>
        {/* {imgPath && (
          <img
            src={imgPath}
            style={imgStyle}
          />
        )}
        {actionName} */}
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Vista Previa del PDF"
        ariaHideApp={false}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.5)" },
          content: {
            // ✅ Ajuste responsive del modal
            top: "5%",
            left: "5%",
            right: "5%",
            bottom: "5%",
            padding: "10px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            overflow: "hidden",
            maxWidth: "100%",
            maxHeight: "100%",
            boxSizing: "border-box"
          }
        }}
      >
        {/* ✅ Título y botón cerrar */}
        <div className="mb-4">
          <h3>Vista Previa</h3>
          <button
            className="btn-close"
            onClick={closeModal}
            style={{ position: "absolute", top: "10px", right: "10px" }}
          />
        </div>

        {/* ✅ Iframe responsive con altura adaptable */}
        {previewUrl && (
          <iframe
            title="PDF Preview"
            src={previewUrl}
            style={{
              width: "100%",
              height: "70vh", // ✅ Altura relativa a la ventana
              border: "none"
            }}
          ></iframe>
        )}
      </Modal>

    </div>
  );
};


