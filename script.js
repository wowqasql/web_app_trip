import { findCity, formattDate, sendDataToServer, checkIsActiveGandivaIdForAddForm } from "./citiesData.js"

import { formHotelHTML, citiesContainerHTML, formCityHTML } from "./html.js"



// Константы Модалки
const modal = document.getElementById("myModal")
const okBtn = document.getElementById("okBtn")
const textModal = document.getElementById("textModal")


// Функция для показа модального окна и ожидания нажатия "ОК"  
function showModal(text) {
    return new Promise((resolve) => {
        // Показываем модальное окно  
        modal.style.display = "flex";
        textModal.innerHTML = text;

        // Обработчик кнопки "ОК"  
        const okHandler = function () {
            modal.style.display = "none"; // Скрываем модальное окно  
            // Удаляем обработчики после нажатия  
            okBtn.removeEventListener('click', okHandler);
            window.removeEventListener('click', outsideClickHandler);
            resolve(); // Разрешаем Promise  
        };

        // Обработчик закрытия модального окна по клику вне области  
        const outsideClickHandler = function (event) {
            if (event.target === modal) {
                modal.style.display = "none"; // Скрываем модальное окно  
                // Удаляем обработчики после закрытия  
                okBtn.removeEventListener('click', okHandler);
                window.removeEventListener('click', outsideClickHandler);
                resolve(); // Разрешаем Promise  
            }
        };

        // Добавляем обработчики событий  
        okBtn.addEventListener('click', okHandler);
        window.addEventListener('click', outsideClickHandler);
    });
}



const addForm = () => {
    const travelFormContainer = document.getElementById('travelForm')
    const newCityDiv = document.createElement('div')
    newCityDiv.className = 'citys';
    newCityDiv.innerHTML = citiesContainerHTML
    travelFormContainer.appendChild(newCityDiv)
};



// Получить ID пользователя из URL (если он передается с Telegram)  
const gandivaId = new URLSearchParams(window.location.search).get('gandiva_id')
console.log(gandivaId)


const isActiveGandivaId = await checkIsActiveGandivaIdForAddForm(gandivaId)
console.log(`isActiveGandivaId: ${isActiveGandivaId}`)

if (!isActiveGandivaId){
    addForm();
}


// Константы Формы
const citiesContainer = document.getElementById('citiesContainer')


// TODO: Проверка на существование citiesContainer перед добавлением обработчика событий
// if (citiesContainer)


// Обработчик для контейнера городов
// обработчик нажатия чекбокса
citiesContainer.addEventListener('click', function (event) {

    // Обработка нажатия на чекбокс
    if (event.target.id === 'bookingCheckbox') {
        const checkbox = event.target;
        const additionalInputContainer = checkbox.closest('.city').querySelector('#additionalHotelDataContainer')
        console.log(event.target)
        // Удаляем предыдущее поле, если оно существует
        additionalInputContainer.innerHTML = ''

        if (checkbox.checked) {
            // Добавляем класс show для плавного появления
            additionalInputContainer.classList.add('show')

            // Добавляем поле ввода с помощью innerHTML
            additionalInputContainer.innerHTML = formHotelHTML

        } else {
            // Удаляем класс show, чтобы скрыть контейнер
            additionalInputContainer.classList.remove('show')
        }

        console.log(additionalInputContainer)
    }
});




// Обработчик кнопки "Следующая точка маршрута"
document.getElementById('addCityBtn').addEventListener('click', function () {
    const citiesContainer = document.getElementById('citiesContainer')
    const cityCount = citiesContainer.children.length

    console.log(cityCount)




    // Создаем новый блок города
    const newCityDiv = document.createElement('div')
    newCityDiv.className = 'city'
    newCityDiv.classList.add('show')
    newCityDiv.innerHTML = `
        ${formCityHTML(true)}
        <button class="removeCityBtn">Удалить маршрут</button>
    `;

    // Установка значения Города Назвачения из Первого маршрута во Второй Маршрут в Город Отправления 
    let arrayCityElement = document.querySelectorAll('.city')

    let currentCityElement = arrayCityElement[arrayCityElement.length - 1]

    let arrivalCity = currentCityElement.querySelector('input[name="arrivalCity"]').value

    let departureCity_newCityDiv = newCityDiv.querySelector('input[name="departureCity"]')

    departureCity_newCityDiv.value = arrivalCity
    departureCity_newCityDiv.disabled = true


    citiesContainer.appendChild(newCityDiv)


    // Обработчик для кнопки удаления
    newCityDiv.querySelector('.removeCityBtn').addEventListener('click', function () {
        if (cityCount > 0) {
            citiesContainer.removeChild(newCityDiv)
        }
    })
})


