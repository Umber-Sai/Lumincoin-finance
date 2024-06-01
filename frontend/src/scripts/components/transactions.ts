
import { Timebar } from "../common/timebar";
import { Config } from "../config";
import { CustomHttp } from "../services/custom-http";
import { RowType } from "../types/row-item.type";
import { TransactionInfoType } from "../types/transaction.type";


export class Transactions {

    private transactions: Array<Transaction> = [];
    private table: HTMLElement | null = document.getElementById('table_body');
    // private timebar: Timebar = new Timebar(this.fillTable.bind(this));
    constructor () {
        if(!this.table) throw new Error('Teble element not found');
        new Timebar(this.fillTable.bind(this));
    }

    private fillTable(transactions: Array<TransactionInfoType>): void {
        this.table!.innerHTML = '';
        this.transactions = []
        if(transactions) {
            transactions.forEach( transactionInfo => {
                const t: Transaction = new Transaction(transactionInfo, this.table!);
                this.transactions.push(t);
            });
            this.transactions.forEach(item => {
                item.pushRow();
            })
        }
    }
}








class Transaction {

    readonly data: TransactionInfoType;
    readonly id: number;
    readonly motherElement: HTMLElement;

    readonly popupElement: HTMLElement | null = document.getElementById('popup');
    readonly btnYesElement: HTMLElement | null = document.getElementById('btnYes');
    readonly btnNoElement: HTMLElement | null = document.getElementById('btnNo');

    private element: HTMLElement;

    constructor (data: TransactionInfoType, motherElement: HTMLElement) {
        this.data = data;
        this.id = data.id;
        this.motherElement = motherElement;

        this.element = this.createElement();
    }

    private createElement(): HTMLElement {
        const rowElement = document.createElement('div');
        rowElement.className = 'row';

        // const rowItems: Array<string> = ['id', 'type', 'category', 'amount', 'date', 'comment'];
        const rowItems: Array<RowType> = [RowType.id, RowType.type, RowType.category, RowType.amount, RowType.date, RowType.comment];
        
        rowItems.forEach((item: RowType) => {
            const element: HTMLElement = document.createElement('div');
            element.className = item;
            element.innerText = this.data[item].toString()
            if(item === 'type') {
                element.innerText = (this.data[item] === 'income'? 'доход' : 'расход');
                element.classList.add((this.data[item] === 'income'? 'green' : 'red'));
            }

            rowElement.appendChild(element);
        });

        const actions: HTMLElement = document.createElement('div');
        actions.className = 'row_actions'

        const trash: HTMLImageElement = document.createElement('img');
        trash.setAttribute('src', './static/img/transactions/trash.svg');
        trash.setAttribute('alt', 'trash');
        trash.onclick = this.deleteRow.bind(this)

        const editRow: HTMLElement = document.createElement('a');
        editRow.setAttribute('href', "#/transactions/edit?" + this.id);

        const pen: HTMLImageElement = document.createElement('img');
        pen.setAttribute('src', './static/img/transactions/pen.svg');
        pen.setAttribute('alt', 'pen');


        actions.appendChild(trash)
        editRow.appendChild(pen)
        actions.appendChild(editRow)

        rowElement.appendChild(actions);


        return rowElement;
    }

    public pushRow (): void {
        this.motherElement.appendChild(this.element);
    }

    private deleteRow (): void {
        if(!this.popupElement || !this.btnNoElement || !this.btnYesElement) throw new Error('Popup not found')
        this.popupElement.style.display = 'flex';
        

        this.btnYesElement.onclick = () => {
            CustomHttp.request(Config.host + 'operations/' + this.id, 'DELETE');
            this.popupElement!.style.display = 'none';
            this.motherElement!.removeChild(this.element);
        }

        this.btnNoElement.onclick = () => {
            this.popupElement!.style.display = 'none';
        }

    }
}