import axios from "axios";

const url = "http://localhost:9090/api/v1.0/lista/";

export class ListaService {
    getLista() {
        return axios.get(url).then(res => res.data.result);
    }

    putLista(provin) {
        return axios.put(url, provin)
    }

    postLista(provi) {
        return axios.post(url, provi);
    }

    deleteLista(id){
        return axios.delete(url+id).then(resp=>console.log(resp))
    }
}