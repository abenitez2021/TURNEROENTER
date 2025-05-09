import React, { useEffect, useState } from "react";
import swal from "sweetalert";

import { alertSuccess } from "../../components/Notificaciones"; // Asegurate de tener esta función

import VisibilityIcon from "@material-ui/icons/Visibility";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import ImagenConFallback from "../../components/ImagenConFallback";
import frontal from "../../assets/images/ci_frontal.png";
import dorsal from "../../assets/images/ci_dorsal.png";
import foto from "../../assets/images/avatar.png"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";

import {
  Grid,
  Button,
  Select,
  MenuItem,
  Typography,
  Paper,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@material-ui/core";
import axios from "../../utils/axios";
import { alertWarningError } from "../../components/Notificaciones";

import { TextField } from "@material-ui/core";
import UserContext from "../../utils/user/UserContext";
import moment from "moment-timezone";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Logo from "../../assets/images/logo-color.png";
import { saveAs } from "file-saver";

export default function LlamadorTurnos() {
  const [puntosAtencion, setPuntosAtencion] = useState([]);
  const [tramites, setTramites] = useState([]);
  const [turnosPendientes, setTurnosPendientes] = useState([]);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState("");
  const [tramitesSeleccionados, setTramitesSeleccionados] = useState([]);
  const [turnoActual, setTurnoActual] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nuevoTramite, setNuevoTramite] = useState("");
  const [turnoVista, setTurnoVista] = useState(null);

  const [comentario, setComentario] = useState("");

  const [turnoParaTransferir, setTurnoParaTransferir] = useState(null);

  const [notaDialogOpen, setNotaDialogOpen] = useState(false);
  const [turnoParaNota, setTurnoParaNota] = useState(null);
  const [textoNota, setTextoNota] = useState("");


  const rawJwt = sessionStorage.getItem("jwt-wom");
  const usuarioLogueado = rawJwt ? JSON.parse(JSON.parse(rawJwt).user ? rawJwt : "{}").user : null;



  const [turnoHistorial, setTurnoHistorial] = useState(null);

  // console.log(usuarioLogueado.id);


  useEffect(() => {
    cargarPuntosAtencion();
    cargarTramites();
  }, []);

  useEffect(() => {
    if (tramitesSeleccionados.length > 0 && puntoSeleccionado) {
      const interval = setInterval(() => {
        cargarTurnosPendientes();
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setTurnosPendientes([]);
    }
  }, [tramitesSeleccionados, puntoSeleccionado]);

  const cargarPuntosAtencion = async () => {
    try {
      const res = await axios.get("puntoatencion/listar/");
      if (res.status === 200) {
        setPuntosAtencion(res.data.filter(p => p.activo));
      }
    } catch (err) {
      console.error("Error al cargar puntos de atención:", err);
    }
  };

  const cargarTramites = async () => {
    try {
      const res = await axios.get("tramites/listar/");
      if (res.status === 200) {
        setTramites(res.data.filter(t => t.activo));
      }
    } catch (err) {
      console.error("Error al cargar trámites:", err);
    }
  };

  const cargarTurnosPendientes = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("turnos/listar/");

      if (res.status === 200) {
        const turnosFiltrados = res.data.result.filter((turno) =>
          ["PENDIENTE", "REASIGNADO"].includes(turno.estado) &&
          tramitesSeleccionados.includes(turno.id_tramite)
        );

        // Ordenar: primero REASIGNADO por fecha_emision, luego PENDIENTE por fecha_emision
        const turnosOrdenados = turnosFiltrados.sort((a, b) => {
          if (a.estado === b.estado) {
            return new Date(a.fecha_emision) - new Date(b.fecha_emision);
          }
          return a.estado === "REASIGNADO" ? -1 : 1;
        });

        setTurnosPendientes(turnosOrdenados);
      }
    } catch (err) {
      alertWarningError({
        data: {
          message: "Error al cargar turnos pendientes.",
          level: "error"
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);

  const cargarDetalleTransferencia = async (turno) => {
    try {
      const res = await axios.get(`turnos/detalle/${turno.id_turno}`);
      if (res.data?.ok) {
        setTurnoParaTransferir(res.data.turno);
        setNuevoTramite("");
        setComentario("");
      } else {
        alertWarningError({
          data: {
            message: res.data?.message || "No se pudo obtener los datos del turno.",
            level: "warning",
          },
        });
      }
    } catch (error) {
      alertWarningError({
        data: {
          message: error?.response?.data?.message || "Error inesperado al obtener datos para transferir.",
          level: "error",
        },
      });
    }
  };




  const calcularTiempoEspera = (fechaISO) => {
    if (!fechaISO) return "-";

    const ahora = moment().tz("America/Asuncion");
    const emision = moment(fechaISO).tz("America/Asuncion");

    const diffMin = ahora.diff(emision, "minutes");

    return diffMin;
  };


  const formatearHora = (fechaISO) => {
    if (!fechaISO) return "-";
    const horaPY = moment.utc(fechaISO).tz("America/Asuncion");
    return horaPY.format("HH:mm");
  };


  const verTurno = async (turno) => {
    try {
      const res = await axios.get(`turnos/detalle/${turno.id_turno}`);

      if (res.data?.ok) {
        setTurnoVista(res.data.turno);
      } else {
        alertWarningError({
          data: {
            message: res.data?.message || "No se pudo obtener el detalle del turno.",
            level: "warning"
          }
        });
      }
    } catch (error) {
      alertWarningError({
        data: {
          message: error?.response?.data?.message || "Error inesperado al consultar detalle del turno.",
          level: "error"
        }
      });
    }
  };


  //agrupar el historial
  const agruparPorTurno = (historial) => {
    return historial.reduce((acc, item) => {
      const id = item.id_turno;
      if (!acc[id]) acc[id] = [];
      acc[id].push(item);
      return acc;
    }, {});
  };



  const [historialCompleto, setHistorialCompleto] = useState([]);
  const [dialogHistorialOpen, setDialogHistorialOpen] = useState(false);




  const exportarHistorialExcel = () => {
    const hoja = XLSX.utils.json_to_sheet(
      historialCompleto.map(h => ({
        Fecha: new Date(h.fecha).toLocaleString(),
        Estado: h.estado,
        Comentario: h.comentario,
        Origen: h.origen,
        Usuario: h.nombre_usuario || '---',
        Trámite: h.nombre_tramite || '---'
      }))
    );
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Historial Turno");
    const buffer = XLSX.write(libro, { type: "array", bookType: "xlsx" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, `Historial_Turno_${turnoHistorial?.codigo_turno}.xlsx`);
  };

  const exportarHistorialPDF = () => {
    const doc = new jsPDF();
    const fechaActual = new Date().toISOString().split("T")[0];

    const addHeader = () => {
      const imageWidth = 40;
      const imageHeight = 20;
      const textBackgroundY = 10;
      const textBackgroundHeight = 20;

      doc.setFillColor(70, 130, 180);
      doc.rect(55, textBackgroundY, doc.internal.pageSize.getWidth(), textBackgroundHeight, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text("HISTORIAL DE LA PERSONA CON", 60, 20);
      doc.text(`CÓDIGO DE TURNO ${turnoHistorial?.codigo_turno}`, 60, 28);
      doc.addImage(Logo, "PNG", 10, 10, imageWidth, imageHeight);
    };

    addHeader();

    const tableData = historialCompleto.map(h => [
      new Date(h.fecha).toLocaleString(),
      h.estado,
      h.comentario,
      h.origen,
      h.nombre_usuario || '---',
      h.nombre_tramite || '---'
    ]);

    doc.autoTable({
      head: [["Fecha", "Estado", "Comentario", "Origen", "Usuario", "Trámite"]],
      body: tableData,
      startY: 40,
      theme: "grid",
      styles: { lineColor: [0, 0, 0], cellPadding: 2 },
      headStyles: { fillColor: [70, 130, 180], textColor: [255, 255, 255], fontStyle: "bold" },
    });

    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(0);
      doc.text(`Página ${i} de ${totalPages}`, 10, doc.internal.pageSize.getHeight() - 10);
      doc.text(`Fecha de impresión: ${new Date().toLocaleString()}`, 10, doc.internal.pageSize.getHeight() - 5);
    }

    doc.save(`Historial_Turno_${turnoHistorial?.codigo_turno}_${fechaActual}.pdf`);
  };

  const verHistorialCompleto = async (turnoVista) => {
    try {
      const turnoId = turnoVista.id_turno || turnoVista.id;
      if (!turnoId) {
        console.error("❌ ID de turno inválido");
        return;
      }
      const res = await axios.get(`turnos/historial/completo/${turnoId}`);

      if (res.data?.ok) {
        setTurnoHistorial(turnoVista);
        setHistorialCompleto(res.data.historial);
        setDialogHistorialOpen(true);
      } else {
        alertWarningError({ data: { message: "No se pudo cargar el historial completo" } });
      }
    } catch (err) {
      console.error("❌ Error al obtener historial:", err);
      alertWarningError({ data: { message: "Error inesperado al obtener historial" } });
    }
  };


  const transferirTurno = (turno) => {
    setTurnoActual(turno);
    setNuevoTramite(""); // Opcional: limpia la selección previa
    setComentario("");   // Opcional: limpia el comentario anterior
  };


  const agregarNota = (turno) => {
    setTurnoParaNota(turno);
    setTextoNota("");
    setNotaDialogOpen(true);
  };




  const handleGuardarNota = async () => {
    if (!textoNota || !turnoParaNota) {
      alertWarningError({ data: { message: "Debe escribir una nota." } });
      return;
    }

    try {

      const res = await axios.post("turnos/historial/nota", {
        idTurno: turnoParaNota.id_turno || turnoParaNota.id,
        comentario: textoNota,
        id_usuario: usuarioLogueado.id,

      });
      console.log("turno", turnoParaNota.id_turno, "comentario: ", comentario, "usuario", usuarioLogueado.id);

      if (res.data?.ok) {
        swal("Nota agregada", res.data.message, "success");
        setNotaDialogOpen(false);
        setTextoNota("");
        setTurnoParaNota(null);
      } else {
        alertWarningError({ data: { message: res.data.message || "No se pudo guardar la nota." } });
      }
    } catch (err) {
      console.error("❌ Error al guardar nota:", err);
      alertWarningError({
        data: { message: err?.response?.data?.message || "Error inesperado.", level: "error" }
      });
    }
  };



  const handleConfirmarTransferencia = async () => {
    const turno = turnoActual || turnoParaTransferir;

    if (!turno || !nuevoTramite) {
      alertWarningError({ data: { message: "Debe seleccionar un nuevo trámite." } });
      return;
    }

    try {
      const res = await axios.put("turnos/reasignar", {
        idTurno: turno.id_turno || turno.id,
        idTramite: nuevoTramite,
        comentario,
        id_usuario: usuarioLogueado.id
      });

      if (res.data?.ok) {
        swal("¡Reasignación exitosa!", { icon: "success", buttons: false, timer: 1500 });
        setTurnoActual(null);
        setTurnoParaTransferir(null);
        setNuevoTramite("");
        setComentario("");
        cargarTurnosPendientes();
      } else {
        alertWarningError({ data: { message: res.data?.message || "No se pudo reasignar el turno." } });
      }
    } catch (error) {
      alertWarningError({
        data: {
          message: error?.response?.data?.message || "Error inesperado al reasignar.",
          level: "error"
        }
      });
    }
  };

  const llamarTurno = async (turno) => {
    if (!puntoSeleccionado) {
      alertWarningError({
        data: {
          message: "Debe seleccionar un punto de atención antes de llamar un turno.",
          level: "warning"
        }
      });
      return;
    }

    try {
      const payload = {
        id: turno.id_turno || turno.id,        // 👈 debe coincidir con el backend
        box: Number(puntoSeleccionado),        // 👈 asegurar que sea número
        id_usuario: usuarioLogueado.id

      };

      console.log("📨 Enviando a turnos/llamar:", payload);

      const response = await axios.post("turnos/llamar", payload);

      console.log("✅ Respuesta del backend:", response.data);

      if (response?.data?.ok) {
        const turnoConDatosCompletos = {
          ...response.data.turno,
          nombre_visitante: turno.nombre_visitante,
          apellido_visitante: turno.apellido_visitante,
          nombre_tramite: turno.nombre_tramite,
          tramite: turno.tramite,
          box: puntoSeleccionado,
          id_turno: turno.id_turno
        };

        setTurnoActual(turnoConDatosCompletos);
        cargarTurnosPendientes();

      } else {
        alertWarningError({
          data: {
            message: response?.data?.message || "No se pudo llamar el turno.",
            level: "error"
          }
        });
        cargarTurnosPendientes();
      }
    } catch (error) {
      console.error("❌ Error al llamar turno:", error?.response?.data || error);
      alertWarningError({
        data: {
          message: error?.response?.data?.message || "Error inesperado al llamar el turno.",
          level: "error"
        }
      });
    }
  };

  //Volver a llamar turno 
  const rellamarTurno = async (turno) => {
    if (!puntoSeleccionado) {
      alertWarningError({
        data: {
          message: "Debe seleccionar un punto de atención antes de llamar un turno.",
          level: "warning"
        }
      });
      return;
    }

    try {
      const payload = {
        id: turno.id_turno || turno.id,        // 👈 debe coincidir con el backend
        box: Number(puntoSeleccionado),        // 👈 asegurar que sea número
        id_usuario: usuarioLogueado.id

      };

      console.log("📨 Enviando a turnos/llamar:", payload);

      const response = await axios.post("turnos/rellamar", payload);

      console.log("✅ Respuesta del backend:", response.data);

      if (response?.data?.ok) {
        //mensaje de rellamar exitoso

      } else {
        alertWarningError({
          data: {
            message: response?.data?.message || "No se pudo llamar el turno.",
            level: "error"
          }
        });
        cargarTurnosPendientes();
      }
    } catch (error) {
      console.error("❌ Error al re llamar turno:", error?.response?.data || error);
      alertWarningError({
        data: {
          message: error?.response?.data?.message || "Error inesperado al re llamar el turno.",
          level: "error"
        }
      });
    }
  };


  const finalizarTurno = async () => {
    if (!turnoActual) return;

    try {
      const res = await axios.post("turnos/finalizar", {
        id: turnoActual.id,
        idUsuario: usuarioLogueado.id,
        comentario: comentario || "",
        ip: "127.0.0.1" // Como mejora se debe requerir la ip desde el backend
      });


      if (res.data?.ok) {
        setTurnoActual(null);
        setNuevoTramite("");
        cargarTurnosPendientes();

        // 🟢 Mostrar mensaje de éxito si querés:
        // alertSuccess("Turno reasignado correctamente.");

      } else {
        alertWarningError({
          data: {
            message: res.data?.message || "No se pudo reasignar el turno.",
            level: "error"
          }
        });
      }

    } catch (err) {
      console.error("❌ Error al reasignar turno:", err);
      alertWarningError({
        data: {
          message: err?.response?.data?.message || "Error inesperado al reasignar el turno.",
          level: "error"
        }
      });
    }

  };


  const reasignarTurno = async () => {
    if (!turnoActual || !nuevoTramite) {
      alertWarningError({
        data: {
          message: "Debe seleccionar un nuevo trámite para reasignar.",
          level: "warning"
        }
      });
      return;
    }

    const datos = {
      idTurno: turnoActual.id_turno,
      idTramite: nuevoTramite,
      comentario,
      id_usuario: usuarioLogueado.id
    };


    console.log("📤 Enviando al backend para reasignar:", datos);

    try {
      const res = await axios.put("turnos/reasignar", datos);

      console.log("🔄 Respuesta del backend al reasignar:", res.data);

      if (res.data?.ok) {
        swal("¡REASIGNACIÓN EXITOSA!", {
          icon: "success",
          buttons: false,
          timer: 1500,
        });

        setTurnoActual(null);
        setNuevoTramite("");
        cargarTurnosPendientes();

      } else {
        alertWarningError({
          data: {
            message: res.data?.message || "No se pudo reasignar el turno.",
            level: "error"
          }
        });
      }
    } catch (err) {
      console.error("🔴 Error al reasignar:", err);
      alertWarningError({
        data: {
          message: err?.response?.data?.message || "Error inesperado al reasignar el turno.",
          level: "error"
        }
      });
    }
  };

  return (
    <Grid container spacing={3} style={{ padding: 20 }}>
      <Grid item xs={12}>
        <Typography variant="h5" align="center" style={{ fontWeight: "bold" }}>
          Llamador de Turnos
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Seleccione qué Trámites desea atender</InputLabel>
          <Select
            multiple
            value={tramitesSeleccionados}
            onChange={(e) => setTramitesSeleccionados(e.target.value)}
            renderValue={(selected) =>
              selected.map((id) => tramites.find(t => t.id === id)?.nombre).join(", ")
            }
          >
            {tramites.map((t) => (
              <MenuItem key={t.id} value={t.id}>{t.nombre}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Seleccione en qué Punto de Atención desea atender</InputLabel>
          <Select value={puntoSeleccionado} onChange={(e) => setPuntoSeleccionado(e.target.value)}>
            {puntosAtencion.map((p) => (
              <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <Paper elevation={3} style={{ padding: 20 }}>
          <Typography variant="h6">
            Turnos Pendientes ({turnosPendientes.length})
          </Typography>

          <Grid container spacing={2}>
            {turnosPendientes.map((turno) => {
              const minutosEspera = calcularTiempoEspera(turno.fecha_emision); // función auxiliar
              return (
                <Grid item xs={12} key={turno.id_turno}>

                  <Paper elevation={3} style={{ padding: 16, position: "relative", borderLeft: "8px solid #673ab7" }}>
                    <Grid container justifyContent="space-between">
                      <Grid item>
                        <Typography variant="h6" style={{ fontWeight: "bold" }}>
                          {turno.nombre_visitante} {turno.apellido_visitante}
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                          {turno.nombre_tramite}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6">{minutosEspera} min</Typography>
                      </Grid>
                    </Grid>

                    <Typography variant="body2" style={{ marginTop: 8 }}>
                      <strong>Cod. Turno: {turno.codigo_turno}</strong> &nbsp;|&nbsp; Nro.Doc.: {turno.nro_documento}
                    </Typography>
                    {turno.origen && (
                      <Typography variant="body2" color="textSecondary">
                        TRANSFERIDO DESDE: {turno.origen}
                      </Typography>
                    )}
                    <Typography variant="body2">
                      <strong>HORA DE LLEGADA:</strong> {formatearHora(turno.fecha_emision)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>ESTADO:{turno.estado}</strong>
                    </Typography>

                    {/* BOTONES */}
                    <Grid container spacing={1} style={{ marginTop: 12 }}>
                      <Grid item xs>
                        <Button
                          fullWidth
                          variant="outlined"
                          color="primary"
                          onClick={() => verTurno(turno)}
                          startIcon={<VisibilityIcon />}
                        >
                          Ver
                        </Button>
                      </Grid>
                      <Grid item xs>
                        <Button
                          fullWidth
                          variant="outlined"
                          color="secondary"
                          onClick={() => cargarDetalleTransferencia(turno)}
                          startIcon={<SwapHorizIcon />}
                        >
                          Transferir
                        </Button>

                      </Grid>
                      <Grid item xs>
                        <Button
                          fullWidth
                          variant="outlined"
                          color="default"
                          onClick={() => agregarNota(turno)}
                          startIcon={<ChatBubbleOutlineIcon />}
                        >
                          Nota
                        </Button>
                      </Grid>
                      <Grid item xs>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={() => llamarTurno(turno)}
                        >
                          LLAMAR
                        </Button>
                      </Grid>
                    </Grid>

                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      </Grid>
      <Dialog
        open={!!turnoVista}
        onClose={() => setTurnoVista(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Datos del Turno: {turnoVista?.codigo_turno}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} style={{ marginTop: 16 }}>
            <Grid item xs={4}>
              <ImagenConFallback
                src={turnoVista?.imagenFrente}
                fallback={frontal}
                alt="Frente"
                style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}
              />
              <Typography align="center" variant="body2">Frente</Typography>
            </Grid>
            <Grid item xs={4}>
              <ImagenConFallback
                src={turnoVista?.imagenDorso}
                fallback={dorsal}
                alt="Dorso"
                style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}
              />
              <Typography align="center" variant="body2">Dorso</Typography>
            </Grid>
            <Grid item xs={4}>
              <ImagenConFallback
                src={turnoVista?.foto}
                fallback={foto}
                alt="Foto"
                style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}
              />
              <Typography align="center" variant="body2">Foto</Typography>
            </Grid>
          </Grid>

          <Typography variant="subtitle1">
            <b>Trámite:</b> {turnoVista?.tramite || turnoVista?.nombre_tramite}
          </Typography>
          <Typography variant="subtitle1">
            <b>Visitante:</b> {turnoVista?.nombre_visitante} {turnoVista?.apellido_visitante}
          </Typography>
          <Typography variant="subtitle1">
            <b>Nro. Documento:</b> {turnoVista?.nro_documento}
          </Typography>
          <Typography variant="subtitle1">
            <b>Transferido desde:</b>{" "}
            {turnoVista?.tramite_anterior || turnoVista?.box_anterior
              ? `${turnoVista?.tramite_anterior || "Trámite desconocido"} en ${turnoVista?.box_anterior || "Box desconocido"}`
              : "No aplica"}
          </Typography>

          <Typography variant="subtitle1">
            <b>Hora de llegada:</b> {formatearHora(turnoVista?.fecha_emision)}
          </Typography>
          <Typography variant="subtitle1">
            <b>Tiempo de espera:</b> {calcularTiempoEspera(turnoVista?.fecha_emision)} min
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={() => verHistorialCompleto(turnoVista)}
          >
            Ver Más
          </Button>


          <Button onClick={() => setTurnoVista(null)} color="primary" variant="contained">
            Cerrar
          </Button>


        </DialogActions>

      </Dialog>

      <Dialog
        open={!!turnoParaTransferir}
        onClose={() => setTurnoParaTransferir(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Transferir Turno: {turnoParaTransferir?.codigo_turno}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} style={{ marginTop: 16 }}>
            <Grid item xs={4}>
              <ImagenConFallback
                src={turnoParaTransferir?.imagenFrente}
                fallback={frontal}
                alt="Frente"
                style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}
              />
              <Typography align="center" variant="body2">Frente</Typography>
            </Grid>
            <Grid item xs={4}>
              <ImagenConFallback
                src={turnoParaTransferir?.imagenDorso}
                fallback={dorsal}
                alt="Dorso"
                style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}
              />
              <Typography align="center" variant="body2">Dorso</Typography>
            </Grid>
            <Grid item xs={4}>
              <ImagenConFallback
                src={turnoParaTransferir?.foto}
                fallback={foto}
                alt="Foto"
                style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}
              />
              <Typography align="center" variant="body2">Foto</Typography>
            </Grid>
          </Grid>

          {/* Datos del turno */}
          <Typography variant="subtitle1" style={{ marginTop: 16 }}>
            <b>Trámite actual:</b> {turnoParaTransferir?.tramite || turnoParaTransferir?.nombre_tramite}
          </Typography>
          <Typography variant="subtitle1">
            <b>Visitante:</b> {turnoParaTransferir?.nombre_visitante} {turnoParaTransferir?.apellido_visitante}
          </Typography>


          <Typography variant="subtitle1">
            <b>Documento:</b> {turnoParaTransferir?.nro_documento}
          </Typography>


          {/* Selección de nuevo trámite */}
          <FormControl fullWidth style={{ marginTop: 16 }}>
            <InputLabel>Nuevo Trámite</InputLabel>
            <Select
              value={nuevoTramite}
              onChange={(e) => setNuevoTramite(e.target.value)}
            >
              {tramites.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Comentario o Nota"
            variant="outlined"
            style={{ marginTop: 16 }}
            multiline
            minRows={2}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setTurnoParaTransferir(null)} color="secondary" variant="outlined">
            Cancelar
          </Button>
          <Button
            onClick={() => handleConfirmarTransferencia(turnoParaTransferir)}
            color="primary"
            variant="contained"
          >
            Reasignar Atención
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={dialogHistorialOpen}
        onClose={() => setDialogHistorialOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Historial Completo del Turno: {turnoHistorial?.codigo_turno}
        </DialogTitle>

        <DialogContent dividers>
          {historialCompleto.length === 0 ? (
            <Typography variant="body2">No hay historial disponible.</Typography>
          ) : (
            Object.entries(agruparPorTurno(historialCompleto)).map(([idTurno, items], idx) => (
              <Paper
                key={idTurno}
                style={{
                  marginBottom: 16,
                  padding: 8,
                  backgroundColor: Number(idTurno) === turnoHistorial?.id_turno ? "#e3f2fd" : "#f9f9f9",
                  borderLeft: Number(idTurno) === turnoHistorial?.id_turno ? "6px solid #1976d2" : "4px solid #ccc"
                }}
                elevation={2}
              >
                <Typography variant="subtitle1" style={{ marginBottom: 8 }}>
                  <b>Turno ID:</b> {idTurno} {Number(idTurno) === turnoHistorial?.id_turno && "(Turno actual)"}
                </Typography>

                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><b>Fecha</b></TableCell>
                      <TableCell><b>Estado</b></TableCell>
                      <TableCell><b>Comentario</b></TableCell>
                      <TableCell><b>Origen</b></TableCell>
                      <TableCell><b>Usuario</b></TableCell>
                      <TableCell><b>Trámite</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((h, i) => (
                      <TableRow key={i}>
                        <TableCell>{new Date(h.fecha).toLocaleString()}</TableCell>
                        <TableCell>{h.estado}</TableCell>
                        <TableCell>{h.comentario}</TableCell>
                        <TableCell>{h.origen}</TableCell>
                        <TableCell>{h.nombre_usuario || '---'}</TableCell>
                        <TableCell>{h.nombre_tramite || '---'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            ))
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDialogHistorialOpen(false)} color="primary" variant="contained">
            Cerrar
          </Button>
          <Button onClick={exportarHistorialExcel} color="default" variant="outlined">
            Exportar Excel
          </Button>
          <Button onClick={exportarHistorialPDF} color="secondary" variant="outlined">
            Exportar PDF
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={!!turnoActual}
        // 🔒 Evita cerrar con tecla ESC o clic fuera del modal
        disableEscapeKeyDown
        onClose={null} // Esto anula el comportamiento por defecto de cierre
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Turno en Atención: {turnoActual?.codigo_turno}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} style={{ marginTop: 16 }}>
            <Grid item xs={4}>
              <ImagenConFallback
                src={turnoActual?.imagenFrente}
                fallback={frontal}
                alt="Frente"
                style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}
              />
              <Typography align="center" variant="body2">Frente</Typography>
            </Grid>
            <Grid item xs={4}>
              <ImagenConFallback

                src={turnoActual?.imagenDorso}
                alt="Dorso"
                style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}

              />
              <Typography align="center" variant="body2">Dorso</Typography>
            </Grid>
          </Grid>

          <Typography variant="subtitle1"><b>Trámite:</b> {turnoActual?.nombre_tramite}</Typography>
          <Typography variant="subtitle1">
            <b>Visitante:</b> {turnoActual?.nombre_visitante} {turnoActual?.apellido_visitante}

          </Typography>

          <FormControl fullWidth style={{ marginTop: 16 }}>
            <InputLabel>Nuevo Trámite</InputLabel>
            <Select value={nuevoTramite} onChange={(e) => setNuevoTramite(e.target.value)}>
              {tramites.map((t) => (
                <MenuItem key={t.id} value={t.id}>{t.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Comentario o Nota"
            variant="outlined"
            style={{ marginTop: 16 }}
            multiline
            minRows={2}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={finalizarTurno} color="secondary" variant="contained">
            Cerrar Atención
          </Button>
          <Button onClick={() => rellamarTurno(turnoActual)} color="primary" variant="contained">

            Volver a Llamar
          </Button>
          <Button onClick={() => reasignarTurno(comentario)} color="primary" variant="contained">
            Reasignar Atención
          </Button>
        </DialogActions>

      </Dialog>

      <Dialog
        open={notaDialogOpen}
        onClose={() => setNotaDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Agregar Nota al Turno</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1">
            <b>Turno:</b> {turnoParaNota?.codigo_turno}
          </Typography>
          <Typography variant="subtitle1">
            <b>Visitante:</b> {turnoParaNota?.nombre_visitante} {turnoParaNota?.apellido_visitante}
          </Typography>

          <TextField
            fullWidth
            label="Nota"
            variant="outlined"
            style={{ marginTop: 16 }}
            multiline
            minRows={3}
            value={textoNota}
            onChange={(e) => setTextoNota(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setNotaDialogOpen(false)} color="secondary" variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleGuardarNota} color="primary" variant="contained">
            Guardar Nota
          </Button>
        </DialogActions>
      </Dialog>

    </Grid>
  );
}
