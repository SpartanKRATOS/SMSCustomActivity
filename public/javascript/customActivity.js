const connection = new Postmonger.Session();

let payload;
let $form;
let journeyName;
let journeyVersionNumber;
let schemaMap = [];

// data coming from DE
var campaignOffersTypes;
var campaignProductsTypes;

// options for others fields
var campaignCommunicationsTypes = {
  data: [
    {
      values: { value: "Outbound" } 
    }, 
    {
      values: { value: "Inbound" } 
    }
  ]
};
var groupCampaign = { data: [
  {
    values: { value: "False/False" } 
  }, 
  {
    values: { value: "True/True" } 
  }
]};

const buttonSettings = {
  button: 'next',
  text: 'done',
  visible: true,
  enabled: false,
};

// Function for fetch requests
const makeRequest = async (endpoint, pyld = {}, qrprms = '') => {
  let body;

  try {
    const access_token = document.querySelector('#access_token').value;

    const response = await fetch(`/client-requests/${endpoint}${qrprms}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ access_token, ...pyld }),
    });

    body = await response.json();
  } catch (err) {
    console.error(err);
  }

  return body;
};

/*
// Validator function
const validateForm = function (cb) {
  $form = $('.js-settings-form');

  $form.validate({
    submitHandler: function (form) {},
    errorPlacement: function () {},
  });

  cb($form);
};
*/

// map dropdown values
const mapDropdownValues = (element, options) => {
  if(!options.data.length) return;
  
  element.innerHTML = "";
  for(let i=0; i<options.data.length; i++){
    let option = document.createElement("div");
    option.textContent = options.data[i].values.value;

    option.addEventListener("click", function(event){
      const valueSelected = event.target.textContent;
      const searchBox = event.target.parentNode;
      const searchInput = event.target.parentNode.parentNode.getElementsByClassName("form__field--text")[0];
      searchInput.value = valueSelected;
      searchBox.classList.add("inactive");
    })

    element.appendChild(option);
  }
}

// This logic runs while UI is open
$(window).ready(() => {
  connection.trigger('ready');

  /*
  validateForm(function ($form) {
    $form.on('change click keyup input paste', 'input, textarea', function () {
      buttonSettings.enabled = $form.valid();
      connection.trigger('updateButton', buttonSettings);
    });
  });
  */
});

const hideSearchBoxes = () => {
  var searchBoxes = document.getElementsByClassName("form__field--input-search-box");
  for(let i = 0; i<searchBoxes.length; i++){
    searchBoxes[i].classList.add("inactive")
  }
}
 

const manageDropDownSearchBox = () =>{
    var searchBoxes = document.getElementsByClassName("form__field--input-drop");
    for (let i = 0; i < searchBoxes.length; i++) {
      
      let dropdownHasConstantValues = searchBoxes[i].classList.contains("fixed")

      let searchBoxList = searchBoxes[i].getElementsByClassName("form__field--input-search-box")[0];
      let searchBoxIcon = searchBoxes[i].getElementsByClassName("form__field--icon")[0];
      
      searchBoxIcon.addEventListener("click", function (event) {
        const id = event.target.id;
        if(id === "communication-type-s"){
          var groupCampaignElement = document.getElementById("communication-type");
          mapDropdownValues(groupCampaignElement, campaignCommunicationsTypes)
          var searchBox = event.target.parentNode.getElementsByClassName("form__field--input-search-box")[0];
          hideSearchBoxes();
          searchBox.classList.remove("inactive");
          return;
        }

        if(id === "group-campaign-s"){
          var groupCampaignElement = document.getElementById("group-campaign");
          mapDropdownValues(groupCampaignElement, groupCampaign)
          var searchBox = event.target.parentNode.getElementsByClassName("form__field--input-search-box")[0];
          hideSearchBoxes();
          searchBox.classList.remove("inactive");
          return;
        }

        var campaignOffersTypesDropdown = document.getElementById("types-of-offers")
        var campaignProductsTypesDropdown = document.getElementById("types-of-products")
        
        console.log(campaignOffersTypes)
        console.log(campaignProductsTypes)

        if(campaignOffersTypesDropdown) mapDropdownValues(campaignOffersTypesDropdown, campaignOffersTypes)
        if(campaignProductsTypesDropdown) mapDropdownValues(campaignProductsTypesDropdown, campaignProductsTypes)

        var searchBox = event.target.parentNode.getElementsByClassName("form__field--input-search-box")[0];
        hideSearchBoxes();
        searchBox.classList.remove("inactive");

      })

      let searchBoxInput = searchBoxes[i].getElementsByClassName("form__field--text")[0];
      
      // dropdownHasConstantValues
      // form__field--input-search-box

      if(!dropdownHasConstantValues){
        
        searchBoxInput.addEventListener("keyup", function (event) {
          
          const offersOrProducts = event.target.id === "types-of-products-k" ? "PRODUCTS":"OFFERS";
          const mappedData = offersOrProducts === "OFFERS" ? campaignOffersTypes.data : campaignProductsTypes.data;

          const value = event.target.value;
          const filteredValues = mappedData.filter(function(item){
            return item.values.value.toLowerCase().startsWith(value.toLowerCase());
          })
          
          console.log("Filtered campaignOffersTypesValues by " + value);
          console.log(filteredValues);

          if(value) {
            var searchBox = event.target.parentNode.getElementsByClassName("form__field--input-search-box")[0];
            searchBox.innerHTML = "";

            for(let i=0; i<filteredValues.length; i++){
              let option = document.createElement("div");
              option.textContent = filteredValues[i].values.value;

              option.addEventListener("click", function(event){
                const valueSelected = event.target.textContent;
                const searchBoxK = event.target.parentNode;
                const searchInput = event.target.parentNode.parentNode.getElementsByClassName("form__field--text")[0];
                searchInput.value = valueSelected;
                searchBoxK.classList.add("inactive");
              })

              searchBox.appendChild(option);
            }
            hideSearchBoxes();
            searchBox.classList.remove("inactive");
          }
          else {
            searchBox.classList.remove("inactive");
          }
        })
      }
      searchBoxList.classList.add("inactive");
    }
}

// This logic runs when user opens the UI
connection.on('initActivity', async (data) => {
  // The requestInteraction event provides useful information about the Journey

  manageDropDownSearchBox();

  let test = await makeRequest("test");
  console.log(test);

  campaignOffersTypes = await makeRequest("campaign-offer-data");
  campaignProductsTypes = await makeRequest("campaign-product-type");

  var campaignOffersTypesDropdown = document.getElementById("types-of-offers")
  var campaignProductsTypesDropdown = document.getElementById("types-of-products")
  
  console.log(campaignOffersTypes)
  console.log(campaignProductsTypes)

  if(campaignOffersTypesDropdown) mapDropdownValues(campaignOffersTypesDropdown, campaignOffersTypes)
  if(campaignProductsTypesDropdown) mapDropdownValues(campaignProductsTypesDropdown, campaignProductsTypes)

  connection.trigger('requestInteraction');
  connection.on('requestedInteraction', (settings) => {
    if (settings) {
      journeyName = settings.name;
      journeyVersionNumber = settings.version;
    }
  });

  // The requestSchema event provides useful information about the Entry Source fields
  connection.trigger('requestSchema');
  connection.on('requestedSchema', (reqSchema) => {
    // Retrieve the Entry Source fields and display them on the UI in form of AMPscript-like personalization strings
    let persAttrs = '';

    reqSchema.schema.forEach((d) => {
      if (d && d.name && d.key) {
        persAttrs += `%%${d.name}%%<br>`;
        schemaMap.push({ key: d.key, name: d.name });
      }
    });

    if (persAttrs) {
      // document.querySelector('#personalizationSpan').innerHTML = persAttrs;
    }
  });

  payload = data ? data : {};

  // Iterate over the inArguments and display them on UI
  const hasInArguments = Boolean(
    payload.arguments &&
      payload.arguments.execute &&
      payload.arguments.execute.inArguments &&
      payload.arguments.execute.inArguments.length > 0
  );

  const inArguments = hasInArguments ? payload.arguments.execute.inArguments : {};

  /*
  $.each(inArguments, function (index, inArgument) {
    $.each(inArgument, function (key, value) {
      const $el = $('#' + key);
      if ($el.attr('type') === 'checkbox') {
        $el.prop('checked', value === 'true');
      } else {
        // If Entry Source Data Binding found transform it to AMPscript-like personalization string
        if (
          typeof value === 'string' &&
          [
            ...value.matchAll(
              /{{(?!Contact.|InteractionDefaults.|Interaction.|Context.)[A-Za-z0-9.:_"'-]+}}/g
            ),
          ].length > 0
        ) {
          const dataBindingArr = [
            ...value.matchAll(
              /{{(?!Contact.|InteractionDefaults.|Interaction.|Context.)[A-Za-z0-9.:_"'-]+}}/g
            ),
          ];

          dataBindingArr.forEach((dataBinding) => {
            const attrName = dataBinding[0].split('.').pop().split('}').shift();
            const newValue = `%%${attrName}%%`;
            value = value.replace(dataBinding[0], newValue);
          });
        }
        $el.val(value);
      }
    });
  });
  */
  // Iterate over activity settings and display them on UI
  const args = payload.arguments.execute;
  
  /*$.each(args, function (key, value) {
    const $el = $('#' + key);
    $el.val(value);
  });*/

  // Iterate over outArguments and display them on UI
  const hasOutArguments = Boolean(
    payload.arguments &&
      payload.arguments.execute &&
      payload.arguments.execute.outArguments &&
      payload.arguments.execute.outArguments.length > 0
  );

  const outArguments = hasOutArguments ? payload.arguments.execute.outArguments : {};

  let outArgsStr = '';

  outArguments.forEach((outArgument) => {
    Object.keys(outArgument).forEach((o) => {
      outArgsStr += `{{Interaction.${payload.key}.${o}}}<br>`;
    });
  });

  // document.querySelector('#outArgsSpan').innerHTML = outArgsStr;

  /*validateForm(function ($form) {
    buttonSettings.enabled = $form.valid();
    connection.trigger('updateButton', buttonSettings);
  });*/
});

// This logic runs when user clicks the Done button
connection.on('clickedNext', () => {
  /* if ($form.valid()) { */
    payload.metaData.isConfigured = true;

    payload.arguments.execute.inArguments = [
      {
        journeyName,
        journeyVersionNumber,
      },
    ];

    console.log("SVE HERE")

    // Save activity settings into the payload
    /*$('.ca-config').each(function () {
      const id = $(this).attr('id');
      const value = $(this).val();

      if (value) {
        payload.arguments.execute[id] = value;
      }
    });
    */

    // Save input values into the payload
    /*
    $('.js-activity-setting').each(function () {
      const $el = $(this);

      let val = $(this).val();

      // Replace all AMPscript-like personalization strings with actual Data Binding
      /*
      if (val.indexOf('%%') > -1 && val.indexOf('%%') < val.lastIndexOf('%%')) {
        while (val.indexOf('%%') > -1 && val.indexOf('%%') < val.lastIndexOf('%%')) {
          const attrName = val.split('%%')[1];
          const attr = schemaMap.find((v) => v.name === attrName);
          let attrKey;

          if (attr && attr.key) {
            attrKey = attr.key;
          } else {
            break;
          }

          val = val.replace(`%%${attrName}%%`, `{{${attrKey}}}`);
        }
      }
      */

      /*const setting = {
        id: $(this).attr('id'),
        value: val,
      };
      */
      /*
      $.each(payload.arguments.execute.inArguments, function (index, value) {
        if ($el.attr('type') === 'checkbox') {
          if ($el.is(':checked')) {
            value[setting.id] = setting.value;
          } else {
            value[setting.id] = 'false';
          }
        } else {
          value[setting.id] = setting.value;
        }
      });
      
    });
    */
    connection.trigger('updateActivity', payload);
  /*}*/
});
