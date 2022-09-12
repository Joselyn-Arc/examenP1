import axios from "axios";

const url = "http://localhost:9090/api/v1.0/procesoeleccion/";
export class ProcesoService {
 
    getProceso() {
        return axios.get(url).then(res => res.data.result);
    }
    
        getProceso(state) {
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
    
        putProceso(data) {
            return axios.put(url, data).catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
        }
    
        postProceso(data) {
            return axios.post(url, data).catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
        }
    }