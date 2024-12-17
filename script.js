import { findCity, formRowHtml } from "./citiesData.js"



// Создание первоначальной формы с одним городом
const addForm = () => {
    const travelFormContainer = document.getElementById('travelForm')
    const newCityDiv = document.createElement('div')
    newCityDiv.className = 'city'
    newCityDiv.innerHTML = `
                <h3 id="title">Укажите данные о командировке</h3>
                    <div id="citiesContainer">
                <div class="city">
                    ${formRowHtml}
                </div>
            </div>
            <button type="button" id="addCityBtn">Добавить город</button>
            <button type="submit">Далее</button>
    `;
    travelFormContainer.appendChild(newCityDiv)
}


// Получить ID пользователя из URL (если он передается с Telegram)  
const userId = new URLSearchParams(window.location.search).get('user_id')
console.log(userId)

const usersId = ['12345', '1234']

if (usersId.includes(userId)) {
    addForm()
}




// Обработчик кнопки "Добавить город"
document.getElementById('addCityBtn').addEventListener('click', function () {
    const citiesContainer = document.getElementById('citiesContainer')
    const cityCount = citiesContainer.children.length

    // Создаем новый блок города
    const newCityDiv = document.createElement('div')
    newCityDiv.className = 'city'
    newCityDiv.innerHTML = `
        ${formRowHtml}
        <button class="removeCityBtn">Удалить город</button>
    `;
    citiesContainer.appendChild(newCityDiv)


    // Обработчик для кнопки удаления
    newCityDiv.querySelector('.removeCityBtn').addEventListener('click', function () {
        if (cityCount > 0) {
            citiesContainer.removeChild(newCityDiv)
        } else {
            alert('Нельзя удалить единственный город.')
        }
    })
})




