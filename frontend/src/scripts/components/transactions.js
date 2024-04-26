import { Data } from "../../../../backendData";
import { Datepicker, datepicker } from "../common/datepicker";
import { Timebar } from "../common/timebar";
import { Config } from "../config";
import { CustomHttp } from "../services/custom-http";


export class Transactions {
    constructor () {
        this.transactions = [];
        this.table = document.getElementById('table_body');
        this.timebar = new Timebar(this.fillTable.bind(this));
    }

    fillTable(transactions) {
        console.log(transactions)
        this.table.innerHTML = '';
        this.transactions = []
        if(transactions) {
            transactions.forEach( transactionInfo => {
                const t = new Transaction(transactionInfo);
                this.transactions.push(t);
            });
            this.transactions.forEach(item => {
                item.pushRow();
            })
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
        editRow.setAttribute('href', "#/transactions/edit?" + this.id);

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
            CustomHttp.request(Config.host + 'operations/' + this.id, 'DELETE');
            this.popupElement.style.display = 'none';
            this.motherElement.removeChild(this.element);
        }

        this.btnNoElement.onclick = () => {
            this.popupElement.style.display = 'none';
        }

    }
}