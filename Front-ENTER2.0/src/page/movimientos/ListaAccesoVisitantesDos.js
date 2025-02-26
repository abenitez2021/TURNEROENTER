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

const initFiltro = {
  fechaDesde: null,
  fechaHasta: null,
  idVisita: null,
  marcacion: null,
  documento: null,
  idDependencia: null,
};

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
  fechaNacimiento: "",
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
  descripcion: "", //DESCRIPCION FUNCIONANDO HASTA AQUI
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
  descripcion: null, //Primera edicion 
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
const inicialDatosAdicionales = {
  idDependencia: "",
  codigoTarjeta: "",
};

export default function ListaAccesoVisitantesDos() {
  const history = useHistory();
  const userContext = useContext(UserContext);
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    content: [],
  });
  const [dependenciaList, setDependenciaList] = useState({
    content: [],
  });
  const [isLoadingEstado, setIsLoadingEstado] = useState(false);
  const [isLoadingComercio, setIsLoadingComercio] = useState(false);
  const [quitarFitro, setQuitarFiltro] = useState(false);

  //const [tipoDocumento, setTipoDocumento] = useState("");
  const [filtro, setFiltro] = useState(initFiltro);

  const [visitanteAcceso, setVisitanteAcceso] = useState(inicialValue);
  const [visita, setVisita] = useState(inicialScannerValue);

  const [isLoadingDependencia, setIsLoadingDependencia] = useState(false);
  const [dependencia, setDependencia] = useState({});
  const [socketConectado, setSocketConectado] = useState(true);

  useEffect(() => {
    getPedido();
    getDependencia();
    iniciarSocket();
  }, []);

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

  const handleExportPDF = () => {
    const doc = new jsPDF();

    const addHeader = (doc) => {
      // Función para añadir encabezado al PDF
      const imageWidth = 40;
      const imageHeight = 20;
      const textBackgroundHeight = 20;
      const textBackgroundX = 55;
      const textBackgroundY = 10;
      const textBackgroundWidth = doc.internal.pageSize.getWidth();
      const imageX = 10;
      const imageY = 10;

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

      const textX = 60;
      const textY = textBackgroundY + textBackgroundHeight / 2 + 6;
      const text = "REGISTRO DE ACCESOS";
      doc.text(text, textX, textY);

      doc.addImage(Logo, "PNG", imageX, imageY, imageWidth, imageHeight);
    };

    const totalRows = data.content.length;
    const rowsPerPage = 25;
    let currentPage = 1;
    let startIndex = 0;

    const tableHeader = [
      "Nombre",
      "Apellido",
      "Nro. Documento",
      "Entrada",
      "Salida",
      "Pais",
      "Depedencia",
      "Tarjeta Nro.",
      "Observacion",
    ];

    const tableStyles = {
      lineWidth: 0.3,
      lineColor: [0, 0, 0],
      cellPadding: 2,
    };

    const headerStyles = {
      fillColor: [70, 130, 180],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    };

    while (startIndex < totalRows || currentPage === 1) {
      if (currentPage > 1) {
        doc.addPage();
      }

      addHeader(doc);

      const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
      const tableData = [];
      for (let i = startIndex; i < endIndex; i++) {
        const row = data.content[i];
        if (row) {
          tableData.push([
            row.nombre || "",
            row.apellido || "",
            row.documento || "",
            row.entrada || "",
            row.salida || "",
            row.nacionalidad || "",
            row.dependencia || "",
            row.codigoTarjeta || "",
            row.Observacion || "",
          ]);
        } else {
          tableData.push(["", "", "", "", "", "", "", "", ""]);
        }
      }

      doc.autoTable({
        head: [tableHeader],
        body: tableData,
        startY: currentPage === 1 ? 40 : 40,
        theme: "grid",
        styles: tableStyles,
        headerStyles: headerStyles,
      });

      startIndex += rowsPerPage;
      currentPage++;

      doc.setPage(currentPage);
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(
        10,
        doc.internal.pageSize.getHeight() - 20,
        doc.internal.pageSize.getWidth() - 20,
        doc.internal.pageSize.getHeight() - 20
      );
    }

    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      const pageNumberString = `Página ${i} de ${totalPages}`;
      const printedDateString = `Fecha de impresión: ${new Date().toLocaleString()}`;
      const footerX = 10;
      const footerY = doc.internal.pageSize.getHeight() - 10;
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.text(pageNumberString, footerX, footerY - 5, { align: "left" });
      doc.text(printedDateString, footerX, footerY, { align: "left" });
    }

    const nombreArchivo = `REGISTRO-ACCESOS.pdf`;
    doc.save(nombreArchivo);
  };
  const getFiltro = async (props) => {
    setData({ ...data, content: [] });
    setIsLoading(true);
    setQuitarFiltro(true);

    let url = "visitas/listar/";
    try {
      const response = await axios.post(url, filtro);
      let status = response.status;
      if (status === 200) {
        const filtroResponse = response.data;
        console.log(filtroResponse);
        setData({
          ...data,
          content: filtroResponse?.result,
        });
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        alertWarningError(error.response);
      }
    }
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

  const getPedido = async () => {
    setIsLoading(true);
    setQuitarFiltro(false);
    setFiltro(initFiltro);
    let url = "visitas/listar/";
    try {
      const response = await axios.post(url, initFiltro);
      let status = response.status;
      if (status === 200) {
        const pedidos = response.data;
        setData({
          ...data,
          content: pedidos?.result,
        });

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
      const response = await axios.post(url, initFiltro);
      let status = response.status;
      if (status === 200) {
      }
    } catch (error) {
      if (error.response) {
        alertWarningError(error.response);
      }
    }
  };

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
  const handleChangeDescripcion = (event) => {
    let copyInput = {
      ...visitanteAcceso,
      descripcion: event.target.value.toUpperCase(), // Convertimos a mayúsculas
    };
    setVisitanteAcceso(copyInput);
  };

  const handleChangeCodigoTarjeta = (event) => {
    let copyInput = {
      ...visitanteAcceso,
      codigoTarjeta: event.target.value.toUpperCase(),
    };
    setVisitanteAcceso(copyInput);
  };

  // Función para actualizar los valores de visitanteAcceso - DEPRECADO
  // const actualizarVisitanteAcceso = () => {
  //   setVisitanteAcceso({
  //     ...visitanteAcceso,
  //     idDependencia: datosAdicionales.idDependencia,
  //     codigoTarjeta: datosAdicionales.codigoTarjeta
  //   });
  // };

  const handleGuardar = async () => {
    //actualizarVisitanteAcceso();

    console.log("Datos DEPOIS de actualizar", visitanteAcceso);

    if (visitanteAcceso.idDependencia === "") {
      // Si el idDependencia está vacío, muestra un mensaje de error
      swal("Es necesario elegir una dependencia", {
        icon: "warning",
        buttons: false,
        timer: 1500,
      });
      return; // Detiene la ejecución de la función
    }
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
          getPedido();
          setVisitanteAcceso(inicialValue);
          setVisita(inicialScannerValue);
          console.log("ESTO ES VISITA DESPUES DE BORRAR ", visita);
          setIsLoading(false);
          swal("¡OPERACIÓN EXITOSA!", {
            icon: "success",
            buttons: false,
            timer: 1500,
          });
          // history.goBack();
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

  const handleFechaDesde = (date) => {
    setFiltro({ ...filtro, fechaDesde: date });
  };

  const handleFechaHasta = (date) => {
    setFiltro({ ...filtro, fechaHasta: date });
  };

  //CAMBIOS PARA SOCKET

  const stompClientRef = useRef(null);

  const iniciarSocket = () => {
    console.log("Socket iniciando.");
    const socket = new SockJS("http://localhost:8087/ws"); // Reemplaza con tu URL y puerto
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

      if (contenido.correcto != "S") {
        //alert("Error de contenido de mensaje de socket: ");
        return;
      }

      // swal("Información recibida. Fecha "+contenido.fechaHora, {
      //   icon: "success",
      //   buttons: false,
      //   timer: 2000
      // });

      if (contenido.conPayload == "S") {
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
                value={filtro.fechaDesde}
                onChange={handleFechaDesde}
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
                value={filtro.fechaHasta}
                onChange={handleFechaHasta}
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
                getFiltro();
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
                    getPedido();
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

  const columns = [
    {
      title: "ID VISITA",
      field: "idVisita",
      width: "2%",
      // hidden: true,
      headerStyle: { fontWeight: "bold", textAlign: "center" },
    },
    {
      title: "FOTO",
      field: "urlFoto",
      width: "5%",
      render: (rowData) => {
        if (rowData?.urlFoto === null) {
          return (
            <img
              style={{ height: 50, width: 45, borderRadius: "10%" }}
              src={`${AvatarIcon}`}
            />
          );
        } else {
          let imag = rowData?.foto?.split(",");
          return (
            <img
              style={{ height: 50, width: 45, borderRadius: "10%" }}
              src={`${rowData?.urlFoto}`}
              onError={(e) => {
                e.target.src = AvatarIcon; // Establece el AvatarIcon si la carga de la imagen falla
              }}
            />
          );
        }
      },
      headerStyle: { fontWeight: "bold", textAlign: "center" },
    },

    {
      title: "ENTRADA",
      field: "entrada",
      width: "2%",
      render: (rowData) => rowData.entrada || "-",
      headerStyle: { fontWeight: "bold", textAlign: "center" }, //titulo en negrita y centrado
    },
    {
      title: "SALIDA",
      field: "salida",
      width: "2%",
      render: (rowData) => rowData.salida || "-",
      headerStyle: { fontWeight: "bold", textAlign: "center" },
    },
    {
      title: "NOMBRE",
      field: "nombre",
      width: "10%",
      render: (rowData) => rowData.nombre.toUpperCase().toUpperCase(),
      headerStyle: { fontWeight: "bold", textAlign: "center" },
    },
    {
      title: "APELLIDO",
      field: "apellido",
      width: "10%",
      render: (rowData) => rowData.apellido.toUpperCase().toUpperCase(),
      headerStyle: { fontWeight: "bold", textAlign: "center" },
    },
    {
      title: "NRO DOCUMENTO",
      field: "documento",
      width: "5%",
      headerStyle: { fontWeight: "bold", textAlign: "center" },
    },
    {
      title: "NACIONALIDAD",
      field: "nacionalidad",
      width: "10%",
      render: (rowData) => rowData.nacionalidad.toUpperCase(),
      headerStyle: { fontWeight: "bold", textAlign: "center" },
    },
    {
      title: "DEPENDENCIA",
      field: "dependencia",
      width: "10%",
      render: (rowData) => rowData.dependencia.toUpperCase(),
      headerStyle: { fontWeight: "bold", textAlign: "center" },
    },
    {
      title: "TARJETA NRO.",
      field: "codigoTarjeta",
      width: "10%",
      headerStyle: { fontWeight: "bold", textAlign: "center" },
    },
    {
      title: "OBSERVACION.",
      field: "Observacion",
      width: "10%",
      headerStyle: { fontWeight: "bold", textAlign: "center" },
    },
  ];
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
        getPedido()();
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

  const handleDarSalidaVisitante = (event, props) => {
    event.stopPropagation();
    swal({
      title: "¡ATENCIÓN!",
      text: `¿Deseas marcar la salida a ${props.data?.nombre} ${props.data?.apellido}?`,
      icon: "warning",
      buttons: true,
      buttons: ["Cancelar", "Confirmar"],
      confirmButtonColor: "#43a047",
    }).then((willDelete) => {
      if (willDelete) {
        marcarSalidaVisitante(props.data);
      }
    });
  };

  const childrenAccions = (props) => {
    return (
      <>
        {props.data?.salida == null ? (
          <>
            <Box pl={1} pr={1}>
              <Chip
                onClick={(e) => handleDarSalidaVisitante(e, props)}
                label="Dar salida"
                variant="contened"
                color="secondary"
              />
            </Box>
          </>
        ) : (
          <Box pl={1} pr={1}></Box>
        )}
      </>
    );
  };

  return (
    <>
      {userContext.state.nombreUsu !== "" ? (
        <>
          <Grid container alignItems="center">
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
                    //handleGuardar();
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

                    <div style={{ marginTop: 10 }}>
                      <TextField
                        size="small"
                        autoFocus
                        variant="outlined"
                        id="codigoTarjeta"
                        name="codigoTarjeta"
                        label="Código Tarjeta Visitante"
                        value={visitanteAcceso.codigoTarjeta}
                        onChange={(value) => handleChangeCodigoTarjeta(value)}
                        type="text"
                        fullWidth
                        InputLabelProps={{
                          style: { color: "#333" },
                        }}
                        InputProps={{
                          style: { color: "#555" },
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: 10,
                      }}
                    >
                      {userContext.state.rol === "Guardia" &&
                        userContext.state.marcacion === "Entrada" ? (
                        <Button
                          style={{
                            width: "100%",
                            backgroundColor: "rgb(139, 0, 139)",
                          }}
                          color="primary"
                          variant="contained"
                          onClick={() => {
                            handleGuardar();
                          }}
                        >
                          Procesar Entrada
                        </Button>
                      ) : (
                        userContext.state.rol === "Guardia" && (
                          <p>
                            Debes marcar tu entrada para realizar marcaciones de
                            visitantes
                          </p>
                        )
                      )}
                    </div>
                  </Grid>
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
                            {...params}
                            variant="outlined"
                            label="Dependencia"
                            name="dependencia"
                            InputLabelProps={{
                              style: { color: "#333" },
                            }}
                            InputProps={{
                              style: { color: "#555" },
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {isLoadingDependencia ? (
                                    <CircularProgress
                                      color="primary"
                                      size={20}
                                    />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
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
                      <div style={{ marginTop: 10 }}>
                        <TextField
                          size="small"
                          autoFocus
                          variant="outlined"
                          id="descripcion"
                          name="descripcion"
                          label="Observacion"
                          value={visitanteAcceso.descripcion} // Cambiar al valor de descripción
                          onChange={handleChangeDescripcion} // Cambiar a la función que maneja el cambio de descripción
                          type="text"
                          fullWidth
                          InputLabelProps={{
                            style: { color: "#333" },
                          }}
                          InputProps={{
                            style: { color: "#555" },
                          }}
                        />
                      </div>
                    </Grid>
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

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <List>
              <ListItem>
                <ListItemText
                  primary="REGISTRO DE ACCESOS"
                  secondary="Visualiza los accesos registrados"
                />
              </ListItem>
            </List>
            {userContext.state.rol === "Administrador" && (
              <Box pl={1} pr={1} pb={2}>
                <Chip
                  onClick={() => handleExportPDF()}
                  label="Exportar Datos"
                  variant="outlined"
                  color="primary"
                />
              </Box>
            )}
          </Grid>

          <Grid container spacing={2} justify="center" alignItems="center">
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <MakeTables
                isLoading={isLoading}
                title={title}
                columns={columns}
                data={data.content}
                actions={actions}
                classes={classes}
                options={options}
                componentsAssets={{
                  classes,
                  childrenAccions,
                }}
              />
            </Grid>
          </Grid>
        </>
      ) : (
        <AccesoDenegado />
      )}
    </>
  );
}
