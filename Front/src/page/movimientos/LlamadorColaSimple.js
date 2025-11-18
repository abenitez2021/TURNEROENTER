import React, { useEffect, useState, useCallback } from "react";
import {
  Grid,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Chip,
  Divider,
} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import RoomIcon from "@material-ui/icons/Room";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import axios from "../../utils/axios";
import swal from "sweetalert";
import { alertWarningError } from "../../components/Notificaciones";

export default function LlamadorColaSimple() {
  const [puntosAtencion, setPuntosAtencion] = useState([]);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState("");
  const [ultimaLlamada, setUltimaLlamada] = useState(null);

  // 🧍 Usuario logueado (mismo esquema que usás en LlamadorTurnos)
  const rawJwt = sessionStorage.getItem("jwt-wom");
  const usuarioLogueado = rawJwt
    ? JSON.parse(JSON.parse(rawJwt).user ? rawJwt : "{}").user
    : null;

  // 📌 Cargar puntos de atención activos
  useEffect(() => {
    const cargarPuntosAtencion = async () => {
      try {
        const res = await axios.get("puntoatencion/listar/");
        if (res.status === 200) {
          setPuntosAtencion(res.data.filter((p) => p.activo));
        }
      } catch (err) {
        console.error("Error al cargar puntos de atención:", err);
        alertWarningError({
          data: {
            message: "Error al cargar puntos de atención.",
            level: "error",
          },
        });
      }
    };

    cargarPuntosAtencion();

    // Si ya eligió un box antes, lo recuperamos del localStorage
    const guardado = localStorage.getItem("box-atencion");
    if (guardado) {
      setPuntoSeleccionado(guardado);
    }
  }, []);

  const nombreBoxSeleccionado = () => {
    const p = puntosAtencion.find(
      (pt) => String(pt.id) === String(puntoSeleccionado)
    );
    return p?.nombre || (puntoSeleccionado ? `BOX ${puntoSeleccionado}` : "");
  };

  const handleCambiarPunto = (e) => {
    const value = e.target.value;
    setPuntoSeleccionado(value);
    localStorage.setItem("box-atencion", String(value));
    setUltimaLlamada(null);
  };

  // 👉 Acción principal: avisar que el box está libre
  const handleLlamarSiguiente = useCallback(async () => {
    if (!puntoSeleccionado) {
      alertWarningError({
        data: {
          message: "Debe seleccionar en qué Punto de Atención va a trabajar.",
          level: "warning",
        },
      });
      return;
    }

    if (!usuarioLogueado) {
      alertWarningError({
        data: {
          message: "No se encontró información del usuario logueado.",
          level: "error",
        },
      });
      return;
    }

    try {
      const payload = {
        id_usuario: usuarioLogueado.id,
      };

      const res = await axios.post(
        `puntoatencion/${puntoSeleccionado}/disponible`,
        payload
      );

      if (res.data?.ok) {
        const ahora = new Date();
        setUltimaLlamada({
          box: nombreBoxSeleccionado(),
          hora: ahora.toLocaleTimeString(),
        });

        swal("¡BOX libre!", "El siguiente ya puede ver tu box en la pantalla.", {
          icon: "success",
          buttons: false,
          timer: 1200,
        });
      } else {
        alertWarningError({
          data: {
            message:
              res.data?.message ||
              "No se pudo marcar el box como disponible.",
            level: "error",
          },
        });
      }
    } catch (err) {
      console.error("❌ Error al marcar disponible:", err);
      alertWarningError({
        data: {
          message:
            err?.response?.data?.message ||
            "Error inesperado al marcar el box como disponible.",
          level: "error",
        },
      });
    }
  }, [puntoSeleccionado, usuarioLogueado, puntosAtencion]);

  // 🧿 Atajo de teclado: Barra espaciadora para llamar rápido
  useEffect(() => {
    const handler = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleLlamarSiguiente();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleLlamarSiguiente]);

  return (
    <Box style={{ padding: 24 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            variant="h5"
            align="center"
            style={{ fontWeight: "bold", marginBottom: 4 }}
          >
            Panel de Atención – Cola Simple
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="textSecondary"
            style={{ marginBottom: 16 }}
          >
            1) Elegí tu BOX · 2) Cuando termines con alguien, presioná{" "}
            <b>“Llamar siguiente”</b> (o la tecla <b>ESPACIO</b>).
          </Typography>
        </Grid>

        {/* Columna izquierda – info del operador */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={3}
            style={{
              padding: 20,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <PersonIcon style={{ marginRight: 8, color: "#157592" }} />
              <Box>
                <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                  Operador en atención
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {usuarioLogueado
                    ? `${usuarioLogueado.nombre} ${usuarioLogueado.apellido}`
                    : "Usuario no identificado"}
                </Typography>
              </Box>
            </Box>

            <Divider />

            <Typography variant="subtitle2" gutterBottom>
              Seleccione en qué Punto de Atención va a trabajar hoy:
            </Typography>

            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Punto de Atención</InputLabel>
              <Select
                value={puntoSeleccionado}
                onChange={handleCambiarPunto}
                label="Punto de Atención"
              >
                {puntosAtencion.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box mt={2}>
              <Typography variant="body2" color="textSecondary">
                Box seleccionado:
              </Typography>
              {puntoSeleccionado ? (
                <Chip
                  icon={<RoomIcon />}
                  label={nombreBoxSeleccionado()}
                  style={{
                    marginTop: 4,
                    backgroundColor: "#e3f2fd",
                    color: "#0d47a1",
                    fontWeight: "bold",
                  }}
                />
              ) : (
                <Chip
                  label="Ningún box seleccionado"
                  style={{ marginTop: 4 }}
                  color="default"
                  size="small"
                />
              )}
            </Box>

            {ultimaLlamada && (
              <Box mt={3}>
                <Typography variant="subtitle2">
                  Última llamada realizada:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {ultimaLlamada.box} · {ultimaLlamada.hora}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Columna derecha – botón grande de acción */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={4}
            style={{
              padding: 24,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              background:
                "linear-gradient(135deg, rgba(21,117,146,0.1), rgba(0,150,136,0.1))",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              style={{ textAlign: "center" }}
            >
              Cuando estés libre, avisá al siguiente de la fila
            </Typography>

            <Typography
              variant="body2"
              color="textSecondary"
              style={{ marginBottom: 24, textAlign: "center" }}
            >
              Al presionar el botón, la pantalla pública mostrará:
              <br />
              <b>“Puede pasar al {nombreBoxSeleccionado() || "BOX X"}”</b> con
              sonido.
            </Typography>

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleLlamarSiguiente}
              disabled={!puntoSeleccionado}
              startIcon={<PlayArrowIcon />}
              style={{
                padding: "16px 32px",
                fontSize: 18,
                fontWeight: "bold",
                borderRadius: 12,
                minWidth: 260,
              }}
            >
              {puntoSeleccionado
                ? `Llamar siguiente a ${nombreBoxSeleccionado()}`
                : "Seleccione un Punto de Atención"}
            </Button>

            <Typography
              variant="caption"
              color="textSecondary"
              style={{ marginTop: 16 }}
            >
              Tip: también podés presionar la tecla{" "}
              <b>ESPACIO</b> para llamar al siguiente.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
