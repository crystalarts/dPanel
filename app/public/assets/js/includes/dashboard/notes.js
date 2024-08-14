function notes() {
    var firewall = document.getElementById('firewall');
    var firewalllink = document.getElementById('firewall-link');
    var summary = document.getElementById('summary');
    var summarylink = document.getElementById('summary-link');
    var notes = document.getElementById('notes');
    var noteslink = document.getElementById('notes-link');

    if (notes.style.display === "none") {
        firewall.style.display = "none";
        summary.style.display = "none";
        notes.style.display = "flex";

        firewalllink.classList.remove('active');
        summarylink.classList.remove('active');
        noteslink.classList.add('active');
    }
}