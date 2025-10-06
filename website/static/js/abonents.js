// Данные
let subjects = [
    {
        id: 1,
        type: 'ЮЛ',
        organization: 'ООО "Компания"',
        foiv: 'Министерство связи',
        country: 'Россия',
        family: 'Иванов',
        name: 'Иван',
        surname: 'Иванович',
        passport: '4510 123456',
        address: 'г. Москва, ул. Ленина, д. 1',
        birthDate: '01.01.1980',
        phone: '+7-495-234-56-78',
        email: 'ivanov@example.com',
        social: '@ivanov',
        regDate: '01.01.2020',
        regEndDate: '01.01.2025'
    }
];

let terminals = [
    {
        id: 1,
        name: 'Терминал-001',
        phone: '+7-495-123-45-67',
        identifier: 'C',
        type: 'ЮЛ',
        status: 'Действующий',
        equipment: 'Стационарный',
        group: 'ID=1 группа основная',
        priority: 'Высокая',
        timeChoice: 'Любой',
        minTime: 300,
        maxTime: 3600,
        regDate: '01.01.2020',
        regEndDate: '01.01.2025'
    }
];

let types = [
    { id: 1, name: 'ЮЛ' },
    { id: 2, name: 'ЧЛ' },
    { id: 3, name: 'Ведомство' }
];

let statuses = [
    { id: 1, name: 'Действующий' },
    { id: 2, name: 'Заблокированный' },
    { id: 3, name: 'Тестовый' }
];

let priorities = [
    { id: 1, name: 'Низкая' },
    { id: 2, name: 'Средняя' },
    { id: 3, name: 'Высокая' }
];

let abonents = [
    { id: 1, label: 'Иванов Иван Иванович (+7 (495) 123-45-67)' },
    { id: 2, label: 'Петров Петр Петрович (+7 (495) 234-56-78)' },
    { id: 3, label: 'Сидоров Сидор Сидорович (+7 (495) 345-67-89)' }
];

let currentEditIndex = -1;
let currentEditType = '';

// Модальное окно
const modal = document.getElementById('myModal');
const closeBtn = document.querySelector('.close');

closeBtn.onclick = function() {
    modal.style.display = 'none';
};

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

// Поиск абонента
const searchInput = document.getElementById('abonent-search');
const searchResults = document.getElementById('search-results');

searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    if (query.length === 0) {
        searchResults.classList.add('hidden');
        return;
    }
    
    const filtered = abonents.filter(a => a.label.toLowerCase().includes(query));
    
    if (filtered.length === 0) {
        searchResults.classList.add('hidden');
        return;
    }
    
    searchResults.innerHTML = filtered.map(a => 
        `<div class="container__nav__el" onclick="selectAbonent('${a.label}')" style="padding: 10px; cursor: pointer;">${a.label}</div>`
    ).join('');
    searchResults.classList.remove('hidden');
});

function selectAbonent(label) {
    searchInput.value = label;
    searchResults.classList.add('hidden');
}

