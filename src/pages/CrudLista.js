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
import { ListaService } from "../service/ListaService";


const CrudLista = () => {
    let emptyProvincia = {
        id: null,
        nombre: "",
        logo: "",
        nombre: "",
        procesoEleccion: "",
        activado: "",
    };

    const [listas, setListas] = useState(null);
    const [listaDialog, setListaDialog] = useState(false);
    const [deleteListaDialog, setDeleteListaDialog] = useState(false);
    const [deleteListasDialog, setDeleteListasDialog] = useState(false);
    const [lista, setLista] = useState(emptyProvincia);
    const [selectedListas, setSelectedListas] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const listaService = new ListaService();
        listaService.getLista().then((data) => setListas(data));
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    };

    const openNew = () => {
        setLista(emptyProvincia);
        setSubmitted(false);
        setListaDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setListaDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteListaDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteListasDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (lista.nombre.trim()) {
            let _products = [...listas];
            let _product = { ...lista };
            if (lista.id) {
                const index = findIndexById(lista.id);

                _products[index] = _product;

                const lisserv = new ListaService();
                lisserv.putLista(_product)
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Lista actualizada",
                    life: 3000,
                });
            } else {
                const lisserv = new ListaService();
                lisserv.postLista(_product)
                // _product.id = createId();
                // _product.image = "product-placeholder.svg";
                // _products.push(_product);
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Lista creada",
                    life: 3000,
                });
            }

            setListas(_products);
            setListaDialog(false);
            setLista(emptyProvincia);
        }
    };

    const editProduct = (product) => {
        setLista({ ...product });
        setListaDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setLista(product);
        setDeleteListaDialog(true);
    };

    const deleteProduct = () => {
        let _products = listas.filter((val) => val.id !== lista.id);
        setListas(_products);
        setDeleteListaDialog(false);
        setLista(emptyProvincia);
        const lisserv = new ListaService();
        lisserv.deleteLista(lista.id);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Lista eliminada",
            life: 3000,
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < listas.length; i++) {
            if (listas[i].id === id) {
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
        setDeleteListasDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = listas.filter((val) => !selectedListas.includes(val));
        setListas(_products);
        setDeleteListasDialog(false);
        setSelectedListas(null);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Listas eliminadas",
            life: 3000,
        });
    };

    const onCategoryChange = (e) => {
        let _product = { ...lista };
        _product["category"] = e.value;
        setLista(_product);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...lista };
        _product[`${name}`] = val;

        setLista(_product);
    };

    const onInputNumberChange = (e, nombre) => {
        const val = e.value || 0;
        let _product = { ...lista };
        _product[`${nombre}`] = val;

        setLista(_product);
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

    const LogoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Logo</span>
                {rowData.logo}
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

    const procesoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">ProcesoEleccion</span>
               {rowData.procesoeleccion.nombreproceso}
            </>
        );
    };

    const activoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Activo</span>
                {rowData.activo}
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
            <h5 className="m-0">Provincias</h5>
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
                        value={listas}
                        selection={selectedListas}
                        onSelectionChange={(e) => setSelectedListas(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        globalFilter={globalFilter}
                        emptyMessage="No existen provincias registradas."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="code" header="Id" body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="logo" header="Logo" body={LogoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="name" header="Nombre" body={nameBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="proceso" header="Proceso" body={procesoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="activo" header="Activado" body={activoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                    </DataTable>

                    <Dialog visible={listaDialog} style={{ width: "450px" }} header="Lista" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                        <label htmlFor="logo">Logo</label>
                            <InputText
                                id="logo"
                                value={lista.logo}
                                onChange={(e) => onInputChange(e, "logo")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !lista.logo,
                                })}
                            />
                            {submitted && !lista.nombre && <small className="p-invalid">Es necesario cargar el logo.</small>}
                            
                            <label htmlFor="name">Nombre</label>
                            <InputText
                                id="nombre"
                                value={lista.nombre}
                                onChange={(e) => onInputChange(e, "nombre")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !lista.nombre,
                                })}
                            />
                            {submitted && !lista.nombre && <small className="p-invalid">El nombre de la lista es necesario.</small>}
                            
                            <label htmlFor="proceso">Proceso</label>
                            <InputText
                                id="proceso"
                                value={lista.nombre}
                                onChange={(e) => onInputChange(e, "proceso")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !lista.proceso,
                                })}
                            />
                            {submitted && !lista.nombre && <small className="p-invalid">Selecciona el nombre del proceso.</small>}
                            </div>
                    </Dialog>

                    <Dialog visible={deleteListaDialog} style={{ width: "450px" }} header="Confirmación" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {lista && (
                                <span>
                                    Está seguro de borrar la lista <b>{lista.nombre}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteListasDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {lista && <span>Está seguro de borrar estas listas?</span>}
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

export default React.memo(CrudLista, comparisonFn);