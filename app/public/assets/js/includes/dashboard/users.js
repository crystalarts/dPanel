function showEditForm(id, name, email, isVerified) {
  document.querySelector("#edit-form").style.display = "block";
  document.querySelector('#edit-form input[name="name"]').value = name;
  document.querySelector('#edit-form input[name="email"]').value = email;
  document.querySelector('#edit-form input[name="password"]').value = "";
  document.querySelector('#edit-form input[name="verified"]').checked =
    isVerified;
  document.querySelector("#edit-form").action = "/edit-user/" + id;
}
