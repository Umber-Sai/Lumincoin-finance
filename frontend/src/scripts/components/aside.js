import { Config } from "../config";
import { Auth } from "../services/auth.js";
import { CustomHttp } from "../services/custom-http.js";

export class Aside {
    constructor () {
        this.balanceElement = document.getElementById('balance');
        this.balancePopup = document.getElementById('balance_popup');
        this.balanceStatusElement = document.getElementById('balance_status');
        this.contentElement = document.getElementById('content');
        this.userElement = document.getElementById('user')
        this.userPopup = document.getElementById('user_popup')
        this.userFullName = document.getElementById('userName');

        this.fillAside();

       

        this.balanceElement.addEventListener('click', () => {
            this.balancePopup.style.display = 'flex';
            const input = document.getElementById('change_balance');
            input.value = this.balanceStatusElement.innerText

            document.getElementById('confirm_balance').onclick = async () => {
                await CustomHttp.request(Config.host + 'balance', 'PUT', {
                    newBalance : input.value
                });
                this.balancePopup.style.display = 'none';
                this.getBalance()
            }

            document.getElementById('cancel_balance').onclick = () => {
                this.balancePopup.style.display = 'none';
            }
        });

        this.userElement.onclick = () => {
            this.userPopup.style.display = 'flex';
            document.getElementById('user_exit').onclick = () => {
                CustomHttp.request(Config.host + 'logout', 'POST', {
                    "refreshToken" : JSON.parse(localStorage.getItem(Auth.refreshTocken))
                });
                Auth.logout();
                location.href = '#/login'
            }

            document.getElementById('user_cancel').onclick = () => {
                this.userPopup.style.display = 'none';
            }
        }
    }

    fillAside () {
        // let observer = new MutationObserver(() => {
        //     this.getBalance();
        // })
        // observer.observe(this.contentElement, {
        //     childList: true,
        //     subtree: true
        // });
        this.getBalance();

        const userInfo = Auth.getUserInfo();
        if(!userInfo) {
            location.href = '#/login';
            return
        }
        this.userFullName.innerText = userInfo.name + ' ' + userInfo.lastName;
    }

    async getBalance() {
        try {
            const response = await CustomHttp.request(Config.host + 'balance');
            if(response.error) {
                throw new Error(response.message)
            }
            this.balanceStatusElement.innerText = (response.balance === null? 0 : response.balance);
        } catch (error) {
            console.error(error);
        }
    }
}