import axios from 'axios';

export class CiudadService {

    getCiudad() {
        return axios.get('http://localhost:9090/api/v1.0/provincia').then(res => res.data.result);
    }
    putCiudad(provin) {
        return axios.put('http://localhost:9090/api/v1.0/provincia', provin)
    }

    postCiudad(provi) {
        return axios.post('http://localhost:9090/api/v1.0/provincia', provi);
    }

    deleteCiudad(id){
        return axios.delete('http://localhost:9090/api/v1.0/provincia/ + id')
    }
}