// Este archivo es una versión adaptada del componente ErroresLectura.js para mostrar los datos del endpoint
// /api/errores/reporte, con exportación a Excel, modal detallado y mejoras visuales para ENTER

import React, { useEffect, useState, useContext } from "react";
import MaterialTable from "material-table";
import axios from "../../utils/axios";
import { Grid, Modal, IconButton, Typography, Box } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import UserContext from "../../utils/user/UserContext";
import AvatarIcon from "../../assets/images/avatar.png";
import * as XLSX from "xlsx";
import { forwardRef } from "react";
import {
    FirstPage, LastPage, ChevronLeft, ChevronRight,
    Search, Clear, ArrowDownward, FilterList, SaveAlt, ViewColumn,
    Remove, Edit, AddBox, DeleteOutline
} from "@material-ui/icons";


export default function ErroresLectura() {
    const userContext = useContext(UserContext);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedError, setSelectedError] = useState(null);
    const tableIcons = {
        FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
        LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
        NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
        Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
        ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
        Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
        Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
        ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
        Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
        Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
        Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
        ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    };


    useEffect(() => {
        getErrores();
    }, []);

    const getErrores = async () => {
        try {
            const response = await axios.get("/errores/reporte");
            const result = response.data.map((item) => {
                let parsed = {};
                try {
                    parsed = JSON.parse(item.json_completo)?.payload?.result || {};
                } catch (err) {
                    console.error("Error parsing JSON:", err);
                }
                return {
                    ...item,
                    nombre: parsed.nombre || "❌",
                    apellido: parsed.apellido || "❌",
                    documento: parsed.documento || "❌",
                    nacionalidad: parsed.Nacionalidad || "❌",
                    urlFoto: item.ruta_foto ? `http://localhost:7001/api/errores/imagen?ruta=${encodeURIComponent(item.ruta_foto)}` : null,
                    urlFrente: item.ruta_frente ? `http://localhost:7001/api/errores/imagen?ruta=${encodeURIComponent(item.ruta_frente)}` : null,
                    urlDorso: item.ruta_dorso ? `http://localhost:7001/api/errores/imagen?ruta=${encodeURIComponent(item.ruta_dorso)}` : null,
                    jsonParsed: parsed,
                };
            });
            setData(result);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const exportToExcel = () => {
        const exportData = data.map((row) => ({
            ID: row.id,
            Fecha: row.fecha_hora,
            Documento: row.documento,
            Nombre: row.nombre,
            Apellido: row.apellido,
            Nacionalidad: row.nacionalidad,
            "Descripción del Error": row.descripcion_error?.split(", ").join("\n") || "",
            "Ruta Foto": row.ruta_foto,
            "Ruta Frente": row.ruta_frente,
            "Ruta Dorso": row.ruta_dorso,
            "JSON Completo": row.json_completo,
        }));
    
        const worksheet = XLSX.utils.json_to_sheet(exportData, {
            cellStyles: true,
        });
    
        // Ajuste opcional: definir anchos de columnas
        const columnWidths = [
            { wch: 5 },  // ID
            { wch: 20 }, // Fecha
            { wch: 15 }, // Documento
            { wch: 20 }, // Nombre
            { wch: 20 }, // Apellido
            { wch: 20 }, // Nacionalidad
            { wch: 40 }, // Descripción del Error
            { wch: 40 }, // Foto
            { wch: 40 }, // Frente
            { wch: 40 }, // Dorso
            { wch: 100 }, // JSON Completo
        ];
        worksheet["!cols"] = columnWidths;
    
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Errores");
        XLSX.writeFile(workbook, "errores_lectura.xlsx");
    };
    
    const columns = [
        { title: "ID", field: "id", width: "5%" },
        { title: "Fecha", field: "fecha_hora", width: "15%" },
        {
            title: "Visitante",
            field: "visitante",
            render: rowData => (
                <Typography variant="body2">
                    {`${rowData.nombre !== "❌" ? rowData.nombre : ""} ${rowData.apellido !== "❌" ? rowData.apellido : ""}`.trim() || "❌"}
                </Typography>
            ),
        },
        { title: "Documento", field: "documento" },
        {
            title: "Errores detectados",
            field: "descripcion_error",
            render: rowData => (
                <Typography variant="body2" style={{ whiteSpace: "pre-line" }}>
                    {rowData.descripcion_error?.split(", ").join("\n")}
                </Typography>
            ),
            width: "20%",
        },
        {
            title: "Foto",
            field: "urlFoto",
            render: (rowData) => (
                <img
                    src={rowData.urlFoto || AvatarIcon}
                    onError={(e) => (e.target.src = AvatarIcon)}
                    alt="Foto"
                    style={{ width: 40, height: 40, borderRadius: "10%" }}
                />
            ),
        },
        {
            title: "Frente",
            field: "urlFrente",
            render: (rowData) =>
                rowData.urlFrente ? (
                    <img src={rowData.urlFrente} alt="Frente" style={{ width: 40, height: 40 }} />
                ) : (
                    "❌"
                ),
        },
        {
            title: "Dorso",
            field: "urlDorso",
            render: (rowData) =>
                rowData.urlDorso ? (
                    <img src={rowData.urlDorso} alt="Dorso" style={{ width: 40, height: 40 }} />
                ) : (
                    "❌"
                ),
        },
    ];

    return (
        <>
            {userContext.state.nombreUsu !== "" ? (
                <>
                    <Box mt={2} mb={2} textAlign="center">
                        <Typography variant="h4" style={{ fontWeight: 700, color: "#4a148c" }}>
                            Registro de Errores de Lectura
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            Visualización de lecturas incompletas desde el escáner de documentos
                        </Typography>
                        <button
                            onClick={exportToExcel}
                            style={{ marginTop: 10, padding: "6px 12px", backgroundColor: "#1976d2", color: "white", border: "none", borderRadius: "4px" }}
                        >
                            Exportar a Excel
                        </button>
                    </Box>

                    <Box mt={3} mx={2}>
                        <MaterialTable
                            icons={tableIcons}
                            title=""
                            isLoading={isLoading}
                            columns={columns}
                            data={data}
                            options={{
                                paging: true,
                                pageSize: 50,
                                maxBodyHeight: "70vh",
                                headerStyle: {
                                    backgroundColor: "#4a148c",
                                    color: "#fff",
                                    fontWeight: "bold",
                                },
                                rowStyle: {
                                    fontSize: 'small',
                                    borderBottom: '1px solid #ddd',
                                    transition: 'background-color 0.2s',
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5',
                                    }
                                },

                                paginationType: "stepped",
                                toolbar: true,
                            }}

                            onRowClick={(_, rowData) => {
                                setSelectedError(rowData);
                                setModalOpen(true);
                            }}
                        />
                    </Box>

                    <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                backgroundColor: "white",
                                padding: 20,
                                borderRadius: 10,
                                maxWidth: "600px",
                                width: "90%",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <h2>Detalle de Error #{selectedError?.id}</h2>
                                <IconButton onClick={() => setModalOpen(false)}>
                                    <CloseIcon />
                                </IconButton>
                            </div>

                            <Typography><strong>Visitante:</strong> {`${selectedError?.nombre || ""} ${selectedError?.apellido || ""}`.trim() || "❌"}</Typography>
                            <Typography><strong>Documento:</strong> {selectedError?.documento}</Typography>
                            <Typography><strong>Fecha:</strong> {selectedError?.fecha_hora}</Typography>

                            <Typography style={{ marginTop: 10 }}>
                                <strong>Errores detectados:</strong>
                                <pre style={{ whiteSpace: "pre-line", marginTop: 5, fontFamily: "inherit", background: "#f0f0f0", padding: 10 }}>
                                    {selectedError?.descripcion_error?.split(", ").join("\n")}
                                </pre>
                            </Typography>

                            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                                <img
                                    src={selectedError?.urlFoto || AvatarIcon}
                                    style={{ width: 100, height: 100, objectFit: "cover" }}
                                    alt="foto"
                                    onError={(e) => (e.target.src = AvatarIcon)}
                                />
                                {selectedError?.urlFrente && (
                                    <img
                                        src={selectedError.urlFrente}
                                        style={{ width: 100, height: 100, objectFit: "cover" }}
                                        alt="frente"
                                    />
                                )}
                                {selectedError?.urlDorso && (
                                    <img
                                        src={selectedError.urlDorso}
                                        style={{ width: 100, height: 100, objectFit: "cover" }}
                                        alt="dorso"
                                    />
                                )}
                            </div>

                            <Typography style={{ marginTop: 20 }}><strong>JSON completo:</strong></Typography>
                            <pre style={{
                                marginTop: 10,
                                maxHeight: 300,
                                overflowY: "auto",
                                background: "#f5f5f5",
                                padding: 10
                            }}>
                                {JSON.stringify(selectedError?.jsonParsed, null, 2)}
                            </pre>
                        </div>
                    </Modal>
                </>
            ) : (
                <p>Acceso denegado</p>
            )}
        </>
    );
}