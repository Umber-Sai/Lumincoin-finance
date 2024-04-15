import { Config } from "../config";
import { Auth } from "../services/auth.js";
import { CustomHttp } from "../services/custom-http.js";

export class Form {
    constructor(type) {
        this.type = type;
        this.titleElement = document.getElementById('title');
        this.formLinkElement = document.getElementById('form-link');
        this.formElement = document.getElementById('form');
        this.btnElement = document.getElementById('submitBtn');

        this.checkbox = document.createElement('input');
        this.checkbox.setAttribute('type', 'checkbox');
            
        this.inputElements = [];


        this.inputs = [
            {
                name : 'fullName',
                icon : 'static/img/authentication/person.svg',
                placeholder : 'ФИО',
                type : 'text',
                regex : /[А-я][а-я]*\s[А-я][а-я]*/
            },
            {
                name : 'email',
                icon : 'static/img/authentication/mail.svg',
                placeholder : 'Электронная почта',
                type : 'text',
                regex : /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
            },
            {
                name : 'password',
                icon : 'static/img/authentication/lock.svg',
                placeholder : 'Пароль',
                type : 'text',
                regex: /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
            },
            {
                name : 'passwordRepeat',
                icon : 'static/img/authentication/lock.svg',
                placeholder : 'Подтверждение пароля',
                type : 'password',
                regex : null,
            }
        ]

        if(type === 'login') {
            this.inputs.splice(3, 1);
            this.inputs.splice(0, 1);
        }

        this.login = {
            title: 'Вход',
            formLink: 'Ещё нет аккаунта? <a href="#/signup">Пройдите регистрацию</a>',
        }

        this.signup = {
            title: 'Создайте аккаунт',
            formLink: 'Уже есть аккаунт? <a href="#/login">Войдите в систему</a>',
        }

        this.fillPage(type)

        this.btnElement.addEventListener('click', () => {
            this.processForm();  
        })
    }

    async processForm () {
        if (this.type === 'signup') {
            let formValid = true;
            this.inputs.forEach(input => {
                input.element.validationCheck() ? {} : formValid = false;
            })
            if (!formValid) return 
            try {
                const name = this.inputs.find(item => item.name === 'fullName').element.inputElement.value.split(' ');
                const response = await CustomHttp.request(Config.host + 'signup', "Post", {
                    "name": name[1],
                    "lastName": name[0],
                    "email": this.inputs.find(item => item.name === 'email').element.inputElement.value,
                    "password": this.inputs.find(item => item.name === 'password').element.inputElement.value,
                    "passwordRepeat": this.inputs.find(item => item.name === 'passwordRepeat').element.inputElement.value
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

        const response = await CustomHttp.request(Config.host + 'login', 'Post', {
            "email": this.inputs.find(item => item.name === 'email').element.inputElement.value,
            "password": this.inputs.find(item => item.name === 'password').element.inputElement.value,
            "rememberMe": this.checkbox.checked
        });
        if(response.error) {
            console.log(response);
            alert('Неверный логин или пароль')
            return;
        }

        Auth.setUserInfo(response.user)
        Auth.setTokens(response.tokens)


        location.href = '#/main';
    }

    fillPage (type) {
        this.titleElement.innerText = this[type].title;
        this.formLinkElement.innerHTML = this[type].formLink;
        this.inputs.forEach(input => {
            const element = new Input(input);

            if(input.name === 'fullName') {
                element.inputElement.addEventListener('input', (event) => {
                    let x = event.target.value.replace(/[^\wа-яё\s]|\d|\w/i, '');

                    const letter = x.match(/(?:^[а-я])|(?:\s[а-я])/g);
                    if (letter) {
                        x = x.replace(/\W$/, letter[0].replace(/\s/g, '').toUpperCase());
                    }
                    event.target.value = x;
                })
            }

            if(type === 'signup' && input.name === 'password') {
                element.inputElement.addEventListener('blur', (event) => {
                    this.inputs.find(item => item.name === 'passwordRepeat').element.regex = event.target.value;
                });
            }

            this.formElement.appendChild(element.errorElement);
            this.formElement.appendChild(element.element);

            input.element = element;
        });

        

        if(type === 'login') {
            const checkboxElement = document.createElement('div');
            checkboxElement.className = 'checkbox';

            this.checkbox.setAttribute('id', 'rememberMe');

            const label = document.createElement('label');
            label.setAttribute('for', 'rememberMe');
            label.innerText = 'Запомнить меня';

            checkboxElement.appendChild(this.checkbox);
            checkboxElement.appendChild(label);

            this.formElement.appendChild(checkboxElement);
        }
    }
}


class Input  {
    constructor (input) {

        this.name = input.name;
        this.icon = input.icon;
        this.placeholder = input.placeholder;
        this.type = input.type;
        this.regex = input.regex;

        this.errorElement = null;
        this.inputElement = null;
        this.element = null;

        this.createElement();

        this.inputElement.addEventListener('blur', () => {
            this.errorElement.innerText = ''
            this.element.classList.remove('noValid');
        })

    }

    createElement () {
        const errorElement = document.createElement('div');
        errorElement.className = 'input-error';

        const formInput = document.createElement('label');
        formInput.className = 'form-input'
        
        const iconElement = document.createElement('div');
        iconElement.className = 'icon';
        
        const imgElement = document.createElement('img');
        imgElement.setAttribute('src', this.icon);
        imgElement.setAttribute('alt', 'icon');
        
        iconElement.appendChild(imgElement);
        
        const inputElement = document.createElement('input');
        inputElement.setAttribute('type', this.type)
        inputElement.setAttribute('placeholder', this.placeholder);
        
        
        formInput.appendChild(iconElement)
        formInput.appendChild(inputElement)
        
        this.errorElement = errorElement;
        this.inputElement = inputElement;
        this.element = formInput;
    }

    validationCheck () {
        const value = this.inputElement.value;
        if(!value) {
            this.errorElement.innerText = 'Заполните поле';
            this.element.classList.add('noValid');
            return false;
        }

        if(value.match(this.regex)) {
            return true;
        } else {  
            const messageFor = {
                'passwordRepeat' : 'Пароли не совпадают',
                'fullName' : 'Введите Фамилию и Имя'
            }
            this.errorElement.innerText = messageFor[this.name] ? messageFor[this.name] : 'Поле заполнено некорректно';;
            this.element.classList.add('noValid');
            return false;
        }
    }
}