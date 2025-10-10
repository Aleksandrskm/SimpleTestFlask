import { editRow, deleteRow, insertRow, postJSON, getRowsTable } from './db.js';
import { Modal } from './Modal.js';
import { Loader } from './Loader.js';

const subjectsTableName = 'Ab_S';
const terminalsTableName = 'Ab_T';
const typesTableName = 'Ab_Type';
const statusesTableName = 'Ab_Status';
const prioritiesTableName = 'Ab_Prioritet';

let currentColumnsInfo = {};
let allSubjects = []; // все абоненты 
let selectedAbonentId = null; // ID абонента

document.addEventListener('DOMContentLoaded', function() {
    console.log('Abonents page loaded');
    const loader = new Loader('.loader-container');
    
    initializeTimer();
    initializeSettingsHandlers();
    initializeEventDelegation();
    initializeAbonentSelect();
    initializeTables(loader);
});

function initializeEventDelegation() {
    const container = document.querySelector('.column2_vi');
    
    container.addEventListener('click', (e) => {
        //клик по строке
        if (e.target.closest('tbody td') || e.target.closest('tbody tr')) {
            const row = e.target.closest('tr');
            const tbody = row.closest('tbody');
            const table = tbody.closest('table');
            const tableName = getTableNameByTableElement(table);
            
            if (tableName && currentColumnsInfo[tableName]) {
                // снять выделение со всех строк таблицы
                const allRows = tbody.querySelectorAll('tr');
                allRows.forEach(r => r.classList.remove('selected'));
                
                // текущая строку
                row.classList.add('selected');
            }
            return;
        }
        
        // клик по кнопке
        const button = e.target.closest('button');
        if (!button) return;
        
        const tableButtons = button.closest('.table-buttons');
        if (!tableButtons) return;
        
        const tableWrapper = tableButtons.previousElementSibling;
        const table = tableWrapper?.querySelector('table');
        if (!table) return;
        
        const tableName = getTableNameByTableElement(table);
        const selectedRow = table.querySelector('tbody tr.selected');
        
        if (!tableName || !currentColumnsInfo[tableName]) {
            console.error('Table info not found for:', tableName);
            return;
        }
        
        const columnsInfo = currentColumnsInfo[tableName];
        
        // разные типы кнопок
        if (button.classList.contains('insert')) {
            createInsertModal(tableName, columnsInfo);
        } else if (button.classList.contains('edit')) {
            if (!selectedRow) {
                alert('Пожалуйста, выберите строку для редактирования');
                return;
            }
            createModal('edit', tableName, selectedRow, columnsInfo);
        } else if (button.classList.contains('copy')) {
            if (!selectedRow) {
                alert('Пожалуйста, выберите строку для копирования');
                return;
            }
            createModal('copy', tableName, selectedRow, columnsInfo);
        } else if (button.classList.contains('delete')) {
            if (!selectedRow) {
                alert('Пожалуйста, выберите строку для удаления');
                return;
            }
            createModal('delete', tableName, selectedRow, columnsInfo);
        }
    });
}

// выпадающий список абонентов
function initializeAbonentSelect() {
    const select = document.getElementById('abonent-select');
    if (!select) {
        console.error('Элемент выбора абонента не найден');
        return;
    }

    // изменение выбора
    select.addEventListener('change', function() {
        const abonentId = this.value;
        if (abonentId) {
            filterTablesByAbonent(abonentId);
        } else {
            resetFilter();
        }
    });
}

// заполнение выпадающего списка
function fillAbonentSelect() {
    const select = document.getElementById('abonent-select');
    if (!select) return;

    const currentValue = select.value;
    select.innerHTML = '<option value="">Все абоненты</option>';

    allSubjects.forEach(subject => {
        const family = subject['FAMILY'] || '';
        const name = subject['NAME'] || '';
        const surname = subject['SURNAME'] || '';
        
        const fullName = `${family} ${name} ${surname}`.trim();

        const option = document.createElement('option');
        option.value = subject.ID;
        option.textContent = fullName || `Абонент ${subject.ID}`;
        select.appendChild(option);
    });

    if (currentValue) {
        select.value = currentValue;
    }
}

