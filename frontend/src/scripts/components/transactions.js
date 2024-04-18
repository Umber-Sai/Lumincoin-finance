import { Data } from "../../../../backendData";
import { Config } from "../config";
import { CustomHttp } from "../services/custom-http";

export class Transactions {
    constructor () {
        this.transactions = [];
        this.table = document.getElementById('table_body');


        document.getElementsByName('date').forEach(button => {
            button.addEventListener('click', () => {
                this.table.innerHTML = '';
                this.transactions = []
                this.requestTransactions(button.value);
            })
        });
    }

    async requestTransactions (period) {
        console.log(period);
        const response = await CustomHttp.request(Config.host + 'operations?period=' + period );
        console.log(response);
        if(response) {
            response.forEach( transactionInfo => {
                const t = new Transaction(transactionInfo);
                this.transactions.push(t);
            });
            this.transactions.sort(function (a, b) {
                return a.id - b.id;
            })
            this.transactions.forEach(item => {
                item.pushRow();
            })
            console.log(this.transactions)
        }
    }
}








class Transaction {
    constructor (data) {
        this.data = data
        this.id = data.id;
        this.motherElement = document.getElementById('table_body');

        this.popupElement = document.getElementById('popup');
        this.btnYesElement = document.getElementById('btnYes');
        this.btnNoElement = document.getElementById('btnNo');

        this.element = this.createElement();
    }

    createElement() {
        const rowElement = document.createElement('div');
        rowElement.className = 'row';

        const rowItems = ['id', 'type', 'category', 'amount', 'date', 'comment'];
        
        rowItems.forEach(item => {
            const element = document.createElement('div');
            element.className = item;
            element.innerText = this.data[item];
            if(item === 'type') {
                element.innerText = (this.data[item] === 'income'? 'доход' : 'расход');
                element.classList.add((this.data[item] === 'income'? 'green' : 'red'));
            }

            rowElement.appendChild(element);
        });

        const actions = document.createElement('div');
        actions.className = 'row_actions'

        const trash = document.createElement('img');
        trash.setAttribute('src', './static/img/transactions/trash.svg');
        trash.setAttribute('alt', 'trash');
        trash.onclick = this.deleteRow.bind(this)

        const editRow = document.createElement('a');
        editRow.setAttribute('href', "#/transactions/edit");

        const pen = document.createElement('img');
        pen.setAttribute('src', './static/img/transactions/pen.svg');
        pen.setAttribute('alt', 'pen');


        actions.appendChild(trash)
        editRow.appendChild(pen)
        actions.appendChild(editRow)

        rowElement.appendChild(actions);


        return rowElement;
    }

    pushRow () {
        this.motherElement.appendChild(this.element);
    }

    deleteRow () {
        this.popupElement.style.display = 'flex';

        this.btnYesElement.onclick = () => {
            this.popupElement.style.display = 'none';
            this.motherElement.removeChild(this.element);
        }

        this.btnNoElement.onclick = () => {
            this.popupElement.style.display = 'none';
        }

    }
}