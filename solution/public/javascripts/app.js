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

/**
 * Functions for the cache
 */
function initStoryList(){
    if ('indexedDB' in window) {
        initStoryDatabase();
    }else{
        console.log('This browser doesn\'t support IndexedDB');
    }
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function() { console.log('Service Worker Registered'); });
        }
    loadData(false);
}

// TODO change the item name
function loadData(forceReload){
    var storyList=JSON.parse(localStorage.getItem('stories'));
    storyList=removeDuplicates(storyList);
    retrieveAllStoriesData(storyList, new Date().getTime(), forceReload);
}

function retrieveAllStoriesData(storyList, date, forceReload){
    refreshStoryList();
    for (let index in storyList)
        loadStoryData(storyList[index], date, forceReload);
}

// TODO check if the function is right used, add url
async function loadStoryData(story, date, forceReload) {
    let cachedData = await cursorGetDataByIndex(story);
    if (!forceReload && cachedData && cachedData.length > 0) {
        for (let res of cachedData)
            addToResults(res);
    } else {
        const input = JSON.stringify({story: story, date: date});
        const url = '/index';
        axios.post(url, input)
            .then(function (dataR) {
                addToResults(dataR);
                storeCachedData(dataR.story, dataR);
                if (document.getElementById('offline_div') != null)
                    document.getElementById('offline_div').style.display = 'none';
            })
            .cache(async function (xhr, status, error) {
                showOfflineWarning();
                let cachedData = await getCachedData(story, date);
                if (cachedData && cachedData.length > 0)
                    addToResults(cachedData[0]);
                const dvv = document.getElementById('offline_div');
                if (dvv != null)
                    dvv.style.display = 'block';
            })
    }
    if (document.getElementById('story_list') != null)
        document.getElementById('story_list').style.display = 'none';
}
        // $.ajax({
        //     url: '',
        //     data: input,
        //     contentType: 'application/json',
        //     type: 'POST',
        //     success: function (dataR) {
        //         addToResults(dataR);
        //         storeCachedData(dataR.story, dataR);
        //         if (document.getElementById('offline_div') != null)
        //             document.getElementById('offline_div').style.display = 'none';
        //     },
        //     error: async function (xhr, status, error) {
        //         showOfflineWarning();
        //         let cachedData = await getCachedData(story, date);
        //         if (cachedData && cachedData.length > 0)
        //             addToResults(cachedData[0]);
        //         const dvv = document.getElementById('offline_div');
        //         if (dvv != null)
        //             dvv.style.display = 'block';
        //     }
        // });

// TODO get necessary data of the stories
function addToResults(dataR){
    if (document.getElementById('results') != null){
        const row = document.createElement('div');
        document.getElementById('results').appendChild(row);
        row.classList.add('card');
        row.classList.add('my_card');
        row.classList.add('bg-faded');
        // row.innerHTML = "<div class='card-block'>" +
        //     "<div class='row'>" +
        //     "<div class='col-sm'>" + dataR.location + "</div>" +
        //     "<div class='col-sm'>" + getForecast(dataR.forecast) + "</div>" +
        //     "<div class='col-sm'>" + getTemperature(dataR) + "</div>" +
        //     "<div class='col-sm'>" + getPrecipitations(dataR) + "</div>" +
        //     "<div class='col-sm'>" + getWind(dataR) + "</div>" +
        //     "<div class='col-sm'></div></div></div>";
    }
}

function refreshStoryList(){
    if (document.getElementById('results')!=null)
        document.getElementById('results').innerHTML='';
}

window.addEventListener('offline', function(e) {
    // Queue up events for server.
    console.log("You are offline");
    showOfflineWarning();
}, false);

function selectCity(city, date) {
    var cityList=JSON.parse(localStorage.getItem('cities'));
    if (cityList==null) cityList=[];
    cityList.push(city);
    cityList = removeDuplicates(cityList);
    localStorage.setItem('cities', JSON.stringify(cityList));
    retrieveAllCitiesData(cityList, date, true);
}

window.addEventListener('offline', function(e) {
    // Queue up events for server.
    console.log("You are offline");
    showOfflineWarning();
}, false);

window.addEventListener('online', function(e) {
    console.log("You are online");
    hideOfflineWarning();
    loadData(false);
}, false);

function showOfflineWarning(){
    if (document.getElementById('offline_div')!=null)
        document.getElementById('offline_div').style.display='block';
}

function hideOfflineWarning(){
    if (document.getElementById('offline_div')!=null)
        document.getElementById('offline_div').style.display='none';
}

function showStoryList() {
    if (document.getElementById('story_list')!=null)
        document.getElementById('story_list').style.display = 'block';
}

function removeDuplicates(storyList) {
    var uniqueNames=[];
    $.each(storyList, function(i, el){
        if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
    });
    return uniqueNames;
}
