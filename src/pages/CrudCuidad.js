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
import { CiudadService } from "../service/CiudadService";
const CrudCiudad = () => {
    let emptyCiudad = {
        id: null,
        nombre: "",
        provincia: "",
    };

    const [ciudades, setCiudades] = useState(null);
    const [ciudadDialog, setCiudadDialog] = useState(false);
    const [deleteCiudadDialog, setDeleteCiudadDialog] = useState(false);
    const [deleteCiudadesDialog, setDeleteCiudadesDialog] = useState(false);
    const [ciudad, setCiudad] = useState(emptyCiudad);
    const [selectedCiudades, setSelectedCiudades] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const ciudadService = new CiudadService();
        ciudadService.getCiudad().then((data) => setCiudades(data));
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    };

    const openNew = () => {
        setCiudad(emptyCiudad);
        setSubmitted(false);
        setCiudadDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCiudadDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteCiudadDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteCiudadesDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (ciudad.nombre.trim()) {
            let _products = [...ciudades];
            let _product = { ...ciudad };
            if (ciudad.id) {
                const index = findIndexById(ciudad.id);

                _products[index] = _product;

                const ciudadService = new CiudadService();
                ciudadService.putCiudad(_product)
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Ciudad Actualizada ",
                    life: 3000,
                });
            } else {
                const ciudadService = new CiudadService();
                ciudadService.postCiudad(_product)
                // _product.id = createId();
                // _product.image = "product-placeholder.svg";
                // _products.push(_product);
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Ciudad creada",
                    life: 3000,
                });
            }

            setCiudades(_products);
            setCiudadDialog(false);
            setCiudad(emptyCiudad);
        }
    };

    const editProduct = (product) => {
        setCiudad({ ...product });
        setCiudadDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setCiudad(product);
        setDeleteCiudadDialog(true);
    };

    const deleteProduct = () => {
        let _products = ciudades.filter((val) => val.id !== ciudad.id);
        setCiudades(_products);
        setDeleteCiudadDialog(false);
        setCiudad(emptyCiudad);
        const ciudadservice = new CiudadService();
        ciudadservice.deleteCiudad(ciudad.id);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Ciudad eliminada",
            life: 3000,
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < ciudades.length; i++) {
            if (ciudades[i].id === id) {
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
        setDeleteCiudadesDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = ciudades.filter((val) => !selectedCiudades.includes(val));
        setCiudades(_products);
        setDeleteCiudadesDialog(false);
        setSelectedCiudades(null);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Ciudades eliminadas",
            life: 3000,
        });
    };

    const onCategoryChange = (e) => {
        let _product = { ...ciudad };
        _product["category"] = e.value;
        setCiudad(_product);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...ciudad };
        _product[`${name}`] = val;

        setCiudad(_product);
    };

    const onInputNumberChange = (e, nombre) => {
        const val = e.value || 0;
        let _product = { ...ciudad };
        _product[`${nombre}`] = val;

        setCiudad(_product);
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

    const provinciaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">NameP</span>
                {rowData.provincia.nombre}
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
            <h5 className="m-0">Ciudades</h5>
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
                        value={ciudades}
                        selection={selectedCiudades}
                        onSelectionChange={(e) => setSelectedCiudades(e.value)}
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
                        <Column field="name" header="Nombre Ciudad" body={nameBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="namep" header="Nombre Provincia" body={provinciaBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={ciudadDialog} style={{ width: "450px" }} header="Ciudad" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Nombre</label>
                            <InputText
                                id="nombre"
                                value={ciudad.nombre}
                                onChange={(e) => onInputChange(e, "nombre")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !ciudad.nombre,
                                })}
                            />
                            {submitted && !ciudad.nombre && <small className="p-invalid">El nombre de la ciudad es necesario.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteCiudadDialog} style={{ width: "450px" }} header="Confirmación" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {ciudad && (
                                <span>
                                    Está seguro de borrar la ciudad <b>{ciudad.nombre}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteCiudadesDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {ciudad && <span>Está seguro de borrar estas provincias?</span>}
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

export default React.memo(CrudCiudad, comparisonFn);