let name = null;
let roomNo = null;
let socket = io();


const service_url = 'https://kgsearch.googleapis.com/v1/entities:search';
const apiKey= 'AIzaSyAG7w627q-djB4gTTahssufwNOImRqdYKM';

/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init() {
    // it sets up the interface so that userId and room are selected
    document.getElementById('initial_form').style.display = 'block';
    document.getElementById('chat_interface').style.display = 'none';

    //@todo here is where you should initialise the socket operations as described in teh lectures (room joining, chat message receipt etc.)
    initReportSocket();

}

/**
 * called to generate a random room number
 * This is a simplification. A real world implementation would ask the server to generate a unique room number
 * so to make sure that the room number is not accidentally repeated across uses
 */
function generateRoom() {
    roomNo = Math.round(Math.random() * 10000);
    document.getElementById('roomNo').value = 'R' + roomNo;
}

/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText() {
    let chatText = document.getElementById('chat_input').value;
    // @todo send the chat message
    socket.emit('chat',roomNo,name,chatText);
}

/**
 * used to connect to a room. It gets the user name and room number from the
 * interface
 */
function connectToRoom() {
    roomNo = document.getElementById('roomNo').value;
    name = document.getElementById('name').value;
    let imageUrl= document.getElementById('image_url').value;

    if (!name) name = 'Unknown-' + Math.random();
    //@todo join the room
    socket.emit('create or join', roomNo, name, imageUrl);

    hideLoginInterface(roomNo, name);
}

function initReportSocket(){
    socket.on('joined',function (room, userId, imageURL){

        if (userId===name){
            hideLoginInterface(room,userId);
            cursorGetDataByIndex(userId)
                .then(response => console.log('inserting worked!!'))
                .catch(error => console.log("error  inserting: "+ JSON.stringify(error)))

        }
        else{
            writeOnHistory('<b>' + userId + '</b>' + ' joined room ' + room);
        }

        let imageTitle="Report " + 'by ' + '<b>' + userId + '</b>' + ' on ' + (new Date().toLocaleDateString())+'<br>';
        document.getElementById('imageTitle').innerHTML=imageTitle;

        initCanvas(socket, imageURL, userId);

    });

    socket.on('chat',function (room,userId,chatText){
        let  who=userId
        let text = '<b>' + who + ':</b> ' + chatText
        if (userId===name)  who="Me";
        writeOnHistory(text);

        storeTextData({userId:  userId, text: text})
            .then(response => console.log('inserting worked!!'))
            .catch(error => console.log("error  inserting: "+ JSON.stringify(error)))

    })

    /**
     *  Socket to sync the Searching Panel
     * */
    socket.on('searchPanel',function (room,name,resultId,resultName,resultImg,resultDescription,resultUrl,resultPanel){
        document.getElementById('resultId').innerText= resultId;
        document.getElementById('resultName').innerText= resultName;
        //document.getElementById('resultImg').src=resultImg;
        initResultCanvas(socket,resultImg);
        document.getElementById('resultDescription').innerText= resultDescription;
        document.getElementById("resultUrl").href= resultUrl;
        document.getElementById('resultPanel').style.display= resultPanel;
        writeOnHistory('<b>' + name + ':</b> ' + ' Has pushed a new searching result about '+'<b>'+resultName+'</b>'+' to the Panel');
        storeGraphData({resultId:  resultId, resultName: resultName,resultDescription: resultDescription,resultUrl: resultUrl,resultPanel: resultPanel})
            .then(response => console.log('inserting worked!!'))
            .catch(error => console.log("error  inserting: "+ JSON.stringify(error)))



    });

}

/**
 * it appends the given html text to the history div
 * this is to be called when the socket receives the chat message (socket.on ('message'...)
 * @param text: the text to append
 */
function writeOnHistory(text) {
    if (text==='') return;


    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    // scroll to the last element
    history.scrollTop = history.scrollHeight;
    document.getElementById('chat_input').value = '';
}

/**
 * it hides the initial form and shows the chat
 * @param room the selected room
 * @param userId the user name
 */
function hideLoginInterface(room, userId) {
    document.getElementById('initial_form').style.display = 'none';
    document.getElementById('chat_interface').style.display = 'block';
    document.getElementById('who_you_are').innerHTML= userId;
    document.getElementById('in_room').innerHTML= ' '+room;
}

/**
 * it inits the widget by selecting the type from the field myType
 * and it displays the Google Graph widget
 * it also hides the form to get the type
 */
function widgetInit(){
    let type= document.getElementById("myType").value;
    if (type) {
        let config = {
            'limit': 10,
            'languages': ['en'],
            'types': [type],
            'maxDescChars': 100,
            'selectHandler': selectItem,
        }
        KGSearchWidget(apiKey, document.getElementById("myInput"), config);
        document.getElementById('typeSet').innerHTML= 'of type: '+type;
        document.getElementById('widget').style.display='block';
        //document.getElementById('typeForm').style.display= 'none';
    }
    else {
        alert('Set the type please');
        document.getElementById('widget').style.display='none';
        document.getElementById('resultPanel').style.display='none';
        document.getElementById('typeSet').innerHTML= '';
        document.getElementById('typeForm').style.display= 'block';
    }
}

/**
 * callback called when an element in the widget is selected
 * @param event the Google Graph widget event {@link https://developers.google.com/knowledge-graph/how-tos/search-widget}
 */
function selectItem_old(event){
    let row= event.row;
    // document.getElementById('resultImage').src= row.json.image.url;
    document.getElementById('resultId').innerText= 'id: '+row.id;
    document.getElementById('resultName').innerText= row.name;
    document.getElementById('resultImg').src=row.json.image.contentUrl;
    document.getElementById('resultDescription').innerText= row.rc;
    document.getElementById("resultUrl").href= row.qc;
    document.getElementById('resultPanel').style.display= 'block';
}

function selectItem(event){
    let row = event.row;

    let resultId='id: '+row.id;
    let resultName=row.name;
    let resultImg=row.json.image.contentUrl;
    let resultDescription=row.rc;
    let resultUrl=row.qc;
    let resultPanel='block';

    socket.emit('Search',roomNo,name,resultId,resultName,resultImg,resultDescription,resultUrl,resultPanel)
}

