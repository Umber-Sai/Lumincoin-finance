import { Config } from "../config";
import { CustomHttp } from "../services/custom-http";
import { DefaultResponseType } from "../types/default-response.type";
import { ERT, EditResponseType, EditorInputPropsType, EditorInputsType, EditorSelectOptionsType, EditorSelectType, EditorTypeSettings, EditorTypes } from "../types/editor.type";
import { Input } from "./editor-components/input";
import { Select } from "./editor-components/select";

class Common {

    readonly type : EditorTypes;
    readonly titleElement : HTMLElement | null = document.getElementById('title');
    readonly greenBtnElement : HTMLElement | null =  document.getElementById('greenBtn');
    readonly redBtnElement : HTMLElement | null = document.getElementById('redBtn');
    readonly formElement : HTMLElement | null = document.getElementById('form');
    private selectElements: Array<Select> = [];
    public inputElements: Array<Input> = [];

    private inputs: EditorInputsType = {
        income : [{p : 'Название...', id : ERT.title, type : 'text'}],
        expense : [{p : 'Название...', id : ERT.title, type : 'text'}],
        transactions : [
            {p : 'Сумма в $...', id : ERT.amount, type : 'number'},
            {p : 'Дата...', id : ERT.date, type : 'date'},
            {p : 'Комментарий...', id : ERT.comment, type : 'text'},
        ],
    }

    public api: EditorTypeSettings = {
        income : 'categories/income/',
        expense : 'categories/expense/',
        transactions : 'operations/'
    }


    constructor (type: EditorTypes) {
        this.type = type;

        this.createInputs();

    }

    private createInputs (): void {
        this.inputs[this.type].forEach((input : EditorInputPropsType) => {
            const sample: Input = new Input(input.p, input.type, input.id);
            this.inputElements.push(sample)
        })
    }

    public async createSelects(selectedType: string, selectedCategory: string | null = null): Promise<void> {
        const typeOptions: Array<EditorSelectOptionsType> = [
            { id: 'expense', title: 'расход' },
            { id: 'income', title: 'доход' }
        ]
        const selectElement: Select = new Select(typeOptions, selectedType, EditorSelectType.type);
        selectElement.element.addEventListener('change', () => {
            this.changeCategoryOptions(selectElement.element.value)
        })
        this.selectElements.push(selectElement);

        await this.createCategorySelect(selectedType, selectedCategory)
    }

    private async changeCategoryOptions(selectedType: string): Promise<void> {
        const options: Array<EditorSelectOptionsType> | undefined= await this.getCategoryes(selectedType);
        if(!options) throw new Error ('Category options undefined');
        this.selectElements[1].fillOptions(options);
    }

    private async createCategorySelect (selectedType: string, selectedCategory: string | null = null): Promise<void> {
        const options: EditorSelectOptionsType[] | undefined = await this.getCategoryes(selectedType);
        if(!options) throw new Error ('Category options undefined');
        const selectElement: Select = new Select(options, selectedCategory, EditorSelectType.category_id);
        this.selectElements.push(selectElement);
    }

    private async getCategoryes(type: string): Promise<EditorSelectOptionsType[] | undefined>{
        const categoryes: DefaultResponseType | EditorSelectOptionsType[] = await CustomHttp.request(Config.host + 'categories/' + type);

        if(categoryes as DefaultResponseType) return;
        return categoryes as EditorSelectOptionsType[];
    }

    public fillForm ():void {
        this.selectElements.forEach(sample => {
            this.formElement?.appendChild(sample.element);
        })
        this.inputElements.forEach(sample => {
            this.formElement?.appendChild(sample.element);
        })
    }


    public collectBody() {
        let body: {[key: string] : string | number} = {}
        this.inputElements.forEach((sample: Input) => {
            const val:string = sample.element.value;
            body[sample.id] = Number(val)? parseInt(val) : val;
        })
        this.selectElements.forEach((sample: Select) => {
            const val: string = sample.element.value;
            body[sample.id] = Number(val)? parseInt(val) : val;
        });
        return body;
    }
}








export class Create extends Common {

    private title: EditorTypeSettings = {
        income : 'Создание категории доходов',
        expense : 'Создание категории расходов',
        transactions : 'Создание дохода/расхода'
    }

    constructor (type: EditorTypes) {
        super (type);

        if(type === EditorTypes.transactions) {
            this.fillAsTransactions();
        } else {
            this.fillForm();
        }

        if(this.titleElement) {
            this.titleElement.innerText = this.title[type];
        }

        if(this.greenBtnElement) {
            this.greenBtnElement.innerText = 'Создать';

            this.greenBtnElement.addEventListener('click', () => {
                let valid: boolean = true
                this.inputElements.forEach(input => {
                    if(!input.valid()) valid = false;
                });
    
                if(!valid) return;
                const body = this.collectBody();
    
                CustomHttp.request(Config.host + this.api[type], 'POST', body);
                window.history.back();
            })
        } else {
            throw new Error('Confirm button not found')
        }        
    }

    private async fillAsTransactions (): Promise<void> {
        const selectedType: string = window.location.hash.split('?')[1];
        await this.createSelects(selectedType);
        this.fillForm()
    }
}



export class Edit extends Common {

    private id: string = decodeURIComponent(window.location.href).split('?')[1];


    private title: EditorTypeSettings = {
        income : 'Редактирование категории доходов',
        expense : 'Редактирование категории расходов',
        transactions : 'Редактирование дохода/расхода'
    }

    constructor (type: EditorTypes) {
        super (type);
        
        if(this.titleElement) {
            this.titleElement.innerText = this.title[type];
        }

        if(this.greenBtnElement) {
            this.greenBtnElement.innerText = 'Сохранить';
            this.greenBtnElement.addEventListener('click', () => {
                let valid: boolean = true
                this.inputElements.forEach(input => {
                    if(!input.valid()) valid = false
                });
    
                if(!valid) return
                const body: {[key: string]: string | number} = this.collectBody();
    
                CustomHttp.request(Config.host + this.api[type] + this.id, 'PUT', body);
                window.history.back();
            });
        } else {
            throw new Error('Confirm button not found');
        }
        this.getItemValues()
    }

    private async getItemValues (): Promise<void> {
        try {
            const result: DefaultResponseType | EditResponseType = await CustomHttp.request(Config.host + this.api[this.type] + this.id);
            if((result as DefaultResponseType).error) throw new Error((result as DefaultResponseType).message);
            if(result as EditResponseType) {
                this.fillForm();
                this.insertValues(result as EditResponseType);
            }

            if((result as EditResponseType).type) await this.createSelects((result as EditResponseType).type!, (result as EditResponseType).category);

        } catch (error) {
            console.error(error)
            window.history.back();
        }
        
    }

    private insertValues(values: EditResponseType): void {
        this.inputElements.forEach((item: Input) => {
            const val: string | number | undefined = values[item.id]
            if (val) {
                item.element.value = val.toString();
            } else {}
        })
    }
}