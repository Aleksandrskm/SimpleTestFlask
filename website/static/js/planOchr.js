import { getRowsTable, postJSON } from './db.js';

document.addEventListener('DOMContentLoaded', function() {
    let currentTable = 'CH_FRQ_Prd';
    
    // Обработчики radiobutton
    document.querySelectorAll('input[name="table_type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            currentTable = this.value;
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
            
            // Формируем таблицу
            renderTable(tableData.rows, columnsMap);
            
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
            
            tbody.appendChild(tr);
        });
    }
    
    // Инициализация при загрузке
    loadTableData();
});