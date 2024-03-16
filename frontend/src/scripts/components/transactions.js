import { Data } from "../../../../backendData";

export class Transactions {
    constructor () {
        const tableData = Data.transactions; //request to backend

        tableData.forEach((transaction, i) => {
            new Transaction(transaction, ++i);
        });
    }
}

class Transaction {
    constructor (data, id) {
        this.data = data
        this.id = id;
        this.motherElement = document.getElementById('table');

        this.popupElement = document.getElementById('popup');
        this.btnYesElement = document.getElementById('btnYes');
        this.btnNoElement = document.getElementById('btnNo');

        this.element = this.createElement();
        this.motherElement.appendChild(this.element)
    }

    createElement() {
        const rowElement = document.createElement('div');
        rowElement.className = 'row';

        const element = document.createElement('div');
        element.className = 'id';
        element.innerText = this.id;

        rowElement.appendChild(element);

        Object.keys(this.data).forEach(item => {
            const element = document.createElement('div');
            element.className = item
            element.innerText = this.data[item];
            if(item === 'type') {
                element.classList.add((this.data[item] === 'доход'? 'green' : 'red'));
            }

            rowElement.appendChild(element);
        });

        const actions = document.createElement('div');
        actions.className = 'row_actions'

        const trash = document.createElement('img');
        trash.setAttribute('src', './static/img/transactions/trash.svg');
        trash.setAttribute('alt', 'trash');
        trash.onclick = this.deleteEvent.bind(this)

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

    deleteEvent () {
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