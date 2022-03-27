function sendAxiosQuery(url, data) {
    axios.post(url, data)
        .then((dataR) => {
            document.getElementById('results').innerHTML = JSON.stringify(dataR.data);
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

