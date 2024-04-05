
export class Auth {
    static userInfo = 'userInfo';
    static accessTocken = 'accessTocken';
    static refreshTocken = 'refreshTocken';


    static setUserInfo (userInfo) {
        localStorage.setItem(this.userInfo, JSON.stringify(userInfo));
    }

    static setTokens (tokens) {
        localStorage.setItem(this.accessTocken, JSON.stringify(tokens.accessToken));
        localStorage.setItem(this.refreshTocken, JSON.stringify(tokens.refreshToken));
    }
}
