export default class FormValidity {
    constructor() {
        this.form = document.forms.regForm;
        this.formElements = Array.from(this.form.elements);
        this.pass1 = null;
        this.pass2 = null;

        this.cashData();
        this.vievPass();
        this.formValidity()
    }

    vievPass() {
        const vievPassBtns = Array.from(document.querySelectorAll('.see-you-pass'));
        
        vievPassBtns.forEach(item => {
            item.addEventListener('click', e => {
                item.classList.toggle('viev');

                //Отображение пароля в виде текста осуществляется заменой атрибута type у input'а. При клике на кнопку отображения пароля, проверяем какой тип указан у input'а, если 'password' то меняем на 'text', или в обратном порядке.
                const passInput = item.parentElement.querySelector('.pass');
                const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passInput.setAttribute('type', type);
            })
        })
    }

    formValidity() {
        const errors = {
            name: {
                valueMissing: 'Пердставьтесь пожалуйста!',
            },
            lastname: {
                valueMissing: 'Укажите фамилию!',
            },
            city: {
                valueMissing: 'Нам нужно ваше местоположение!',
                patternMismatch: 'Поле не может содержать цифры!'
            },
            phone: {
                valueMissing: 'Укажите телефон для связи!',
                typeMismatch: 'Укажите корректный номер!',
            },
            email: {
                valueMissing: 'Нам потребуется ваша почта!',
                typeMismatch: 'Почта должна содержать символ "@"',
            },
            pass1: {
                valueMissing: 'Придумайте пароль!',
            },
            pass2: {
                valueMissing: 'Повторите пароль!',
            },
            'credit-card': {
                valueMissing: 'Предоставьте нам данные кредитной карты, это безопасно, честно.',
                patternMismatch: 'Не верный формат карты, проверте данные.',
            }
        }

        this.form.addEventListener('submit', e => {
            e.preventDefault();
            
            this.formElements.some(el => {
                //Object.keys(obj) - возвращает массив ключей объекта.
                //ValidityState.prototype - это объект JavaScript, который содержит информацию о том, является ли элемент формы действительным или нет. Он используется для проверки корректности введенных пользователем данных в формах на веб-страницах.
                return Object.keys(ValidityState.prototype).some(key => {
                    if(!el.name || key === 'valid') return;

                    if(el.name === 'pass1') this.pass1 = el.value;
                    if(el.name === 'pass2') this.pass2 = el.value;
                    if(el.name === 'pass2' && el.value !== '') {
                        if(this.pass1 !== this.pass2) {
                            console.log('Пароли не совпадают!');
                            this.showTooltip('Пароли не совпадают!', el);
                            return true;
                        }
                    }

                    if(el.validity[key]) {
                        this.showTooltip(errors[el.name][key], el);
                        return true;
                    }
                })
            })
        })
    }

    showTooltip(message, el) {
        const existingTooltip = document.querySelector('.tooltip');
        if(existingTooltip) existingTooltip.remove();

        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.textContent = message;

        const { right, top } = el.getBoundingClientRect();

        document.body.append(tooltip);
        
        //Формула выравнивания ошибки по левому краю, по центру элемента.
        //element.offsetHeight - возвращает высоту элемента, включая вертикальные отступы и границы, в виде целого числа.
        tooltip.style.left = right + 5 + 'px';
        tooltip.style.top = top + el.offsetHeight / 2 - tooltip.offsetHeight / 2 + 'px';
    }

    cashData() {
        document.addEventListener('DOMContentLoaded', () => {
            if(localStorage.length) {
                const json = localStorage.getItem('formData');
                let formData;

                try {
                    formData = JSON.parse(json);
                } catch (err) {
                    console.log(err);
                }

                if(formData) {
                    Object.keys(formData).forEach(key => {
                        this.form.querySelector(`[name="${key}"]`).value = formData[key]
                    })
                }
            }    
        })

        window.addEventListener('beforeunload', () => {
            if(this.formElements.some(el => el.value !== "")) {
                const formData = {};

                this.formElements.forEach(el => {
                    if(!el.name) return; //Отсеиваем кнопки, если нет поля name, значит кнопка.

                    formData[el.name] = el.value;
                    localStorage.setItem('formData', JSON.stringify(formData));
                })
            }
        });
    }
}