const authPage = document.getElementById("authPage");

const app = document.getElementById("app");

const loginCard = document.getElementById("loginCard");

const registerCard = document.getElementById("registerCard");

const loginForm = document.getElementById("loginForm");

const registerForm = document.getElementById("registerForm");

const showRegister = document.getElementById("showRegister");

const showLogin = document.getElementById("showLogin");

const loginError = document.getElementById("loginError");

const registerError = document.getElementById("registerError");

let currentUser = null;

let transactions = [];
let currentCurrency = "USD";

function formatCurrency(amount) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currentCurrency,
  }).format(amount);
}

if (showLogin) {
  showLogin.addEventListener("click", function () {
    registerCard.style.display = "none";

    loginCard.style.display = "block";

    loginError.textContent = "";

    registerError.textContent = "";
  });
}

if (showRegister) {
  showRegister.addEventListener("click", function () {
    loginCard.style.display = "none";

    registerCard.style.display = "block";

    loginError.textContent = "";

    registerError.textContent = "";
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();

    const email = document
      .getElementById("registerEmail")
      .value.trim()
      .toLowerCase();

    const password = document.getElementById("registerPassword").value;

    const confirmPassword = document.getElementById("confirmPassword").value;

    registerError.textContent = "";

    if (!name || !email || !password || !confirmPassword) {
      registerError.textContent = "Please fill in all fields.";

      return;
    }

    if (password.length < 6) {
      registerError.textContent =
        "Password must contain at least 6 characters.";

      return;
    }

    if (password !== confirmPassword) {
      registerError.textContent = "Passwords do not match.";

      return;
    }

    const users = JSON.parse(localStorage.getItem("fintrack_users")) || [];

    const existingUser = users.find(function (user) {
      return user.email === email;
    });

    if (existingUser) {
      registerError.textContent = "An account with this email already exists.";

      return;
    }

    const newUser = {
      id: Date.now(),

      name: name,

      email: email,

      password: password,
    };

    users.push(newUser);

    localStorage.setItem("fintrack_users", JSON.stringify(users));

    registerForm.reset();

    registerError.textContent = "";

    loginCard.style.display = "block";

    registerCard.style.display = "none";

    document.getElementById("loginEmail").value = email;

    alert("Account created successfully. Please login.");
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document
      .getElementById("loginEmail")
      .value.trim()
      .toLowerCase();

    const password = document.getElementById("loginPassword").value;

    loginError.textContent = "";

    const users = JSON.parse(localStorage.getItem("fintrack_users")) || [];

    const user = users.find(function (user) {
      return user.email === email && user.password === password;
    });

    if (!user) {
      loginError.textContent = "Invalid email or password.";

      return;
    }

    currentUser = user;

    localStorage.setItem("fintrack_current_user", JSON.stringify(user));

    loginForm.reset();

    loadTransactions();

    loadUserSettings();

    showApplication();
  });
}

function showApplication() {
  if (authPage) {
    authPage.classList.remove("active");
  }

  if (app) {
    app.style.display = "";
  }

  updateUsername();

  renderTransactions();

  updateStats();
}

function updateUsername() {
  if (!currentUser) {
    return;
  }

  const username = document.querySelector(".username");

  if (username) {
    username.textContent = currentUser.name;
  }
}
function checkAuthentication() {
  const savedUser = localStorage.getItem("fintrack_current_user");

  if (!savedUser) {
    currentUser = null;

    if (app) {
      app.style.display = "none";
    }

    if (authPage) {
      authPage.classList.add("active");
    }

    return;
  }

  try {
    currentUser = JSON.parse(savedUser);
  } catch (error) {
    localStorage.removeItem("fintrack_current_user");

    currentUser = null;

    if (app) {
      app.style.display = "none";
    }

    if (authPage) {
      authPage.classList.add("active");
    }

    return;
  }

  loadTransactions();

  loadUserSettings();

  showApplication();
}

const logoutButton = document.querySelector(".logout");

if (logoutButton) {
  logoutButton.addEventListener("click", function () {
    localStorage.removeItem("fintrack_current_user");

    currentUser = null;

    transactions = [];

    if (app) {
      app.style.display = "none";
    }

    if (authPage) {
      authPage.classList.add("active");
    }

    if (loginCard) {
      loginCard.style.display = "block";
    }

    if (registerCard) {
      registerCard.style.display = "none";
    }

    if (loginError) {
      loginError.textContent = "";
    }

    if (loginForm) {
      loginForm.reset();
    }
  });
}

function getTransactionKey() {
  if (!currentUser) {
    return null;
  }

  return "fintrack_transactions_" + currentUser.email;
}

function loadTransactions() {
  if (!currentUser) {
    transactions = [];

    return;
  }

  const key = getTransactionKey();

  const savedTransactions = localStorage.getItem(key);

  if (!savedTransactions) {
    transactions = [];

    return;
  }

  try {
    transactions = JSON.parse(savedTransactions);
  } catch (error) {
    transactions = [];
  }
}

