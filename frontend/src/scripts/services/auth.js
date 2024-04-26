import { Config } from "../config";

export class Auth {
    static userInfo = 'userInfo';
    static accessTocken = 'accessTocken';
    static refreshTocken = 'refreshTocken';

    static async relogin () {
        const refreshTocken = JSON.parse(localStorage.getItem(this.refreshTocken));
        if (refreshTocken) {
            const response = await fetch(Config.host + 'refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body : JSON.stringify({refreshToken : refreshTocken})
            });

            console.log(response)

            if(response && response.status === 200) {
                const result = await response.json();
                this.setTokens(result.tokens);
                return true;
            }

            window.location.href = '#/login'
            return false
        }

        window.location.href = '#/login'
        return false
    }

    static setUserInfo (userInfo) {
        localStorage.setItem(this.userInfo, JSON.stringify(userInfo));
    }

    static getUserInfo () {
        const userInfo = localStorage.getItem(this.userInfo);
        return JSON.parse(userInfo)
    }

    static setTokens (tokens) {
        localStorage.setItem(this.accessTocken, JSON.stringify(tokens.accessToken));
        localStorage.setItem(this.refreshTocken, JSON.stringify(tokens.refreshToken));
    }

    static logout () {
        localStorage.removeItem(this.accessTocken)
        localStorage.removeItem(this.refreshTocken)
        localStorage.removeItem(this.userInfo)
    }
}
