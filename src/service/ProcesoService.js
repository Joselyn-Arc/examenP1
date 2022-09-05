import axios from "axios";

const url = "http://localhost:9090/api/v1.0/proceso/";

export class ProcesoService {
    getProceso(nombreproceso, state) {
        return axios.get(url + nombreproceso).then((res) => {
            state(res.data.result);
            const data = res.data.result;
            window.localStorage.setItem(
                "proceso",
                JSON.stringify({
                    nombreproceso: data.nombreproceso,
                })
            );
            return data;
        });
    }
    updateProceso(data) {
        return axios.put(url, data);
    }
}
