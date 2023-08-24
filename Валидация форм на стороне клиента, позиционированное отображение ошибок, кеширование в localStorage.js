//Валидация форм на стороне клиента

//У нас есть вот такая форма:
    `<form class="form" novalidate>
    <div class="form-control">
        <input name="login" id="login" type="text" class="input login" placeholder="login" required>
    </div>
    <div class="form-control">
        <input name="email" type="email" class="input email" placeholder="email" required>
    </div>
    <div class="form-control">
        <input name="сredit-card" class="input credit-card" placeholder="credit card" required pattern="^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{12}|3[0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$">
    </div>
    <div>
        <button type="submit" class="btn">Ok</button>
        <button type="reset" class="btn">Reset</button>
    </div>
    </form>`;

//Отключение браузерной валидации
    //У браузера есть встроеная валидация форм. Она редко используется, но так же она может мешать нашей, более сложной валидации. Для ее отключения используется атрибут novalidate:
        <form class="form" novalidate>
            {/* some tags... */}
        </form>

//Информация о полях и валидации формы
    //Однако, при использовании атрибута novalidate, браузер, "под капотом" продолжает валидацию. Проверить это мы можем при помощи js.
        const form = document.querySelector('.form');

        form.addEventListener('submit', e => {
            e.preventDefault();

            if(form.checkValidity()) {
                console.log('valid'); //Получим, если форма валидна.
            } else {
                console.log('invalid'); //Получим, если форма не валидна.
            }
        })

    //Так же мы можем проверить каждый элемент формы, валидный ли он.
        form.addEventListener('submit', e => {
            e.preventDefault();
        
            console.dir(form.elements);
        
            //console.dir() - позволет посмотреть свойства объекта.
        })

        //Мы получим html-коллекцию, со всеми элементами формы и их свойствами (см файл HTML-коллекция элементов формы). В каждом элементе есть наборы свойств, нам нужно промотать в самый низ. Нас интересует два свойства (см файл input-свойства валидации):
            //1 - validationMessage - В котром как раз и храниться то сообщение которое браузер выдал бы нам, если бы мы не отменили поведение по умолчанию.
            //2 - valididty - В котором храниться вся информация про валидацию поля. Разберем некоторые поля в этом свойстве:
                //valid - говорит нам валидно поле инпута или нет.
                //valueMissing - говорит об отсутствии данных в поле input.
                //typeMismatch - говорит нам о типе данных, точнее о том верны ли введенные даные или нет.
                //tooLong - говорит о том что введено слишком много символов.
                //tooShort - говорит о том что введено слишком мало символов.
                //rangeOverflow - говорит о слишком большом вводе числовых данных.
                //rangeUnderflow - говорит о слишком коротком вводе числовых данных.
                //patternMismatch - говорит об ошибке при проверке через регулярное выражение.

        //Давайте выведем в консоль тип ошибки связанный с каждым элементом. Для этого нам потребуется где то найти список полей свойтсва validity. В свойстве validity храниться объект ValidityState, нам нужно обратиться к его прототипу:
            Object.keys(ValidityState.prototype); //Мы получим массив из тех самых полей свойства validity. Prototype - дает нам доступ к конструктору и свойтсвам ValidityState.

            //Далее провалидируем наши поля:
                form.addEventListener('submit', e => {
                    e.preventDefault();
                    
                    const elements = Array.from(form.elements)
                    
                    elements.forEach((el) => {
                        Object.keys(ValidityState.prototype).forEach( (key) => {
                            if (el.validity[key]) {
                                console.log(key); //В итоге в консоли мы увидем 3 сообщения "valueMissing" - которые говорят о том что поля не заполнены.
                            };
                        })
                    })
                });

        //Вот мы получили доступ к ошибкам ввода полей данных, теперь напишем человекопонятные ошибки. Создадим объект в который поместим ошибки по их именам в объектк ValidityState. Ключами к объектам будут имена input'ов по атрибуту name:
                const errors = {
                    login: {
                        valueMissing: 'Пердставьтесь пожалуйста!',
                    },
                    email: {
                        valueMissing: 'Нам потребуется электропочта...',
                        typeMismatch: 'А это точно электропочта?',
                    },
                    'credit-card': {
                        valueMissing: 'Предоставьте нам данные кредитной карты, это безопасно, честно',
                        patternMismatch: 'Не удалось снять деньги с вашей кредитной карты :(',
                    }
                }

            //Теперь свяжем ключи объекта "errors" с ключами атрибута "name" тегов "input":
                form.addEventListener('submit', e => {
                    e.preventDefault();
                    
                    const elements = Array.from(form.elements) //Создали массив из всех элементов формы.
                    
                    elements.forEach((el) => {
                        Object.keys(ValidityState.prototype).forEach( (key) => { //Проходим по всем свойствам класса ValidityState
                            if(!el.name) return; //Если у тега нет атрибута name, то не валидируем его. Так мы исключим из проверки кнопки.   
                
                            if (el.validity[key]) { //Пробегаем по всем свойствам input'а, в объекте ValidityState, и если информация отсутствует или введена не корректно, то есть свойство возвращает "true"...
                                console.log(errors[el.name][key]); //Мы выводим ошибку в зависимости от того тега input который проверялся.
                            };
                        })
                    })
                });

            //Для понимания что происходит в строке console.log(errors[el.name][key]) добавлю следующее:
                errors[elements[0].name]['valueMissing'] //Это обращение к ошибке в ручную, без цикла forEach.

            //Далее, усовершенствуем код, чтобы он выводил ошибку по мере продвижения по input'ам сверху в низ:
                form.addEventListener('submit', e => {
                    e.preventDefault();
                    
                    const elements = Array.from(form.elements);
                    elements.some((el) => {
                        return Object.keys(ValidityState.prototype).some( (key) => { //В этой строке return вернет true в some и оствновит дальнейшую проверку input'ов.
                            if(!el.name) return;    
                            if(key === 'valid') return; //Если у объекта ValidityState есть поле valid, то не проверять этот input;
                
                            if (el.validity[key]) {
                                console.log(errors[el.name][key]);
                
                                return true; //Если в первом input'е есть ошибка, то return вернет true в перебор массива Object.keys(ValidityState.prototype).some и остановит дальнейшую проверку.
                            };
                        })
                    })
                })

    //ОТОБРАЖЕНИЕ И ВЫРАНИВАНИЕ ОШИБОК ПО ЦЕНТРУ ПРАВГО КРАЯ INPUT'А
        function showTooltip(message, el) {
            const existingTooltip = document.querySelector('.tooltip');
            if(existingTooltip) existingTooltip.remove();

            const tooltip = document.createElement('div');
            tooltip.classList.add('tooltip');
            tooltip.textContent = message;

            const { right, top } = el.getBoundingClientRect();

            //Очень важно добавить элемент на страницу до его позиционирования.
            document.body.append(tooltip);
            
            //Формула выравнивания ошибки по левому краю, по центру элемента.
            //element.offsetHeight - возвращает высоту элемента, включая вертикальные отступы и границы, в виде целого числа.
            tooltip.style.left = right + 5 + 'px';
            tooltip.style.top = top + el.offsetHeight / 2 - tooltip.offsetHeight / 2 + 'px';
        }

    //КЕШИРОВАНИЕ ДАННЫХ В LOCALSTORAGE
        //Для того чтобы закешировать данные пользователя при выключении/перезагрузке страницы, мы должны подписаться на событие beforeunload объекта window:
        //Создадим для этого отдельную функцию:
        function cahsData() {
            document.addEventListener('DOMContentLoaded', () => { //Подпишемся на событие загрузки страницы.
                if(localStorage.length) { //Проверим есть ли в localStorage информация.
                    const json = localStorage.getItem('formData'); //Получим данные в формате json
                    let formData;
    
                    try {
                        formData = JSON.parse(json); //Распарсим данные в переменную.
                    } catch (err) {
                        console.log(err);
                    }
    
                    //Далее пробегаем по ключам объекта полученного из localStorage, и подставляем данные в нашу форму на странице, по атрибуту name.
                    if(formData) {
                        Object.keys(formData).forEach(key => {
                            form.querySelector(`[name="${key}"]`).value = formData[key]
                        })
                    }
                }    
            });

            //Теперь займемся кешированием в localStorage
            window.addEventListener('beforeunload', () => { //Подпишемся на событе выгрузки страницы.
                if(formElements.some(el => el.value !== "")) { //Если хоть один элемент формы заполнен, то кешируем данные.
                    const formData = {};
    
                    formElements.forEach(el => {
                        if(!el.name) return; //Отсеиваем кнопки, если нет поля name, значит кнопка.
    
                        formData[el.name] = el.value; //Создаем объект из данных формы по типу ключь-значени. Где ключь это то что указано в поле name у input. А значеие это то что в ipnut указал пользователь.
                        localStorage.setItem('formData', JSON.stringify(formData)); //Загружаем данные в localStorage.
                    })
                }
            });
        }