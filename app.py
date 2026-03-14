from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import sqlite3
from config import Config
import json
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    """Serve the main dashboard page"""
    return render_template('index.html')

def get_db_connection():
    """Establish database connection"""
    conn = sqlite3.connect(Config.DATABASE_URI.replace('sqlite:///', ''))
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/api/summary', methods=['GET'])
def get_summary():
    """Get total income, expenses, savings this month"""
    try:
        user_id = request.args.get('user_id', 1, type=int)
        month = request.args.get('month', datetime.now().month, type=int)
        year = request.args.get('year', datetime.now().year, type=int)

        conn = get_db_connection()
        cursor = conn.cursor()

        # Get total income (credits)
        cursor.execute("""
            SELECT COALESCE(SUM(amount), 0) as total_income
            FROM transactions
            WHERE user_id = ? AND type = 'credit'
            AND strftime('%m', transaction_date) = ? AND strftime('%Y', transaction_date) = ?
        """, (user_id, str(month).zfill(2), str(year)))
        income_result = cursor.fetchone()
        total_income = float(income_result[0]) if income_result[0] else 0.0

        # Get total expenses (debits)
        cursor.execute("""
            SELECT COALESCE(SUM(amount), 0) as total_expenses
            FROM transactions
            WHERE user_id = ? AND type = 'debit'
            AND strftime('%m', transaction_date) = ? AND strftime('%Y', transaction_date) = ?
        """, (user_id, str(month).zfill(2), str(year)))
        expense_result = cursor.fetchone()
        total_expenses = float(expense_result[0]) if expense_result[0] else 0.0
        net_savings = total_income - total_expenses
        savings_rate = (net_savings / total_income * 100) if total_income > 0 else 0

        cursor.close()
        conn.close()

        return jsonify({
            'total_income': total_income,
            'total_expenses': total_expenses,
            'net_savings': net_savings,
            'savings_rate': round(savings_rate, 2)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    """Get filtered transactions"""
    try:
        user_id = request.args.get('user_id', 1, type=int)
        month = request.args.get('month')
        category = request.args.get('category')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        offset = (page - 1) * per_page

        conn = get_db_connection()
        cursor = conn.cursor()

        # Build query with filters
        query = """
            SELECT transaction_id, amount, category, transaction_date, description, type
            FROM transactions
            WHERE user_id = ?
        """
        params = [user_id]

        if month:
            query += " AND strftime('%m', transaction_date) = ?"
            params.append(str(month).zfill(2))

        if category:
            query += " AND category = ?"
            params.append(category)

        query += " ORDER BY transaction_date DESC LIMIT ? OFFSET ?"
        params.extend([per_page, offset])

        cursor.execute(query, params)
        transactions = cursor.fetchall()

        # Convert to list of dictionaries
        transaction_list = []
        for row in transactions:
            transaction_list.append({
                'transaction_id': row[0],
                'amount': float(row[1]),
                'category': row[2],
                'transaction_date': row[3],
                'description': row[4] or '',
                'type': row[5]
            })

        # Get total count for pagination
        count_query = """
            SELECT COUNT(*) as total
            FROM transactions
            WHERE user_id = ?
        """
        count_params = [user_id]

        if month:
            count_query += " AND strftime('%m', transaction_date) = ?"
            count_params.append(str(month).zfill(2))

        if category:
            count_query += " AND category = ?"
            count_params.append(category)

        cursor.execute(count_query, count_params)
        total_count = cursor.fetchone()[0]

        cursor.close()
        conn.close()

        return jsonify({
            'transactions': transaction_list,
            'total': total_count,
            'page': page,
            'per_page': per_page,
            'total_pages': (total_count + per_page - 1) // per_page
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/category-breakdown', methods=['GET'])
def get_category_breakdown():
    """Get spending by category for a month"""
    try:
        user_id = request.args.get('user_id', 1, type=int)
        month = request.args.get('month', datetime.now().month, type=int)
        year = request.args.get('year', datetime.now().year, type=int)

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT category, SUM(amount) as total_amount
            FROM transactions
            WHERE user_id = ? AND type = 'debit'
            AND strftime('%m', transaction_date) = ? AND strftime('%Y', transaction_date) = ?
            GROUP BY category
            ORDER BY total_amount DESC
        """, (user_id, str(month).zfill(2), str(year)))

        results = cursor.fetchall()
        categories = [{'category': row[0], 'total_amount': float(row[1])} for row in results]

        cursor.close()
        conn.close()

        return jsonify({'categories': categories})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/monthly-trend', methods=['GET'])
def get_monthly_trend():
    """Get month-wise income vs expense for a year"""
    try:
        user_id = request.args.get('user_id', 1, type=int)
        year = request.args.get('year', datetime.now().year, type=int)

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                strftime('%m', transaction_date) as month,
                SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) as income,
                SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END) as expenses
            FROM transactions
            WHERE user_id = ? AND strftime('%Y', transaction_date) = ?
            GROUP BY strftime('%m', transaction_date)
            ORDER BY month
        """, (user_id, str(year)))

        results = cursor.fetchall()
        monthly_data = []
        for row in results:
            monthly_data.append({
                'month': int(row[0]),
                'income': float(row[1]) if row[1] else 0.0,
                'expenses': float(row[2]) if row[2] else 0.0
            })

        # Fill in missing months with zeros
        complete_monthly_data = []
        for month in range(1, 13):
            month_data = next((item for item in monthly_data if item['month'] == month), None)
            if month_data:
                complete_monthly_data.append(month_data)
            else:
                complete_monthly_data.append({
                    'month': month,
                    'income': 0.0,
                    'expenses': 0.0
                })

        cursor.close()
        conn.close()

        return jsonify({'monthly_data': complete_monthly_data})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/budget-status', methods=['GET'])
def get_budget_status():
    """Get actual vs budgeted per category"""
    try:
        user_id = request.args.get('user_id', 1, type=int)
        month = request.args.get('month', datetime.now().month, type=int)
        year = request.args.get('year', datetime.now().year, type=int)

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                b.category,
                b.budget_limit,
                COALESCE(SUM(t.amount), 0) as actual_spent,
                CASE WHEN b.budget_limit > 0 THEN (COALESCE(SUM(t.amount), 0) / b.budget_limit * 100) ELSE 0 END as percentage_used
            FROM budgets b
            LEFT JOIN transactions t ON b.category = t.category
                AND t.user_id = b.user_id
                AND t.type = 'debit'
                AND strftime('%m', t.transaction_date) = ? || ''
                AND strftime('%Y', t.transaction_date) = ? || ''
            WHERE b.user_id = ? AND b.month = ? AND b.year = ?
            GROUP BY b.category, b.budget_limit
            ORDER BY b.category
        """, (str(month).zfill(2), str(year), user_id, month, year))

        results = cursor.fetchall()
        budget_status = []
        for row in results:
            budget_status.append({
                'category': row[0],
                'budget_limit': float(row[1]),
                'actual_spent': float(row[2]) if row[2] else 0.0,
                'percentage_used': float(row[3]) if row[3] else 0.0
            })

        cursor.close()
        conn.close()

        return jsonify({'budget_status': budget_status})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/savings-progress', methods=['GET'])
def get_savings_progress():
    """Get savings goals with % completion"""
    try:
        user_id = request.args.get('user_id', 1, type=int)

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                goal_id,
                goal_name,
                target_amount,
                saved_amount,
                deadline,
                (saved_amount / target_amount * 100) as completion_percentage
            FROM savings_goals
            WHERE user_id = ?
            ORDER BY deadline
        """, (user_id,))

        results = cursor.fetchall()
        savings_goals = []
        for row in results:
            savings_goals.append({
                'goal_id': row[0],
                'goal_name': row[1],
                'target_amount': float(row[2]),
                'saved_amount': float(row[3]),
                'deadline': row[4],
                'completion_percentage': float(row[5]) if row[5] else 0.0
            })

        cursor.close()
        conn.close()

        return jsonify({'savings_goals': savings_goals})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/transactions', methods=['POST'])
def add_transaction():
    """Add new transaction"""
    try:
        data = request.get_json()
        user_id = data.get('user_id', 1)
        amount = data['amount']
        category = data['category']
        transaction_date = data['transaction_date']
        description = data.get('description', '')
        transaction_type = data['type']

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO transactions (user_id, amount, category, transaction_date, description, type)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (user_id, amount, category, transaction_date, description, transaction_type))

        conn.commit()
        transaction_id = cursor.lastrowid

        cursor.close()
        conn.close()

        return jsonify({'message': 'Transaction added successfully', 'transaction_id': transaction_id}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/budgets', methods=['POST'])
def set_budget():
    """Set budget for a category"""
    try:
        data = request.get_json()
        user_id = data.get('user_id', 1)
        category = data['category']
        budget_limit = data['budget_limit']
        month = data.get('month', datetime.now().month)
        year = data.get('year', datetime.now().year)

        conn = get_db_connection()
        cursor = conn.cursor()

        # Insert or update budget
        cursor.execute("""
            INSERT OR REPLACE INTO budgets (user_id, category, budget_limit, month, year)
            VALUES (?, ?, ?, ?, ?)
        """, (user_id, category, budget_limit, month, year))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Budget set successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)