// Субъекты
function editSubject(index) {
    currentEditIndex = index;
    currentEditType = 'subject';
    const subject = subjects[index];
    
    document.getElementById('modal-title').textContent = 'Редактировать субъект';
    document.getElementById('modal-fields').innerHTML = `
        <div class="data-column">
            <label class="csus">Тип абонента:</label>
            <select id="field-type" style="flex: 1; padding: 7px; border-radius: 6px; border-width: 1px; font-size: calc(0.9rem); font-weight: bold; font-family: Arial, sans-serif;">
                ${types.map(t => `<option value="${t.name}" ${t.name === subject.type ? 'selected' : ''}>${t.name}</option>`).join('')}
            </select>
        </div>
        <div class="data-column">
            <label class="csus">Организация:</label>
            <input type="text" id="field-organization" value="${subject.organization}" style="flex: 1; padding: 7px; border-radius: 6px; border-width: 1px; font-size: calc(0.9rem); font-weight: bold; font-family: Arial, sans-serif;">
        </div>
        <div class="data-column">
            <label class="csus">ФОИВ:</label>
            <input type="text" id="field-foiv" value="${subject.foiv}" style="flex: 1; padding: 7px; border-radius: 6px; border-width: 1px; font-size: calc(0.9rem); font-weight: bold; font-family: Arial, sans-serif;">
        </div>
        <div class="data-column">
            <label class="csus">Страна:</label>
            <input type="text" id="field-country" value="${subject.country}" style="flex: 1; padding: 7px; border-radius: 6px; border-width: 1px; font-size: calc(0.9rem); font-weight: bold; font-family: Arial, sans-serif;">
        </div>
        <div class="data-column">
            <label class="csus">Фамилия:</label>
            <input type="text" id="field-family" value="${subject.family}" style="flex: 1; padding: 7px; border-radius: 6px; border-width: 1px; font-size: calc(0.9rem); font-weight: bold; font-family: Arial, sans-serif;">
        </div>
        <div class="data-column">
            <label class="csus">Имя:</label>
            <input type="text" id="field-name" value="${subject.name}" style="flex: 1; padding: 7px; border-radius: 6px; border-width: 1px; font-size: calc(0.9rem); font-weight: bold; font-family: Arial, sans-serif;">
        </div>
        <div class="data-column">
            <label class="csus">Отчество:</label>
            <input type="text" id="field-surname" value="${subject.surname}" style="flex: 1; padding: 7px; border-radius: 6px; border-width: 1px; font-size: calc(0.9rem); font-weight: bold; font-family: Arial, sans-serif;">
        </div>
        <div class="data-column">
            <label class="csus">Паспорт:</label>
            <input type="text" id="field-passport" value="${subject.passport}" style="flex: 1; padding: 7px; border-radius: 6px; border-width: 1px; font-size: calc(0.9rem); font-weight: bold; font-family: Arial, sans-serif;">
        </div>
        <div class="data-column">
            <label class="csus">Адрес:</label>
            <input type="text" id="field-address" value="${subject.address}" style="flex: 1; padding: 7px; border-radius: 6px; border-width: 1px; font-size: calc(0.9rem); font-weight: bold; font-family: Arial, sans-serif;">
        </div>
        <div class="data-column">
            <label class="csus">Дата рождения:</label>
            <input type="text" id="field-birthDate" value="${subject.birthDate}" style="flex: 1; padding: 7px; border-radius: 6px; border-width: 1px; font-size: calc(0.9rem); font-weight: bold; font-family: Arial, sans-serif;">
        </div>
        <div class="data-column">
            <label class="csus">Телефон доп.:</label>
            <input type="text" id="field-phone" value="${subject.phone}" style="flex: 1; padding: 7px; border-radius: 6px; border-width: 1px; font-size: calc(0.9rem); font-weight: bold; font-family: Arial, sans-serif;">
        </div>
        <div class="data-column">
            <label class="csus">Email:</label>
            <input type="text" id="field-email" value="${subject.email}" style="flex: 1; padding: 7px; border-radius: 6px; border-width: 1px; font-size: calc(0.9rem); font-weight: bold; font-family: Arial, sans-serif;">
        </div>
        <div class="data-column">
            <label class="csus">Соц. сети:</label>
            <input type="text" id="field-social" value="${subject.social}" style="flex: 1; padding: 7px; border-radius: 6px; border-width: 1px; font-size: calc(0.9rem); font-weight: bold; font-family: Arial, sans-serif;">
        </div>
        <div class="data-column">
            <label class="csus">Дата регистрации:</label>
            <input type="text" id="field-regDate" value="${subject.regDate}" style="flex: 1; padding: 7px; border-radius: 6px; border-width: 1px; font-size: calc(0.9rem); font-weight: bold; font-family: Arial, sans-serif;">
        </div>
        <div class="data-column">
            <label class="csus">Дата окончания рег.:</label>
            <input type="text" id="field-regEndDate" value="${subject.regEndDate}" style="flex: 1; padding: 7px; border-radius: 6px; border-width: 1px; font-size: calc(0.9rem); font-weight: bold; font-family: Arial, sans-serif;">
        </div>
    `;
    modal.style.display = 'block';
}

