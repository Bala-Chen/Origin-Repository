function getOrderList(email){
    const memberOptions = {
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({email:email})
    };
    fetch('/api/memberorder',memberOptions)
    .then(function(res){
        return res.json()
    })
    .then(function(resJson){
        if (resJson.data != null){
            createOrderList(resJson.data)
            if (resJson.data.length < 10){
                const footerH3 = document.getElementById('footer-block-h3');
                footerH3.style.marginBottom = "506px";
            }
        }
        else{
            nullOrder()
        }
    })
}

getUser()

function getUser(){
    fetch("/api/user")
    .then(function(res){
        return res.json()
    })
    .then(function(resJson){
        if (resJson.data != null){
            getOrderList(resJson.data.email)
            getNameEmail(resJson.data)
        } else {
            location.replace('/')
        }
    })
}

function getNameEmail(data){
    const nameLi = document.getElementById('name-li');
    const emailLi = document.getElementById('email-li');
    nameLi.textContent = data.name;
    emailLi.textContent = data.email;
}

function createOrderList(data){
    const memberContainer = document.getElementById('member-area');
    memberContainer.style.display = "block"
    for (i=0;i<data.length;i++){
        const orderList = document.getElementById('order-list');
        const memberOrder = document.createElement('div');
        const orderNum = document.createElement('div');
        const status = document.createElement('div');
        const attractionName = document.createElement('div');
        const travelDate = document.createElement('div');
        memberOrder.className = "member-order";
        memberOrder.id = "member-order-"+i;
        orderNum.className="member-order-li";
        status.className="member-order-li";
        attractionName.className="member-order-li";
        travelDate.className="member-order-li";
        orderNum.textContent=data[i].order_number;
        status.textContent=data[i].payment_status;
        attractionName.textContent=data[i].attraction_name;
        travelDate.textContent=data[i].travel_date;
        memberOrder.appendChild(orderNum);
        memberOrder.appendChild(status);
        memberOrder.appendChild(attractionName);
        memberOrder.appendChild(travelDate);
        memberOrder.addEventListener("click",replaceOrder.bind(null,data[i].order_number))
        orderList.appendChild(memberOrder);
    }
}

function nullOrder(){
    const memberContainer = document.getElementById('member-area');
    memberContainer.style.display = "block"
    const memberOrderTitle=document.getElementById("member-order-title");
    memberOrderTitle.style.display = "none";
    const nullData = document.createElement('div');
    nullData.className = "null-order";
    nullData.textContent = "沒有訂單？趕緊預定";
    memberContainer.appendChild(nullData);
    const footerH3 = document.getElementById('footer-block-h3');
    footerH3.style.marginBottom = "506px";
}

function replaceOrder(orderID){
    location.replace('/thankyou?number='+orderID)
}

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