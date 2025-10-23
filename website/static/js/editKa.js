'use strict';
import {getRowsTable,editRow} from "./db.js";
import {DataTle} from "./DataTle.js";
async function getKa(){
    const dataKa = await getRowsTable('KA');
    return dataKa?.rows;
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
function renderKaData(filtredData,parentElement){
    const elemKa=[];
    parentElement.innerHTML=``;
    filtredData.forEach(
        ka=>
            Object.keys(ka).forEach(key=>{
                const dataKa=document.createElement('div');
                const elementLabelKa=document.createElement('label');
                const elementInputKa=document.createElement('input');
                dataKa.classList.add('flexKa')
                elementInputKa.value=ka[key];
                elementInputKa.placeholder=key;
                elementInputKa.name=`field-${key}`
                elementInputKa.id=`field-${key}`
                elementLabelKa.innerText=`${key}: `;
                elementLabelKa.htmlFor=`field-${key}`
                dataKa.append(elementLabelKa,elementInputKa);
                if (key==='TLE_LINE1' || key==='TLE_LINE2'){
                    elementLabelKa.innerText=`Строка ${key.at(-1)}: `;
                    parentElement.append(dataKa);
                }

            }));

    // parentElement.append(...elemKa);
    console.log(elemKa);
}
function createArrValuesKa(){
    const arrValueData=[];
    document.querySelectorAll('.flexKa > input').forEach((item,index)=>{
        if (!Number.isNaN(+item.value) && item.value!=='' && index!==4 ){
            arrValueData.push(+item.value)
        }
        else {
            arrValueData.push(item.value)
        }
    });
    return arrValueData
}
function  createArrFieldsData(){
    const arrFieldsData=[];
    document.querySelectorAll('.flexKa > label').forEach(item=>{
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
        const ids = getIdsKA(kaData);
        const kaList=document.querySelector('#ids-Ka')
        const kaListData=document.querySelector('#ka-Data')
        renderIdsKa(ids,kaList);
        console.log(kaData);
        let idKa;
        const btnSendKa=document.querySelector('#send-Ka')
        kaList.addEventListener('click',(e)=>{
            if (e.target.closest('.id-ka-list')){
                idKa=Number(e.target.innerHTML.slice(-2).trim())
                const filteredKa=filterKaDataForId(kaData,idKa);
                renderKaData(filteredKa,kaListData)
                btnSendKa.disabled=false;
                console.log(e.target.innerHTML);
            }
        })
        btnSendKa.addEventListener('click',(e)=>{
            const arrValueData= createArrValuesKa()
            const arrFieldsData = createArrFieldsData()
            const objData= createObjKa(arrValueData,arrFieldsData);

            console.log('TLE_LINE1',objData['TLE_LINE1'])
            const dataTles =new DataTle()
            dataTles.setAllTLEParam(objData.TLE_LINE1,0)
            dataTles.setAllTLEParam(objData.TLE_LINE2,1)
            console.log('dataTles',dataTles)
            console.log('objData',objData)
            console.log('arrFieldsData',arrFieldsData)
            console.log('arrValueData',arrValueData)
            editRow({updates: dataTles,where:{column: 'ID',operator: "=",value: idKa,}},'KA').then(async () => {
                kaData = await getKa()
            })
        })
        console.log(ids);
    } catch (error) {
        console.error('Ошибка:', error);
    }
});
