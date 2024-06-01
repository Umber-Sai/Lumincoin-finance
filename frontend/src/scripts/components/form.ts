import { Config } from "../config";
import { Auth } from "../services/auth";
import { CustomHttp } from "../services/custom-http";
import { AuthType } from "../types/auth.type";
import { DefaultResponseType } from "../types/default-response.type";
import { FormTypeSettings, FormTypes } from "../types/form.type";
import { FormInputNames, FormInputType } from "../types/from-input.type";



export class Form {

    readonly type: FormTypes;
    readonly titleElement: HTMLElement | null = document.getElementById('title');
    readonly formLinkElement: HTMLElement | null = document.getElementById('form-link');
    readonly formElement: HTMLElement | null = document.getElementById('form');
    readonly btnElement: HTMLElement | null = document.getElementById('submitBtn');
    readonly checkbox: HTMLInputElement = document.createElement('input');
    private inputs: Array<FormInputType>;

    readonly login: FormTypeSettings = {
        title: 'Вход',
        formLink: 'Ещё нет аккаунта? <a href="#/signup">Пройдите регистрацию</a>',
    }

    readonly signup: FormTypeSettings = {
        title: 'Создайте аккаунт',
        formLink: 'Уже есть аккаунт? <a href="#/login">Войдите в систему</a>',
    }

    constructor(type: FormTypes) {
        this.type = type;
        this.checkbox.setAttribute('type', 'checkbox');

        this.inputs = [
            {
                name : FormInputNames.fullName,
                icon : 'static/img/authentication/person.svg',
                placeholder : 'ФИО',
                type : 'text',
                regex : /[А-я][а-я]*\s[А-я][а-я]*/
            },
            {
                name : FormInputNames.email,
                icon : 'static/img/authentication/mail.svg',
                placeholder : 'Электронная почта',
                type : 'text',
                regex : /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
            },
            {
                name : FormInputNames.password,
                icon : 'static/img/authentication/lock.svg',
                placeholder : 'Пароль',
                type : 'password',
                regex: /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
            },
            {
                name : FormInputNames.passwordRepeat,
                icon : 'static/img/authentication/lock.svg',
                placeholder : 'Подтверждение пароля',
                type : 'password',
                regex : null,
            }
        ]

        if(type === FormTypes.login) {
            this.inputs.splice(3, 1);
            this.inputs.splice(0, 1);
        }

        this.fillPage()

        if(!this.btnElement) throw new Error ('Button not found')
        this.btnElement.addEventListener('click', () => {
            this.processForm();  
        })
    }

    async processForm () {
        if (this.type === 'signup') {
            let formValid: boolean = true;
            this.inputs.forEach((input: FormInputType) => {
                input.element!.validationCheck() ? {} : formValid = false;
            })
            if (!formValid) return 
            try {
                const name = this.inputs.find((item: FormInputType) => item.name === FormInputNames.fullName)!.element!.inputElement.value.split(' ');
                const response = await CustomHttp.request(Config.host + 'signup', "Post", {
                    "name": name[1],
                    "lastName": name[0],
                    "email": this.inputs.find(item => item.name === FormInputNames.email)!.element!.inputElement.value,
                    "password": this.inputs.find(item => item.name === FormInputNames.password)!.element!.inputElement.value,
                    "passwordRepeat": this.inputs.find(item => item.name === FormInputNames.passwordRepeat)!.element!.inputElement.value
                });
                if (response.error) {
                    throw new Error(response.message)
                }
            } catch (error) {
                return console.log(error);
            }
            
            const result = confirm('Хотите оставаться в системе?');
            if(result){
                this.checkbox.checked = true;
            } else {
                this.checkbox.checked = false;
            }
        }

        let formValid: boolean = true;
        this.inputs.forEach((input: FormInputType) => {
            input.element!.validationCheck() ? {} : formValid = false;
        })
        if (!formValid) return 

        try {
            const response: DefaultResponseType | AuthType = await CustomHttp.request(Config.host + 'login', 'Post', {
                "email": this.inputs.find(item => item.name === FormInputNames.email)!.element!.inputElement.value,
                "password": this.inputs.find(item => item.name === FormInputNames.password)!.element!.inputElement.value,
                "rememberMe": this.checkbox.checked
            });
            
            if((response as DefaultResponseType).error) {
                alert('Неверный логин или пароль')
                throw new Error((response as DefaultResponseType).message)
            }
            Auth.setUserInfo((response as AuthType).user)
            Auth.setTokens((response as AuthType).tokens)
    
            location.href = '#/main';
            
        } catch (error) {
            console.error(error);
            return
        }

    }

