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
export {editRow,deleteRow,insertRow,postJSON}