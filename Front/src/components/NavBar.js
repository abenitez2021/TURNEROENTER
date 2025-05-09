import React, { useState, memo, useContext, useEffect } from "react";
import clsx from "clsx";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import { useHistory } from "react-router-dom";
import List from "@material-ui/core/List";
import Drawer from "@material-ui/core/Drawer";
import Chip from "@material-ui/core/Chip";
import logo from "../assets/images/logo-color.png"
// import logo from "../assets/images/logo.png";
import AvatarIcon from "../assets/images/avatar.png";
import Avatar from "@material-ui/core/Avatar";
import Exit from "@material-ui/icons/ExitToApp";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import UserContext from "../utils/user/UserContext";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import ListIcon from '@material-ui/icons/List';
import DashboardIcon from '@material-ui/icons/Dashboard';
import TypographyBold from "./TypographyBold";
import Button from "@material-ui/core/Button";
import swal from "sweetalert";

import axios from "../utils/axios";
import { alertWarningError, } from "../components/Notificaciones";


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    //  background: "rgb(96, 235, 82)",
    //background: "linear-gradient(140deg,rgba(11, 190, 113, 1) 0%,rgb(255 ,234 , 234 ) 100%)",
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 12px",
    ...theme.mixins.toolbar,
    backgroundColor: "#FFFFFF	",
  },

  appBar: {
    backgroundColor: "#157592",
    color: "#ffffff",
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(0), // permite ajustar si se oculta o no todo el menu lateral , valor original 7
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(0),// permite ajustar si se oculta o no todo el menu lateral, valor original 9
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },

  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },

  active: {
    backgroundColor: "rgb(0 74 173 / 20%)",
  },

  activeModule: {

    backgroundColor: "rgb(240 159 84  / 30% )",
  },
  nested: {
    paddingLeft: theme.spacing(2),
  },
  agrupador: {
    margin: theme.spacing(2, 1, 1, 2),
    color: "#6b6e71",
  },
}));

const drawerWidth = 230;

