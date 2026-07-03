from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)
CORS(app)

# Load data
df = pd.read_csv('../data/sample_hr_data.csv')

# Train AI model
def train_model():
    features = ['Age', 'Tenure_Years', 'Salary', 'JobSatisfaction', 
                'PerformanceRating', 'Absences', 'OverTime']
    X = df[features]
    y = df['Left']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    accuracy = model.score(X_test, y_test)
    return model, accuracy, features

model, accuracy, features = train_model()

@app.route('/api/overview')
def overview():
    total = len(df)
    active = len(df[df['EmploymentStatus'] == 'Active'])
    resigned = len(df[df['Left'] == 1])
    turnover_rate = round((resigned / total) * 100, 1)
    avg_tenure = round(df['Tenure_Years'].mean(), 1)
    avg_salary = round(df['Salary'].mean(), 0)
    avg_satisfaction = round(df['JobSatisfaction'].mean(), 1)
    return jsonify({
        'total_employees': total,
        'active_employees': active,
        'resigned_employees': resigned,
        'turnover_rate': turnover_rate,
        'avg_tenure': avg_tenure,
        'avg_salary': avg_salary,
        'avg_satisfaction': avg_satisfaction,
        'model_accuracy': round(accuracy * 100, 1)
    })

@app.route('/api/departments')
def departments():
    dept_stats = df.groupby('Department').agg(
        total=('EmployeeID', 'count'),
        turnover=('Left', 'sum'),
        avg_satisfaction=('JobSatisfaction', 'mean'),
        avg_salary=('Salary', 'mean')
    ).reset_index()
    dept_stats['turnover_rate'] = round((dept_stats['turnover'] / dept_stats['total']) * 100, 1)
    dept_stats['avg_satisfaction'] = round(dept_stats['avg_satisfaction'], 1)
    dept_stats['avg_salary'] = round(dept_stats['avg_salary'], 0)
    return jsonify(dept_stats.to_dict(orient='records'))

@app.route('/api/at-risk')
def at_risk():
    X = df[features]
    probs = model.predict_proba(X)[:, 1]
    df_risk = df.copy()
    df_risk['churn_probability'] = (probs * 100).round(1)
    at_risk = df_risk[
        (df_risk['EmploymentStatus'] == 'Active') & 
        (df_risk['churn_probability'] > 60)
    ].sort_values('churn_probability', ascending=False).head(10)
    return jsonify(at_risk[['EmployeeID', 'Department', 'JobTitle', 
                             'Tenure_Years', 'JobSatisfaction', 
                             'churn_probability']].to_dict(orient='records'))

@app.route('/api/trends')
def trends():
    satisfaction_dist = df['JobSatisfaction'].value_counts().sort_index()
    performance_dist = df['PerformanceRating'].value_counts().sort_index()
    education_turnover = df.groupby('Education')['Left'].mean().round(3) * 100
    return jsonify({
        'satisfaction_distribution': satisfaction_dist.to_dict(),
        'performance_distribution': performance_dist.to_dict(),
        'education_turnover': education_turnover.to_dict()
    })

@app.route('/api/feature-importance')
def feature_importance():
    importance = dict(zip(features, model.feature_importances_.round(3)))
    sorted_importance = dict(sorted(importance.items(), key=lambda x: x[1], reverse=True))
    return jsonify(sorted_importance)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
