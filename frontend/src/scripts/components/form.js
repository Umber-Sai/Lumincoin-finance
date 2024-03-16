
export class Form {
    constructor(type) {
        this.titleElement = document.getElementById('title');
        this.formLinkElement = document.getElementById('form-link');
        this.formElement = document.getElementById('form');
        this.btnElement = document.getElementById('submitBtn');
        this.passwordElement = null;
        this.repPasswordElement = null;


        this.inputs = [
            {
                name : 'email',
                icon : 'static/img/authentication/mail.svg',
                placeholder : 'Электронная почта',
                type : 'text',
                regex: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                valid: false
            },
            {
                name : 'password',
                icon : 'static/img/authentication/lock.svg',
                placeholder : 'Пароль',
                type : 'password',
                regex: /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
                valid: false
            }
        ]

        if(type === 'login') {
            this.inputs.unshift({
                name : 'fullName',
                icon : 'static/img/authentication/person.svg',
                placeholder : 'ФИО',
                type : 'text',
                regex : /[A-Z]{1}[a-z]+\s[A-Z]{1}[a-z]+/,
                valid: false
            })
            this.inputs.push({
                name : 'repeatPassword',
                icon : 'static/img/authentication/lock.svg',
                placeholder : 'Подтверждение пароля',
                type : 'password',
                regex : null,
                valid: false
            });
        }

        this.signin = {
            title: 'Вход',
            formLink: 'Ещё нет аккаунта? <a href="#/login">Пройдите регистрацию</a>',
            btnProcess () {
                alert(1)
            }
        }

        this.login = {
            title: 'Создайте аккаунт',
            formLink: 'Уже есть аккаунт? <a href="#/signin">Войдите в систему</a>',
            btnProcess () {
                const repPas = this.inputs.find(item => item.name === 'repeatPassword');
                if(this.passwordElement.value === this.repPasswordElement.value) {
                    repPas.valid = true;
                }

                const validCheck = this.inputs.some(item => item.valid === false);
                if(!validCheck) {
                    location.href = '#/main'
                }
            }
        }

        this.fillPage(type)

        this.btnElement.addEventListener('click', this[type].btnProcess.bind(this))
        
    }

    fillPage (type) {
        this.titleElement.innerText = this[type].title;
        this.formLinkElement.innerHTML = this[type].formLink;
        this.inputs.forEach(input => {

            const formInput = document.createElement('label');
            formInput.className = 'form-input'

            const iconElement = document.createElement('div');
            iconElement.className = 'icon';

            const imgElement = document.createElement('img');
            imgElement.setAttribute('src', input.icon);
            imgElement.setAttribute('alt', 'icon');

            iconElement.appendChild(imgElement);

            const inputElement = document.createElement('input');
            inputElement.setAttribute('type', input.type)
            inputElement.setAttribute('placeholder', input.placeholder);

            formInput.appendChild(iconElement)
            formInput.appendChild(inputElement)
            
            if(input.name === 'password') {
                this.passwordElement = inputElement
            }

            if(input.name === 'repeatPassword') {
                this.repPasswordElement = inputElement
            }

            formInput.addEventListener("focusout", (event) => {
                if(event.target.value.match(input.regex)) {
                    input.valid = true;
                } else {
                    input.valid = false;
                }
            });

            formInput.addEventListener('input', (event) => {
                
            });

            this.formElement.appendChild(formInput);
        });

        if(type === 'signin') {
            const checkboxElement = document.createElement('div');
            checkboxElement.className = 'checkbox';

            const input = document.createElement('input');
            input.setAttribute('type', 'checkbox')
            input.setAttribute('id', 'rememberMe')

            const label = document.createElement('label');
            label.setAttribute('for', 'rememberMe');
            label.innerText = 'Запомнить меня';

            checkboxElement.appendChild(input);
            checkboxElement.appendChild(label);

            this.formElement.appendChild(checkboxElement);
        }
    }
}