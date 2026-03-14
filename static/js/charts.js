// Chart.js configurations and functions
let categoryChart, trendChart, budgetChart, savingsChart;

// Initialize all charts
function initializeCharts() {
    // Category breakdown chart (Doughnut)
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        categoryChart = new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                    ],
                    borderWidth: 2,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#FFD700'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#FFD700',
                        bodyColor: '#ffffff',
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    }

    // Monthly trend chart (Line)
    const trendCtx = document.getElementById('trendChart');
    if (trendCtx) {
        trendChart = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Income',
                    data: [],
                    borderColor: '#00FF88',
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#00FF88',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }, {
                    label: 'Expenses',
                    data: [],
                    borderColor: '#FF4757',
                    backgroundColor: 'rgba(255, 71, 87, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#FF4757',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#ffffff',
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#FFD700',
                        bodyColor: '#ffffff',
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Month',
                            color: '#ffffff'
                        },
                        ticks: {
                            color: '#b8c5d6'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Amount ($)',
                            color: '#ffffff'
                        },
                        ticks: {
                            color: '#b8c5d6',
                            callback: function(value) {
                                return '$' + value.toFixed(0);
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    // Budget vs Actual chart (Bar)
    const budgetCtx = document.getElementById('budgetChart');
    if (budgetCtx) {
        budgetChart = new Chart(budgetCtx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Budget',
                    data: [],
                    backgroundColor: 'rgba(0, 212, 255, 0.6)',
                    borderColor: '#00D4FF',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }, {
                    label: 'Actual',
                    data: [],
                    backgroundColor: 'rgba(255, 215, 0, 0.6)',
                    borderColor: '#FFD700',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#ffffff',
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#FFD700',
                        bodyColor: '#ffffff',
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#b8c5d6'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#b8c5d6',
                            callback: function(value) {
                                return '$' + value.toFixed(0);
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutBounce'
                }
            }
        });
    }

    // Savings progress chart (Area)
    const savingsCtx = document.getElementById('savingsChart');
    if (savingsCtx) {
        savingsChart = new Chart(savingsCtx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
                    ],
                    borderWidth: 2,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#FFD700'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#FFD700',
                        bodyColor: '#ffffff',
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                return `${label}: ${value.toFixed(1)}% complete`;
                            }
                        }
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    }
}

// Update category breakdown chart
function updateCategoryChart(categories) {
    if (!categoryChart) return;

    const labels = categories.map(cat => cat.category);
    const data = categories.map(cat => cat.total_amount);

    categoryChart.data.labels = labels;
    categoryChart.data.datasets[0].data = data;
    categoryChart.update();
}

// Update monthly trend chart
function updateTrendChart(monthlyData) {
    if (!trendChart) return;

    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const labels = monthlyData.map(item => monthNames[item.month - 1]);
    const incomeData = monthlyData.map(item => item.income);
    const expenseData = monthlyData.map(item => item.expenses);

    trendChart.data.labels = labels;
    trendChart.data.datasets[0].data = incomeData;
    trendChart.data.datasets[1].data = expenseData;
    trendChart.update();
}

// Update budget vs actual chart
function updateBudgetChart(budgetData) {
    if (!budgetChart) return;

    const labels = budgetData.map(item => item.category);
    const budgetAmounts = budgetData.map(item => item.budget_limit);
    const actualAmounts = budgetData.map(item => item.actual_spent);

    budgetChart.data.labels = labels;
    budgetChart.data.datasets[0].data = budgetAmounts;
    budgetChart.data.datasets[1].data = actualAmounts;
    budgetChart.update();
}

// Update savings progress chart
function updateSavingsChart(savingsGoals) {
    if (!savingsChart) return;

    const labels = savingsGoals.map(goal => goal.goal_name);
    const data = savingsGoals.map(goal => goal.completion_percentage);

    savingsChart.data.labels = labels;
    savingsChart.data.datasets[0].data = data;
    savingsChart.update();
}

// Make functions globally available
window.initializeCharts = initializeCharts;
window.updateCategoryChart = updateCategoryChart;
window.updateTrendChart = updateTrendChart;
window.updateBudgetChart = updateBudgetChart;
window.updateSavingsChart = updateSavingsChart;