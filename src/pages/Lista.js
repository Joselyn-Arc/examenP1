import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import { Dropdown } from "primereact/dropdown";
import { ListaService } from "../service/ListaService";
import { ProcesoService } from "../service/ProcesoService";


const Lista = () => {
    let emptyProduct = {
        id: null,  
        logo:"", 
        nombre: "",
        activo:"",
        proceso:""
    };

    const [listas, setListas] = useState(null);
    const [instituciones, setinstituciones] = useState(null);
    const [procesos, setProcesos] = useState(null);

    const [listasDialog, setListasDialog] = useState(false);
    const [deleteListaDialog, setDeleteListaDialog] = useState(false);
    const [deleteListasDialog, setDeleteListasDialog] = useState(false);

    const [lista, setLista] = useState(emptyProduct);  
    const [institucion, setinstitucion] = useState(null); 
    const [proceso, setProceso] = useState(null); 


    const [selectedCand, setSelectedCands] = useState(null);

    const [submitted, setSubmitted] = useState(false);
    const [submittedInstitucion, setSubmittedInstitucion] = useState(false);
    const [submittedProceso, setSubmittedProceso] = useState(false);

    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const candService = new ListaService();
        candService.getLista().then((data) => setListas(data));

        const sexo = new ProcesoService();
        sexo.getProceso(setProcesos);

    }, []);

    

    const openNew = () => {
        setLista(emptyProduct);
        setinstitucion({});
        setProceso({});
        setSubmittedInstitucion(false);
        setSubmittedProceso(false);

        setListasDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setSubmittedInstitucion(false);
        setListasDialog(false);
        setSubmittedProceso(false);

      
    };

    const hideDeleteProductDialog = () => {
        setDeleteListaDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteListasDialog(false);
    };

    const saveLista = () => {
        setSubmitted(true);
        setSubmittedInstitucion(true);
        setSubmittedProceso(true);


        if (lista.nombre.trim()) {
            lista.institucion=institucion;
            let _products = [...listas];
            let _product = { ...lista };
            if (lista.id) {
                const object = new ListaService();
                object.putLista(lista);

                const index = findIndexById(lista.id);
                _products[index] = _product;
          
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Lista Updated",
                    life: 3000,
                });
            } else {

                const listaService=new ListaService();
                 listaService.postLista(_product);
               _products.push(_products);
                
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Lista Created",
                    life: 3000,
                });
            }

            setLista(_products);
            setListasDialog(false);
            setLista(emptyProduct);
        }
    };

    const editProduct = (product) => {
        setListas({ ...product });
        setinstitucion({...lista.votante});
        setProceso({...proceso.sexo});
        setListasDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setLista(product);
        setDeleteListaDialog(true);
    };
   

    const deleteProduct = () => {

        const  liService= new ListaService();
        liService.deleteLista(listas.id);

        let _products = listas.filter((val) => val.id !== listas.id);
        setLista(_products);
        setDeleteListaDialog(false);
        setLista(emptyProduct);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Lista Deleted",
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


    const deleteSelectedProducts = () => {
        let _products = listas.filter((val) => !selectedCand.includes(val));
        setDeleteListaDialog(_products);
        setDeleteListaDialog(false);
        setSelectedCands(null);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Listas Deleted",
            life: 3000,
        });
    };

    const onInputChange = (e, nombre) => {
        const val = (e.target && e.target.value) || "";
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

    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.id}
            </>
        );
    };


    const logoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">logo</span>
                {rowData.logo}
            </>
        );
    };

    const nombreBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">nombre</span>
                {rowData.nombre}
            </>
        );
    };

    const institucionBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">institucion</span>
                {rowData.institucion.institucion}
            </>
        );
    };

    const procesoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">proceso</span>
                {rowData.procesoeleccion.procesoeleccion}
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

    const onInstitucionChange = (e) => {
        setinstitucion(e.value);
    };


    const onProcesoChange = (e) => {
        setProcesos(e.value);
    };


    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Lista</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveLista} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
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
                        selection={selectedCand}
                        onSelectionChange={(e) => setSelectedCands(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        globalFilter={globalFilter}
                        emptyMessage="No Lista found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="id" header="Id" body={idBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="logo" header="logo" body={logoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="nombre" header="Nombre" body={nombreBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="proceso" header="proceso" body={procesoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable> 
                        
                    <Dialog visible={listasDialog} style={{ width: "450px" }} header="Votante" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>                   

                    <div className="field">
                            <label htmlFor="name">Nombre </label>
                            <InputText
                                id="nombre"
                                value={lista.nombre}
                                onChange={(e) => onInputChange(e, "nombre")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !listas.nombre
                                })}
                            />
                            {submitted && !listas.nombre && <small className="p-invalid">El nombre es requerido.</small>}
 
                           
                           
                            <label htmlFor="name">Activo</label>
                            <InputText
                                id="isActive"
                                value={lista.isActive}
                                onChange={(e) => onInputChange(e, "isActive")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !listas.isActive
                                })}
                            />
                            {submitted && !listas.isActive && <small className="p-invalid">.....</small>}
                        </div>


                         <p/>        
                         <div>
                            <Dropdown id="name" value={proceso} required options={procesos} onChange={onProcesoChange} optionLabel="nombre" placeholder="Selecione un proceso" className={classNames({ "p-invalid": submittedProceso && !proceso.nombre })} />
                            {submittedProceso && !proceso.nombre && <small className="p-invalid">Es requerido </small>}
                         </div>


                    </Dialog>

                 <Dialog visible={deleteListaDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {listas && (
                                <span>
                                    Are you sure you want to delete <b>{listas.nombre}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteListasDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {listas && <span>Are you sure you want to delete the selected products?</span>}
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

export default React.memo(Lista, comparisonFn);