function deleteSubject(index) {
    if (confirm('Удалить запись?')) {
        subjects.splice(index, 1);
        renderSubjects();
    }
}

function renderSubjects() {
    const tbody = document.getElementById('subjects-tbody');
    tbody.innerHTML = subjects.map((s, i) => `
        <tr>
            <td>${s.id}</td>
            <td>${s.type}</td>
            <td>${s.organization}</td>
            <td>${s.foiv}</td>
            <td>${s.country}</td>
            <td>${s.family}</td>
            <td>${s.name}</td>
            <td>${s.surname}</td>
            <td>${s.passport}</td>
            <td>${s.address}</td>
            <td>${s.birthDate}</td>
            <td>${s.phone}</td>
            <td>${s.email}</td>
            <td>${s.social}</td>
            <td>${s.regDate}</td>
            <td>${s.regEndDate}</td>
            <td>
                <button class="edit" onclick="editSubject(${i})">Редактировать</button>
                <button class="delete" onclick="deleteSubject(${i})">Удалить</button>
            </td>
        </tr>
    `).join('');
}

// Терминалы
function editTerminal(index) {
    currentEditIndex = index;
    currentEditType = 'terminal';
    const terminal = terminals[index];
    
    document.getElementById('modal-title').textContent = 'Редактировать терминал';
    document.getElementById('modal-fields').innerHTML = `
        <div class="data-column">
            <label class="csus">Наименование:</label>
            <input type="text" id="field-name" value="${terminal.name}" style="flex: 1; padding: 7px; border-radius: 6px; border-width: 1px; font-size: calc(0.9rem); font-weight: bold; font-family: Arial, sans-serif;">
        </div>
        <div class="data-column">
            <label class="csus">Телефон:</label>
            <input type="text" id="field-phone" value="${terminal.phone}" style="flex: 1; padding: 7px; border-radius: 6px; border-width: 1px; font-size: calc(0.9rem); font-weight: bold; font-family: Arial, sans-serif;">
        </div>
        <div class="data-column">
            <label class="csus">Идентификатор:</label>
            <input type="text" id="field-identifier" value="${terminal.identifier}" style="flex: 1; padding: 7px; border-radius: 6px; border-width: 1px; font-size: calc(0.9rem); font-weight: bold; font-family: Arial, sans-serif;">
        </div>
        <div class="data-column">
            <label class="csus">Тип абонента:</label>
            <select id="field-type" style="flex: 1; padding: 7px; border-radius: 6px; border-width: 1px; font-size: calc(0.9rem); font-weight: bold; font-family: Arial, sans-serif;">
                ${types.map(t => `<option value="${t.name}" ${t.name === terminal.type ? 'selected' : ''}>${t.name}</option>`).join('')}
            </select>
        </div>
        <div class="data-column">
            <label class="csus">Статус:</label>
            <select id="field-status" style="flex: 1; padding: 7px; border-radius: 6px; border-width: 1px; font-size: calc(0.9rem); font-weight: bold; font-family: Arial, sans-serif;">
                ${statuses.map(s => `<option value="${s.name}" ${s.name === terminal.status ? 'selected' : ''}>${s.name}</option>`).join('')}
            </select>
        </div>
        <div class="data-column">
            <label class="csus">Вид оборудования:</label>
            <input type="text" id="field-equipment" value="${terminal.equipment}" style="flex: 1; padding: 7px; border-radius: 6px; border-width: 1px; font-size: calc(0.9rem); font-weight: bold; font-family: Arial, sans-serif;">
        </div>
        <div class="data-column">
            <label class="csus">Группа абонента:</label>
            <input type="text" id="field-group" value="${terminal.group}" style="flex: 1; padding: 7px; border-radius: 6px; border-width: 1px; font-size: calc(0.9rem); font-weight: bold; font-family: Arial, sans-serif;">
        </div>
        <div class="data-column">
            <label class="csus">Важность:</label>
            <select id="field-priority" style="flex: 1; padding: 7px; border-radius: 6px; border-width: 1px; font-size: calc(0.9rem); font-weight: bold; font-family: Arial, sans-serif;">
                ${priorities.map(p => `<option value="${p.name}" ${p.name === terminal.priority ? 'selected' : ''}>${p.name}</option>`).join('')}
            </select>
        </div>
        <div class="data-column">
            <label class="csus">Выбор времени сеанса:</label>
            <input type="text" id="field-timeChoice" value="${terminal.timeChoice}" style="flex: 1; padding: 7px; border-radius: 6px; border-width: 1px; font-size: calc(0.9rem); font-weight: bold; font-family: Arial, sans-serif;">
        </div>
        <div class="data-column">
            <label class="csus">Мин. время сеанса:</label>
            <input type="number" id="field-minTime" value="${terminal.minTime}" style="flex: 1; padding: 7px; border-radius: 6px; border-width: 1px; font-size: calc(0.9rem); font-weight: bold; font-family: Arial, sans-serif;">
        </div>
        <div class="data-column">
            <label class="csus">Макс. время сеанса:</label>
            <input type="number" id="field-maxTime" value="${terminal.maxTime}" style="flex: 1; padding: 7px; border-radius: 6px; border-width: 1px; font-size: calc(0.9rem); font-weight: bold; font-family: Arial, sans-serif;">
        </div>
        <div class="data-column">
            <label class="csus">Дата регистрации:</label>
            <input type="text" id="field-regDate" value="${terminal.regDate}" style="flex: 1; padding: 7px; border-radius: 6px; border-width: 1px; font-size: calc(0.9rem); font-weight: bold; font-family: Arial, sans-serif;">
        </div>
        <div class="data-column">
            <label class="csus">Дата окончания рег.:</label>
            <input type="text" id="field-regEndDate" value="${terminal.regEndDate}" style="flex: 1; padding: 7px; border-radius: 6px; border-width: 1px; font-size: calc(0.9rem); font-weight: bold; font-family: Arial, sans-serif;">
        </div>
    `;
    modal.style.display = 'block';
}

