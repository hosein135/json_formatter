let formattedJSON = "";

function formatJSON() {
  const jsonInput = document.getElementById("json-input").value;
  try {
    const jsonObject = JSON.parse(jsonInput);
    formattedJSON = JSON.stringify(jsonObject, null, 2);
    displayFormattedJSON(formattedJSON);
  } catch (error) {
    displayError("JSON Data is invalid.");
  }
}

function searchJSON() {
  const searchTerm = document.getElementById("search").value.toLowerCase();
  if (searchTerm === "") {
    return;
  }

  if (formattedJSON) {
    const searchResult = formattedJSON
      .split("\n")
      .filter((line) => line.toLowerCase().includes(searchTerm));
    if (searchResult.length > 0) {
      displayFormattedJSON(searchResult.join("\n"));
    } else {
      displayError("No matches were found.");
    }
  } else {
    displayError("JSON Data is not formatted.");
  }
}

function displayFormattedJSON(json) {
  const jsonOutput = document.getElementById("json-output");
  jsonOutput.innerHTML = `<pre>${colorizeJSON(json)}</pre>`;
}

function displayError(message) {
  const jsonOutput = document.getElementById("json-output");
  jsonOutput.innerHTML = `<pre class="error">${message}</pre>`;
}

function copyToClipboard() {
  const visualJSON = document.getElementById("json-output");
  const textArea = document.createElement("textarea");
  textArea.value = visualJSON.textContent;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
}

function exportToFile() {
  if (formattedJSON) {
    const blob = new Blob([formattedJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted-json.json";
    a.click();
    URL.revokeObjectURL(url);
  } else {
    displayError("JSON Data is not formatted.");
  }
}

document.getElementById("importFile").addEventListener("change", function () {
  const fileInput = this;
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const importedJSON = e.target.result;
      document.getElementById("json-input").value = importedJSON;
      formatJSON();
    };
    reader.readAsText(file);
  }
});

function colorizeJSON(json) {
  return json
    .replace(
      /"(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?/g,
      (match) => `<span class="string">${match}</span>`
    )
    .replace(
      /\b(true|false|null)\b(\s*:)?/g,
      (match) => `<span class="boolean">${match}</span>`
    )
    .replace(
      /\b-?\d+(\.\d+)?([eE][+-]?\d+)?\b(\s*:)?/g,
      (match) => `<span class="number">${match}</span>`
    )
    .replace(/\{|\}|\[|\]/g, (match) => `<span class="object">${match}</span>`)
    .replace(/\,/g, '<span class="comma">,</span>');
}