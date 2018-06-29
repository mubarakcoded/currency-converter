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

  const url = 'https://free.currencyconverterapi.com/api/v5/currencies';

  window.addEventListener('load', function() {
    fetch(url).then((response) => response.json()).then(function(dataJson) {
      let ele = document.getElementById('from');
      let ele2 = document.getElementById('to');

      //const results = dataJson.results;
      //let resultsKeys = Object.keys(results);
            // let resultsValues = Object.values(results);
      //for (item of resultsKeys){
        // var currencies = Object.keys(data.results).sort()
        for (const data in dataJson.results) {
  
          ele.innerHTML = ele.innerHTML +
                '<option value="' + dataJson.results[data].id + '"> ' + dataJson.results[data].id + ' (' + dataJson.results[data].currencyName + ')</option>';
                ele2.innerHTML = ele2.innerHTML +
                '<option value="' + dataJson.results[data].id + '"> ' + dataJson.results[data].id + ' (' + dataJson.results[data].currencyName + ')</option>';
  
        }    
      
        
      })
      .catch(function(error) {
        console.log(error);
      });
  });

  document.getElementById('convert').addEventListener('click', function() {
    let from = document.getElementById('from');
    let to = document.getElementById('to');
    const val1 = from.options[from.selectedIndex].value;
    const val2 = to.options[to.selectedIndex].value
    const url = ConvertQuery(val1, val2);
    fetchCurrencyRate(url);

    // return the value of the selected option to be removed
        console.log(val1) // 1st
        console.log(val2) // 

    
  });


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
  console.log(currencyUrl)
  return currencyUrl;
}

function fetchCurrencyRate(url) {
  if (url === 'undefined') {
    return 'URL Parameter cannot be undefined.';
  }

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const inputAmount = getAmount();
      const exchangeRate = Object.values(data);
      
      console.log(exchangeRate);

      calculateExchangeRate(...exchangeRate, inputAmount);
    })
    .catch(err =>
      console.error(
        `The following error occured while trying to get the conversion rate. ${err}`,
      ),
    );
}

function calculateExchangeRate(exchangeRate, input) {
  if (arguments.length !== 2) {
    return 'You need to specify both arguments for the exchange rate to be calculated correctly.';
  }

  const convertedCurrency = input * exchangeRate;

  amount.value = input;
  converted.value = convertedCurrency.toFixed(2);
}

	
	
	

        
		   
	  



