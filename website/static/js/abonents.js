export function completionAbonents(url){
    function getNameTables(url){
        let response = fetch(url)
        .then(response => response.json())
        .then(jsonRsponse => {
          for (const key in jsonRsponse) {
            // const selectAbonents=document.getElementById('abonent-select');
            if (key=="Абоненты") {
                const elemSection = document.createElement('select');
                const dateTablesName=jsonRsponse[key];
                // const nameSection=document.createElement('span');
                elemSection.classList.add('select');
                elemSection.name="abonents";
                elemSection.id='abonent-select';
                // nameSection.innerText=key;
                // elemSection.append(nameSection);
                console.log(elemSection);
               
                let i=0;
                for(const field in dateTablesName)
                {
                
                // console.log(dateTablesName[field])
                const nameTable=document.createElement('option');
                // nameTable.classList.add('container__nav__el');
                nameTable.value=i++;
                nameTable.append(dateTablesName[field]) ;
                nameTable.setAttribute("id", field);
                // selectAbonents.append(nameTable);
                // console.log(selectAbonents)
                elemSection.append(nameTable);
                } 
                const select=document.querySelector('.selects'); 
                
                
                select.append(elemSection)
                
               
                
                
            }
           
            // document.querySelector('.container__nav').append(elemSection);
            // // console.log(elemSection)
            //     elemSection.addEventListener('click', (e) => {
            //       const trsNavMenu=document.querySelectorAll('.container__nav__el');
            //       trsNavMenu.forEach((trMenu)=>{
            //         if (trMenu==e.target) {
            //           trMenu.style='background-color: #B5B8B1';
            //           console.log(e.target.id,e.target.innerHTML);
            //           createTable(e.target.id,e.target.innerHTML);
            //         }
            //         else{
            //           if (e.target.id) {
            //             trMenu.style='';
            //           }
            //         }
            //       }) 
            //     });
          }
        });
      }
      getNameTables(url)
      const select=document.querySelector('.selects'); 
     
      select.addEventListener('change',(event)=>{
        let selectedOption = event.target.options[event.target.selectedIndex];
          console.log(selectedOption.id) 
          if (selectedOption.id=='ABONENT_T') {
            const tableAbonentT={
              ID:'Идентификатор',
              Naim:'Наименование абонентского терминала в системе',
              Tlf:'Номер телефона абонентского терминала',
              ID_Ab_Type:'Тип абонента',
              ID_Ab_Status:'Статус абонентcкого терминала',
              ID_Ab_Vid:'Вид оборудования абонентcкого терминала',
              ID_Ab_Group:'Группа абонентов',
              ID_Ab_Prioritet:'Важность абонентcкого терминала',
              ID_Ab_Vid_sv:'Вид связи',
              ID_Ab_Prava:'Уровень права абонентcкого терминала на занятие каналов',
              ID_Ab_Type_Mobile:'Тип размещения абонентcкого терминала',
              Min_Time_Seans:'Минимальная продолжительность доступности для отбора возможных сеансов, сек',
              Max_Time_Seans:'Максимальная разрешенная продолжительность доступности для отбора возможных сеансов, сек',
              Vyb_Time_Seans:'Рекомендуемая минимальная продолжительность сеанса для назначения/выбора сеанса связи, сек',
              Data_Reg:'Дата регистрации в системе',
              Data_Reg_end:'Дата окончания регистрации в системе',
              ID_Zapret:'Наличие действующего запрета на связь',
              Data_Beg_Z:'Время начала запрета на связь',
              Data_End_Z:'Время окончания запрета на связь'
            }
            
            for(let field in tableAbonentT )
            {
              const createNewAb=document.createElement('div');
              createNewAb.classList.add('input_row');
              console.log(tableAbonentT[field]);
              createNewAb.innerHTML+=`<span>${tableAbonentT[field]}:</span><input type="text">`
              document.querySelector('.information_request').append(createNewAb);
            }
           
            
          }
          else{
            document.querySelector('.information_request').innerHTML=`<span class="csus">Заполните данные </span>`;
          }
          
      })
}