// Обработчик кнопки "Конечная точка маршрута"
document.getElementById('addLastCityBtn').addEventListener('click', function () {
    const citiesContainer = document.getElementById('citiesContainer')

    const addCityBtn = document.querySelector('#addCityBtn')
    const addLastCityBtn = document.querySelector('#addLastCityBtn')
    addCityBtn.remove() // Удалить кнопку "Следующая точка маршрута"
    addLastCityBtn.remove() // Удалить кнопку "Конечная точка маршрута"




    // Создаем новый блок города
    const newCityDiv = document.createElement('div')
    newCityDiv.className = 'city'
    newCityDiv.innerHTML = `
        ${formCityHTML(false)}
        <button type="submit">Далее</button>`

    // Установка значения Города Назвачения из Первого маршрута во Второй Маршрут в Город Отправления


    let arrayCityElement = document.querySelectorAll('.city')

    let currentCityElement_last = arrayCityElement[arrayCityElement.length - 1]

    let arrivalCity_last = currentCityElement_last.querySelector('input[name="arrivalCity"]').value

    let departureCity_newCityDiv_last = newCityDiv.querySelector('input[name="departureCity"]')

    departureCity_newCityDiv_last.value = arrivalCity_last
    departureCity_newCityDiv_last.disabled = true






    // Город из первой формы
    let currentCityElement = arrayCityElement[0]
    let arrivalCity = currentCityElement.querySelector('input[name="departureCity"]').value
    // Город из конечной точки
    let departureCity_newCityDiv = newCityDiv.querySelector('input[name="arrivalCity"]')
    departureCity_newCityDiv.value = arrivalCity


    citiesContainer.appendChild(newCityDiv)
})


