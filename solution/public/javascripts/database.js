/*
 *  Copyright (C) The University of Sheffield - All Rights Reserved
 *  Written by Fabio Ciravegna (f.ciravegna@shef.ac.uk)
 *
 */

import * as idb from 'https://cdn.jsdelivr.net/npm/idb@7/+esm';


////////////////// DATABASE //////////////////
// the database receives from the server the following structure

let db;

const STORY_DB_NAME= 'db';
const STORY_STORE_NAME= 'store_story';
/**const TEXT_DB_NAME= 'db_text';*/
const TEXT_STORE_NAME= 'store_text';
/**const DRAWN_DB_NAME= 'db_drawn';*/
const DRAWN_STORE_NAME= 'store_drawn';
const GRAPH_STORE_NAME= 'store_graph';
/**
 * it inits the database and creates an index for the field
 */
async function initStoryDatabase(){
    if (!db) {
        db = await idb.openDB(STORY_DB_NAME, 2, {
            upgrade(upgradeDb, oldVersion, newVersion) {
                if (!upgradeDb.objectStoreNames.contains(STORY_STORE_NAME)) {
                    let sumsDB = upgradeDb.createObjectStore(STORY_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    sumsDB.createIndex('story', 'name', {unique: false, multiEntry: true});
                }
                if (!upgradeDb.objectStoreNames.contains(TEXT_STORE_NAME)) {
                    let sumsDB = upgradeDb.createObjectStore(TEXT_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    /*sumsDB.createIndex('text',  'text',{unique: false, multiEntry: true});*/
                    sumsDB.createIndex('userId',  'userId',{unique: false, multiEntry: true});
                }
                if (!upgradeDb.objectStoreNames.contains(DRAWN_STORE_NAME)) {
                    let sumsDB = upgradeDb.createObjectStore(DRAWN_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    /*sumsDB.createIndex('Drawn', 'Drawn', {unique: false, multiEntry: true});*/
                    sumsDB.createIndex('userId', 'userId', {unique: false, multiEntry: true})
                }
                if (!upgradeDb.objectStoreNames.contains(GRAPH_STORE_NAME)) {
                    let sumsDB = upgradeDb.createObjectStore(GRAPH_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    sumsDB.createIndex('resultId', 'resultId', {unique: false, multiEntry: true})
                }
            }
        });
        console.log('db created');
    }
}
window.initStoryDatabase= initStoryDatabase;



/**
 * it saves the story data into the database
 * if the database is not supported, it will use localstorage
 * @param Object story data
 * @returns {Promise<void>}
 */
async function storeStoryData(Object) {
    console.log('inserting: '+JSON.stringify(Object));
    if (!db)
        await (initStoryDatabase());
    if (db) {
        try{
            let tx = await db.transaction(STORY_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(STORY_STORE_NAME);
            await store.put(Object);
            await  tx.complete;
            console.log('added item to the store! '+ JSON.stringify(Object));
        } catch(error) {
            console.log('error: I could not store the element. Reason: '+error);
        }
    }
    else localStorage.setItem(Object, JSON.stringify(Object));
}
window.storeStoryData= storeStoryData;

/**
 * it saves the graph data into the database
 * if the database is not supported, it will use localstorage
 * @param Object graph data
 * @returns {Promise<void>}
 */
async function storeGraphData(Object) {
    console.log('inserting: '+JSON.stringify(Object));
    if (!db)
        await (initStoryDatabase());
    if (db) {
        try{
            let tx = await db.transaction(GRAPH_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(GRAPH_STORE_NAME);
            await store.put(Object);
            await  tx.complete;
            console.log('added item to the store! '+ JSON.stringify(Object));
        } catch(error) {
            console.log('error: I could not store the element. Reason: '+error);
        }
    }
    else localStorage.setItem(Object, JSON.stringify(Object));
}
window.storeGraphData= storeGraphData;

/**
 * it saves the text data into the database
 * if the database is not supported, it will use localstorage
 * @param Object text data
 * @returns {Promise<void>}
 */
async function storeTextData(Object) {
    console.log('inserting: '+JSON.stringify(Object));
    if (!db)
        await (initStoryDatabase());
    if (db) {
        try{
            let tx = await db.transaction(TEXT_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(TEXT_STORE_NAME);
            await store.put(Object);
            await  tx.complete;
            console.log('added item to the store! '+ JSON.stringify(Object));
        } catch(error) {
            console.log('error: I could not store the element. Reason: '+error);
        }
    }
    else localStorage.setItem(Object, JSON.stringify(Object));
}
window.storeTextData= storeTextData;
/**
 * it saves the drawn data into the database
 * if the database is not supported, it will use localstorage
 * @param Object drawn data
 * @returns {Promise<void>}
 */
async function storeDrawnData(Object) {
    console.log('inserting: '+JSON.stringify(Object));
    if (!db)
        await (initStoryDatabase());
    if (db) {
        try{
            let tx = await db.transaction(DRAWN_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(DRAWN_STORE_NAME);
            await store.put(Object);
            await  tx.complete;
            console.log('added item to the store! '+ JSON.stringify(Object));
        } catch(error) {
            console.log('error: I could not store the element. Reason: '+error);
        }
    }
    else localStorage.setItem(Object, JSON.stringify(Object));
}
window.storeDrawnData= storeDrawnData;

/**
 * Get the specified text data from indexedDB
 * @param indexValue Index and display based on this value
 * @returns {Promise<void>}
 */
async function cursorGetDataByIndex(indexValue) {
    if (!db)
        await (initStoryDatabase());
    else {
        try{
            console.log("Starting Query...")
            let tx = await db.transaction(TEXT_STORE_NAME,'readwrite');
            let store = await tx.objectStore(TEXT_STORE_NAME);
            let index = await store.index('userId');
            let list = await index.getAll(IDBKeyRange.only(indexValue));
            await tx.complete;
            for (let l of list){
                console.log(l.text)
                writeOnHistory(l.text)
            }

        }
        catch (error){
            console.log("Querying text error!"+error);
        }

    }
}
window.cursorGetDataByIndex= cursorGetDataByIndex;

/**
 * Get the specified drawn data from indexedDB
 * @param indexValue Index and display based on this value
 * @param imgUrl Index and display based on this value
 * @returns {Promise<void>}
 * @constructor
 */
async function GetDataByIndex(indexValue, imgUrl) {
    if (!db)
        await (initStoryDatabase());
    else {
        try{
            console.log("Starting Query...")
            let tx = await db.transaction(DRAWN_STORE_NAME,'readwrite');
            let store = await tx.objectStore(DRAWN_STORE_NAME);
            let index = await store.index('userId');
            let list = await index.getAll(IDBKeyRange.only(indexValue));
            await tx.complete;

            let cvx = document.getElementById('canvas');
            let ctx = cvx.getContext('2d');
            for (let l of list){
                console.log(ctx,l.width,l.height,l.prevX,l.prevY,l.currX,l.currY,l.color,l.thickness, l.imgUrl)
                /*drawOnCanvas(l.ctx, l.Drawn,canvasWidth, canvasHeight, prevX, prevY, currX, currY, color, thickness))*/
                if (imgUrl===l.imgUrl){
                    drawOnCanvas(ctx,l.width,l.height,l.prevX,l.prevY,l.currX,l.currY,l.color,l.thickness)
                }

            }

        }
        catch (error){
            console.log("Querying text error!"+error);
        }

    }
}
window.GetDataByIndex= GetDataByIndex;





