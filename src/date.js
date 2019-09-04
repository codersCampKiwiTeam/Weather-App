let dayOfWeek = document.querySelector('.dayOfTheWeek');
let tomorrowNew = document.querySelectorAll('.date')[0];
let nextDayNew = document.querySelectorAll('.date')[1];
let nextDay2New = document.querySelectorAll('.date')[2];

// Day of week
let currentDate = new Date();
let today = currentDate.getDay();
let dayList = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
dayOfWeek.textContent = dayList[today];

//Tomorrow
let tomorrow = new Date(currentDate);
tomorrow.setDate(currentDate.getDate() + 1);
tomorrowNew.textContent = `${tomorrow.getDay()<10?'0'+tomorrow.getDay():tomorrow.getDay()}.${tomorrow.getMonth()<10?'0'+tomorrow.getMonth():tomorrow.getMonth()}.${tomorrow.getFullYear()}`;

//Day after tomorrow
let nextDay = new Date(currentDate);
nextDay.setDate(currentDate.getDate() + 2);
nextDayNew.textContent = `${nextDay.getDay()<10?'0'+nextDay.getDay():nextDay.getDay()}.${nextDay.getMonth()<10?'0'+nextDay.getMonth():nextDay.getMonth()}.${nextDay.getFullYear()}`;

//3 day
let nextDay2 = new Date(currentDate);
nextDay2.setDate(currentDate.getDate() + 3);
nextDay2New.textContent = `${nextDay2.getDay()<10?'0'+nextDay2.getDay():nextDay2.getDay()}.${nextDay2.getMonth()<10?'0'+nextDay2.getMonth():nextDay2.getMonth()}.${nextDay2.getFullYear()}`;