function NavBar() {
  const history = useHistory();
  const userContext = useContext(UserContext);
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [auth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const openMenu = Boolean(anchorEl);
  const pathName = window.location.pathname.split("/");
  const classes = useStyles();

  const [marcarButtonText, setMarcarButtonText] = useState("Marcar Entrada");

  useEffect(() => {
    // Escucha cambios en userContext.state.marcacion y actualiza marcarButtonText
    if (userContext.state.marcacion === "Entrada") {
      setMarcarButtonText("Marcar Salida");
    } else {
      setMarcarButtonText("Marcar Entrada");
    }
  }, [userContext.state.marcacion]);


  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const marcarSalidaUsuario = async () => {
    setIsLoading(true);
    let url = "/marcacion/marcar"
    try {
      const response = await axios.post(url)

      let status = response.status;
      if (status === 200) {

        userContext.clearUser();
        history.push("/");

      }
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        alertWarningError(error.response);
      }
    }
  };

  const marcarEntradaUsuario = async () => {
    setIsLoading(true);
    let url = "/marcacion/marcar"
    try {
      const response = await axios.post(url)

      let status = response.status;
      if (status === 200) {
        userContext.updateMarcacion("Entrada")
        swal("¡OPERACIÓN EXITOSA!", {
          icon: "success",
          buttons: false,
          timer: 1500,
        });

      }
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        alertWarningError(error.response);
      }
    }
  };

  const handleMarcarSalida = (event, props) => {
    event.stopPropagation();
    swal({
      title: "¡ATENCIÓN!",
      text: `¿Deseas marcar tu SALIDA del sistema?`,
      icon: "warning",
      buttons: true,
      buttons: ["Cancelar", "Confirmar"],
      confirmButtonColor: "#43a047",
    }).then((willDelete) => {
      if (willDelete) {
        marcarSalidaUsuario()
      }
    });
  };


  const handleMarcarEntrada = (event, props) => {
    event.stopPropagation();
    swal({
      title: "¡ATENCIÓN!",
      text: `¿Deseas marcar tu ENTRADA al sistema?`,
      icon: "warning",
      buttons: true,
      buttons: ["Cancelar", "Confirmar"],
      confirmButtonColor: "#43a047",
    }).then((willDelete) => {
      if (willDelete) {
        marcarEntradaUsuario()
      }
    });
  };

  const handleSalirHover = () => {
    swal("¿Desea cerrar sesión?", {
      buttons: ["Cancelar", "Cerrar Sesión"],
      dangerMode: true,
    }).then((willLogout) => {
      if (willLogout) {
        userContext.clearUser();
        history.push("/acceder");
      }
    });
  };

  return (
    <>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, open && classes.appBarShift)}
        style={{
          boxShadow:
            "0px 1px 1px -1px rgb(0 0 0 / 10%), 0px 1px 3px 0px rgb(0 0 0 / 4%), 0px 1px 5px 0px rgb(0 0 0 / 12%)",
        }}
      >

        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>

          {open && (
            <IconButton color="inherit" onClick={handleDrawerClose}>
              <MenuOpenIcon />
            </IconButton>
          )}

          <ListItem style={{ paddingTop: 0, paddingBottom: 0 }}></ListItem>

          {auth && (
            <div>
              <List
                className={classes.root}
                style={{ paddingTop: 0, paddingBottom: 0, width: 1000 }}
              >
                <ListItem
                  button
                  onClick={handleMenu}
                  style={{ width: 600 }}
                >
                  <ListItemText primary={userContext.state.nombre + " " + userContext.state.apellido + " - " + userContext.state.rol} />
                  {userContext.state.rol === "Guardia" && (
                    <Button
                      style={{ marginRight: 5, backgroundColor: userContext.state.marcacion === "Entrada" ? "#EE273E" : "#43a047" }}
                      color="inherit"
                      variant="contained"
                      onClick={userContext.state.marcacion === "Entrada" ? handleMarcarSalida : handleMarcarEntrada}
                    >
                      {marcarButtonText}
                    </Button>
                  )}

                </ListItem>
              </List>

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={openMenu}
                onClose={handleClose}
              >
                <Divider />

                <MenuItem
                  onClick={(e) => {
                    userContext.clearUser();
                    history.push("/acceder");
                  }}
                >
                  <ListItemIcon onClick={() => handleClose()}>
                    <Exit color="secondary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Cerrar sesión" />
                </MenuItem>
              </Menu>
            </div>
          )}

          {/* Botón de Salir */}
          <IconButton
            color="inherit"
            onClick={handleSalirHover}
            style={{ marginLeft: "auto" }}
          >
            <Exit />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <img width={110} alt="Logo" src={logo} />
          <Chip
            variant="default"
            label="V2.0.1"
            size="small"
            style={{
              height: 15,
              fontSize: 8,
              marginLeft: 5,
              alignSelf: "end",
              marginBottom: 10,

              backgroundColor: "fff",
            }}
          />
        </div>
        <Divider />


        <>

          <List>
            {(userContext.state.rol === "Administrador"
              || userContext.state.rol === "Guardia") && (
                <ListItem
                  button
                  onClick={() => history.push("/")}
                  className={pathName?.[1] === "" && classes.active}
                >
                  <ListItemIcon style={{ minWidth: 30 }}>
                    <DashboardIcon fontSize="small" style={{ color: "#157592" }} />
                  </ListItemIcon>
                  <ListItemText secondary="Tablero de Visitas" />
                </ListItem>
              )}
              {(userContext.state.rol === "Administrador"
              || userContext.state.rol === "Supervisor") && (
                <ListItem
                  button
                  onClick={() => history.push("/atencion")}
                  className={pathName?.[1] === "atencion" && classes.active}
                >
                  <ListItemIcon style={{ minWidth: 30 }}>
                    <DashboardIcon fontSize="small" style={{ color: "#157592" }} />
                  </ListItemIcon>
                  <ListItemText secondary="Tablero de Atencion" />
                </ListItem>
              )}
            {(userContext.state.rol === "Administrador"
              || userContext.state.rol === "PANTALLA") && (
                <ListItem
                  button
                  onClick={() => history.push("/public-turnos")}
                  className={pathName?.[1] === "" && classes.active}
                >
                  <ListItemIcon style={{ minWidth: 30 }}>
                    <DashboardIcon fontSize="small" style={{ color: "#157592" }} />
                  </ListItemIcon>
                  <ListItemText secondary="Pantalla" />
                </ListItem>
              )}

            <List component="div" disablePadding>
              {(userContext.state.rol === "Administrador"
                || userContext.state.rol === "Guardia") && (
                  <TypographyBold variant="subtitle2" style={{ color: "#157592" }} className={classes.agrupador}>
                    Movimientos
                  </TypographyBold>)}
              {(userContext.state.rol === "Administrador"
                || userContext.state.rol === "Guardia") && (
                  <ListItem
                    button
                    onClick={() => history.push("/movimientos/lista-movimientos-dos")}
                    className={pathName?.[2] === "lista-movimientos-dos" && classes.active}
                  >
                    <ListItemIcon style={{ minWidth: 30 }}>
                      <ListIcon fontSize="small" style={{ color: "#157592" }} />
                    </ListItemIcon>
                    <ListItemText secondary="Control de Acceso" />
                  </ListItem>
                )}
              {userContext.state.rol === "Administrador" && (
                <ListItem
                  button
                  onClick={() => history.push("/movimientos/lista-movimientos-usuarios")}
                  className={pathName?.[2] === "lista-movimientos-usuarios" && classes.active}
                >
                  <ListItemIcon style={{ minWidth: 30 }}>
                    <ListIcon fontSize="small" style={{ color: "#157592" }} />
                  </ListItemIcon>
                  <ListItemText secondary="Marcaciones" />
                </ListItem>
              )}

              {(userContext.state.rol === "Administrador"
                || userContext.state.rol === "TURNERO") && (
                  <ListItem
                    button
                    onClick={() => history.push("/movimientos/turnero")}
                    className={pathName?.[2] === "turnero" && classes.active}
                  >
                    <ListItemIcon style={{ minWidth: 30 }}>
                      <ListIcon fontSize="small" style={{ color: "#157592" }} />
                    </ListItemIcon>
                    <ListItemText secondary="Turnero" />
                  </ListItem>)
              }
              {(userContext.state.rol === "Administrador"
                || userContext.state.rol === "LLAMADOR") && (
                  <ListItem
                    button
                    onClick={() => history.push("/movimientos/llamador")}
                    className={pathName?.[2] === "llamador" && classes.active}
                  >
                    <ListItemIcon style={{ minWidth: 30 }}>
                      <ListIcon fontSize="small" style={{ color: "#157592" }} />
                    </ListItemIcon>
                    <ListItemText secondary="Llamador" />
                  </ListItem>
                )}


            </List>

            <List component="div" disablePadding>
              {(userContext.state.rol === "Administrador"
                || userContext.state.rol === "Guardia") && (
                  <TypographyBold variant="subtitle2" style={{ color: "#157592" }} className={classes.agrupador}>
                    Visitas del día
                  </TypographyBold>
                )}
              {(userContext.state.rol === "Administrador"
                || userContext.state.rol === "Guardia") && (
                  <ListItem
                    button
                    onClick={() => history.push("/resumen/entradas/")}
                    className={pathName?.[2] === "entradas" && classes.active}
                  >
                    <ListItemIcon style={{ minWidth: 30 }}>
                      <ListIcon fontSize="small" style={{ color: "#157592" }} />
                    </ListItemIcon>
                    <ListItemText secondary="Entradas" />
                  </ListItem>
                )}
              {(userContext.state.rol === "Administrador"
                || userContext.state.rol === "Guardia") && (
                  <ListItem
                    button
                    onClick={() => history.push("/resumen/salidas")}
                    className={pathName?.[2] === "salidas" && classes.active}
                  >
                    <ListItemIcon style={{ minWidth: 30 }}>
                      <ListIcon fontSize="small" style={{ color: "#157592" }} />
                    </ListItemIcon>
                    <ListItemText secondary="Salidas" />
                  </ListItem>
                )}

              {(userContext.state.rol === "Administrador"
                || userContext.state.rol === "Guardia") && (
                  <ListItem
                    button
                    onClick={() => history.push("/resumen/permanencia/")}
                    className={pathName?.[2] === "permanencia" && classes.active}
                  >
                    <ListItemIcon style={{ minWidth: 30 }}>
                      <ListIcon fontSize="small" style={{ color: "#157592" }} />
                    </ListItemIcon>
                    <ListItemText secondary="Permanencia" />
                  </ListItem>
                )}
                {(userContext.state.rol === "Administrador"
                || userContext.state.rol === "Supervisor") && (
                  <ListItem
                    button
                    onClick={() => history.push("/resumen/informe-movimientos/")}
                    className={pathName?.[2] === "informe-movimientos" && classes.active}
                  >
                    <ListItemIcon style={{ minWidth: 30 }}>
                      <ListIcon fontSize="small" style={{ color: "#157592" }} />
                    </ListItemIcon>
                    <ListItemText secondary="Movimiento Atencion" />
                  </ListItem>
                )}
                {(userContext.state.rol === "Administrador"
                || userContext.state.rol === "Supervisor") && (
                  <ListItem
                    button
                    onClick={() => history.push("/resumen/grafico-usuarios/")}
                    className={pathName?.[2] === "grafico-usuario" && classes.active}
                  >
                    <ListItemIcon style={{ minWidth: 30 }}>
                      <ListIcon fontSize="small" style={{ color: "#157592" }} />
                    </ListItemIcon>
                    <ListItemText secondary="Grafico de Usuarios" />
                  </ListItem>
                )}
                {(userContext.state.rol === "Administrador"
                  || userContext.state.rol === "Supervisor") && (
                    <ListItem
                      button
                      onClick={() => history.push("/resumen/grafico-tramites/")}
                      className={pathName?.[2] === "grafico-tramites" && classes.active}
                    >
                      <ListItemIcon style={{ minWidth: 30 }}>
                        <ListIcon fontSize="small" style={{ color: "#157592" }} />
                      </ListItemIcon>
                      <ListItemText secondary="Grafico de Tramites" />
                    </ListItem>
                  )}
                  {(userContext.state.rol === "Administrador"
                  || userContext.state.rol === "Supervisor") && (
                    <ListItem
                      button
                      onClick={() => history.push("/resumen/tiempos-espera/")}
                      className={pathName?.[2] === "tiempos-espera" && classes.active}
                    >
                      <ListItemIcon style={{ minWidth: 30 }}>
                        <ListIcon fontSize="small" style={{ color: "#157592" }} />
                      </ListItemIcon>
                      <ListItemText secondary="Tiempos de Atencion" />
                    </ListItem>
                  )}
            </List>

            {userContext.state.rol === "Administrador" && (
              <List component="div" disablePadding>
                {userContext.state.rol === "Administrador" && (
                  <TypographyBold variant="subtitle2" style={{ color: "#157592" }} className={classes.agrupador}>
                    Gestión
                  </TypographyBold>
                )}
                {userContext.state.rol === "Administrador" && (
                  <ListItem
                    button
                    onClick={() => history.push("/gestion/lista-personas-visitantes/")}
                    className={pathName?.[2] === "lista-personas-visitantes" && classes.active}
                  >
                    <ListItemIcon style={{ minWidth: 30 }}>
                      <ListIcon fontSize="small" style={{ color: "#157592" }} />
                    </ListItemIcon>
                    <ListItemText secondary="Personas registradas" />
                  </ListItem>
                )}

                {userContext.state.rol === "Administrador" && (
                  <ListItem
                    button
                    onClick={() => history.push("/gestion/lista-usuarios-guardias")}
                    className={pathName?.[2] === "lista-usuarios-guardias" && classes.active}
                  >
                    <ListItemIcon style={{ minWidth: 30 }}>
                      <ListIcon fontSize="small" style={{ color: "#157592" }} />
                    </ListItemIcon>
                    <ListItemText secondary="Usuarios registrados" />
                  </ListItem>
                )}

                {userContext.state.rol === "Administrador" && (
                  <ListItem
                    button
                    onClick={() => {history.push("/gestion/lista-dependencias/")
                    }}
                    className={pathName?.[2] === "lista-dependencias" && classes.active}
                  >
                    <ListItemIcon style={{ minWidth: 30 }}>
                      <ListIcon fontSize="small" style={{ color: "#157592" }} />
                    </ListItemIcon>
                    <ListItemText secondary="Dependencias registradas" />
                  </ListItem>
                )}
                {userContext.state.rol === "Administrador" && (
                  <ListItem
                    button
                    onClick={() => history.push("/gestion/lista-puntoatencion/")}
                    className={pathName?.[2] === "lista-puntoatencion" && classes.active}
                  >
                    <ListItemIcon style={{ minWidth: 30 }}>
                      <ListIcon fontSize="small" style={{ color: "#157592" }} />
                    </ListItemIcon>
                    <ListItemText secondary="Puntos de Atencion" />
                  </ListItem>
                )}
                {userContext.state.rol === "Administrador" && (
                  <ListItem
                    button
                    onClick={() => history.push("/gestion/lista-tramites/")}
                    className={pathName?.[2] === "lista-tramites" && classes.active}
                  >
                    <ListItemIcon style={{ minWidth: 30 }}>
                      <ListIcon fontSize="small" style={{ color: "#157592" }} />
                    </ListItemIcon>
                    <ListItemText secondary="Tramites" />
                  </ListItem>
                )}

              </List>
            )}
            {(userContext.state.rol === "Administrador"
              || userContext.state.rol === "Guardia") && (
                <TypographyBold variant="subtitle2" style={{ color: "#157592" }} className={classes.agrupador}>
                  Configuración
                </TypographyBold>
              )}
            {(userContext.state.rol === "Administrador"
              || userContext.state.rol === "Guardia") && (
                <ListItem
                  button
                  onClick={() => history.push("/movimientos/contraseña")}
                  className={pathName?.[2] === "lista-movimientos-dos" && classes.active}
                >
                  <ListItemIcon style={{ minWidth: 30 }}>
                    <ListIcon fontSize="small" style={{ color: "#157592" }} />
                  </ListItemIcon>
                  <ListItemText secondary="Cambiar contraseña" />
                </ListItem>
              )}
              {(userContext.state.rol === "Administrador") && (
                <ListItem
                  button
                  onClick={() => history.push("/movimientos/errores")}
                  className={pathName?.[2] === "lista-movimientos-dos" && classes.active}
                >
                  <ListItemIcon style={{ minWidth: 30 }}>
                    <ListIcon fontSize="small" style={{ color: "#157592" }} />
                  </ListItemIcon>
                  <ListItemText secondary="Errores de lectura" />
                </ListItem>
              )}
          </List>


        </>

      </Drawer>
    </>
  );
}

export default memo(NavBar);
