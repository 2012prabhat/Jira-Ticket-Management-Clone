let modal = document.querySelector(".modal-cont");
let add = document.querySelector(".add");
let del = document.querySelector(".del");
let textarea = document.querySelector(".textarea");
let mainCont = document.querySelector(".main-cont");
let temp = document.querySelector(".temp");
let modalColors = document.querySelectorAll(".mc");
let colors = document.querySelectorAll(".colors");
let col = "rgb(255, 107, 107)";
let removeFlag = false;
let ticketsArr = [];
add.addEventListener("click",handleAdd);
del.addEventListener("click",(e)=>{
    removeFlag = !removeFlag;
    del.style.backgroundColor = (del.style.backgroundColor)=="red"?"#576574":"red";
});


//load from local storage
if(localStorage.getItem("jira_tickets")){
    ticketsArr = JSON.parse(localStorage.getItem("jira_tickets"));
    for(let i=0;i<ticketsArr.length;i++){
        createTicket(ticketsArr[i].tickColor,ticketsArr[i].tickId,ticketsArr[i].tickText);
    }
}
// to set the color of ticket
for(let i=0;i<modalColors.length;i++){
modalColors[i].addEventListener("click",()=>{
    col = modalColors[i].getAttribute("color");
    modalColors[i].style.border = "6px solid white";
    for(let j=0;j<modalColors.length;j++){
        if(j!=i){
            modalColors[j].style.border = "none";
        }
    }
})
}

// to filter according to color
for(let i=0;i<colors.length;i++){
    colors[i].addEventListener("click",function(){
        let colorsName = colors[i].getAttribute("color");
        let filteredTick = ticketsArr.filter((ticketObj,idx)=>{
            return colorsName === ticketObj.tickColor;
        })
        // remove previous tickets
        let allTickets = document.querySelectorAll(".ticket");
        for(let i=0;i<allTickets.length;i++){
            allTickets[i].remove();
        }

        //show according to color
        for(let i=0;i<filteredTick.length;i++){
            createTicket(filteredTick[i].tickColor,filteredTick[i].tickId,filteredTick[i].tickText);
        }
        colors[i].style.border = "5px solid white";
        for(let j=0;j<colors.length;j++){
            if(i!=j){
                colors[j].style.border = "none";
            }
        }
    })
    colors[i].addEventListener("dblclick",function(){
        let allTickets = document.querySelectorAll(".ticket");
        colors[i].style.border = "none";
        for(let i=0;i<allTickets.length;i++){
            allTickets[i].remove();
        }
        for(let i=0;i<ticketsArr.length;i++){
            createTicket(ticketsArr[i].tickColor,ticketsArr[i].tickId,ticketsArr[i].tickText);
        }

    })
}

function createTicket(tickColor,tickId,tickText,){
    let  node =  temp.content.querySelector(".ticket");
    let ticket = node.cloneNode(true);
    let ticketText = ticket.querySelector(".ticket-text");
    let ticketColor = ticket.querySelector(".ticket-color");
    let ticketId = ticket.querySelector(".unique-id");
    ticketText.innerHTML = tickText;
    ticketColor.style.backgroundColor = tickColor;
    let id = tickId || shortid();
    ticketId.innerHTML = id;
    mainCont.appendChild(ticket);
    handleDel(ticket,id);
    handleLock(ticket,id);
    handleColor(ticket,id);
    if(!tickId) {
        ticketsArr.push({tickColor,tickId:id,tickText});
        localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr));
    }
}
function handleAdd(){
    add.style.backgroundColor = (add.style.backgroundColor)=="green"?"#576574":"green";
    if(del.style.backgroundColor == "red"){
        del.style.backgroundColor = "#576574";
        removeFlag = !removeFlag;
    }
    modal.style.display = modal.style.display=="flex"?"none":"flex";
    document.addEventListener("keydown",function(event){
        if(event.key=="Enter" &&  event.ctrlKey){
          let uniqueId;
          if(textarea.value.trim()=="") return;
           createTicket(col,uniqueId,textarea.value);
           textarea.value = "";
           modal.style.display = "none";
           add.style.backgroundColor = (add.style.backgroundColor)=="green"?"#576574":"green";
        }else if(event.key === "Escape"){
            modal.style.display = "none";
            textarea.value = "";
            add.style.backgroundColor = "#576574"

            
        }
    });
}

function handleDel(ticket,id){
    ticket.addEventListener("click", (e) => {
        if (!removeFlag) return;
        let idx = getTikcetIdx(id);
        ticketsArr.splice(idx,1); // local storage removal
        localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr));
        ticket.remove(); // ui removal

})
}


function getTikcetIdx(id) {
    let ticketIdx = ticketsArr.findIndex((ticketObj) => {
        return ticketObj.tickId === id;
    })
    return ticketIdx;
}


function handleLock(ticket,id){
    let lock = ticket.querySelector(".lock");
    let ticketText = ticket.querySelector(".ticket-text");
    let lockFlag = true;
    lock.addEventListener("click",()=>{
       let lockIcon = lock.querySelector(".lock-icon");
       let ticketIdx = getTikcetIdx(id);
       if(lockFlag==true){
           lockIcon.innerHTML = "lock_open";
           lockFlag = false;
           ticketText.setAttribute("contenteditable",true);
       }else{
        lockIcon.innerHTML = "lock";
        lockFlag = true;
        ticketText.setAttribute("contenteditable",false);
       }
    //    alert(ticketIdx);
       ticketsArr[ticketIdx].tickText = ticketText.innerText; 
       localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr));

    });

}
tickColorArr = ["rgb(255, 107, 107)","rgb(16, 172, 132)","rgb(30, 144, 255)","rgb(255, 159, 67)"];
function handleColor(ticket,id){
    let tickColor = ticket.querySelector(".ticket-color");
    let ticketIdx = getTikcetIdx(id);
    let color = 0;
    if(tickColor.style.backgroundColor =="rgb(255, 107, 107)") color = 1;
    tickColor.addEventListener("click",()=>{
        tickColor.style.backgroundColor = tickColorArr[color%4];
        color++;
        ticketsArr[ticketIdx].tickColor = tickColor.style.backgroundColor; 
        localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr))
    })
}