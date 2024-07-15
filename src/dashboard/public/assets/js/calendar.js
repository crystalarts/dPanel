document.addEventListener('DOMContentLoaded', function () {
  const dateDiv = document.getElementById('calendar-date');
  let calendar = null;
  let currentYear = null;
  let currentMonth = null;

  dateDiv.addEventListener('click', function () {
    if (!calendar) {
      const currentDate = new Date();
      currentYear = currentDate.getFullYear();
      currentMonth = currentDate.getMonth();

      calendar = document.createElement('div');
      calendar.id = 'calendar';
      dateDiv.appendChild(calendar);

      renderCalendar(currentYear, currentMonth);
    }
  });

  function renderCalendar(year, month) {
    calendar.innerHTML = '';

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const daysOfWeek = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];

    const headerRow = document.createElement('div');
    headerRow.className = 'calendar-row header';
    daysOfWeek.forEach(day => {
      const cell = document.createElement('div');
      cell.className = 'calendar-cell day-header';
      cell.textContent = day;
      headerRow.appendChild(cell);
    });
    calendar.appendChild(headerRow);

    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

    let date = 1;
    for (let i = 0; i < 6; i++) { 
      const weekRow = document.createElement('div');
      weekRow.className = 'calendar-row';
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayOfMonth) {
          const prevMonthDay = daysInPrevMonth - (firstDayOfMonth - j) + 1;
          const cell = createCalendarCell(prevMonthDay, prevMonth, prevYear, 'prev-month');
          weekRow.appendChild(cell);
        } else if (date > daysInMonth) {
          const nextMonthDay = date - daysInMonth;
          const cell = createCalendarCell(nextMonthDay, nextMonth, nextYear, 'next-month');
          weekRow.appendChild(cell);
          date++;
        } else {
          const cell = createCalendarCell(date, month, year, 'current-month');
          weekRow.appendChild(cell);
          date++;
        }
      }
      calendar.appendChild(weekRow);
    }

    const monthYearWrapper = document.createElement('div');
    monthYearWrapper.className = 'month-year-wrapper';

    const prevMonthButton = document.createElement('button');
    prevMonthButton.innerHTML = '<i class="fas fa-chevron-circle-left"></i>';
    prevMonthButton.className = 'calendar-nav-button';
    prevMonthButton.addEventListener('click', function (event) {
      event.stopPropagation();
      if (month === 0) {
        renderCalendar(year - 1, 11);
      } else {
        renderCalendar(year, month - 1);
      }
    });
    monthYearWrapper.appendChild(prevMonthButton);

    const monthYearLabel = document.createElement('div');
    monthYearLabel.textContent = `${getMonthName(month)} ${year}`;
    monthYearLabel.className = 'month-year-label';
    monthYearWrapper.appendChild(monthYearLabel);

    const nextMonthButton = document.createElement('button');
    nextMonthButton.innerHTML = '<i class="fas fa-chevron-circle-right"></i>';
    nextMonthButton.className = 'calendar-nav-button';
    nextMonthButton.addEventListener('click', function (event) {
      event.stopPropagation();
      if (month === 11) {
        renderCalendar(year + 1, 0);
      } else {
        renderCalendar(year, month + 1);
      }
    });
    monthYearWrapper.appendChild(nextMonthButton);

    calendar.appendChild(monthYearWrapper);
  }

  function createCalendarCell(day, month, year, type) {
    const cell = document.createElement('div');
    cell.className = `calendar-cell ${type}`;
    cell.textContent = day;

    cell.addEventListener('click', function () {
      console.log(`Clicked on ${day}.${month + 1}.${year}`);
    });

    if (type === 'current-month' && day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
      cell.classList.add('today');
    }

    if (type === 'prev-month') {
      cell.classList.add('prev-month');
    } else if (type === 'next-month') {
      cell.classList.add('next-month');
    }

    return cell;
  }

  function getMonthName(month) {
    const months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
    return months[month];
  }

  document.addEventListener('click', function (event) {
    if (calendar && !dateDiv.contains(event.target) && event.target !== dateDiv && !calendar.contains(event.target)) {
      calendar.remove();
      calendar = null;
    }
  });
});
