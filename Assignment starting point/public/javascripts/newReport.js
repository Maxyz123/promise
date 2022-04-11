function sendAxiosQuery(url, data) {
    axios.post(url, data)
        .then((dataR) => {
            var dataArr = JSON.parse(JSON.stringify(dataR.data));
            for (i in dataArr){
                document.getElementById('results').innerHTML += dataArr[i]["author_name"];
                document.getElementById('results').innerHTML += ", ";
                document.getElementById('results').innerHTML += dataArr[i]["report_text"];
                document.getElementById('results').innerHTML += ", ";
                document.getElementById('results').innerHTML += dataArr[i]["image_url"];
                document.getElementById('results').innerHTML += ", ";
                document.getElementById('results').innerHTML += dataArr[i]["date"];
                document.getElementById('results').innerHTML += ", ";
                document.getElementById('results').innerHTML += dataArr[i]["_id"];
                document.getElementById('results').innerHTML += "<br>"
            }
        })
        .catch(function (response) {
            alert(response.toJSON());
        })
}

function onSubmit(url) {
    var formArray= $("form").serializeArray();
    var data={};
    for (index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }
    sendAxiosQuery(url, data);

    event.preventDefault();
}


