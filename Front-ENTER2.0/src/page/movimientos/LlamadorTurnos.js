import React, { useEffect, useState } from "react";
import swal from "sweetalert";

import { alertSuccess } from "../../components/Notificaciones"; // Asegurate de tener esta función

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

export default function LlamadorTurnos() {
  const [puntosAtencion, setPuntosAtencion] = useState([]);
  const [tramites, setTramites] = useState([]);
  const [turnosPendientes, setTurnosPendientes] = useState([]);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState("");
  const [tramitesSeleccionados, setTramitesSeleccionados] = useState([]);
  const [turnoActual, setTurnoActual] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nuevoTramite, setNuevoTramite] = useState("");

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
      const res = await axios.get("turnos/listar/", {
        params: { estado: "PENDIENTE" }
      });

      if (res.status === 200) {
        const turnosFiltrados = res.data.result.filter(
          (turno) =>
            turno.estado === "PENDIENTE" &&
            tramitesSeleccionados.includes(turno.id_tramite)
        );
        setTurnosPendientes(turnosFiltrados);
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
      const response = await axios.post("turnos/llamar", {
        id: turno.id_turno,
        box: puntoSeleccionado,
      });

      if (response?.data?.ok) {
        const turnoConDatosCompletos = {
          ...response.data.turno,
          // 👉 completamos con los datos del turno original
          nombre_visitante: turno.nombre_visitante,
          apellido_visitante: turno.apellido_visitante,
          nombre_tramite: turno.nombre_tramite,
          tramite: turno.tramite,
          box: puntoSeleccionado
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
      alertWarningError({
        data: {
          message: error?.response?.data?.message || "Error inesperado al llamar el turno.",
          level: "error"
        }
      });
    }
  };

  const finalizarTurno = async () => {
    if (!turnoActual) return;

    try {
      const res = await axios.post("turnos/finalizar", {
        id: turnoActual.id
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

    console.log("📤 Enviando al backend para reasignar:", {
      id: turnoActual.id,
      nuevoTramite: nuevoTramite
    });

    try {
      const res = await axios.put("turnos/reasignar", {
        idTurno: turnoActual.id,
        idTramite: nuevoTramite
      });

      console.log("🔄 Respuesta del backend al reasignar:", res.data);

      if (res.data?.ok) {
        console.log("✅ Turno reasignado correctamente."); // 👈 usamos notificación de éxito
        swal("¡REASIGNACION EXITOSA!", {
          icon: "success",
          buttons: false,
          timer: 1500,
        });

        setTurnoActual(null);       // Cierra el modal
        setNuevoTramite("");        // Limpia el select
        cargarTurnosPendientes();   // Refresca la lista
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
          <Typography variant="h6">Turnos Pendientes</Typography>
          {turnosPendientes.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>Código</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Trámite</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Acción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {turnosPendientes.map((turno) => (
                    <TableRow key={turno.id_turno}>
                      <TableCell>{turno.codigo_turno}</TableCell>
                      <TableCell>{turno.nombre_tramite}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => llamarTurno(turno)}
                        >
                          Llamar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="textSecondary">No hay turnos pendientes.</Typography>
          )}
        </Paper>
      </Grid>

      <Dialog
        open={!!turnoActual}
        onClose={() => setTurnoActual(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Turno en Atención: {turnoActual?.codigo_turno}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1">
            <b>Trámite:</b> {turnoActual?.tramite || turnoActual?.nombre_tramite}
          </Typography>
          <Typography variant="subtitle1">
            <b>Visitante:</b> {turnoActual?.nombre_visitante} {turnoActual?.apellido_visitante}
          </Typography>
          <Typography variant="subtitle1">
            <b>Llamado a:</b>{" "}
            {(puntosAtencion.length > 0 && turnoActual?.box != null)
              ? (puntosAtencion.find(p => p.id === turnoActual.box)?.nombre || "Desconocido")
              : "Desconocido"}
          </Typography>

          <FormControl fullWidth style={{ marginTop: 16 }}>
            <InputLabel>Nuevo Trámite</InputLabel>
            <Select
              value={nuevoTramite}
              onChange={(e) => setNuevoTramite(e.target.value)}
            >
              {tramites.map((t) => (
                <MenuItem key={t.id} value={t.id}>{t.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={finalizarTurno} color="secondary" variant="contained">
            Cerrar Atención
          </Button>
          <Button
            onClick={reasignarTurno}
            color="primary"
            variant="contained"
          >
            Reasignar Atención
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
