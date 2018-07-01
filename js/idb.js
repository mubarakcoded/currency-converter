if (!window.indexedDB) {
  window.alert("Your browser doesn't support a stable version of IndexedDB.")
}
var db;
const dbName = ' currency-converter';
const storeName = 'currencies';
const request = window.indexedDB.open(dbName, 1)


request.onerror = function(event) {
  alert("an error had occured");
};
request.onsuccess = function(event) {
  console.log(dbName, 'IndexedDB opened');
  db = event.target.result;
};
request.onupgradeneeded = function(event) {
  const db = event.target.result;
  const objectStore = db.createObjectStore(storeName);
  console.log("Object Store created", storeName );
}

export default class IndexedDatabase {
  static saveAllCurrencies(key, allCurrencies) {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    store.put(allCurrencies, key);
    request.onerror = (event) => reject(event.error);
    request.onsuccess = (event) => resolve(event.target.result);
  }

  static saveRates(key, currencies) {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    currencies.forEach(currency => store.put(currency, key));
    request.onerror = (event) => reject(event.error);
    request.onsuccess = (event) => resolve(event.target.result);
  }

  // static getAll(key) {
    
  //   // return request
  //   //   .then(db => {
  //   //     if (!db) return;
  //   //     const transaction = db.transaction(storeName);
  //   //     const store = transaction.objectStore(storeName);
  //   //     const data = store.get(key);
  //   //     return data;
  //     // })
  //   // const transaction = db.transaction(storeName);
  //   // const store = transaction.objectStore(storeName);
  //   // const data = store.get(key);
  //   // return data;
  //   // request.onerror = (event) => reject(event.error);
  //   // request.onsuccess = (event) => resolve(event.target.result);
  // }

//   static getAll() {
//     const transaction = db.transaction(storeName);
//     const store = transaction.objectStore(storeName);
//     const data = store.get('allCurrencies');
//     console.log(event.target.result);
//     request.onerror = function(event) {
//        alert("Unable to retrieve daa from database!");
//     };
//     request.onsuccess = function(event) {
//       var db = event.target.result;
//        // Do something with the request.result!
//     };
//  }

  static getRates(key) {
    const transaction = db.transaction(storeName);
    const store = transaction.objectStore(storeName);
    const data = store.get(key);
    return data;
    request.onerror = (event) => reject(event.error);
    request.onsuccess = (event) => resolve(event.target.result);
  }

  static getAll(key) {
    return request
      .then(db => {
        if (!db) return;
        const transaction = db.transaction('currencies');
        const store = transaction.objectStore('currencies');
        const data = store.get(key);
        return data;
      })
      .catch(err => {
        console.error('error getting data from database', err);
      });
  }

  static setItem(key, value, db) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      transaction.oncomplete = () => console.log('Saving complete');
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.put({ id: key, value });
      request.onerror = (event) => reject(event.error);
      request.onsuccess = (event) => resolve(event.target.result === key);
    });
  }

  static removeItem(key, db) {
    return new Promise((resolve, reject) => {
      const request = db.transaction([storeName], 'readwrite')
      .objectStore(storeName)
      .delete(key);
      request.onerror = (event) => reject(event.error);
      request.onsuccess = () => resolve(true);
    });
  }

  
}
