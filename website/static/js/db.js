// функция  изменения строки в API
import {Loader} from "./Loader.js";
let URL=`185.192.247.60:7130`;
const testURL=`127.0.0.1:8000`;
 URL=testURL
const loader = new Loader('.loader-container');
function renderPopup(popupElement,message){
  const div = document.createElement("div");
  popupElement.innerHTML=` <button type="button" onclick="this.closest('dialog').classList.remove('popup');this.closest('dialog').close();">
        Закрыть
    </button>`;
  div.textContent=message;
  div.classList.add('dialog-div');
  popupElement.prepend(div);
  popupElement.classList.add('popup');
  popupElement.showModal()
  setTimeout(()=>{
    popupElement.classList.remove('popup')
    popupElement.close()
  },5000)
}
function cleanStringCompact(str) {
  if (typeof str !== 'string') {
    return str;
  }

  return str
      .replace(/[\u0000-\u001F\u007F\u00A0\u00AD\u200B-\u200D\u2028\u2029\u2060\uFEFF]/g, '')
      .replace(/[\r\n\t]/g, '')
      .trim();
}
async function editRow(data,tableName) {
        try {
          const response = await fetch(`http://${URL}/db/update/${tableName}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
          const result = await response.json();
          console.log(`Row edit successfully:`, result);
          if(document.querySelector('#dialog-res')){
            renderPopup(document.querySelector('#dialog-res'),`Данные успешно обновлены`)
          }
          return result;
        }
        catch (error) {
          if(document.querySelector('#dialog-res')){
            renderPopup(document.querySelector('#dialog-res'),`Произошла ошибка ${error}`)
          }
          console.error(`Error edit row:`, error);
        }
}
// функция  удаления строки в API
async function deleteRow(data,tableName) {
        try {
          const response = await fetch(`http://${URL}/db/delete/${tableName}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
          const result = await response.json();
          console.log(`Row deleted successfully:`, result);
          return result;
        }
        catch (error) {
          console.error(`Error deleting row:`, error);
        }
}
// функция  добавления строки в API
async function insertRow(data,tableName) {
        try {
          const response = await fetch(`http://${URL}/db/insert_row/${tableName}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
          const result = await response.json();
          console.log(`Row insert successfully:`, result);
          return result;
        }
        catch (error) {
          console.error(`Error insert row:`, error);
        }
}
// функция  получения первых 20 значений таблицы в API
async function postJSON(data) {
        try {
          const response = await fetch(`http://${URL}/db/${data.name}/info`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            // body: JSON.stringify(data),
          });
          const result = await response.json();
          console.log(`Success:`, result);
          if (response.ok) {
            return result;
          }
         
        } catch (error) {
          console.error(`Error:`, error);
        }
}
async function getRowsTable(tableName,skipRows,rowsCount) {
  try {
    const response = await fetch(`http://${URL}/db/select/${tableName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log(`Success:`, result);
    return result;
  } catch (error) {
    console.error(`Error:`, error);
  }
}
//?query=${encodeURIComponent(query)}
async function changeQuery(query) {
  try {
    const response =await fetch(`http://${URL}/db/custom_change_query`, {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      'body':`"${(query)}"`,
    })
    const result = await response.json();
    console.log((query));
    console.log(`Success:`, result);
    return result;
  } catch (error) {
    console.error('Error:', error);

  }
}
async function selectQuery(query) {
  try {
    console.log((query))
    const response =await fetch(`http://${URL}/db/custom_select_query`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      'body':`"${query}"`,
    })
    const result = await response.json();
    console.log(`Success:`, result);
    return result;
  } catch (error) {
    console.error(`Error:`, error);
  }
}
async function recalculateKas(){
  try {
    loader.show('Ожидание ответа от сервера....');
    const response = await fetch(`http://${URL}/ka/recalculate`, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        "X-Source":12
      },
    });
    if (response.ok) {
      const result = await response;
      if(document.querySelector('#dialog-res')){
        loader.close()
        renderPopup(document.querySelector('#dialog-res'),`Пересчет данных прошел успешно`)
      }
      loader.close()
      return result;
    }
    else {
      if(document.querySelector('#dialog-res')){
        loader.close()
        renderPopup(document.querySelector('#dialog-res'),`Произошла ошибка ${error}`)
      }
      loader.close()
      throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    if(document.querySelector('#dialog-res')){
      loader.close()
      renderPopup(document.querySelector('#dialog-res'),`Произошла ошибка ${error}`)
    }
    console.error("Error recalculating KAS:", error);
    throw error;
  }

}
export {editRow,deleteRow,insertRow,postJSON,getRowsTable,changeQuery,selectQuery,recalculateKas}