
//點擊登入註冊功能
const loginBtn = document.getElementById('login-and-regiseter');
const grayBlock = document.getElementById('gray-block');
const loginBlock = document.getElementById('login-block');
const registerBlock = document.getElementById('register-block');
const checkRegisterBtn = document.getElementById('check-register');
const checkLoginBtn = document.getElementById('check-login');
const regiseterClose = document.getElementById('close-img2');
const loginClose = document.getElementById('close-img');

function login(){
    grayBlock.style.display = "block";
    loginBlock.style.display = "block";
    document.body.classList.add("stop-scroll");
}
function loginToWindow(){
    if(grayBlock.style.display == "block"){
        grayBlock.style.display = "none";
        loginBlock.style.display = "none";
        registerBlock.style.display = "none";
        document.body.classList.remove("stop-scroll");
    }
}
function loginToRegister(){
    loginBlock.style.display ="none";
    registerBlock.style.display = "block";
    const pMessage = document.getElementById("registerMessage"); 
    pMessage.innerHTML=""
}

function registerToLogin(){
    registerBlock.style.display = "none";
    loginBlock.style.display ="block";
    const pMessage = document.getElementById("loginMessage");
    pMessage.innerHTML=""
}

loginBtn.addEventListener("click",login);
grayBlock.addEventListener("click",loginToWindow);
checkRegisterBtn.addEventListener("click",loginToRegister);
checkLoginBtn.addEventListener("click",registerToLogin);
regiseterClose.addEventListener("click",loginToWindow);
loginClose.addEventListener("click",loginToWindow);

//送資訊給後端(註冊)
function clickRegisterBtn(){
    const registerNameEle = document.getElementById('register-name');
    const registerEmailEle = document.getElementById('register-email');
    const registerPwdEle = document.getElementById('register-password');
    const registerName = registerNameEle.value;
    const registerEmail = registerEmailEle.value;
    const registerPwd = registerPwdEle.value;
    const registerOptions = {
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({name:registerName,email:registerEmail,password:registerPwd})
    };
    const f = fetch("/api/user",registerOptions);

    f
    .then(function(res){
        return res.json();
    })
    .then(function(reJson){
        const pMessage = document.getElementById("registerMessage"); 
        if (Object.keys(reJson)[0] == "ok"){
            pMessage.textContent = "註冊成功";
            registerNameEle.value = "";
            registerEmailEle.value = "";
            registerPwdEle.value = "";
        }else{
            pMessage.textContent = Object.values(reJson)[1];
            registerNameEle.value = "";
            registerEmailEle.value = "";
            registerPwdEle.value = "";
        }
    })
}

const registerBtn = document.getElementById('register-submit')
registerBtn.addEventListener("click",clickRegisterBtn)

//送資訊給後端(登入)
function clickLoginBtn(){
    const loginEmailEle = document.getElementById('login-email');
    const loginPwdEle = document.getElementById('login-password');
    const loginEmail = loginEmailEle.value;
    const loginPwd = loginPwdEle.value;
    const loginOptions = {
        method:"PATCH",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({email:loginEmail,password:loginPwd})
    };
    const f = fetch("/api/user",loginOptions);

    f
    .then(function(res){
        return res.json();
    })
    .then(function(reJson){
        const pMessage = document.getElementById("loginMessage"); 
        if (Object.keys(reJson)[0] == "ok"){
            location.reload();
        }else{
            pMessage.textContent = Object.values(reJson)[1];
            loginEmailEle.value = "";
            loginPwdEle.value = "";
        }
    })
}

const loginButton = document.getElementById('login-submit')
loginButton.addEventListener("click",clickLoginBtn)

//頁面載入使用者狀態
const memberli = document.getElementById('memberli')
const loginli = document.getElementById("loginli")
function getUser(){
    fetch("/api/user")
    .then(function(res){
        return res.json()
    })
    .then(function(resJson){
        if (resJson.data != null){
            loginli.style.display = "none";
            memberli.style.display = "inline-block";
        } else {
            loginli.style.display = "inline-block";
            memberli.style.display = "none";
        }
        return resJson.data
    })
    .then(function(reData){
        let urlFinal = (window.location.href).split('/')
        if (urlFinal[3] == "booking"){
            bookingTitle(reData.name);
            bookingUser(reData.name,reData.email)
        }
    })
}
window.addEventListener("load",getUser)


//enter member page
function memberPage(){
    location.replace('/member')
}
const memberBtn = document.getElementById('member-btn')
memberBtn.addEventListener('click',memberPage)


//enter booking
function enterBooking(){
    fetch("/api/user")
    .then(function(res){
        return res.json()
    })
    .then(function(resJson){
        if (resJson.data != null){
            location.replace("/booking");
        } else {
            login()
        }
    })
}
const enterBookingBtn = document.getElementById('check-booking')
enterBookingBtn.addEventListener("click",enterBooking)

//booking 頁面開頭
function bookingTitle(name){
    const scheduleTitle = document.getElementById("booking-title");
    const scheduleTripH2 = document.createElement("h2");
    scheduleTripH2.textContent = "您好，" + name + "，待預定的行程如下：";
    scheduleTitle.appendChild(scheduleTripH2);
}

//booking 套入資訊
function bookingUser(name,email){
    const bookingName = document.getElementById('booking-name');
    const bookingEmail = document.getElementById('booking-email');
    bookingName.value = name;
    bookingEmail.value = email;
}

//attraction to booking
const today = new Date();
const bookingBtn = document.getElementById("booking-btn");
function madeBooking(){
    let attractionID = lastNum;
    const dateInput = document.getElementById("choose-date");
    const timeCheck = document.getElementsByName("time");
    const errorBooking = document.getElementById("booking-error");
    let dateInputValue = dateInput.value;
    const chooseDate = new Date(dateInputValue);
    let timeCheckValue;
    for (let i = 0; i < timeCheck.length; i++){
        if (timeCheck[i].checked == true){
            timeCheckValue = timeCheck[i].value;
            break;
        }    
    }
    if (dateInputValue == ""){
        errorBooking.textContent = "請點選日期";
    }
    else if(today > chooseDate){
        errorBooking.textContent = "不可選擇已過或當天日期";
    }
    else {
        let cost;
        if (timeCheckValue == "morning"){
            cost = 2000;
        } else if (timeCheckValue == "afternoon") {
            cost = 2500;
        }
        const bookingOptions = {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({attractionId:attractionID,date:dateInputValue,time:timeCheckValue,price:cost})
        };

        fetch("/api/booking",bookingOptions)
        .then(function(res){
            return res.json()
        })
        .then(function(resJson){
            if (resJson.ok == true){
                location.replace("/booking");
            }else if (resJson.message == "未登入系統，拒絕存取") {
                login();
            }else{
                errorBooking.textContent = resJson.message;
            }
        })
    }
}
if (window.location.href.split('/')[3] == "attraction"){
    bookingBtn.addEventListener("click",madeBooking)
}

