import React, { useEffect, useState, useContext } from "react";
import { MakeTables } from "../../components/MaterialTables/MakeTables";
import { useStyles } from "../../assets/styles/CustomStyles";
import { useHistory } from "react-router-dom";
import axios from "../../utils/axios";
import { alertWarningError } from "../../components/Notificaciones";
import AccesoDenegado from "../../components/AccesoDenegado";
import UserContext from "../../utils/user/UserContext";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/AddCircle";
import Logo from "../../assets/images/logo-color.png";
import TextField from "@material-ui/core/TextField";
import { Grid } from "@material-ui/core";

import { red } from "@material-ui/core/colors";

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import CloseIcon from "@material-ui/icons/Close";
import logoW from "../../assets/images/ci_frontal.png";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import AvatarIcon from "../../assets/images/avatar.png";
import { Chip, Box } from "@material-ui/core";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import esLocale from "date-fns/locale/es";
const initFiltro = {
  fechaDesde: null,
  fechaHasta: null,
  idRol: null,
  marcacion: null,
  idDependencia: null,
};

export default function ListaAccesoUsuarios() {
  const history = useHistory();
  const userContext = useContext(UserContext);
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    content: [],
  });
  const [isLoadingEstado, setIsLoadingEstado] = useState(false);
  const [isLoadingComercio, setIsLoadingComercio] = useState(false);
  const [quitarFitro, setQuitarFiltro] = useState(false);

  const [comercio, setComercio] = useState({});
  const [dashboard, setDashboard] = useState({});
  const [listComercio, setListComercio] = useState([]);

  const [estado, setEstado] = useState({});
  const [listEstado, setListEstado] = useState([]);
  const [filtro, setFiltro] = useState(initFiltro);

  useEffect(() => {
    getPedido();
  }, []);

  const getFiltro = async (props) => {
    setData({ ...data, content: [] });
    setIsLoading(true);
    setQuitarFiltro(true);

    let url = "marcacion/listar";
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

  const getPedido = async () => {
    setIsLoading(true);
    setQuitarFiltro(false);
    setFiltro(initFiltro);
    setComercio({});
    setEstado({});
    let url = "marcacion/listar";
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
  
      doc.setFillColor(70,130,180); // Violeta
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
      const text = "ACCESO DE GUARDIAS";
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
      "Entrada",
      "Salida",
      "Nro. Documento",
      "Celular",
      "Rol",
    ];
  
    const tableStyles = {
      lineWidth: 0.3,
      lineColor: [0, 0, 0],
      cellPadding: 2,
    };
  
    const headerStyles = {
      fillColor: [70,130,180],
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
            row.entrada || "",
            row.salida || "",
            row.documento || "",
            row.celular || "",
            row.rol || "",
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
  
    const nombreArchivo = `MARCACIONES-REGISTRADAS.pdf`;
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
      title: "ID Marcación",
      field: "idMarcacion",
      width: "2%",
      headerStyle: { fontWeight: "bold" },
      // hidden: true,
    }, // se oculta la foto de usuario
    
    {
      title: "Entrada",
      field: "entrada",
      width: "2%",
      render: (rowData) => rowData.entrada || "-",
      headerStyle: { fontWeight: "bold" },
    },
    {
      title: "Salida",
      field: "salida",
      width: "2%",
      render: (rowData) => rowData.salida || "-",
      headerStyle: { fontWeight: "bold" },
    },
    {
      title: "Nombre",
      field: "nombre",
      width: "5%",
      render: (rowData) => rowData.nombre.toUpperCase(),
      headerStyle: { fontWeight: "bold" },
    },
    {
      title: "Apellido",
      field: "apellido",
      width: "5%",
      render: (rowData) => rowData.apellido.toUpperCase(),
      headerStyle: { fontWeight: "bold" },
    },
    {
      title: "Nro Documento",
      field: "documento",
      width: "5%",
      headerStyle: { fontWeight: "bold" },
    },
    {
      title: "Celular",
      field: "celular",
      width: "10%",
      headerStyle: { fontWeight: "bold" },
    },
    {
      title: "Rol",
      field: "rol",
      width: "10%",
      headerStyle: { fontWeight: "bold" },
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

  return (
    <>
      {userContext.state.nombre !== "" ? (
        <>
        <p>Movimientos &nbsp; &nbsp;/&nbsp; &nbsp;Control de Acceso a Guardias</p>
          <Grid container spacing={2} justify="center" alignItems="center">
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="CONTROL DE ACCESO A GUARDIAS"
                    secondary="Visualiza los historicos de accesos de los usuarios del sistema"
                  />
                </ListItem>
              </List>
              {userContext.state.rol === "Administrador" && (
                <Box pl={1} pr={1}>
                  <Chip
                    onClick={() => handleExportPDF()}
                    label="GENERAR INFORME"
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
                  //  detalle,
                  //eliminar,
                  //agregar,
                  //childrenAccions,
                  // childrenToolbar,
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