// Обработчик кнопки "Отправить форму"
document.getElementById('travelForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Предотвращаем стандартное поведение формы

    const citiesContainer = document.getElementById('citiesContainer');
    const cityDataArray = []; // Массив для хранения данных о городах

    // Проходим по всем блокам городов и собираем данные
    Array.from(citiesContainer.children).forEach(cityDiv => {
        const cityData = {};

        // Получаем значения из каждого поля ввода
        cityData.city = cityDiv.querySelector('input[name="city"]').value
        cityData.arrivalDate = cityDiv.querySelector('input[name="arrivalDate"]').value
        cityData.departureDate = cityDiv.querySelector('input[name="departureDate"]').value
        cityData.departureTime = cityDiv.querySelector('input[name="departureTime"]').value
        cityData.arrivalTime = cityDiv.querySelector('input[name="arrivalTime"]').value
        cityData.arrivalDateToHotel = cityDiv.querySelector('input[name="arrivalDateToHotel"]').value
        cityData.departureDateToHotel = cityDiv.querySelector('input[name="departureDateToHotel"]').value
        cityData.bookingRequired = cityDiv.querySelector('input[name="bookingRequired"]').checked
        cityData.flightComment = cityDiv.querySelector('textarea[name="flightComment"]').value
        cityData.hotelComment = cityDiv.querySelector('textarea[name="hotelComment"]').value

        cityDataArray.push(cityData); // Добавляем данные текущего города в массив
    });


    const now = new Date()
    const nowZeroHours = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()


    // Проходим по каждому городу и проверяем данные
    let index = 0;
    for (const cityData of cityDataArray) {

        // Проверка на существующий город
        const isHasCity = findCity(cityData['city'])
        const cityInput = citiesContainer.children[index].querySelector('input[name="city"]') // Получаем конкретный input

        if (!isHasCity) {
            alert(`Город "${cityData.city}" не существует. Укажите город верно!`)
            cityInput.classList.add("error")

            setTimeout(() => {
                cityInput.focus()
            }, 0)
            
            return
        } 
        else {
            cityInput.classList.remove("error")
        }
        index++




        // Проверка времени заезда в гостиницу позже 14:00
        const arrivalHours = new Date(cityData.arrivalDateToHotel).getHours()
        const arrivalMinutes = new Date(cityData.arrivalDateToHotel).getMinutes()

        console.log(`arrivalHours: ${arrivalHours}`)
        console.log(`arrivalMinutes: ${arrivalMinutes}`)

        // Сравниваем время
        if (arrivalHours < 14 || (arrivalHours === 14 && arrivalMinutes === 0)) {
            alert("Время заезда в гостиницу в пределах или ранее 14:00 Учите тариф")
        }


        // Проверка времени выезда из гостиницы позже 12:00
        const departureHours = new Date(cityData.departureDateToHotel).getHours()
        const departureMinutes = new Date(cityData.departureDateToHotel).getMinutes()

        console.log(`departureHours: ${departureHours}`)
        console.log(`departureMinutes: ${departureMinutes}`)

        // Сравниваем время
        if (departureHours > 12 || (arrivalHours === 12 && arrivalMinutes === 0)) {
            alert("Время выезда в пределах или позже 12:00. Учите тариф");
        }






        // Проверка Дат
        // TODO: ПРОВЕРЯТЬ БЕЗ ВРЕМЕНИ
        const arrivalDate = new Date(cityData.arrivalDate).getTime();
        const departureDate = new Date(cityData.departureDate).getTime();
        const arrivalTime = new Date(cityData.arrivalTime).getTime();
        const departureTime = new Date(cityData.departureTime).getTime();
        const arrivalDateToHotel = new Date(cityData.arrivalDateToHotel).getTime();
        const departureDateToHotel = new Date(cityData.departureDateToHotel).getTime();

        // Проверка на даты в прошлом
        if (
            arrivalDate < nowZeroHours ||
            departureDate < nowZeroHours ||
            arrivalTime < now.getTime() ||
            departureTime < now.getTime() ||
            arrivalDateToHotel < nowZeroHours ||
            departureDateToHotel < nowZeroHours
        ) {
            alert(`Дата и время для города "${cityData.city}" не могут быть указаны в прошлом`);
            return;
        }

        // Проверка логики дат
        if (arrivalDate > departureDate) {
            alert(`Дата прибытия для города "${cityData.city}" должна быть раньше даты выбытия!`);
            return;
        }
        if (arrivalTime <= departureTime) {
            alert(`Дата и время прилета для города "${cityData.city}" должны быть позже даты и времени вылета!`);
            return;
        }
        if (arrivalDateToHotel >= departureDateToHotel) {
            alert(`Дата и время заезда в гостиницу для города "${cityData.city}" должны быть позже даты и времени выезда из гостиницы!`);
            return;
        }
    }




    // Скрываем форму и заголовок
    document.getElementById('travelForm').style.display = 'none';
    document.getElementById('title').style.display = 'none';

    const containerCheckData = document.getElementById('check');
    // отображаем ранее скрытую форму в edit-button
    containerCheckData.style.display = 'block';
    containerCheckData.className = 'check'
    containerCheckData.innerHTML = ''; // Очищаем контейнер перед добавлением новых данных  

    // Создаем новый элемент для добавления данных  
    const newCheck = document.createElement('div'); // Создаем новый элемент  

    // Создаем блоки для каждого города  
    let content = '<h1>Проверьте правильность внесенных данных:</h1>'; // Создаем переменную для хранения HTML-контента  
    cityDataArray.forEach((cityData) => {
        content += `  
      <div class="checkCity"> 
          <h3>Город: <span>${cityData.city}</span></h3>

          <h3>Дата прибытия: <span>${new Date(cityData.arrivalDate).toLocaleDateString('ru-RU')}</span></h3>

          <h3>Дата выбытия: <span>${new Date(cityData.departureDate).toLocaleDateString('ru-RU')}</span></h3>

          <h3>Дата и время вылета: <span>${new Date(cityData.departureTime).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '')}</span></h3> 

          <h3>Дата и время прилета: <span>${new Date(cityData.arrivalTime).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '')}</span></h3>  

          <h3>Дата и время заезда в гостиницу: <span>${new Date(cityData.arrivalDateToHotel).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '')}</span></h3>  

          <h3>Дата и время выезда из гостиницы: <span>${new Date(cityData.departureDateToHotel).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '')}</span></h3>

          <h3>Комментарий к рейсу: <span>${cityData.flightComment}</span></h3>
          <h3>Комментарий к гостинице: <span>${cityData.hotelComment}</span></h3>
      </div>  
    `;
    });

    // Добавляем собранный контент в новый элемент  
    newCheck.innerHTML = content;

    // Добавляем кнопки только один раз после всех данных  
    newCheck.innerHTML += `
    <button class="acceptTravelForm">Отправить</button>
    <button class="edit-button" data-index="${0}">Редактировать</button>`;

    // Вставляем новый элемент в контейнер  
    containerCheckData.appendChild(newCheck); // И теперь добавляем новый элемент в контейнер


    // Обработчик событий для кнопки "Редактировать"
    const editButtons = document.querySelectorAll('.edit-button')
    editButtons.forEach((button) => {
        button.addEventListener('click', function () {
            const index = this.getAttribute('data-index')
            const cityData = cityDataArray[index];

            // Заполняем форму данными
            document.querySelector('input[name="city"]').value = cityData.city;
            document.querySelector('input[name="arrivalDate"]').value = cityData.arrivalDate;
            document.querySelector('input[name="departureDate"]').value = cityData.departureDate;
            document.querySelector('input[name="departureTime"]').value = cityData.departureTime;
            document.querySelector('input[name="arrivalTime"]').value = cityData.arrivalTime;
            document.querySelector('input[name="arrivalDateToHotel"]').value = cityData.arrivalDateToHotel;
            document.querySelector('input[name="departureDateToHotel"]').value = cityData.departureDateToHotel;
            document.querySelector('input[name="bookingRequired"]').checked = cityData.bookingRequired;
            document.querySelector('textarea[name="flightComment"]').value = cityData.flightComment;
            document.querySelector('textarea[name="hotelComment"]').value = cityData.hotelComment;

            // Скрываем контейнер с проверенными данными
            containerCheckData.style.display = 'none';
            //citiesContainer

            // Показываем форму для редактирования
            document.getElementById('travelForm').style.display = 'block';
            document.getElementById('title').style.display = 'block';

            
        });

        setTimeout(() => {
            document.getElementById("cityInput").focus()
        }, 0);
        
        
    });


    // Обработчик событий для кнопки "Отправить"
    document.querySelector('.acceptTravelForm').addEventListener('click', function () {

        console.log(cityDataArray)

        containerCheckData.style.display = 'none'
        // Сообщение "Данные успешно отправлены"
        document.getElementById('successMessage').style.display = 'block'


    })








    // // Отправка данных на бекенд
    // fetch('https://your-backend-url.com/api/submit', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data), // Преобразуем объект в JSON
    // })
    // .then(response => response.json())
    // .then(result => {
    //     console.log('Успех:', result);
    //     alert('Данные успешно отправлены!');
    // })
    // .catch(error => {
    //     console.error('Ошибка:', error);
    //     alert('Произошла ошибка при отправке данных.');
    // });





});







