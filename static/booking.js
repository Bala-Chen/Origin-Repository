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


//tappay
TPDirect.setupSDK(123965,'app_NZdIqFBF7UBPGClOer5Nt4ZinS3qCQKtYO6lC5lNcOIJYb7ZE6VhfrhkpjbE', 'sandbox')
TPDirect.card.setup({
    fields: {
        number: {
            element: '.form-control.card-number',
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            element: document.getElementById('tappay-expiration-date'),
            placeholder: 'MM / YY'
        },
        ccv: {
            element: '#card-ccv',
            placeholder: 'CVV'
        }
    },
    styles: {
        'input': {
            'color': 'gray',
            'font-size': '16px'
        },
        'input.ccv': {
            'font-size': '16px'
        },
        ':focus': {
            'color': 'black'
        },
        '.valid': {
            'color': 'green'
        },
        '.invalid': {
            'color': 'red'
        },
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    }
})

const paySubmit = document.getElementById('pay-submit')
TPDirect.card.onUpdate(function (update) {
    if (update.canGetPrime) {
        paySubmit.removeAttribute('disabled')
    } else {
        paySubmit.setAttribute('disabled', true)
    }
})

paySubmit.addEventListener("click",onSubmit)
function onSubmit(event) {
    event.preventDefault();
    const cardErr = document.getElementById('card-err-msg');
    const tappayStatus = TPDirect.card.getTappayFieldsStatus();

    if (tappayStatus.canGetPrime === false) {
        cardErr.textContent = '無法正確送出資料';
        return
    }

    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            cardErr.textContent ='取得prime error原因' + result.msg;
            return
        }
                
        cardErr.textContent = ''
        const errMsg = document.getElementById('input-err-msg');
        const prime = result.card.prime;
        const bookingName = document.getElementById('booking-name').value;
        const bookingEmail = document.getElementById('booking-email').value;
        const bookingPhone = document.getElementById('booking-phone').value;
        const emailRe = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
        const phoneRe = /^([-_－—\s\(]?)([\(]?)((((0?)|((00)?))(((\s){0,2})|([-_－—\s]?)))|(([\)]?)[+]?))(886)?([\)]?)([-_－—\s]?)([\(]?)[0]?[1-9]{1}([-_－—\s\)]?)[1-9]{2}[-_－—]?[0-9]{3}[-_－—]?[0-9]{3}$/;
        if (bookingName == "" || bookingEmail == "" || bookingPhone == ""){
            errMsg.textContent = "姓名，信箱，手機不得為空";
        } else if (bookingPhone.search(phoneRe)== -1){
            errMsg.textContent = "手機格式有誤";
        } else if (bookingEmail.search(emailRe)== -1){
            errMsg.textContent = "信箱格式有誤"
        } else {
            fetch("/api/booking")
            .then(function(res){
                return res.json()
            })
            .then(function(resJson){
                const orderAttraction = resJson.data.attraction;
                const orderDate = resJson.data.date;
                const orderPrice = resJson.data.price;
                const orderTime = resJson.data.time;
                const payOptions = {
                    method:"POST",
                    headers: {"Content-Type":"application/json"},
                    body: JSON.stringify({
                        prime:prime,
                        order:{
                            price:orderPrice,
                            trip:{
                                attraction:orderAttraction,
                                date:orderDate,
                                time:orderTime
                            },
                            contact:{
                                name:bookingName,
                                email:bookingEmail,
                                phone:bookingPhone
                            }
                        }
                    })
                }
                fetch('/api/orders',payOptions)
                .then(function(res){
                    return res.json()
                })
                .then(function(resJson){
                    if (resJson.data.payment.status == 0){
                        location.replace("/thankyou?number="+parseInt(resJson.data.number));
                    } else if (resJson.error == true){
                        const backMsg = document.getElementById("backend-err-msg");
                        backMsg.textContent = resJson.message;
                    }
                })
            })
        }
    })
}
