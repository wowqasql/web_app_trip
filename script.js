

// Получить ID пользователя из URL (если он передается с Telegram)  
const userId = new URLSearchParams(window.location.search).get('user_id');
console.log(userId)

document.getElementById('addCityBtn').addEventListener('click', function() {
    const citiesContainer = document.getElementById('citiesContainer');
    const cityCount = citiesContainer.children.length;

    // Создаем новый блок города
    const newCityDiv = document.createElement('div');
    newCityDiv.className = 'city';
    newCityDiv.innerHTML = `
        <div class="row">
            <div>
                <label>Город:</label>
                <input type="text" name="city" placeholder="Введите город" required>
            </div>
        </div>
        <div class="row">
            <div>
                <label>Дата прибытия:</label>
                <input type="date" name="arrivalDate" required>
            </div>
            <div>
                <label>Дата выбытия:</label>
                <input type="date" name="departureDate" required>
            </div>
        </div>
        <div class="row">
            <div>
                <label>Дата и время вылета:</label>
                <input type="datetime-local" name="departureTime" required>
            </div>
            <div>
                <label>Дата и время прилета:</label>
                <input type="datetime-local" name="arrivalTime" required>
            </div>
            <div class="checkbox">
                <label>Требуется ли бронь:</label>
                <input type="checkbox" name="bookingRequired">
            </div>
        </div>
        <div class="row">
            <div>
                <label>Дата и время заезда в гостиницу:</label>
                <input type="datetime-local" name="arrivalDateToHotel" required>
            </div>
            <div>
                <label>Дата и время выезда из гостиницы:</label>
                <input type="datetime-local" name="departureDateToHotel" required>
            </div>
        </div>
        <div class="row">
            <div>
                <label>Комментарий к рейсу:</label>
                <textarea name="flightComment" placeholder="Ваш комментарий"></textarea>
            </div>
        </div>
        <div class="row">
            <div>
                <label>Комментарий к гостинице:</label>
                <textarea name="hotelComment" placeholder="Ваш комментарий"></textarea>
            </div>
        </div>
        <button class="removeCityBtn">Удалить город</button>
    `;
    citiesContainer.appendChild(newCityDiv);

    // Обработчик для кнопки удаления
    newCityDiv.querySelector('.removeCityBtn').addEventListener('click', function() {
        if (cityCount > 0) {
            citiesContainer.removeChild(newCityDiv);
        } else {
            alert('Нельзя удалить единственный город.');
        }
    });
});

document.getElementById('travelForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Предотвращаем стандартное поведение формы

    const formData = new FormData(this); // Собираем данные из формы

    // FormData в объект
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Проверка дат
    const now = new Date();
    const nowZeroHours = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const arrivalDate = new Date(data['arrivalDate']).getTime();
    const departureDate = new Date(data['departureDate']).getTime();
    const arrivalTime = new Date(data['arrivalTime']).getTime();
    const departureTime = new Date(data['departureTime']).getTime();
    const arrivalDateToHotel = new Date(data['arrivalDateToHotel']).getTime();
    const departureDateToHotel = new Date(data['departureDateToHotel']).getTime();

    // Логирование для отладки
    console.log('NOW:', now);
    console.log('nowZeroHours:', nowZeroHours);
    console.log('arrivalDate:', arrivalDate);
    console.log('departureDate:', departureDate);
    console.log('arrivalTime:', arrivalTime);
    console.log('departureTime:', departureTime);
    console.log('arrivalDateToHotel:', arrivalDateToHotel);
    console.log('departureDateToHotel:', departureDateToHotel);

    // Проверка на даты в прошлом
    if (
        (arrivalDate < nowZeroHours) ||
        (departureDate < nowZeroHours)|| 
        (arrivalTime < now.getTime()) ||
        (departureTime < now.getTime()) ||
        (arrivalDateToHotel < nowZeroHours) ||
        (departureDateToHotel < nowZeroHours)
    ) {
        alert('Дата и время не могут быть указаны в прошлом');
        return;
    }

    // Проверка логики дат
    if (arrivalDate > departureDate) {
        alert('Дата прибытия должна быть раньше даты выбытия!');
        return;
    }
    if (arrivalTime <= departureTime) {
        alert('Дата и время прилета должны быть позже даты и времени вылета!');
        return;
    }
    if (arrivalDateToHotel >= departureDateToHotel) {
        alert('Дата и время заезда в гостиницу должны быть позже даты и времени выезда из гостиницы!');
        return;
    }
    console.log(data)


    Object.entries(data).forEach(([key, value]) => {
        console.log(`Ключ: ${key}, Значение: ${value}`);
      });







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


    // Сообщение "Данные успешно отправлены"
    // Скрываем форму
    document.getElementById('travelForm').style.display = 'none';
    document.getElementById('title').style.display = 'none';

    // Показываем сообщение об успешной отправке
    document.getElementById('successMessage').style.display = 'block';
});