// Обработчик кнопки "Отправить форму"
document.getElementById('travelForm').addEventListener('submit', async function (event) {
    event.preventDefault() // Предотвращаем стандартное поведение формы

    const citiesContainer = document.getElementById('citiesContainer')
    const cityDataArray = [] // Массив для хранения данных о городах

    // Проходим по всем блокам городов и собираем данные
    Array.from(citiesContainer.children).forEach(cityDiv => {
        const cityData = {}

        // Проверяем заполнен ли чекбокс
        const bookingRequiredInput = cityDiv.querySelector('input[name="bookingRequired"]')
        if (bookingRequiredInput) {
            cityData.bookingRequired = bookingRequiredInput.checked;
        }

        // Получаем значения из каждого поля ввода
        // Город
        cityData.departureCity = cityDiv.querySelector('input[name="departureCity"]').value
        cityData.arrivalCity = cityDiv.querySelector('input[name="arrivalCity"]').value

        // Дата вылета
        cityData.departureTime = cityDiv.querySelector('input[name="departureTime"]').value

        // Организация назначения
        const arrivalOrganizationInput = cityData.arrivalOrganization = cityDiv.querySelector('input[name="arrivalOrganization"]')
        cityData.arrivalOrganization = arrivalOrganizationInput ? arrivalOrganizationInput.value : null
        // if (arrivalOrganizationInput) {
        //     cityData.arrivalOrganization = arrivalOrganizationInput.value;
        // }


        // Тип Билета
        const selectElement = cityDiv.querySelector('select[name="tickets"]')
        const selectedOption = selectElement.querySelector('option:checked')
        cityData.typeTickets = selectedOption.textContent;

        // Комментарий к рейсу
        cityData.flightComment = cityDiv.querySelector('textarea[name="flightComment"]').value

        // Hotel
        if (cityData.bookingRequired) {
            cityData.hotelName = cityDiv.querySelector('input[name="hotelName"]').value
            cityData.arrivalDateToHotel = cityDiv.querySelector('input[name="arrivalDateToHotel"]').value
            cityData.departureDateToHotel = cityDiv.querySelector('input[name="departureDateToHotel"]').value
            cityData.hotelComment = cityDiv.querySelector('textarea[name="hotelComment"]').value
        }


        cityDataArray.push(cityData) // Добавляем данные текущего города в массив
    });


    const now = new Date()
    const nowZeroHours = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()


    let index = 0;

    // Проходим по каждому городу и проверяем данные

    for (const cityData of cityDataArray) {

        // Проверка на существующий город

        const isHasDepartureCityInput = findCity(cityData['departureCity'])
        const isHasArrivalCity = findCity(cityData['arrivalCity'])

        // Получаем конкретный input
        const departureCityInput = citiesContainer.children[index].querySelector('input[name="departureCity"]')
        const arrivalCityInput = citiesContainer.children[index].querySelector('input[name="arrivalCity"]')

        if (!isHasDepartureCityInput) {
            await showModal(`Город "${cityData.departureCity}" не существует. Укажите город верно!`)
            setTimeout(() => {
                departureCityInput.classList.add("error")
                departureCityInput.focus()
            }, 0)
            set_coursor(departureCityInput)
            return
        }
        else if (!isHasArrivalCity) {
            await showModal(`Город "${cityData.arrivalCity}" не существует. Укажите город верно!`)
            setTimeout(() => {
                arrivalCityInput.classList.add("error")
                arrivalCityInput.focus()
            }, 0)
            set_coursor(arrivalCityInput)
            return
        }
        else {
            departureCityInput.classList.remove("error")
            arrivalCityInput.classList.remove("error")
        }
        index++

        // ----------------------------------






        // Проверка Дат
        const departureTime = new Date(cityData.departureTime).getTime()

        // Если требуется Бронь Hotel
        let arrivalDateToHotel
        let departureDateToHotel
        if (cityData.bookingRequired) {
            arrivalDateToHotel = new Date(cityData.arrivalDateToHotel).getTime()
            departureDateToHotel = new Date(cityData.departureDateToHotel).getTime()
        }


        // Проверка на даты в прошлом
        if (
            departureTime < now.getTime() ||
            arrivalDateToHotel < nowZeroHours ||
            departureDateToHotel < nowZeroHours
        ) {
            await showModal(`Дата и время для города "${cityData.departureCity}" не могут быть указаны в прошлом`)
            return;
        }

        if (arrivalDateToHotel >= departureDateToHotel) {
            await showModal(`Дата и время заезда в гостиницу для города "${cityData.departureCity}" должны быть позже даты и времени выезда из гостиницы!`)
            return;
        }

        // ---------------------------------------------



        // Проверка времени заезда в гостиницу позже 14:00
        const arrivalHours = new Date(cityData.arrivalDateToHotel).getHours()
        const arrivalMinutes = new Date(cityData.arrivalDateToHotel).getMinutes()

        console.log(`arrivalHours: ${arrivalHours}`)
        console.log(`arrivalMinutes: ${arrivalMinutes}`)

        // Сравниваем время
        if (arrivalHours < 14 || (arrivalHours === 14 && arrivalMinutes === 0)) {
            await showModal(`Время заезда в гостиницу для города "${cityData.departureCity}" в пределах или ранее 14:00 Учите тариф`)
        }


        // Проверка времени выезда из гостиницы позже 12:00
        const departureHours = new Date(cityData.departureDateToHotel).getHours()
        const departureMinutes = new Date(cityData.departureDateToHotel).getMinutes()

        console.log(`departureHours: ${departureHours}`)
        console.log(`departureMinutes: ${departureMinutes}`)

        // Сравниваем время
        if (departureHours > 12 || (arrivalHours === 12 && arrivalMinutes === 0)) {
            await showModal(`Время выезда из гостиницы для города "${cityData.departureCity}" в пределах или позже 12:00. Учите тариф`)

        }
        // ---------------------------------------------------

    }



    // Скрываем форму и заголовок
    document.getElementById('travelForm').style.display = 'none'
    document.getElementById('title').style.display = 'none'

    const containerCheckData = document.getElementById('check')
    // отображаем ранее скрытую форму в edit-button
    containerCheckData.style.display = 'block'
    containerCheckData.className = 'check'
    containerCheckData.innerHTML = '' // Очищаем контейнер перед добавлением новых данных

    // Создаем новый элемент для добавления данных  
    const newCheck = document.createElement('div') // Создаем новый элемент  

    // Создаем блоки для каждого города  
    let content = '<h1>Проверьте правильность внесенных данных:</h1>' // Создаем переменную для хранения HTML-контента  
    cityDataArray.forEach((cityData) => {

        let departureTimeFormatt = formattDate(cityData.departureTime)

        let arrivalDateToHotel
        let departureDateToHotel
        if (cityData.bookingRequired) {
            arrivalDateToHotel = formattDate(cityData.arrivalDateToHotel)
            departureDateToHotel = formattDate(cityData.departureDateToHotel)
        }

        content += `
      <div class="checkCity"> 
          <h3>Город отправления: <span>${cityData.departureCity}</span></h3>

          <h3>Город назначения: <span>${cityData.arrivalCity}</span></h3>


          ${cityData.arrivalOrganization ? `<h3>Организация назначения: <span>${cityData.arrivalOrganization}</span></h3>`: ''}

          <h3>Дата вылета из города отправления: <span>${departureTimeFormatt}</span></h3>

          <h3>Тип билета: <span>${cityData.typeTickets}</span></h3>

          <h3>Комментарий к рейсу: <span>${cityData.flightComment}</span></h3>

          
          ${cityData.bookingRequired ? `
            <h3>Дата и время заезда в отель: <span>${arrivalDateToHotel}</span></h3>

            <h3>Дата и время выезда из отеля: <span>${departureDateToHotel}</span></h3>

            <h3>Комментарий к гостинице: <span>${cityData.hotelComment}</span></h3>
          ` : ''}
          

      </div>  
    `
    })

    // Добавляем собранный контент в новый элемент
    newCheck.innerHTML = content

    // Добавляем кнопки только один раз после всех данных  
    newCheck.innerHTML += `
    <button class="acceptTravelForm">Отправить</button>
    <button class="edit-button" data-index="${0}">Редактировать</button>`

    // Вставляем новый элемент в контейнер  
    containerCheckData.appendChild(newCheck) // И теперь добавляем новый элемент в контейнер


    // Обработчик событий для кнопки "Редактировать"
    const editButtons = document.querySelectorAll('.edit-button')
    editButtons.forEach((button) => {
        button.addEventListener('click', function () {
            const index = this.getAttribute('data-index')
            const cityData = cityDataArray[index];

            // Заполняем форму данными

            document.querySelector('input[name="bookingRequired"]').checked = cityData.bookingRequired

            document.querySelector('input[name="departureCity"]').value = cityData.departureCity

            document.querySelector('input[name="departureTime"]').value = cityData.departureTime

            // У Конечной Точки нет Поля Организация
            if (cityData.arrivalOrganization){

                document.querySelector('input[name="arrivalOrganization"]').value = cityData.arrivalOrganization
            }


            const selectElement = document.querySelector('select[name="tickets"]');
            const option = selectElement.querySelector(`option[value="${cityData.typeTickets}"]`)
            if (option) {
                option.selected = true;
            }

            document.querySelector('textarea[name="flightComment"]').value = cityData.flightComment

            // Hotel
            if (cityData.bookingRequired) {

                document.querySelector('input[name="hotelName"]').value = cityData.hotelName

                document.querySelector('input[name="arrivalDateToHotel"]').value = cityData.arrivalDateToHotel

                document.querySelector('input[name="departureDateToHotel"]').value = cityData.departureDateToHotel

                document.querySelector('textarea[name="hotelComment"]').value = cityData.hotelComment

            }


            // Скрываем контейнер с проверенными данными
            containerCheckData.style.display = 'none'

            // Показываем форму для редактирования
            document.getElementById('travelForm').style.display = 'block'
            document.getElementById('title').style.display = 'block'


        })
    })


    // Обработчик событий для кнопки "Отправить"
    document.querySelector('.acceptTravelForm').addEventListener('click', async function () {

        containerCheckData.style.display = 'none'

        console.log(cityDataArray)

        // Преобразование данных перед отправкой
        const transformedCityDataArray = cityDataArray.map(cityData => {

            const dataToSend = {
                gandiva_id: Number(gandivaId),
                city1: cityData.departureCity,
                city2: cityData.arrivalCity,
                fly_start: new Date(cityData.departureTime).toISOString(),
                need_hotel: cityData.bookingRequired ? true : false,
                name_hotel: cityData.bookingRequired ? cityData.hotelName : null,
                arrival_date: cityData.bookingRequired ? new Date(cityData.arrivalDateToHotel).toISOString() : null,
                eviction_date: cityData.bookingRequired ? new Date(cityData.departureDateToHotel).toISOString() : null,
                comment_hotel: cityData.bookingRequired ? cityData.hotelComment : null,
                fly_comment: cityData.flightComment,
                bilet_type: cityData.typeTickets,
                to_org: cityData.arrivalOrganization
            }

            // Фильтруем свойства, чтобы исключить null значения
            return Object.fromEntries(
                Object.entries(dataToSend).filter(([_, v]) => v !== null)
            )
        })



        // Передача данных на сервер
        const response = await sendDataToServer(transformedCityDataArray)

        const successMessage = document.getElementById('successMessage')
        successMessage.style.display = 'block'

        // Если error - false
        if (!response){
            successMessage.innerHTML = `Данные успешно отправлены!`
        }else{
            successMessage.innerHTML = `Ошибка при отправке данных. Обновите страницу и попробуйте еще раз!`
        }

        

          





    })

})







