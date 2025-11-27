// Configuração do evento:
const EVENT = {
  title: "Formatura - Terceirão",
  description: "Você está convidado(a) para a formatura do terceiro ano. Contamos com sua presença! 🎓",
  location: "",
  startDate: "2025-12-13",
  endDate: "2025-12-14" // all-day
};

// Monta o calendário
(function renderCalendar(){
  const grid = document.getElementById('daysGrid');
  const year = 2025, month = 11;
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  for (let i=0; i<startWeekday; i++){
    const el = document.createElement('div');
    el.className = 'day muted';
    grid.appendChild(el);
  }

  for (let d=1; d<=daysInMonth; d++){
    const el = document.createElement('div');
    el.className = 'day';
    el.setAttribute('role','button');
    el.setAttribute('tabindex','0');
    el.textContent = d;

    if (d === 13) {
      el.classList.add('target');
      const dot = document.createElement('span');
      dot.className = 'dot';
      el.appendChild(dot);
    }

    el.addEventListener('click', () => onDateClick(d));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') onDateClick(d);
    });

    grid.appendChild(el);
  }
})();

// UID simples
function makeUID(){
  return 'uid-' + Date.now() + '-' + Math.floor(Math.random()*100000);
}

// Gera .ics
function generateICS(e){
  const dtStart = e.startDate.replace(/-/g,'');
  const dtEnd = e.endDate.replace(/-/g,'');
  const now = new Date();
  const dtStamp = now.toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z';
  const uid = makeUID() + '@formatura';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FormaturaApp//PT-BR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;VALUE=DATE:${dtStart}`,
    `DTEND;VALUE=DATE:${dtEnd}`,
    `SUMMARY:${escapeText(e.title)}`,
    `DESCRIPTION:${escapeText(e.description)}`,
    e.location ? `LOCATION:${escapeText(e.location)}` : '',
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(Boolean).join('\r\n');
}

function escapeText(t){
  return (t || '').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
}

function downloadICSFile(content, filename='formatura.ics'){
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 1000);
}

// Click no dia
function onDateClick(day){
  const ics = generateICS(EVENT);
  downloadICSFile(ics, 'formatura-terceirao-13-12-2025.ics');
}

// Botão .ics
document.getElementById('downloadIcs').addEventListener('click', () => onDateClick(13));

// Google Calendar
(function prepareGoogleLink(){
  const start = EVENT.startDate.replace(/-/g,'');
  const end = EVENT.endDate.replace(/-/g,'');
  const base = 'https://www.google.com/calendar/render?action=TEMPLATE';
  const params = new URLSearchParams({
    text: EVENT.title,
    dates: `${start}/${end}`,
    details: EVENT.description,
    location: EVENT.location || '',
    sprop: '',
    spropname: ''
  });
  document.getElementById('googleLink').href = base + '&' + params.toString();
})();
