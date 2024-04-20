import { Category } from "./components/category.js";
import { Create, Edit } from "./components/editor.js";
import { Form } from "./components/form.js";
import { Main } from "./components/main.js";
import { Transactions } from "./components/transactions.js";
import { Config } from "./config.js";


export class Router {
    constructor () {
        this.styleElement = document.getElementById('style');
        this.titleElement = document.getElementById('page-title');
        this.bodyElement = document.getElementById('body');
        this.newRout = null;
        this.urlRoute = null;

        this.authRoutes = [
            {
                name : 'Вход в систему',
                rout : '#/login',
                style : 'styles/authentication.css',
                template : 'templates/authentication.html',
                load : () => {
                    new Form('login');
                }
            },
            {
                name : 'Регистрация',
                rout : '#/signup',
                style : 'styles/authentication.css',
                template : 'templates/authentication.html',
                load : () => {
                    new Form('signup')
                }
            },
        ]

        this.routes = [
            {
                name : 'Главная',
                rout : '#/main',
                style : 'styles/main.css',
                template : 'templates/main.html',
                load : () => {
                    new Main ();
                }
            },


            {
                name : 'Доходы и расходы',
                rout : '#/transactions',
                style : 'styles/transactions.css',
                template : 'templates/transactions.html',
                load : () => {
                    new Transactions()
                }
            },
            {
                name : 'Доходы и расходы',
                rout : '#/transactions/create',
                style : 'styles/editor.css',
                template : 'templates/editor.html',
                load : () => {
                    new Create('transactions')
                }
            },
            {
                name : 'Доходы и расходы',
                rout : '#/transactions/edit',
                style : 'styles/editor.css',
                template : 'templates/editor.html',
                load : () => {
                    new Edit ('transactions')
                }
            },


            {
                name : 'Доходы',
                rout : '#/income',
                style : 'styles/category.css',
                template : 'templates/category.html',
                load : () => {
                    new Category('income');
                }
            },
            {
                name : 'Доходы',
                rout : '#/income/create',
                style : 'styles/editor.css',
                template : 'templates/editor.html',
                load : () => {
                    new Create('income')
                }
            },
            {
                name : 'Доходы',
                rout : '#/income/edit',
                style : 'styles/editor.css',
                template : 'templates/editor.html',
                load : () => {
                    new Edit('income')
                }
            },



            {
                name : 'Расходы',
                rout : '#/expense',
                style : 'styles/category.css',
                template : 'templates/category.html',
                load : () => {
                    new Category('expense');
                }
            },
            {
                name : 'Расходы',
                rout : '#/expense/create',
                style : 'styles/editor.css',
                template : 'templates/editor.html',
                load : () => {
                    new Create('expense');
                }
            },
            {
                name : 'Расходы',
                rout : '#/expense/edit',
                style : 'styles/editor.css',
                template : 'templates/editor.html',
                load : () => {
                    new Edit('expense')
                }
            },
        ]
    }

    async openRoute () {
        this.urlRoute = window.location.hash.split('?');

        this.newRout = this.routes.find(item => item.rout === this.urlRoute[0]);
        if (this.newRout) {
            this.fillPage( await this.motherElement('content'));
            return
        } 

        this.newRout = this.authRoutes.find(item => item.rout === this.urlRoute[0]);
        if (this.newRout) {
            this.fillPage(this.bodyElement);
            return
        }
        window.location.href = Config.startPage;
        return
    }

    async fillPage (motherElement) {
        this.styleElement.setAttribute('href', this.newRout.style);
        this.titleElement.innerText = this.newRout.name;
        motherElement.innerHTML = await fetch(this.newRout.template).then(resp => resp.text());
        this.newRout.load();
    }

    async motherElement (idName) {
        let motherElement = document.getElementById(idName);
        if (!motherElement) {
            this.bodyElement.innerHTML = await fetch('templates/aside.html').then(resp => resp.text());
            motherElement = document.getElementById(idName);
        }
        return motherElement;
    }
}