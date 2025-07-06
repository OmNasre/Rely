/* ---------------------------- */
/* 🧾 Form Toggle + Web3 Submit */
/* ---------------------------- */

function toggleForm(formType) {
  document.getElementById('form-appointment').classList.add('d-none');
  document.getElementById('form-home').classList.add('d-none');
  document.getElementById('btn-appointment').classList.remove('active');
  document.getElementById('btn-home').classList.remove('active');

  if (formType === 'appointment') {
    document.getElementById('form-appointment').classList.remove('d-none');
    document.getElementById('btn-appointment').classList.add('active');
  } else {
    document.getElementById('form-home').classList.remove('d-none');
    document.getElementById('btn-home').classList.add('active');
  }
}

function handleWeb3Form(formId, resultId) {
  const form = document.getElementById(formId);
  const result = document.getElementById(resultId);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const object = {};
    formData.forEach((value, key) => {
      if (object[key]) {
        if (Array.isArray(object[key])) {
          object[key].push(value);
        } else {
          object[key] = [object[key], value];
        }
      } else {
        object[key] = value;
      }
    });

    const json = JSON.stringify(object);
    result.innerHTML = "Please wait...";

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: json
    })
    .then(async (response) => {
      let json = await response.json();
      result.innerHTML = json.message;
      result.classList.add(response.status === 200 ? "text-success" : "text-danger");
    })
    .catch(() => {
      result.innerHTML = "Something went wrong!";
      result.classList.add("text-danger");
    })
    .then(() => {
      form.reset();
      setTimeout(() => { result.innerHTML = ""; }, 5000);
    });
  });
}

handleWeb3Form("appointmentForm", "result1");
handleWeb3Form("homeForm", "result2");


/* ------------------------------------------ */
/* 🧪 Test Selection (Popular Test Side Panel) */
/* ------------------------------------------ */

const lists = [document.getElementById('testListLeft'), document.getElementById('testListRight')];
const testDetails = document.getElementById('testDetails');

lists.forEach(list => {
  const items = list.querySelectorAll('li');
  items.forEach(item => {
    item.addEventListener('click', () => {
      lists.forEach(l => l.querySelectorAll('li').forEach(i => i.classList.remove('active')));
      item.classList.add('active');
      const name = item.dataset.name;
      const price = item.dataset.price;
      const desc = item.dataset.desc;
      testDetails.innerHTML = `
        <h3>${name}</h3>
        <p class="price">${price}</p>
        <p class="desc">${desc}</p>
      `;
      testDetails.classList.add('fade-in');
      setTimeout(() => testDetails.classList.remove('fade-in'), 400);
    });
  });
});


/* --------------------------------------------- */
/* 🧠 Organ-Based Test Filtering + Dynamic Panel */
/* --------------------------------------------- */

const testData = [
  { organ: 'Heart', name: 'ECG', price: '₹500', desc: 'Electrocardiogram to assess heart rhythm.' },
  { organ: 'Heart', name: 'Lipid Profile', price: '₹700', desc: 'Cholesterol and triglycerides check.' },
  { organ: 'Liver', name: 'LFT', price: '₹500', desc: 'Liver Function Test for enzyme levels.' },
  { organ: 'Kidney', name: 'KFT', price: '₹600', desc: 'Kidney Function Test for creatinine and urea.' },
  { organ: 'Thyroid', name: 'Thyroid Profile', price: '₹600', desc: 'Thyroid hormones assessment.' },
  { organ: 'All', name: 'CBC', price: '₹250', desc: 'Complete Blood Count to check overall health.' },
  { organ: 'All', name: 'Blood Sugar', price: '₹200', desc: 'Random blood sugar measurement.' }
];

const organButtons = document.querySelectorAll('.organ-btn');
const organTestListContainer = document.getElementById('testListContainer');
const organTestDetails = document.getElementById('organTestDetails');

organButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    organButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const organ = btn.dataset.organ;
    const filtered = organ === 'All' ? testData : testData.filter(t => t.organ === organ);

    if (filtered.length === 0) {
      organTestListContainer.innerHTML = '<p class="text-muted">No tests available for this organ.</p>';
      return;
    }

    organTestListContainer.innerHTML = `
      <ul class="list-group">
        ${filtered.map(t => `<li class="list-group-item list-group-item-action test-item" data-name="${t.name}" data-price="${t.price}" data-desc="${t.desc}">${t.name}</li>`).join('')}
      </ul>
    `;

    const testItems = organTestListContainer.querySelectorAll('.test-item');
    testItems.forEach(item => {
      item.addEventListener('click', () => {
        testItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        organTestDetails.innerHTML = `
          <h4>${item.dataset.name}</h4>
          <p class="price">${item.dataset.price}</p>
          <p class="desc">${item.dataset.desc}</p>
        `;
      });
    });
  });
});
