//checking if browser support service worker
//Register a service worker hosted at the root of the
if ('serviceWorker' in navigator) {
    // Register a service worker hosted at the root of the
    // site using the default scope.
    navigator.serviceWorker.register('./sw.js').then(function(registration) {
      console.log('Service worker registration succeeded:', registration);
    }).catch(function(error) {
      console.log('Service worker registration failed:', error);
    });
  } else {
    console.log('Service workers are not supported.');
  }
//checking if browser support indexedDB
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
    // db = event.target.result;
    // db = request.result;
    db = request.result;
    console.log("success: "+ db);
  };
  request.onupgradeneeded = function(event) {
    const db = event.target.result;
    const objectStore = db.createObjectStore(storeName);
    console.log("Object Store created", storeName );
  }
  
  function saveAllCurrencies(key, allCurrencies) {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    store.put(allCurrencies, key);
    request.onerror = (event) => reject(event.error);
    request.onsuccess = (event) => resolve(event.target.result);
  }

  function saveRates(key, currencies) {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    currencies.forEach(currency => store.put(currency, key));
    request.onerror = (event) => reject(event.error);
    request.onsuccess = (event) => resolve(event.target.result);
  }

  function getCurrencies(key) {
    var transaction = db.transaction(storeName);
    var objectStore = transaction.objectStore(storeName);
    var request = objectStore.get(key);
    let allCurrencies;
    request.onerror = function(event) {
       alert("Unable to retrieve data from database!");
    };
    request.onsuccess = function(event) {
    allCurrencies = request.result;
    //populate the select box for offline conversion
    populateSelect(allCurrencies);
};
    
}
function getRates(key) {
  var transaction = db.transaction(storeName);
  var objectStore = transaction.objectStore(storeName);
  var request = objectStore.get(key);
  request.onerror = function(event) {
     alert("Unable to retrieve data from database!");
  };
  request.onsuccess = function(event) {
  const currencyRate = request.result;
  const inputAmount = getAmount();
  calculateExchangeRate(currencyRate, inputAmount);

 console.log(currencyRate);
  //populate the select box for offline conversion
};
  
}
  const apiUrl = 'https://free.currencyconverterapi.com/api/v5/currencies';
  let query;



  window.addEventListener('load', function() {
    getData();
  });
  function getData() {
    const url = 'https://free.currencyconverterapi.com/api/v5/currencies';

    fetch(url).then(res => res.json()).then(dataJson => {
       const allCurrenciesArray = dataJson.results;
        //Save currency list to IndexedDB to be used when the user is offline
       saveAllCurrencies('allCurrencies', allCurrenciesArray);
        // populate the data to the selectbox
       populateSelect(allCurrenciesArray);
      })
      .catch(err => {
        console.error(
          `The following error occured while trying to get the list of currencies. ${err}`,
        );
        // Get all currencies when the user is offline
        getCurrencies('allCurrencies');
      });
  }

  document.getElementById('convert').addEventListener('click', function() {
    let from = document.getElementById('from');
    let to = document.getElementById('to');
    const val1 = from.options[from.selectedIndex].value;
    const val2 = to.options[to.selectedIndex].value
    query = `${val1}_${val2}`;
    console.log(query)
    const url = ConvertQuery(val1, val2);
    fetchCurrencyRate(url, query);
  });
  
  function populateSelect(values){
    let ele1 = document.getElementById('from');
    let ele2 = document.getElementById('to');
    for (const data in values) {
      ele1.innerHTML = ele1.innerHTML +
            '<option value="' + values[data].id + '"> ' + values[data].id + ' | ' + values[data].currencyName + '</option>';
            ele2.innerHTML = ele2.innerHTML +
            '<option value="' + values[data].id + '"> ' + values[data].id + ' | ' + values[data].currencyName + '</option>';
    }
  }

 //get amount in the input textbox
 function getAmount() {
    const inputAmount = document.querySelector('#amount').value;
    return inputAmount;
}

function ConvertQuery(curr1, curr2) {
    if (arguments.length !== 2) {
    return 'You need to specify both arguments for the URL to be built correctly.';
  }
  const currencyUrl = `https://free.currencyconverterapi.com/api/v5/convert?q=${curr1}_${curr2}&compact=ultra`;
  return currencyUrl;
}

function fetchCurrencyRate(url, query) {
  if (url === 'undefined') {
    return 'URL Parameter cannot be undefined.';
  }
  fetch(url).then(res => res.json()).then(data => {
      const inputAmount = getAmount();
      const exchangeRate = Object.values(data);
  
       // Save currency exchange rate to IndexedDB to be used when the user is offline
       console.log(query, exchangeRate);
      saveRates(query, exchangeRate);
      calculateExchangeRate(...exchangeRate, inputAmount);
    })
    .catch(err =>
      console.error(
        `The following error occured while trying to get the conversion rate. ${err}`,
      ),
    );
    // Get currency exchange rate when the user is offline
    getRates(query);
    //   calculateExchangeRate(...exchangeRate, inputAmount);

}

function calculateExchangeRate(exchangeRate, input) {
  if (arguments.length !== 2) {
    return 'You need to specify both arguments for the exchange rate to be calculated correctly.';
  }
  const convertedCurrency = input * exchangeRate;
  amount.value = input;
  converted.value = convertedCurrency.toFixed(2);
}

	
	
	

        
		   
	  



