// Форма для кнопок "Следующая точка маршрута" и "Конечная точка маршурута"

export const formCityHTML = (isFullForm) => {

    return `
                        <div class="row">
                        <div>
                            <label>Город отправления:</label>
                            <input type="text" id="departureCity" name="departureCity" placeholder="Введите город" required>
                        </div>

                        <div>
                            <label>Город назначения:</label>
                            <input type="text" id="arrivalCity" name="arrivalCity" placeholder="Введите город" required>
                        </div>
                    </div>

                    ${isFullForm ? `<div class="row">
                        <div>
                            <label>Организация назначения:</label>
                            <input type="text" id="arrivalOrganization" name="arrivalOrganization" placeholder="Введите организацию" required>
                        </div>
                    </div>` : ""}

                    
                    <div class="row">
                        <div>
                            <label>Дата вылета из города отправления:</label>
                            <input type="datetime-local" name="departureTime" required>
                        </div>
                    </div>


                    <div class="row">
                        <label for="tickets">Выберите тип билета:</label>
                        <select id="tickets" name="tickets" required>
                            <option value="" disabled selected>Выберите...</option>
                            <option value="ticketReturnWithout">Возвратный без багажа</option>
                            <option value="ticketReturnWith">Возвратный с багажом</option>
                            <option value="ticketNotReturnWithout">Невозвратный без багажа</option>
                            <option value="ticketNotReturnWith">Невозвратный с багажом</option>
                        </select>
                    </div>
                    
                    <div class="row">
                        <div>
                            <label>Комментарий к рейсу:</label>
                            <textarea name="flightComment" placeholder="Ваш комментарий"></textarea>
                        </div>
                    </div>

                     ${isFullForm ?
            `<div class="row">
                        <div class="checkbox">
                            <label>Требуется ли бронь:</label>
                            <input type="checkbox" id="bookingCheckbox" name="bookingRequired"">
                        </div>
                    </div>
                    <div id="additionalHotelDataContainer"></div>`
            : ""}
            `

}

// Появляющаяся форма при нажати на чекБокс "Требуется ли бронь"?
export const formHotelHTML = `
                    <div class="row" >
                        <div>
                            <label>Название отеля (если требуется):</label>
                            <input type="text" name="hotelName" required>
                        </div>
                    </div>
                    <div class="row">
                        <div>
                            <label>Дата и время заезда в отель:</label>
                            <input type="datetime-local" name="arrivalDateToHotel" required>
                        </div>
                        <div>
                            <label>Дата и время выезда из отеля:</label>
                            <input type="datetime-local" name="departureDateToHotel" required>
                        </div>
                    </div>
                    <div class="row">
                        <div>
                            <label>Комментарий к отелю:</label>
                            <textarea name="hotelComment" placeholder="Ваш комментарий"></textarea>
                        </div>
                    </div>`


// Первоначальная форма
export const citiesContainerHTML = `
                    <div class="row">
                        <img src="./img/INK.png" alt="Логотип" class="logo">
                        <h3 id="title" >Здесь Вы можете заполнить маршруты для командировок</h3>
                    </div>

                    <div id="citiesContainer">
                        <div class="city">${formCityHTML(true)}</div>
                    </div>
                    <div class="row">
                        <button type="button" id="addCityBtn">Следующая точка маршрута</button>
                        <button type="button" id="addLastCityBtn" class="lastBtn">Конечная точка маршрута</button>
                    </div>

`;