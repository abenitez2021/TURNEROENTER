import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  TextField,
  Card,
  CardHeader,
} from "@material-ui/core";
import axios from "../../utils/axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Logo from "../../assets/images/logo-color.png";

export default function InformeTiemposEspera() {
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [datos, setDatos] = useState([]);

  const buscar = async () => {
    try {
      const res = await axios.post("/informes/informe-tiempos-espera", {
        fechaDesde: fechaDesde || "2000-01-01",
        fechaHasta: fechaHasta || "2099-12-31",
      });

      if (res.data.ok) {
        setDatos(res.data.result);
      }
    } catch (error) {
      console.error("Error al cargar informe de tiempos de espera", error);
    }
  };

  const limpiarFiltros = () => {
    const hoy = new Date();
    const fechaHoy = hoy.toISOString().split("T")[0];
    setFechaDesde(fechaHoy);
    setFechaHasta(fechaHoy);
    setDatos([]);
  };

  const exportarExcel = () => {
    const hoja = XLSX.utils.json_to_sheet(
      datos.map((row) => ({
        Trámite: row.tramite,
        Punto: row.punto,
        Usuario: row.usuario,
        "Promedio (min)": parseFloat(row.tiempo_promedio).toFixed(1),
        "Máximo (min)": row.tiempo_maximo,
        "Mínimo (min)": row.tiempo_minimo,
      }))
    );
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Tiempos de Espera");
    const buffer = XLSX.write(libro, { type: "array", bookType: "xlsx" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Informe_Tiempos_Espera.xlsx");
  };

  const exportarPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    const fechaActual = new Date().toISOString().split("T")[0];

    const addHeader = (doc) => {
      const imageWidth = 40;
      const imageHeight = 20;
      doc.setFillColor(70, 130, 180);
      doc.rect(55, 10, doc.internal.pageSize.getWidth(), 20, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text("INFORME DE TIEMPOS DE ESPERA", 60, 23);
      doc.addImage(Logo, "PNG", 10, 10, imageWidth, imageHeight);
    };

    addHeader(doc);

    const tableData = datos.map((row) => [
      row.tramite,
      row.punto,
      row.usuario,
      parseFloat(row.tiempo_promedio).toFixed(1),
      row.tiempo_maximo,
      row.tiempo_minimo,
    ]);

    doc.autoTable({
      head: [["Trámite", "Punto", "Usuario", "Promedio (min)", "Máximo (min)", "Mínimo (min)"]],
      body: tableData,
      startY: 40,
      theme: "grid",
      styles: { lineColor: [0, 0, 0], cellPadding: 2 },
      headStyles: { fillColor: [70, 130, 180], textColor: [255, 255, 255], fontStyle: "bold" },
    });

    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      const pageNumberString = `Página ${i} de ${totalPages}`;
      const printedDateString = `Fecha de impresión: ${new Date().toLocaleString()}`;
      doc.setFontSize(8);
      doc.setTextColor(0);
      doc.text(pageNumberString, 10, doc.internal.pageSize.getHeight() - 10);
      doc.text(printedDateString, 10, doc.internal.pageSize.getHeight() - 5);
    }

    doc.save(`Tiempos_Espera_${fechaActual}.pdf`);
  };

  useEffect(() => {
    const hoy = new Date();
    const fechaHoy = hoy.toISOString().split("T")[0];
    setFechaDesde(fechaHoy);
    setFechaHasta(fechaHoy);
    buscar();
  }, []);

  return (
    <div style={{ maxWidth: "100%" }}>
      <Grid container spacing={2} style={{ marginBottom: 10 }}>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Fecha Desde"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Fecha Hasta"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button variant="contained" color="primary" onClick={buscar} fullWidth>
            Buscar
          </Button>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button variant="outlined" onClick={limpiarFiltros} fullWidth>
            Limpiar
          </Button>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Button variant="outlined" onClick={exportarExcel} fullWidth>
            Excel
          </Button>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Button variant="outlined" onClick={exportarPDF} fullWidth>
            PDF
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card>
            <CardHeader title="Informe de Tiempos de Espera por Trámite, Punto y Usuario" />
            <div style={{ padding: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid #ccc", padding: 8 }}>Trámite</th>
                    <th style={{ border: "1px solid #ccc", padding: 8 }}>Punto</th>
                    <th style={{ border: "1px solid #ccc", padding: 8 }}>Usuario</th>
                    <th style={{ border: "1px solid #ccc", padding: 8 }}>Promedio (min)</th>
                    <th style={{ border: "1px solid #ccc", padding: 8 }}>Máximo (min)</th>
                    <th style={{ border: "1px solid #ccc", padding: 8 }}>Mínimo (min)</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.map((row, index) => (
                    <tr key={index}>
                      <td style={{ border: "1px solid #ccc", padding: 8 }}>{row.tramite}</td>
                      <td style={{ border: "1px solid #ccc", padding: 8 }}>{row.punto}</td>
                      <td style={{ border: "1px solid #ccc", padding: 8 }}>{row.usuario}</td>
                      <td style={{ border: "1px solid #ccc", padding: 8 }}>{parseFloat(row.tiempo_promedio).toFixed(1)}</td>
                      <td style={{ border: "1px solid #ccc", padding: 8 }}>{row.tiempo_maximo}</td>
                      <td style={{ border: "1px solid #ccc", padding: 8 }}>{row.tiempo_minimo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
