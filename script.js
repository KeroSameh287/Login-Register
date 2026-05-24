document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupCollapseForm");

  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";
  });

  const toggle = document.getElementById("togglePass");
  const pass = document.getElementById("password");

  if (toggle) {
    toggle.addEventListener("click", () => {
      if (pass.type === "password") {
        pass.type = "text";
        toggle.textContent = "🙈";
      } else {
        pass.type = "password";
        toggle.textContent = "👁️";
      }
    });
  }

  function validateEmail(input) {
    const email = input.value.trim();

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hasPlus = email.includes("+");

    const isValid = regex.test(email) && !hasPlus;

    if (email && !isValid) {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
      return false;
    } else if (email) {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
      return true;
    }

    return false;
  }

  function validateForm(form) {
    let ok = true;

    form.querySelectorAll("input[required]").forEach((input) => {
      if (!input.value.trim()) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        ok = false;
      }

      if (input.type === "email") {
        if (!validateEmail(input)) ok = false;
      }
    });

    return ok;
  }

  function showAlert(message, type = "success") {
    const box = document.getElementById("formMessage");

    if (!box) return;

    box.innerHTML = `
      <div class="form-msg ${type}">
        ${message}
      </div>
    `;

    setTimeout(() => {
      box.innerHTML = "";
    }, 2000);
  }

  function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
  }

  function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateForm(signupForm)) return;

    const inputs = signupForm.querySelectorAll("input");

    const user = {
      name: inputs[0].value.trim(),
      email: inputs[1].value.trim().toLowerCase(),
      password: inputs[2].value,
    };

    const confirmPassword = inputs[3].value;

    if (user.password !== confirmPassword) {
      showAlert("Passwords do not match!", "danger");
      return;
    }

    let users = getUsers();

    const exists = users.find((u) => u.email.toLowerCase() === user.email);

    if (exists) {
      showAlert("Email already exists!", "danger");
      return;
    }

    users.push(user);
    saveUsers(users);

    showAlert("Account created successfully!", "success");
    signupForm.reset();
  });

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateForm(loginForm)) return;

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    const users = getUsers();

    const user = users.find(
      (u) => u.email.toLowerCase() === email && u.password === password,
    );

    if (!user) {
      showAlert("Invalid credentials!", "danger");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("isLoggedIn", "true");

    showAlert("Login successful!", "success");

    loginForm.reset();
  });
});