function deleteTerminal(index) {
    if (confirm('Удалить запись?')) {
        terminals.splice(index, 1);
        renderTerminals();
    }
}

function renderTerminals() {
    const tbody = document.getElementById('terminals-tbody');
    tbody.innerHTML = terminals.map((t, i) => `
        <tr>
            <td>${t.id}</td>
            <td>${t.name}</td>
            <td>${t.phone}</td>
            <td>${t.identifier}</td>
            <td>${t.type}</td>
            <td>${t.status}</td>
            <td>${t.equipment}</td>
            <td>${t.group}</td>
            <td>${t.priority}</td>
            <td>${t.timeChoice}</td>
            <td>${t.minTime}</td>
            <td>${t.maxTime}</td>
            <td>${t.regDate}</td>
            <td>${t.regEndDate}</td>
            <td>
                <button class="edit" onclick="editTerminal(${i})">Редактировать</button>
                <button class="delete" onclick="deleteTerminal(${i})">Удалить</button>
            </td>
        </tr>
    `).join('');
}

// Справочники
function editType(index) {
    const newName = prompt('Введите новое название:', types[index].name);
    if (newName) {
        types[index].name = newName;
        renderTypes();
    }
}

function deleteType(index) {
    if (confirm('Удалить тип?')) {
        types.splice(index, 1);
        renderTypes();
    }
}

function renderTypes() {
    const tbody = document.getElementById('types-tbody');
    tbody.innerHTML = types.map((t, i) => `
        <tr>
            <td>${t.id}</td>
            <td>${t.name}</td>
            <td>
                <button class="edit" onclick="editType(${i})">Редактировать</button>
                <button class="delete" onclick="deleteType(${i})">Удалить</button>
            </td>
        </tr>
    `).join('');
}

function editStatus(index) {
    const newName = prompt('Введите новое название:', statuses[index].name);
    if (newName) {
        statuses[index].name = newName;
        renderStatuses();
    }
}

function deleteStatus(index) {
    if (confirm('Удалить статус?')) {
        statuses.splice(index, 1);
        renderStatuses();
    }
}

