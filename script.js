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
    if (arrivalDate < departureDate) {
        alert('Дата прибытия должна быть позже даты выбытия!');
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