(function () {
  const form = document.getElementById('wineForm');
  const tableContainer = document.getElementById('tableContainer');
  const wines = [];

  const SELECT_FIELDS = {
    body: ["light-body", "medium-body", "full-body"],
    tannin: ["light-tannin", "medium-tannin", "full-tannin"],
    acidity: ["light-acidity", "medium-acidity", "full-acidity"],
    coravin: ["true", "false"],
    glass: ["Standard", "Burgundy", "Bordeaux", "Flute", "Tst"]
  };

  function generateId() {
    return 'xxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

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
      glass: formData.get("glass"),
      sommNotes: formData.get("sommNotes")?.trim() || ""
    };
  }

  function renderSelect(key, value) {
    return `<select data-key="${key}">${SELECT_FIELDS[key].map(opt => 
      `<option value="${opt}" ${opt == value ? 'selected' : ''}>${opt}</option>`
    ).join("")}</select>`;
  }

let sortKey = null;
let sortDirection = 'asc';

function renderTable() {
  if (wines.length === 0) {
    tableContainer.innerHTML = "";
    return;
  }

  const headers = [
    { label: "Name", key: "name" },
    { label: "Grape", key: "grape" },
    { label: "Region", key: "region" },
    { label: "Country", key: "country" },
    { label: "Vintage", key: "vintage" },
    { label: "Body", key: "body" },
    { label: "Tannin", key: "tannin" },
    { label: "Acidity", key: "acidity" },
    { label: "Coravin", key: "coravin" },
    { label: "Somm Notes", key: "sommNotes" },
    { label: "Glass", key: "glass" },
  ];

  // Sort the wines array if a sort key is active
  if (sortKey) {
    wines.sort((a, b) => {
      const valA = a[sortKey]?.toString().toLowerCase();
      const valB = b[sortKey]?.toString().toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  let tableHTML = `<table border="1"><thead><tr>`;

  // Generate headers with sort buttons
  headers.forEach(header => {
    const directionSymbol = (sortKey === header.key)
      ? (sortDirection === 'asc' ? ' 🔼' : ' 🔽')
      : '';
    tableHTML += `<th data-key="${header.key}" class="sortable">${header.label}${directionSymbol}</th>`;
  });

  tableHTML += `<th>Delete</th></tr></thead><tbody>`;

  wines.forEach((wine, index) => {
    tableHTML += `<tr data-id="${wine.id}">
      <td><input value="${wine.name}" data-key="name" /></td>
      <td><input value="${wine.grape}" data-key="grape" /></td>
      <td><input value="${wine.region}" data-key="region" /></td>
      <td><input value="${wine.country}" data-key="country" /></td>
      <td><input type="number" value="${wine.vintage}" data-key="vintage" /></td>
      <td>
        <select data-key="body">
          <option value="light-body" ${wine.body === "light-body" ? "selected" : ""}>Light</option>
          <option value="medium-body" ${wine.body === "medium-body" ? "selected" : ""}>Medium</option>
          <option value="full-body" ${wine.body === "full-body" ? "selected" : ""}>Full</option>
        </select>
      </td>
      <td>
        <select data-key="tannin">
          <option value="light-tannin" ${wine.tannin === "light-tannin" ? "selected" : ""}>Light</option>
          <option value="medium-tannin" ${wine.tannin === "medium-tannin" ? "selected" : ""}>Medium</option>
          <option value="full-tannin" ${wine.tannin === "full-tannin" ? "selected" : ""}>Full</option>
        </select>
      </td>
      <td>
        <select data-key="acidity">
          <option value="light-acidity" ${wine.acidity === "light-acidity" ? "selected" : ""}>Light</option>
          <option value="medium-acidity" ${wine.acidity === "medium-acidity" ? "selected" : ""}>Medium</option>
          <option value="full-acidity" ${wine.acidity === "full-acidity" ? "selected" : ""}>Full</option>
        </select>
      </td>
      <td>
        <select data-key="coravin">
          <option value="true" ${wine.coravin ? "selected" : ""}>Yes</option>
          <option value="false" ${!wine.coravin ? "selected" : ""}>No</option>
        </select>
      </td>
      <td><input value="${wine.sommNotes}" data-key="sommNotes" /></td>
      <td>
        <select data-key="glass">
          <option value="Standard" ${wine.glass === "Standard" ? "selected" : ""}>Standard</option>
          <option value="Burgundy" ${wine.glass === "Burgundy" ? "selected" : ""}>Burgundy</option>
          <option value="Bordeaux" ${wine.glass === "Bordeaux" ? "selected" : ""}>Bordeaux</option>
          <option value="Flute" ${wine.glass === "Flute" ? "selected" : ""}>Flute</option>
          <option value="Tst" ${wine.glass === "Tst" ? "selected" : ""}>Tst</option>
        </select>
      </td>
      <td><button data-index="${index}" class="deleteBtn">❌</button></td>
    </tr>`;
  });

  tableHTML += `</tbody></table><br>
    <button id="exportJSON">Export JSON</button>`;

  tableContainer.innerHTML = tableHTML;

  // Handle sort header clicks
  tableContainer.querySelectorAll("th.sortable").forEach(th => {
    th.addEventListener("click", () => {
      const key = th.getAttribute("data-key");
      if (sortKey === key) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        sortKey = key;
        sortDirection = 'asc';
      }
      renderTable();
    });
  });

  // Re-hook delete and input logic
  tableContainer.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.getAttribute("data-index"), 10);
      wines.splice(index, 1);
      renderTable();
    });
  });

  tableContainer.querySelectorAll("tbody input, tbody select").forEach(input => {
    input.addEventListener("input", () => {
      const row = input.closest("tr");
      const wine = wines.find(w => w.id === row.dataset.id);
      const key = input.dataset.key;

      if (key === "vintage") wine[key] = parseInt(input.value, 10) || null;
      else if (key === "coravin") wine[key] = input.value === "true";
      else wine[key] = input.value;
    });
  });

  // Re-hook export
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


  document.getElementById("addWineBtn").addEventListener("click", () => {
    const wine = getFormData();
    if (!wine.name || !wine.grape || !wine.region || !wine.country || !wine.vintage ||
        !wine.body || !wine.tannin || !wine.acidity || wine.coravin === null || !wine.glass) {
      alert("All fields except sommelier notes are required.");
      return;
    }

    wines.push(wine);
    renderTable();
    form.reset();
  });

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
})();
