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

// check if form values are accurate
const getFormValues = () => {
  const cmpId = document.getElementById("campaign-id").value;
  const cmpControlGroup = document.getElementById("control-group").value;
  const cmpTypeOffer = document.getElementById("types-of-offers-k").value;
  const cmpName = document.getElementById("campaign-name").value;
  const cmpCommunictionType = document.getElementById("communication-type-k").value;
  const cmpProductType = document.getElementById("types-of-products-k").value;
  const cmpGroupCmp = document.getElementById("group-campaign-k").value;

  const notEmptyOrUndefined = (value) => {
    return value !== "" && value !== undefined && value !== null
  }

  const isValid = notEmptyOrUndefined(cmpId) && notEmptyOrUndefined(cmpControlGroup) && notEmptyOrUndefined(cmpTypeOffer) && notEmptyOrUndefined(cmpName) && notEmptyOrUndefined(cmpCommunictionType) && notEmptyOrUndefined(cmpProductType) && notEmptyOrUndefined(cmpGroupCmp);

  return {
    isValid, payload: { cmpId, cmpControlGroup, cmpTypeOffer, cmpName, cmpCommunictionType, cmpProductType, cmpGroupCmp }
  }
}

// take values from payload and display them in UI
const mapValuesinUI = (map) => {

  const { campaignId, campaignControlGroup, campaignOffersType, campaignName, campaignCommunicationsType, campaignProductsType, campaignGroup } = map;
  
  document.getElementById("campaign-id").value = campaignId;
  document.getElementById("control-group").value = campaignControlGroup;
  document.getElementById("types-of-offers-k").value = campaignOffersType;
  document.getElementById("campaign-name").value = campaignName;
  document.getElementById("communication-type-k").value = campaignCommunicationsType;
  document.getElementById("types-of-products-k").value = campaignProductsType;
  document.getElementById("group-campaign-k").value = campaignGroup;

}

// map dropdown values
const mapDropdownValues = (element, options) => {
  if(!options.data.length || !element) return;
  
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

const manageSearchClickForStaticFields = (event, type) => {
  const mappedValued = type === "group-campaign-s" ? groupCampaign : campaignCommunicationsTypes;
  var element = document.getElementById(type);
  mapDropdownValues(element, mappedValued)
  var searchBox = event.target.parentNode.getElementsByClassName("form__field--input-search-box")[0];
  hideSearchBoxes();
  searchBox.classList.remove("inactive");
}

// This logic runs while UI is open
$(window).ready(() => {
  connection.trigger('ready');
});

const hideSearchBoxes = () => {
  var searchBoxes = document.getElementsByClassName("form__field--input-search-box");
  if(!searchBoxes) return;

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
        if(id === "communication-type-s" || id === "group-campaign-s") { 
          manageSearchClickForStaticFields(event, id.substring(0, id.length - 2));
          return;
        }

        var campaignOffersTypesDropdown = document.getElementById("types-of-offers")
        var campaignProductsTypesDropdown = document.getElementById("types-of-products")

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
        })
      }
      searchBoxList.classList.add("inactive");
    }
}

// This logic runs when user opens the UI
connection.on('initActivity', async (data) => {
  // The requestInteraction event provides useful information about the Journey

  manageDropDownSearchBox();

  //let test = await makeRequest("test");
  // console.log(test);

  campaignOffersTypes = await makeRequest("campaign-offer-data");
  campaignProductsTypes = await makeRequest("campaign-product-type");

  var campaignOffersTypesDropdown = document.getElementById("types-of-offers")
  var campaignProductsTypesDropdown = document.getElementById("types-of-products")

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
  
  // iterate over inArguments & display already selected values in the UI
  if(hasInArguments) mapValuesinUI(inArguments[0]);

 // Iterate over activity settings and display them on UI
  const args = payload.arguments.execute;

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

  
  if (getFormValues().isValid) {

    payload.metaData.isConfigured = true;

    payload.arguments.execute.inArguments = [
      {
        journeyName,
        journeyVersionNumber,
        campaignId: getFormValues().payload.cmpId,
        campaignName: getFormValues().payload.cmpName,
        campaignControlGroup: getFormValues().payload.cmpControlGroup,
        campaignOffersType: getFormValues().payload.cmpTypeOffer,
        campaignProductsType: getFormValues().payload.cmpProductType,
        campaignCommunicationsType: getFormValues().payload.cmpCommunictionType,
        campaignGroup: getFormValues().payload.cmpGroupCmp,
        activityId: "{{Activity.Id}}",
        contactKey: "{{Contact.Key}}"
      },
    ];

    connection.trigger('updateActivity', payload);
  }

});
