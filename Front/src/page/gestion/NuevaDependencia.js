import React, { useState, useEffect } from "react";
import { useStyles } from "../../assets/styles/CustomStyles";
import { useHistory } from "react-router-dom";
import axios from "../../utils/axios";
import TextField from "@material-ui/core/TextField";
import { Grid, Button, Box, Popover, Paper } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import { alertWarningError, notificacionAlerta } from "../../components/Notificaciones";
import swal from 'sweetalert';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import BackdropCustom from "../../components/BackdropCustom";

const inicialValue = {
  nombre: "",
  color: ""
};

const coloresPaleta = [

  '#1C1917', '#44403C', '#78716C', '#D6D3D1',
  '#7F1D1D', '#B91C1C', '#EF4444', '#FCA5A5',
  '#7C2D12', '#C2410C', '#F97316', '#FDBA74',
  '#365314', '#4D7C0F', '#84CC16', '#BEF264',
  '#14532D', '#15803D', '#22C55E', '#86EFAC',
  '#164E63', '#0E7490', '#06B6D4', '#67E8F9',
  '#1E3A8A', '#1D4ED8', '#3B82F6', '#A5B4FC',
  '#312E81', '#4338CA', '#6366F1', '#A5B4FC',
  '#4C1D95', '#6D28D9', '#8B5CF6', '#A5B4FC',
  '#701A75', '#A21CAF', '#D946EF', '#F0ABFC',
  '#831843', '#BE185D', '#EC4899', '#F9A8D4',

];

export default function NuevaDependencia() {
  const history = useHistory();
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [dependencia, setDependencia] = useState(inicialValue);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {

  }, []);

  const handleGuardar = async () => {
    setIsLoading(true);
    let url = "dependencias/crear/";

    try {
      const response = await axios.post(url, dependencia);
      let status = response.status;
      if (status === 200) {
        if (response.data?.ok) {
          setIsLoading(false);
          swal("¡OPERACIÓN EXITOSA!", {
            icon: "success",
            buttons: false,
            timer: 1500,
          });
          history.goBack();
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

  const handleChangeNombre = (event) => {
    let copyInput = { ...dependencia, nombre: event.target.value };
    setDependencia(copyInput);
  };

  const handleChangeColor = (color) => {
    setDependencia({ ...dependencia, color });
    setAnchorEl(null);
  };

  const handleColorClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <BackdropCustom open={isLoading} />
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <List>
          <ListItem>
            <ListItemText primary="CREAR UNA NUEVA DEPENDENCIA" secondary="Al crear dependencias puedes segmentar accesos para controlarlos mejor" />
          </ListItem>
        </List>
      </Grid>
      <Card className={classes.root}>
        <CardContent>
          <Box pt={3}>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignContent="center"
              spacing={2}
            >
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <TextField
                  size="small"
                  autoFocus
                  variant="outlined"
                  id="dependencia-nombre"
                  name="nombre"
                  label="Nombre"
                  value={dependencia.nombre}
                  onChange={(event) => handleChangeNombre(event)}
                  type="text"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <TextField
                  size="small"
                  variant="outlined"
                  id="dependencia-color"
                  name="color"
                  label="Color a mostrar en gráficos"
                  value={dependencia.color}
                  fullWidth
                  onClick={handleColorClick}
                />
                <Popover
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  onClose={handleClosePopover}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  <Paper style={{ width: '300px', padding: '10px' }}>
                    <Box p={2}>
                      <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {coloresPaleta.map((color, index) => (
                          <div
                            key={color}
                            style={{
                              backgroundColor: color,
                              width: "calc(25% - 5px)",
                              height: "50px",
                              margin: "0 5px 5px 0",
                              cursor: "pointer"
                            }}
                            onClick={() => handleChangeColor(color)}
                          ></div>
                        ))}
                      </div>
                    </Box>
                  </Paper>
                </Popover>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <CardActions>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignContent="center"
            spacing={8}
          >
            <Grid item>
              <Button
                size="small"
                color="default"
                onClick={() => {
                  history.goBack();
                }}
              >
                Salir
              </Button>{" "}
            </Grid>

            <Grid item>
              <Button
                variant="contained"
                size="small"
                color="primary"
                disabled={dependencia.nombre === "" ? true : false}
                onClick={() => {
                  handleGuardar();
                }}
              >
                Guardar
              </Button>{" "}
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </>
  );
}
