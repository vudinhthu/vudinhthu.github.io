const hr = document.querySelector(".hr");
const mn = document.querySelector(".mn");
const sc = document.querySelector(".sc");

setInterval(() => {
    let date = new Date;
    let hh = date.getHours() * 30; //each hour is 30 deg
    let min = date.getMinutes() * 6;
    let ss = date.getSeconds() * 6;
    hr.style.transform = `rotateZ(${hh+(min/12)}deg)`;
    mn.style.transform = `rotateZ(${min}deg)`;
    sc.style.transform = `rotateZ(${ss}deg)`;
},1000);