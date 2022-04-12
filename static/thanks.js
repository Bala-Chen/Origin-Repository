let nowUrl = window.location.href.split('=');
let orderId = nowUrl[1]

thanksApi()

function thanksApi(){
    fetch('/api/order/'+orderId)
    .then(function(res){
        return res.json()
    })
    .then(function(resJson){
        if (resJson.message == "未登入網站"){
            location.replace('/')
        } else if (resJson.data == null){
            nullData()
        } else {
            thanksTitle(resJson.data.number)
            orderTrip(resJson.data.trip,resJson.data.price)
            thanksEnd(resJson.data.contact.name)
        }
    })
}

//thanks title
function thanksTitle(orderId){
    const orderTitle = document.getElementById("order-trip-title");
    const orderTripH2 = document.createElement("h2");
    orderTripH2.textContent = "您的訂單編號為：" + orderId +"，以下為您的行程資訊" ;
    orderTitle.appendChild(orderTripH2);
}

//make booking trip block
function orderTrip(data,price){
    const orderTripArea = document.getElementById('order-trip');
    const bookingArea = document.createElement('div');
    const orderTripImg = document.createElement('img');
    const orderTripInfo = document.createElement('div');
    const orderTripH3 = document.createElement('h3');
    const orderTripH4Date = document.createElement('h4');
    const orderTripH4Time = document.createElement('h4');
    const orderTripH4Money = document.createElement('h4');
    const orderTripH4Address = document.createElement('h4');
    const orderTripSpanDate = document.createElement('span');
    const orderTripSpanTime = document.createElement('span');
    const orderTripSpanMoney = document.createElement('span');
    const orderTripSpanAddress = document.createElement('span');
    bookingArea.className = "booking";
    bookingArea.id = "order-trip";
    orderTripImg.src = data.attraction.image;    
    orderTripInfo.className = "booking-info";    
    orderTripH3.textContent = "台北一日遊：" + data.attraction.name;    
    orderTripH4Date.textContent = "日期：";
    orderTripH4Time.textContent = "時間：";
    orderTripH4Money.textContent = "費用：";
    orderTripH4Address.textContent = "地點：";
    orderTripSpanDate.textContent = data.date;
    if (data.time == "morning"){
        orderTripSpanTime.textContent = "早上 9 點到下午 2 點";
    } else {
        orderTripSpanTime.textContent = "下午 2 點到晚上 9 點";
    }
    orderTripSpanMoney.textContent = "新台幣 " + price +" 元";
    orderTripSpanAddress.textContent = data.attraction.address;
    orderTripH4Date.appendChild(orderTripSpanDate);
    orderTripH4Time.appendChild(orderTripSpanTime);
    orderTripH4Money.appendChild(orderTripSpanMoney);
    orderTripH4Address.appendChild(orderTripSpanAddress);
    orderTripInfo.appendChild(orderTripH3);
    orderTripInfo.appendChild(orderTripH4Date);
    orderTripInfo.appendChild(orderTripH4Time);
    orderTripInfo.appendChild(orderTripH4Money);
    orderTripInfo.appendChild(orderTripH4Address);
    bookingArea.appendChild(orderTripImg);
    bookingArea.appendChild(orderTripInfo);
    orderTripArea.appendChild(bookingArea);
}

//thanks end
function thanksEnd(){
    const orderTripArea = document.getElementById('order-trip');
    const thanksEndBlock = document.createElement('div');
    const thanksH2 = document.createElement("h2");
    thanksEndBlock.className = "thank-end"
    thanksH2.textContent ="感謝您的購買，之後可至會員中心確認訂單！";
    thanksEndBlock.appendChild(thanksH2);
    orderTripArea.appendChild(thanksEndBlock);
    const footerH3 = document.getElementById('footer-block-h3');
    footerH3.style.marginBottom = "600px";
}

//response null
function nullData(){
    const orderTripArea = document.getElementById('order-trip');
    const thanksEndBlock = document.createElement('div');
    const thanksH2 = document.createElement("h2");
    thanksEndBlock.className = "thank-end"
    thanksH2.textContent = "無此訂單";
    thanksEndBlock.appendChild(thanksH2);
    orderTripArea.appendChild(thanksEndBlock);
    const footerH3 = document.getElementById('footer-block-h3');
    footerH3.style.marginBottom = "826px";
    document.body.classList.add("stop-scroll");
}