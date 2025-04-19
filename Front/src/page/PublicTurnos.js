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
  Button,
} from "@material-ui/core";
import axios from "axios";
import "./PublicTurnos.css";

export default function PublicTurnos() {
  const [turnosAcumulados, setTurnosAcumulados] = useState([]);
  const [turnosYaLlamados, setTurnosYaLlamados] = useState([]); // [{id: 1, tiempo_espera: 3}, ...]
  const [turnoEnPantalla, setTurnoEnPantalla] = useState(null);
  const [horaActual, setHoraActual] = useState("");
  const [clima, setClima] = useState({ ciudad: "Asunción", temperatura: "--", descripcion: "", icono: "" });
  const apiKey = "86efa0d73f1094e7f7a768710d1c0eb3";

  const reproducirCampana = () => {
    const audio = new Audio("/sonidos/sonido.mp3");
    audio.volume = 1;
    audio.addEventListener("canplaythrough", () => {
      audio.play().catch((e) => console.error("Error al reproducir sonido:", e));
    });
    audio.load();
  };

  const reproducirVoz = (turno) => {
    reproducirCampana();
    setTimeout(() => {
      const msg = new SpeechSynthesisUtterance();
      msg.text = `Turno ${turno.codigo_turno.split("").join(" ")} diríjase a ${turno.nombre_box}`;
      msg.lang = "es-ES";
      msg.rate = 0.7;
      window.speechSynthesis.speak(msg);
    }, 1200);
  };

  const obtenerClima = async () => {
    try {
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Asuncion,py&appid=${apiKey}&units=metric&lang=es`);
      const data = res.data;
      setClima({
        ciudad: data.name,
        temperatura: `${Math.round(data.main.temp)}°C`,
        descripcion: data.weather[0].description,
        icono: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      });
    } catch (err) {
      console.error("Error al obtener clima:", err);
    }
  };

  const obtenerIconoClimaPersonalizado = (descripcion) => {
    const desc = descripcion.toLowerCase();
    if (desc.includes("lluvia")) return "/icons/animated/rainy-1.svg";
    if (desc.includes("nieve")) return "/icons/animated/snowy-1.svg";
    if (desc.includes("nublado")) return "/icons/animated/cloudy.svg";
    if (desc.includes("parcialmente") || desc.includes("algo de")) return "/icons/animated/cloudy-day-1.svg";
    if (desc.includes("despejado") || desc.includes("soleado")) return "/icons/animated/day.svg";
    if (desc.includes("noche")) return "/icons/animated/night.svg";
    return "/icons/animated/cloudy.svg";
  };

  const obtenerTurnos = async () => {
    try {
      const res = await fetch("http://localhost:7001/api/turnos/ultimos-llamados");
      const data = await res.json();

      if (data.ok) {
        const nuevos = data.turnos || [];

        setTurnosAcumulados((prev) => {
          const actualizados = [...prev];

          nuevos.forEach((nuevoTurno) => {
            const index = actualizados.findIndex(t => t.id === nuevoTurno.id);

            if (index === -1) {
              // 🔹 Turno nuevo
              actualizados.push(nuevoTurno);
            } else if (actualizados[index].tiempo_espera !== nuevoTurno.tiempo_espera) {
              // 🔁 Mismo ID pero tiempo_espera actualizado
              actualizados[index] = nuevoTurno;
            }
          });

          return actualizados.slice(-1000); // máximo 1000 turnos acumulados
        });
      }
    } catch (err) {
      console.error("Error al obtener turnos: ", err);
    }
  };


  useEffect(() => {
    obtenerTurnos();
    obtenerClima();

    const intTurnos = setInterval(obtenerTurnos, 3000);
    const intClima = setInterval(obtenerClima, 10 * 60 * 1000);
    const intReloj = setInterval(() => {
      const now = new Date();
      setHoraActual(now.toLocaleTimeString("es-PY", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }));
    }, 1000);

    return () => {
      clearInterval(intTurnos);
      clearInterval(intClima);
      clearInterval(intReloj);
    };
  }, []);

  useEffect(() => {
    if (turnoEnPantalla) return;
  
    const siguiente = turnosAcumulados.find((t) => {
      const yaLlamado = turnosYaLlamados.find((x) => x.id === t.id);
      return !yaLlamado || yaLlamado.tiempo_espera !== t.tiempo_espera;
    });
  
    if (siguiente) {
      setTurnoEnPantalla(siguiente);
      setTurnosYaLlamados((prev) => {
        // Filtramos el anterior si existe
        const filtrado = prev.filter((x) => x.id !== siguiente.id);
        return [...filtrado, { id: siguiente.id, tiempo_espera: siguiente.tiempo_espera }];
      });
  
      reproducirVoz(siguiente);
  
      setTimeout(() => {
        setTurnoEnPantalla(null);
      }, 10000);
    }
  }, [turnosAcumulados, turnoEnPantalla, turnosYaLlamados]);
  
  const ultimosLlamados = turnosAcumulados
    .filter((t) => turnosYaLlamados.some((x) => x.id === t.id))
    .slice(-5)
    .reverse();


  return (
    <>
      <video id="bg-video" autoPlay muted loop>
        <source src="/institucional3.webm" type="video/webm" />
      </video>

      <Box className="pantalla">
        <Box className="logo">
          <img src="/empresalargo.png" alt="Logo" style={{ width: 1000 }} />
        </Box>

        <Box className="contenedor">
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
                    {ultimosLlamados.map((t, index) => (
                      <TableRow key={t.id || index}>
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

          <Box style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
            <Box style={{ display: "flex", gap: 20 }}>
              <Paper elevation={3} className="panel panel-translucido reloj">
                <Typography variant="h6">🕒 Reloj Digital</Typography>
                <Typography variant="h4" className="hora-digital">{horaActual}</Typography>
              </Paper>

              <Paper elevation={3} className="panel panel-translucido clima">
                <Typography variant="h6">🌤 Clima Actual</Typography>
                <Typography variant="body1">{clima.ciudad}</Typography>
                <Typography variant="h4">{clima.temperatura}</Typography>
                <Typography variant="body2">{clima.descripcion}</Typography>
              </Paper>

              <Paper elevation={3} className="panel panel-translucido clima">
                {clima.descripcion && (
                  <img
                    src={obtenerIconoClimaPersonalizado(clima.descripcion)}
                    alt={clima.descripcion}
                    className="icono-clima"
                  />
                )}
              </Paper>
            </Box>

            <Paper elevation={2} className="panel panel-translucido video">
              <video src="/video.mp4" autoPlay muted loop />
            </Paper>
          </Box>
        </Box>

        <Button variant="contained" color="primary" onClick={reproducirCampana} fullWidth>
          Buscar
        </Button>
      </Box>
    </>
  );
}
