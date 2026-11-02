document.querySelectorAll(".delete-item").forEach((button) => {
  button.addEventListener("click", () => {
    const confirmation = button
      .closest(".action")
      .querySelector(".confirm-delete");
    confirmation.showModal();
    confirmation.querySelector(".password").focus();
  });
});

document.querySelectorAll(".confirm-delete .reject").forEach((button) => {
  button.addEventListener("click", () => {
    button.closest(".confirm-delete").close();
  });
});

document.querySelectorAll(".save-edit").forEach((button) => {
  button.addEventListener("click", () => {
    const confirmation = document.querySelector(".confirm-update");
    const passwordInput = confirmation?.querySelector("#update-password");
    confirmation?.showModal();
    if (passwordInput) {
      passwordInput.disabled = false;
      passwordInput.focus();
    }
  });
});

document.querySelectorAll(".cancel-update").forEach((button) => {
  button.addEventListener("click", () => {
    button.closest(".confirm-update").close();
  });
});

document.querySelectorAll("form[data-auth-form]").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const passwordInput = form.elements.namedItem("password");
    const error = document.getElementById(
      passwordInput.getAttribute("aria-describedby"),
    );
    const submitButton = [...document.querySelectorAll('button[type="submit"]')]
      .find((button) => button.form === form);

    error.textContent = "";
    passwordInput.removeAttribute("aria-invalid");
    submitButton.disabled = true;

    let response;
    try {
      response = await fetch(form.action, {
        method: form.method,
        body: new URLSearchParams(new FormData(form)),
      });
    } catch {
      submitButton.disabled = false;
      error.textContent = "Could not verify the password. Please try again.";
      return;
    }

    if (response.status === 401) {
      const result = await response.json();
      error.textContent = result.error;
      passwordInput.setAttribute("aria-invalid", "true");
      passwordInput.focus();
      submitButton.disabled = false;
      return;
    }

    if (response.redirected) {
      window.location.assign(response.url);
      return;
    }

    const html = await response.text();
    document.open();
    document.write(html);
    document.close();
  });
});

document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  dialog.addEventListener("close", () => {
    const passwordInput = dialog.querySelector('[name="password"]');
    const error = dialog.querySelector(".password-error");
    if (passwordInput) {
      passwordInput.value = "";
      passwordInput.removeAttribute("aria-invalid");
    }
    if (error) {
      error.textContent = "";
    }

    const updatePasswordInput = dialog.querySelector("#update-password");
    if (updatePasswordInput) {
      updatePasswordInput.disabled = true;
    }
  });
});
