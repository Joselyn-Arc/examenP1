import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { TipoInstitucionService } from "../service/TipoInstitucionService";

const CrudTipoInstitucion = () => {
    let emptyProvincia = {
        id: null,
        nombre: "",
        descripcion: "",
    };

    const [tipoInstituciones, settipoInstituciones] = useState(null);
    const [tipoInstitucionDialog, settipoInstitucionDialog] = useState(false);
    const [deletetipoInstitucionDialog, setDeletetipoInstitucionDialog] = useState(false);
    const [deletetipoInstitucionesDialog, setDeletetipoInstitucionesDialog] = useState(false);
    const [tipoInstitucion, settipoInstitucion] = useState(emptyProvincia);
    const [selectedtipoInstituciones, setSelectedtipoInstituciones] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const tipoInstitucionservice = new TipoInstitucionService();
        tipoInstitucionservice.getTipoInstitucion().then((data) => settipoInstituciones(data));
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    };

    const openNew = () => {
        settipoInstitucion(emptyProvincia);
        setSubmitted(false);
        settipoInstitucionDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        settipoInstitucionDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeletetipoInstitucionDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeletetipoInstitucionesDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (tipoInstitucion.nombre.trim()) {
            let _products = [...tipoInstituciones];
            let _product = { ...tipoInstitucion };
            if (tipoInstitucion.id) {
                const index = findIndexById(tipoInstitucion.id);

                _products[index] = _product;

                const tiposerv = new TipoInstitucionService();
                tiposerv.putTipoInstitucion(_product)
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Tipo Institución actualizada",
                    life: 3000,
                });
            } else {
                const tiposerv = new TipoInstitucionService();
                tiposerv.postTipoInstitucion(_product)
                // _product.id = createId();
                // _product.image = "product-placeholder.svg";
                // _products.push(_product);
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Tipo Institución creada",
                    life: 3000,
                });
            }

            settipoInstituciones(_products);
            settipoInstitucionDialog(false);
            settipoInstitucion(emptyProvincia);
        }
    };

    const editProduct = (product) => {
        settipoInstitucion({ ...product });
        settipoInstitucionDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        settipoInstitucion(product);
        setDeletetipoInstitucionDialog(true);
    };

    const deleteProduct = () => {
        let _products = tipoInstituciones.filter((val) => val.id !== tipoInstitucion.id);
        settipoInstituciones(_products);
        setDeletetipoInstitucionDialog(false);
        settipoInstitucion(emptyProvincia);
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

    const createId = () => {
        let id = "";
        let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeletetipoInstitucionesDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = tipoInstituciones.filter((val) => !selectedtipoInstituciones.includes(val));
        settipoInstituciones(_products);
        setDeletetipoInstitucionesDialog(false);
        setSelectedtipoInstituciones(null);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Instituciones eliminadas ",
            life: 3000,
        });
    };

    const onCategoryChange = (e) => {
        let _product = { ...tipoInstitucion };
        _product["category"] = e.value;
        settipoInstitucion(_product);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...tipoInstitucion };
        _product[`${name}`] = val;

        settipoInstitucion(_product);
    };

    const onInputNumberChange = (e, nombre) => {
        const val = e.value || 0;
        let _product = { ...tipoInstitucion };
        _product[`${nombre}`] = val;

        settipoInstitucion(_product);
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

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
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

    const imageBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={`assets/demo/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
            </>
        );
    };

    const priceBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(rowData.price)}
            </>
        );
    };

    const categoryBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Category</span>
                {rowData.category}
            </>
        );
    };

    const ratingBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Reviews</span>
                <Rating value={rowData.rating} readonly cancel={false} />
            </>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteProduct(rowData)} />
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
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
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

                    <Dialog visible={tipoInstitucionDialog} style={{ width: "450px" }} header="Provincia" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
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

                    <Dialog visible={deletetipoInstitucionDialog} style={{ width: "450px" }} header="Confirmación" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {tipoInstitucion && (
                                <span>
                                    Está seguro de borrar<b>{tipoInstitucion.nombre}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletetipoInstitucionesDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
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