// Global variables
let currentTab = 'dashboard';
let currentPage = 1;
let currentMonth = '';
let currentCategory = '';
let searchQuery = '';

// DOM elements
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const transactionModal = document.getElementById('transaction-modal');
const budgetModal = document.getElementById('budget-modal');
const addTransactionBtn = document.getElementById('add-transaction-btn');
const addBudgetBtn = document.getElementById('add-budget-btn');
const transactionForm = document.getElementById('transaction-form');
const budgetForm = document.getElementById('budget-form');
const monthFilter = document.getElementById('month-filter');
const categoryFilter = document.getElementById('category-filter');
const searchFilter = document.getElementById('search-filter');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadDashboardData();
    setDefaultDate();
});

// Initialize event listeners
function initializeEventListeners() {
    // Tab navigation
    tabButtons.forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });

    // Modal controls
    addTransactionBtn.addEventListener('click', () => openModal('transaction'));
    addBudgetBtn.addEventListener('click', () => openModal('budget'));

    // Modal close events
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModals);
    });

    document.querySelectorAll('.btn-secondary').forEach(cancelBtn => {
        cancelBtn.addEventListener('click', closeModals);
    });

    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModals();
        }
    });

    // Form submissions
    transactionForm.addEventListener('submit', handleTransactionSubmit);
    budgetForm.addEventListener('submit', handleBudgetSubmit);

    // Filters
    monthFilter.addEventListener('change', handleFiltersChange);
    categoryFilter.addEventListener('change', handleFiltersChange);
    searchFilter.addEventListener('input', handleFiltersChange);
}

// Tab switching
function switchTab(tabName) {
    // Update active tab button
    tabButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update active tab content
    tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');

    currentTab = tabName;

    // Load data for the selected tab
    switch(tabName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'transactions':
            loadTransactions();
            break;
        case 'budgets':
            loadBudgets();
            break;
        case 'goals':
            loadGoals();
            break;
    }
}

// Modal functions
function openModal(type) {
    if (type === 'transaction') {
        transactionModal.classList.add('show');
    } else if (type === 'budget') {
        budgetModal.classList.add('show');
    }
}

function closeModals() {
    transactionModal.classList.remove('show');
    budgetModal.classList.remove('show');
    transactionForm.reset();
    budgetForm.reset();
}

// Set default date for transaction form
function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('transaction-date').value = today;
}

// Handle filters change
function handleFiltersChange() {
    currentMonth = monthFilter.value;
    currentCategory = categoryFilter.value;
    searchQuery = searchFilter.value;
    currentPage = 1;
    loadTransactions();
}

