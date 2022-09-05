import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { TipoInstitucionService } from "../service/TipoInstitucionService";

const CrudTipoInstitucion = () => {
    let emptyTipoInstitucion = {
        id: "",
        nombre: "",
        descripcion: "",
    };

    const [tipoInstituciones, settipoInstituciones] = useState(null);
    const [tipoInstitucionDialog, settipoInstitucionDialog] = useState(false);
    const [deletetipoInstitucionDialog, setDeletetipoInstitucionDialog] = useState(false);
    const [deletetipoInstitucionesDialog, setDeletetipoInstitucionesDialog] = useState(false);
    const [tipoInstitucion, settipoInstitucion] = useState(emptyTipoInstitucion);
    const [selectedtipoInstituciones, setSelectedtipoInstituciones] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const tipoInstitucionservice = new TipoInstitucionService();
        tipoInstitucionservice.getTipoInstitucion().then((data) => settipoInstituciones(data));
    }, []);

    const openNew = () => {
        settipoInstitucion(emptyTipoInstitucion);
        setSubmitted(false);
        settipoInstitucionDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        settipoInstitucionDialog(false);
    };

    const hideDeleteTipoInstitucionDialog = () => {
        setDeletetipoInstitucionDialog(false);
    };

    const hideDeleteTipoInstitucionsDialog = () => {
        setDeletetipoInstitucionesDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (tipoInstitucion.nombre.trim()) {
            let _tipoInstituciones = [...tipoInstituciones];
            let _institucion = { ...tipoInstitucion };
            if (tipoInstitucion.id) {
                const index = findIndexById(tipoInstitucion.id);

                _tipoInstituciones[index] = _institucion;

                const tipoInstitucionservice = new TipoInstitucionService();
                tipoInstitucionservice.putTipoInstitucion(_institucion)
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Tipo Institución actualizada",
                    life: 3000,
                });
            } else {
                const tiposerv = new TipoInstitucionService();
                tiposerv.postTipoInstitucion(_institucion)
                _tipoInstituciones.push(_institucion);
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Tipo Institución creada",
                    life: 3000,
                });
            }

            settipoInstituciones(_tipoInstituciones);
            settipoInstitucionDialog(false);
            settipoInstitucion(emptyTipoInstitucion);
        }
    };

    const editProduct = (product) => {
        settipoInstitucion({ ...product });
        settipoInstitucionDialog(true);
    };

    const confirmDeleteTipoInstitucion = (product) => {
        settipoInstitucion(product);
        setDeletetipoInstitucionDialog(true);
    };

    const deleteTipoInstitucion = () => {
        let _tipoInstituciones = tipoInstituciones.filter((val) => val.id !== tipoInstitucion.id);
        settipoInstituciones(_tipoInstituciones);
        setDeletetipoInstitucionDialog(false);
        settipoInstitucion(emptyTipoInstitucion);
        const tiposerv = new TipoInstitucionService();
        tiposerv.deleteTipoInstitucion(tipoInstitucion.id);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Tipo Institucion eliminada",
            life: 3000,
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < tipoInstituciones.length; i++) {
            if (tipoInstituciones[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    };

    const deleteSelectedTipoInstituciones = () => {
        let _tipoInstituciones = tipoInstituciones.filter((val) => !selectedtipoInstituciones.includes(val));
        console.log(_tipoInstituciones)
       // settipoInstituciones(_tipoInstituciones);
        //setDeletetipoInstitucionesDialog(false);
        //setSelectedtipoInstituciones(null);
       /* toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Instituciones eliminadas ",
            life: 3000,
        });*/
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _institucion = { ...tipoInstitucion };
        _institucion[`${name}`] = val;

        settipoInstitucion(_institucion);
    };


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        );
    };

    const codeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.id}
            </>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.nombre}
            </>
        );
    };

    const descripcionBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Descripcion</span>
                {rowData.descripcion}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteTipoInstitucion(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Tipos de Intituciones</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </>
    );
    const deleteTipoInstitucionDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteTipoInstitucionDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteTipoInstitucion} />
        </>
    );
    const deleteTipoInstitucionsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteTipoInstitucionsDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedTipoInstituciones} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={tipoInstituciones}
                        selection={selectedtipoInstituciones}
                        onSelectionChange={(e) => setSelectedtipoInstituciones(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        globalFilter={globalFilter}
                        emptyMessage="No hay tipos de instituciones registradas."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="code" header="Id" body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="name" header="Nombre" body={nameBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="descripcion" header="Descripcion" body={descripcionBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={tipoInstitucionDialog} style={{ width: "450px" }} header="Tipo Institucion" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Nombre</label>
                            <InputText
                                id="nombre"
                                value={tipoInstitucion.nombre}
                                onChange={(e) => onInputChange(e, "nombre")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !tipoInstitucion.nombre,
                                })}
                            />
                             
                             <label htmlFor="description">Descripcion</label>
                              <InputText
                                id="descripcion"
                                value={tipoInstitucion.descripcion}
                                onChange={(e) => onInputChange(e, "descripcion")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !tipoInstitucion.descipcion,
                                })}
                            />

                            {submitted && !tipoInstitucion.nombre && <small className="p-invalid">El nombre del tipo de institucion es necesario.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deletetipoInstitucionDialog} style={{ width: "450px" }} header="Confirmación" modal footer={deleteTipoInstitucionDialogFooter} onHide={hideDeleteTipoInstitucionDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {tipoInstitucion && (
                                <span>
                                    Está seguro de borrar<b>{tipoInstitucion.nombre}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletetipoInstitucionesDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteTipoInstitucionsDialogFooter} onHide={hideDeleteTipoInstitucionsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {tipoInstitucion && <span>Está seguro de borrar los tipos de institucion?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(CrudTipoInstitucion, comparisonFn);