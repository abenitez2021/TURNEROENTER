import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";

export default function PublicTurnos() {
  const [turnos, setTurnos] = useState([]);
  const [turnoEnPantalla, setTurnoEnPantalla] = useState(null);

  const reproducirVoz = (turno) => {
    const msg = new SpeechSynthesisUtterance();
    msg.text = `Turno ${turno.codigo_turno.split("").join(" ")} diríjase a ${turno.nombre_box}`;
    msg.lang = "es-ES";
    window.speechSynthesis.speak(msg);
  };

  const obtenerTurnos = async () => {
    try {
      const res = await fetch("http://localhost:7001/api/turnos/ultimos-llamados");
      const data = await res.json();
      if (data.ok) {
        const nuevoTurno = data.turnos[0];
        if (!turnos.length || nuevoTurno.codigo_turno !== turnos[0].codigo_turno) {
          setTurnoEnPantalla(nuevoTurno);
          reproducirVoz(nuevoTurno);
          setTimeout(() => setTurnoEnPantalla(null), 10000);
        }
        setTurnos(data.turnos);
      }
    } catch (err) {
      console.error("Error al obtener turnos:", err);
    }
  };

  useEffect(() => {
    const interval = setInterval(obtenerTurnos, 3000);
    return () => clearInterval(interval);
  }, [turnos]);

  const turnosCompletados = [...turnos];
  while (turnosCompletados.length < 5) {
    turnosCompletados.push({
      codigo_turno: "---",
      nombre_visitante: "---",
      apellido_visitante: "",
      nombre_box: "---",
    });
  }

  return (
    <Box
      style={{
        backgroundColor: "#f0f0f0",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        overflow: "hidden",
        padding: "20px",
      }}
    >
      {/* 🏢 Logo centrado */}
      <Box style={{ textAlign: "center", marginBottom: 20 }}>
        <img src="/empresa.jpg" alt="Logo" style={{ width: 140 }} />
      </Box>

      {/* 🔳 Contenido principal: tabla y video */}
      <Box
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          gap: 30,
        }}
      >
        {/* 📋 Tabla */}
        <Paper
          elevation={4}
          style={{
            flex: 1,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            borderRadius: 12,
          }}
        >
          {turnoEnPantalla ? (
            <>
              <Typography variant="h3" align="center">
                Turno en Atención: {turnoEnPantalla.codigo_turno}
              </Typography>
              <Typography variant="h5" align="center" style={{ marginTop: 20 }}>
                Visitante: {turnoEnPantalla.nombre_visitante} {turnoEnPantalla.apellido_visitante}
              </Typography>
              <Typography variant="h5" align="center" style={{ marginTop: 10 }}>
                Llamado a: {turnoEnPantalla.nombre_box}
              </Typography>
            </>
          ) : (
            <TableContainer style={{ flex: 1 }}>
              <Table>
                <TableHead>
                  <TableRow style={{ backgroundColor: "#1976d2" }}>
                    <TableCell colSpan={3}>
                      <Typography
                        variant="h5"
                        align="center"
                        style={{ color: "#fff", fontWeight: "bold" }}
                      >
                        Últimos Turnos Llamados
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Turno</strong></TableCell>
                    <TableCell><strong>Visitante</strong></TableCell>
                    <TableCell><strong>Punto de Atención</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {turnosCompletados.map((t, index) => (
                    <TableRow key={index}>
                      <TableCell>{t.codigo_turno}</TableCell>
                      <TableCell>{`${t.nombre_visitante} ${t.apellido_visitante}`}</TableCell>
                      <TableCell>{t.nombre_box}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* 🎥 Video */}
        <Paper
          elevation={4}
          style={{
            flex: 1,
            borderRadius: 12,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <video
            src="/video.mkv"
            autoPlay
            loop
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Paper>
      </Box>
    </Box>
  );
}
