import axios from 'axios';

const url="http://localhost:9090/api/v1.0/tipoInstitucion/";
export class TipoInstitucionService {    

    getTipoInstitucion() {
        return axios.get(url).then(res => res.data.result);
    }
    putTipoInstitucion(provin) {
        return axios.put(url, provin)
    }

    postTipoInstitucion(provi) {
        return axios.post(url, provi);
    }

    deleteTipoInstitucion(id){
        return axios.delete(url+id).then(resp=>console.log(resp))
    }
}