function saveTransactions() {
  if (!currentUser) {
    return;
  }

  const key = getTransactionKey();

  localStorage.setItem(key, JSON.stringify(transactions));
}

const navLinks = document.querySelectorAll(".nav-link");

const pages = document.querySelectorAll(".page");

navLinks.forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();

    navLinks.forEach(function (item) {
      item.classList.remove("active");
    });

    link.classList.add("active");

    pages.forEach(function (page) {
      page.classList.remove("active");
    });

    const pageName = link.dataset.page;

    const selectedPage = document.getElementById(pageName);

    if (selectedPage) {
      selectedPage.classList.add("active");
    }
  });
});

const modal = document.getElementById("transactionModal");

const openModal = document.getElementById("openModal");

const closeModal = document.getElementById("closeModal");

if (openModal) {
  openModal.addEventListener("click", function () {
    modal.classList.add("active");
  });
}

if (closeModal) {
  closeModal.addEventListener("click", function () {
    modal.classList.remove("active");
  });
}

if (modal) {
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.classList.remove("active");
    }
  });
}

const transactionForm = document.getElementById("transactionForm");

const transactionList = document.getElementById("transactionList");

if (transactionForm) {
  transactionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!currentUser) {
      return;
    }

    const transaction = {
      id: Date.now(),

      type: document.getElementById("transactionType").value,

      description: document.getElementById("description").value.trim(),

      amount: Number(document.getElementById("amount").value),

      date: document.getElementById("date").value,

      category: document.getElementById("category").value,
    };

    transactions.push(transaction);

    saveTransactions();

    renderTransactions();

    updateStats();

    transactionForm.reset();

    setDefaultDate();

    modal.classList.remove("active");
  });
}

