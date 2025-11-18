import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Button,
} from "@material-ui/core";
import axios from "axios";
import "./PublicTurnos.css";

// ⏱ 5 segundos mostrando cada box disponible
const TIEMPO_MOSTRAR_MS = 5000;

export default function PublicColaSimple() {
  const [boxesDisponibles, setBoxesDisponibles] = useState([]);
  const [boxEnPantalla, setBoxEnPantalla] = useState(null);

  const [horaActual, setHoraActual] = useState("");
  const [clima, setClima] = useState({
    ciudad: "Asunción",
    temperatura: "--",
    descripcion: "",
    icono: "",
  });

  const apiKey = "86efa0d73f1094e7f7a768710d1c0eb3";

  // 🔔 MISMA FUNCIÓN QUE EN PublicTurnos
  const reproducirCampana = () => {
    const audio = new Audio("/sonidos/sonido.mp3");
    audio.volume = 1;
    audio.addEventListener("canplaythrough", () => {
      audio.play().catch((e) => console.error("Error al reproducir sonido:", e));
    });
    audio.load();
  };

  // 🕒 Reloj digital (igual que PublicTurnos)
  useEffect(() => {
    const intReloj = setInterval(() => {
      const now = new Date();
      setHoraActual(
        now.toLocaleTimeString("es-PY", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    }, 1000);

    return () => clearInterval(intReloj);
  }, []);

  // 🌤 Clima (igual que PublicTurnos)
  const obtenerClima = async () => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=Asuncion,py&appid=${apiKey}&units=metric&lang=es`
      );
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
    const desc = (descripcion || "").toLowerCase();
    if (desc.includes("lluvia")) return "/icons/animated/rainy-1.svg";
    if (desc.includes("nieve")) return "/icons/animated/snowy-1.svg";
    if (desc.includes("nublado")) return "/icons/animated/cloudy.svg";
    if (desc.includes("parcialmente") || desc.includes("algo de"))
      return "/icons/animated/cloudy-day-1.svg";
    if (desc.includes("despejado") || desc.includes("soleado"))
      return "/icons/animated/day.svg";
    if (desc.includes("noche")) return "/icons/animated/night.svg";
    return "/icons/animated/cloudy.svg";
  };

  // 📡 Polling de boxes disponibles
  const obtenerBoxesDisponibles = async () => {
    try {
      const res = await fetch(
        "http://localhost:7001/api/puntoatencion/disponibles-cola"
      );
      const data = await res.json();

      if (data.ok) {
        let ordenados = (data.boxes || []).slice().sort((a, b) => {
          if (!a.fecha_disponible || !b.fecha_disponible) return 0;
          return (
            new Date(a.fecha_disponible).getTime() -
            new Date(b.fecha_disponible).getTime()
          );
        });

        // 🔒 No vuelvas a poner en la cola el que ya está en pantalla
        if (boxEnPantalla) {
          ordenados = ordenados.filter(
            (b) => b.id !== boxEnPantalla.id
          );
        }

        setBoxesDisponibles(ordenados);
      } else {
        setBoxesDisponibles([]);
      }
    } catch (err) {
      console.error("Error al obtener boxes disponibles:", err);
    }
  };

  // Inicialización de clima + polling de boxes/clima
  useEffect(() => {
    obtenerBoxesDisponibles();
    obtenerClima();

    const intBoxes = setInterval(obtenerBoxesDisponibles, 3000);
    const intClima = setInterval(obtenerClima, 10 * 60 * 1000);

    return () => {
      clearInterval(intBoxes);
      clearInterval(intClima);
    };
    // importante: incluir boxEnPantalla para que el filtro se actualice
  }, [boxEnPantalla]); 

  // 🎬 EFECTO 1: elegir el siguiente box cuando no hay uno en pantalla
  useEffect(() => {
    if (boxEnPantalla) return; // ya estamos mostrando uno
    if (!boxesDisponibles || boxesDisponibles.length === 0) return;

    const siguiente = boxesDisponibles[0];
    if (!siguiente || !siguiente.id) return;

    setBoxEnPantalla(siguiente);
    reproducirCampana();
  }, [boxesDisponibles, boxEnPantalla]);

  // ⏱ EFECTO 2: cuando se setea un boxEnPantalla, después de 5s lo marca ocupado y libera
  useEffect(() => {
    if (!boxEnPantalla) return;

    const timeout = setTimeout(async () => {
      try {
        await fetch(
          `http://localhost:7001/api/puntoatencion/${boxEnPantalla.id}/ocupado`,
          { method: "POST" }
        );
      } catch (err) {
        console.error("Error al marcar box ocupado:", err);
      } finally {
        // Lo removemos de la cola local
        setBoxesDisponibles((prev) =>
          prev.filter((b) => b.id !== boxEnPantalla.id)
        );
        // Liberamos para que el efecto anterior tome el siguiente
        setBoxEnPantalla(null);
      }
    }, TIEMPO_MOSTRAR_MS);

    return () => clearTimeout(timeout);
  }, [boxEnPantalla]);

  return (
    <>
      {/* Mismo fondo de video que PublicTurnos */}
      <video id="bg-video" autoPlay muted loop>
        <source src="/institucional3.webm" type="video/webm" />
      </video>

      <Box className="pantalla">
        {/* Logo principal */}
        <Box className="logo">
          <img src="/empresalargo.png" alt="Logo" style={{ width: 1000 }} />
        </Box>

        {/* Contenedor principal con misma estructura que PublicTurnos */}
        <Box className="contenedor">
          {/* Panel central – sin tabla, solo mensaje grande de BOX disponible */}
          <Paper
            elevation={4}
            className={`panel panel-translucido turnos ${
              boxEnPantalla ? "borde-llamado" : ""
            }`}
          >
            {boxEnPantalla ? (
              <Box className="animacion-fade">
                <Typography variant="h3" align="center">
                  Punto de Atención Disponible
                </Typography>
                <Typography
                  variant="h1"
                  align="center"
                  style={{
                    marginTop: 20,
                    fontWeight: "bold",
                    fontSize: "6rem",
                    textShadow: "0 0 10px rgba(0,0,0,0.4)",
                  }}
                >
                  {boxEnPantalla.nombre || `BOX ${boxEnPantalla.id}`}
                </Typography>
                <Typography
                  variant="h5"
                  align="center"
                  style={{ marginTop: 20 }}
                >
                  Diríjase únicamente cuando vea su BOX en pantalla.
                </Typography>
              </Box>
            ) : (
              <Box className="animacion-fade">
                <Typography variant="h3" align="center">
                  Esperando BOX disponible...
                </Typography>
                <Typography
                  variant="h5"
                  align="center"
                  style={{ marginTop: 20 }}
                >
                  Por favor, permanezca atento a esta pantalla.
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  style={{ marginTop: 10, opacity: 0.8 }}
                >
                  Cuando un punto de atención quede libre, se mostrará aquí
                  durante algunos segundos.
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Columna lateral – igual a PublicTurnos: reloj + clima + icono + video */}
          <Box
            style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}
          >
            <Box style={{ display: "flex", gap: 20 }}>
              <Paper elevation={3} className="panel panel-translucido reloj">
                <Typography variant="h6">🕒 Reloj Digital</Typography>
                <Typography variant="h4" className="hora-digital">
                  {horaActual}
                </Typography>
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

        {/* Botón inferior – igual estructura que PublicTurnos */}
        <Button
          variant="contained"
          color="primary"
          onClick={reproducirCampana}
          fullWidth
        >
          Buscar
        </Button>
      </Box>
    </>
  );
}
