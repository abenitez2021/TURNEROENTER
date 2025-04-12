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
  Grid,
} from "@material-ui/core";
import axios from "axios";
import "./PublicTurnos.css";

export default function PublicTurnos() {
  const [turnos, setTurnos] = useState([]);
  const [turnoEnPantalla, setTurnoEnPantalla] = useState(null);
  const [horaActual, setHoraActual] = useState("");
  const [clima, setClima] = useState({ ciudad: "Asunción", temperatura: "--", descripcion: "", icono: "" });
  const apiKey = "86efa0d73f1094e7f7a768710d1c0eb3";

  const reproducirVoz = (turno) => {
    const msg = new SpeechSynthesisUtterance();
    msg.text = `Turno ${turno.codigo_turno.split("").join(" ")} diríjase a ${turno.nombre_box}`;
    msg.lang = "es-ES";
    msg.rate = 0.7;
    window.speechSynthesis.speak(msg);
  };

  const obtenerClima = async () => {
    try {
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Asuncion,py&appid=${apiKey}&units=metric&lang=es`);
      const data = res.data;
      console.log("esto viene de api.openweathermap ;", res)
      setClima({
        ciudad: data.name,
        temperatura: `${Math.round(data.main.temp)}°C`,
        descripcion: data.weather[0].description,
        icono: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      });
      console.log("ICONO CLIMA:", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
    } catch (err) {
      console.error("Error al obtener clima:", err);
    }
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
      console.error("Error al obtener turnos: ", err);
    }
  };

  useEffect(() => {
    obtenerTurnos();
    obtenerClima();

    const intervaloTurnos = setInterval(obtenerTurnos, 150000);
    const intervaloClima = setInterval(obtenerClima, 10 * 60 * 1000);
    const intervaloReloj = setInterval(() => {
      const now = new Date();
      const hora = now.toLocaleTimeString("es-PY", {
        hour: "2-digit",
        minute: "2-digit",
        //second: "2-digit",
        hour12: false, // ✅ Agregado para 24 horas
      });
      setHoraActual(hora);
    }, 1000);
    
    return () => {
      clearInterval(intervaloTurnos);
      clearInterval(intervaloClima);
      clearInterval(intervaloReloj);
    };
  }, []);

  const turnosCompletados = [...turnos];
  while (turnosCompletados.length < 5) {
    turnosCompletados.push({ codigo_turno: "---", nombre_visitante: "---", apellido_visitante: "", nombre_box: "---" });
  }

  return (
    <>
      <video id="bg-video" autoPlay muted loop>
        <source src="/institucional3.webm" type="video/webm" />
      </video>
      
      <Box className="pantalla">
        {/* 🏢 Logo centrado */}
        <Box className="logo">
          <img src="/empresalargo.png" alt="Logo" style={{ width: 1000 }} />
        </Box>

        {/* 🔳 Contenido principal: dividido en 2 columnas */}
        <Box className="contenedor">
          {/* 📋 COLUMNA IZQUIERDA: Turnos */}
          <Paper elevation={4} className={`panel panel-translucido turnos ${turnoEnPantalla ? "borde-llamado" : ""}`}>
            {turnoEnPantalla ? (
              <Box className="animacion-fade">
                <Typography variant="h3" align="center">
                  Turno en Atención: {turnoEnPantalla.codigo_turno}
                </Typography>
                <Typography variant="h5" align="center" style={{ marginTop: 20 }}>
                  Visitante: {turnoEnPantalla.nombre_visitante} {turnoEnPantalla.apellido_visitante}
                </Typography>
                <Typography variant="h5" align="center" style={{ marginTop: 10 }}>
                  Llamado a: {turnoEnPantalla.nombre_box}
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                      <h1>Últimos Turnos Llamados</h1>
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

          {/* 🧩 COLUMNA DERECHA: Reloj/Clima + Video */}
          <Box style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Reloj y Clima arriba */}
            <Box style={{ display: "flex", gap: 20 }}>
              <Paper elevation={3} className="panel panel-translucido reloj">
                <Typography variant="h6">🕒 Reloj Digital</Typography>
                <Typography variant="h4" className="hora-digital">{horaActual}</Typography>
              </Paper>

              <Paper elevation={3} className="panel panel-translucido clima">
                <Typography variant="h6">🌤 Clima Actual</Typography>
                <Typography variant="body1">{clima.ciudad}</Typography>
                {clima.icono && <img src={clima.icono} alt="Icono del clima" className="icono-clima" />}
                </Paper>
                <Paper elevation={3} className="panel panel-translucido clima">
                <Typography variant="h4">{clima.temperatura}</Typography>
                <Typography variant="body2">{clima.descripcion}</Typography>
              </Paper>
            </Box>

            {/* 🎥 Video institucional abajo */}
            <Paper elevation={2} className="panel panel-translucido video">
              <video src="/video.mp4" autoPlay muted loop />
            </Paper>
          </Box>
        </Box>
      </Box>
    </>
  );
}
