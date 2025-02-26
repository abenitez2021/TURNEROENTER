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
export const routes = [
  {
    path: "/",
    label: "Inicio",
    component: Tablero,
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
    path: "/movimientos/contraseña",
    label: "Cambiar contraseña",
    component: Contraseña,
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
    path: "*",
    label: "Error en la página",
    component: NotFound,
  },
];
