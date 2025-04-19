import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  TextField,
  Card,
  CardHeader,
} from "@material-ui/core";
import axios from "../../utils/axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Logo from "../../assets/images/logo-color.png";

export default function InformeGraficoTramites() {
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [datos, setDatos] = useState([]);

  const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  const buscar = async () => {
    try {
      const res = await axios.post("/informes/grafico-tramites", {
        fechaDesde: fechaDesde || "2000-01-01",
        fechaHasta: fechaHasta || "2099-12-31",
      });

      if (res.data.ok) {
        const dataTransformada = res.data.result.map((item) => ({
          name: item.tramite,
          value: parseInt(item.cantidad),
          color: getRandomColor(),
        }));
        setDatos(dataTransformada);
      }
    } catch (error) {
      console.error("Error al cargar gráfico de trámites", error);
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
      datos.map(({ name, value }) => ({ Trámite: name, Cantidad: value }))
    );
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Trámites Atenciones");
    const buffer = XLSX.write(libro, { type: "array", bookType: "xlsx" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Tramites_Atencion.xlsx");
  };

  const exportarPDF = () => {
    const doc = new jsPDF({ orientation: "portrait" });
    const fechaActual = new Date().toISOString().split("T")[0];

    const addHeader = (doc) => {
      const imageWidth = 40;
      const imageHeight = 20;
      const textBackgroundY = 10;
      const textBackgroundHeight = 20;

      doc.setFillColor(70, 130, 180);
      doc.rect(55, textBackgroundY, doc.internal.pageSize.getWidth(), textBackgroundHeight, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text("INFORME DE ATENCIONES POR TRÁMITE", 60, 23);
      doc.addImage(Logo, "PNG", 10, 10, imageWidth, imageHeight);
    };

    addHeader(doc);

    const tableData = datos.map(({ name, value }) => [name, value]);

    doc.autoTable({
      head: [["Trámite", "Cantidad"]],
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

    doc.save(`Tramites_Atencion_${fechaActual}.pdf`);
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
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Gráfico de Atenciones por Trámite" />
            <div style={{ display: "flex", justifyContent: "center", paddingBottom: 20 }}>
              <PieChart width={350} height={350}>
                <Pie
                  data={datos}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {datos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Detalle de Atenciones por Trámite" />
            <div style={{ padding: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid #ccc", padding: 8 }}>Trámite</th>
                    <th style={{ border: "1px solid #ccc", padding: 8 }}>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.map((row, index) => (
                    <tr key={index}>
                      <td style={{ border: "1px solid #ccc", padding: 8 }}>{row.name}</td>
                      <td style={{ border: "1px solid #ccc", padding: 8 }}>{row.value}</td>
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
