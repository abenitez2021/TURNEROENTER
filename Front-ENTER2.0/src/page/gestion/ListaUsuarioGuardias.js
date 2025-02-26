import React, { useEffect, useState, useContext, useRef } from "react";
import { MakeTables } from "../../components/MaterialTables/MakeTables";
import { useStyles } from "../../assets/styles/CustomStyles";
import { useHistory } from "react-router-dom";
import axios from "../../utils/axios";
import { alertWarningError } from "../../components/Notificaciones";
import AccesoDenegado from "../../components/AccesoDenegado";
import UserContext from "../../utils/user/UserContext";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Grid, Box } from "@material-ui/core";
import Swal from 'sweetalert2';
import AvatarIcon from "../../assets/images/avatar.png";
import AvatarOld from "../../assets/images/avatar-old.png";
import logoW from "../../assets/images/ci_frontal.png";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import { Typography, Chip } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import {
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { notificacionAlerta } from "../../components/Notificaciones";
import swal from "sweetalert";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from "@material-ui/icons/AddCircle";
import Logo from "../../assets/images/logo-color.png";
import jsPDF from "jspdf";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Edit from "@material-ui/icons/Edit";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import esLocale from "date-fns/locale/es";

const initFiltro = {
  fechaDesde: null,
  fechaHasta: null,
  idRol: null,
  estado: null,
};

const inicialValue = {
  documento: "",
  password: "",
  nombre: "",
  apellido: "",
  idRol: "",
  idTipoDocumento: 1,
  tipoDocumento: "ID",
  email: "",
  celular: "",
  telefono: "",
  codigoNacionalidad: "PRY",
  nacionalidad: "PARAGUAYA",
  fechaNacimiento: "",
  fechaExpiracionDocumento: "",
  fechaEmision: "",
  sexo: "",
  estadoCivil: "",
};

const inicialScannerValue = {
  nombre: null,
  apellido: null,
  documento: null,
  password: "",
  idRol: "",
  email: "",
  idTipoDocumento: 1,
  tipoDocumento: null,
  foto: null,
  imagenFrente: null,
  imagenDorso: null,
  codigoNacionalidad: null,
  Nacionalidad: "PARAGUAYA",
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
const inicialDatosAdicionales = {
  password: "",
  correo: "",
  celular: "",
  idRol: "",
};

export default function ListaUsuarioGuardias() {
  const userContext = useContext(UserContext);
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    content: [],
  });
  const [dependenciaList, setDependenciaList] = useState({
    content: [],
  });
  const [isLoadingComercio, setIsLoadingComercio] = useState(false);
  const [quitarFitro, setQuitarFiltro] = useState(false);
  const [comercio, setComercio] = useState({});
  const [filtro, setFiltro] = useState(initFiltro);

  const [visitanteAcceso, setVisitanteAcceso] = useState(inicialValue);
  const [visita, setVisita] = useState(inicialScannerValue);
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [tipoRol, setTipoRol] = useState("");
  const [isLoadingDependencia, setIsLoadingDependencia] = useState(false);
  const [rol, setRol] = useState({});
  const [socketConectado, setSocketConectado] = useState(true);
  const [datosAdicionales, setDatosAdicionales] = useState(
    inicialDatosAdicionales
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleOpenModal = (rowData) => {
    setSelectedUser(rowData);
    setModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    getPedido();
    getRoles();
    getFiltro();
    //iniciarSocket()
  }, []);

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
      const text = "USUARIOS REGISTRADOS";
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
      "Celular",
      "Rol",
      "Fecha de Creacion",
      "Estado",
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
            row.celular || "",
            row.rol || "",
            row.fechacreate || "",
            row.estado || "",
          ]);
        } else {
          tableData.push(["", "", "", "", "", "", ""]);
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

    const nombreArchivo = `USUARIOS-REGISTRADOS.pdf`;
    doc.save(nombreArchivo);
  };

  const handleFechaDesde = (date) => {
    setFiltro({ ...filtro, fechaDesde: date });
  };

  const handleFechaHasta = (date) => {
    setFiltro({ ...filtro, fechaHasta: date });
  };
  const getFiltro = async () => {
    console.log("Fecha Desde:", filtro.fechaDesde);
    console.log("Fecha Hasta:", filtro.fechaHasta);
    setData({ ...data, content: [] });
    setIsLoading(true);
    setQuitarFiltro(true);

    let url = "usuarios/listarcrea/";
    try {
      const response = await axios.post(url, {
        fechaDesde: filtro.fechaDesde,
        fechaHasta: filtro.fechaHasta,
      });
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

  const getPedido = async () => {
    setIsLoading(true);
    setQuitarFiltro(false);
    setFiltro(initFiltro);
    setComercio({});
    let url = "usuarios/listar/";
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

  const getRoles = async () => {
    setIsLoadingDependencia(true);
    let url = "rolespantallas/rol-listar/";
    try {
      const response = await axios.post(url);
      let status = response.status;
      if (status === 200) {
        const dependenciaResponse = response.data;
        setDependenciaList({
          ...dependenciaList,
          content: dependenciaResponse?.result,
        });
        console.log("esto hay en roles", dependenciaResponse?.result);
        setIsLoadingDependencia(false);
      }
    } catch (error) {
      setIsLoadingDependencia(false);
      if (error.response) {
        alertWarningError(error.response);
      }
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

  const handleChangePassword = (event) => {
    // setDatosAdicionales({ ...datosAdicionales, password: event.target.value.toUpperCase() });
    let copyInput = {
      ...visitanteAcceso,
      password: event.target.value,
    };
    setVisitanteAcceso(copyInput);
  };
  const handleChangePasswordRequest = (props) => {
    if (!props.data || !props.data.idUsuario) {
      console.error('El ID del usuario no está definido');
      return;
    }

    Swal.fire({
      title: 'Cambiar Contraseña',
      input: 'password',
      inputLabel: 'Nueva Contraseña',
      inputPlaceholder: 'Ingrese la nueva contraseña',
      inputAttributes: {
        autocapitalize: 'off',
        id: 'newPasswordInput'  // Agregar un ID para acceder al campo de entrada
      },
      confirmButtonText: 'Cambiar',
      confirmButtonColor: '#EE273E',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#6c757d',
      showCancelButton: true,
      customClass: {
        container: 'p-4 bg-white rounded-lg shadow-lg',
        title: 'text-xl font-semibold text-gray-900',
        input: 'border-gray-300 rounded-md p-2 text-gray-700 relative',  // Asegúrate de que el campo sea 'relative'
        confirmButton: 'bg-red-600 text-white font-semibold py-2 px-4 rounded-md',
        cancelButton: 'bg-gray-400 text-white font-semibold py-2 px-4 rounded-md',
      },
      didOpen: () => {
        const input = document.getElementById('newPasswordInput');
        const togglePassword = document.createElement('button');
        togglePassword.type = 'button';
        togglePassword.style.position = 'absolute';
        togglePassword.style.right = '40px';
        togglePassword.style.top = '57%';
        togglePassword.style.transform = 'translateY(-50%)';
        togglePassword.style.cursor = 'pointer';
        togglePassword.style.background = 'transparent';
        togglePassword.style.border = 'none';
        togglePassword.style.padding = '0';

        // Función para alternar el tipo de entrada y cambiar el ícono SVG
        const updateIcon = () => {
          togglePassword.innerHTML = input.type === 'password' ?
            `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5 5 0 9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zM3.25 3.25l17.5 17.5-1.5 1.5L1.75 4.75 3.25 3.25z" fill="#000"/>
            </svg>`
            : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5 5 0 9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10a4 4 0 100 8 4 4 0 000-8z" fill="#000"/>
            </svg>`;
        };

        // Evento para alternar la visibilidad de la contraseña y el icono
        togglePassword.addEventListener('click', () => {
          input.type = input.type === 'password' ? 'text' : 'password';
          updateIcon();
        });

        // Inicializar el icono
        updateIcon();
        input.parentNode.style.position = 'relative';
        input.parentNode.appendChild(togglePassword);
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newPassword = result.value;
        // Aquí puedes hacer la solicitud al backend para actualizar la contraseña
        updatePassword(props.data.idUsuario, newPassword);
      }
    });
  };


  const updatePassword = async (idUsuario, newPassword) => {
    // Obtén el token de sessionStorage
    const storedData = sessionStorage.getItem('jwt-wom');
    const token = storedData ? JSON.parse(storedData).token : null;

    if (!token) {
      console.error('Token no encontrado en sessionStorage');
      return;
    }

    try {
      const response = await fetch(`http://localhost:7001/api/auth/cambiar-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id: idUsuario, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar la contraseña.');
      }

      const data = await response.json();
      console.log('Contraseña actualizada con éxito:', data);
      Swal.fire('Éxito', 'Contraseña actualizada con éxito', 'success');
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      Swal.fire('Error', 'Error al actualizar la contraseña', 'error');
    }
  };



  const handleChangeCorreo = (event) => {
    let copyInput = {
      ...visitanteAcceso,
      email: event.target.value.toUpperCase(),
    };
    setVisitanteAcceso(copyInput);
  };

  const handleChangeCelular = (event) => {
    let copyInput = {
      ...visitanteAcceso,
      celular: event.target.value.toUpperCase(),
    };
    setVisitanteAcceso(copyInput);
  };

  const onSelectRol = (e, value) => {
    console.log("esto hay en rol", rol);
    if (value && value?.idRol !== rol?.idRol) {
      setRol(value);
      visitanteAcceso.idRol = value?.idRol;
      let copyInput = { ...visitanteAcceso, idRol: value?.idRol };
      setVisitanteAcceso(copyInput);
    }

    if (value === null) {
      setRol({});
      let copyInput = { ...datosAdicionales, idRol: 0 };
      setDatosAdicionales(copyInput);
      //datosAdicionales.idRol = value?.idRol;
      // let copyInput = { ...visitanteAcceso, idRol: 0 };
      // setVisitanteAcceso(copyInput);
    }
  };

  // Función para actualizar los valores de visitanteAcceso
  // const actualizarVisitanteAcceso = () => {
  //   setVisitanteAcceso({
  //     ...visitanteAcceso,
  //     password: datosAdicionales.password,
  //     email: datosAdicionales.correo,
  //     celular: datosAdicionales.celular,
  //     idRol: datosAdicionales.idRol
  //   });
  // };

  //REGISTRAR USUARIO NUEVO

  const handleGuardar = async () => {
    const existingUser = data.content.find(
      (user) => user.documento === visitanteAcceso.documento
    );
    // actualizarVisitanteAcceso();
    if (existingUser) {
      swal("¡Error!", "Ya existe un usuario con este número de documento.", {
        icon: "error",
        buttons: false,
        timer: 3000,
      });
      return;
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

    if (visitanteAcceso.email === "") {
      // Si email está vacío, muestra un mensaje de error
      swal("Es necesario elegir un correo", {
        icon: "warning",
        buttons: false,
        timer: 1500,
      });
      return; // Detiene la ejecución de la función
    }

    if (visitanteAcceso.password === "") {
      // Si el password está vacío, muestra un mensaje de error
      swal("Es necesario ingresar un password", {
        icon: "warning",
        buttons: false,
        timer: 1500,
      });
      return; // Detiene la ejecución de la función
    }

    if (visitanteAcceso.idRol === "") {
      // Si documentoestá vacío, muestra un mensaje de error
      swal("Es necesario ingresar un rol", {
        icon: "warning",
        buttons: false,
        timer: 1500,
      });
      return; // Detiene la ejecución de la función
    }

    setIsLoading(true);
    let url = "auth/registro/";

    try {
      const response = await axios.post(url, visitanteAcceso);
      let status = response.status;
      if (status === 200) {
        if (response.data?.ok) {
          getLimpiarLecturaFisica();
          setTipoDocumento("");
          setTipoRol("");
          getPedido("");
          setVisitanteAcceso(inicialValue);
          setVisita(inicialScannerValue);
          setDatosAdicionales(inicialDatosAdicionales);
          setRol({});

          // const formulario = document.getElementById("miFormulario");
          // formulario.reset();

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

  //CAMBIOS PARA SOCKET

  const stompClientRef = useRef(null);

  const iniciarSocket = () => {
    console.log("Socket iniciando.");
    const socket = new SockJS("http://localhost:8080/server/status"); // Reemplaza con tu URL y puerto
    const stompClient = Stomp.over(socket);
    stompClientRef.current = stompClient;

    // Conectar al servidor
    stompClient.connect({}, (frame) => {
      console.log("Socket Conectado:", frame);

      // Suscribirse a un destino
      stompClient.subscribe("/topic/controlAccesoVisita", (message) => {
        console.log("Socket  Mensaje recibido:", message);
        procesarMensajeSocket(message);
      });
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
        getObtenerScaneado(Number(contenido.idPuesto));
      } else {
        //no trae, debe buscar en el API
        getObtenerScaneado(Number(contenido.idPuesto));
      }
    } catch (error) {
      alert("Error al procesar message del socket: " + error);
    }
  };

  const getObtenerScaneado = async (idPuesto) => {
    setIsLoading(true);

    idPuesto = idPuesto || null;

    let url = "visitas/sdk-archivo/";
    try {
      const response = await axios.post(url, { idPuesto: idPuesto });
      let status = response.status;
      if (status === 200) {
        const pedidos = response.data;

        setVisitanteAcceso({
          ...visitanteAcceso,
          nombre: pedidos?.result?.nombre || "",
          apellido: pedidos?.result?.apellido || "",
          documento: pedidos?.result?.documento || "",
          tipoDocumento: pedidos?.result?.tipoDocumento || "ID",
          fechaNacimiento: pedidos?.result?.fechaNacimiento || "",
          codigoNacionalidad: pedidos?.result?.codigoNacionalidad || "",
          nacionalidad: pedidos?.result?.Nacionalidad || "",
          fechaExpiracionDocumento:
            pedidos?.result?.fechaExpiracionDocumento || "",
          fechaEmision: pedidos?.result?.fechaEmision || "",
          sexo: pedidos?.result?.sexo || "",
          estadoCivil: pedidos?.result?.estadoCivil || "",
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
                console.log('Botón Filtrar clickeado');
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
                  <CloseIcon style={{ color: "red" }} />
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
      title: "Nro. Documento",
      field: "documento",
      width: "2%",
      render: (rowData) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleOpenModal(rowData)} // Abrir el modal al hacer clic en cualquier parte de la fila
        >
          {rowData.documento}
        </div>
      ),
    },
    {
      title: "Foto",
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
    },
    {
      title: "Nombre",
      field: "nombre",
      width: "5%",
      render: (rowData) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleOpenModal(rowData)} // Abrir el modal al hacer clic en cualquier parte de la fila
        >
          {rowData.nombre.toUpperCase()}
        </div>
      ),
    },
    {
      title: "Apellido",
      field: "apellido",
      width: "5%",
      render: (rowData) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleOpenModal(rowData)} // Abrir el modal al hacer clic en cualquier parte de la fila
        >
          {rowData.apellido.toUpperCase()}
        </div>
      ),
    },
    {
      title: "Celular",
      field: "celular",
      width: "5%",
      render: (rowData) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleOpenModal(rowData)} // Abrir el modal al hacer clic en cualquier parte de la fila
        >
          {rowData.celular}
        </div>
      ),
    },
    {
      title: "Rol",
      field: "rol",
      width: "10%",
      render: (rowData) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleOpenModal(rowData)} // Abrir el modal al hacer clic en cualquier parte de la fila
        >
          {rowData.rol}
        </div>
      ),
    },
  ];

  const handleInactivar = (event, props) => {
    event.stopPropagation();
    swal({
      title: "¡ATENCIÓN!",
      text: `¿Deseas inactivar este usuario?`,
      icon: "warning",
      buttons: ["Cancelar", "Confirmar"], // Quité la duplicación de la propiedad 'buttons'
      confirmButtonColor: "#EE273E",
    }).then((willDelete) => {
      if (willDelete) {
        getInactivarUsuario(props);
        console.log("probando:", props.data.idUsuario);
      }
    });
  };

  const options = {
    filtering: false,
    exportButton: false,
    exportAllData: false,
    headerStyle: { position: "sticky", top: 0 },
    maxBodyHeight: "65vh",
    paging: true,
    // searchFieldAlignment:"left",
    // showTitle:false,
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
    {
      icon: "delete",
      tooltip: "Inactivar",
      onClick: (event, rowData) => handleInactivar(event, rowData),
    },
  ];

  const getInactivarUsuario = async (props) => {
    setIsLoading(true);
    let url = "usuarios/desactivar/";

    try {
      console.log("ID del usuario:", props.data.idUsuario); // Imprimir el ID del usuario en la consola

      const response = await axios.post(url, {
        id: props.data.idUsuario,
      });

      let status = response.status;
      if (status === 200) {
        if (response.data?.ok) {
          getPedido();
          setIsLoading(false);

          swal("¡OPERACIÓN EXITOSA!", {
            icon: "success",
            buttons: false,
            timer: 1500,
          });
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

  const childrenAccions = (props) => {
    const isGuardiaRole = props.data?.rol === "Guardia";

    return (
      <>
        <Box pl={1} pr={1}>
          <Chip
            onClick={() => handleChangePasswordRequest(props)} // Elimina el evento del click
            icon={<Edit />}
            label="Editar"
            variant="outlined"
          />
        </Box>
        <Box pl={1} pr={1}>
          {isGuardiaRole && (
            <Chip
              onClick={() => handleInactivar(props)} // Elimina el evento del click
              label="Inactivar"
              variant="outlined"
              style={{ borderColor: "#EE273E" }}
            />
          )}
        </Box>
      </>
    );
  };

  return (
    <>
      {userContext.state.nombreUsu !== "" ? (
        <>
          <p>Gestion &nbsp; &nbsp;/&nbsp; &nbsp;Usuarios</p>
          {/* <Grid container spacing={2} >
           */}
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <List>
              <ListItem>
                <ListItemText
                  primary="USUARIOS"
                  secondary="Visualiza la lista de usuarios del sistema"
                />
              </ListItem>
            </List>
          </Grid>

          {userContext.state.rol === "Administrador" && (
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
                            src={visita.foto}
                            style={{
                              width: "50%", // Tamaño personalizado
                              height: "50%", // Tamaño personalizado
                            }}
                          />
                          <Typography variant="body1">Foto</Typography>
                        </>
                      ) : (
                        <img
                          alt="Foto"
                          src={logoW} // Mostrar la imagen predefinida
                          style={{
                            width: "100%", // Tamaño personalizado
                            height: "100%", // Tamaño personalizado
                          }}
                        />
                      )}
                    </Box>
                  </Grid>

                  <Grid item xs={3}>
                    <Box mb={3} style={{ textAlign: "-webkit-center" }}>
                      {visita.imagenFrente && visita.info ? ( // Validar visita.imagenFrente y visita.info
                        <>
                          <img
                            alt="Frente"
                            src={visita.imagenFrente}
                            style={{
                              width: "100%",
                              height: "100%",
                            }}
                          />
                          <Typography variant="body1">Frente</Typography>
                        </>
                      ) : (
                        <img
                          alt="Frente"
                          src={logoW}
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      )}
                    </Box>
                  </Grid>

                  <Grid item xs={3}>
                    <Box mb={3} style={{ textAlign: "-webkit-center" }}>
                      {visita.imagenDorso && visita.info ? ( // Validar visita.imagenDorso y visita.info
                        <>
                          <img
                            alt="Dorso"
                            src={visita.imagenDorso}
                            style={{
                              width: "100%",
                              height: "100%",
                            }}
                          />
                          <Typography variant="body1">Dorso</Typography>
                        </>
                      ) : (
                        <img
                          alt="Dorso"
                          src={logoW}
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      )}
                    </Box>
                  </Grid>
                </Grid>

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
                      type="number"
                      fullWidth
                    />
                    <div style={{ marginTop: 10 }}></div>
                    <TextField
                      size="small"
                      variant="outlined"
                      id="password"
                      name="password"
                      label="Contraseña"
                      // value={datosAdicionales.password}
                      value={visitanteAcceso.password}
                      onChange={(value) => handleChangePassword(value)}
                      type="text"
                      fullWidth
                    />
                    <div style={{ marginTop: 10 }}></div>
                    <TextField
                      size="small"
                      variant="outlined"
                      id="email"
                      name="email"
                      label="Correo"
                      value={visitanteAcceso.email}
                      onChange={(value) => handleChangeCorreo(value)}
                      type="text"
                      fullWidth
                    />
                    <div style={{ marginTop: 10 }}></div>
                    <TextField
                      size="small"
                      variant="outlined"
                      id="celular"
                      name="celular"
                      label="Celular"
                      value={visitanteAcceso.celular}
                      onChange={(value) => handleChangeCelular(value)}
                      type="text"
                      fullWidth
                    />
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
                    />
                    {/* Otros campos que desees */}
                    <div style={{ marginTop: 10 }}>
                      <FormControl variant="outlined" fullWidth size="small">
                        <InputLabel
                          shrink={true}
                          style={{
                            transform: "translate(10px, 10px)",
                            backgroundColor: "#fff",
                            padding: "0 4px",
                          }}
                        >
                          Tipo Documento
                        </InputLabel>
                        <Select
                          label="Tipo Documento"
                          value={
                            !socketConectado
                              ? tipoDocumento
                              : visita.tipoDocumento || ""
                          } // Valor condicional
                          onChange={(event) => {
                            if (!socketConectado) {
                              setTipoDocumento(event.target.value);
                            }
                          }}
                          disabled={socketConectado} // Deshabilita el campo si socketConectado es true
                        >
                          <MenuItem value="ID">C.I.N.</MenuItem>
                          <MenuItem value="PASAPORTE">PASAPORTE</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <Modal open={modalOpen} onClose={handleCloseModal}>
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          backgroundColor: "#fff",
                          padding: 20,
                          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
                          borderRadius: "10px",
                          width: "25%",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 10,
                          }}
                        >
                          <h2>Detalles del Usuario</h2>
                          <IconButton
                            onClick={handleCloseModal}
                            aria-label="close"
                          >
                            <CloseIcon style={{ color: "red" }} />
                          </IconButton>
                        </div>
                        {selectedUser && (
                          <>
                            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                              <img
                                src={selectedUser.urlFoto || `${AvatarIcon}`} // Usa el ícono si no hay URL
                                alt={selectedUser.urlFoto ? "Foto de usuario" : "Icono de cámara"}
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  borderRadius: "20%",
                                  objectFit: "cover",
                                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                }}
                                onError={(e) => {
                                  e.target.onerror = null; // Evita un bucle infinito
                                  e.target.src = `${AvatarIcon}`; // Cambia a ícono de cámara si hay error
                                }}
                              />
                            </div>


                            <div>
                              <p style={{ margin: "10px 0" }}>
                                <strong>Nombre:</strong> {selectedUser.nombre}
                              </p>
                              <p style={{ margin: "10px 0" }}>
                                <strong>Apellido:</strong> {selectedUser.apellido}
                              </p>
                              <p style={{ margin: "10px 0" }}>
                                <strong>Nro. Documento: </strong> {selectedUser.documento}
                              </p>
                              <p style={{ margin: "10px 0" }}>
                                <strong>Celular:</strong> {selectedUser.celular}
                              </p>
                              <p style={{ margin: "10px 0" }}>
                                <strong>Rol:</strong> {selectedUser.rol}
                              </p>
                              <p style={{ margin: "10px 0" }}>
                                <strong>Fecha de Creación:</strong> {selectedUser.fechacreate}
                              </p>
                              <p style={{ margin: "10px 0" }}>
                                <strong>Estado:</strong> {selectedUser.estado}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </Modal>

                    <Grid
                      item
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      style={{ marginTop: 10 }}
                    >
                      <Autocomplete
                        id="id"
                        size="small"
                        value={rol || ""}
                        onChange={onSelectRol}
                        options={dependenciaList?.content}
                        getOptionLabel={(option) =>
                          option.nombre ? option.nombre : ""
                        }
                        renderOption={(option) => (
                          <React.Fragment>{option?.nombre}</React.Fragment>
                        )}
                        loading={isLoadingDependencia}
                        filterSelectedOptions
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label="Rol"
                            name="rol"
                            InputProps={{
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
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      style={{
                        marginRight: 5,
                        backgroundColor: "rgb(139, 0, 139)",
                      }}
                      color="primary"
                      variant="contained"
                      onClick={() => {
                        handleGuardar();
                      }}
                    >
                      Confirmar
                    </Button>

                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      style={{ margin: 10 }}
                      onClick={() => {
                        //handleGuardar();
                        getObtenerScaneado();
                      }}
                    >
                      Recuperar documento
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      style={{ margin: 10 }}
                      onClick={() => {
                        iniciarSocket(); // Si necesitas que esta función se ejecute también
                        window.location.reload(); // Esto recarga la página
                        getLimpiarLecturaFisica();
                      }}
                      title="Iniciar Socket"
                    >
                      Refrescar Conexión
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <List>
              <ListItem>
                <ListItemText
                  primary="USUARIOS REGISTRADOS"
                  secondary="Visualiza los usuarios registrados"
                />
              </ListItem>
            </List>
            {userContext.state.rol === "Administrador" && (
              <Box pl={1} pr={1} pb={2}>
                <Chip
                  onClick={() => {
                    handleExportPDF();
                    getFiltro();
                  }}
                  label="Exportar Datos"
                  variant="outlined"
                  color="primary"
                />
              </Box>
            )}
          </Grid>
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
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}></Grid>
          {/* </Grid> */}
        </>
      ) : (
        <AccesoDenegado />
      )}
    </>
  );
}
