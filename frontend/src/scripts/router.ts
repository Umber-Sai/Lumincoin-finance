import { RouteType } from "./types/route.type";
import { Aside } from "./components/aside";
import { Category } from "./components/category";
import { Create, Edit } from "./components/editor";
import { Form } from "./components/form";
import { Main } from "./components/main";
import { Transactions } from "./components/transactions";
import { Config } from "./config";
import { FormTypes } from "./types/form.type";


export class Router {

    readonly styleElement: HTMLElement | null = document.getElementById('style');
    readonly titleElement: HTMLElement | null = document.getElementById('page-title');
    readonly bodyElement: HTMLElement | null = document.getElementById('body');
    private newRout: RouteType | undefined = undefined;
    private aside: Aside | null = null;
    readonly authRoutes: RouteType[];
    readonly routes: RouteType[]

    constructor () {
        this.authRoutes = [
            {
                name : 'Вход в систему',
                rout : '#/login',
                style : 'styles/authentication.css',
                template : 'templates/authentication.html',
                load : () => {
                    new Form(FormTypes.login);
                }
            },
            {
                name : 'Регистрация',
                rout : '#/signup',
                style : 'styles/authentication.css',
                template : 'templates/authentication.html',
                load : () => {
                    new Form(FormTypes.signup)
                }
            },
        ]

        this.routes = [
            {
                name : 'Главная',
                rout : '#/main',
                style : 'styles/main.css',
                template : 'templates/main.html',
                load : async () => {
                    await this.aside?.getBalance()
                    new Main ();
                }
            },


            {
                name : 'Доходы и расходы',
                rout : '#/transactions',
                style : 'styles/transactions.css',
                template : 'templates/transactions.html',
                load : async () => {
                    await this.aside?.getBalance()
                    new Transactions()
                }
            },
            {
                name : 'Доходы и расходы',
                rout : '#/transactions/create',
                style : 'styles/editor.css',
                template : 'templates/editor.html',
                load : async () => {
                    await this.aside?.getBalance()
                    new Create('transactions')
                }
            },
            {
                name : 'Доходы и расходы',
                rout : '#/transactions/edit',
                style : 'styles/editor.css',
                template : 'templates/editor.html',
                load : async () => {
                    await this.aside?.getBalance()
                    new Edit ('transactions')
                }
            },


            {
                name : 'Доходы',
                rout : '#/income',
                style : 'styles/category.css',
                template : 'templates/category.html',
                load : async () => {
                    await this.aside?.getBalance()
                    new Category('income');
                }
            },
            {
                name : 'Доходы',
                rout : '#/income/create',
                style : 'styles/editor.css',
                template : 'templates/editor.html',
                load : async () => {
                    await this.aside?.getBalance()
                    new Create('income')
                }
            },
            {
                name : 'Доходы',
                rout : '#/income/edit',
                style : 'styles/editor.css',
                template : 'templates/editor.html',
                load : async () => {
                    await this.aside?.getBalance()
                    new Edit('income')
                }
            },



            {
                name : 'Расходы',
                rout : '#/expense',
                style : 'styles/category.css',
                template : 'templates/category.html',
                load : async () => {
                    await this.aside?.getBalance()
                    new Category('expense');
                }
            },
            {
                name : 'Расходы',
                rout : '#/expense/create',
                style : 'styles/editor.css',
                template : 'templates/editor.html',
                load : async () => {
                    await this.aside?.getBalance()
                    new Create('expense');
                }
            },
            {
                name : 'Расходы',
                rout : '#/expense/edit',
                style : 'styles/editor.css',
                template : 'templates/editor.html',
                load : async () => {
                    await this.aside?.getBalance()
                    new Edit('expense')
                }
            },
        ]
    }

    public async openRoute (): Promise<void> {
        const urlRoute: string[] = window.location.hash.split('?');

        this.newRout = this.routes.find(item => item.rout === urlRoute[0]);
        if (this.newRout) {
            this.fillPage( await this.motherElement('content'));
            return
        } 

        this.newRout = this.authRoutes.find(item => item.rout === urlRoute[0]);
        if (this.newRout) {
            this.fillPage(this.bodyElement!);
            return
        }
        window.location.href = Config.startPage;
        return
    }
    
    private async motherElement (idName: string): Promise<HTMLElement> {
        let motherElement: HTMLElement | null = document.getElementById(idName);
        if (!motherElement) {
            this.bodyElement!.innerHTML = await fetch('templates/aside.html').then(resp => resp.text());
            this.aside = new Aside();
            motherElement = document.getElementById(idName);
        } 

        if(motherElement) {
            return motherElement;
        } else {
            throw new Error("<div class='content'>... Not found");
        }
    }

    private async fillPage (motherElement: HTMLElement): Promise<void> {
        if(!this.newRout) throw new Error('newRoute Not found');
        if(this.styleElement && this.titleElement) {
            this.styleElement.setAttribute('href', this.newRout.style);
            this.titleElement.innerText = this.newRout.name;
        } else {
            throw new Error('styleElement or titleElement Not found')
        }
        motherElement.innerHTML = await fetch(this.newRout.template).then(resp => resp.text());
        this.newRout.load();
    }

}