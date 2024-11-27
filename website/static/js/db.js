// функция  изменения строки в API
async function editRow(data) {
        try {
          const response = await fetch('http://185.192.247.60:7130/Database/UpdateRow', {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          const result = await response.json();
          console.log("Row edit successfully:", result);
          return result;
        }
        catch (error) {
          console.error("Error edit row:", error);
        }
}
// функция  удаления строки в API
async function deleteRow(data) {
        try {
          const response = await fetch("http://185.192.247.60:7130/Database/DeleteRow", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          const result = await response.json();
          console.log("Row deleted successfully:", result);
          return result;
        }
        catch (error) {
          console.error("Error deleting row:", error);
        }
}
// функция  добавления строки в API
async function insertRow(data) {
        try {
          const response = await fetch("http://185.192.247.60:7130/Database/InsertRow", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          const result = await response.json();
          console.log("Row insert successfully:", result);
          return result;
        }
        catch (error) {
          console.error("Error insert row:", error);
        }
}
// функция  получения первых 20 значений таблицы в API
async function postJSON(data) {
        try {
          const response = await fetch(`http://185.192.247.60:7130/Database/TableInfo/${data.name}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            // body: JSON.stringify(data),
          });
          const result = await response.json();
          console.log("Success:", result);
          return result;
        } catch (error) {
          console.error("Error:", error);
        }
}
async function getRowsTable(tableName,skipRows,rowsCount) {
  try {
    const response = await fetch(`http://185.192.247.60:7130/Database/GetRows${tableName}/${skipRows}/${rowsCount}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log("Success:", result);
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}
const list_Tables = {
  SV_AB:"Абоненты запросов на сеансы связи ",
  SV_CAN_ZAN_PRD:"Текущая занятость частотных каналов по передаче ",
  SV_OTV:"Ответ на запрос вызова ",
  SV_SEANS:"Общие характеристики сеансов связи ",
  SV_SEANS_AB:"Назначение КА, РСС и частотных каналов по абонентам ",
  SV_SEANS_AB_KA_PRD:"Назначение передающих лучей КА по абонентам ",
  SV_SEANS_AB_KA_PRM:"Назначение приемных лучей КА по абонентам ",
  SV_SEANS_REZ:"Результат сеанса ",
  SV_SEANS_RSS_KA_PRD:"Назначение передающих лучей КА по РСС ",
  SV_SEANS_RSS_KA_PRM:"Назначение приемных лучей КА по РСС ",
  SV_VID:"Виды сеансов связи ",
  SV_ZAPROS_SEANS:"Запросы на сеанс связи ",
  SV_AB_ARH:"Архивные абоненты запросов на сеансы связи ",
  SV_CAN_SOST_ARH:"Архивная занятость частотных каналов по приему ",
  SV_CAN_ZAN_PRD_ARH:"Архивная занятость частотных каналов по передаче ",
  SV_SEANS_AB_ARH:"Назначение КА, РСС и частотных каналов по абонентам архивные ",
  SV_SEANS_AB_KA_PRD_ARH:"Назначение передающих лучей КА по абонентам архивные ",
  SV_SEANS_AB_KA_PRM_ARH:"Назначение приемных лучей КА по абонентам архивные ",
  SV_SEANS_ARH:"Общие характеристики сеансов связи архивные ",
  SV_SEANS_RSS_KA_PRD_ARH:"Назначение передающих лучей КА по РСС архивные ",
  SV_SEANS_RSS_KA_PRM_ARH:"Назначение приемных лучей КА по РСС архивные ",
  SV_ZAPROS_SEANS_ARH:"Архивные запросы на сеанс связи ",
  RSS:'РСС',
  RSS_ANT:'РСС Антены',
  ISPR:'Исправность',
  RSS_ARH:'РСС Архив',
  RSS_ANT_ARH:'РСС Антены Архив',
  RSS_KA:'РСС КА',
  RSS_KA_VOZM:'РСС КА Возможные',
  RSS_KA_KOLLIZ:'РСС КА Коллизии',
  ERR:'Ошибки',
  RSS_KA_ARH:'РСС КА Архив',
  RSS_KA_VOZM_ARH:'РСС КА Возможные Архив',
  RSS_KA_KOLLIZ_ARH:'РСС КА Коллизии Архив',
  KA:'Данные по КА',
  KA_ZONA_BEAM_ARH:'Зоны покрытия лучей КА архивные ',
  KA_ZONA_BEAM:"Зоны покрытия лучей КА ",
  KA_ZONA_ARH:'Зоны покрытия КА архивные ',
  KA_ZONA:'Зоны покрытия КА ',
  KA_SP_SOST:'Справочник состояний КА и лучей КА',
  KA_SOST_ARH:"Состояние КА архивные ",
  KA_SOST:'Справочник стран ',
  KA_BEAM_ARH:'Лучи КА архивные ',
  KA_BEAM:'Лучи КА ',
  KA_ARH:'Учетные данные о КА архивные '
};
export {editRow,deleteRow,insertRow,postJSON,getRowsTable,list_Tables}