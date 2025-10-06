import { editRow, deleteRow, insertRow, getRowsTable } from './db.js';
import { Modal } from "./Modal.js";
import { Loader } from "./Loader.js";

export function completionAbonents(url) {
    let subjects = [];
    let terminals = [];
    let types = [];
    let statuses = [];
    let priorities = [];
    let abonents = [];

    const subjectsTableName = 'subjects';
    const terminalsTableName = 'terminals';
    const typesTableName = 'abonent_types';
    const statusesTableName = 'abonent_statuses';
    const prioritiesTableName = 'abonent_priorities';

    const loader = new Loader('.loader-container');

    function loadData() {
        loader.show('Загрузка данных...');
        
        Promise.all([
            getRowsTable(subjectsTableName),
            getRowsTable(terminalsTableName),
            getRowsTable(typesTableName),
            getRowsTable(statusesTableName),
            getRowsTable(prioritiesTableName)
        ]).then(([subjectsData, terminalsData, typesData, statusesData, prioritiesData]) => {
            if (subjectsData && subjectsData.rows) {
                subjects = subjectsData.rows;
                renderSubjects();
                updateAbonentsList();
            }
            if (terminalsData && terminalsData.rows) {
                terminals = terminalsData.rows;
                renderTerminals();
            }
            if (typesData && typesData.rows) {
                types = typesData.rows;
                renderTypes();
            }
            if (statusesData && statusesData.rows) {
                statuses = statusesData.rows;
                renderStatuses();
            }
            if (prioritiesData && prioritiesData.rows) {
                priorities = prioritiesData.rows;
                renderPriorities();
            }
            loader.close();
        }).catch(error => {
            console.error('Ошибка загрузки данных:', error);
            loader.close();
        });
    }

    function updateAbonentsList() {
        abonents = subjects.map(s => ({
            id: s.id,
            label: `${s.family || ''} ${s.name || ''} ${s.surname || ''} (${s.phone || ''})`.trim()
        }));
    }

    function showAllAbonents() {
        const searchResults = document.getElementById('search-results');
        if (!searchResults) return;

        if (abonents.length === 0) {
            searchResults.classList.add('hidden');
            return;
        }

        searchResults.innerHTML = abonents.map(a =>
            `<div class="container__nav__el" data-abonent-id="${a.id}" style="padding: 10px; cursor: pointer;">${a.label}</div>`
        ).join('');

        searchResults.querySelectorAll('.container__nav__el').forEach(el => {
            el.addEventListener('click', function() {
                const searchInput = document.getElementById('abonent-search');
                if (searchInput) {
                    searchInput.value = this.textContent;
                }
                searchResults.classList.add('hidden');
            });
        });

        searchResults.classList.remove('hidden');
    }

    const searchInput = document.getElementById('abonent-search');
    const searchResults = document.getElementById('search-results');

    if (searchInput) {
        searchInput.addEventListener('focus', function() {
            showAllAbonents();
        });

        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            
            if (query.length === 0) {
                showAllAbonents();
                return;
            }

            const filtered = abonents.filter(a => a.label.toLowerCase().includes(query));

            if (filtered.length === 0) {
                searchResults.classList.add('hidden');
                return;
            }

            searchResults.innerHTML = filtered.map(a =>
                `<div class="container__nav__el" data-abonent-id="${a.id}" style="padding: 10px; cursor: pointer;">${a.label}</div>`
            ).join('');

            searchResults.querySelectorAll('.container__nav__el').forEach(el => {
                el.addEventListener('click', function() {
                    searchInput.value = this.textContent;
                    searchResults.classList.add('hidden');
                });
            });

            searchResults.classList.remove('hidden');
        });

        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.add('hidden');
            }
        });
    }

    function renderSubjects() {
        const tbody = document.getElementById('subjects-tbody');
        if (!tbody) return;

        tbody.innerHTML = subjects.map((s, i) => `
            <tr>
                <td>${s.id || ''}</td>
                <td>${s.type || ''}</td>
                <td>${s.organization || ''}</td>
                <td>${s.foiv || ''}</td>
                <td>${s.country || ''}</td>
                <td>${s.family || ''}</td>
                <td>${s.name || ''}</td>
                <td>${s.surname || ''}</td>
                <td>${s.passport || ''}</td>
                <td>${s.address || ''}</td>
                <td>${s.birth_date || ''}</td>
                <td>${s.phone || ''}</td>
                <td>${s.email || ''}</td>
                <td>${s.social || ''}</td>
                <td>${s.reg_date || ''}</td>
                <td>${s.reg_end_date || ''}</td>
                <td>
                    <button class="edit" style="font-size: 14px" data-index="${i}" data-type="subject" title="Редактировать">Редактировать</button>
                    <button class="delete" style="font-size: 14px" data-index="${i}" data-type="subject" title="Удалить">Удалить</button>
                </td>
            </tr>
        `).join('');

        tbody.querySelectorAll('.edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                const type = this.dataset.type;
                if (type === 'subject') editSubject(index);
            });
        });

        tbody.querySelectorAll('.delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                const type = this.dataset.type;
                if (type === 'subject') deleteSubject(index);
            });
        });
    }

    function renderTerminals() {
        const tbody = document.getElementById('terminals-tbody');
        if (!tbody) return;

        tbody.innerHTML = terminals.map((t, i) => `
            <tr>
                <td>${t.id || ''}</td>
                <td>${t.name || ''}</td>
                <td>${t.phone || ''}</td>
                <td>${t.identifier || ''}</td>
                <td>${t.type || ''}</td>
                <td>${t.status || ''}</td>
                <td>${t.equipment || ''}</td>
                <td>${t.group || ''}</td>
                <td>${t.priority || ''}</td>
                <td>${t.time_choice || ''}</td>
                <td>${t.min_time || ''}</td>
                <td>${t.max_time || ''}</td>
                <td>${t.reg_date || ''}</td>
                <td>${t.reg_end_date || ''}</td>
                <td>
                    <button class="edit" style="font-size: 14px" data-index="${i}" data-type="terminal" title="Редактировать">Редактировать</button>
                    <button class="delete" style="font-size: 14px" data-index="${i}" data-type="terminal" title="Удалить">Удалить</button>
                </td>
            </tr>
        `).join('');

        tbody.querySelectorAll('.edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                const type = this.dataset.type;
                if (type === 'terminal') editTerminal(index);
            });
        });

        tbody.querySelectorAll('.delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                const type = this.dataset.type;
                if (type === 'terminal') deleteTerminal(index);
            });
        });
    }

    function renderTypes() {
        const tbody = document.querySelector('#types-table tbody');
        if (!tbody) return;

        tbody.innerHTML = types.map((t, i) => `
            <tr>
                <td>${t.id || ''}</td>
                <td>${t.name || ''}</td>
                <td>
                    <button class="edit" style="font-size: 14px" data-index="${i}" data-type="type">Редактировать</button>
                    <button class="delete" style="font-size: 14px" data-index="${i}" data-type="type">Удалить</button>
                </td>
            </tr>
        `).join('');

        tbody.querySelectorAll('.edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                editType(index);
            });
        });

        tbody.querySelectorAll('.delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                deleteType(index);
            });
        });
    }

    function renderStatuses() {
        const tbody = document.querySelector('#statuses-table tbody');
        if (!tbody) return;

        tbody.innerHTML = statuses.map((s, i) => `
            <tr>
                <td>${s.id || ''}</td>
                <td>${s.name || ''}</td>
                <td>
                    <button class="edit" style="font-size: 14px" data-index="${i}" data-type="status">Редактировать</button>
                    <button class="delete" style="font-size: 14px" data-index="${i}" data-type="status">Удалить</button>
                </td>
            </tr>
        `).join('');

        tbody.querySelectorAll('.edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                editStatus(index);
            });
        });

        tbody.querySelectorAll('.delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                deleteStatus(index);
            });
        });
    }

    function renderPriorities() {
        const tbody = document.querySelector('#priorities-table tbody');
        if (!tbody) return;

        tbody.innerHTML = priorities.map((p, i) => `
            <tr>
                <td>${p.id || ''}</td>
                <td>${p.name || ''}</td>
                <td>
                    <button class="edit" style="font-size: 14px" data-index="${i}" data-type="priority">Редактировать</button>
                    <button class="delete" style="font-size: 14px" data-index="${i}" data-type="priority">Удалить</button>
                </td>
            </tr>
        `).join('');

        tbody.querySelectorAll('.edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                editPriority(index);
            });
        });

        tbody.querySelectorAll('.delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                deletePriority(index);
            });
        });
    }

    function editSubject(index) {
        const subject = subjects[index];
        const subjectRow = document.querySelector('#subjects-tbody').children[index];

        const tableInfo = {
            name: subjectsTableName,
            columns_info: [
                { name: 'id', description: 'ID' },
                { name: 'type', description: 'Тип абонента' },
                { name: 'organization', description: 'Организация' },
                { name: 'foiv', description: 'ФОИВ' },
                { name: 'country', description: 'Страна' },
                { name: 'family', description: 'Фамилия' },
                { name: 'name', description: 'Имя' },
                { name: 'surname', description: 'Отчество' },
                { name: 'passport', description: 'Паспорт' },
                { name: 'address', description: 'Адрес' },
                { name: 'birth_date', description: 'Дата рождения' },
                { name: 'phone', description: 'Телефон доп.' },
                { name: 'email', description: 'Email' },
                { name: 'social', description: 'Соц. сети' },
                { name: 'reg_date', description: 'Дата регистрации' },
                { name: 'reg_end_date', description: 'Дата окончания рег.' }
            ]
        };

        const modal = new Modal(
            document.querySelector('.column2_vi'),
            'edit',
            tableInfo.columns_info.length,
            tableInfo.columns_info,
            subjectRow,
            editRow,
            tableInfo,
            'Субъект абонентского терминала',
            subjectsTableName
        );

        modal.createModal(loadData);
    }

    function deleteSubject(index) {
        if (!confirm('Удалить запись?')) return;

        const subject = subjects[index];
        const data = {
            where: { column: 'id', operator: '=', value: subject.id }
        };

        loader.show('Удаление...');
        deleteRow(data, subjectsTableName).then(() => {
            loadData();
        }).catch(error => {
            console.error('Ошибка удаления:', error);
            alert('Ошибка при удалении записи');
            loader.close();
        });
    }

    function editTerminal(index) {
        const terminal = terminals[index];
        const terminalRow = document.querySelector('#terminals-tbody').children[index];

        const tableInfo = {
            name: terminalsTableName,
            columns_info: [
                { name: 'id', description: 'ID' },
                { name: 'name', description: 'Наименование' },
                { name: 'phone', description: 'Телефон' },
                { name: 'identifier', description: 'Идентификатор' },
                { name: 'type', description: 'Тип абонента' },
                { name: 'status', description: 'Статус' },
                { name: 'equipment', description: 'Вид оборудования' },
                { name: 'group', description: 'Группа абонента' },
                { name: 'priority', description: 'Важность' },
                { name: 'time_choice', description: 'Выбор времени сеанса' },
                { name: 'min_time', description: 'Мин. время сеанса' },
                { name: 'max_time', description: 'Макс. время сеанса' },
                { name: 'reg_date', description: 'Дата регистрации' },
                { name: 'reg_end_date', description: 'Дата окончания рег.' }
            ]
        };

        const modal = new Modal(
            document.querySelector('.column2_vi'),
            'edit',
            tableInfo.columns_info.length,
            tableInfo.columns_info,
            terminalRow,
            editRow,
            tableInfo,
            'Абонентский терминал',
            terminalsTableName
        );

        modal.createModal(loadData);
    }

    function deleteTerminal(index) {
        if (!confirm('Удалить запись?')) return;

        const terminal = terminals[index];
        const data = {
            where: { column: 'id', operator: '=', value: terminal.id }
        };

        loader.show('Удаление...');
        deleteRow(data, terminalsTableName).then(() => {
            loadData();
        }).catch(error => {
            console.error('Ошибка удаления:', error);
            alert('Ошибка при удалении записи');
            loader.close();
        });
    }

    function editType(index) {
        const type = types[index];
        const typeRow = document.querySelector('#types-table tbody').children[index];

        const tableInfo = {
            name: typesTableName,
            columns_info: [
                { name: 'id', description: 'ID' },
                { name: 'name', description: 'Наименование' }
            ]
        };

        const modal = new Modal(
            document.querySelector('.column2_vi'),
            'edit',
            tableInfo.columns_info.length,
            tableInfo.columns_info,
            typeRow,
            editRow,
            tableInfo,
            'Тип абонента',
            typesTableName
        );

        modal.createModal(loadData);
    }

    function deleteType(index) {
        if (!confirm('Удалить тип?')) return;

        const type = types[index];
        const data = {
            where: { column: 'id', operator: '=', value: type.id }
        };

        loader.show('Удаление...');
        deleteRow(data, typesTableName).then(() => {
            loadData();
        }).catch(error => {
            console.error('Ошибка удаления:', error);
            alert('Ошибка при удалении записи');
            loader.close();
        });
    }

    function editStatus(index) {
        const status = statuses[index];
        const statusRow = document.querySelector('#statuses-table tbody').children[index];

        const tableInfo = {
            name: statusesTableName,
            columns_info: [
                { name: 'id', description: 'ID' },
                { name: 'name', description: 'Наименование' }
            ]
        };

        const modal = new Modal(
            document.querySelector('.column2_vi'),
            'edit',
            tableInfo.columns_info.length,
            tableInfo.columns_info,
            statusRow,
            editRow,
            tableInfo,
            'Статус абонента',
            statusesTableName
        );

        modal.createModal(loadData);
    }

    function deleteStatus(index) {
        if (!confirm('Удалить статус?')) return;

        const status = statuses[index];
        const data = {
            where: { column: 'id', operator: '=', value: status.id }
        };

        loader.show('Удаление...');
        deleteRow(data, statusesTableName).then(() => {
            loadData();
        }).catch(error => {
            console.error('Ошибка удаления:', error);
            alert('Ошибка при удалении записи');
            loader.close();
        });
    }

    function editPriority(index) {
        const priority = priorities[index];
        const priorityRow = document.querySelector('#priorities-table tbody').children[index];

        const tableInfo = {
            name: prioritiesTableName,
            columns_info: [
                { name: 'id', description: 'ID' },
                { name: 'name', description: 'Наименование' }
            ]
        };

        const modal = new Modal(
            document.querySelector('.column2_vi'),
            'edit',
            tableInfo.columns_info.length,
            tableInfo.columns_info,
            priorityRow,
            editRow,
            tableInfo,
            'Важность',
            prioritiesTableName
        );

        modal.createModal(loadData);
    }

    function deletePriority(index) {
        if (!confirm('Удалить важность?')) return;

        const priority = priorities[index];
        const data = {
            where: { column: 'id', operator: '=', value: priority.id }
        };

        loader.show('Удаление...');
        deleteRow(data, prioritiesTableName).then(() => {
            loadData();
        }).catch(error => {
            console.error('Ошибка удаления:', error);
            alert('Ошибка при удалении записи');
            loader.close();
        });
    }

    const editSubjectBtn = document.querySelector('[data-testid="button-edit-subject"]');
    if (editSubjectBtn) {
        editSubjectBtn.addEventListener('click', function() {
            if (subjects.length > 0) {
                editSubject(0);
            } else {
                alert('Нет данных для редактирования');
            }
        });
    }

    const addTerminalBtn = document.querySelector('[data-testid="button-add-terminal"]');
    if (addTerminalBtn) {
        addTerminalBtn.addEventListener('click', function() {
            const newRow = document.createElement('tr');
            newRow.innerHTML = '<td></td>'.repeat(15);

            const tableInfo = {
                name: terminalsTableName,
                columns_info: [
                    { name: 'id', description: 'ID' },
                    { name: 'name', description: 'Наименование' },
                    { name: 'phone', description: 'Телефон' },
                    { name: 'identifier', description: 'Идентификатор' },
                    { name: 'type', description: 'Тип абонента' },
                    { name: 'status', description: 'Статус' },
                    { name: 'equipment', description: 'Вид оборудования' },
                    { name: 'group', description: 'Группа абонента' },
                    { name: 'priority', description: 'Важность' },
                    { name: 'time_choice', description: 'Выбор времени сеанса' },
                    { name: 'min_time', description: 'Мин. время сеанса' },
                    { name: 'max_time', description: 'Макс. время сеанса' },
                    { name: 'reg_date', description: 'Дата регистрации' },
                    { name: 'reg_end_date', description: 'Дата окончания рег.' }
                ]
            };

            const modal = new Modal(
                document.querySelector('.column2_vi'),
                'insert',
                tableInfo.columns_info.length,
                tableInfo.columns_info,
                newRow,
                insertRow,
                tableInfo,
                'Абонентский терминал',
                terminalsTableName
            );

            modal.createModal(loadData);
        });
    }

    const addTypeBtn = document.querySelector('[data-testid="button-add-type"]');
    if (addTypeBtn) {
        addTypeBtn.addEventListener('click', function() {
            const newRow = document.createElement('tr');
            newRow.innerHTML = '<td></td><td></td>';

            const tableInfo = {
                name: typesTableName,
                columns_info: [
                    { name: 'id', description: 'ID' },
                    { name: 'name', description: 'Наименование' }
                ]
            };

            const modal = new Modal(
                document.querySelector('.column2_vi'),
                'insert',
                tableInfo.columns_info.length,
                tableInfo.columns_info,
                newRow,
                insertRow,
                tableInfo,
                'Тип абонента',
                typesTableName
            );

            modal.createModal(loadData);
        });
    }

    const addStatusBtn = document.querySelector('[data-testid="button-add-status"]');
    if (addStatusBtn) {
        addStatusBtn.addEventListener('click', function() {
            const newRow = document.createElement('tr');
            newRow.innerHTML = '<td></td><td></td>';

            const tableInfo = {
                name: statusesTableName,
                columns_info: [
                    { name: 'id', description: 'ID' },
                    { name: 'name', description: 'Наименование' }
                ]
            };

            const modal = new Modal(
                document.querySelector('.column2_vi'),
                'insert',
                tableInfo.columns_info.length,
                tableInfo.columns_info,
                newRow,
                insertRow,
                tableInfo,
                'Статус абонента',
                statusesTableName
            );

            modal.createModal(loadData);
        });
    }

    const addPriorityBtn = document.querySelector('[data-testid="button-add-priority"]');
    if (addPriorityBtn) {
        addPriorityBtn.addEventListener('click', function() {
            const newRow = document.createElement('tr');
            newRow.innerHTML = '<td></td><td></td>';

            const tableInfo = {
                name: prioritiesTableName,
                columns_info: [
                    { name: 'id', description: 'ID' },
                    { name: 'name', description: 'Наименование' }
                ]
            };

            const modal = new Modal(
                document.querySelector('.column2_vi'),
                'insert',
                tableInfo.columns_info.length,
                tableInfo.columns_info,
                newRow,
                insertRow,
                tableInfo,
                'Важность',
                prioritiesTableName
            );

            modal.createModal(loadData);
        });
    }

    loadData();
}