// получение имени таблицы по dom элементу
function getTableNameByTableElement(table) {
    const mapping = {
        'subjects': 'Ab_S',
        'terminals': 'Ab_T', 
        'types': 'Ab_Type',
        'statuses': 'Ab_Status',
        'priorities': 'Ab_Prioritet'
    };
    
    const tableId = table.id;
    return mapping[tableId] || '';
}

// модальное окно(МО) для добавления
function createInsertModal(tableName, columnsInfo) {
    const modalParent = document.querySelector('.column2_vi');
    
    // МО
    const modal = document.createElement('div');
    modal.classList.add('modal');
    
    const modalDialog = document.createElement('div');
    modalDialog.classList.add('modal__dialog');
    
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal__content');
    
    // Заголовок МО
    modalContent.innerHTML = `<div class="modal__title">Добавление новой строки в таблицу</div>`;
    
    // контейнер для ввода
    const columnsContainer = document.createElement('div');
    columnsContainer.classList.add('modalColumns');
    
    // ввод для каждой колонки (кроме ID)
    for (let i = 1; i < columnsInfo.length; i++) {
        const column = columnsInfo[i];
        
        const dataColumn = document.createElement('div');
        dataColumn.classList.add('data-column');
        
        const nameColumn = document.createElement('div');
        nameColumn.classList.add('name-column');
        nameColumn.textContent = column.description;
        
        const modalInput = document.createElement('input');
        modalInput.type = 'text';
        modalInput.classList.add('modal__input');
        modalInput.placeholder = column.description;
        
        dataColumn.appendChild(nameColumn);
        dataColumn.appendChild(modalInput);
        columnsContainer.appendChild(dataColumn);
    }
    
    modalContent.appendChild(columnsContainer);
    
    // кнопки
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('btnsModal');
    buttonsContainer.innerHTML = `
        <button class="btn modal__confirm btn_dark btn_min">Добавить</button>
        <button class="btn modal__close btn_dark btn_min">Отмена</button>
    `;
    
    modalContent.appendChild(buttonsContainer);
    
    modalDialog.appendChild(modalContent);
    modal.appendChild(modalDialog);
    modalParent.appendChild(modal);
    
    // подтверждения добавления
    modal.querySelector('.modal__confirm').addEventListener('click', () => {
        const inputs = modal.querySelectorAll('.modal__input');
        const data = {};
        const columns = [];
        const values = [];
        
        inputs.forEach((input, index) => {
            const columnIndex = index + 1;
            if (input.value) {
                columns.push(columnsInfo[columnIndex].name);
                values.push(input.value);
            }
        });
        
        // для отправки
        const bodyReq = {
            row: {}
        };
        
        columns.forEach((column, index) => {
            bodyReq.row[column] = values[index];
        });
        
        // на добавление
        insertRow(bodyReq, tableName).then(() => {
            modal.remove();
            refreshTable(tableName);
        }).catch(error => {
            console.error('Ошибка при добавлении строки:', error);
            alert('Произошла ошибка при добавлении строки');
        });
    });
    
    // отмена
    modal.querySelector('.modal__close').addEventListener('click', () => {
        modal.remove();
    });
    
    // закрытие при клике вне МО
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// создание МО для других операций
function createModal(type, tableName, selectedRow, columnsInfo) {
    const modalParent = document.querySelector('.column2_vi');
    let funcRow;
    
    switch(type) {
        case 'edit':
            funcRow = editRow;
            break;
        case 'copy':
            funcRow = insertRow;
            break;
        case 'delete':
            funcRow = deleteRow;
            break;
        default:
            return;
    }

    // удаление, передаем 0 колонок, чтобы не создавались поля ввода
    const colCount = type === 'delete' ? 0 : columnsInfo.length;
    
    const modal = new Modal(modalParent, type, colCount, columnsInfo,
        selectedRow, funcRow, { columns_info: columnsInfo, name: tableName },
        '', tableName);
    
    modal.createModal(() => refreshTable(tableName));
}

// заполнение таблицы данными
async function fillTable(tableName, tbodyId, loader, filterByAbonentId = null) {
    try {
        loader.show(`Загрузка ${tableName}...`);
        
        // информация о структуре таблицы
        const tableInfo = await postJSON({ name: tableName });
        if (!tableInfo || !tableInfo.columns_info) {
            console.warn(`Не удалось получить информацию о таблице ${tableName} - таблица может отсутствовать`);
            await createTablePlaceholder(tableName, tbodyId);
            return;
        }
        
        const columnsInfo = tableInfo.columns_info;
        currentColumnsInfo[tableName] = columnsInfo;
        
        // заголовки таблицы
        await fillTableHeaders(tableName, tbodyId, columnsInfo);
        
        // данные таблицы
        const data = await getRowsTable(tableName, 0, 1000);
        const tbody = document.getElementById(tbodyId);
        
        if (tableName === terminalsTableName) {
            checkTerminalFields(data.rows);
        }
        
        tbody.innerHTML = '';

        // пустые данных
        if (!data || !data.rows || data.rows.length === 0) {
            console.warn(`Таблица ${tableName} пуста или не содержит данных`);
            const emptyRow = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.colSpan = columnsInfo.length;
            emptyCell.textContent = 'Таблица пуста';
            emptyCell.style.textAlign = 'center';
            emptyCell.style.fontStyle = 'italic';
            emptyRow.appendChild(emptyCell);
            tbody.appendChild(emptyRow);
            
            // состояние кнопок для пустой таблицы
            updateButtonsState(tableName, false);
            return;
        }

        // данные абонентов для выпадающего списка
        if (tableName === subjectsTableName) {
            allSubjects = data.rows;
            fillAbonentSelect(); // выпадающий список
        }

        // данные если указан ID абонента
        let rowsToDisplay = data.rows;
        if (filterByAbonentId) {
            if (tableName === subjectsTableName) {
                // для таблицы субъектов только выбранный абонента
                rowsToDisplay = data.rows.filter(row => row.ID == filterByAbonentId);
            } else if (tableName === terminalsTableName) {
                // для таблицы терминалов только терминалы выбранного абонента
                console.log('Фильтрация терминалов по абоненту:', filterByAbonentId);
                console.log('Всего терминалов до фильтрации:', data.rows.length);
                
                rowsToDisplay = data.rows.filter(row => {
                    // поле ID_AB_S для связи с абонентом
                    return row.ID_AB_S == filterByAbonentId;
                });
                
                console.log('Терминалов после фильтрации:', rowsToDisplay.length);
            }
        }

        // заполняем данными
        rowsToDisplay.forEach(row => {
            const tr = document.createElement('tr');
            
            columnsInfo.forEach(column => {
                const td = document.createElement('td');
                td.textContent = row[column.name] || '';
                if (column.name === 'ID') {
                    td.setAttribute('data-key', 'ID');
                }
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });

        if (rowsToDisplay.length > 0 && !filterByAbonentId) {
            const rows = tbody.querySelectorAll('tr');
            const lastRow = rows[rows.length - 1];
            if (lastRow) {
                lastRow.classList.add('selected');
            }
        }

        // обновляем кнопокм
        updateButtonsState(tableName, rowsToDisplay.length > 0);

        console.log(`Таблица ${tableName} успешно загружена`);

    } catch (error) {
        console.error(`Ошибка при загрузке данных для таблицы ${tableName}:`, error);
        await createTablePlaceholder(tableName, tbodyId);
    }
}

// проверка полей в таблице терминалов
function checkTerminalFields(terminalsData) {
    if (terminalsData.length > 0) {
        console.log('=== ПРОВЕРКА СТРУКТУРЫ ТЕРМИНАЛОВ ===');
        console.log('Первый терминал:', terminalsData[0]);
        console.log('Ключи:', Object.keys(terminalsData[0]));
        
        // проверка наличия поля для связи с абонентом
        const possibleAbonentFields = ['ID_AB_S'];
        const foundField = possibleAbonentFields.find(field => field in terminalsData[0]);
        console.log('Найдено поле для связи с абонентом:', foundField);
    }
}

// обновление состояния кнопок
function updateButtonsState(tableName, hasData) {
    const tableId = getTableIdByTableName(tableName);
    const tableElement = document.getElementById(tableId);
    if (!tableElement) return;
    
    const tableButtons = tableElement.closest('.table-wrapper')?.nextElementSibling;
    if (!tableButtons) return;
    
    const editBtn = tableButtons.querySelector('.edit');
    const copyBtn = tableButtons.querySelector('.copy');
    const deleteBtn = tableButtons.querySelector('.delete');
    const mapsBtn = tableButtons.querySelector('.maps');
    
    if (hasData) {
        editBtn?.removeAttribute('disabled');
        copyBtn?.removeAttribute('disabled');
        deleteBtn?.removeAttribute('disabled');
        mapsBtn?.removeAttribute('disabled');
    } else {
        editBtn?.setAttribute('disabled', '');
        copyBtn?.setAttribute('disabled', '');
        deleteBtn?.setAttribute('disabled', '');
        mapsBtn?.setAttribute('disabled', '');
    }
}

// получение ID таблицы по имени таблицы
function getTableIdByTableName(tableName) {
    const mapping = {
        'Ab_S': 'subjects',
        'Ab_T': 'terminals',
        'Ab_Type': 'types',
        'Ab_Status': 'statuses',
        'Ab_Prioritet': 'priorities'
    };
    return mapping[tableName] || '';
}

// заглушка для отсутствующих таблиц
async function createTablePlaceholder(tableName, tbodyId) {
    const tableId = tbodyId.replace('-tbody', '');
    const table = document.getElementById(tableId);
    
    if (!table) return;

    let thead = table.querySelector('thead');
    if (!thead) {
        thead = document.createElement('thead');
        table.insertBefore(thead, table.querySelector('tbody'));
    }

    // базовые заголовки
    thead.innerHTML = '';
    const headerRow = document.createElement('tr');
    const th = document.createElement('th');
    th.textContent = 'Информация';
    th.colSpan = 2;
    headerRow.appendChild(th);
    thead.appendChild(headerRow);

    // сообщением о отсутствии
    const tbody = document.getElementById(tbodyId);
    if (tbody) {
        tbody.innerHTML = '';
        const messageRow = document.createElement('tr');
        const messageCell = document.createElement('td');
        messageCell.colSpan = 2;
        messageCell.textContent = `Таблица ${tableName} недоступна или пуста`;
        messageCell.style.textAlign = 'center';
        messageCell.style.fontStyle = 'italic';
        messageCell.style.padding = '20px';
        messageRow.appendChild(messageCell);
        tbody.appendChild(messageRow);
    }
}

// заполнение заголовков таблицы
async function fillTableHeaders(tableName, tbodyId, columnsInfo) {
    const tableId = tbodyId.replace('-tbody', '');
    const table = document.getElementById(tableId);
    
    if (!table) {
        console.error(`Не найдена таблица с ID: ${tableId}`);
        return;
    }

    let thead = table.querySelector('thead');
    if (!thead) {
        thead = document.createElement('thead');
        table.insertBefore(thead, table.querySelector('tbody'));
    }

    thead.innerHTML = '';
    const headerRow = document.createElement('tr');
    
    columnsInfo.forEach(column => {
        const th = document.createElement('th');
        th.textContent = column.description || column.name;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
}

// обновление таблицы
async function refreshTable(tableName, filterByAbonentId = null) {
    const loader = new Loader('.loader-container');
    const tbodyId = getTbodyIdByTableName(tableName);
    await fillTable(tableName, tbodyId, loader, filterByAbonentId);
}

// получение ID tbody по имени таблицы
function getTbodyIdByTableName(tableName) {
    const mapping = {
        'Ab_S': 'subjects-tbody',
        'Ab_T': 'terminals-tbody',
        'Ab_Type': 'types-tbody',
        'Ab_Status': 'statuses-tbody',
        'Ab_Prioritet': 'priorities-tbody'
    };
    return mapping[tableName] || '';
}

// обновление всех таблиц с фильтрацией по абоненту
async function filterTablesByAbonent(abonentId) {
    selectedAbonentId = abonentId;
    const loader = new Loader('.loader-container');
    
    try {
        loader.show('Фильтрация данных...');
        
        // показываем только выбранного абонента
        await fillTable(subjectsTableName, 'subjects-tbody', loader, abonentId);
        
        // показываем только терминалы выбранного абонента
        await fillTable(terminalsTableName, 'terminals-tbody', loader, abonentId);
        
        // таблицы типов, статусов и приоритетов не фильтруем
        await fillTable(typesTableName, 'types-tbody', loader);
        await fillTable(statusesTableName, 'statuses-tbody', loader);
        await fillTable(prioritiesTableName, 'priorities-tbody', loader);
        
    } catch (error) {
        console.error('Ошибка при фильтрации таблиц:', error);
    } finally {
        loader.close();
    }
}

// сброс фильтра
function resetFilter() {
    selectedAbonentId = null;
    const loader = new Loader('.loader-container');
    
    // перезагружаем все таблицы без фильтра
    initializeTables(loader);
}

// инициализация таблиц
async function initializeTables(loader) {
    try {
        loader.show('Загрузка данных...');

        // загрузка таблицы 
        await Promise.allSettled([
            fillTable(subjectsTableName, 'subjects-tbody', loader),
            fillTable(terminalsTableName, 'terminals-tbody', loader),
            fillTable(typesTableName, 'types-tbody', loader),
            fillTable(statusesTableName, 'statuses-tbody', loader),
            fillTable(prioritiesTableName, 'priorities-tbody', loader).catch(error => {
                console.warn('Таблица приоритетов недоступна:', error);
                return createTablePlaceholder(prioritiesTableName, 'priorities-tbody');
            })
        ]);

        console.log('Загрузка таблиц завершена');

    } catch (error) {
        console.error('Общая ошибка при инициализации таблиц:', error);
    } finally {
        loader.close();
    }
}

// кнопки настроек
function initializeSettingsHandlers() {
    const settingsBtn = document.getElementById('settingsBtn');
    const modal = document.getElementById('myModal');
    const closeBtn = document.querySelector('.close');
    const modalResizeBtn = document.querySelector('.modal-resize-btn');

    if (settingsBtn && modal) {
        settingsBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (modalResizeBtn && modal) {
        modalResizeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
}

// таймер
function initializeTimer() {
    function getDateTime() {
        const now = new Date(); 
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        const second = String(now.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    // время в шапке
    const timerElement = document.getElementById('timer-start');
    if (timerElement) {
        setInterval(() => {
            timerElement.innerHTML = getDateTime();
        }, 1000);
    }

    // время в настройках
    const timerSettings = document.getElementById('timer-settings');
    if (timerSettings) {
        setInterval(() => {
            timerSettings.innerHTML = getDateTime();
        }, 1000);
    }
}

// экспорт для других модулей
export function completionAbonents(url) {
    console.log('Initializing abonents with URL:', url);
}