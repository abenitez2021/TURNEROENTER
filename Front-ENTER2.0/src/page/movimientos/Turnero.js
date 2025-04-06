import React, { useEffect, useState, useContext, useRef } from "react";
import Stomp from "stompjs";
import SockJS from "sockjs-client";

import { MakeTables } from "../../components/MaterialTables/MakeTables";
import { useStyles } from "../../assets/styles/CustomStyles";
import { useHistory } from "react-router-dom";
import axios from "../../utils/axios";
import { Typography, Chip } from "@material-ui/core";
import {
  alertWarningError,
  notificacionEliminar,
  notificacionExitosa,
} from "../../components/Notificaciones";
import AccesoDenegado from "../../components/AccesoDenegado";
import UserContext from "../../utils/user/UserContext";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/AddCircle";
import TextField from "@material-ui/core/TextField";
import {
  Grid,
  Box,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  ListItemIcon,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { red } from "@material-ui/core/colors";
import swal from "sweetalert";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import CloseIcon from "@material-ui/icons/Close";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { notificacionAlerta } from "../../components/Notificaciones";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import AvatarIcon from "../../assets/images/avatar.png";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import Logo from "../../assets/images/logo-color.png";
import jsPDF from "jspdf";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import esLocale from "date-fns/locale/es";

import nacionalidades from "./Nacionalidades.json";
import frontal from "../../assets/images/ci_frontal.png";
import dorsal from "../../assets/images/ci_dorsal.png";
import foto from "../../assets/images/avatar.png"
import flecha from "../../assets/images/flecha_abajo.png"

import NavBar from "../../components/NavBar";



const inicialValue = {
  codigoTarjeta: "",
  nombre: "",
  apellido: "",
  documento: "",
  tipoDocumento: "",
  fechaNacimiento: "",
  idDependencia: "",
  codigoNacionalidad: "",
  nacionalidad: "",

  fechaExpiracionDocumento: "",
  fechaEmision: "",
  sexo: "",
  estadoCivil: "",
  identityCardNumber: "",
  idPuesto: null,
  TransactionID: "1",
  ComputerName: "",
  UserName: "",
  SDKVersion: "",
  FileVersion: "",
  DeviceType: "",
  DeviceNumber: "",
  DeviceLabelNumber: "",

};

const inicialScannerValue = {
  nombre: null,
  apellido: null,
  documento: null,
  tipoDocumento: null,
  foto: null,
  imagenFrente: null,
  imagenDorso: null,
  codigoNacionalidad: null,
  Nacionalidad: null,
  fechaNacimiento: null,
  fechaExpiracionDocumento: null,
  fechaEmision: null,
  sexo: null,
  estadoCivil: null,
  identityCardNumber: null,

  info: {
    TransactionID: null,
    DateTime: null,
    ComputerName: null,
    UserName: null,
    SDKVersion: null,
    FileVersion: null,
    DeviceType: null,
    DeviceNumber: null,
    DeviceLabelNumber: null,
  },
};

// Variables para almacenar valores temporales


export default function Turnero() {
  const history = useHistory();
  const userContext = useContext(UserContext);
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);

  //nuevo flujo del front
  const [mostrarPantallaInicio, setMostrarPantallaInicio] = useState(true);
  const [mostrarInstruccionDocumento, setMostrarInstruccionDocumento] = useState(false);
  const esTurnero = userContext.state.rol === "TURNERO";


  // hasta aqui


  const [data, setData] = useState({
    content: [],
  });
  const [dependenciaList, setDependenciaList] = useState({
    content: [],
  });
  const [tramiteList, setTramiteList] = useState({
    content: [],
  });
  const [isLoadingEstado, setIsLoadingEstado] = useState(false);
  const [isLoadingComercio, setIsLoadingComercio] = useState(false);
  const [quitarFitro, setQuitarFiltro] = useState(false);

  //const [tipoDocumento, setTipoDocumento] = useState("");


  const [visitanteAcceso, setVisitanteAcceso] = useState(inicialValue);
  const [visita, setVisita] = useState(inicialScannerValue);

  const [isLoadingDependencia, setIsLoadingDependencia] = useState(false);
  const [isLoadingTramite, setIsLoadingTramite] = useState(false);
  const [dependencia, setDependencia] = useState({});
  const [tramite, setTramite] = useState({});
  const [socketConectado, setSocketConectado] = useState(true);





  useEffect(() => {
    getDependencia();
    getTramites();
    iniciarSocket();

  }, []);


  const getDependencia = async () => {
    setIsLoadingDependencia(true);
    let url = "dependencias/listar/";
    try {
      const response = await axios.post(url);
      let status = response.status;
      if (status === 200) {
        const dependenciaResponse = response.data;
        setDependenciaList({
          ...dependenciaList,
          content: dependenciaResponse?.result,
        });
        console.log("esto hay en dependencia", dependenciaResponse?.result);
        setIsLoadingDependencia(false);
      }
    } catch (error) {
      setIsLoadingDependencia(false);
      if (error.response) {
        alertWarningError(error.response);
      }
    }
  };


  const getTramites = async () => {
    setIsLoadingTramite(true);
    let url = "tramites/listar";
    try {
      const response = await axios.get(url);
      let status = response.status;
      if (status === 200) {
        const tramiteResponse = response.data;
        console.log("Trámites obtenidos:", tramiteResponse); // 🔹 Revisa en consola
        setTramiteList({
          ...tramiteList,
          content: tramiteResponse, // 🔹 Corregí cómo se asignan los datos
        });
        setIsLoadingTramite(false);
      }
    } catch (error) {
      setIsLoadingTramite(false);
      if (error.response) {
        alertWarningError(error.response);
      }
    }
  };


  const addHeader = (doc) => {
    const imageWidth = 40; // Ancho de la imagen
    const imageHeight = 30; // Alto de la imagen
    const textBackgroundHeight = 30; // Alto del rectángulo de fondo para el texto
    const textBackgroundX = 55; // Comienza desde el borde izquierdo de la página
    const textBackgroundY = 10; // Coordenada Y del fondo para el texto
    const textBackgroundWidth = doc.internal.pageSize.getWidth(); // Ancho igual al ancho de la página
    const imageX = 10; // Posición izquierda
    const imageY = 10; // Posición arriba

    doc.setFillColor(70, 130, 180); // Violeta
    doc.rect(
      textBackgroundX,
      textBackgroundY,
      textBackgroundWidth,
      textBackgroundHeight,
      "F"
    );
    doc.setTextColor(255, 255, 255); // Blanco
    doc.setFontSize(16);

    const textX = 60; // Mover hacia la derecha
    const textY = textBackgroundY + textBackgroundHeight / 2 + 6;
    const text = "REGISTRO DE ACCESOS";
    doc.text(text, textX, textY);

    // Agregar la imagen al PDF
    doc.addImage(Logo, "PNG", imageX, imageY, imageWidth, imageHeight);
  };



  const getObtenerMarcación = async (idPuesto) => {
    setIsLoading(true);

    idPuesto = idPuesto || null;

    let url = "visitas/sdk-archivo/";
    try {
      const response = await axios.post(url, { idPuesto: idPuesto });
      let status = response.status;
      if (status === 200) {
        const pedidos = response.data;

        if (
          !pedidos.result.info ||
          Object.keys(pedidos.result.info).length === 0


        ) {
          // Si info no existe o es un objeto vacío, sal de la función ya que significa que no hay datos para leer
          setIsLoading(false);
          return;
        }
        setMostrarInstruccionDocumento(false);
        setVisitanteAcceso((prevVisitanteAcceso) => {
          return {
            ...prevVisitanteAcceso,
            codigoTarjeta:
              pedidos?.result?.codigoTarjeta ||
              prevVisitanteAcceso.codigoTarjeta,
            nombre: pedidos?.result?.nombre || prevVisitanteAcceso.nombre,
            apellido: pedidos?.result?.apellido || prevVisitanteAcceso.apellido,
            documento:
              pedidos?.result?.documento || prevVisitanteAcceso.documento,
            tipoDocumento:
              pedidos?.result?.tipoDocumento === "ID"
                ? "DOCUMENTO DE IDENTIDAD"
                : pedidos?.result?.tipoDocumento === "V"
                  ? "VISA"
                  : pedidos?.result?.tipoDocumento === "P"
                    ? "PASAPORTE"
                    : pedidos?.result?.tipoDocumento || prevVisitanteAcceso.tipoDocumento,
            fechaNacimiento:
              pedidos?.result?.fechaNacimiento ||
              prevVisitanteAcceso.fechaNacimiento,
            idDependencia:
              pedidos?.result?.idDependencia ||
              prevVisitanteAcceso.idDependencia,
            codigoNacionalidad:
              pedidos?.result?.codigoNacionalidad ||
              prevVisitanteAcceso.codigoNacionalidad,
            nacionalidad:
              pedidos?.result?.Nacionalidad || prevVisitanteAcceso.nacionalidad,
            fechaExpiracionDocumento:
              pedidos?.result?.fechaExpiracionDocumento ||
              prevVisitanteAcceso.fechaExpiracionDocumento,
            fechaEmision:
              pedidos?.result?.fechaEmision || prevVisitanteAcceso.fechaEmision,
            sexo: pedidos?.result?.sexo || prevVisitanteAcceso.sexo,
            estadoCivil:
              pedidos?.result?.estadoCivil || prevVisitanteAcceso.estadoCivil,
            identityCardNumber:
              pedidos?.result?.identityCardNumber ||
              prevVisitanteAcceso.identityCardNumber,
            TransactionID: pedidos?.result?.info?.TransactionID || "",
            DateTime: pedidos?.result?.info?.DateTime || "",
            ComputerName: pedidos?.result?.info?.ComputerName || "",
            UserName: pedidos?.result?.info?.UserName || "",
            SDKVersion: pedidos?.result?.info?.SDKVersion || "",
            FileVersion: pedidos?.result?.info?.FileVersion || "",
            DeviceType: pedidos?.result?.info?.DeviceType || "",
            DeviceNumber: pedidos?.result?.info?.DeviceNumber || "",
            DeviceLabelNumber: pedidos?.result?.info?.DeviceLabelNumber || "",
          };
        });

        setVisita(pedidos?.result);

        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        alertWarningError(error.response);
      }
    }
  };


  const getLimpiarLecturaFisica = async () => {
    let url = "visitas/eliminar-archivos-sdk/";
    try {
      const response = await axios.post(url);
      let status = response.status;
      if (status === 200) {
      }
    } catch (error) {
      if (error.response) {
        alertWarningError(error.response);
      }
    }
  };


  const onSelectDependencia = (e, value) => {
    console.log("esto hay en dependencia", dependencia);
    if (value && value?.idDependencia !== dependencia?.idDependencia) {
      setDependencia(value);
      let copyInput = {
        ...visitanteAcceso,
        idDependencia: value?.idDependencia,
      };
      setVisitanteAcceso(copyInput);
    }

    if (value === null) {
      setDependencia({});
      let copyInput = { ...visitanteAcceso, idDependencia: 0 };
      setVisitanteAcceso(copyInput);
    }
  };

  const onSelectTramite = (e, value) => {
    console.log("esto hay en tramites", tramite);
    if (value && value?.id !== tramite?.id) {
      setTramite(value);
      let copyInput = {
        ...visitanteAcceso,
        id: value?.id,
      };
      setVisitanteAcceso(copyInput);
    }

    if (value === null) {
      setTramite({});
      let copyInput = { ...visitanteAcceso, id: 0 };
      setVisitanteAcceso(copyInput);
    }
  };

  const handleChangeNombre = (event) => {
    let copyInput = {
      ...visitanteAcceso,
      nombre: event.target.value.toUpperCase(),
    };
    setVisitanteAcceso(copyInput);
  };

  const handleChangeApellido = (event) => {
    let copyInput = {
      ...visitanteAcceso,
      apellido: event.target.value.toUpperCase(),
    };
    setVisitanteAcceso(copyInput);
  };

  const handleChangeNroDocumento = (event) => {
    let copyInput = {
      ...visitanteAcceso,
      documento: event.target.value.toUpperCase(),
    };
    setVisitanteAcceso(copyInput);
  };
  const handleTipoDocumento = (event) => {
    console.log("valore seleccionado: ", event);
    let copyInput = {
      ...visitanteAcceso,
      tipoDocumento: event.target.value.toUpperCase(), // Convertimos a mayúsculas

    };
    setVisitanteAcceso(copyInput);

  };

  const nacionalidadItems = Object.keys(nacionalidades).map((code) => (
    <MenuItem key={code} value={code}>
      {nacionalidades[code]}
    </MenuItem>
  ));

  const handleChangeNacionalidad = (event) => {
    const codigoSeleccionado = event.target.value;
    const nombreNacionalidad = nacionalidades[codigoSeleccionado];

    setVisitanteAcceso((prevState) => ({
      ...prevState,
      nacionalidad: nombreNacionalidad,
    }));
  };

  const crearTurno = async () => {
    let urlTurno = "http://localhost:7001/api/turnos/crear";

    // ⏳ Formatear la fecha actual
    const fechaHora = new Date().toISOString().slice(0, 19).replace("T", " ");

    const turnoData = {
      id_tramite: visitanteAcceso.idTramite,  // ✅ Usa el trámite seleccionado
      nro_documento: visitanteAcceso.documento,
      nombre: visitanteAcceso.nombre,
      apellido: visitanteAcceso.apellido,
      fecha_hora: fechaHora,
      estado: "PENDIENTE",
      prioridad: "MEDIA",
      box: 2, // ✅ Puedes ajustar el box según la lógica de tu app
    };
    console.log("Hay en turnos", turnoData);
    try {
      const response = await axios.post(urlTurno, turnoData);

      if (response.status === 200 || response.status === 201) {
        console.log("✅ Turno creado exitosamente:", response.data);
        swal("¡Turno creado exitosamente!", {
          icon: "success",
          buttons: false,
          timer: 1500
        });
      } else {
        console.error("🚨 Error en la creación del turno:", response.data);
        notificacionAlerta("No se pudo crear el turno.");
      }
    } catch (error) {
      console.error("❌ Error en la solicitud al backend:", error);
      alertWarningError("Error al registrar el turno.");
    }
  };





  const handleGuardar = async () => {
    //actualizarVisitanteAcceso();

    console.log("Datos DEPOIS de actualizar", visitanteAcceso);

    if (visitanteAcceso.idTramite === "") {
      // Si el idDependencia está vacío, muestra un mensaje de error
      swal("Es necesario ingresar un Tramite", {
        icon: "warning",
        buttons: false,
        timer: 1500,
      });
      return; // Detiene la ejecución de la función
    }



    visitanteAcceso.idDependencia = 15;
    if (visitanteAcceso.nacionalidad === "") {
      // Si el idDependencia está vacío, muestra un mensaje de error
      swal("Es necesario ingresar una nacionalidad", {
        icon: "warning",
        buttons: false,
        timer: 1500,
      });
      return; // Detiene la ejecución de la función
    }


    if (visitanteAcceso.nombre === "") {
      // Si nombre está vacío, muestra un mensaje de error
      swal("Es necesario elegir el nombre", {
        icon: "warning",
        buttons: false,
        timer: 1500,
      });
      return; // Detiene la ejecución de la función
    }

    if (visitanteAcceso.apellido === "") {
      // Si apellido está vacío, muestra un mensaje de error
      swal("Es necesario ingresar el apellido", {
        icon: "warning",
        buttons: false,
        timer: 1500,
      });
      return; // Detiene la ejecución de la función
    }

    if (visitanteAcceso.documento === "") {
      // Si documentoestá vacío, muestra un mensaje de error
      swal("Es necesario ingresar el nro. de documento", {
        icon: "warning",
        buttons: false,
        timer: 1500,
      });
      return; // Detiene la ejecución de la función
    }

    // Itera sobre los resultados y verifica si hay alguna visita con salida pendiente
    //const tieneSalidaPendienteAlgunaVisita = data.content.some(tieneSalidaPendiente, visitanteAcceso.documento);
    const tieneSalidaPendienteAlgunaVisita = tieneSalidaPendiente(
      data.content,
      visitanteAcceso.documento
    );

    console.log("ver si tiene salida", tieneSalidaPendienteAlgunaVisita);

    if (tieneSalidaPendienteAlgunaVisita) {
      // Si apellido está vacío, muestra un mensaje de error
      swal(
        "La persona aún no ha realizado su salida para volver a ser registrada su entrada",
        {
          icon: "warning",
          buttons: false,
          timer: 3000,
        }
      );
      return; // Detiene la ejecución de la función
    }

    setIsLoading(true);
    let url = "visitas/registrar-entrada/";

    try {
      const response = await axios.post(url, visitanteAcceso);
      let status = response.status;
      if (status === 200) {
        if (response.data?.ok) {
          getLimpiarLecturaFisica();
          setDependencia({});
          //setTipoDocumento("");

          setVisitanteAcceso(inicialValue);
          setVisita(inicialScannerValue);
          console.log("ESTO ES VISITA DESPUES DE BORRAR ", visita);
          setIsLoading(false);
          swal("¡OPERACIÓN EXITOSA!", {
            icon: "success",
            buttons: false,
            timer: 1500,
          });
          // 2️⃣ **Ahora creamos el turno**
          await crearTurno();

        } else {
          setIsLoading(false);
          notificacionAlerta(response.data?.message);
        }
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        alertWarningError(error.response);
      }
    }
  };



  //CAMBIOS PARA SOCKET

  const stompClientRef = useRef(null);

  const iniciarSocket = () => {
    console.log("Socket iniciando.");
    const socket = new SockJS("http://localhost:8087/ws"); // Cambiando el puerto, por si acaso esto interfiera con el turnero
    const stompClient = Stomp.over(socket);
    stompClientRef.current = stompClient;

    // Conectar al servidor
    stompClient.connect({}, (frame) => {
      console.log("Socket Conectado:", frame);

      // Inicia el intervalo de ping
      // const pingInterval = setInterval(() => {
      //   if (stompClientRef.current.connected) {
      //     stompClientRef.current.send('/app/ping');
      //   }
      // }, 5000);

      // Suscribirse a un destino
      stompClient.subscribe("/topic/controlAccesoVisita", (message) => {
        console.log("Socket  Mensaje recibido:", message);
        procesarMensajeSocket(message);
      });
      setSocketConectado(true);
    });
  };

  const detenerSocket = () => {
    if (stompClientRef.current) {
      stompClientRef.current.disconnect(); // Cierra la conexión del socket
    }
    setSocketConectado(false); // Actualiza el estado para indicar que la conexión del socket está desactivada
  };

  const procesarMensajeSocket = (message) => {
    try {
      const contenido = JSON.parse(message.body);
      //atriburtos: correcto = S o N, conPayload = S o N, payload, idPuesto, fechaHora,

      if (contenido.correcto !== "S") {
        //alert("Error de contenido de mensaje de socket: ");
        return;
      }

      // swal("Información recibida. Fecha "+contenido.fechaHora, {
      //   icon: "success",
      //   buttons: false,
      //   timer: 2000
      // });

      if (contenido.conPayload === "S") {
        //ya trae la info en el  payload
        //se puede procesar para no llamar mas a la API
        getObtenerMarcación(Number(contenido.idPuesto));
      } else {
        //no trae, debe buscar en el API
        getObtenerMarcación(Number(contenido.idPuesto));
      }
    } catch (error) {
      alert("Error al procesar message de socket: " + error);
    }
  };

  // validacion de no permitir una nueva entrada si aun no tiene una salida

  function tieneSalidaPendiente(visitas, documentoBuscado) {
    if (!Array.isArray(visitas)) {
      console.error("El parámetro 'visitas' no es un array válido");
      return false;
    }

    return visitas.some(
      (visita) =>
        visita.documento === documentoBuscado &&
        visita.salida === null &&
        visita.entrada !== null
    );
  }

  const title = (
    <div>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Grid container spacing={3} style={{ padding: "15px" }}>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <DatePicker
                autoOk
                variant="inline"
                inputVariant="outlined"
                label="Desde"
                format="dd-MM-yyyy"


                fullWidth
                TextFieldComponent={(props) => (
                  <TextField
                    {...props}
                    InputLabelProps={{
                      shrink: true,
                      style: { padding: "2px", height: "5px", width: "5px" }, // Ajusta el padding aquí
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <DatePicker
                autoOk
                variant="inline"
                inputVariant="outlined"
                label="Hasta"
                format="dd-MM-yyyy"

                fullWidth
                TextFieldComponent={(props) => (
                  <TextField
                    {...props}
                    InputLabelProps={{
                      shrink: true,
                      style: { padding: "4px", height: "10px", width: "10px" }, // Ajusta el padding aquí
                    }}
                  />
                )}
              />
            </Grid>
          </MuiPickersUtilsProvider>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <Button
              size="small"
              color="secondary"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                console.log("Botón Filtrar clickeado");

              }}
            >
              Filtrar
            </Button>
            {quitarFitro && (
              <Tooltip title="Quitar filtros" arrow>
                <IconButton
                  aria-label="detalle"
                  size="small"
                  className={classes.iconButton}
                  onClick={() => {

                  }}
                >
                  <CloseIcon style={{ color: red[600] }} />
                </IconButton>
              </Tooltip>
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );

  const options = {
    filtering: false,
    exportButton: false,
    exportAllData: false,
    headerStyle: { position: "sticky", top: 0 },
    maxBodyHeight: "65vh",
    paging: true,
    // searchFieldAlignment:"left",
    //    showTitle:false,
    draggable: false,
    rowStyle: {
      fontSize: "small",
    },
  };
  const actions = [
    {
      icon: "save",
      tooltip: "place-holder",
      onClick: (event, rowData) => alert("You saved " + rowData.name),
      hidden: true,
    },
    {
      icon: "save",
      tooltip: "FreeActions-place-holder",
      isFreeAction: true,
      onClick: (event, rowData) => alert("You saved " + rowData.name),
      hidden: true,
    },
  ];

  // const handleDetalle = (event, props) => {
  //   event.stopPropagation();
  //   history.push("./detalle/", props.data);

  // };

  const marcarSalidaVisitante = async (props) => {
    setIsLoading(true);
    let url = "/visitas/salida";
    try {
      const response = await axios.post(url, {
        idVisita: props?.idVisita,
      });

      let status = response.status;
      if (status === 200) {

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



  return (
    <>
      {mostrarPantallaInicio && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#000",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            color: "#fff",
            textAlign: "center",
          }}
          onClick={() => {
            setMostrarPantallaInicio(false);
            setMostrarInstruccionDocumento(true);
          }}
          onTouchStart={() => {
            setMostrarPantallaInicio(false);
            setMostrarInstruccionDocumento(true);
          }}
        >
          <img
            src={Logo}
            alt="Logo"
            style={{ width: "200px", marginBottom: "30px" }}
          />
          <Typography variant="h4" style={{ fontSize: "2rem" }}>
            Toque la pantalla para iniciar
          </Typography>
        </div>
      )}

      {mostrarInstruccionDocumento && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <img
            src={`${flecha}`} // ⚠️ asegurate de tener esta imagen en `public/`
            alt="Coloque su cédula"
            style={{ width: "250px", marginBottom: "20px" }}
          />
          <Typography variant="h5">
            Coloque su cédula en la ranura <br /> <strong>FLECHA ABAJO</strong>
          </Typography>
        </div>
      )}

      {userContext.state.nombreUsu !== "" ? (
        <>
          <Grid container alignItems="center">
            {!esTurnero && (
              <>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <FiberManualRecordIcon
                          style={{ color: socketConectado ? "green" : "red" }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          socketConectado
                            ? "CONTROL DE ACCESO VIA SCANNER"
                            : "CONTROL DE ACCESO VIA CARGA MANUAL"
                        }
                        secondary="Registra los accesos a las dependencias desde aquí"
                      />
                    </ListItem>
                  </List>
                </Grid>

                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                  <Button
                    style={{
                      marginRight: 5,
                      backgroundColor: socketConectado ? "black" : "green",
                    }}
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      if (socketConectado) {
                        detenerSocket();
                      } else {
                        iniciarSocket();
                      }
                    }}
                  >
                    {socketConectado ? "Cargar Manualmente" : "Usar Scanner"}
                  </Button>

                  {userContext.state.rol === "Administrador" && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      style={{ marginRight: 5 }}
                      onClick={() => {
                        handleGuardar();
                        getObtenerMarcación();
                      }}
                    >
                      Obtener documentos
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    style={{ marginRight: 5 }}
                    onClick={() => {
                      iniciarSocket(); // Si necesitas que esta función se ejecute también
                      window.location.reload(); // Esto recarga la página
                      getLimpiarLecturaFisica();
                    }}
                    title="Actualizar conexión"
                  >
                    Refrescar conexión
                  </Button>
                </Grid>
              </>
            )}

          </Grid>

          <Card>
            <CardContent>
              <Grid
                container
                direction="row"
                justify="center"
                alignContent="center"
                spacing={3}
                style={{ paddingTop: 50 }}
              >
                {!esTurnero && (
                  <Grid item xs={3}>
                    <Box mb={3} style={{ textAlign: "-webkit-center" }}>
                      {visita.foto && visita.info ? ( // Validar visita.foto y visita.info
                        <>
                          <img
                            alt="Foto"
                            src={visita.foto || `${foto}`}
                            style={{
                              width: "50%",
                              height: "50%",
                            }}
                            onError={(e) => {
                              e.target.onerror = null; // Evita un bucle infinito
                              e.target.src = `${foto}`; // Cambia a ícono de cámara si hay error
                            }}
                          />
                          <Typography variant="body1">Foto</Typography>
                        </>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: 10,
                            width: "100%",
                            height: "100%",
                          }}
                        ></div>

                        // se comenta a pedido de Alejandro, no quiere que se muestre un placeholder de documento
                        // <img
                        //   alt="Foto"
                        //   src={logoW} // Mostrar la imagen predefinida
                        //   style={{
                        //     width: "100%", // Tamaño personalizado
                        //     height: "100%", // Tamaño personalizado
                        //   }}
                        // />
                      )}
                    </Box>
                  </Grid>
                )}
                {!esTurnero && (
                  <Grid item xs={3}>
                    <Box mb={3} style={{ textAlign: "-webkit-center" }}>
                      {visita.imagenFrente && visita.info ? ( // Validar visita.imagenFrente y visita.info
                        <>
                          <img
                            alt="Frente"
                            src={visita.imagenFrente || `${frontal}`}
                            style={{
                              width: "100%",
                              height: "100%",
                            }}
                            onError={(e) => {
                              e.target.onerror = null; // Evita un bucle infinito
                              e.target.src = `${frontal}`; // Cambia a ícono de cámara si hay error
                            }}
                          />
                          <div style={{ textAlign: "center", marginBottom: "20px" }}>

                          </div>





                          <Typography variant="body1">Frente</Typography>
                        </>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: 10,
                            width: "100%",
                            height: "100%",
                          }}
                        ></div>

                        // se comenta a pedido de Alejandro, no quiere que se muestre un placeholder de documento
                        // <img
                        //   alt="Frente"
                        //   src={logoW}
                        //   style={{
                        //     width: "100%",
                        //     height: "100%",
                        //   }}
                        // />
                      )}
                    </Box>
                  </Grid>
                )}
                {!esTurnero && (
                  <Grid item xs={3}>
                    <Box mb={3} style={{ textAlign: "-webkit-center" }}>
                      {visita.imagenDorso && visita.info ? ( // Validar visita.imagenDorso y visita.info
                        <>
                          <img
                            alt="Dorso"
                            src={visita.imagenDorso || `${dorsal}`}
                            style={{
                              width: "100%",
                              height: "100%",
                            }}
                            onError={(e) => {
                              e.target.onerror = null; // Evita un bucle infinito
                              e.target.src = `${dorsal}`; // Cambia a ícono de cámara si hay error
                            }}
                          />
                          <Typography variant="body1">Dorso</Typography>
                        </>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: 10,
                            width: "100%",
                            height: "100%",
                          }}
                        ></div>

                        // se comenta a pedido de Alejandro, no quiere que se muestre un placeholder de documento
                        // <img
                        //     alt="Frente"
                        //     src={logoW}
                        //     style={{
                        //       width: "100%",
                        //       height: "100%",
                        //     }}
                        //   />
                      )}
                    </Box>
                  </Grid>
                )}
              </Grid>
              {
                // userContext.state.rol === "Guardia" ? (
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignContent="center"
                  spacing={3}
                  style={{ paddingTop: 50 }}
                >
                  {!esTurnero && (
                    <Grid item xs={4} sm={4}>
                      <TextField
                        size="small"
                        autoFocus
                        variant="outlined"
                        id="documento"
                        name="documento"
                        label="Nro. Documento"
                        value={visitanteAcceso.documento}
                        onChange={(value) => handleChangeNroDocumento(value)}
                        type="text"
                        fullWidth
                        InputLabelProps={{
                          style: { color: "#333" },
                        }}
                        InputProps={{
                          style: { color: "#555" },
                        }}
                        disabled={socketConectado}
                      />
                      <div style={{ marginTop: 10 }}>
                        <TextField
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{
                            style: { color: "#333" },
                          }}
                          InputProps={{
                            style: { color: "#555" },
                          }}
                          disabled={socketConectado}
                          size="small"
                          label="Tipo Documento"
                          value={visitanteAcceso?.tipoDocumento || ""}
                          onChange={handleTipoDocumento}
                          select
                          SelectProps={{
                            displayEmpty: true,
                            renderValue: (selected) => selected,
                          }}
                        >
                          <MenuItem value="DOCUMENTO DE IDENTIDAD">DOCUMENTO DE IDENTIDAD.</MenuItem>
                          <MenuItem value="PASAPORTE">PASAPORTE</MenuItem>
                          <MenuItem value="VISA">VISA</MenuItem>
                        </TextField>
                      </div>
                      <div style={{ marginTop: 10 }}>
                        <TextField
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{
                            style: { color: "#333" },
                          }}
                          InputProps={{
                            style: { color: "#555" },
                          }}
                          disabled={socketConectado}
                          size="small"
                          label="Nacionalidad"
                          value={visitanteAcceso?.nacionalidad || ""}
                          onChange={handleChangeNacionalidad}
                          select
                          SelectProps={{
                            displayEmpty: true,
                            renderValue: (selected) => selected || "",
                          }}
                        >
                          {nacionalidadItems}
                        </TextField>
                      </div>


                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: 10,
                        }}
                      >




                      </div>
                    </Grid>
                  )}
                  {!esTurnero && (
                    <Grid item xs={4} sm={4}>
                      <TextField
                        size="small"
                        variant="outlined"
                        id="nombre"
                        name="nombre"
                        label="Nombre"
                        value={visitanteAcceso.nombre}
                        onChange={(value) => handleChangeNombre(value)}
                        type="text"
                        fullWidth
                        InputLabelProps={{
                          style: { color: "#333" },
                        }}
                        InputProps={{
                          style: { color: "#555" },
                        }}
                        disabled={socketConectado}
                      />
                      <div style={{ marginTop: 10 }}></div>
                      <TextField
                        size="small"
                        variant="outlined"
                        id="apellido"
                        name="apellido"
                        label="Apellido"
                        value={visitanteAcceso.apellido}
                        onChange={(value) => handleChangeApellido(value)}
                        type="text"
                        fullWidth
                        InputLabelProps={{
                          style: { color: "#333" },
                        }}
                        InputProps={{
                          style: { color: "#555" },
                        }}
                        disabled={socketConectado}
                      />

                      <Grid
                        item
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        style={{ marginTop: 10 }}
                      >
                        {/*}
                      <Autocomplete
                        id="idDependencia"
                        size="small"
                        value={
                          dependenciaList?.content.includes(dependencia)
                            ? dependencia
                            : null
                        }
                        onChange={onSelectDependencia}
                        options={dependenciaList?.content}
                        getOptionLabel={(option) =>
                          option.nombre ? option.nombre : ""
                        }
                        renderOption={(option) => (
                          <React.Fragment>{option?.nombre}</React.Fragment>
                        )}
                        isOptionDisabled={(option) => socketConectado}
                        loading={isLoadingDependencia}
                        filterSelectedOptions
                        renderInput={(params) => (
                          <TextField
                            size="small"
                            variant="outlined"
                            fullWidth
                            label="Dependencia seleccionada"
                            value={dependencia?.nombre || ""}
                            InputLabelProps={{ style: { color: "#333" } }}
                            InputProps={{ style: { color: "#555" } }}
                            disabled
                          />

                        )}
                      />
                      */}
                        <Autocomplete
                          id="idTramite"
                          size="small"
                          value={tramite} // ✅ Ahora está correctamente vinculado
                          onChange={onSelectTramite}
                          options={tramiteList?.content}
                          getOptionLabel={(option) => option.nombre ? option.nombre : ""}
                          renderOption={(option) => (
                            <React.Fragment>{option?.nombre}</React.Fragment>
                          )}
                          isOptionDisabled={(option) => socketConectado}
                          loading={isLoadingTramite}
                          filterSelectedOptions
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              variant="outlined"
                              fullWidth
                              label="Trámite seleccionado"
                              value={tramite?.nombre || ""} // ✅ Asegura que se refleje el trámite seleccionado
                              InputLabelProps={{ style: { color: "#333" } }}
                              InputProps={{ style: { color: "#555" } }}
                              disabled
                            />
                          )}
                        />

                      </Grid>

                      <Grid
                        item
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        style={{ marginTop: 10 }}
                      >

                      </Grid>
                    </Grid>
                  )}

                  {// Botones para dependencias que despues ya no se usan 
                  }

                  {/* Botones de dependencias 
                  <Grid container spacing={2} style={{ marginBottom: 10 }}>
                    {dependenciaList?.content?.map((dep) => (
                      <Grid item key={dep.idDependencia}>
                        <Button
                          variant={visitanteAcceso.idDependencia === dep.idDependencia ? "contained" : "outlined"}
                          color="primary"
                          onClick={() => {
                            setDependencia(dep);
                            setVisitanteAcceso((prev) => ({
                              ...prev,
                              idDependencia: dep.idDependencia,
                            }));
                          }}
                        >
                          {dep.nombre}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                  */}
                  {/* Botones de Tramites organizados en 3 columnas */}
                  {esTurnero && visitanteAcceso.nombre && (
                    <Typography variant="h5" align="center" style={{ marginBottom: "20px", marginTop: "20px" }}>
                      BIENVENIDO/A {visitanteAcceso.nombre.split(" ")[0]}. ¿QUE TRAMITE DESEA SOLICITAR?
                    </Typography>
                  )}

                  <Grid container spacing={2} style={{ marginBottom: 10 }}>
                    {tramiteList?.content?.length > 0 ? (
                      tramiteList.content.map((tra) => (
                        <Grid item xs={12} sm={4} md={4} key={tra.id}> {/* ✅ Organizado en 3 columnas */}
                          <Button
                            fullWidth
                            variant={visitanteAcceso.idTramite === tra.id ? "contained" : "outlined"}
                            color="primary"
                            onClick={() => {
                              setTramite(tra);
                              setVisitanteAcceso((prev) => ({
                                ...prev,
                                idTramite: tra.id,
                                tramiteNombre: tra.nombre,
                              }));

                              swal({
                                //title: `Te doy la bienvenida ${visitanteAcceso.nombre || ""}`,

                                title: ` `,
                                text: `¿Desea solicitar un Turno para: ${tra.nombre}?`,
                                icon: "info",
                                buttons: {
                                  cancel: {
                                    text: "Cancelar",
                                    visible: true,
                                    closeModal: true,
                                  },
                                  confirm: {
                                    text: "Confirmar",
                                    closeModal: true,
                                  },
                                },
                              }).then((confirmado) => {
                                if (confirmado) {
                                  handleGuardar(); // ✅ Ejecuta proceso completo
                                } else {
                                  // ❌ Limpia si cancela
                                  setTramite({});
                                  setVisitanteAcceso((prev) => ({
                                    ...prev,
                                    idTramite: "",
                                    tramiteNombre: "",
                                  }));
                                }
                              });
                            }}

                          >
                            {tra.nombre}
                          </Button>
                        </Grid>
                      ))
                    ) : (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">
                          No hay trámites disponibles.
                        </Typography>
                      </Grid>
                    )}
                  </Grid>


                </Grid>
              }
              {userContext.state.rol === "Administrador" && (
                <p>
                  Debes ser un Guardia para realizar marcaciones de visitantes
                </p>
              )}
            </CardContent>
          </Card>



        </>
      ) : (
        <AccesoDenegado />
      )}
    </>
  );

}