function renderStatuses() {
    const tbody = document.getElementById('statuses-tbody');
    tbody.innerHTML = statuses.map((s, i) => `
        <tr>
            <td>${s.id}</td>
            <td>${s.name}</td>
            <td>
                <button class="edit" onclick="editStatus(${i})">Редактировать</button>
                <button class="delete" onclick="deleteStatus(${i})">Удалить</button>
            </td>
        </tr>
    `).join('');
}

function editPriority(index) {
    const newName = prompt('Введите новое название:', priorities[index].name);
    if (newName) {
        priorities[index].name = newName;
        renderPriorities();
    }
}

function deletePriority(index) {
    if (confirm('Удалить важность?')) {
        priorities.splice(index, 1);
        renderPriorities();
    }
}

function renderPriorities() {
    const tbody = document.getElementById('priorities-tbody');
    tbody.innerHTML = priorities.map((p, i) => `
        <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>
                <button class="edit" onclick="editPriority(${i})">Редактировать</button>
                <button class="delete" onclick="deletePriority(${i})">Удалить</button>
            </td>
        </tr>
    `).join('');
}

// Сохранение модального окна
function saveModal() {
    if (currentEditType === 'subject') {
        subjects[currentEditIndex] = {
            id: subjects[currentEditIndex].id,
            type: document.getElementById('field-type').value,
            organization: document.getElementById('field-organization').value,
            foiv: document.getElementById('field-foiv').value,
            country: document.getElementById('field-country').value,
            family: document.getElementById('field-family').value,
            name: document.getElementById('field-name').value,
            surname: document.getElementById('field-surname').value,
            passport: document.getElementById('field-passport').value,
            address: document.getElementById('field-address').value,
            birthDate: document.getElementById('field-birthDate').value,
            phone: document.getElementById('field-phone').value,
            email: document.getElementById('field-email').value,
            social: document.getElementById('field-social').value,
            regDate: document.getElementById('field-regDate').value,
            regEndDate: document.getElementById('field-regEndDate').value
        };
        renderSubjects();
    } else if (currentEditType === 'terminal') {
        terminals[currentEditIndex] = {
            id: terminals[currentEditIndex].id,
            name: document.getElementById('field-name').value,
            phone: document.getElementById('field-phone').value,
            identifier: document.getElementById('field-identifier').value,
            type: document.getElementById('field-type').value,
            status: document.getElementById('field-status').value,
            equipment: document.getElementById('field-equipment').value,
            group: document.getElementById('field-group').value,
            priority: document.getElementById('field-priority').value,
            timeChoice: document.getElementById('field-timeChoice').value,
            minTime: document.getElementById('field-minTime').value,
            maxTime: document.getElementById('field-maxTime').value,
            regDate: document.getElementById('field-regDate').value,
            regEndDate: document.getElementById('field-regEndDate').value
        };
        renderTerminals();
    }
    
    modal.style.display = 'none';
}

// Обработчики кнопок добавления
document.querySelector('[data-testid="button-add-subject"]').addEventListener('click', function() {
    alert('Функция добавления субъекта в разработке');
});

document.querySelector('[data-testid="button-add-terminal"]').addEventListener('click', function() {
    alert('Функция добавления терминала в разработке');
});

document.querySelector('[data-testid="button-add-type"]').addEventListener('click', function() {
    const newName = prompt('Введите название нового типа:');
    if (newName) {
        const newId = Math.max(...types.map(t => t.id)) + 1;
        types.push({ id: newId, name: newName });
        renderTypes();
    }
});

document.querySelector('[data-testid="button-add-status"]').addEventListener('click', function() {
    const newName = prompt('Введите название нового статуса:');
    if (newName) {
        const newId = Math.max(...statuses.map(s => s.id)) + 1;
        statuses.push({ id: newId, name: newName });
        renderStatuses();
    }
});

document.querySelector('[data-testid="button-add-priority"]').addEventListener('click', function() {
    const newName = prompt('Введите название новой важности:');
    if (newName) {
        const newId = Math.max(...priorities.map(p => p.id)) + 1;
        priorities.push({ id: newId, name: newName });
        renderPriorities();
    }
});