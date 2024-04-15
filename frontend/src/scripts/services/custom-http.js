import { Auth } from "./auth";

export class CustomHttp {
    static async request (url, method = "GET", body = null) {
        const params = {
            method : method,
            headers : {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            }
        }

        const token = localStorage.getItem(Auth.accessTocken);
        if(token) {
            params.headers['x-auth-token'] = JSON.parse(token);
        }

        if(body) {
            params.body = JSON.stringify(body)
        }

        const response = await fetch(url, params); 

        if(response.status === 401) {
            Auth.relogin()
            this.request(url, method, body)
        }

        return await response.json();

    }
}