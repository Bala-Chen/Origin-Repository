//make booking trip block
function scheduleTrip(data){
    const scheduleTripArea = document.getElementById('schedule-trip');
    const bookingArea = document.createElement('div');
    const bookingImg = document.createElement('img');
    const bookingInfo = document.createElement('div');
    const bookingH3 = document.createElement('h3');
    const trashcanBlock = document.createElement('div');
    const trashcan = document.createElement('img');
    const bookingH4Date = document.createElement('h4');
    const bookingH4Time = document.createElement('h4');
    const bookingH4Money = document.createElement('h4');
    const bookingH4Address = document.createElement('h4');
    const bookingSpanDate = document.createElement('span');
    const bookingSpanTime = document.createElement('span');
    const bookingSpanMoney = document.createElement('span');
    const bookingSpanAddress = document.createElement('span');
    bookingArea.className = "booking";
    bookingArea.id = "booking";
    bookingImg.src = data.attraction.image;    
    bookingInfo.className = "booking-info";    
    bookingH3.textContent = "台北一日遊：" + data.attraction.name;    
    trashcanBlock.className = "trashcan";
    trashcanBlock.id = "trashcan";    
    trashcan.src = "/static/img/icon_delete.png";
    bookingH4Date.textContent = "日期：";
    bookingH4Time.textContent = "時間：";
    bookingH4Money.textContent = "費用：";
    bookingH4Address.textContent = "地點：";
    bookingSpanDate.textContent = data.date;
    if (data.time == "morning"){
        bookingSpanTime.textContent = "早上 9 點到下午 2 點";
    } else {
        bookingSpanTime.textContent = "下午 2 點到晚上 9 點";
    }
    bookingSpanMoney.textContent = "新台幣 " + data.price +" 元";
    bookingSpanAddress.textContent = data.attraction.address;
    bookingH4Date.appendChild(bookingSpanDate);
    bookingH4Time.appendChild(bookingSpanTime);
    bookingH4Money.appendChild(bookingSpanMoney);
    bookingH4Address.appendChild(bookingSpanAddress);
    bookingInfo.appendChild(bookingH3);
    bookingInfo.appendChild(bookingH4Date);
    bookingInfo.appendChild(bookingH4Time);
    bookingInfo.appendChild(bookingH4Money);
    bookingInfo.appendChild(bookingH4Address);
    bookingArea.appendChild(bookingImg);
    bookingArea.appendChild(bookingInfo);
    trashcanBlock.appendChild(trashcan);
    bookingArea.appendChild(trashcanBlock);
    scheduleTripArea.appendChild(bookingArea);
    trashcanBlock.addEventListener("click",deleteBooking);
}

//if member to booking no booking trip
function noScheduleTrip(){
    const scheduleTripArea = document.getElementById('schedule-trip');
    const bookingNull = document.createElement('div');
    const bookingSpan = document.createElement('span');
    const footerH3 = document.getElementById('footer-block-h3');
    footerH3.style.marginBottom = "806px";
    bookingNull.className = "booking-null";
    bookingNull.id = "booking-null"
    bookingNull.appendChild(bookingSpan);
    bookingSpan.textContent = "目前沒有任何待預訂的行程";
    scheduleTripArea.appendChild(bookingNull);

}

//booking trip price block
function bottomRightPrice(price){
    const bottomRight = document.getElementById('right-block-h3');
    bottomRight.textContent = "總價：新台幣 "+ price +" 元";
}

function bookingData(){
    fetch("/api/booking")
    .then(function(res){
        return res.json()
    })
    .then(function(resJson){
        if (resJson.error == true){
            location.replace("/");
        } else {
            const writeBlock = document.getElementById('write-area');
            const footerH3 = document.getElementById('footer-block-h3');
            if(resJson.data != null){
                scheduleTrip(resJson.data)
                bottomRightPrice(resJson.data.price)
                footerH3.style.marginBottom = "45px";
                writeBlock.style.display = "block";
            } 
            else {
                noScheduleTrip()
            }
        }
    })
}

window.addEventListener("load",bookingData)


//delete booking
function deleteBooking(){
    fetch("/api/booking",{method: 'DELETE'})
    .then(function(res){
        return res.json()
    })
    .then(function(resJson){
        if (resJson.ok == true){
            location.reload();
        } 
    })
}
