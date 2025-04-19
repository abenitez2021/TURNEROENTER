import React, { useState } from "react";
import { useStyles } from "../../assets/styles/CustomStyles";
import { useHistory } from "react-router-dom";
import axios from "../../utils/axios";
import TextField from "@material-ui/core/TextField";
import { Grid, Button, Box, Paper, MenuItem } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import { alertWarningError, notificacionAlerta } from "../../components/Notificaciones";
import swal from "sweetalert";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import BackdropCustom from "../../components/BackdropCustom";

const inicialValue = {
  nombre: "",
  descripcion: "",
  prioridad: "MEDIA",
  tiempo_estimado: 10,
  activo: true,
};

export default function NuevoTramite() {
  const history = useHistory();
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [tramites, setTramites] = useState({ ...inicialValue });

  // 🔥 NUEVA ESTRATEGIA: Clave para forzar la re-renderización
  const [resetKey, setResetKey] = useState(0);

  const handleGuardar = async () => {
    if (!tramites.nombre || !tramites.descripcion || !tramites.prioridad || tramites.tiempo_estimado <= 0) {
      swal("¡Error!", "Todos los campos son obligatorios y deben tener valores válidos.", "error");
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await axios.post("tramites/crear/", tramites);
      console.log("📌 Respuesta completa del backend:", response);
  
      if (response.data.ok) {
        // 🔹 Mostrar alerta y limpiar el formulario solo si el trámite se creó correctamente
        swal({
          title: "¡Éxito!",
          text: "Trámite creado correctamente.",
          icon: "success",
          button: "Aceptar",
        }).then(() => {
          setTramites({ 
            nombre: "",
            descripcion: "",
            prioridad: "MEDIA",
            tiempo_estimado: 10,
            activo: true
          });
          //history.push("/gestion/lista-tramites"); // 🔹 Redirecciona automáticamente
        });
      } else {
        notificacionAlerta(response.data?.message || "Error desconocido");
      }
    } catch (error) {
      console.error("❌ Error en la petición:", error);
      alertWarningError(error.response);
  
      // 🔹 No limpiamos el formulario en caso de error
    } finally {
      setIsLoading(false); // 🔹 Asegura que se detenga la animación de carga
    }
  };
  
  return (
    <>
      <BackdropCustom open={isLoading} />
      <Grid item xs={12}>
        <List>
          <ListItem>
            <ListItemText primary="CREAR UN NUEVO TRÁMITE" secondary="Complete los datos para registrar un nuevo trámite." />
          </ListItem>
        </List>
      </Grid>

      <Card className={classes.root} key={resetKey}>
        <CardContent>
          <Box pt={2}>
            <Grid container spacing={2}>
              {/* Nombre del trámite */}
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  variant="outlined"
                  label="Nombre del Trámite"
                  value={tramites.nombre}
                  onChange={(event) => setTramites({ ...tramites, nombre: event.target.value })}
                  fullWidth
                />
              </Grid>

              {/* Descripción */}
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  variant="outlined"
                  label="Descripción"
                  value={tramites.descripcion}
                  onChange={(event) => setTramites({ ...tramites, descripcion: event.target.value })}
                  fullWidth
                />
              </Grid>

              {/* Prioridad */}
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  variant="outlined"
                  label="Prioridad"
                  select
                  value={tramites.prioridad}
                  onChange={(event) => setTramites({ ...tramites, prioridad: event.target.value })}
                  fullWidth
                >
                  <MenuItem value="BAJA">BAJA</MenuItem>
                  <MenuItem value="MEDIA">MEDIA</MenuItem>
                  <MenuItem value="ALTA">ALTA</MenuItem>
                </TextField>
              </Grid>

              {/* Tiempo Estimado */}
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  variant="outlined"
                  label="Tiempo Estimado (min)"
                  type="number"
                  value={tramites.tiempo_estimado}
                  onChange={(event) => setTramites({ ...tramites, tiempo_estimado: parseInt(event.target.value, 10) || 10 })}
                  fullWidth
                />
              </Grid>

              {/* Estado */}
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  variant="outlined"
                  label="Estado"
                  select
                  value={tramites.activo}
                  onChange={(event) => setTramites({ ...tramites, activo: event.target.value === "true" })}
                  fullWidth
                >
                  <MenuItem value="true">Activo</MenuItem>
                  <MenuItem value="false">Inactivo</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </CardContent>

        {/* Botones */}
        <CardActions>
          <Grid container justifyContent="flex-end" spacing={2}>
            <Grid item>
              <Button size="small" color="default" onClick={() => history.goBack()}>
                Salir
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                size="small"
                color="primary"
                disabled={tramites.nombre === ""}
                onClick={handleGuardar}
              >
                Guardar
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </>
  );
}
