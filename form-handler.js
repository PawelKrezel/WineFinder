// Dear wine manager, you may want to add a link to your wines.json file. 
// Please navigate to line 232 in form-handler.js to find the publicJSONURL variable.
// If you need help with this, please contact the author at https://github.com/PawelKrezel

(function () {
  // Get references to form and table container
  const form = document.getElementById('wineForm');
  const tableContainer = document.getElementById('tableContainer');
  window.wines = []; // Main array storing wine entries
  window.occupiedCells = []; // array which will store coordinates for occupied shelves

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
      shelves:[],
      name: formData.get("name").trim(),
      grape: formData.get("grape").trim(),
      region: formData.get("region").trim(),
      country: formData.get("country").trim(),
      vintage: parseInt(formData.get("vintage"), 10),
      body: formData.get("body"),
      tannin: formData.get("tannin"),
      acidity: formData.get("acidity"),
      glass: formData.get("glass"),
      coravin: formData.get("coravin") === "true",
      btlOnly: formData.get("btlOnly") === "true",
      sommNotes: formData.get("sommNotes")?.trim() || "",
      imageUrl: formData.get("imageUrl")?.trim() || "",
    };
  }

// Render wines as editable HTML table
// State for sorting
let currentSortKey = null;
let currentSortDir = 1; // 1 for ascending, -1 for descending

