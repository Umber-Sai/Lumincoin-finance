import { Config } from "../config";
import { Auth } from "../services/auth";
import { CustomHttp } from "../services/custom-http";
import { UserType } from "../types/auth.type";
import { BalanceResponseType } from "../types/balance-responcse.type";
import { DefaultResponseType } from "../types/default-response.type";

export class Aside {

    readonly balanceElement: HTMLElement | null = document.getElementById('balance');
    readonly balancePopup: HTMLElement | null = document.getElementById('balance_popup');
    readonly balanceStatusElement: HTMLElement | null = document.getElementById('balance_status');
    readonly contentElement: HTMLElement | null = document.getElementById('content');
    readonly userElement: HTMLElement | null = document.getElementById('user')
    readonly userPopup: HTMLElement | null = document.getElementById('user_popup')
    readonly userFullName: HTMLElement | null = document.getElementById('userName');
    readonly navbarButtons = document.getElementsByName('navbar') as NodeListOf<HTMLButtonElement>;


    constructor () {
        this.navbarButtons.forEach((element: HTMLButtonElement) => {
            element.onclick = (event) => {
                window.location.href = '#/' + (event.target as HTMLButtonElement).id;
                // console.log(event.target.id)
            }
        })

        this.fillAside();

        if(this.balanceElement) {
            this.balanceElement.addEventListener('click', () => {
                if(this.balancePopup) {
                    this.balancePopup.style.display = 'flex';
                } else throw new Error('Balance popup not found');

                const input = document.getElementById('change_balance') as HTMLInputElement | null;
                if(input) {
                    if(this.balanceStatusElement) {
                        input.value = this.balanceStatusElement.innerText
                    } else throw new Error('Balance element not found');
                } else throw new Error("Popup's input not found");
    
                const confirmBalance: HTMLElement | null = document.getElementById('confirm_balance');
                if(confirmBalance) {
                    confirmBalance.onclick = async () => {
                        await CustomHttp.request(Config.host + 'balance', 'PUT', {
                            newBalance : input.value
                        });
                        this.balancePopup!.style.display = 'none';
                        this.getBalance()
                    }
                } else throw new Error("Confirm balance not found");
                
                const cancelBalance = document.getElementById('cancel_balance');
                if(cancelBalance) {
                    cancelBalance.onclick = () => {
                        this.balancePopup!.style.display = 'none';
                    }
                } else throw new Error("Cancel balance not found");
            });
        } else throw new Error('Balance element not found');

        if(this.userElement) {
            this.userElement.onclick = () => {
                if(this.userPopup) {
                    this.userPopup.style.display = 'flex';

                    const userCancel: HTMLElement | null = document.getElementById('user_cancel');
                    if(userCancel) {
                        userCancel.onclick = () => {
                            this.userPopup!.style.display = 'none';
                        }
                    } else throw new Error('User cancel button not found');
                } else throw new Error('User popup not found');

                const userExit: HTMLElement | null = document.getElementById('user_exit');
                if(userExit) {
                    userExit.onclick = () => {
                        CustomHttp.request(Config.host + 'logout', 'POST', {
                            "refreshToken" : localStorage.getItem(Auth.refreshTocken)
                        });
                        Auth.logout();
                        location.href = '#/login'
                    }
                } else throw new Error('Balance exit button not found');
            }
        } else throw new Error('Balance element not found');


    }

    private fillAside (): void {
        this.getBalance();

        const userInfo: UserType = Auth.getUserInfo();
        if(this.userFullName) this.userFullName.innerText = userInfo.name + ' ' + userInfo.lastName;
    }

    async getBalance() {
        try {
            const response: DefaultResponseType | BalanceResponseType = await CustomHttp.request(Config.host + 'balance');
            if(response as DefaultResponseType) {
                throw new Error((response as DefaultResponseType).message)
            }
            if(this.balanceStatusElement) {
                this.balanceStatusElement.innerText = ((response as BalanceResponseType).balance === null? '0' : (response as BalanceResponseType).balance.toString());
            };
        } catch (error) {
            console.error(error);
        }
    }
}