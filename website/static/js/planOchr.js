import { getRowsTable, postJSON, editRow, deleteRow, insertRow } from './db.js';

document.addEventListener('DOMContentLoaded', function() {
    let currentTable = 'CH_FRQ_Prd';
    let selectedRow = null;
    let currentData = [];
    
    // Обработчики radiobutton
    document.querySelectorAll('input[name="table_type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            currentTable = this.value;
            selectedRow = null;
            clearForm();
            loadTableData();
        });
    });
    
    // Загрузка данных таблицы
    async function loadTableData() {
        try {
            // Получаем русские названия столбцов
            const tableInfo = await postJSON({ name: currentTable });
            const columnsMap = {};
            
            tableInfo.columns_info.forEach(col => {
                columnsMap[col.name] = col.description;
            });
            
            // Получаем все строки таблицы
            const tableData = await getRowsTable(currentTable, 0, 99999);
            currentData = tableData.rows;
            
            // Формируем таблицу
            renderTable(currentData, columnsMap);
            
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    }
    
    // Рендер таблицы
    function renderTable(data, columnsMap) {
        const tbody = document.querySelector('.signals-table tbody');
        tbody.innerHTML = '';
        
        data.forEach((row, index) => {
            const tr = document.createElement('tr');
            tr.dataset.index = index;
            
            // Номер сигнала/канала (id)
            const td1 = document.createElement('td');
            td1.textContent = index + 1;
            tr.appendChild(td1);
            
            // Центральная частота
            const td2 = document.createElement('td');
            td2.textContent = row.FRQ_CENTR ? row.FRQ_CENTR.toFixed(3) : '';
            tr.appendChild(td2);
            
            // Ширина полосы (FRQ_MAX - FRQ_MIN)
            const td3 = document.createElement('td');
            const bandwidth = row.FRQ_MAX && row.FRQ_MIN ? (row.FRQ_MAX - row.FRQ_MIN).toFixed(3) : '';
            td3.textContent = bandwidth;
            tr.appendChild(td3);
            
            // Минимальный уровень (константа 30)
            const td4 = document.createElement('td');
            td4.textContent = '30';
            tr.appendChild(td4);
            
            // Максимальный уровень (константа 80)
            const td5 = document.createElement('td');
            td5.textContent = '80';
            tr.appendChild(td5);
            
            // Обработчик клика по строке
            tr.addEventListener('click', function() {
                selectRow(this, row);
            });
            
            tbody.appendChild(tr);
        });
    }
    
    // Выбор строки
    function selectRow(rowElement, rowData) {
        // Снимаем выделение со всех строк
        document.querySelectorAll('.signals-table tbody tr').forEach(tr => {
            tr.classList.remove('selected');
        });
        
        // Выделяем текущую строку
        rowElement.classList.add('selected');
        selectedRow = rowData;
        
        // Заполняем форму данными
        fillForm(rowData);
    }
    
    // Заполнение формы данными
    function fillForm(data) {
        document.getElementById('frq_centr').value = data.FRQ_CENTR || '';
        document.getElementById('frq_min').value = data.FRQ_MIN || '';
        document.getElementById('frq_max').value = data.FRQ_MAX || '';
        document.getElementById('min_level').value = '30';
        document.getElementById('max_level').value = '80';
    }
    
    // Очистка формы
    function clearForm() {
        document.getElementById('frq_centr').value = '';
        document.getElementById('frq_min').value = '';
        document.getElementById('frq_max').value = '';
        document.getElementById('min_level').value = '30';
        document.getElementById('max_level').value = '80';
    }
    
    // Сохранение изменений
    document.getElementById('save-signal').addEventListener('click', async function() {
        if (!selectedRow) {
            alert('Выберите строку для редактирования');
            return;
        }
        
        try {
            const updatedData = {
                where: { column: "ID", operator: "=", value: selectedRow.ID },
                row: {
                    FRQ_CENTR: parseFloat(document.getElementById('frq_centr').value),
                    FRQ_MIN: parseFloat(document.getElementById('frq_min').value),
                    FRQ_MAX: parseFloat(document.getElementById('frq_max').value)
                }
            };
            
            await editRow(updatedData, currentTable);
            alert('Данные успешно сохранены');
            loadTableData(); // Перезагружаем таблицу
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            alert('Ошибка сохранения данных');
        }
    });
    
    // Добавление нового сигнала
    document.getElementById('add-signal').addEventListener('click', async function() {
        const frqCentr = document.getElementById('frq_centr').value;
        const frqMin = document.getElementById('frq_min').value;
        const frqMax = document.getElementById('frq_max').value;
        
        if (!frqCentr || !frqMin || !frqMax) {
            alert('Заполните все поля');
            return;
        }
        
        try {
            const newData = {
                row: {
                    FRQ_CENTR: parseFloat(frqCentr),
                    FRQ_MIN: parseFloat(frqMin),
                    FRQ_MAX: parseFloat(frqMax)
                }
            };
            
            await insertRow(newData, currentTable);
            alert('Сигнал успешно добавлен');
            clearForm();
            loadTableData(); // Перезагружаем таблицу
        } catch (error) {
            console.error('Ошибка добавления:', error);
            alert('Ошибка добавления сигнала');
        }
    });
    
    // Удаление сигнала
    document.getElementById('delete-signal').addEventListener('click', async function() {
        if (!selectedRow) {
            alert('Выберите строку для удаления');
            return;
        }
        
        if (!confirm('Вы уверены, что хотите удалить этот сигнал?')) {
            return;
        }
        
        try {
            const deleteData = {
                where: { column: "ID", operator: "=", value: selectedRow.ID }
            };
            
            await deleteRow(deleteData, currentTable);
            alert('Сигнал успешно удален');
            clearForm();
            selectedRow = null;
            loadTableData(); // Перезагружаем таблицу
        } catch (error) {
            console.error('Ошибка удаления:', error);
            alert('Ошибка удаления сигнала');
        }
    });
    
    // Обработчик сворачивания/разворачивания панели
    document.getElementById('button-collapse-right').addEventListener('click', function() {
        document.querySelector('.right-panel').classList.toggle('collapsed');
        document.querySelector('.right-panel .right').classList.toggle('hidden');
    });
    
    // Инициализация при загрузке
    loadTableData();
});