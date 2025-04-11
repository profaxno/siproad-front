import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/headerVasco.jpg"; // Logo en el header
import footerImg from "../../assets/footerVasco.jpg"; // Imagen del footer
import Modal from "react-modal"; // Importamos la librería para modal

Modal.setAppElement("#root"); // Especificamos el elemento principal de la app

export const SalesOrderButtonGeneratePdfPrice = ({className, actionName, orderData, onConfirm, tooltip, imgPath, imgStyle}) => {

  // * hooks
  const [previewUrl, setPreviewUrl] = useState(null); // Estado para el preview
  const [modalIsOpen, setModalIsOpen] = useState(false); // Estado para controlar el modal
  const [order, setOrder] = useState(orderData); // Estado para almacenar la orden

  console.log(`rendered...`);

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
    
        console.log(`generatePDF: value=${JSON.stringify(value)}`);
  
        const code        = value.code        ? value.code : ""; 
        const qty         = value.qty         ? parseFloat(value.qty).toFixed(2)          : '0.00';
        const price       = value.price       ? parseFloat(value.price).toFixed(2)        : '0.00';
        const discountPct = value.discountPct ? parseFloat(value.discountPct).toFixed(2)  : '0.00';
        const subTotal    = value.subTotal    ? parseFloat(value.subTotal).toFixed(2)     : '0.00';
    
        acc.push([code, value.name, qty, price, `${discountPct} %`, subTotal]);
    
        return acc;
      }, [])

      // Cargar las imágenes de forma sincrónica
      const [imgHeader, imgFooter] = await Promise.all([
        loadImage(logo),
        loadImage(footerImg),
      ]);

      const doc = new jsPDF({ format: "A4", unit: "mm" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;
      let cursorY = 10;

      // 🔹 Header con Logo
      doc.addImage(imgHeader, "JPEG", margin, cursorY, pageWidth - 2 * margin, 20);
      

      // 🔹 Datos del Cliente
      const customerData = [
        ['RUT:'       , `${order.customerIdDoc?.toUpperCase()}`],
        ['Nombre:'    , `${order.customerName?.toUpperCase()}`],
        ['Email:'     , `${order.customerEmail?.toUpperCase()}`],
        ['Dirección:' , `${order.customerAddress?.toUpperCase()}`],
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
          0: { cellWidth: 30, halign: "center" }, // Ancho de la primera columna
          1: { cellWidth: 65, halign: "letf" }, // Ancho de la segunda columna
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
          doc.addImage(imgFooter, "JPEG", margin, footerY, pageWidth - 2 * margin, 20);

          // 🔹 Número de página en cada hoja
          doc.setFontSize(10);
          doc.text(`Página ${pageNum}`, pageWidth - margin, pageHeight - 10, { align: "right" });
        },
        didDrawCell: (data) => {
          finalY = data.cursor.y; // Guarda la posición final de la tabla
        },
      });

      // 🔹 Ir a la última página para agregar Totales
      
      // Totales
      const subTotal  = order.subTotal  ? parseFloat(order.subTotal).toFixed(2) : '0.00';
      const iva       = order.iva       ? parseFloat(order.iva).toFixed(2)      : '0.00';
      const total     = order.total     ? parseFloat(order.total).toFixed(2)    : '0.00';

      const data = [
        ['SubTotal:' , `${subTotal}`],
        ['IVA:'       , `${iva}`],
        ['Total:'     , `${total}`]
      ];

      finalY += 30;
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

  return (
    <div>

      <button className={className} onClick={handleGeneratePDF} title={tooltip}>
        {imgPath && (
          <img
            src={imgPath}
            style={imgStyle}
          />
        )}
        {actionName}
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


