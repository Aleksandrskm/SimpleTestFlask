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

    const subjectsTableName = 'Ab_S';
    const terminalsTableName = 'Ab_T';
    const typesTableName = 'Ab_Type';
    const statusesTableName = 'Ab_Status';
    const prioritiesTableName = 'Ab_Prioritet';

    const loader = new Loader('.loader-container');

    document.querySelector('.container__nav').append(elemSection);
    // console.log(elemSection)
    elemSection.addEventListener('click', (e) => {
        const trsNavMenu=document.querySelectorAll('.container__nav__el');
        trsNavMenu.forEach((trMenu)=>{
        if (trMenu==e.target) {
            trMenu.style='background-color: #B5B8B1';
            console.log(e.target.id,e.target.innerHTML);
            createTable(e.target.id,e.target.innerHTML);
        }
        else{
            if (e.target.id) {
            trMenu.style='';
            }
        }
        }) 
    });

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
            ID: s.ID,
            label: `${s.Family || ''} ${s.Name || ''} ${s.Surname || ''} (${s.Tlf_dop || ''})`.trim()
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
            `<div class="container__nav__el" data-abonent-id="${a.ID}" style="padding: 10px; cursor: pointer;">${a.label}</div>`
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
                `<div class="container__nav__el" data-abonent-id="${a.ID}" style="padding: 10px; cursor: pointer;">${a.label}</div>`
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
                <td>${s.ID || ''}</td>
                <td>${s.ID_Ab_Type || ''}</td>
                <td>${s.ID_Organization || ''}</td>
                <td>${s.ID_FOIV || ''}</td>
                <td>${s.ID_SP_Country || ''}</td>
                <td>${s.Family || ''}</td>
                <td>${s.Name || ''}</td>
                <td>${s.Surname || ''}</td>
                <td>${s.Pasport || ''}</td>
                <td>${s.Adres || ''}</td>
                <td>${s.Data_R || ''}</td>
                <td>${s.Tlf_dop || ''}</td>
                <td>${s.Email || ''}</td>
                <td>${s.Soc_seti || ''}</td>
                <td>${s.Data_Reg || ''}</td>
                <td>${s.Data_Reg_end || ''}</td>
                <td>${s.ID_Zapret || ''}</td>
                <td>${s.Data_Beg_Z || ''}</td>
                <td>${s.Data_End_Z || ''}</td>
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
                <td>${t.ID || ''}</td>
                <td>${t.Naim || ''}</td>
                <td>${t.Tlf || ''}</td>
                <td>${t.ID_Ab_S || ''}</td>
                <td>${t.ID_Ab_Type || ''}</td>
                <td>${t.ID_Ab_Status || ''}</td>
                <td>${t.ID_Ab_Vid || ''}</td>
                <td>${t.ID_Ab_Group || ''}</td>
                <td>${t.ID_Ab_Prioritet || ''}</td>
                <td>${t.ID_Ab_Vid_sv || ''}</td>
                <td>${t.ID_Ab_Prava || ''}</td>
                <td>${t.ID_Ab_Type_Mobile || ''}</td>
                <td>${t.Min_Time_Seans || ''}</td>
                <td>${t.Max_Time_Seans || ''}</td>
                <td>${t.Vyb_Time_Seans || ''}</td>
                <td>${t.Data_Reg || ''}</td>
                <td>${t.Data_Reg_end || ''}</td>
                <td>${t.ID_Zapret || ''}</td>
                <td>${t.Data_Beg_Z || ''}</td>
                <td>${t.Data_End_Z || ''}</td>
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
        const tbody = document.querySelector('types-table tbody');
        if (!tbody) return;

        tbody.innerHTML = types.map((t, i) => `
            <tr>
                <td>${t.ID || ''}</td>
                <td>${t.Naim || ''}</td>
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
        const tbody = document.querySelector('statuses-table tbody');
        if (!tbody) return;

        tbody.innerHTML = statuses.map((s, i) => `
            <tr>
                <td>${s.ID || ''}</td>
                <td>${s.Naim || ''}</td>
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
        const tbody = document.querySelector('priorities-table tbody');
        if (!tbody) return;

        tbody.innerHTML = priorities.map((p, i) => `
            <tr>
                <td>${p.ID || ''}</td>
                <td>${p.Naim || ''}</td>
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

    // function editSubject(index) {
    //     const subject = subjects[index];
    //     const subjectRow = document.querySelector('subjects-tbody').children[index];

    //     const tableInfo = {
    //         name: subjectsTableName,
    //         columns_info: [
    //             { name: 'ID', description: 'Идентификатор' },
    //             { name: 'ID_Ab_Type', description: 'Тип абонента' },
    //             { name: 'ID_Organization', description: 'Предприятие абонентcкого терминала' },
    //             { name: 'ID_FOIV', description: 'Ссылка на органы власти, ведомства и прочие гос. органы' },
    //             { name: 'ID_SP_Country', description: 'Страна принадлежности субъекта абонентcкого терминала' },
    //             { name: 'Family', description: 'Фамилия' },
    //             { name: 'Name', description: 'Имя' },
    //             { name: 'Surname', description: 'Отчество' },
    //             { name: 'passport', description: 'Паспорт' },
    //             { name: 'Adres', description: 'Адрес' },
    //             { name: 'Data_R', description: 'Дата рождения' },
    //             { name: 'Tlf_dop', description: 'Дополнительный номер телефона' },
    //             { name: 'Email', description: 'Электронный адрес' },
    //             { name: 'Soc_seti', description: 'Логины в социальных сетях' },
    //             { name: 'Data_Reg', description: 'Дата регистрации в системе' },
    //             { name: 'Data_Reg_end', description: 'Дата окончания регистрации в системе' },
    //             { name: 'ID_Zapret', description: 'Наличие запрета на связь' },
    //             { name: 'Data_Beg_Z', description: 'Время начала запрета на связь' },
    //             { name: 'Data_End_Z', description: 'Время окончания запрета на связь' }
    //         ]
    //     };

    //     const modal = new Modal(
    //         document.querySelector('.column2_vi'),
    //         'edit',
    //         tableInfo.columns_info.length,
    //         tableInfo.columns_info,
    //         subjectRow,
    //         editRow,
    //         tableInfo,
    //         'Профиль субъекта абонентcкого терминала',
    //         subjectsTableName
    //     );

    //     modal.createModal(loadData);
    // }

    // function deleteSubject(index) {
    //     if (!confirm('Удалить запись?')) return;

    //     const subject = subjects[index];
    //     const data = {
    //         where: { column: 'ID', operator: '=', value: subject.ID }
    //     };

    //     loader.show('Удаление...');
    //     deleteRow(data, subjectsTableName).then(() => {
    //         loadData();
    //     }).catch(error => {
    //         console.error('Ошибка удаления:', error);
    //         alert('Ошибка при удалении записи');
    //         loader.close();
    //     });
    // }

    // function editTerminal(index) {
    //     const terminal = terminals[index];
    //     const terminalRow = document.querySelector('terminals-tbody').children[index];

    //     const tableInfo = {
    //         name: terminalsTableName,
    //         columns_info: [
    //             { name: 'ID', description: 'Идентификатор' },
    //             { name: 'Naim', description: 'Наименование абонентского терминала в системе' },
    //             { name: 'Tlf', description: 'Номер телефона абонентского терминала' },
    //             { name: 'ID_Ab_S', description: 'Абонент' },
    //             { name: 'ID_Ab_Type', description: 'Тип абонента' },
    //             { name: 'ID_Ab_Status', description: 'Статус абонентcкого терминала' },
    //             { name: 'ID_Ab_Vid', description: 'Вид оборудования абонентcкого терминала' },
    //             { name: 'ID_Ab_Group', description: 'Группа абонентов' },
    //             { name: 'ID_Ab_Prioritet', description: 'Важность абонентcкого терминала' },
    //             { name: 'ID_Ab_Vid_sv', description: 'Вид связи' },
    //             { name: 'ID_Ab_Prava', description: 'Уровень права абонентcкого терминала на занятие каналов' },
    //             { name: 'ID_Ab_Type_Mobile', description: 'Тип размещения абонентcкого терминала' },
    //             { name: 'Min_Time_Seans', description: 'Минимальная продолжительность доступности для отбора возможных сеансов, сек.' },
    //             { name: 'Max_Time_Seans', description: 'Максимальная разрешенная продолжительность доступности для отбора возможных сеансов, сек.' },
    //             { name: 'Vyb_Time_Seans', description: 'Рекомендуемая минимальная продолжительность сеанса для назначения/выбора сеанса связи, сек.' },
    //             { name: 'Data_Reg', description: 'Дата регистрации в системе' },
    //             { name: 'Data_Reg_end', description: 'Дата окончания регистрации в системе' },
    //             { name: 'ID_Zapret', description: 'Наличие действующего запрета на связь' },
    //             { name: 'Data_Beg_Z', description: 'Время начала запрета на связь' },
    //             { name: 'Data_End_Z', description: 'Время окончания запрета на связь' }
    //         ]
    //     };

    //     const modal = new Modal(
    //         document.querySelector('.column2_vi'),
    //         'edit',
    //         tableInfo.columns_info.length,
    //         tableInfo.columns_info,
    //         terminalRow,
    //         editRow,
    //         tableInfo,
    //         'Профиль абонентского терминала',
    //         terminalsTableName
    //     );

    //     modal.createModal(loadData);
    // }

    // function deleteTerminal(index) {
    //     if (!confirm('Удалить запись?')) return;

    //     const terminal = terminals[index];
    //     const data = {
    //         where: { column: 'ID', operator: '=', value: terminal.ID }
    //     };

    //     loader.show('Удаление...');
    //     deleteRow(data, terminalsTableName).then(() => {
    //         loadData();
    //     }).catch(error => {
    //         console.error('Ошибка удаления:', error);
    //         alert('Ошибка при удалении записи');
    //         loader.close();
    //     });
    // }

    // function editType(index) {
    //     const type = types[index];
    //     const typeRow = document.querySelector('types-table tbody').children[index];

    //     const tableInfo = {
    //         name: typesTableName,
    //         columns_info: [
    //             { name: 'ID', description: 'Идентификатор' },
    //             { name: 'name', description: 'Наименование типов абонентов' }
    //         ]
    //     };

    //     const modal = new Modal(
    //         document.querySelector('.column2_vi'),
    //         'edit',
    //         tableInfo.columns_info.length,
    //         tableInfo.columns_info,
    //         typeRow,
    //         editRow,
    //         tableInfo,
    //         'Тип абонента',
    //         typesTableName
    //     );

    //     modal.createModal(loadData);
    // }

    // function deleteType(index) {
    //     if (!confirm('Удалить тип абонентcкого терминала?')) return;

    //     const type = types[index];
    //     const data = {
    //         where: { column: 'ID', operator: '=', value: type.ID }
    //     };

    //     loader.show('Удаление...');
    //     deleteRow(data, typesTableName).then(() => {
    //         loadData();
    //     }).catch(error => {
    //         console.error('Ошибка удаления:', error);
    //         alert('Ошибка при удалении записи');
    //         loader.close();
    //     });
    // }

    // function editStatus(index) {
    //     const status = statuses[index];
    //     const statusRow = document.querySelector('statuses-table tbody').children[index];

    //     const tableInfo = {
    //         name: statusesTableName,
    //         columns_info: [
    //             { name: 'ID', description: 'Идентификатор' },
    //             { name: 'Naim', description: 'Наименование статусов абонентов' }
    //         ]
    //     };

    //     const modal = new Modal(
    //         document.querySelector('.column2_vi'),
    //         'edit',
    //         tableInfo.columns_info.length,
    //         tableInfo.columns_info,
    //         statusRow,
    //         editRow,
    //         tableInfo,
    //         'Статусы абонентов',
    //         statusesTableName
    //     );

    //     modal.createModal(loadData);
    // }

    // function deleteStatus(index) {
    //     if (!confirm('Удалить статус абонентcкого терминала?')) return;

    //     const status = statuses[index];
    //     const data = {
    //         where: { column: 'ID', operator: '=', value: status.ID }
    //     };

    //     loader.show('Удаление...');
    //     deleteRow(data, statusesTableName).then(() => {
    //         loadData();
    //     }).catch(error => {
    //         console.error('Ошибка удаления:', error);
    //         alert('Ошибка при удалении записи');
    //         loader.close();
    //     });
    // }

    // function editPriority(index) {
    //     const priority = priorities[index];
    //     const priorityRow = document.querySelector('priorities-table tbody').children[index];

    //     const tableInfo = {
    //         name: prioritiesTableName,
    //         columns_info: [
    //             { name: 'ID', description: 'ID' },
    //             { name: 'Naim', description: 'Наименование' }
    //         ]
    //     };

    //     const modal = new Modal(
    //         document.querySelector('.column2_vi'),
    //         'edit',
    //         tableInfo.columns_info.length,
    //         tableInfo.columns_info,
    //         priorityRow,
    //         editRow,
    //         tableInfo,
    //         'Важность абонентcкого терминала',
    //         prioritiesTableName
    //     );

    //     modal.createModal(loadData);
    // }

    // function deletePriority(index) {
    //     if (!confirm('Удалить важность абонентcкого терминала?')) return;

    //     const priority = priorities[index];
    //     const data = {
    //         where: { column: 'ID', operator: '=', value: priority.ID }
    //     };

    //     loader.show('Удаление...');
    //     deleteRow(data, prioritiesTableName).then(() => {
    //         loadData();
    //     }).catch(error => {
    //         console.error('Ошибка удаления:', error);
    //         alert('Ошибка при удалении записи');
    //         loader.close();
    //     });
    // }

    // const editSubjectBtn = document.querySelector('[data-testid="button-edit-subject"]');
    // if (editSubjectBtn) {
    //     editSubjectBtn.addEventListener('click', function() {
    //         if (subjects.length > 0) {
    //             editSubject(0);
    //         } else {
    //             alert('Нет данных для редактирования');
    //         }
    //     });
    // }

    // const addTerminalBtn = document.querySelector('[data-testid="button-add-terminal"]');
    // if (addTerminalBtn) {
    //     addTerminalBtn.addEventListener('click', function() {
    //         const newRow = document.createElement('tr');
    //         newRow.innerHTML = '<td></td>'.repeat(15);

    //         const tableInfo = {
    //             name: terminalsTableName,
    //             columns_info: [
    //                 { name: 'ID', description: 'Идентификатор' },
        //             { name: 'Naim', description: 'Наименование абонентского терминала в системе' },
        //             { name: 'Tlf', description: 'Номер телефона абонентского терминала' },
        //             { name: 'ID_Ab_S', description: 'Абонент' },
        //             { name: 'ID_Ab_Type', description: 'Тип абонента' },
        //             { name: 'ID_Ab_Status', description: 'Статус абонентcкого терминала' },
        //             { name: 'ID_Ab_Vid', description: 'Вид оборудования абонентcкого терминала' },
        //             { name: 'ID_Ab_Group', description: 'Группа абонентов' },
        //             { name: 'ID_Ab_Prioritet', description: 'Важность абонентcкого терминала' },
        //             { name: 'ID_Ab_Vid_sv', description: 'Вид связи' },
        //             { name: 'ID_Ab_Prava', description: 'Уровень права абонентcкого терминала на занятие каналов' },
        //             { name: 'ID_Ab_Type_Mobile', description: 'Тип размещения абонентcкого терминала' },
        //             { name: 'Min_Time_Seans', description: 'Минимальная продолжительность доступности для отбора возможных сеансов, сек.' },
        //             { name: 'Max_Time_Seans', description: 'Максимальная разрешенная продолжительность доступности для отбора возможных сеансов, сек.' },
        //             { name: 'Vyb_Time_Seans', description: 'Рекомендуемая минимальная продолжительность сеанса для назначения/выбора сеанса связи, сек.' },
        //             { name: 'Data_Reg', description: 'Дата регистрации в системе' },
        //             { name: 'Data_Reg_end', description: 'Дата окончания регистрации в системе' },
        //             { name: 'ID_Zapret', description: 'Наличие действующего запрета на связь' },
        //             { name: 'Data_Beg_Z', description: 'Время начала запрета на связь' },
        //             { name: 'Data_End_Z', description: 'Время окончания запрета на связь' }
    //             ]
    //         };

    //         const modal = new Modal(
    //             document.querySelector('.column2_vi'),
    //             'insert',
    //             tableInfo.columns_info.length,
    //             tableInfo.columns_info,
    //             newRow,
    //             insertRow,
    //             tableInfo,
    //             'Профиль абонентского терминала',
    //             terminalsTableName
    //         );

    //         modal.createModal(loadData);
    //     });
    // }

    loadData();
}
