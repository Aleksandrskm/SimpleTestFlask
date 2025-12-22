'use strict'
import {getAllUsers,getActiveSessions,postUsersActivity} from "./db.js";
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    return (
        [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('-') +
        ' ' +
        [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            // padTo2Digits(date.getSeconds()),  // 👈️ can also add seconds
        ].join(':')
    );
}

const renderActiveSessions= (activeSessions)=>{
    if (activeSessions.length === 0){
        const logSessionsElement=document.createElement('div');
        logSessionsElement.classList.add('active-session');
        logSessionsElement.innerText=`В данный момент нет активных сессий`
        return [logSessionsElement]
    }
    const activeSessionElements=[];
    activeSessions.map(session=>{
        activeSessionElements.push(renderActiveSession(session))
    })
    return activeSessionElements;
}
const renderActiveSession= ({ID:id,ID_AUTH_USERS: idAuthUser,DATA_BEG: dataBeg,DATA_END:dataEnd})=>{
    const sessionElement = document.createElement('div');
    sessionElement.classList.add('active-session');
    sessionElement.insertAdjacentHTML('afterbegin', `
        <div>Идентификатор сессии: ${id}</div>
        <div>Идентификатор пользователя: ${idAuthUser}</div>
        <div>Время начала сессии: ${dataBeg}</div>
        <div>Время завершения сессии: ${dataEnd}</div>
    `);
    return sessionElement;
}
const renderUserElem=(id,name)=>{
    const userElement=document.createElement('option');
    userElement.classList.add('user');
    // userElement.insertAdjacentHTML('afterbegin', `
    //     <div>Идентификатор пользователя: ${id}</div>
    // `)
    userElement.setAttribute('value',id);
    userElement.innerText=name;
    return userElement;

}
const renderAllUsers= (users)=>{
    const allUsersElements= document.createElement('select');
    allUsersElements.id='users-select'
    allUsersElements.innerHTML=`<option class="user" value="-1">Все пользователи</option>`;
    for (const [id, name] of Object.entries(users)) {
        allUsersElements.append(renderUserElem(id,name));
    }
    return allUsersElements;
}
const renderUserElement=(id,name)=>{
    const userElement=document.createElement('div');
    userElement.classList.add('user');
    userElement.insertAdjacentHTML('afterbegin', `
        <div class="id-user">ID: ${id}</div>
        <div>Инициалы: ${name}</div>
    `)
    return userElement;

}
const renderAllUsersElements= (users)=>{
    const allUsersElements= document.createElement('div');
    allUsersElements.id='users-data'
    for (const [id, name] of Object.entries(users)) {
        allUsersElements.append(renderUserElement(id,name));
    }
    return allUsersElements;
}
function renderInputsTimeDate(){
    const currentDate = new Date();
    const endDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1);
    const [dateStart, timeStart] = formatDate(currentDate).split(' ');
    const [dateEnd, timeEnd] = formatDate(endDate).split(' ');
    const dateStartInput = document.getElementById('start-date');
    const dateEndInput = document.getElementById('end-date');
    const timeStartInput = document.getElementById('start-date-time');
    const timeEndInput = document.getElementById('end-date-time');
    dateStartInput.value = dateStart;
    dateEndInput.value = dateEnd;
    timeStartInput.value = timeStart;
    timeEndInput.value = timeEnd;
    console.log(timeToUtcIso(dateStartInput.value,timeStartInput.value))
}
function timeToUtcIso(dateStr, timeStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);
    const moscowDate = new Date(year, month - 1, day, hours, minutes, 0, 0);

    return moscowDate.toISOString();
}
function renderActivitySession(session){
    const divSessionElement=document.createElement('div');
    const startSessionElement=document.createElement('div');
    const endSessionElement=document.createElement('div');
    const durSessionElement=document.createElement('div');
    startSessionElement.innerText+=`Время начала сессии: ${session['DATA_BEG']}`
    endSessionElement.innerText+=`Время завершения сессии: ${session['DATA_END']}`
    durSessionElement.innerText+=`Продолжительность сессии: ${session['DURATION']} ,сек`
    divSessionElement.classList.add('activity-session');
    divSessionElement.append(startSessionElement, endSessionElement, durSessionElement);
    return divSessionElement;
}
function renderAllActivitySession(activityValue){
    let arrSessions= [];
    activityValue['intervals'].forEach(session => {
        arrSessions.push(renderActivitySession(session));
    })
    const totalDurElement= document.createElement('div');
    totalDurElement.classList.add('total-session');
    totalDurElement.innerText=`Общее время всех сессий: ${activityValue['total_duration']} ,сек`
   return[arrSessions, totalDurElement];
}
async  function showActivity(){
    const dateStartInput = document.getElementById('start-date').value;
    const dateEndInput = document.getElementById('end-date').value;
    const timeStartInput = document.getElementById('start-date-time').value;
    const timeEndInput = document.getElementById('end-date-time').value;
    const dateStart=timeToUtcIso(dateStartInput,timeStartInput);
    const dateEnd=timeToUtcIso(dateEndInput,timeEndInput);
    const select = document.getElementById('users-select');
    const selectedOption = select.options[select.selectedIndex];
    let idUser=selectedOption.value;
    if (idUser == -1) {
        idUser=[]
    }
    else {
        idUser=[idUser]
    }
    const activity = await postUsersActivity(idUser,dateStartInput,dateEndInput);
    renderActivityUsers(activity)
}
function renderActivityUsers(activity){
    if (Object.keys(activity).length == 0) {
        document.getElementById('activity').innerHTML=``;
        const logSessionsElement=document.createElement('div');
        logSessionsElement.classList.add('active-session');
        logSessionsElement.innerText=`У выбранного пользователя нет данных активности`
        document.getElementById('activity').append(logSessionsElement)
    }
    else {
        document.getElementById('activity').innerHTML=``;
        const activityElements=[];
        Object.entries(activity).forEach(([key,value]) => {
            const activityElement=document.createElement('div');
            const activityUserElement=document.createElement('div');
            activityUserElement.classList.add('activity-user');
            activityUserElement.innerText=`Пользователь: ${key}`;
            const[sessionsElement,totalDurElement]=renderAllActivitySession(value)
            activityElement.append(activityUserElement,...sessionsElement,totalDurElement)
            activityElement.classList.add('activity-data');
            activityElements.push(activityElement);
        })
        document.getElementById('activity').append(...activityElements)
    }


}
document.addEventListener('DOMContentLoaded', async () => {
    renderInputsTimeDate();
    let activeSessions = await getActiveSessions();
    const users = await getAllUsers();

    console.log('users: ',users);
    console.log('activeSessions: ',activeSessions);
    document.getElementById('active-sessions').append(...renderActiveSessions(activeSessions));
    document.getElementById('select-users').append(renderAllUsers(users));
    document.getElementById('all-users').append(renderAllUsersElements(users));
     await showActivity()
    document.getElementById('refresh-sessions').addEventListener('click', async () => {
        activeSessions = await getActiveSessions();
        document.getElementById('active-sessions').innerHTML = `<div class="csus">Активные сессии</div>`;
        document.getElementById('active-sessions').append(...renderActiveSessions(activeSessions));
    })
    document.getElementById('activity-btn').addEventListener('click', showActivity);
})