document.addEventListener("DOMContentLoaded", () => {
  const notifications = document.querySelectorAll(".notification");
  notifications.forEach((notification) => {
    setTimeout(() => {
      notification.classList.add("hide");
      notification.addEventListener("transitionend", () => {
        notification.remove();
      });
    }, 10000);
  });
});
