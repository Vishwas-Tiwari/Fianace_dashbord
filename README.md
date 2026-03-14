# Personal Finance Dashboard

A comprehensive full-stack personal finance management application with advanced 3D UI, real-time analytics, and Power BI integration.

## 🚀 Features

- **3D Glassmorphism UI** - Modern, interactive dashboard with perspective transforms
- **Real-time Analytics** - Live charts and financial insights using Chart.js
- **Comprehensive API** - RESTful Flask backend with 8+ endpoints
- **MySQL Database** - Robust schema with 500+ sample transactions
- **Budget Management** - Set and track category budgets
- **Savings Goals** - Monitor progress towards financial targets
- **Power BI Integration** - Advanced analytics and reporting
- **Responsive Design** - Works on desktop and mobile devices

## 🏗️ Architecture

```
finance-dashboard/
├── app.py                 # Flask REST API
├── config.py             # Database configuration
├── database/
│   ├── schema.sql        # Database schema
│   └── seed_data.sql     # Sample data (500+ transactions)
├── static/
│   ├── css/style.css     # Advanced 3D CSS with glassmorphism
│   ├── js/main.js        # Frontend logic and API calls
│   └── js/charts.js      # Chart.js configurations
├── templates/
│   └── index.html        # Single-page application
├── powerbi/
│   └── README-powerbi.md # Power BI setup guide
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## 🛠️ Tech Stack

- **Backend**: Python Flask with REST API
- **Database**: MySQL with complex relationships
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Charts**: Chart.js for interactive visualizations
- **Styling**: Advanced CSS with 3D transforms and glassmorphism
- **Analytics**: Power BI Desktop for advanced reporting

## 📋 Prerequisites

- Python 3.8+
- MySQL 8.0+
- Node.js (for Chart.js, served via CDN)
- Power BI Desktop (optional, for analytics)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Navigate to your project directory
cd /path/to/your/projects

# The project structure is already created
cd finance-dashboard
```

### 2. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 3. Setup MySQL Database

```bash
# Login to MySQL
mysql -u root -p

# Create and populate database
source database/schema.sql
source database/seed_data.sql

# Exit MySQL
exit
```

### 4. Configure Database Connection

Edit `config.py` with your MySQL credentials:

```python
MYSQL_HOST = 'localhost'
MYSQL_USER = 'your_username'
MYSQL_PASSWORD = 'your_password'
MYSQL_DATABASE = 'finance_dashboard'
```

### 5. Run the Application

```bash
python app.py
```

### 6. Open in Browser

Navigate to: `http://localhost:5000`

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/summary` | Monthly financial summary |
| GET | `/api/transactions` | Filtered transaction list |
| GET | `/api/category-breakdown` | Spending by category |
| GET | `/api/monthly-trend` | 12-month income/expense trend |
| GET | `/api/budget-status` | Budget vs actual spending |
| GET | `/api/savings-progress` | Savings goals progress |
| POST | `/api/transactions` | Add new transaction |
| POST | `/api/budgets` | Set category budget |

## 🎨 UI Features

### 3D Effects
- Perspective transforms on hover
- Glassmorphism cards with backdrop blur
- Smooth CSS transitions and animations
- Depth shadows and lighting effects

### Interactive Elements
- Flip cards with 3D transforms
- Animated progress bars
- Hover effects on all interactive elements
- Responsive grid layouts

### Charts & Visualizations
- Doughnut chart: Expense breakdown
- Line chart: Monthly trends
- Bar chart: Budget analysis
- Area chart: Savings progress

## 📈 Power BI Integration

### Setup Steps
1. Install Power BI Desktop
2. Install MySQL ODBC connector
3. Follow `powerbi/README-powerbi.md` for detailed setup

### Report Features
- Real-time MySQL data connection
- 6 comprehensive visuals
- DAX measures for advanced calculations
- Scheduled automatic refresh
- Mobile-responsive design

## 📱 Responsive Design

- **Desktop**: Full 3D effects and multi-column layouts
- **Tablet**: Adapted grid systems and touch-friendly controls
- **Mobile**: Single-column layout with optimized interactions

## 🔧 Development

### Project Structure Details

```
├── app.py (Main Flask application)
│   ├── REST API endpoints
│   ├── CORS configuration
│   └── MySQL connection handling
│
├── static/css/style.css
│   ├── CSS custom properties (variables)
│   ├── 3D transforms and animations
│   ├── Glassmorphism effects
│   └── Responsive breakpoints
│
├── static/js/main.js
│   ├── DOM manipulation
│   ├── API communication
│   ├── Modal management
│   └── Event handling
│
└── static/js/charts.js
    ├── Chart.js configurations
    ├── Data visualization
    └── Chart update functions
```

### Adding New Features

1. **Backend**: Add new endpoint in `app.py`
2. **Frontend**: Update HTML in `index.html`
3. **Styling**: Add CSS rules in `style.css`
4. **Logic**: Implement JavaScript in `main.js`

## 🐛 Troubleshooting

### Common Issues

**Flask App Won't Start**
- Check Python version (3.8+ required)
- Verify all dependencies are installed
- Check database connection settings

**Database Connection Failed**
- Ensure MySQL is running
- Verify credentials in `config.py`
- Check user permissions

**Charts Not Loading**
- Verify Chart.js CDN connection
- Check browser console for errors
- Ensure data is being returned from API

**Power BI Connection Issues**
- Install MySQL ODBC driver
- Configure gateway for scheduled refresh
- Check firewall settings

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the Power BI documentation
3. Open an issue on GitHub

## 🎯 Future Enhancements

- [ ] User authentication and multi-user support
- [ ] Export functionality (PDF/Excel)
- [ ] Advanced budgeting with sub-categories
- [ ] Investment portfolio tracking
- [ ] Mobile app companion
- [ ] AI-powered financial insights
- [ ] Multi-currency support
- [ ] Automated transaction categorization

---

**Built with ❤️ using Flask, MySQL, and modern CSS**