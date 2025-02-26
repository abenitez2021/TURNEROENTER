import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { useStyles } from "../../assets/styles/CustomStyles";
import { notificacionAlerta } from "../../components/Notificaciones";
import TypographyBold from "../../components/TypographyBold";

export default function ChangePassword() {
  const classes = useStyles();

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Estado para almacenar el ID del usuario
  const [userId, setUserId] = useState(null);

  // Efecto para obtener el userId desde sessionStorage al cargar el componente
  useEffect(() => {
    const storedData = sessionStorage.getItem("jwt-wom");

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        const id = parsedData.user?.id;
        if (id) {
          setUserId(id);
        } else {
          console.error("El ID del usuario no se encontró en los datos.");
        }
      } catch (error) {
        console.error("Error al parsear los datos de sessionStorage:", error);
      }
    } else {
      console.error('No se encontraron datos en sessionStorage bajo la clave "jwt-wom".');
    }
  }, []);

  // Estado para los datos de la contraseña
  const [data, setData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Función para cambiar la contraseña
  const changePassword = async (passwordData) => {
    const storedData = sessionStorage.getItem("jwt-wom");
    const token = storedData ? JSON.parse(storedData).token : null;

    if (!token) {
      notificacionAlerta("No se encontró el token. Inicia sesión nuevamente.");
      return { status: "ERROR", message: "Token no encontrado" };
    }

    try {
      const response = await fetch(
        "http://localhost:7001/api/auth/cambiar-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Incluir el token en la cabecera
          },
          body: JSON.stringify(passwordData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al cambiar la contraseña."
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      return { status: "ERROR", message: error.message };
    }
  };

  const handlePasswordChange = async () => {
    // Limpiar los campos inmediatamente al hacer clic en "Cambiar contraseña"
    setData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  
    // Ocultar las contraseñas
    setShowPassword({
      current: false,
      new: false,
      confirm: false,
    });
  
    if (data.newPassword !== data.confirmPassword) {
      notificacionAlerta("Las nuevas contraseñas no coinciden.");
      return;
    }
  
    // Preparar el objeto con los datos correctos para la solicitud
    const passwordData = {
      id: userId, // Asegúrate de enviar el userId
      password: data.currentPassword,
      newPassword: data.newPassword,
    };
  
    try {
      const response = await changePassword(passwordData);
      if (response.status === "OK") {
        notificacionAlerta("Contraseña cambiada con éxito.");
      } else {
        notificacionAlerta(response.message);
      }
    } catch (error) {
      console.error(error);
      notificacionAlerta("Error al cambiar la contraseña.");
    }
  };
  
  const handleInputChange = (field, value) => {
    setData({ ...data, [field]: value });
  };

  const handleTogglePasswordVisibility = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handlePasswordChange();
    }
  };

  return (
    <Grid container justifyContent="center" style={{ paddingBottom: 70 }}>
      <Grid item xs={11} sm={9} md={4} lg={4} xl={4}>
        <Box pt={5}>
          <Card className={classes.root} variant="outlined">
            <CardContent>
              <Box mt={1} textAlign="center">
                <TypographyBold variant="h5" component="h2">
                  Cambiar Contraseña
                </TypographyBold>
              </Box>

              <Box pt={3} pl={4} pr={4}>
                {/* Contraseña Actual */}
                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel htmlFor="outlined-adornment-current-password">
                    Contraseña Actual
                  </InputLabel>
                  <OutlinedInput
                    type={showPassword.current ? "text" : "password"}
                    value={data.currentPassword}
                    onChange={(e) =>
                      handleInputChange("currentPassword", e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            handleTogglePasswordVisibility("current")
                          }
                          onMouseDown={(e) => e.preventDefault()}
                          edge="end"
                        >
                          {showPassword.current ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    labelWidth={150}
                  />
                </FormControl>

                {/* Nueva Contraseña */}
                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel htmlFor="outlined-adornment-new-password">
                    Nueva Contraseña
                  </InputLabel>
                  <OutlinedInput
                    type={showPassword.new ? "text" : "password"}
                    value={data.newPassword}
                    onChange={(e) =>
                      handleInputChange("newPassword", e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleTogglePasswordVisibility("new")}
                          onMouseDown={(e) => e.preventDefault()}
                          edge="end"
                        >
                          {showPassword.new ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                    labelWidth={130}
                  />
                </FormControl>

                {/* Confirmar Nueva Contraseña     */}
                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel htmlFor="outlined-adornment-confirm-password">
                    Confirmar Nueva Contraseña    
                  </InputLabel>
                  <OutlinedInput
                    type={showPassword.confirm ? "text" : "password"}
                    value={data.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            handleTogglePasswordVisibility("confirm")
                          }
                          onMouseDown={(e) => e.preventDefault()}
                          edge="end"
                        >
                          {showPassword.confirm ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    labelWidth={210}
                  />
                </FormControl>
              </Box>
            </CardContent>
            <CardActions>
              <Grid container justifyContent="center">
                <Grid item xs={11}>
                  <Box pt={5} pb={5}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={handlePasswordChange}
                    >
                      <TypographyBold variant="body2" style={{ color: "#fff" }}>
                        CAMBIAR CONTRASEÑA
                      </TypographyBold>
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardActions>
          </Card>
        </Box>
      </Grid>
    </Grid>
  );
}
