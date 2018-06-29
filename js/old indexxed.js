// // Let us open our database
// //

if (!window.indexedDB) {
  window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

const apiURL = `https://free.currencyconverterapi.com/api/v5/countries`;   
const storeName = 'currency-converter-store';
let dbName='currency-converter';
let version=1;

const request = window.indexedDB.open(dbName, version);

request.onerror = function(event) {
  alert("Why didn't you allow my web app to use IndexedDB?!");
};
request.onsuccess = function(event) {
  console.log(dbName, 'IndexedDB opened');
  db = event.target.result;
};

request.onupgradeneeded = function(event) {
  var db = event.target.result;
  var objectStore = db.createObjectStore(storeName, {keyPath: "id"});

  fetch(apiURL).then((response) => response.json()).then(function(currencies) {

    // fetch(apiURL).then(function(response) {
    //   return response.json();
    // })
    
    // .then(function(currencies) {
    //   request.then(db => {
        if(!db) return;
        countriesCurrencies = [currencies.results];
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        countriesCurrencies.forEach(function(currency) {
          for (let value in currency) {
            store.add(currency[value]);
          }
        });
        return tx.complete;
      });
  
  // for (var i in employeeData) {
  //    objectStore.add(employeeData[i]);
  // }
}

// request.onupgradeneeded = function(event) { 
//   // Save the IDBDatabase interface 
//   const db = event.target.result;

//   // Create an objectStore for this database
//   const objectStore = db.createObjectStore(storeName, { keyPath: "id" });
//   //const request = objectStore.put({ id: key, value });
// };

// fetch(apiURL).then((response) => response.json()).then(function(currencies) {

// // fetch(apiURL).then(function(response) {
// //   return response.json();
// // })

// // .then(function(currencies) {
// //   request.then(db => {
//     if(!db) return;
//     countriesCurrencies = [currencies.results];
//     const tx = db.transaction(storeName, 'readwrite');
//     const store = tx.objectStore(storeName);
//     let i = 0;
//     countriesCurrencies.forEach(function(currency) {
//       for (let value in currency) {
//         store.put(currency[value]);
//       }
//     });
//     return tx.complete;
//   });

// static setItem(key, value, db) {
//   return new Promise((resolve, reject) => {
//     const transaction = db.transaction([storeName], "readwrite");
//     transaction.oncomplete = () => console.log('Saving complete');
//     const objectStore = transaction.objectStore(storeName);
//     const request = objectStore.put({ id: key, value });
//     request.onerror = (event) => reject(event.error);
//     request.onsuccess = (event) => resolve(event.target.result === key);
//   });
// }

// objectStore.transaction.oncomplete = function(event) {
//   // Store values in the newly created objectStore.
//   var currencyObjectStore = db.transaction(storeName, "readwrite").objectStore("storeName");
//   result.forEach(function(currency) {
//     currencyObjectStore.add(currency);
//   });
// };

// const transaction = db.transaction([storeName], "readwrite");
//       transaction.oncomplete = () => console.log('Saving complete');
//       const objectStore = transaction.objectStore(storeName);
//       const request = objectStore.put({ id: key, value });
//       request.onerror = (event) => reject(event.error);
//       request.onsuccess = (event) => resolve(event.target.result === key);



// // Storing currencies in database 
// 	const apiURL = `https://free.currencyconverterapi.com/api/v5/countries`;   
// let countriesCurrencies;
// const dbPromise = window.indexedDB.open('countries-currencies', 1, upgradeDB => {
//   // Note: we don't use 'break' in this switch statement,
//   // the fall-through behaviour is what we want.
//   switch (upgradeDB.oldVersion) {
//     case 1:
//       upgradeDB.createObjectStore('objs', {keyPath: 'id'});
//   }
// });

// fetch(apiURL)
//   .then(function(response) {
//   return response.json();
// }).then(function(currencies) {


//   // dbPromise.then(db => {
//   //   if(!db) return;
//   //   countriesCurrencies = [currencies.results];
//   //   const tx = db.transaction('objs', 'readwrite');
//   //   const store = tx.objectStore('objs');
//   //   let i = 0;
//   //   countriesCurrencies.forEach(function(currency) {
//   //     for (let value in currency) {
//   //       store.put(currency[value]);
//   //     }
//   //   });
//   //   return tx.complete;
//   // });

//   dbPromise.then(function(db) {
//     if(!db) return;
//     countriesCurrencies = [currencies.results];

//     const tx = db.transaction('objs', 'readwrite');
//     const store = tx.objectStore('objs');
//     let i = 0;
//     countriesCurrencies.forEach(function(currency) {
//       for (let value in currency) {
//         store.put(currency[value]);
//       }
//     });
//     return tx.complete;
//   }).then(function() {
//     console.log('added item to the store os!');
//   });

// });