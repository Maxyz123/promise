/**
 * Create a new report
 * @param url image url
 * @param data image data
 */
function sendAxiosQuery(url, data) {
    if(url=='/newReport'){
        axios.post(url, data)
            .then((dataR) => {
                var dataArr = JSON.parse(JSON.stringify(dataR.data));
                alert('New report: '+dataArr.report_title+' by Author '+ dataArr.author_name+'. Time: '+dataArr.date)
            })
            .catch(function (response) {
                alert(response.toJSON());
            })
    }

    else if (url=='/mainPage'){
        axios.post(url, data)
            .then((dataR) => {
                var dataArr = JSON.parse(JSON.stringify(dataR.data));
                for (i in dataArr){
                    let title = dataArr[i]["author_name"]+" reported "+ dataArr[i]["report_title"] +
                        " at " + dataArr[i]["date"];
                    let text = dataArr[i]["report_text"];
                    let imgUrl = dataArr[i]["image_url"]
                    let id = dataArr[i]["_id"];

                    let dashBoard = document.getElementById('dashBoard');


                    let paragraphTitle = document.createElement('h3');
                    let paragraphText = document.createElement('p');
                    let paragraphImg = document.createElement('img');
                    paragraphTitle.innerHTML = '<br>'+title+'<br>';
                    paragraphText.innerHTML = text+'<br>';
                    paragraphImg.src = imgUrl;

                    paragraphTitle.onclick=function (){

                        var temp =document.createElement("form");
                        temp.action='/index'
                        temp.method='post'
                        temp.style.display='none'


                        var textArea = document.createElement("textArea");
                        textArea.name="NewsId";
                        textArea.value=imgUrl;

                        var ReportText = document.createElement("textarea");
                        ReportText.name="ReportText";
                        ReportText.value=text;

                        temp.appendChild(textArea);
                        temp.appendChild(ReportText);
                        $("body").append(temp);
                        temp.submit();
                    };
                    paragraphImg.onclick=function (){
                        var temp =document.createElement("form");
                        temp.action='/index'
                        temp.method='post'
                        temp.style.display='none'

                        var textArea = document.createElement("textArea");
                        textArea.name="NewsId";
                        textArea.value=imgUrl;

                        var ReportText = document.createElement("textArea");
                        ReportText.name="ReportText";
                        ReportText.value=text;

                        temp.appendChild(textArea);
                        temp.appendChild(ReportText);
                        $("body").append(temp);
                        temp.submit();
                    };

                    dashBoard.appendChild(paragraphTitle);
                    dashBoard.appendChild(paragraphText);
                    dashBoard.appendChild(paragraphImg);
                    // scroll to the last element
                    dashBoard.scrollTop = dashBoard.scrollHeight;

                }
            })
            .catch(function (response) {

            })
    }

}


/**
 * Submit data
 * @param url image url
 */
function onSubmit(url) {
    var formArray= $("form").serializeArray();
    var data={};
    for (index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }
    sendAxiosQuery(url, data);

    event.preventDefault();
}


