function editNotes() {
  document.getElementById("notesModal").style.display = "block";
  document.getElementById("notesTextarea").value =
    document.getElementById("noteDisplay").innerText;
}

function saveNotes() {
  var note = document.getElementById("notesTextarea").value;

  document.getElementById("noteDisplay").innerText = note;

  fetch("/admin/_api/v1/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: note }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(`HTTP error ${response.status}: ${text}`);
        });
      }
      return response.text();
    })
    .then((data) => {
      closeNotes();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function closeNotes() {
  document.getElementById("notesModal").style.display = "none";
}

function refreshNotes() {
  document.getElementById("notesTextarea").value = "";
}
