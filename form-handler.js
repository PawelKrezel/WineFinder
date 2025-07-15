// Dear wine manager, you may want to add a link to your wines.json file. 
// Please navigate to line 191 in form-handler.js to find the publicJSONURL variable.
// If you need help with this, please contact Pawel Krezel.

(function () {
  // Get references to form and table container
  const form = document.getElementById('wineForm');
  const tableContainer = document.getElementById('tableContainer');
  const wines = []; // Main array storing wine entries

  // UUID-like ID generator for uniquely identifying each wine
  function generateId() {
    return 'xxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Read form data into a wine object
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
      sommNotes: formData.get("sommNotes")?.trim() || "",
      imageUrl: formData.get("imageUrl")?.trim() || ""
    };
  }

  // Render wines as editable HTML table
  function renderTable() {
    if (wines.length === 0) {
      tableContainer.innerHTML = "";
      return;
    }
    // Build table header
    let tableHTML = `<table border="1"><thead><tr>
      <th>Name</th><th>Grape</th><th>Region</th><th>Country</th><th>Vintage</th>
      <th>Body</th><th>Tannin</th><th>Acidity</th><th>Coravin</th><th>Btl Only</th>
      <th>Somm Notes</th><th>Image</th><th>Delete</th>
    </tr></thead><tbody>`;

    // Build each row with editable fields and controls
    wines.forEach((wine, index) => {
      tableHTML += `<tr data-id="${wine.id}">
        <td><input value="${wine.name}" data-key="name" /></td>
        <td><input value="${wine.grape}" data-key="grape" /></td>
        <td><input value="${wine.region}" data-key="region" /></td>
        <td><input value="${wine.country}" data-key="country" /></td>
        <td><input type="number" value="${wine.vintage}" data-key="vintage" /></td>

        <td>
          <select data-key="body">
            <option value="light-body"${wine.body === "light-body" ? " selected" : ""}>Light</option>
            <option value="medium-body"${wine.body === "medium-body" ? " selected" : ""}>Medium</option>
            <option value="full-body"${wine.body === "full-body" ? " selected" : ""}>Full</option>
          </select>
        </td>

        <td>
          <select data-key="tannin">
            <option value="light-tannin"${wine.tannin === "light-tannin" ? " selected" : ""}>Light</option>
            <option value="medium-tannin"${wine.tannin === "medium-tannin" ? " selected" : ""}>Medium</option>
            <option value="full-tannin"${wine.tannin === "full-tannin" ? " selected" : ""}>Full</option>
          </select>
        </td>

        <td>
          <select data-key="acidity">
            <option value="light-acidity"${wine.acidity === "light-acidity" ? " selected" : ""}>Light</option>
            <option value="medium-acidity"${wine.acidity === "medium-acidity" ? " selected" : ""}>Medium</option>
            <option value="full-acidity"${wine.acidity === "full-acidity" ? " selected" : ""}>Full</option>
          </select>
        </td>

        <td>
          <select data-key="coravin">
            <option value="true"${wine.coravin ? " selected" : ""}>Yes</option>
            <option value="false"${!wine.coravin ? " selected" : ""}>No</option>
          </select>
        </td>

        <td>
          <select data-key="btlOnly">
            <option value="true"${wine.btlOnly ? " selected" : ""}>Yes</option>
            <option value="false"${!wine.btlOnly ? " selected" : ""}>No</option>
          </select>
        </td>

        <td><input value="${wine.sommNotes}" data-key="sommNotes" /></td>

        <td>
          ${wine.imageUrl ? `<img src="${wine.imageUrl}" alt="Wine Image" width="50"><br>` : ""}
          <input type="url" value="${wine.imageUrl}" data-key="imageUrl" placeholder="Image URL" />
        </td>

        <td><button data-index="${index}" class="deleteBtn">❌</button></td>
      </tr>`;
    });

    tableHTML += `</tbody></table><br><button id="exportJSON">Export JSON</button>`;
    tableContainer.innerHTML = tableHTML;

    // Delete wine from table and array
    tableContainer.querySelectorAll(".deleteBtn").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.getAttribute("data-index"), 10);
        wines.splice(index, 1);
        renderTable();
      });
    });

    // Live update wine object when input/select changes
    tableContainer.querySelectorAll("tbody input, tbody select").forEach(input => {
      input.addEventListener("input", () => {
        const row = input.closest("tr");
        const wine = wines.find(w => w.id === row.dataset.id);
        const key = input.dataset.key;
        if (key === "vintage") wine[key] = parseInt(input.value, 10) || null;
        else if (key === "coravin" || key === "btlOnly") wine[key] = input.value === "true";
        else wine[key] = input.value;
        renderTable(); // re-render to refresh image preview
      });
    });

    // Export wines array to downloadable JSON file
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

  // Add new wine entry from form
  document.getElementById("addWineBtn").addEventListener("click", () => {
    const wine = getFormData();
    // Validate required fields
    if (!wine.name || !wine.grape || !wine.region || !wine.country || !wine.vintage ||
      !wine.body || !wine.tannin || !wine.acidity || wine.coravin === null || wine.btlOnly === null) {
      alert("All fields except image and sommelier notes are required.");
      return;
    }
    
    wines.push(wine);
    renderTable();
    form.reset();
  });

  // Handle uploaded JSON file from input
  document.getElementById("uploadJSON").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (Array.isArray(parsed)) {
          parsed.forEach(wine => {
            if (!wine.id) wine.id = generateId(); // Ensure each wine has a unique ID
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

  // Auto-load wines.json 

  // ‼️ FOR WINE MANAGER TO EDIT ‼️
  const publicJSONURL = 'https://pawelkrezel.github.io/WineFinder/wines.json';
  // ⚠️ replace the link above with accurate wines.json URL ⚠️
  // Contact Pawel Krezel if you need help with this.

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

  // Handle image preview in the form based on user input
  const imageUrlInput = document.getElementById("imageUrlInput");
  const imagePreview = document.getElementById("imagePreview");

  imageUrlInput.addEventListener("input", () => {
  const url = imageUrlInput.value.trim();
  if (url) {
    imagePreview.src = url;
    imagePreview.style.display = "block";
  } else {
    imagePreview.src = "";
    imagePreview.style.display = "none";
  }
});
})();