function renderTable() {
  if (wines.length === 0) {
    tableContainer.innerHTML = "";
    return;
  }

  // Define sortable headers
  const headers = [
    { key: "name", label: "Name 🏷️" },
    { key: "grape", label: "Grape 🍇" },
    { key: "region", label: "Region 📌" },
    { key: "country", label: "Country 🗺️" },
    { key: "vintage", label: "Vintage 🗓️" },
    { key: "body", label: "Body" },
    { key: "tannin", label: "Tannin" },
    { key: "acidity", label: "Acidity" },
    { key: "glass", label: "Glass"},
    { key: "coravin", label: "Coravin" },
    { key: "btlOnly", label: "Btl Only" },
    { key: "sommNotes", label: "Somm Notes" },
    { key: "imageUrl", label: "Image 📸" },
    { key: "delete", label: "Delete 🗑️" }
  ];

  // Sort wines if applicable
  if (currentSortKey && currentSortKey !== "delete") {
    wines.sort((a, b) => {
      const valA = a[currentSortKey];
      const valB = b[currentSortKey];
      if (typeof valA === "number" && typeof valB === "number") {
        return (valA - valB) * currentSortDir;
      }
      return String(valA).localeCompare(String(valB)) * currentSortDir;
    });
  }

  // Build table header
  let tableHTML = `<table><thead><tr>`;
  headers.forEach(header => {
    if (header.key === "delete") {
      tableHTML += `<th>${header.label}</th>`;
    } else {
      tableHTML += `<th data-key="${header.key}" style="cursor:pointer">${header.label}</th>`;
    }
  });
  tableHTML += `</tr></thead><tbody>`;

  // Build table body - each row with editable fields and controls
  // Will also add those wines to the dropdown list underneath the cellar
  let dropDownHTMLs = []; // array of HTML snippets to be sorted later
  wines.forEach((wine, index) => {
    tableHTML += `<tr data-id="${wine.id}">
      <td><input class="commonStyle" value="${wine.name}" data-key="name" /></td>
      <td><input class="commonStyle" value="${wine.grape}" data-key="grape" /></td>
      <td><input class="commonStyle" value="${wine.region}" data-key="region" /></td>
      <td><input class="commonStyle" value="${wine.country}" data-key="country" /></td>
      <td><input class="commonStyle" type="number" value="${wine.vintage}" data-key="vintage" /></td>

      <td><select data-key="body" class="commonStyle">
        <option value="light-body"${wine.body === "light-body" ? " selected" : ""}>Light</option>
        <option value="medium-body"${wine.body === "medium-body" ? " selected" : ""}>Medium</option>
        <option value="full-body"${wine.body === "full-body" ? " selected" : ""}>Full</option>
      </select></td>

      <td><select data-key="tannin" class="commonStyle">
        <option value="light-tannin"${wine.tannin === "light-tannin" ? " selected" : ""}>Light</option>
        <option value="medium-tannin"${wine.tannin === "medium-tannin" ? " selected" : ""}>Medium</option>
        <option value="full-tannin"${wine.tannin === "full-tannin" ? " selected" : ""}>Full</option>
      </select></td>

      <td><select data-key="acidity" class="commonStyle">
        <option value="light-acidity"${wine.acidity === "light-acidity" ? " selected" : ""}>Light</option>
        <option value="medium-acidity"${wine.acidity === "medium-acidity" ? " selected" : ""}>Medium</option>
        <option value="full-acidity"${wine.acidity === "full-acidity" ? " selected" : ""}>Full</option>
      </select></td>

      <td><select data-key="glass" class="commonStyle">
        <option value="Tst"${wine.glass === "Tst" ? " selected" : ""}>Tst Glass</option>
        <option value="Flute"${wine.glass === "Flute" ? " selected" : ""}>Flute</option>
        <option value="Burgundy"${wine.glass === "Burgundy" ? " selected" : ""}>Burgundy</option>
        <option value="Bordeaux"${wine.glass === "Bordeaux" ? " selected" : ""}>Bordeaux</option>
        <option value="Standard"${wine.glass === "Standard" ? " selected" : ""}>Standard</option>
      </select></td>

      <td><select data-key="coravin" class="commonStyle">
        <option value="true"${wine.coravin ? " selected" : ""}>Yes</option>
        <option value="false"${!wine.coravin ? " selected" : ""}>No</option>
      </select></td>

      <td><select data-key="btlOnly" class="commonStyle">
        <option value="true"${wine.btlOnly ? " selected" : ""}>Yes</option>
        <option value="false"${!wine.btlOnly ? " selected" : ""}>No</option>
      </select></td>

      <td><input value="${wine.sommNotes}" data-key="sommNotes" class="commonStyle"/></td>

      <td class="img-parent">
        ${wine.imageUrl ? `<img src="${wine.imageUrl}" alt="Wine Image"><br>` : ""}
        <input type="url" value="${wine.imageUrl}" data-key="imageUrl" placeholder="Image URL" class="commonStyle" />
      </td>

      <td><button data-index="${index}" class="deleteBtn">❌</button></td>
    </tr>`;
    occupiedCells.push([wine.shelves, `${wine.vintage} ${wine.name} (${wine.id})`]);
    dropDownHTMLs.push(`<option value="${wine.id}" title="(${wine.name}) ${wine.id}" id="map-to-cellar-${wine.id}">${wine.name} - ${wine.vintage} ${wine.grape} from ${wine.region}</option>`);
  });

  tableHTML += `</tbody></table><br>`;
  tableContainer.innerHTML = tableHTML;

  dropDownHTMLs.sort();
  let dropDownHTML = `<option selected>Please select a wine</option>`;
  dropDownHTMLs.forEach((snippet) => {
    dropDownHTML += snippet;
  });
  document.getElementById("wineDropDownSelection").innerHTML = dropDownHTML;
  

  // Sorting event listeners
  tableContainer.querySelectorAll("thead th[data-key]").forEach(th => {
    th.addEventListener("click", () => {
      const key = th.getAttribute("data-key");
      if (currentSortKey === key) {
        currentSortDir *= -1; // Toggle direction
      } else {
        currentSortKey = key;
        currentSortDir = 1;
      }
      renderTable();
    });
  });

  // Delete wine
  tableContainer.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.getAttribute("data-index"), 10);
      wines.splice(index, 1);
      renderTable();
    });
  });

  // Live update wine object on input/select
  tableContainer.querySelectorAll("tbody input, tbody select").forEach(input => {
    input.addEventListener("input", () => {
      const row = input.closest("tr");
      const wine = wines.find(w => w.id === row.dataset.id);
      const key = input.dataset.key;
      if (key === "vintage") wine[key] = parseInt(input.value, 10) || null;
      else if (key === "coravin" || key === "btlOnly") wine[key] = input.value === "true";
      else wine[key] = input.value;
      renderTable(); // refresh image
    });
  });

  // Export button
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
          drawCellar();
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

