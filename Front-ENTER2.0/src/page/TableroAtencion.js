import React, { useEffect, useState } from "react";
import {
    Grid,
    Card,
    CardHeader,
    Avatar,
    Typography,
} from "@material-ui/core";
import { useStyles } from "../assets/styles/CustomStyles";
import PersonIcon from "@material-ui/icons/Person";
import TimerIcon from "@material-ui/icons/Timer";
import DoneIcon from "@material-ui/icons/Done";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import CancelIcon from "@material-ui/icons/Cancel";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import axios from "../utils/axios";
import BackdropCustom from "../components/BackdropCustom";

import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';
import { BarChart } from "recharts";
import { XAxis } from "recharts";
import { YAxis } from "recharts";
import { Bar } from "recharts";

export default function TableroAtencion() {
    const classes = useStyles();
    const [data, setData] = useState({
        finalizados: 0,
        pendientes: 0,
        atendiendo: 0,
        cancelados: 0,
        reasignados: 0,
        promedio_espera: "0 min",
    });
    const [loading, setLoading] = useState(false);
    const [tiemposEspera, setTiemposEspera] = useState([]);

    const [ultimosTurnos, setUltimosTurnos] = useState([]);



    const getResumenAtenciones = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/informes/resumen-atencion"); // ← Corregida la ruta
            if (response.status === 200) {
                const res = response.data;
                setData({
                    finalizados: parseInt(res.total_finalizados) || 0,
                    pendientes: parseInt(res.total_pendientes) || 0,
                    atendiendo: parseInt(res.total_atendiendo) || 0,
                    cancelados: parseInt(res.total_cancelados) || 0,
                    reasignados: parseInt(res.total_reasignados) || 0,
                    promedio_espera: `${parseFloat(res.promedio_espera_min).toFixed(1)} min` || "0 min",
                });
            }
        } catch (err) {
            console.error("Error al obtener resumen de atenciones", err);
        } finally {
            setLoading(false);
        }
    };
    const obtenerInformeTiemposEspera = async () => {


        const hoy = new Date();
        const fechaDesde = hoy.toLocaleDateString('en-CA'); // Evita desfase de timezone

        const mañana = new Date(hoy);
        mañana.setDate(hoy.getDate() + 1);
        const fechaHasta = mañana.toLocaleDateString('en-CA');

        try {
            const response = await axios.post("/informes/informe-tiempos-espera", {
                fechaDesde,
                fechaHasta
            });

            if (response.status === 200 && response.data.ok) {
                setTiemposEspera(response.data.result);
            }
        } catch (error) {
            console.error("Error al cargar informe de tiempos de espera", error);
        }
    };

    const obtenerUltimosTurnos = async () => {
        try {
            const res = await fetch("http://localhost:7001/api/turnos/ultimos-llamados");
            const data = await res.json();
            if (data.ok) {
                setUltimosTurnos(data.turnos.slice(0, 10)); // Mostramos solo los 10 primeros
            }
        } catch (err) {
            console.error("Error al obtener turnos:", err);
        }
    };



    useEffect(() => {
        getResumenAtenciones();
        obtenerGraficoTramites();
        obtenerGraficoUsuarios();
        obtenerInformeTiemposEspera();
        obtenerUltimosTurnos();


        const interval = setInterval(() => {
            getResumenAtenciones();
            obtenerGraficoTramites();
            obtenerGraficoUsuarios();
            obtenerInformeTiemposEspera();
            obtenerUltimosTurnos();

        }, 15000); // cada 15 segundos

        return () => clearInterval(interval); // cleanup
    }, []);

    const [graficoTramites, setGraficoTramites] = useState([]);

    const [graficoUsuarios, setGraficoUsuarios] = useState([]);

    const obtenerGraficoTramites = async () => {
        const hoy = new Date();
        const fechaDesde = hoy.toLocaleDateString('en-CA'); // Evita desfase de timezone

        const mañana = new Date(hoy);
        mañana.setDate(hoy.getDate() + 1);
        const fechaHasta = mañana.toLocaleDateString('en-CA');


        try {
            const response = await axios.post("/informes/grafico-tramites", {
                fechaDesde,
                fechaHasta,
            });

            if (response.status === 200 && response.data.ok) {
                const data = response.data.result.map((item) => ({
                    name: item.tramite,
                    value: parseInt(item.cantidad),
                    color: getRandomColor(),
                }));
                setGraficoTramites(data);
            }
        } catch (error) {
            console.error("Error al cargar gráfico de trámites", error);
        }
    };


    const obtenerGraficoUsuarios = async () => {

        const hoy = new Date();
        const fechaDesde = hoy.toLocaleDateString('en-CA'); // Evita desfase de timezone

        const mañana = new Date(hoy);
        mañana.setDate(hoy.getDate() + 1);
        const fechaHasta = mañana.toLocaleDateString('en-CA');


        try {
            const response = await axios.post("/informes/grafico-usuarios", {
                fechaDesde,
                fechaHasta,
            });
            console.log("estadistica usuario", response);
            console.log("fecha hoy", fechaDesde, " fecha mañana: ", fechaHasta)
            if (response.status === 200 && response.data.ok) {
                const data = response.data.result.map((item) => ({
                    name: item.USUARIO,
                    value: parseInt(item.CANTIDAD),
                    color: getRandomColor(),
                }));
                setGraficoUsuarios(data);
            }
        } catch (error) {
            console.error("Error al cargar gráfico de usuarios llamadores", error);
        }
    };


    const getRandomColor = () =>
        `#${Math.floor(Math.random() * 16777215).toString(16)}`;

    return (
        <>
            <BackdropCustom open={loading} />

            {/* Título principal */}
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h6">Tablero de Atenciones</Typography>
                </Grid>

                {/* Tarjetas resumen: pendientes, finalizados, etc. */}
                {[
                    { color: "#2e7d32", icon: <DoneIcon />, label: "Finalizados", value: data.finalizados },
                    { color: "#1565c0", icon: <PersonIcon />, label: "Pendientes", value: data.pendientes },
                    { color: "#6a1b9a", icon: <AssignmentTurnedInIcon />, label: "Atendiendo", value: data.atendiendo },
                    { color: "#ef6c00", icon: <AutorenewIcon />, label: "Reasignados", value: data.reasignados },
                    { color: "#c62828", icon: <CancelIcon />, label: "Cancelados", value: data.cancelados },
                    { color: "#00838f", icon: <TimerIcon />, label: "Promedio Espera", value: data.promedio_espera }
                ].map((item, index) => (
                    <Grid item xs={12} sm={6} md={2} key={index}>
                        <Card>
                            <CardHeader
                                avatar={<Avatar style={{ backgroundColor: item.color }}>{item.icon}</Avatar>}
                                title={item.label}
                                subheader={item.value}
                            />
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Sección 1 y 2: Gráficos de trámites y atenciones por usuario */}
            <Grid container spacing={4} style={{ marginTop: 16 }}>
                {/* Sección 1: Trámites más usuales */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardHeader title="Trámites más usuales (hoy)" />
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <PieChart width={350} height={350}>
                                <Pie
                                    data={graficoTramites}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={120}
                                    label
                                >
                                    {graficoTramites.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </div>
                    </Card>
                </Grid>

                {/* Sección 2: Gráfico de atenciones por usuario llamador (barra horizontal) */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardHeader title="Atenciones por Usuario Llamador (hoy)" />
                        <div style={{ padding: 16 }}>
                            <BarChart
                                width={500}
                                height={300}
                                data={graficoUsuarios}
                                layout="vertical"
                                margin={{ top: 20, right: 30, left: 40, bottom: 10 }}
                            >
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value">
                                    {graficoUsuarios.map((entry, index) => (
                                        <Cell key={`bar-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </div>
                    </Card>
                </Grid>

            </Grid>

            {/* Sección 3: Informe de Tiempos de Espera */}
            <Grid item xs={12} style={{ marginTop: 32 }}>
                <Card>
                    <CardHeader title="Informe de Tiempos de Espera (hoy)" />
                    <div style={{ padding: 16, overflowX: "auto" }}>
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
                                {tiemposEspera.map((item, index) => (
                                    <tr key={index}>
                                        <td style={{ border: "1px solid #ccc", padding: 8 }}>{item.tramite}</td>
                                        <td style={{ border: "1px solid #ccc", padding: 8 }}>{item.punto}</td>
                                        <td style={{ border: "1px solid #ccc", padding: 8 }}>{item.usuario}</td>
                                        <td style={{ border: "1px solid #ccc", padding: 8 }}>{parseFloat(item.tiempo_promedio).toFixed(1)}</td>
                                        <td style={{ border: "1px solid #ccc", padding: 8 }}>{item.tiempo_maximo}</td>
                                        <td style={{ border: "1px solid #ccc", padding: 8 }}>{item.tiempo_minimo}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </Grid>

            {/* Sección 4: Últimos Turnos Llamados */}
            <Grid item xs={12} style={{ marginTop: 32 }}>
                <Card>
                    <CardHeader title="Últimos Turnos Llamados" />
                    <div style={{ padding: 16, overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                            <thead>
                                <tr>
                                    <th style={{ border: "1px solid #ccc", padding: 8 }}>Turno</th>
                                    <th style={{ border: "1px solid #ccc", padding: 8 }}>Visitante</th>
                                    <th style={{ border: "1px solid #ccc", padding: 8 }}>Punto</th>
                                    <th style={{ border: "1px solid #ccc", padding: 8 }}>Hora de Llamado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ultimosTurnos.map((turno, index) => (
                                    <tr key={index}>
                                        <td style={{ border: "1px solid #ccc", padding: 8 }}>{turno.codigo_turno}</td>
                                        <td style={{ border: "1px solid #ccc", padding: 8 }}>{turno.nombre_visitante }{" "}{turno.apellido_visitante} </td>
                                        <td style={{ border: "1px solid #ccc", padding: 8 }}>{turno.nombre_box}</td>
                                        <td style={{ border: "1px solid #ccc", padding: 8 }}>{new Date(turno.fecha_llamado).toLocaleTimeString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </Grid>
        </>

    );

}
