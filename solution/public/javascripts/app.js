/*
 *  Copyright (C) The University of Sheffield - All Rights Reserved
 *  Written by Fabio Ciravegna (f.ciravegna@shef.ac.uk)
 *
 */

/**
 * it submits the form and writes the result and the other equivalent operations in
 * the element "results"
 */
function submitForm(data){
    document.getElementById('results').innerHTML='';
    //let data= serialiseForm();
    storeStoryData({name: data.name, text:data.text, image_url: data.image_url,date: new Date().toString() })
        .then(response => console.log('inserting worked!!'))
        .catch(error => console.log("error  inserting: "+ JSON.stringify(error)))

    // and now it retrieves all the sums that have given the same result
}
/**function submitTextForm(data){
    document.getElementById('results').innerHTML='';
    //let data= serialiseForm();
    storeTextData({text: text})
        .then(response => console.log('inserting worked!!'))
        .catch(error => console.log("error  inserting: "+ JSON.stringify(error)))

    // and now it retrieves all the sums that have given the same result
}
 function submitDrawnForm(data){
    document.getElementById('results').innerHTML='';
    //let data= serialiseForm();

    // and now it retrieves all the sums that have given the same result
}
 /**function serialiseHistoryForm() {
    let formArray = $("form").serializeArray();
    let data = {};
    for (let index in formArray) {
        data[formArray[index].name] = formArray[index].value;
    }
    submitHistoryForm(data);
    event.preventDefault()
}*/
//Not used
function serialiseForm() {
    let formArray = $("form").serializeArray();
    let data = {};
    for (let index in formArray) {
        data[formArray[index].name] = formArray[index].value;
    }
    submitForm(data);
    event.preventDefault()
}
