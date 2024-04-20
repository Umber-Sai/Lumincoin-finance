import { Data } from "../../../../backendData";
import { Config } from "../config";
import { CustomHttp } from "../services/custom-http.js";



export class Category {
    constructor (type) {
        this.titleElement = document.getElementById('title');
        this.cardsElement = document.getElementById('cards');

        this.income = {
            title : 'Доходы',
            linkToCreate : '#/income/create',
            linkToEdit : '#/income/edit?'
        }

        this.expense = {
            title : 'Расходы',
            linkToCreate : '#/expense/create',
            linkToEdit : '#/expense/edit?'
        }

        this.init(type);
    }

    init(type) {
        this.titleElement.innerText = this[type].title;
        this.fillCategoryes(type)
        this.addCreateButton(type);
    }

    async fillCategoryes (type) {
        const categoryes = await CustomHttp.request(Config.host + 'categories/' + type);

        categoryes.forEach(category => {
            new Card(category, this[type], this.cardsElement, type);
        });
    }

    addCreateButton (type) {
        const btnElement = document.createElement('a')
        btnElement.className = 'add-card';
        btnElement.innerText = '+'
        btnElement.setAttribute('href', this[type].linkToCreate);

        this.cardsElement.appendChild(btnElement)
    }
}



class Card {
    constructor (data, props, motherElement, type) {
        this.type = type;
        this.name = data.title;
        this.id = data.id
        this.props = props;
        this.motherElement = motherElement;

        this.popupElement = document.getElementById('popup');
        this.btnYesElement = document.getElementById('btnYes');
        this.btnNoElement = document.getElementById('btnNo');

        this.cardElement = this.createElement();
        this.motherElement.appendChild(this.cardElement);
    }

    createElement () {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';

        const titleElement = document.createElement('h2');
        titleElement.className = 'title';
        titleElement.innerText = this.name;

        const actionsElement = document.createElement('div');
        actionsElement.className = 'card__actions';

        const editBtnElement = document.createElement('a');
        editBtnElement.className = 'btn blue';
        editBtnElement.innerText = 'Редактировать';
        editBtnElement.setAttribute('href', this.props.linkToEdit + this.id);

        const deleteBtnElement = document.createElement('button');
        deleteBtnElement.className = 'btn red';
        deleteBtnElement.innerText = 'Удалить';
        deleteBtnElement.addEventListener('click', this.deleteBtnProcess.bind(this));

        actionsElement.appendChild(editBtnElement);
        actionsElement.appendChild(deleteBtnElement);

        cardElement.appendChild(titleElement);
        cardElement.appendChild(actionsElement);

        return cardElement
    }

    deleteBtnProcess () {
        this.popupElement.style.display = 'flex';

        this.btnYesElement.onclick = () => {
            CustomHttp.request(Config.host + 'categories/' + this.type + '/' + this.id, 'DELETE');
            this.popupElement.style.display = 'none';
            this.motherElement.removeChild(this.cardElement);
        }

        this.btnNoElement.onclick = () => {
            this.popupElement.style.display = 'none';
        }

    }
}