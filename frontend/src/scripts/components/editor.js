class Common {
    constructor (type) {
        this.titleElement = document.getElementById('title')
        this.greenBtnElement = document.getElementById('greenBtn');
        this.redBtnElement = document.getElementById('redBtn');
        this.formElement = document.getElementById('form');
        this.inputElements = {};

        this.inputs = {
            income : [{p : 'Название...', id : 'name'}],
            expenses : [{p : 'Название...', id : 'name'}],
            transactions : [
                {p : 'Тип...', id : 'type'},
                {p : 'Категория...', id : 'category'},
                {p : 'Сумма в $...', id : 'sum'},
                {p : 'Дата...', id : 'date'},
                {p : 'Комментарий...', id : 'comment'},
            ]
        }

        this.createInputs(this.inputs[type]);
    }

    createInputs (inputs) {

        inputs.forEach( input => {
            const inputElement = document.createElement('input');
            inputElement.setAttribute('type', 'text');
            inputElement.setAttribute('placeholder', input.p);

            this.inputElements[input.id] = inputElement
            this.formElement.appendChild(inputElement);
            
        });
    }
}

export class Create extends Common {
    constructor (type) {
        super (type);

        this.title = {
            income : 'Создание категории доходов',
            expenses : 'Создание категории расходов',
            transactions : 'Создание дохода/расхода'
        }


        this.titleElement.innerText = this.title[type];
        this.greenBtnElement.innerText = 'Создать';
    }
}

export class Edit extends Common {
    constructor (type) {
        super (type);
        const url = window.location.href;
        this.name = decodeURIComponent(url).split('?')[1];

        this.income = {
            title : 'Редактирование категории доходов'
        }

        this.expenses = {
            title : 'Редактирование категории расходов'
        }

        this.titleElement.innerText = this[type].title;
        this.greenBtnElement.innerText = 'Сохранить';
        this.inputElements.name.value = this.name;
        
    }
}