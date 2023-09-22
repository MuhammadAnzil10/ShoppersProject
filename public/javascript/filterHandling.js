


function hanldevent(event){
    const checkBoxes = document.querySelectorAll('.categoryCheckBox')

    if(localStorage.getItem('checkedItems')){
        localStorage.removeItem('checkedItems')
    }
    checkBoxes.forEach((box)=>{
        if(event.target !== box){
            box.checked = false
        }
    })
  const itemId = event.target.value
  const checkedItems = JSON.parse(localStorage.getItem('checkedItems')) || {}

  if (event.target.checked) {
    checkedItems[itemId] = true;
  } else {
    delete checkedItems[itemId];
  }
  localStorage.setItem('checkedItems', JSON.stringify(checkedItems));

   
}

function initializeCheckboxState() {
    const checkedItems = JSON.parse(localStorage.getItem('checkedItems')) || {};
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  
    checkboxes.forEach((checkbox) => {
      const itemId = checkbox.value;
      if (checkedItems[itemId]) {
        checkbox.checked = true;
      }
    });
  }

  window.addEventListener('load', initializeCheckboxState);


 
  const boxes = document.querySelectorAll('.sortCheckBox')
  
  // Function to handle checkbox clicks for sorting options
function handleSortingCheckboxClick(event) {

    if(localStorage.getItem('checkedSortingOptions')){
        localStorage.removeItem('checkedSortingOptions')
    }
   boxes.forEach((box)=>{
     if(box !== event.target){
        box.checked=false
     }
   })
    const sortingOption = event.target.value; // Get the sorting option value
    const checkedSortingOptions = JSON.parse(localStorage.getItem('checkedSortingOptions')) || {};
  
    if (event.target.checked) {
      checkedSortingOptions[sortingOption] = true;
    } else {
      delete checkedSortingOptions[sortingOption];
    }
  
    localStorage.setItem('checkedSortingOptions', JSON.stringify(checkedSortingOptions));
  }
  


  // Function to initialize sorting checkbox state on page load
  function initializeSortingCheckboxState() {
    const checkedSortingOptions = JSON.parse(localStorage.getItem('checkedSortingOptions')) || {};

    const sortingCheckboxes = document.querySelectorAll('input[type="checkbox"][name="SortBy"]');
  
    sortingCheckboxes.forEach((checkbox) => {
      const sortingOption = checkbox.value;
      if (checkedSortingOptions[sortingOption]) {
        checkbox.checked = true;
      }
    });
  }
  
  // Call the initialize function when the page loads
  window.addEventListener('load', initializeSortingCheckboxState);
  
  const filterClearBtn = document.getElementById('filterClearBtn')

  filterClearBtn.addEventListener('click',removeFilter)


  function removeFilter(e){

    localStorage.removeItem('checkedSortingOptions')
    localStorage.removeItem('checkedItems')


  }