
//點擊登入註冊功能
const loginBtn = document.getElementById('login-and-regiseter');
const grayBlock = document.getElementById('gray-block');
const loginBlock = document.getElementById('login-block');
const registerBlock = document.getElementById('register-block');
const checkRegisterBtn = document.getElementById('check-register');
const checkLoginBtn = document.getElementById('check-login');
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
}

function registerToLogin(){
    registerBlock.style.display = "none";
    loginBlock.style.display ="block";
}

loginBtn.addEventListener("click",login);
grayBlock.addEventListener("click",loginToWindow);
checkRegisterBtn.addEventListener("click",loginToRegister);
checkLoginBtn.addEventListener("click",registerToLogin);

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
            pMessage.textContent = "註冊成功"
        }else{
            pMessage.textContent = Object.values(reJson)[1];
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
const logoutli = document.getElementById("logoutli")
const loginli = document.getElementById("loginli")
function getUser(){
    fetch("/api/user")
    .then(function(res){
        return res.json()
    })
    .then(function(resJson){
        if (resJson.data != null){
            loginli.style.display = "none";
            logoutli.style.display = "inline-block";
        } else {
            loginli.style.display = "inline-block";
            logoutli.style.display = "none";
        }
    })
}
window.addEventListener("load",getUser)


//登出
function delSession(){
    fetch("/api/user",{method: 'DELETE'})
    .then(function(res){
        return res.json()
    })
    .then(function(resJson){
        if (Object.keys(resJson)[0] == "ok"){
            location.reload();
        }
    })
}
const logoutBtn = document.getElementById("logout")
logoutBtn.addEventListener("click",delSession)