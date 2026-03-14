# Power BI Report Setup Guide

This guide provides step-by-step instructions to create a comprehensive Power BI Desktop report connected to your MySQL finance dashboard database.

## Prerequisites

1. **Power BI Desktop** - Download from [Microsoft Power BI](https://powerbi.microsoft.com/desktop/)
2. **MySQL Connector** - Install MySQL ODBC driver from [MySQL Downloads](https://dev.mysql.com/downloads/connector/odbc/)
3. **Running Flask Application** - Ensure your Flask app is running and MySQL database is populated

## Step 1: Connect Power BI to MySQL Database

1. Open Power BI Desktop
2. Click **Get Data** > **More...**
3. Search for and select **MySQL database**
4. Click **Connect**
5. Enter connection details:
   - Server: `localhost` (or your MySQL host)
   - Database: `finance_dashboard`
   - Username: Your MySQL username (default: `root`)
   - Password: Your MySQL password

## Step 2: Import Required Tables

Select and load the following tables:
- `users`
- `transactions`
- `budgets`
- `savings_goals`

## Step 3: Create Data Model Relationships

1. Go to **Model** view (bottom icon)
2. Create relationships:
   - `users.user_id` → `transactions.user_id`
   - `users.user_id` → `budgets.user_id`
   - `users.user_id` → `savings_goals.user_id`

## Step 4: Create Calculated Columns and Measures

### Basic Measures

```dax
// Total Income
Total Income = SUM(transactions[amount]) * (1 - 2 * (transactions[type] = "debit"))

// Total Expenses
Total Expenses = SUMX(transactions, IF(transactions[type] = "debit", transactions[amount], 0))

// Net Savings
Net Savings = [Total Income] - [Total Expenses]

// Savings Rate
Savings Rate = DIVIDE([Net Savings], [Total Income], 0)
```

### Advanced DAX Measures

```dax
// Month-over-Month Growth
MoM Growth =
VAR CurrentMonth = [Total Income]
VAR PreviousMonth =
    CALCULATE(
        [Total Income],
        DATEADD('transactions'[transaction_date], -1, MONTH)
    )
RETURN
    DIVIDE(CurrentMonth - PreviousMonth, PreviousMonth, 0)

// Budget Variance
Budget Variance =
VAR ActualSpent = [Total Expenses]
VAR BudgetAmount = SUM(budgets[budget_limit])
RETURN
    DIVIDE(ActualSpent - BudgetAmount, BudgetAmount, 0)

// Savings Goal Progress
Savings Goal Progress =
VAR CurrentSaved = SUM(savings_goals[saved_amount])
VAR TargetAmount = SUM(savings_goals[target_amount])
RETURN
    DIVIDE(CurrentSaved, TargetAmount, 0)
```

## Step 5: Create Visuals

### 1. KPI Cards (Top Row)

Create 4 card visuals for:
- **Total Income**: Format as currency, green background
- **Total Expenses**: Format as currency, red background
- **Net Savings**: Format as currency, blue background
- **Savings Rate**: Format as percentage, purple background

### 2. Pie Chart - Expense by Category

- **Values**: `Total Expenses` by `transactions[category]`
- **Legend**: Category names
- **Colors**: Custom color palette matching your dashboard theme

### 3. Line Chart - Monthly Trend

- **X-axis**: `transaction_date` (by month)
- **Y-axis**: `Total Income` and `Total Expenses`
- **Line styles**: Solid for income, dashed for expenses
- **Data labels**: Show values on hover

### 4. Bar Chart - Budget vs Actual

- **X-axis**: `budgets[category]`
- **Y-axis**: `budget_limit` and `Total Expenses`
- **Orientation**: Horizontal bars
- **Conditional formatting**: Red bars when over budget

### 5. Table - All Transactions

- **Columns**: Date, Description, Category, Type, Amount
- **Conditional formatting**:
  - Green text for credit transactions
  - Red text for debit transactions
  - Alternating row colors

### 6. Gauge Chart - Savings Goal Progress

- **Value**: `Savings Goal Progress` measure
- **Target**: 1.0 (100%)
- **Colors**: Green for good progress, yellow for moderate, red for low

## Step 6: Add Slicers and Filters

1. **Date Range Slicer**: Connected to `transaction_date`
2. **Category Slicer**: Multi-select for transaction categories
3. **Transaction Type Slicer**: Credit/Debit filter

## Step 7: Apply Theme and Formatting

1. Go to **View** > **Themes** > **Customize current theme**
2. Set colors to match your dashboard:
   - Background: Dark navy (#0f0f23)
   - Primary color: Gold (#ffd700)
   - Secondary color: Blue (#00d4ff)

## Step 8: Add Report Page Navigation

Create multiple pages:
1. **Overview** - KPI cards and summary charts
2. **Transactions** - Detailed transaction table with filters
3. **Budgets** - Budget vs actual analysis
4. **Goals** - Savings goals progress

## Step 9: Publish to Power BI Service

1. Click **Publish** in Power BI Desktop
2. Select your workspace
3. Set up scheduled refresh:
   - Go to Power BI Service
   - Dataset settings > Scheduled refresh
   - Configure MySQL gateway connection

## Step 10: Set Up Data Refresh

1. Install **On-premises data gateway** on your server
2. Configure MySQL data source in gateway
3. Set refresh schedule in Power BI Service

## Troubleshooting

### Connection Issues
- Ensure MySQL server is running
- Check firewall settings
- Verify user permissions in MySQL

### Performance Issues
- Use DirectQuery sparingly
- Create summarized tables for large datasets
- Use Power BI aggregations

### Data Refresh Failures
- Check gateway connectivity
- Verify database credentials
- Monitor refresh history for errors

## Advanced Features

### Row-Level Security
Implement RLS to restrict data access based on user roles.

### Custom Visuals
Add advanced visualizations using the Power BI marketplace.

### Power Automate Integration
Automate report distribution and alerts.

## Report Maintenance

- Regularly update DAX measures as business logic evolves
- Monitor report performance and optimize queries
- Keep Power BI Desktop version current
- Document any custom calculations for future maintenance