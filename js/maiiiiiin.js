import IndexedDatabase from './idb.js';


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

  const apiUrl = 'https://free.currencyconverterapi.com/api/v5/currencies';
  let query;



  window.addEventListener('load', function() {
    
    getData();
  });
  function getData() {

    // This will fetch the data from the API if we don't have a cached version
    fetch(apiUrl).then((response) => response.json()).then(function(dataJson) {
      const allCurrenciesArray = dataJson.results;

      // Save currency list to IndexedDB to be used when the user is offline
       IndexedDatabase.saveAllCurrencies('allCurrencies', allCurrenciesArray);
       populateSelect(allCurrenciesArray);
      })
      .catch(err => {
        console.error(
          `The following error occured while trying to get the list of currencies. ${err}`,
        );
        // Get currency exchange rate when the user is offline
        IndexedDatabase.getAll('allCurrencies').then(allCurrenciesArray => {
          if (typeof allCurrenciesArray === 'undefined') return;
          populateSelect(allCurrenciesArray);
        });
      });
  }
  //  function getData() {
  //   fetch(url).then((response) => response.json()).then(function(dataJson) {

  //       // const currencies = Object.keys(dataJson.results).sort();
  //       const allCurrenciesArray = dataJson.results;

  //       console.log(dataJson.results);
  //       // Save all currencies to IndexedDB for offline use

  //       // Save currency list to IndexedDB to be used when the user is offline
  //       IndexedDatabase.saveAllCurrencies('allCurrencies', allCurrenciesArray);
  //       populateSelect(allCurrenciesArray)
  
  //     }).catch(function(error) {
  //       console.log(error);
  //     );
  //     // Get currency exchange rate when the user is offline
  //     IndexedDatabase.getAll('allCurrencies').then(allCurrenciesArray => {
  //       if (typeof allCurrenciesArray === 'undefined') return;
  //       populateSelect(allCurrenciesArray);
  //     });
      
  //  }

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

    let ele = document.getElementById('from');
    let ele2 = document.getElementById('to');
    for (const data in values) {
      ele.innerHTML = ele.innerHTML +
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
      IndexedDatabase.saveRates(query, exchangeRate);
      calculateExchangeRate(...exchangeRate, inputAmount);
    })
    .catch(err =>
      console.error(
        `The following error occured while trying to get the conversion rate. ${err}`,
      ),
    );
    // Get currency exchange rate when the user is offline
    IndexedDatabase.getRates(query).then(data => {
      if (typeof data === 'undefined') return;
      calculateExchangeRate(data, inputAmount);
    });
}

function calculateExchangeRate(exchangeRate, input) {
  if (arguments.length !== 2) {
    return 'You need to specify both arguments for the exchange rate to be calculated correctly.';
  }
  const convertedCurrency = input * exchangeRate;
  amount.value = input;
  converted.value = convertedCurrency.toFixed(2);
}

	
	
	

        
		   
	  



