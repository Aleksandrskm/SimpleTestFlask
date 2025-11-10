'use strict';
import {getRowsTable,editRow,postJSON,recalculateKas} from "./db.js";
import {DataTle} from "./DataTle.js";
async function getKa(){
    const dataKa = await getRowsTable('KA');
    return dataKa?.rows;
}
async  function getRusName(){
    const rusNames = await postJSON({name:'KA'});
    return rusNames?.columns_info;
}
function getIdsKA(kaData){
    return  kaData.map(item=> item?.ID);
}
function renderIdsKa(idsKa,parentElement){
    const elemIds=[];
    idsKa.forEach(id=>{
        const elemKa=document.createElement("div");
        elemKa.textContent=`КА: ${id}`;
        elemKa.classList.add(`id-ka-list`);
        elemIds.push(elemKa);
    })
    parentElement.append(...elemIds);
}
function filterKaDataForId(kaData,idKa){
    return kaData.filter(item=> item?.ID===idKa);
}
function renderTleData(elementLabelKa,elementInputKa,parentElement){

    const dataKa=document.createElement('div');
    dataKa.classList.add('flexTle')
    dataKa.append(elementLabelKa,elementInputKa);
    parentElement.append(dataKa);
}
function updateKaData(){
    const arrValueData= createArrValuesKa('.flexTle > input')
    const arrFieldsData = createArrFieldsData('.flexTle > label')
    const objData= createObjKa(arrValueData,arrFieldsData);
    const dataTles =new DataTle()
    dataTles.setAllTLEParam(objData.TLE_LINE1,0)
    dataTles.setAllTLEParam(objData.TLE_LINE2,1)
    console.log('dataTles',dataTles)
    const inputsKA=document.querySelectorAll(`.flexKa > input`)
    Object.keys(dataTles).forEach((key)=>{
        inputsKA.forEach(elemKA=>{
            if(elemKA.id.slice(6).trim()===key){
                elemKA.value=dataTles[key];
            }
        })
    })
}
function updateTleData(){
    const arrValueDataKa= createArrValuesKa('.flexKa > input')
    const arrFieldsDataKa = createArrFieldsData('.flexKa > label')
    let newTleParam= createObjKa(arrValueDataKa,arrFieldsDataKa);
    console.log(newTleParam,'newTleParam');
    const tleData = DataTle.fromJSON(newTleParam);
    const tleLines=document.querySelectorAll('.flexTle > input');
// Генерируем TLE строки
    tleData.getAllTLEAsString();
    console.log('tleData',tleData);
    console.log("TLE Line 1:", tleData.TLE_LINE1);
    console.log("TLE Line 2:", tleData.TLE_LINE2);
    tleLines.forEach((inputLine,index)=>{
        if(index===0){
            inputLine.value=tleData.TLE_LINE1;
        }
        else {
            inputLine.value=tleData.TLE_LINE2;
        }
    })
}
function renderKaData(filtredData,parentElement,rusNames){
   console.log('filtredData ',filtredData);
    const elemKa=[];
    console.log('filtredData',filtredData);
    parentElement.innerHTML=``;
    filtredData.forEach(
        ka=>
            Object.keys(ka).forEach((key,index)=>{
                const dataKa=document.createElement('div');
                const elementLabelKa=document.createElement('label');
                const elementInputKa=document.createElement('input');
                dataKa.classList.add('flexKa')
                elementInputKa.value=ka[key];
                elementInputKa.name=`field-${key}`
                elementInputKa.id=`field-${key}`
                if (key===rusNames[index].name){
                    elementLabelKa.innerText=`${rusNames[index].description}: `;
                    elementInputKa.placeholder=rusNames[index].description;
                }
                elementLabelKa.htmlFor=`field-${key}`
                dataKa.append(elementLabelKa,elementInputKa);
                if (key==='TLE_LINE1' || key==='TLE_LINE2'){
                    const tleLines=document.getElementById('tle-Data')
                    elementLabelKa.innerText=`Строка ${key.at(-1)}: `;
                    if (key==='TLE_LINE1')
                    {
                        tleLines.innerHTML=``;
                    }
                    renderTleData(elementLabelKa,elementInputKa,tleLines)
                }
                else {
                    parentElement.append(dataKa);
                }

            }));

    // parentElement.append(...elemKa);
    console.log(elemKa);
    document.querySelector('#arrow-left').removeEventListener('click', updateKaData)
    document.querySelector('#arrow-right').removeEventListener('click', updateTleData)
    document.querySelector('#arrow-left').addEventListener('click', updateKaData)
    document.querySelector('#arrow-right').addEventListener('click', updateTleData)
}
function selectedKaList(selectElement){
    const kaList=document.querySelectorAll('.id-ka-list');
    kaList.forEach(listElement=>{
        if (listElement.innerHTML===selectElement.innerHTML) {
            selectElement.classList.add('selected');
        }
        else {
            listElement.classList.remove('selected');
        }
    })
}
function createArrValuesKa(selector){
    const arrValueData=[];
    document.querySelectorAll(`${selector}`).forEach((item,index)=>{
        if (!Number.isNaN(+item.value) && item.value!=='' && index!==4 && item.name!='field-TLE_INTERNATIONAL_CLASS'){
            arrValueData.push(+item.value)
        }
        else {
            arrValueData.push(item.value)
        }
    });
    return arrValueData
}
function  createArrFieldsData(selector){
    const arrFieldsData=[];
    document.querySelectorAll(`${selector}`).forEach(item=>{
        // arrFieldsData.push(item.innerHTML.replace(/:/g, "").trim())
        arrFieldsData.push(item.htmlFor.slice(6).trim())
    });

    return arrFieldsData;
}
function createObjKa(arrValueData,arrFieldsData){
    const objData={};
    for(let i=0;i < arrFieldsData.length;i++){
        if (arrValueData[i]!==''){
            objData[arrFieldsData[i]]=arrValueData[i];
        }
        else {
            objData[arrFieldsData[i]]=null;
        }
    }
    return objData;

}
document.addEventListener('DOMContentLoaded', async () => {
    try {
        let kaData = await getKa();
        let rusNames = await getRusName();
        console.log('rusNames',rusNames);
        const ids = getIdsKA(kaData);
        const kaList=document.querySelector('#ids-Ka')
        const kaListData=document.querySelector('#ka-Data')
        renderIdsKa(ids,kaList);
        console.log(kaData);
        let idKa=0;
        const btnSendKa=document.querySelector('#send-Ka')
        kaList.addEventListener('click',(e)=>{
            if (e.target.closest('.id-ka-list')){
                idKa=Number(e.target.innerHTML.slice(-2).trim())
                const filteredKa=filterKaDataForId(kaData,idKa);
                renderKaData(filteredKa,kaListData,rusNames)
                btnSendKa.disabled=false;
                selectedKaList(e.target)
            }
        })


        selectedKaList(document.querySelector('.id-ka-list'))
        idKa=Number(document.querySelector('.id-ka-list.selected').innerHTML.slice(-2).trim())
        renderKaData(filterKaDataForId(kaData,idKa),kaListData,rusNames)
        btnSendKa.disabled=false;
        btnSendKa.addEventListener('click',(e)=>{
            updateTleData()
            const arrValueData= createArrValuesKa('.flexTle > input')
            const arrFieldsData = createArrFieldsData('.flexTle > label')
            const objData= createObjKa(arrValueData,arrFieldsData);

            const dataTles =new DataTle()
            dataTles.setAllTLEParam(objData.TLE_LINE1,0)
            dataTles.setAllTLEParam(objData.TLE_LINE2,1)
            console.log('dataTles',dataTles)
            // updateKaData(dataTles);
            // updateTleData(objDataKa);
            console.log('objData',objData)
            console.log('arrFieldsData',arrFieldsData)
            console.log('arrValueData',arrValueData)
            editRow({updates: dataTles,where:{column: 'ID',operator: "=",value: idKa,}},'KA').then(async () => {
                kaData = await getKa()
            })
        })
        const recalculateBtn=document.querySelector('#recalc')
        recalculateBtn.addEventListener('click', recalculateKas)
        console.log(ids);
    } catch (error) {
        console.error('Ошибка:', error);
    }
});