function renderTransactions(filteredTransactions = null) {
  if (!transactionList) {
    return;
  }

  transactionList.innerHTML = "";

  const list = filteredTransactions || transactions;

  if (list.length === 0) {
    transactionList.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="
                        text-align: center;
                        padding: 30px;
                    "
                >
                    No transactions found.
                </td>

            </tr>

        `;

    return;
  }

  list.forEach(function (transaction) {
    const row = document.createElement("tr");

    row.dataset.id = String(transaction.id);

    const amount =
      transaction.type === "Income"
        ? `+${formatCurrency(transaction.amount)}`
        : `-${formatCurrency(transaction.amount)}`;

    const amountColor =
      transaction.type === "Income" ? "var(--green)" : "var(--red)";

    [transaction.date, transaction.description, transaction.category].forEach(
      function (value) {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      },
    );

    const amountCell = document.createElement("td");
    amountCell.textContent = amount;
    amountCell.style.color = amountColor;
    amountCell.style.fontWeight = "600";
    row.appendChild(amountCell);

    const actionsCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.dataset.id = String(transaction.id);
    deleteButton.textContent = "Delete";
    actionsCell.appendChild(deleteButton);
    row.appendChild(actionsCell);

    transactionList.appendChild(row);
  });
}

if (transactionList) {
  transactionList.addEventListener("click", function (event) {
    if (!(event.target instanceof Element)) {
      return;
    }

    const deleteButton = event.target.closest(".delete-btn");

    if (!deleteButton || !transactionList.contains(deleteButton)) {
      return;
    }

    const id = Number(deleteButton.dataset.id);

    transactions = transactions.filter(function (transaction) {
      return transaction.id !== id;
    });

    saveTransactions();

    renderTransactions();

    updateStats();

    filterTransactions();
  });
}

function updateStats() {
  let income = 0;

  let expense = 0;

  transactions.forEach(function (transaction) {
    if (transaction.type === "Income") {
      income += transaction.amount;
    } else {
      expense += transaction.amount;
    }
  });

  const balance = income - expense;

  const balanceElement = document.getElementById("balance");

  const incomeElement = document.getElementById("income");

  const expenseElement = document.getElementById("expense");

  const countElement = document.getElementById("transactionCount");

  if (balanceElement) {
    balanceElement.textContent = formatCurrency(balance);
  }

  if (incomeElement) {
    incomeElement.textContent = formatCurrency(income);
  }

  if (expenseElement) {
    expenseElement.textContent = formatCurrency(expense);
  }

  if (countElement) {
    countElement.textContent = transactions.length;
  }

  updateCashFlowChart();
}

function updateCashFlowChart() {
  let income = 0;

  let expense = 0;

  transactions.forEach(function (transaction) {
    if (transaction.type === "Income") {
      income += transaction.amount;
    } else {
      expense += transaction.amount;
    }
  });

  const incomeBar = document.getElementById("incomeBar");

  const expenseBar = document.getElementById("expenseBar");

  const incomeValue = document.getElementById("incomeChartValue");

  const expenseValue = document.getElementById("expenseChartValue");

  if (!incomeBar || !expenseBar) {
    return;
  }

  const maxValue = Math.max(income, expense);

  const chartHeight = 300;

  if (maxValue === 0) {
    incomeBar.style.height = "0px";

    expenseBar.style.height = "0px";
  } else {
    const incomeHeight = (income / maxValue) * chartHeight;

    const expenseHeight = (expense / maxValue) * chartHeight;

    incomeBar.style.height = `${incomeHeight}px`;

    expenseBar.style.height = `${expenseHeight}px`;
  }

  if (incomeValue) {
    incomeValue.textContent = formatCurrency(income);
  }

  if (expenseValue) {
    expenseValue.textContent = formatCurrency(expense);
  }
}

const searchInput = document.getElementById("searchInput");

const typeFilter = document.getElementById("typeFilter");

function filterTransactions() {
  if (!searchInput || !typeFilter) {
    return;
  }

  const search = searchInput.value.trim().toLowerCase();

  const type = typeFilter.value;

  const filtered = transactions.filter(function (transaction) {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(search);

    const matchesType = type === "all" || transaction.type === type;

    return matchesSearch && matchesType;
  });

  renderTransactions(filtered);
}

if (searchInput) {
  searchInput.addEventListener("input", filterTransactions);
}

if (typeFilter) {
  typeFilter.addEventListener("change", filterTransactions);
}

const darkMode = document.getElementById("darkMode");

function saveDarkMode(value) {
  if (!currentUser) {
    return;
  }

  localStorage.setItem(`fintrack_darkmode_${currentUser.email}`, value);
}

function loadDarkMode() {
  if (!darkMode || !currentUser) {
    return;
  }

  const savedMode = localStorage.getItem(
    `fintrack_darkmode_${currentUser.email}`,
  );

  const isDark = savedMode === "true";

  darkMode.checked = isDark;

  document.body.classList.toggle("dark", isDark);
}

if (darkMode) {
  darkMode.addEventListener("change", function () {
    const isDark = darkMode.checked;

    document.body.classList.toggle("dark", isDark);

    saveDarkMode(isDark);
  });
}

const resetBtn = document.getElementById("resetBtn");

if (resetBtn) {
  resetBtn.addEventListener("click", function () {
    if (transactions.length === 0) {
      alert("There are no transactions to reset.");

      return;
    }

    const confirmed = confirm(
      "Are you sure you want to delete all transactions?",
    );

    if (!confirmed) {
      return;
    }

    transactions = [];

    saveTransactions();

    renderTransactions();

    updateStats();

    if (searchInput) {
      searchInput.value = "";
    }

    if (typeFilter) {
      typeFilter.value = "all";
    }
  });
}

const settingsForm = document.getElementById("settingsForm");

function loadUserSettings() {
  if (!currentUser) {
    return;
  }

  const settings =
    JSON.parse(
      localStorage.getItem(`fintrack_settings_${currentUser.email}`),
    ) || {};

  const nameInput = document.getElementById("fullName");

  const currencyInput = document.getElementById("currency");

  if (nameInput) {
    nameInput.value = settings.name || currentUser.name;
  }

  if (currencyInput) {
    const availableCurrencies = Array.from(currencyInput.options).map(
      function (option) {
        return option.value;
      },
    );

    currentCurrency = availableCurrencies.includes(settings.currency)
      ? settings.currency
      : "USD";

    currencyInput.value = currentCurrency;
  }

  loadDarkMode();
}

if (settingsForm) {
  settingsForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!currentUser) {
      return;
    }

    const nameInput = document.getElementById("fullName");

    const currencyInput = document.getElementById("currency");

    const name = nameInput ? nameInput.value.trim() : currentUser.name;

    const currency = currencyInput ? currencyInput.value : "USD";

    const settings = {
      name: name,

      currency: currency,
    };

    localStorage.setItem(
      `fintrack_settings_${currentUser.email}`,
      JSON.stringify(settings),
    );

    currentUser.name = name;
    currentCurrency = currency;

    localStorage.setItem("fintrack_current_user", JSON.stringify(currentUser));

    const users = JSON.parse(localStorage.getItem("fintrack_users")) || [];

    const userIndex = users.findIndex(function (user) {
      return user.email === currentUser.email;
    });

    if (userIndex !== -1) {
      users[userIndex].name = name;

      localStorage.setItem("fintrack_users", JSON.stringify(users));
    }

    updateUsername();

    renderTransactions();

    updateStats();

    alert("Settings saved successfully.");
  });
}

function setDefaultDate() {
  const dateInput = document.getElementById("date");

  if (!dateInput) {
    return;
  }

  dateInput.value = new Date().toISOString().split("T")[0];
}

checkAuthentication();

setDefaultDate();
