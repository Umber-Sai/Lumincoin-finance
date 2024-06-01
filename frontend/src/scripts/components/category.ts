
import { Config } from "../config";
import { CustomHttp } from "../services/custom-http";
import { CardInfo, CategoryResponseType, CategorySettings, CategoryType } from "../types/category.type";
import { DefaultResponseType } from "../types/default-response.type";



export class Category {

    readonly titleElement: HTMLElement | null = document.getElementById('title');
    readonly cardsElement: HTMLElement | null = document.getElementById('cards');
    readonly type: CategoryType;

    readonly income: CategorySettings = {
        title: 'Доходы',
        linkToCreate: '#/income/create',
        linkToEdit: '#/income/edit?'
    }

    readonly expense: CategorySettings = {
        title : 'Расходы',
        linkToCreate : '#/expense/create',
        linkToEdit : '#/expense/edit?'
    }

    constructor (type: CategoryType) {
        this.type = type;


        this.init();
    }

    private init(): void {
        if(this.titleElement) {
            this.titleElement.innerText = this[this.type].title;
        }

        if(!this.cardsElement) throw new Error('Cards element not found');

        this.fillCategoryes()
        this.addCreateButton();
    }

    private async fillCategoryes (): Promise<void> {
        const categoryes: DefaultResponseType | CategoryResponseType = await CustomHttp.request(Config.host + 'categories/' + this.type);

        (categoryes as CategoryResponseType).forEach((category: CardInfo) => {
            new Card(category, this[this.type].linkToEdit, this.cardsElement!, this.type);
        });
    }

    private addCreateButton (): void {
        const btnElement = document.createElement('a')
        btnElement.className = 'add-card';
        btnElement.innerText = '+'
        btnElement.setAttribute('href', this[this.type].linkToCreate);

        this.cardsElement!.appendChild(btnElement)
    }
}



class Card {

    readonly type: CategoryType;
    readonly name: string;
    readonly id: number;
    readonly link: string;
    readonly motherElement: HTMLElement;

    readonly popupElement: HTMLElement | null = document.getElementById('popup');
    readonly btnYesElement: HTMLElement | null = document.getElementById('btnYes');
    readonly btnNoElement: HTMLElement | null =  document.getElementById('btnNo');

    private cardElement: HTMLElement = this.createElement();

    constructor (data: CardInfo, link: string, motherElement: HTMLElement, type: CategoryType) {
        this.type = type;
        this.name = data.title;
        this.id = data.id
        this.link = link;
        this.motherElement = motherElement;

        this.motherElement.appendChild(this.cardElement);
    }

    createElement () {
        const cardElement: HTMLElement = document.createElement('div');
        cardElement.className = 'card';

        const titleElement: HTMLElement = document.createElement('h2');
        titleElement.className = 'title';
        titleElement.innerText = this.name;

        const actionsElement: HTMLElement = document.createElement('div');
        actionsElement.className = 'card__actions';

        const editBtnElement: HTMLElement = document.createElement('a');
        editBtnElement.className = 'btn blue';
        editBtnElement.innerText = 'Редактировать';
        editBtnElement.setAttribute('href', this.link + this.id);

        const deleteBtnElement: HTMLButtonElement = document.createElement('button');
        deleteBtnElement.className = 'btn red';
        deleteBtnElement.innerText = 'Удалить';
        deleteBtnElement.addEventListener('click', this.deleteBtnProcess.bind(this));

        actionsElement.appendChild(editBtnElement);
        actionsElement.appendChild(deleteBtnElement);

        cardElement.appendChild(titleElement);
        cardElement.appendChild(actionsElement);

        return cardElement
    }

    private deleteBtnProcess (): void {
        if(this.popupElement) {
            this.popupElement.style.display = 'flex';

            if(this.btnYesElement) {
                this.btnYesElement.onclick = () => {
                    CustomHttp.request(Config.host + 'categories/' + this.type + '/' + this.id, 'DELETE');
                    this.popupElement!.style.display = 'none';
                    this.motherElement.removeChild(this.cardElement);
                }
            } else throw new Error('Confirm button not found');
    
            if(this.btnNoElement) {
                this.btnNoElement.onclick = () => {
                    this.popupElement!.style.display = 'none';
                }
            } else throw new Error('Decline button not found');


        } else throw new Error('Popup not found')
    }
}