import { Auth } from "./auth";

export class CustomHttp {
    public static async request (url: string, method: string = "GET", body: any = null): Promise<any> {
        const params : any = {
            method : method,
            headers : {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            }
        }

        const token: string | null = localStorage.getItem(Auth.accessTocken);
        if(token) {
            params.headers['x-auth-token'] = token; //pars??
        }

        if(body) {
            params.body = JSON.stringify(body)
        }

        let response: Response = await fetch(url, params); 

        if(response.status === 401) {
            const reloginStatus: boolean = await Auth.relogin();
            if (reloginStatus) {
                return this.request(url, method, body);
            }
        }

        return await response.json();

    }
}