//render a minimap of the winecellar
function drawShelf(width, height, shelfID, headerContent=" <br> ", addHeader=true, addRowNo=false){
  let htmlCode = `<table id="${shelfID}">`;
  let msg = "";
  let cellID = "";
  if(addHeader){
    htmlCode += `<thead><tr><th colspan="${width}">${headerContent}</th></tr></thead>`;
  } htmlCode += `<tbody>`;
  for (let y=1; y<=height; y++){
    htmlCode += `<tr>`;
    for (let x=1; x<=width; x++){
      if(addRowNo){
        if(x==1 || x == width){
          msg = y;
        }else{msg=""}
      }
      cellID = `${x}-${y}-${shelfID}`;
      htmlCode += `<td class="shelfSlot" id="${cellID}" value="${cellID}" 
      title="${cellID}">
      ${msg}
      ${isOccupied(cellID) ? "X":""}
      </td>`;
    }
    htmlCode += `</tr>`;
  }
  htmlCode += `</tbody></table>`;

  return htmlCode;
}

// will be used by the drawShelf function to flag a shelf as already occupied
function isOccupied(cellID){
  let occupied = false;
  occupiedCells.forEach(element => {
    element[0].forEach(cell => {
      cell==cellID ? occupied=true : NaN;
    })
  });
  return occupied;
}

function drawCellar(){
  document.getElementById("s1-container").innerHTML = drawShelf(9, 25, "s1", "First shelf");
  document.getElementById("s2-container").innerHTML = drawShelf(9, 25, "s2", "Second shelf");
  document.getElementById("s3-container").innerHTML = drawShelf(9, 25, "s3", "Third shelf");
  document.getElementById("s4-container").innerHTML = drawShelf(7, 25, "s4", "Fourth shelf");
  document.getElementById("s5-container").innerHTML = drawShelf(9, 25, "s5", "Fifth shelf from the entrance<br>Second shelf from the bar");
  document.getElementById("s6-container").innerHTML = drawShelf(8, 25, "s6", "Sixth shelf from the entrance<br>First shelf from the bar");

  document.getElementById("g1-container").innerHTML = drawShelf(1, 25, "g1", "<br>", true, true);
  document.getElementById("g2-container").innerHTML = drawShelf(1, 25, "g2", "<br>", true, true);
  document.getElementById("g3-container").innerHTML = drawShelf(7, 25, "g3", "<br>", true, true);
  document.getElementById("g4-container").innerHTML = drawShelf(13, 25, "g4", "Curve Leading to the bar", true, true);
  document.getElementById("g5-container").innerHTML = drawShelf(1, 25, "g5", "<br>", true, true);
}
drawCellar();



// --- Wine-to-Cellar Mapping Feature ---

const wineDropdown = document.getElementById("wineDropDownSelection");
const confirmBtn = document.getElementById("confirmAllocationBtn");
// Track currently selected wine ID and selected cells
let currentWineId = null;
let selectedCells = new Set();

// When wine is selected, clear highlights and tracking
wineDropdown.addEventListener("change", (e) => {
  currentWineId = e.target.value;
  selectedCells.clear();

  // Reset any existing highlights
  document.querySelectorAll(".shelfSlot").forEach(cell => {
    cell.style.backgroundColor = "";
  });

  // Highlight any existing allocations for this wine (if any)
  if (currentWineId && typeof wines !== "undefined") {
    const wine = wines.find(w => w.id === currentWineId);
    if (wine && Array.isArray(wine.shelves)) {
      wine.shelves.forEach(id => {
        const cell = document.getElementById(id);
        if (cell) cell.style.backgroundColor = "red";
        selectedCells.add(id);
      });
    }
  }
});

// Add click handler to toggle cell selection
document.querySelectorAll(".shelfSlot").forEach(cell => {
  cell.addEventListener("click", () => {
    if (!currentWineId) {
      alert("Please select a wine from the dropdown first.");
      return;
    }

    const cellId = cell.id;

    // Toggle highlight and tracking
    if (selectedCells.has(cellId)) {
      selectedCells.delete(cellId);
      cell.style.backgroundColor = "";
    } else {
      selectedCells.add(cellId);
      cell.style.backgroundColor = "red";
    }
  });
});

// Confirm allocation and export updated JSON
confirmBtn.addEventListener("click", () => {
  if (!currentWineId) {
    alert("Please select a wine first.");
    return;
  }


  const wine = wines.find(w => w.id === currentWineId);
  if (!wine) {
    alert("Selected wine not found in the list.");
    return;
  }

  // Save shelves array for selected wine
  wine.shelves = Array.from(selectedCells);

  alert(`Allocation saved for ${wine.name} (${wine.shelves.length} cells).`);
});
