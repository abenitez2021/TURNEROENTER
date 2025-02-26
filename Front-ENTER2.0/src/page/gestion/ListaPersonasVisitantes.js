import React, { useEffect, useState, useContext } from "react";
import { MakeTables } from "../../components/MaterialTables/MakeTables";
import { useStyles } from "../../assets/styles/CustomStyles";
import { useHistory } from "react-router-dom";
import axios from "../../utils/axios";
import { red } from "@material-ui/core/colors";
import { alertWarningError } from "../../components/Notificaciones";
import AccesoDenegado from "../../components/AccesoDenegado";
import UserContext from "../../utils/user/UserContext";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import AvatarIcon from "../../assets/images/avatar.png";
import Logo from "../../assets/images/logo-color.png";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Chip } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import esLocale from "date-fns/locale/es";
import Modal from "@material-ui/core/Modal";

const initFiltro = {
  fechaDesde: null,
  fechaHasta: null,
  idVisita: null,
  marcacion: null,
  documento: null,
  idDependencia: null,
};

export default function ListaPersonasVisitantes() {
  const userContext = useContext(UserContext);
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    content: [],
  });
  const [isLoadingComercio, setIsLoadingComercio] = useState(false);
  const [quitarFitro, setQuitarFiltro] = useState(false);
  const [comercio, setComercio] = useState({});
  const [filtro, setFiltro] = useState(initFiltro);
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
  }, []);

  const getFiltro = async () => {
    setData({ ...data, content: [] });
    setIsLoading(true);
    setQuitarFiltro(true);

    let url = "visitas/listar-group/";
    try {
      const response = await axios.post(url, filtro);
      let status = response.status;
      if (status === 200) {
        const filtroResponse = response.data;
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
    let url = "visitas/listar-group/";
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
      const text = "PERSONAS REGISTRADAS";
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
      "Pais",
      "Última Visita",
      "Ctd. Visitas",
      "Escaner",
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
            row.nacionalidad || "",
            row.ultimaVisita || "",
            row.cantidad || "",
            row.escaner || "",
          ]);
        } else {
          tableData.push(["", "", "", "", "", "", "", ""]);
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

    const nombreArchivo = `PERSONAS-REGISTRADAS.pdf`;
    doc.save(nombreArchivo);
  };

  const handleFechaDesde = (date) => {
    setFiltro({ ...filtro, fechaDesde: date });
  };

  const handleFechaHasta = (date) => {
    setFiltro({ ...filtro, fechaHasta: date });
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
        return (
          <img
            style={{ height: 50, width: 45, borderRadius: "10%" }}
            src={rowData?.urlFoto || AvatarIcon} // Si urlFoto es null, se usará AvatarIcon
            onError={(e) => {
              e.target.src = AvatarIcon; // Establece AvatarIcon si la carga de la imagen falla
            }}
            alt="Avatar"
          />
        );
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
      title: "Pais",
      field: "nacionalidad",
      width: "10%",
      render: (rowData) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleOpenModal(rowData)} // Abrir el modal al hacer clic en cualquier parte de la fila
        >
          {rowData.nacionalidad.toUpperCase()}
        </div>
      ),
    },
    {
      title: "Última Visita",
      field: "ultimaVisita",
      width: "10%",
      render: (rowData) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleOpenModal(rowData)} // Abrir el modal al hacer clic en cualquier parte de la fila
        >
          {rowData.ultimaVisita.toUpperCase()}
        </div>
      ),
    },
    {
      title: "Ctd. Visitas",
      field: "cantidad",
      width: "10%",
      render: (rowData) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleOpenModal(rowData)} // Abrir el modal al hacer clic en cualquier parte de la fila
        >
          {rowData.cantidad.toUpperCase()}
        </div>
      ),
    },
  ];

  const options = {
    filtering: false,
    exportButton: false,
    exportAllData: false,
    headerStyle: { position: "sticky", top: 0, paddingTop: "5px" },
    maxBodyHeight: "65vh",
    paging: true,
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

  const childrenAccions = (props) => {
    return <></>;
  };

  return (
    <>
      {userContext.state.nombreUsu !== "" ? (
        <>
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
                <h2>Detalles del Visitante</h2>
                <IconButton onClick={handleCloseModal} aria-label="close">
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
                  <div style={{ lineHeight: "1.6" }}>
                    <p style={{ margin: "10px 0" }}>
                      <strong>Nombre:</strong> {selectedUser.nombre}
                    </p>
                    <p style={{ margin: "10px 0" }}>
                      <strong>Apellido:</strong> {selectedUser.apellido}
                    </p>
                    <p style={{ margin: "10px 0" }}>
                      <strong>Nro. Documento:</strong> {selectedUser.documento}
                    </p>
                    <p style={{ margin: "10px 0" }}>
                      <strong>Nacionalidad:</strong> {selectedUser.nacionalidad}
                    </p>
                    <p style={{ margin: "10px 0" }}>
                      <strong>Última visita:</strong>{" "}
                      {selectedUser.ultimaVisita}
                    </p>
                    <p style={{ margin: "10px 0" }}>
                      <strong>Cantidad de visitas:</strong>{" "}
                      {selectedUser.cantidad}
                    </p>
                  </div>
                </>
              )}
            </div>
          </Modal>

          <p>Gestion &nbsp; &nbsp;/&nbsp; &nbsp;Personas Registradas</p>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="PERSONAS - VISITANTES"
                    secondary="Visualiza la lista de personas que han realizado su visita"
                  />
                </ListItem>
              </List>
              {userContext.state.rol === "Administrador" && (
                <Box pl={1} pr={1}>
                  <Chip
                    onClick={() => handleExportPDF()}
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
                style={{ paddingTop: "5px", backgroundColor: "#800080" }}
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
