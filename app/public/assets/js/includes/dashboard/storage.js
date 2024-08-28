function storage() {
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
  var storage = document.getElementById("storage");
  var storagelink = document.getElementById("storage-link");

  if (storage.style.display === "none") {
    summary.style.display = "none";
    api.style.display = "none";
    firewall.style.display = "none";
    notes.style.display = "none";
    user.style.display = "none";
    support.style.display = "none";
    storage.style.display = "flex";

    apilink.classList.remove("active");
    summarylink.classList.remove("active");
    firewalllink.classList.remove("active");
    noteslink.classList.remove("active");
    userlink.classList.remove("active");
    supportlink.classList.remove("active");
    storagelink.classList.add("active");
  }
}