    private fillPage (): void {
        if(!this.titleElement || !this.formLinkElement) throw new Error ('Title or link element not found')
        this.titleElement.innerText = this[this.type].title;
        this.formLinkElement.innerHTML = this[this.type].formLink;
        this.inputs.forEach((input: FormInputType) => {
            const element: Input = new Input(input);

            if(input.name === 'fullName') {
                element.inputElement.addEventListener('input', (event) => {
                    let x: string = (event.target as HTMLInputElement).value.replace(/[^\wа-яё\s]|\d|\w/i, '');

                    const letter: RegExpMatchArray | null = x.match(/(?:^[а-я])|(?:\s[а-я])/g);
                    if (letter) {
                        x = x.replace(/\W$/, letter[0].replace(/\s/g, '').toUpperCase());
                    }
                    (event.target as HTMLInputElement).value = x;
                })
            }

            if(input.name === FormInputNames.password) {
                const passwordRepeat: FormInputType | undefined = this.inputs.find(item => item.name === FormInputNames.passwordRepeat);
                element.inputElement.addEventListener('blur', (event) => {
                    if(passwordRepeat?.element) {
                        passwordRepeat.element.regex = (event.target as HTMLInputElement).value;
                    }
                });
            }

            this.formElement?.appendChild(element.errorElement);
            this.formElement?.appendChild(element.element);

            input.element = element;
        });

        

        if(this.type === FormTypes.login) {
            const checkboxElement: HTMLElement = document.createElement('div');
            checkboxElement.className = 'checkbox';

            this.checkbox.setAttribute('id', 'rememberMe');

            const label: HTMLLabelElement = document.createElement('label');
            label.setAttribute('for', 'rememberMe');
            label.innerText = 'Запомнить меня';

            checkboxElement.appendChild(this.checkbox);
            checkboxElement.appendChild(label);

            this.formElement?.appendChild(checkboxElement);
        }
    }
}


export class Input  {

    readonly name: FormInputNames;
    readonly icon: string;
    readonly placeholder: string;
    readonly type: string;
    public regex: RegExp | null | string;

    public errorElement: HTMLElement;
    public inputElement: HTMLInputElement;
    public element: HTMLElement;

    constructor (input: FormInputType) {

        this.name = input.name;
        this.icon = input.icon;
        this.placeholder = input.placeholder;
        this.type = input.type;
        this.regex = input.regex;

        [
            this.element,
            this.errorElement,
            this.inputElement
        ] = this.createElement();

        this.inputElement.addEventListener('blur', () => {
            this.errorElement!.innerText = ''
            this.element!.classList.remove('noValid');
        })
    }

    private createElement (): [element: HTMLLabelElement, errorElement: HTMLElement, inputElement: HTMLInputElement] {
        const errorElement: HTMLElement = document.createElement('div');
        errorElement.className = 'input-error';

        const formInput: HTMLLabelElement = document.createElement('label');
        formInput.className = 'form-input'
        
        const iconElement: HTMLElement = document.createElement('div');
        iconElement.className = 'icon';
        
        const imgElement: HTMLImageElement = document.createElement('img');
        imgElement.setAttribute('src', this.icon);
        imgElement.setAttribute('alt', 'icon');
        
        iconElement.appendChild(imgElement);
        
        const inputElement: HTMLInputElement = document.createElement('input');
        inputElement.setAttribute('type', this.type)
        inputElement.setAttribute('placeholder', this.placeholder);
        
        
        formInput.appendChild(iconElement)
        formInput.appendChild(inputElement)

        return [formInput, errorElement, inputElement];
    }

    public validationCheck (): boolean {
        const value: string = this.inputElement.value;
        if(!value) {
            this.errorElement.innerText = 'Заполните поле';
            this.element.classList.add('noValid');
            return false;
        }

        if(this.regex === null) return false;

        if(value.match(this.regex)) {
            return true;
        } else {  
            const messageFor: {[key: string]: string} = {
                [FormInputNames.passwordRepeat] : 'Пароли не совпадают',
                [FormInputNames.fullName] : 'Введите Фамилию и Имя'
            }
            this.errorElement.innerText = messageFor[this.name] ? messageFor[this.name] : 'Поле заполнено некорректно';;
            this.element.classList.add('noValid');
            return false;
        }
    }
}