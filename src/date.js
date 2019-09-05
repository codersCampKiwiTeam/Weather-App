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
tomorrowNew.textContent = `${tomorrow.getDate()<10?'0'+tomorrow.getDate():tomorrow.getDate()}.${(tomorrow.getMonth()+1)<10?'0'+(tomorrow.getMonth()+1):(tomorrow.getMonth()+1)}.${tomorrow.getFullYear()}`;

//Day after tomorrow
let nextDay = new Date(currentDate);
nextDay.setDate(currentDate.getDate() + 2);
nextDayNew.textContent = `${nextDay.getDate()<10?'0'+nextDay.getDate():nextDay.getDate()}.${(nextDay.getMonth()+1)<10?'0'+(nextDay.getMonth()+1):(nextDay.getMonth()+1)}.${nextDay.getFullYear()}`;

//3 day
let nextDay2 = new Date(currentDate);
nextDay2.setDate(currentDate.getDate() + 3);
nextDay2New.textContent = `${nextDay2.getDate()<10?'0'+nextDay2.getDate():nextDay2.getDate()}.${(nextDay2.getMonth()+1)<10?'0'+(nextDay2.getMonth()+1):(nextDay2.getMonth()+1)}.${nextDay2.getFullYear()}`;