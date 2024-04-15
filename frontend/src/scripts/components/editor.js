import { Config } from "../config";
import { CustomHttp } from "../services/custom-http";

class Common {
    constructor (type) {
        this.titleElement = document.getElementById('title')
        this.greenBtnElement = document.getElementById('greenBtn');
        this.redBtnElement = document.getElementById('redBtn');
        this.formElement = document.getElementById('form');
        this.inputElements = [];

        this.inputs = {
            income : [{p : 'Название...', id : 'title'}],
            expense : [{p : 'Название...', id : 'title'}],
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

            this.inputElements.push({
                name : input.id,
                element : inputElement
            });
            this.formElement.appendChild(inputElement);
        });
    }
}

export class Create extends Common {
    constructor (type) {
        super (type);

        this.title = {
            income : 'Создание категории доходов',
            expense : 'Создание категории расходов',
            transactions : 'Создание дохода/расхода'
        }


        this.titleElement.innerText = this.title[type];
        this.greenBtnElement.innerText = 'Создать';

        this.greenBtnElement.addEventListener('click', () => {
            let validation = true
            let body = {};
            this.inputElements.forEach(input => {
                const val = input.element.value;
                if(val) {
                    body[input.name] = val;
                    return
                }
                validation = false;
            });

            if(validation) {
                try {
                    const response = CustomHttp.request(Config.host + 'categories/' + type, 'POST', body);
                    if (response.error) {
                        throw new Error(response.message)
                    }
                } catch (error) {
                    console.log(error)
                }
                window.history.back();
            }
        })
    }
}

export class Edit extends Common {
    constructor (type) {
        super (type);
        this.params = {}
        const paramsArray = decodeURIComponent(window.location.href).split('?')[1].split('&');
        paramsArray.forEach(item => {
            const split = item.split('=');
            this.params[split[0]] = split[1];
        });


        this.income = {
            title : 'Редактирование категории доходов'
        }

        this.expense = {
            title : 'Редактирование категории расходов'
        }

        this.titleElement.innerText = this[type].title;
        this.greenBtnElement.innerText = 'Сохранить';
        this.inputElements.forEach(item => {
            const val = this.params[item.name]
            if (val) {
                item.element.value = val;
            } else {}
        })

        this.greenBtnElement.addEventListener('click', () => {
            let body = {}
            this.inputElements.forEach(item => {
                body[item.name] = item.element.value
            });
            CustomHttp.request(Config.host + 'categories/' + type + '/' + this.params.id, 'PUT', body);
            window.history.back();
        })
    }
}