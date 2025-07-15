(function () {
  const form = document.getElementById('wineForm');
  const tableContainer = document.getElementById('tableContainer');
  const wines = [];

  // UUID-like ID generator
  function generateId() {
    return 'xxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Read form data into an object
  function getFormData() {
    const formData = new FormData(form);
    return {
      id: generateId(),
      name: formData.get("name").trim(),
      grape: formData.get("grape").trim(),
      region: formData.get("region").trim(),
      country: formData.get("country").trim(),
      vintage: parseInt(formData.get("vintage"), 10),
      body: formData.get("body"),
      tannin: formData.get("tannin"),
      acidity: formData.get("acidity"),
      coravin: formData.get("coravin") === "true",
      btlOnly: formData.get("btlOnly") === "true",
      sommNotes: formData.get("sommNotes")?.trim() || ""
    };
  }

  // Render wine data as editable table
  function renderTable() {
    if (wines.length === 0) {
      tableContainer.innerHTML = "";
      return;
    }

    let tableHTML = `<table border="1"><thead><tr>
      <th>Name</th><th>Grape</th><th>Region</th><th>Country</th><th>Vintage</th>
      <th>Body</th><th>Tannin</th><th>Acidity</th><th>Coravin</th><th>Btl Only</th>
      <th>Somm Notes</th><th>Delete</th>
    </tr></thead><tbody>`;

    wines.forEach((wine, index) => {
      tableHTML += `<tr data-id="${wine.id}">
        <td><input value="${wine.name}" data-key="name" /></td>
        <td><input value="${wine.grape}" data-key="grape" /></td>
        <td><input value="${wine.region}" data-key="region" /></td>
        <td><input value="${wine.country}" data-key="country" /></td>
        <td><input type="number" value="${wine.vintage}" data-key="vintage" /></td>

        <td><select data-key="body">
          ${["light-body", "medium-body", "full-body"].map(val => `<option value="${val}" ${wine.body === val ? 'selected' : ''}>${val}</option>`).join('')}
        </select></td>

        <td><select data-key="tannin">
          ${["light-tannin", "medium-tannin", "full-tannin"].map(val => `<option value="${val}" ${wine.tannin === val ? 'selected' : ''}>${val}</option>`).join('')}
        </select></td>

        <td><select data-key="acidity">
          ${["light-acidity", "medium-acidity", "full-acidity"].map(val => `<option value="${val}" ${wine.acidity === val ? 'selected' : ''}>${val}</option>`).join('')}
        </select></td>

        <td><select data-key="coravin">
          <option value="true" ${wine.coravin ? 'selected' : ''}>true</option>
          <option value="false" ${!wine.coravin ? 'selected' : ''}>false</option>
        </select></td>

        <td><select data-key="btlOnly">
          <option value="true" ${wine.btlOnly ? 'selected' : ''}>true</option>
          <option value="false" ${!wine.btlOnly ? 'selected' : ''}>false</option>
        </select></td>

        <td><input value="${wine.sommNotes}" data-key="sommNotes" /></td>
        <td><button data-index="${index}" class="deleteBtn">❌</button></td>
      </tr>`;
    });

    tableHTML += `</tbody></table><br>
      <button id="exportJSON">Export JSON</button>`;

    tableContainer.innerHTML = tableHTML;

    // Hook delete buttons
    tableContainer.querySelectorAll(".deleteBtn").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.getAttribute("data-index"), 10);
        wines.splice(index, 1);
        renderTable();
      });
    });

    // Hook inline editing
    tableContainer.querySelectorAll("tbody input, tbody select").forEach(input => {
      input.addEventListener("input", () => {
        const row = input.closest("tr");
        const wine = wines.find(w => w.id === row.dataset.id);
        const key = input.dataset.key;
        if (key === "vintage") wine[key] = parseInt(input.value, 10) || null;
        else if (key === "coravin" || key === "btlOnly") wine[key] = input.value === "true";
        else wine[key] = input.value;
      });
    });

    // Hook export button
    document.getElementById("exportJSON").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(wines, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "wines.json";
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  // Handle Add Wine
  document.getElementById("addWineBtn").addEventListener("click", () => {
    const wine = getFormData();

    if (!wine.name || !wine.grape || !wine.region || !wine.country || !wine.vintage ||
        !wine.body || !wine.tannin || !wine.acidity || wine.coravin === null || wine.btlOnly === null) {
      alert("All fields except sommelier notes are required.");
      return;
    }

    wines.push(wine);
    renderTable();
    form.reset();
  });

  // Handle JSON Upload
  document.getElementById("uploadJSON").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (Array.isArray(parsed)) {
          parsed.forEach(wine => {
            if (!wine.id) wine.id = generateId();
            wines.push(wine);
          });
          renderTable();
        } else {
          alert("Invalid JSON format. Must be an array.");
        }
      } catch (err) {
        alert("Error reading JSON file: " + err.message);
      }
    };
    reader.readAsText(file);
  });

  // Auto-load local wines.json 
const publicJSONURL = 'https://pawelkrezel.github.io/WineFinder/wines.json';

fetch(publicJSONURL)
  .then(response => {
    if (!response.ok) throw new Error('Failed to load remote wines.json');
    return response.json();
  })
  .then(parsed => {
    if (Array.isArray(parsed)) {
      parsed.forEach(wine => {
        if (!wine.id) wine.id = generateId();
        wines.push(wine);
      });
      renderTable();
    }
  })
  .catch(err => {
    console.info("No remote wines.json loaded:", err.message);
  });

})();