// API calls
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`/api/${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        showNotification('Error: ' + error.message, 'error');
        return null;
    }
}

// Load dashboard data
async function loadDashboardData() {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    // Load summary
    const summary = await apiCall(`summary?month=${month}&year=${year}`);
    if (summary) {
        document.getElementById('total-income').textContent = `$${summary.total_income.toFixed(2)}`;
        document.getElementById('total-expenses').textContent = `$${summary.total_expenses.toFixed(2)}`;
        document.getElementById('net-savings').textContent = `$${summary.net_savings.toFixed(2)}`;
        document.getElementById('savings-rate').textContent = `${summary.savings_rate.toFixed(2)}%`;
    }

    // Load charts data
    loadChartsData(month, year);
}

// Load charts data
async function loadChartsData(month, year) {
    // Category breakdown
    const categoryData = await apiCall(`category-breakdown?month=${month}&year=${year}`);
    if (categoryData) {
        updateCategoryChart(categoryData.categories);
    }

    // Monthly trend
    const trendData = await apiCall(`monthly-trend?year=${year}`);
    if (trendData) {
        updateTrendChart(trendData.monthly_trend);
    }

    // Budget status
    const budgetData = await apiCall(`budget-status?month=${month}&year=${year}`);
    if (budgetData) {
        updateBudgetChart(budgetData.budget_status);
    }

    // Savings progress
    const savingsData = await apiCall('savings-progress');
    if (savingsData) {
        updateSavingsChart(savingsData.savings_goals);
    }
}

// Load transactions
async function loadTransactions() {
    let url = `transactions?page=${currentPage}&per_page=10`;

    if (currentMonth) url += `&month=${currentMonth}`;
    if (currentCategory) url += `&category=${currentCategory}`;

    const data = await apiCall(url);
    if (data) {
        displayTransactions(data.transactions);
        updatePagination(data.total_pages, data.page);
    }
}

// Display transactions in table
function displayTransactions(transactions) {
    const tbody = document.getElementById('transactions-tbody');
    tbody.innerHTML = '';

    transactions.forEach(transaction => {
        const row = document.createElement('tr');

        const typeClass = transaction.type === 'credit' ? 'transaction-credit' : 'transaction-debit';
        const amountPrefix = transaction.type === 'credit' ? '+' : '-';

        row.innerHTML = `
            <td>${formatDate(transaction.transaction_date)}</td>
            <td>${transaction.description || 'N/A'}</td>
            <td>${transaction.category}</td>
            <td><span class="${typeClass}">${transaction.type.toUpperCase()}</span></td>
            <td class="${typeClass}">${amountPrefix}$${transaction.amount.toFixed(2)}</td>
        `;

        tbody.appendChild(row);
    });
}

// Update pagination
function updatePagination(totalPages, currentPage) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    // Previous button
    if (currentPage > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.textContent = 'Previous';
        prevBtn.className = 'pagination-btn';
        prevBtn.addEventListener('click', () => changePage(currentPage - 1));
        pagination.appendChild(prevBtn);
    }

    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.addEventListener('click', () => changePage(i));
        pagination.appendChild(pageBtn);
    }

    // Next button
    if (currentPage < totalPages) {
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next';
        nextBtn.className = 'pagination-btn';
        nextBtn.addEventListener('click', () => changePage(currentPage + 1));
        pagination.appendChild(nextBtn);
    }
}

// Change page
function changePage(page) {
    currentPage = page;
    loadTransactions();
}

// Load budgets
async function loadBudgets() {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const data = await apiCall(`budget-status?month=${month}&year=${year}`);
    if (data) {
        displayBudgets(data.budget_status);
    }
}

// Display budgets
function displayBudgets(budgets) {
    const grid = document.getElementById('budgets-grid');
    grid.innerHTML = '';

    budgets.forEach(budget => {
        const budgetItem = document.createElement('div');
        budgetItem.className = 'budget-item';

        const percentage = budget.percentage_used || 0;
        const isOverBudget = percentage > 100;

        budgetItem.innerHTML = `
            <div class="budget-header">
                <div class="budget-category">${budget.category}</div>
                <div class="budget-amount">$${budget.actual_spent.toFixed(2)} / $${budget.budget_limit.toFixed(2)}</div>
            </div>
            <div class="budget-progress">
                <div class="progress-bar">
                    <div class="progress-fill ${isOverBudget ? 'over-budget' : ''}" style="width: ${Math.min(percentage, 100)}%"></div>
                </div>
            </div>
            <div class="budget-stats">
                <span>${percentage.toFixed(1)}% used</span>
                <span>${isOverBudget ? 'Over Budget' : 'On Track'}</span>
            </div>
        `;

        grid.appendChild(budgetItem);
    });
}

// Load goals
async function loadGoals() {
    const data = await apiCall('savings-progress');
    if (data) {
        displayGoals(data.savings_goals);
    }
}

// Display goals
function displayGoals(goals) {
    const grid = document.getElementById('goals-grid');
    grid.innerHTML = '';

    goals.forEach(goal => {
        const goalItem = document.createElement('div');
        goalItem.className = 'goal-item';

        const percentage = goal.completion_percentage || 0;

        goalItem.innerHTML = `
            <div class="goal-header">
                <div class="goal-name">${goal.goal_name}</div>
                <div class="goal-percentage">${percentage.toFixed(1)}%</div>
            </div>
            <div class="goal-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%"></div>
                </div>
            </div>
            <div class="goal-amounts">
                <span>$${goal.saved_amount.toFixed(2)} saved</span>
                <span>$${goal.target_amount.toFixed(2)} target</span>
            </div>
            <div class="goal-deadline">Deadline: ${formatDate(goal.deadline)}</div>
        `;

        grid.appendChild(goalItem);
    });
}

// Handle transaction form submission
async function handleTransactionSubmit(e) {
    e.preventDefault();

    const formData = {
        amount: parseFloat(document.getElementById('transaction-amount').value),
        category: document.getElementById('transaction-category').value,
        type: document.getElementById('transaction-type').value,
        transaction_date: document.getElementById('transaction-date').value,
        description: document.getElementById('transaction-description').value
    };

    const result = await apiCall('transactions', {
        method: 'POST',
        body: JSON.stringify(formData)
    });

    if (result) {
        showNotification('Transaction added successfully!', 'success');
        closeModals();
        loadDashboardData();
        if (currentTab === 'transactions') {
            loadTransactions();
        }
    }
}

// Handle budget form submission
async function handleBudgetSubmit(e) {
    e.preventDefault();

    const currentDate = new Date();
    const formData = {
        category: document.getElementById('budget-category').value,
        budget_limit: parseFloat(document.getElementById('budget-limit').value),
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
    };

    const result = await apiCall('budgets', {
        method: 'POST',
        body: JSON.stringify(formData)
    });

    if (result) {
        showNotification('Budget set successfully!', 'success');
        closeModals();
        if (currentTab === 'budgets') {
            loadBudgets();
        }
    }
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showNotification(message, type = 'info') {
    // Simple notification - you could enhance this with a proper notification system
    alert(message);
}

// Initialize charts (will be defined in charts.js)
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
});