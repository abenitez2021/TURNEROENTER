import React, { useEffect, useState, useContext } from "react";
import { MakeTables } from "../../components/MaterialTables/MakeTables";
import { useStyles } from "../../assets/styles/CustomStyles";
import { useHistory } from "react-router-dom";
import axios from "../../utils/axios";
import {
  alertWarningError,
} from "../../components/Notificaciones";
import AccesoDenegado from "../../components/AccesoDenegado";
import UserContext from "../../utils/user/UserContext";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Grid, Box } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/AddCircle";
import Chip from "@material-ui/core/Chip";
import swal from "sweetalert";
import logoW from '../../assets/images/ci_frontal.png'
import { notificacionAlerta } from "../../components/Notificaciones";

const initFiltro = {
  fechaDesde: null,
  fechaHasta: null,
  idVisita: null,
  marcacion: null,
  documento: null,
  idDependencia: null,
};


export default function ListaTramites() {
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


  const getPedido = async () => {
    setIsLoading(true);
    setQuitarFiltro(false);
    setFiltro(initFiltro);
    setComercio({});

    let url = "tramites/listar/";

    try {
      const response = await axios.get(url);

      let status = response.status;
      if (status === 200) {
        console.log("📌 Datos recibidos:", response.data); // ✅ Verificamos la estructura de la respuesta

        setData({
          ...data,
          content: response.data, // ✅ Ahora sí pasamos el array correctamente
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





  const title = (<Button
    size='small'
    variant="outlined"
    color="primary"
    startIcon={<AddIcon />}
    onClick={() => history.push("../alta-tramite")}

  >
    Agregar Tramite
  </Button>);

const columns = [
  {
    title: "ID. Trámite",
    field: "id",
    width: "2%",
    headerStyle: { fontWeight: "bold"},
  },
  {
    title: "Nombre del Trámite",
    field: "nombre",
    width: "5%",
    render: (rowData) => rowData.nombre.toUpperCase(),
    headerStyle: { fontWeight: "bold"},
  },
  {
    title: "Descripción",
    field: "descripcion",
    width: "10%",
    headerStyle: { fontWeight: "bold"},
  },
  {
    title: "Prioridad",
    field: "prioridad",
    width: "10%",
    headerStyle: { fontWeight: "bold"},
    render: (rowData) => (
      <Chip label={rowData.prioridad} 
            style={{ 
              backgroundColor: rowData.prioridad === "ALTA" ? "#e53935" :
                               rowData.prioridad === "MEDIA" ? "#fb8c00" :
                               "#43a047",
              color: "white"
            }} />
    ),
  },
  {
    title: "Tiempo Estimado (min)",
    field: "tiempo_estimado",
    width: "10%",
    headerStyle: { fontWeight: "bold"},
  },
  {
    title: "Estado",
    field: "activo",
    width: "10%",
    headerStyle: { fontWeight: "bold"},
    render: (rowData) => (
      <Chip label={rowData.activo ? "Activo" : "Inactivo"} 
            style={{ backgroundColor: rowData.activo ? "#43a047" : "#e53935", color: "white" }} />
    ),
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

  const handleInactivar = (event, props) => {
    event.stopPropagation();
    swal({
      title: "¡ATENCIÓN!",
      text: `¿Deseas inactivar este trámite? Si lo haces, ya no podrá activarlo nuevamente y tendrás que crear otro en caso de necesitar un trámite similar.`,
      icon: "warning",
      buttons: true,
      buttons: ["Cancelar", "Confirmar"],
      confirmButtonColor: "#43a047",
    }).then((willDelete) => {
      if (willDelete) {
        getInactivarTramite(props.data);
      }
    });
  };
  
  const getInactivarTramite = async (props) => {
    setIsLoading(true);
    let url = "tramites/inactivar/";
  
    try {
      const response = await axios.post(url, {
        id: props?.id, // ✅ CAMBIADO de idDependencia a id
      });
  
      let status = response.status;
      if (status === 200 || 2001) {
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
    return (
      <>

        <Box pl={1} pr={1}>
          <Chip
            onClick={(e) => handleInactivar(e, props)}
            label="Inactivar"
            variant="outlined"
            style={{ borderColor: "#EE273E" }}
          />
        </Box>

      </>
    );
  };

  return (
    <>
      {userContext.state.nombreUsu !== "" ? (
        <>
          <p>Gestion &nbsp; &nbsp;/&nbsp; &nbsp;Tramites</p>
          <Grid container spacing={2} >
          
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <List >
                  <ListItem >
                      <ListItemText primary="TRAMITES" secondary="Visualiza la lista de tramites" />
                  </ListItem>
              </List>
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
