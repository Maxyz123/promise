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
 * it inits the database and creates an index for the sum field
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

/**async function initTextDatabase(){
    if (!db) {
        db = await idb.openDB(TEXT_DB_NAME, 7, {
            upgrade(upgradeDb, oldVersion, newVersion) {
                if (!upgradeDb.objectStoreNames.contains(TEXT_STORE_NAME)) {
                    let sumsDB = upgradeDb.createObjectStore(TEXT_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    sumsDB.createIndex('text', 'text', {unique: false, multiEntry: true});
                }
            }
        });
        console.log('db created');
    }
}
 window.initTextDatabase= initTextDatabase;

 async function initDrawnDatabase(){
    if (!db) {
        db = await idb.openDB(DRAWN_DB_NAME, 7, {
            upgrade(upgradeDb, oldVersion, newVersion) {
                if (!upgradeDb.objectStoreNames.contains(DRAWN_STORE_NAME)) {
                    let sumsDB = upgradeDb.createObjectStore(DRAWN_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    sumsDB.createIndex('Drawn', 'userId', {unique: false, multiEntry: true});
                }
            }
        });
        console.log('db created');
    }
}
 window.initDrawnDatabase= initDrawnDatabase;
 /**
 * it saves the sum into the database
 * if the database is not supported, it will use localstorage
 * @param sumObject: it contains  two numbers and their sum, e.g. {num1, num2, sum}
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



/*
        let list = [];
        let store = db.transaction(TEXT_STORE_NAME, "readwrite").objectStore(TEXT_STORE_NAME); // 仓库对象
        let request = store
            .index('userId') // 索引对象
            .openCursor(IDBKeyRange.only(indexValue)); // 指针对象
        request.onsuccess = function (e) {
            let cursor = e.target.result;
            if (cursor) {
                // 必须要检查
                list.push(cursor.value);
                cursor.continue(); // 遍历了存储对象中的所有内容

            } else {
                console.log("游标索引查询结果：", list);

            }

 x

        };

 */

