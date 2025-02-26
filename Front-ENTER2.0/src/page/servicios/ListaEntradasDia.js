import React, { useEffect, useState, useContext } from "react";
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
import AvatarIcon from "../../assets/images/avatar.png";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Logo from "../../assets/images/logo-color.png";
import * as htmlToImage from "html-to-image";
import Chip from "@material-ui/core/Chip";

const initFiltro = {
  fechaDesde: null,
  fechaHasta: null,
  idVisita: null,
  marcacion: "ENTRADA",
  documento: null,
  idDependencia: null,
};

const value = [
  {
    idAgendado: 1,
    fechaServicio: "13-12-2022",
    horaServicio: "10:00",
    idServicio: 2,
    servicio: "Arnaldo Riquelme",
    descripcion: "esto es una descripcion de actualizacion",
    modalidad: "4.994.624",
    duracion: "Tiempo completo",
    precio: "250000",
    fotos:
      "23bfd53e-a2af-49b8-89f5-536aab8d8678.png,85a68ee0-e068-4de8-a02b-e5fb9a0a0206.png,fb60bf97-9c42-4ca0-b92a-a39059cdba92.png,940fd4ae-b896-490b-a60a-68af046144b0.png,269d6e88-12a8-41b3-917a-180d30b42801.png",
    urlFotos:
      "http://api-desa.getwom.co/api/wommer/165/foto-perfil/5ed6b945-8b56-4d00-abdf-5d2ac7d2049f.jpg",
    idRubro: 1,
    rubro: "TECNOLOGÍA",
    idEspecialidad: null,
    especialidad: null,
    latitud: "-25.3452472",
    longitud: "-57.4695547",
    idDepartamento: 1,
    departamento: "Asuncion",
    idCiudad: 1,
    ciudad: "Asuncion",
    precioAgendado: "200000",
    idUsuario: 2,
    nombre: "Usuario",
    apellido: "Prueba",
    fotoPerfil: "a4373153-b60f-4ae2-99bb-66153be823cc.jpeg",
    urlFotoPerfil:
      "http://api-desa.getwom.co/api//usuarios/2/foto-perfil/a4373153-b60f-4ae2-99bb-66153be823cc.jpeg",
    valoracionPerfil: "4",
    valoracionServicio: "2",
    estado: "ACTIVO",
    idCancelacion: 1,
    motivoCancelacion: "motivo",
    tipoCancelacion: "WOMMER",
  },
];

export default function ListaServiciosActivo() {
  const history = useHistory();
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

  useEffect(() => {
    getPedido();
  }, []);

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

  const getPedido = async () => {
    setIsLoading(true);
    setQuitarFiltro(false);
    setFiltro(initFiltro);
    setComercio({});
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
      const text = "ENTRADAS DEL DÍA";
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
      "Nacionalidad",
      "Dependencia",
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
            row.entrada || "",
            row.salida || "",
            row.documento || "",
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

    const fechaActual = new Date().toISOString().slice(0, 10);
    const nombreArchivo = `ENTRADAS-DEL-DIA-${fechaActual}.pdf`;
    doc.save(nombreArchivo);
  };

  const getColumnData = async (column, row) => {
    // Si la columna se llama "Foto" y hay una URL en "urlFoto"
    if (column.title === "Foto" && row.urlFoto) {
      // Convierte la URL de la imagen en formato base64
      const dataUrl = await htmlToImage.toPng(
        document.querySelector(`#image_${row.idVisita}`)
      );
      return { content: "", image: dataUrl, width: 30, height: 30 };
    } else {
      // Devuelve el valor de la celda
      return row[column.field];
    }
  };

  const title = (
    <>
      <Grid container spacing={3} style={{ padding: "15px 0px" }}></Grid>
    </>
  );

  const columns = [
    {
      title: "ID Visita",
      field: "idVisita",
      width: "2%",
      // hidden: true,
      headerStyle: { fontWeight: "bold", textAlign: "center" },
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
      headerStyle: { fontWeight: "bold", textAlign: "center" },
    },
    {
      title: "Entrada",
      field: "entrada",
      width: "2%",
      render: (rowData) => rowData.entrada || "-",
      headerStyle: { fontWeight: "bold", textAlign: "center" },
    },
    {
      title: "Salida",
      field: "salida",
      width: "2%",
      render: (rowData) => rowData.salida || "-",
      headerStyle: { fontWeight: "bold", textAlign: "center" },
    },
    {
      title: "Nombre",
      field: "nombre",
      width: "10%",
      render: (rowData) => rowData.nombre.toUpperCase(),
      headerStyle: { fontWeight: "bold", textAlign: "center" },
    },
    {
      title: "Apellido",
      field: "apellido",
      width: "10%",
      render: (rowData) => rowData.apellido.toUpperCase(),
      headerStyle: { fontWeight: "bold", textAlign: "center" },
    },
    {
      title: "Nro Documento",
      field: "documento",
      width: "5%",
      headerStyle: { fontWeight: "bold", textAlign: "center" },
    },
    {
      title: "Pais",
      field: "nacionalidad",
      width: "10%",
      headerStyle: { fontWeight: "bold", textAlign: "center" },
    },
    {
      title: "Dependencia",
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
    exportAllData: true,
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

  const childrenAccions = (props) => {
    return (
      <>
        {/* 
        <Box pl={1} pr={1}>
          <Chip
            onClick={(e) => handleDetalle(e, props)}
            label="Detalle"
            variant="outlined"
            color="primary"
          />
        </Box> */}
      </>
    );
  };

  return (
    <>
      {userContext.state.nombreUsu !== "" ? (
        <>
          <p>Visitas del día &nbsp; &nbsp;/&nbsp; &nbsp;Entradas</p>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="ENTRADAS REGISTRADAS HOY"
                    secondary="Visualiza el detalle de todas las entradas de visitantes del día"
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
