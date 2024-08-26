function notes() {
  var api = document.getElementById("apitokens");
  var apilink = document.getElementById("apitokens-link");
  var firewall = document.getElementById("firewall");
  var firewalllink = document.getElementById("firewall-link");
  var summary = document.getElementById("summary");
  var summarylink = document.getElementById("summary-link");
  var notes = document.getElementById("notes");
  var noteslink = document.getElementById("notes-link");
  var user = document.getElementById("users");
  var userlink = document.getElementById("users-link");
  var support = document.getElementById("support");
  var supportlink = document.getElementById("support-link");

  if (notes.style.display === "none") {
    firewall.style.display = "none";
    api.style.display = "none";
    summary.style.display = "none";
    notes.style.display = "flex";
    user.style.display = "none";
    support.style.display = "none";

    apilink.classList.remove("active");
    firewalllink.classList.remove("active");
    summarylink.classList.remove("active");
    noteslink.classList.add("active");
    userlink.classList.remove("active");
    supportlink.classList.remove("active");
  }
}

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
