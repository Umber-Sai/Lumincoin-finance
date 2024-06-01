import { Config } from "../config";
import { ReloginType, TokensType, UserType } from "../types/auth.type";

export class Auth {
    public static userInfo: string = 'userInfo';
    public static accessTocken: string = 'accessTocken';
    public static refreshTocken: string = 'refreshTocken';

    public static async relogin (): Promise<boolean> {
        const refreshTocken: string | null = localStorage.getItem(this.refreshTocken);// возможно надо парсить
        if (refreshTocken) {
            const response: Response = await fetch(Config.host + 'refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body : JSON.stringify({"refreshToken" : refreshTocken})
            });


            if(response && response.status === 200) {
                const result: ReloginType = await response.json();
                this.setTokens(result.tokens);
                return true;
            }
        }

        window.location.href = '#/login'
        this.logout()
        return false
    }

    public static setUserInfo (userInfo: UserType): void {
        console.log('set user info')
        localStorage.setItem(this.userInfo, JSON.stringify(userInfo));
    }

    public static getUserInfo (): UserType {
        const userInfo: string | null = localStorage.getItem(this.userInfo);
        if(userInfo) {
            return JSON.parse(userInfo)
        } else {
            location.href = '#/login'
            throw new Error('userInfo not found');
        }
    }

    public static setTokens (tokens: TokensType): void {
        localStorage.setItem(this.accessTocken, JSON.stringify(tokens.accessToken));
        localStorage.setItem(this.refreshTocken, JSON.stringify(tokens.refreshToken));
    }

    public static logout (): void {
        localStorage.removeItem(this.accessTocken)
        localStorage.removeItem(this.refreshTocken)
        localStorage.removeItem(this.userInfo)
    }
}
