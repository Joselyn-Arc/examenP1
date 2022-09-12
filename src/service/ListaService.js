import axios from "axios";

const url = "http://localhost:9090/api/v1.0/lista/";
export class ListaService {
 
        getLista( state) {
            return axios
                .get(url )
                .then((res) => {
                    state(res.data.result);
                    const data = res.data.result;
                    return data;
                })
                .catch(function (error) {
                    if (error.response) {
                        return error.response.status;
                    }
                });
        }
    
        getLista(state) {
            return axios
                .get(url)
                .then((res) => {
                    if (res.data.success) {
                        state(res.data.result);
                        return res.data.result;
                    }
                })
                .catch(function (error) {
                    if (error.response) {
                        return error.response.status;
                    }
                });
        }
    
        putLista(data) {
            return axios.put(url, data).catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
        }
    
        postLista(data) {
            return axios.post(url, data).catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
        }
    }