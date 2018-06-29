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
      
function addItem() {
        const transaction = db.transaction(['store'], 'readwrite');
        var store = transaction.objectStore('store');
        var item = {
          name: 'banana',
          price: '$2.99',
          description: 'It is a purple banana!',
          created: new Date().getTime()
        }
      }
}
