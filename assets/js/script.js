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

function handleWeb3Form(formId, resultId, modalId = null) {
  const form = document.getElementById(formId);
  const result = document.getElementById(resultId);

  if (!form || form.dataset.bound === "true") return;
  form.dataset.bound = "true";

  form.addEventListener("submit", async function (e) {
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

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: json
      });

      const data = await response.json();
      result.innerHTML = data.message || "Submitted";
      result.classList.add(response.ok ? "text-success" : "text-danger");

      // ✅ Close modal manually after short delay if success

    } catch {
      result.innerHTML = "Something went wrong!";
      result.classList.add("text-danger");
    }

    form.reset();
    setTimeout(() => {
      result.innerHTML = "";
      result.classList.remove("text-success", "text-danger");
    }, 5000);
  });
}


// ✅ Static forms that always exist
document.addEventListener('DOMContentLoaded', () => {
  handleWeb3Form("appointmentForm", "result1");
  handleWeb3Form("homeForm", "result2");
});






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


