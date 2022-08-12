import axios from 'axios';

export class TipoInstitucionService {

    getTipoInstitucion() {
        return axios.get('http://localhost:9090/api/v1.0/tipoInstitucion').then(res => res.data.result);
    }
    putTipoInstitucion(provin) {
        return axios.put('http://localhost:9090/api/v1.0/tipoInstitucion', provin)
    }

    postTipoInstitucion(provi) {
        return axios.post('http://localhost:9090/api/v1.0/tipoInstitucion', provi);
    }

    deleteTipoInstitucion(id){
        return axios.delete('http://localhost:9090/api/v1.0/tipoInstitucions/ + id')
    }
}