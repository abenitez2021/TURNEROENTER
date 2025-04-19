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
  ubicacion: "",
  activo: true,
};

export default function NuevoPunto() {
  const history = useHistory();
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [puntoatencion, setTramites] = useState({ ...inicialValue });

  // 🔥 NUEVA ESTRATEGIA: Clave para forzar la re-renderización
  const [resetKey, setResetKey] = useState(0);

  const handleGuardar = async () => {
    if (!puntoatencion.nombre || !puntoatencion.descripcion || !puntoatencion.ubicacion) {
      swal("¡Error!", "Todos los campos son obligatorios y deben tener valores válidos.", "error");
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await axios.post("puntoatencion/crear/", puntoatencion);
      console.log("📌 Respuesta completa del backend:", response);
  
      if (response.data.ok) {
        // 🔹 Mostrar alerta y limpiar el formulario solo si el trámite se creó correctamente
        swal({
          title: "¡Éxito!",
          text: "Punto creado correctamente.",
          icon: "success",
          button: "Aceptar",
        }).then(() => {
          setTramites({ 
            nombre: "",
            descripcion: "",
            ubicacion: "",
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
            <ListItemText primary="CREAR UN NUEVO PUNTO DE ATENCIÓN" secondary="Complete los datos para registrar un nuevo punto de atencion." />
          </ListItem>
        </List>
      </Grid>

      <Card className={classes.root} key={resetKey}>
        <CardContent>
          <Box pt={2}>
            <Grid container spacing={2}>
              {/* Nombre del Punto */}
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  variant="outlined"
                  label="Nombre del Punto"
                  value={puntoatencion.nombre}
                  onChange={(event) => setTramites({ ...puntoatencion, nombre: event.target.value })}
                  fullWidth
                />
              </Grid>

              {/* Descripción */}
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  variant="outlined"
                  label="Descripción"
                  value={puntoatencion.descripcion}
                  onChange={(event) => setTramites({ ...puntoatencion, descripcion: event.target.value })}
                  fullWidth
                />
              </Grid>

              {/* Ubicacion */}
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  variant="outlined"
                  label="Ubicacion"
                  value={puntoatencion.ubicacion}
                  onChange={(event) => setTramites({ ...puntoatencion, ubicacion: event.target.value })}
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
                  value={puntoatencion.activo}
                  onChange={(event) => setTramites({ ...puntoatencion, activo: event.target.value === "true" })}
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
                disabled={puntoatencion.nombre === ""}
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
