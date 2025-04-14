import NotFound from "./components/NotFound";
import Login from "./page/Login";
import Tablero from "./page/Tablero";
import NuevaDependencia from "./page/gestion/NuevaDependencia";
import ListaEntradasDia from "./page/servicios/ListaEntradasDia";
import ListaAccesoVisitantes from "./page/movimientos/ListaAccesoVisitantes";
import ListaAccesoUsuarios from "./page/movimientos/ListaAccesoUsuarios";
import ListasSalidasDia from "./page/servicios/ListasSalidasDia";
import ListaPermanenciaDia from "./page/servicios/ListaPermanenciaDia";
import ListaPersonasVisitantes from "./page/gestion/ListaPersonasVisitantes";
import ListaUsuarioGuardias from "./page/gestion/ListaUsuarioGuardias";
import ListaDependencia from "./page/gestion/ListaDependencia";
import ListaAccesoVisitantesDos from "./page/movimientos/ListaAccesoVisitantesDos";
import Contraseña from "./page/movimientos/Contraseña"
import ListaTramites from "./page/gestion/ListaTramites";
import NuevoTramite from "./page/gestion/NuevoTramite";
import Turnero from "./page/movimientos/Turnero";
import ListaPuntos from "./page/gestion/ListaPuntos";
import NuevoPunto from "./page/gestion/NuevoPunto";
import LlamadorTurnos from "./page/movimientos/LlamadorTurnos";
import PublicTurnos from "./page/PublicTurnos";
import TableroAtencion from "./page/TableroAtencion";
import InformeMovimientos from "./page/servicios/InformeMovimientos";
import InformeGraficoUsuarios from "./page/servicios/InformeGraficoUsuarios"
import InformeGraficoTramites from "./page/servicios/InformeGraficoTramites"
import InformeTiemposEspera from "./page/servicios/InformeTiemposEspera"

import ErroresLectura from"./page/movimientos/ErroresLectura"

export const routes = [
  {
    path: "/",
    label: "Inicio",
    component: Tablero,
  },
  {
    path: "/public-turnos",
    label: "Pantalla Pública",
    component: PublicTurnos,
  },
  {
    path: "/atencion",
   
    label: "Tablero de Atencion",
    component: TableroAtencion,
  },
  
  {
    path: "/acceder", 
    label: "INICIAR SESION",
    component: Login,
  },
  {
    path: "/gestion/lista-personas-visitantes",
    label: "Personas visitantes",
    component: ListaPersonasVisitantes,
  },
  {
    path: "/gestion/lista-usuarios-guardias",
    label: "Usuarios registrados",
    component: ListaUsuarioGuardias,
  },
  {
    path: "/gestion/lista-dependencias",
    label: "Dependencias registradas",
    component: ListaDependencia,
  },
  {
    path: "/gestion/alta-tramite",
    label: "Alta de tramites",
    component: NuevoTramite,
  },
  {
    path: "/gestion/lista-tramites",
    label: "Tramites",
    component: ListaTramites,
  },
  {
    path: "/gestion/alta-puntoatencion",
    label: "Alta de puntos",
    component: NuevoPunto,
  },
  {
    path: "/gestion/lista-puntoatencion",
    label: "Puntos de Atencion",
    component: ListaPuntos,
  },

  {
    path: "/gestion/alta-dependencia",
    label: "Alta de dependencia",
    component: NuevaDependencia,
  },
  {
    path: "/gestion/alta-dependencia",
    label: "Alta de dependencia",
    component: NuevaDependencia,
  },
  {
    path: "/movimientos/lista-movimientos",
    label: "Control de Acceso",
    component: ListaAccesoVisitantes,
  },
  {
    path: "/movimientos/lista-movimientos-dos",
    label: "Acceso de visitantes por marcación de guardias",
    component: ListaAccesoVisitantesDos,
  },
  {
    path: "/movimientos/turnero",
    label: "Turnero",
    component: Turnero,
  },
  {
    path: "/movimientos/llamador",
    label: "Llamador",
    component: LlamadorTurnos,
  },
  {
    path: "/movimientos/contraseña",
    label: "Cambiar contraseña",
    component: Contraseña,
  },
  {
    path: "/movimientos/errores",
    label: "Errores lectura",
    component: ErroresLectura,
  },
  {
    path: "/movimientos/lista-movimientos-usuarios",
    label: "Marcaciones",
    component: ListaAccesoUsuarios,
  },
  {
    path: "/resumen/entradas",
    label: "Entradas",
    component: ListaEntradasDia,
  },
  {
    path: "/resumen/salidas",
    label: "Salidas",
    component: ListasSalidasDia,
  },
  {
    path: "/resumen/permanencia",
    label: "Permanencia",
    component: ListaPermanenciaDia,
  },
  {
    path: "/resumen/informe-movimientos",
    label: "Informe Atencion",
    component: InformeMovimientos,
  },
  {
    path: "/resumen/grafico-usuarios",
    label: "Grafico Usuarios",
    component: InformeGraficoUsuarios,
  },
  {
    path: "/resumen/grafico-tramites",
    label: "Grafico Tramites",
    component: InformeGraficoTramites,
  },
  {
    path: "/resumen/tiempos-espera",
    label: "Grafico Tiempos",
    component: InformeTiemposEspera,
  },
  
  {
    path: "*",
    label: "Error en la página",
    component: NotFound,
  },
];
