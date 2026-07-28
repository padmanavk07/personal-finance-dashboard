from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from database import db
from models import Transaction, Budget

api_bp = Blueprint("api", __name__)

#TRANSACTIONS API ROUTES
@api_bp.route("/transactions", methods=["POST"])
@jwt_required()
def add_transaction():
    user_id = get_jwt_identity()
    data = request.get_json()

    tx_date = datetime.strptime(data.get("date"), "%Y-%m-%d").date()
    
    new_tx = Transaction(
        user_id=user_id,
        amount=data.get("amount"),
        type=data.get("type"),
        category=data.get("category"),
        date=tx_date,
        notes=data.get("notes", "")
    )
    
    db.session.add(new_tx)
    db.session.commit()
    return jsonify({"message": "Transaction added successfully"}), 201

@api_bp.route("/transactions", methods=["GET"])
@jwt_required()
def get_transactions():
    user_id = get_jwt_identity()
    transactions = Transaction.query.filter_by(user_id=user_id).order_by(Transaction.date.desc()).all()
    
    result = []
    for tx in transactions:
        result.append({
            "id": tx.id,
            "amount": float(tx.amount),
            "type": tx.type,
            "category": tx.category,
            "date": tx.date.strftime("%Y-%m-%d"),
            "notes": tx.notes
        })
    return jsonify(result), 200

@api_bp.route("/transactions/<int:tx_id>", methods=["DELETE"])
@jwt_required()
def delete_transaction(tx_id):
    user_id = get_jwt_identity()
    tx = Transaction.query.filter_by(id=tx_id, user_id=user_id).first()
    
    if not tx:
        return jsonify({"error": "Transaction not found"}), 404
        
    db.session.delete(tx)
    db.session.commit()
    return jsonify({"message": "Transaction deleted"}), 200


#BUDGET API ROUTES
@api_bp.route("/budget", methods=["POST"])
@jwt_required()
def set_budget():
    user_id = get_jwt_identity()
    data = request.get_json()
    month = data.get("month") # Format: YYYY-MM
    amount = data.get("budget")
    
    # Check if budget already exists for this month
    budget_obj = Budget.query.filter_by(user_id=user_id, month=month).first()
    
    if budget_obj:
        budget_obj.budget = amount
    else:
        budget_obj = Budget(user_id=user_id, month=month, budget=amount)
        db.session.add(budget_obj)
        
    db.session.commit()
    return jsonify({"message": "Budget updated successfully"}), 200

#DASHBOARD API ROUTES
@api_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def get_dashboard():
    user_id = get_jwt_identity()
    
    #Get month from query params or default to current month
    current_month_str = datetime.now().strftime("%Y-%m")
    target_month = request.args.get("month", current_month_str)
    
    #Fetch all transactions for all-time balance
    all_txs = Transaction.query.filter_by(user_id=user_id).all()
    
    total_income = sum(tx.amount for tx in all_txs if tx.type == "income")
    total_expenses = sum(tx.amount for tx in all_txs if tx.type == "expense")
    current_balance = total_income - total_expenses
    
    #Filter transactions for the target month in Python
    month_txs = [tx for tx in all_txs if tx.date.strftime("%Y-%m") == target_month]
    
    monthly_income = sum(tx.amount for tx in month_txs if tx.type == "income")
    monthly_expenses = sum(tx.amount for tx in month_txs if tx.type == "expense")
    savings = monthly_income - monthly_expenses
    
    #Fetch budget limit
    budget_obj = Budget.query.filter_by(user_id=user_id, month=target_month).first()
    budget_limit = budget_obj.budget if budget_obj else 0
    remaining_budget = budget_limit - monthly_expenses
    
    return jsonify({
        "balance": float(current_balance),
        "income": float(monthly_income),
        "expenses": float(monthly_expenses),
        "savings": float(savings),
        "budget": float(budget_limit),
        "remainingBudget": float(remaining_budget)
    }), 200