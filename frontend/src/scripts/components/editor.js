import { Config } from "../config";
import { CustomHttp } from "../services/custom-http";

class Common {
    constructor (type) {
        this.type = type;
        this.titleElement = document.getElementById('title')
        this.greenBtnElement = document.getElementById('greenBtn');
        this.redBtnElement = document.getElementById('redBtn');
        this.formElement = document.getElementById('form');
        this.selectElements = [];
        this.inputElements = [];

        this.inputs = {
            income : [{p : 'Название...', id : 'title', type : 'text'}],
            expense : [{p : 'Название...', id : 'title', type : 'text'}],
            transactions : [
                {p : 'Сумма в $...', id : 'amount', type : 'number'},
                {p : 'Дата...', id : 'date', type : 'date'},
                {p : 'Комментарий...', id : 'comment', type : 'text'},
            ],
        }

        this.api = {
            income : 'categories/income/',
            expense : 'categories/expense/',
            transactions : 'operations/'
        }

        this.createInputs();

    }

    createInputs () {
        this.inputs[this.type].forEach(input => {
            const sample = new Input(input.p, input.type, input.id);
            this.inputElements.push(sample)
        })
    }

    async createSelects(selectedType, selectedCategory = null) {
        const typeOptions = [
            { id: 'expense', title: 'расход' },
            { id: 'income', title: 'доход' }
        ]
        const selectElement = new Select(typeOptions, selectedType, 'type');
        selectElement.element.addEventListener('change', () => {
            console.log(selectElement.element.value)
            this.changeCategoryOptions(selectElement.element.value)
        })
        this.selectElements.push(selectElement);

        await this.createCategorySelect(selectedType, selectedCategory)
    }

    async changeCategoryOptions(selectedType) {
        const options = await this.getCategoryes(selectedType);
        this.selectElements[1].fillOptions(options)
    }

    async createCategorySelect (selectedType, selectedCategory = null) {
        console.log(selectedType)
        const options = await this.getCategoryes(selectedType);
        const selectElement = new Select(options, selectedCategory, 'category_id');
        this.selectElements.push(selectElement);
    }

    async getCategoryes(type) {
        try {
            const categoryes = await CustomHttp.request(Config.host + 'categories/' + type);
            if(categoryes) return categoryes;
            throw new Error(categoryes.error)
        } catch (error) {
            console.error(error)
        }
    }

    fillForm () {
        this.selectElements.forEach(sample => {
            this.formElement.appendChild(sample.element);
        })
        this.inputElements.forEach(sample => {
            this.formElement.appendChild(sample.element);
        })
    }

    collectBody() {
        let body = {}
        this.inputElements.forEach(sample => {
            body[sample.id] = sample.element.value
        })
        this.selectElements.forEach(sample => {
            if(sample.id === 'category_id') {
                body[sample.id] = parseInt(sample.element.value);
            } else {
                body[sample.id] = sample.element.value
            }
        });
        return body;
    }
}


class Select {
    constructor (options, selected = null, id) {
        this.id = id
        this.element = document.createElement('select');
        this.fillOptions(options, selected)
    }

    fillOptions(options, selected = null) {
        this.element.innerHTML = ''
        options.forEach(option => {
            const selectOption = document.createElement('option');
            selectOption.setAttribute('value', option.id);
            selectOption.innerText = option.title;

            if (option.id === selected || option.title === selected) selectOption.selected = 'selected';

            this.element.appendChild(selectOption);
        });
    }
}

class Input {
    constructor (placeholder, type, id) {
        this.id = id;
        this.element = document.createElement('input');
        this.element.setAttribute('type', type);
        this.element.setAttribute('placeholder', placeholder);

        this.element.addEventListener('focus', () => {
            this.element.classList.remove('noValid')
        })
    }

    valid () {
        // if(this.id === 'comment') return true;
        if(this.element.value) {
            return true;
        }
        this.element.classList.add('noValid')
        return false;
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

        if(type === 'transactions') {
            this.fillAsTransactions();
        } else {
            this.fillForm();
        }

        this.greenBtnElement.addEventListener('click', () => {
            let valid = true
            this.inputElements.forEach(input => {
                if(!input.valid()) valid = false;
            });

            if(!valid) return;
            const body = this.collectBody();

            CustomHttp.request(Config.host + this.api[type], 'POST', body);
            window.history.back();
        })
    }

    async fillAsTransactions () {
        const selectedType = window.location.hash.split('?')[1];
        await this.createSelects(selectedType);
        this.fillForm()
    }
}

export class Edit extends Common {
    constructor (type) {
        super (type);
        
        this.title = {
            income : 'Редактирование категории доходов',
            expense : 'Редактирование категории расходов',
            transactions : 'Редактирование дохода/расхода'
        }
        
        this.titleElement.innerText = this.title[type];
        this.greenBtnElement.innerText = 'Сохранить';
        
        this.id = decodeURIComponent(window.location.href).split('?')[1];

        this.getItemValues()

        this.greenBtnElement.addEventListener('click', () => {
            let valid = true
            this.inputElements.forEach(input => {
                if(!input.valid()) valid = false
            });

            if(!valid) return
            const body = this.collectBody();
            console.log(body)

            CustomHttp.request(Config.host + this.api[type] + this.id, 'PUT', body);
            window.history.back();
        })
    }

    async getItemValues () {
        let response = null;
        try {
            const result = await CustomHttp.request(Config.host + this.api[this.type] + this.id);
            if(!result) throw new Error(result.error);
            response = result
        } catch (error) {
            console.error(error)
            window.history.back();
        }
        if(response.type) await this.createSelects(response.type, response.category);
        this.fillForm();
        this.insertValues(response);
    }

    insertValues(values) {
        this.inputElements.forEach(item => {
            const val = values[item.id]
            if (val) {
                item.element.value = val;
            } else {}
        })
    }
}