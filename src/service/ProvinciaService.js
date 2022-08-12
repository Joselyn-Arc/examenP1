import axios from 'axios';

export class ProvinciaService {

    getProvincia() {
        return axios.get('http://localhost:9090/api/v1.0/provincia').then(res => res.data.result);
    }
    putProvincia(provin) {
        return axios.put('http://localhost:9090/api/v1.0/provincia', provin)
    }

    postProvincia(provi) {
        return axios.post('http://localhost:9090/api/v1.0/provincia', provi);
    }

    deleteProvincia(id){
        return axios.delete('http://localhost:9090/api/v1.0/provincia/ + id')
    }
}