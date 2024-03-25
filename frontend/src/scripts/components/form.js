
export class Form {
    constructor(type) {
        this.type = type;
        this.titleElement = document.getElementById('title');
        this.formLinkElement = document.getElementById('form-link');
        this.formElement = document.getElementById('form');
        this.btnElement = document.getElementById('submitBtn');
        this.checkbox = null;
        this.inputElements = [];


        this.inputs = [
            {
                name : 'fullName',
                icon : 'static/img/authentication/person.svg',
                placeholder : 'ФИО',
                type : 'text',
                regex : /[А-я][а-я]/
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
                // validation (inputElement, errorElement) {
                //     inputElement.addEventListener('blur', (event) => {
                //         const value = event.target.value;
                //         let errors = [];
                //         if(!value) return;
                //         if(value.length < 8) errors.push('не менее 8 символов');
                //         if(!value.match(/\w/i)) errors.push('латинские буквы');
                //         if(!value.match(/[A-Z]/)) errors.push('буквы верхнего регистра');
                //         if(!value.match(/[a-z]/)) errors.push('буквы нижнего регистра');
                //         if(!value.match(/\d/)) errors.push('содержать цифры');
                //         if(!value.match(/\W+/)) errors.push('знаки препинания');

                //         console.log(errors)

                //         if(errors.length > 0) {
                //             let message = 'Пароль должен содержать: ';
                //             for (let i = 0; i < errors.length; i++) {
                //                 message = message + (i === 0 ? ' ' : ', ') + errors[i];
                //             }
                //             this.valid = false;
                //             errorElement.innerText = message + '.';
                //             return
                //         }

                //         this.valid = true;
                //         errorElement.innerText = '';
                //     });
                // }
            },
            {
                name : 'repeatPassword',
                icon : 'static/img/authentication/lock.svg',
                placeholder : 'Подтверждение пароля',
                type : 'password',
                regex : null,
            }
        ]

        if(type === 'signin') {
            this.inputs.splice(3, 1);
            this.inputs.splice(0, 1);
        }

        this.signin = {
            title: 'Вход',
            formLink: 'Ещё нет аккаунта? <a href="#/login">Пройдите регистрацию</a>',
            btnProcess () {
                this.commonFormCheck();
                if (this.checkbox.checked) {
                    console.log('checked')
                }

            }
        }

        this.login = {
            title: 'Создайте аккаунт',
            formLink: 'Уже есть аккаунт? <a href="#/signin">Войдите в систему</a>',
            btnProcess () {
                this.commonFormCheck();
            }
        }

        this.fillPage(type)

        this.btnElement.addEventListener('click', this[type].btnProcess.bind(this))
        
    }

    commonFormCheck () {
        let formValid = true
        this.inputs.forEach(item => {
            item.element.validationCheck();
            formValid = item.element.valid;
        });
        if (formValid) {
            alert('pass')
        } else {
            alert('not pass')
        }
        console.log(this.input)
    }

    fillPage (type) {
        this.titleElement.innerText = this[type].title;
        this.formLinkElement.innerHTML = this[type].formLink;
        this.inputs.forEach(input => {
            const element = new Input(input);

            if(input.name === 'fullName') {
                element.inputElement.addEventListener('input', (event) => {
                    let x = event.target.value.replace(/[^\wа-яё\s]|\d/i, '');

                    const letter = x.match(/(?:^[а-я])|(?:\s[а-я])/g);
                    if (letter) {
                        x = x.replace(/\W$/, letter[0].replace(/\s/g, '').toUpperCase());
                    }
                    event.target.value = x;
                })
            }

            if(type === 'login' && input.name === 'password') {
                element.inputElement.addEventListener('blur', (event) => {
                    this.inputs.find(item => item.name === 'repeatPassword').element.regex = event.target.value;
                    console.log(this.inputs)
                });
            }

            this.formElement.appendChild(element.errorElement);
            this.formElement.appendChild(element.element);

            input.element = element

        });

        if(type === 'signin') {
            const checkboxElement = document.createElement('div');
            checkboxElement.className = 'checkbox';

            const input = document.createElement('input');
            input.setAttribute('type', 'checkbox')
            input.setAttribute('id', 'rememberMe')
            
            this.checkbox = input;

            const label = document.createElement('label');
            label.setAttribute('for', 'rememberMe');
            label.innerText = 'Запомнить меня';

            checkboxElement.appendChild(input);
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
        this.valid = false


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
        const formInput = document.createElement('label');
        formInput.className = 'form-input'

        const errorElement = document.createElement('div');
        errorElement.className = 'input-error';
        
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
        console.log(value)
        if(!value) {
            this.errorElement.innerText = 'Заполните поле';
            this.element.classList.add('noValid');
            this.valid = false;
            return
        }

        if(value.match(this.regex)) {
            this.valid = true;
        } else {    
            this.errorElement.innerText = (this.name === 'repeatPassword' ? 'Пароли не совпадают' : 'Поле заполнено некорректно');
            this.element.classList.add('noValid');
            this.valid = false;
        }
    }
}