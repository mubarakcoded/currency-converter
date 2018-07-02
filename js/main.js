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
  
  //this is indexedDB section and the functions interacting with indexedDB
  let db;
  const dbName = ' currency-converter';
  const storeName = 'currencies';
  //opening our indexed database declared as dbName version 1
  const request = window.indexedDB.open(dbName, 1)

  request.onerror = function(event) {
    alert("an error had occured");
  };
  request.onsuccess = function(event) {
    console.log(dbName, 'IndexedDB opened');
    db = request.result;
    console.log("success: "+ db);
  };
  request.onupgradeneeded = function(event) {
    const db = event.target.result;

    //Create Object store
    const objectStore = db.createObjectStore(storeName);
    console.log("Object Store created", storeName );
  }
   // this function saves all our currencies to indexed db  
  function saveAllCurrencies(key, allCurrencies) {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    store.put(allCurrencies, key);
    request.onerror = (event) => reject(event.error);
    request.onsuccess = (event) => resolve(event.target.result);
  }
   //this function saves individual rates to indexedDB
  function saveRates(key, currencies) {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    currencies.forEach(currency => store.put(currency, key));
    request.onerror = (event) => reject(event.error);
    request.onsuccess = (event) => resolve(event.target.result);
  }
   //this function fetchs all currencies from indexedDB
  function getCurrencies(key) {
    var transaction = db.transaction(storeName);
    var objectStore = transaction.objectStore(storeName);
    var request = objectStore.get(key);
    let allCurrencies;
    request.onerror = function(event) {
       console.log("Unable to retrieve data from indexed database!");
    };
    request.onsuccess = function(event) {
    allCurrencies = request.result;
    //populate the select box with stored currencies for offline conversion
    populateSelect(allCurrencies);
    };
  }  
 
  //fetching individual rate for a particular currency
  function getRates(key) {
  const transaction = db.transaction(storeName);
  const objectStore = transaction.objectStore(storeName);
  const request = objectStore.get(key);
  request.onerror = function(event) {
    console.log("Unable to retrieve data from indexed database!");
  };
  request.onsuccess = function(event) {
  const currencyRate = request.result;

  //get the user inputed value and stored currency rate from indexedDB
  //and parse the values to the calculateExchangeRate Function 
  const inputAmount = getAmount();
  calculateExchangeRate(currencyRate, inputAmount);
  };
     
}
 //end of indexedDB section 

  window.addEventListener('load', function() {
    getData();
  });

  //fetch all the currencies from api
  function getData() {
    //the api url
    const url = 'https://free.currencyconverterapi.com/api/v5/currencies';
    fetch(url).then(res => res.json()).then(dataJson => {
       const allCurrenciesArray = dataJson.results;
        //Save currency list to IndexedDB to be used when the user is offline
       saveAllCurrencies('allCurrencies', allCurrenciesArray);
        // populate the data to the selectbox
       populateSelect(allCurrenciesArray);
      })
      .catch(error => {
        console.error(
          `An error had occured. ${error}`,
        );
        // Get all currencies fron indexedDB when the user is offline
        getCurrencies('allCurrencies');
      });
  }

  function populateSelect(values){
    //creating option html elements and appending each with option name and values
    let ele1 = document.getElementById('from');
    let ele2 = document.getElementById('to');
    for (const data in values) {
      //initializing the option with currency names and ids
      ele1.innerHTML = ele1.innerHTML +
      '<option value="' + values[data].id + '"> ' + values[data].id + ' | ' + values[data].currencyName + '</option>';
      ele2.innerHTML = ele2.innerHTML +
      '<option value="' + values[data].id + '"> ' + values[data].id + ' | ' + values[data].currencyName + '</option>';
    }
  }
  
  //listen to button click
  document.getElementById('convert').addEventListener('click', function() {
    //get the selected currencies values
    let from = document.getElementById('from');
    let to = document.getElementById('to');
    const val1 = from.options[from.selectedIndex].value;
    const val2 = to.options[to.selectedIndex].value
    //generate string of the currencies id
    query = `${val1}_${val2}`;
    //parse the querystring to the convert query function which generate
    //the conversion rate url
    const url = ConvertQuery(val1, val2);
    fetchCurrencyRate(url, query);
  }); 

 //get amount in the input textbox
  function getAmount() {
      const inputAmount = document.querySelector('#amount').value;
      return inputAmount;
  }

  function ConvertQuery(curr1, curr2) {
      if (arguments.length !== 2) {
      return;
    }
    //generate currency url
    const currencyUrl = `https://free.currencyconverterapi.com/api/v5/convert?q=${curr1}_${curr2}&compact=ultra`;
    return currencyUrl;
  }

  function fetchCurrencyRate(url, query) {
    if (url === 'undefined') {
      return;
    }
    //fetch the currency rate frome the url
    fetch(url).then(res => res.json()).then(data => {
        const inputAmount = getAmount();
        const exchangeRate = Object.values(data);
        // Save currency exchange rate to IndexedDB to be used when the user is offline
        saveRates(query, exchangeRate);
        //calculate
        calculateExchangeRate(...exchangeRate, inputAmount);
      })
      .catch(error =>
        console.error(
          `An error had occured while getting the conversion rate. ${error}`,
        ),
      );
      // Get currency exchange rate when the user is offline fron IndexedDB
      getRates(query);
  }

  function calculateExchangeRate(exchangeRate, input) {
    if (arguments.length !== 2) {
      return;
    }
    //convert the currency
    const convertedCurrency = input * exchangeRate;
    amount.value = input;
    //set the value to the converted textbox
    converted.value = convertedCurrency.toFixed(2);
  }

	
	
	

        
		   
	  



