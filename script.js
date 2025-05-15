let products = [];

const yearSelect = document.getElementById('yearSelect');
const makeSelect = document.getElementById('makeSelect');
const modelSelect = document.getElementById('modelSelect');
const productTypeSelect = document.getElementById('productTypeSelect');
const productUrlDiv = document.getElementById('productUrl');

function populateYear() {
  const years = [...new Set(products.map(p => p.Year))].sort();
  yearSelect.innerHTML = `<option value="">Select Year</option>` +
    years.map(y => `<option value="${y}">${y}</option>`).join('');
  makeSelect.innerHTML = `<option value="">Select Make</option>`;
  makeSelect.disabled = true;
  modelSelect.innerHTML = `<option value="">Select Model</option>`;
  modelSelect.disabled = true;
  productTypeSelect.innerHTML = `<option value="">Select Product Type</option>`;
  productTypeSelect.disabled = true;
  productUrlDiv.textContent = "";
}

function populateMake(year) {
  const makes = [...new Set(products
    .filter(p => String(p.Year) === String(year))
    .map(p => p.Make))].sort();
  makeSelect.innerHTML = `<option value="">Select Make</option>` +
    makes.map(m => `<option value="${m}">${m}</option>`).join('');
  makeSelect.disabled = makes.length === 0;
  modelSelect.innerHTML = `<option value="">Select Model</option>`;
  modelSelect.disabled = true;
  productTypeSelect.innerHTML = `<option value="">Select Product Type</option>`;
  productTypeSelect.disabled = true;
  productUrlDiv.textContent = "";
}

function populateModel(year, make) {
  const models = [...new Set(products
    .filter(p => String(p.Year) === String(year) && String(p.Make) === String(make))
    .map(p => p.Model))].sort();
  modelSelect.innerHTML = `<option value="">Select Model</option>` +
    models.map(m => `<option value="${m}">${m}</option>`).join('');
  modelSelect.disabled = models.length === 0;
  productTypeSelect.innerHTML = `<option value="">Select Product Type</option>`;
  productTypeSelect.disabled = true;
  productUrlDiv.textContent = "";
}

function populateProductType(year, make, model) {
  const types = [...new Set(products
    .filter(p =>
      String(p.Year) === String(year) &&
      String(p.Make) === String(make) &&
      String(p.Model) === String(model))
    .map(p => p["Product Type"]))].sort();
  productTypeSelect.innerHTML = `<option value="">Select Product Type</option>` +
    types.map(t => `<option value="${t}">${t}</option>`).join('');
  productTypeSelect.disabled = types.length === 0;
  productUrlDiv.textContent = "";
}

function showProductUrl(year, make, model, productType) {
  const product = products.find(p =>
    p.Year == year &&
    p.Make === make &&
    p.Model === model &&
    p["Product Type"] === productType
  );

  if (product && product.URL) {
    productUrlDiv.innerHTML = `
      <a href="${product.URL}" target="_blank" class="product-url-button">
        View Product
      </a>
    `;
  } else {
    productUrlDiv.textContent = "No product found.";
  }
}

//Event listeners
yearSelect.addEventListener('change', () => {
  const year = yearSelect.value;
  if (!year) {
    makeSelect.innerHTML = `<option value="">Select Make</option>`;
    makeSelect.disabled = true;
    modelSelect.innerHTML = `<option value="">Select Model</option>`;
    modelSelect.disabled = true;
    productTypeSelect.innerHTML = `<option value="">Select Product Type</option>`;
    productTypeSelect.disabled = true;
    productUrlDiv.textContent = "";
    return;
  }
  populateMake(year);
});

makeSelect.addEventListener('change', () => {
  const year = yearSelect.value;
  const make = makeSelect.value;
  if (!make) {
    modelSelect.innerHTML = `<option value="">Select Model</option>`;
    modelSelect.disabled = true;
    productTypeSelect.innerHTML = `<option value="">Select Product Type</option>`;
    productTypeSelect.disabled = true;
    productUrlDiv.textContent = "";
    return;
  }
  populateModel(year, make);
});

modelSelect.addEventListener('change', () => {
  const year = yearSelect.value;
  const make = makeSelect.value;
  const model = modelSelect.value;
  if (!model) {
    productTypeSelect.innerHTML = `<option value="">Select Product Type</option>`;
    productTypeSelect.disabled = true;
    productUrlDiv.textContent = "";
    return;
  }
  populateProductType(year, make, model);
});

productTypeSelect.addEventListener('change', () => {
  const year = yearSelect.value;
  const make = makeSelect.value;
  const model = modelSelect.value;
  const productType = productTypeSelect.value;

  if (!productType) {
    productUrlDiv.textContent = "";
    return;
  }
  showProductUrl(year, make, model, productType);
});

//Fetch JSON data and initialize
fetch('datasheet.json')
  .then(response => response.json())
  .then(data => {
    products = data;
    console.log("Loaded products:", products);
    populateYear();
  })
  .catch(error => {
    console.error('Error loading products.json:', error);
    productUrlDiv.textContent = "Failed to load product data.";
  });
