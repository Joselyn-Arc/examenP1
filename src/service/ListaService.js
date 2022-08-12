import axios from "axios";

export class ListaService {
  getLista() {
    return axios.get('http://localhost:9090/api/v1.0/lista').then(res => res.data.result);
  }

  putLista(ls) {
    return axios.put('http://localhost:9090/api/v1.0/lista', ls)
  }

  postLista(list) {
    return axios.post('http://localhost:9090/api/v1.0/lista', list);
  }

  deleteLista(id){
    return axios.delete('http://localhost:9090/api/v1.0/ciudad/ + id')
  }

}