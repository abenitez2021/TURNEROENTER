const fs = require('fs');
const { exec } = require('child_process');

const filePath = "C:\\ENTER\\CONRUTH\\impresora\\ticket.txt";

// Contenido del ticket
const text = `
  -------------------------------
        PRUEBA DE IMPRESIÓN      
  -------------------------------
  Nombre: Ejemplo
  Fecha: ${new Date().toLocaleString()}
  -------------------------------
`;

// Guardar el texto en el archivo
fs.writeFileSync(filePath, text, 'utf8');

// Ejecutar el comando `notepad /p` para imprimir
exec(`notepad /p "${filePath}"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Error al imprimir: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`⚠️ Advertencia: ${stderr}`);
    return;
  }
  console.log("✅ Impresión enviada correctamente.");
});
