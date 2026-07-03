import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";

const COLORS = ["#1F4E79", "#2E75B6", "#4BACC6", "#A9D18E", "#FF7C7C", "#FFB347", "#9B59B6", "#1ABC9C"];

const API = "http://localhost:5000/api";

// Simulated data for demo purposes
const DEMO_OVERVIEW = {
  total_employees: 300, active_employees: 198, resigned_employees: 102,
  turnover_rate: 34.0, avg_tenure: 7.4, avg_salary: 79800,
  avg_satisfaction: 5.5, model_accuracy: 78.3
};

const DEMO_DEPARTMENTS = [
  { Department: "Engineering", total: 29, turnover: 8, avg_satisfaction: 6.1, avg_salary: 95000, turnover_rate: 27.6 },
  { Department: "Sales", total: 41, turnover: 18, avg_satisfaction: 4.8, avg_salary: 68000, turnover_rate: 43.9 },
  { Department: "HR", total: 33, turnover: 11, avg_satisfaction: 5.8, avg_salary: 62000, turnover_rate: 33.3 },
  { Department: "Finance", total: 35, turnover: 10, avg_satisfaction: 5.9, avg_salary: 82000, turnover_rate: 28.6 },
  { Department: "Operations", total: 38, turnover: 14, avg_satisfaction: 5.2, avg_salary: 71000, turnover_rate: 36.8 },
  { Department: "Marketing", total: 41, turnover: 16, avg_satisfaction: 5.4, avg_salary: 74000, turnover_rate: 39.0 },
  { Department: "Customer Service", total: 40, turnover: 16, avg_satisfaction: 4.9, avg_salary: 55000, turnover_rate: 40.0 },
  { Department: "IT", total: 43, turnover: 9, avg_satisfaction: 6.3, avg_salary: 88000, turnover_rate: 20.9 },
];

const DEMO_AT_RISK = [
  { EmployeeID: "EMP0023", Department: "Sales", JobTitle: "Sales Representative", Tenure_Years: 1, JobSatisfaction: 2, churn_probability: 91.2 },
  { EmployeeID: "EMP0087", Department: "Customer Service", JobTitle: "Support Analyst", Tenure_Years: 2, JobSatisfaction: 3, churn_probability: 88.5 },
  { EmployeeID: "EMP0142", Department: "Marketing", JobTitle: "Content Analyst", Tenure_Years: 1, JobSatisfaction: 2, churn_probability: 85.3 },
  { EmployeeID: "EMP0056", Department: "Operations", JobTitle: "Process Coordinator", Tenure_Years: 3, JobSatisfaction: 3, churn_probability: 82.1 },
  { EmployeeID: "EMP0198", Department: "Sales", JobTitle: "Account Manager", Tenure_Years: 2, JobSatisfaction: 2, churn_probability: 79.8 },
  { EmployeeID: "EMP0211", Department: "HR", JobTitle: "HR Coordinator", Tenure_Years: 1, JobSatisfaction: 4, churn_probability: 76.4 },
  { EmployeeID: "EMP0074", Department: "Finance", JobTitle: "Budget Analyst", Tenure_Years: 2, JobSatisfaction: 3, churn_probability: 73.2 },
  { EmployeeID: "EMP0163", Department: "Customer Service", JobTitle: "Customer Service Rep", Tenure_Years: 1, JobSatisfaction: 2, churn_probability: 71.0 },
];

const DEMO_IMPORTANCE = {
  JobSatisfaction: 0.312, Absences: 0.198, PerformanceRating: 0.187,
  Salary: 0.142, Tenure_Years: 0.089, OverTime: 0.048, Age: 0.024
};

const MetricCard = ({ title, value, subtitle, color }) => (
  <div style={{
    background: "white", borderRadius: 12, padding: "20px 24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)", borderLeft: `4px solid ${color}`
  }}>
    <p style={{ margin: 0, fontSize: 13, color: "#888", fontWeight: 500 }}>{title}</p>
    <p style={{ margin: "8px 0 4px", fontSize: 28, fontWeight: 700, color: "#1F4E79" }}>{value}</p>
    {subtitle && <p style={{ margin: 0, fontSize: 12, color: "#aaa" }}>{subtitle}</p>}
  </div>
);

const getRiskColor = (prob) => {
  if (prob >= 80) return "#FF4444";
  if (prob >= 70) return "#FF8C00";
  return "#FFC107";
};

export default function PeopleIQ() {
  const [activeTab, setActiveTab] = useState("overview");
  const [overview] = useState(DEMO_OVERVIEW);
  const [departments] = useState(DEMO_DEPARTMENTS);
  const [atRisk] = useState(DEMO_AT_RISK);
  const [importance] = useState(DEMO_IMPORTANCE);

  const importanceData = Object.entries(importance).map(([k, v]) => ({
    name: k.replace(/([A-Z])/g, ' $1').trim(), value: Math.round(v * 100)
  }));

  const tabs = ["overview", "departments", "at-risk", "insights"];

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#F4F7FB", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "#1F4E79", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ padding: "20px 0" }}>
          <h1 style={{ margin: 0, color: "white", fontSize: 24, fontWeight: 700 }}>🧠 PeopleIQ</h1>
          <p style={{ margin: "4px 0 0", color: "#90CAF9", fontSize: 13 }}>AI-Powered HR Analytics Dashboard</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "8px 18px", borderRadius: 6, border: "none", cursor: "pointer",
              fontWeight: 600, fontSize: 13, textTransform: "capitalize",
              background: activeTab === tab ? "#2E75B6" : "transparent",
              color: activeTab === tab ? "white" : "#90CAF9",
              transition: "all 0.2s"
            }}>{tab === "at-risk" ? "⚠️ At Risk" : tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "32px" }}>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div>
            <h2 style={{ color: "#1F4E79", marginTop: 0 }}>Workforce Overview</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
              <MetricCard title="Total Employees" value={overview.total_employees} subtitle="All time" color="#1F4E79" />
              <MetricCard title="Active Employees" value={overview.active_employees} subtitle="Currently employed" color="#4BACC6" />
              <MetricCard title="Turnover Rate" value={`${overview.turnover_rate}%`} subtitle="Of total workforce" color="#FF7C7C" />
              <MetricCard title="AI Model Accuracy" value={`${overview.model_accuracy}%`} subtitle="Churn prediction" color="#A9D18E" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
              <MetricCard title="Avg Tenure" value={`${overview.avg_tenure} yrs`} subtitle="Years with company" color="#2E75B6" />
              <MetricCard title="Avg Salary" value={`$${overview.avg_salary.toLocaleString()}`} subtitle="Annual salary" color="#9B59B6" />
              <MetricCard title="Avg Satisfaction" value={`${overview.avg_satisfaction}/10`} subtitle="Job satisfaction score" color="#1ABC9C" />
            </div>
            <div style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <h3 style={{ color: "#1F4E79", marginTop: 0 }}>Turnover by Department</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departments}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="Department" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={v => `${v}%`} />
                  <Tooltip formatter={(v) => [`${v}%`, "Turnover Rate"]} />
                  <Bar dataKey="turnover_rate" fill="#2E75B6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* DEPARTMENTS TAB */}
        {activeTab === "departments" && (
          <div>
            <h2 style={{ color: "#1F4E79", marginTop: 0 }}>Department Analytics</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#1F4E79", marginTop: 0 }}>Headcount by Department</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={departments} dataKey="total" nameKey="Department" cx="50%" cy="50%" outerRadius={100} label={({ Department, percent }) => `${Department} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {departments.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#1F4E79", marginTop: 0 }}>Satisfaction vs Turnover</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={departments}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="Department" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={v => `${v}%`} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="avg_satisfaction" name="Satisfaction" fill="#4BACC6" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="turnover_rate" name="Turnover %" fill="#FF7C7C" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginTop: 24 }}>
              <h3 style={{ color: "#1F4E79", marginTop: 0 }}>Department Summary Table</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#F4F7FB" }}>
                    {["Department", "Total", "Resigned", "Turnover Rate", "Avg Satisfaction", "Avg Salary"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: "#1F4E79", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {departments.map((d, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "10px 16px", fontWeight: 500 }}>{d.Department}</td>
                      <td style={{ padding: "10px 16px" }}>{d.total}</td>
                      <td style={{ padding: "10px 16px" }}>{d.turnover}</td>
                      <td style={{ padding: "10px 16px" }}>
                        <span style={{ background: d.turnover_rate > 35 ? "#FFE5E5" : "#E5F5E5", color: d.turnover_rate > 35 ? "#CC0000" : "#006600", padding: "2px 8px", borderRadius: 12, fontSize: 12 }}>
                          {d.turnover_rate}%
                        </span>
                      </td>
                      <td style={{ padding: "10px 16px" }}>{d.avg_satisfaction}/10</td>
                      <td style={{ padding: "10px 16px" }}>${d.avg_salary.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AT RISK TAB */}
        {activeTab === "at-risk" && (
          <div>
            <h2 style={{ color: "#1F4E79", marginTop: 0 }}>⚠️ At-Risk Employees</h2>
            <p style={{ color: "#666", marginBottom: 24 }}>The AI model has identified the following active employees as having a high probability of leaving. Early intervention can reduce turnover costs.</p>
            <div style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#F4F7FB" }}>
                    {["Employee ID", "Department", "Job Title", "Tenure", "Satisfaction", "Churn Risk", "Action"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: "#1F4E79", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {atRisk.map((e, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 600, color: "#1F4E79" }}>{e.EmployeeID}</td>
                      <td style={{ padding: "12px 16px" }}>{e.Department}</td>
                      <td style={{ padding: "12px 16px" }}>{e.JobTitle}</td>
                      <td style={{ padding: "12px 16px" }}>{e.Tenure_Years} yr{e.Tenure_Years !== 1 ? "s" : ""}</td>
                      <td style={{ padding: "12px 16px" }}>{e.JobSatisfaction}/10</td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ background: "#f0f0f0", borderRadius: 8, height: 8, width: 80 }}>
                            <div style={{ background: getRiskColor(e.churn_probability), borderRadius: 8, height: 8, width: `${e.churn_probability}%` }} />
                          </div>
                          <span style={{ fontWeight: 700, color: getRiskColor(e.churn_probability) }}>{e.churn_probability}%</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <button style={{ background: "#1F4E79", color: "white", border: "none", borderRadius: 6, padding: "4px 12px", fontSize: 12, cursor: "pointer" }}>
                          Flag for Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INSIGHTS TAB */}
        {activeTab === "insights" && (
          <div>
            <h2 style={{ color: "#1F4E79", marginTop: 0 }}>AI Model Insights</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#1F4E79", marginTop: 0 }}>What Drives Employee Turnover?</h3>
                <p style={{ color: "#666", fontSize: 13 }}>Feature importance from the Random Forest model — higher % means stronger influence on churn prediction.</p>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={importanceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tickFormatter={v => `${v}%`} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={130} />
                    <Tooltip formatter={(v) => [`${v}%`, "Importance"]} />
                    <Bar dataKey="value" fill="#2E75B6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#1F4E79", marginTop: 0 }}>Key Recommendations</h3>
                {[
                  { icon: "😊", title: "Improve Job Satisfaction", desc: "Satisfaction is the #1 predictor of churn. Focus retention efforts on employees scoring below 4/10." },
                  { icon: "📅", title: "Monitor Absences", desc: "High absenteeism strongly correlates with turnover. Employees with 15+ absences are 3x more likely to leave." },
                  { icon: "⭐", title: "Performance Management", desc: "Low performers are at higher churn risk. Regular feedback and development plans reduce turnover." },
                  { icon: "💰", title: "Salary Review", desc: "Customer Service and Sales departments have the lowest average salaries and highest turnover. A compensation review is recommended." },
                  { icon: "⏰", title: "Overtime Policy", desc: "Employees working overtime are more likely to leave. Review workload distribution across teams." },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: 16, padding: "12px 16px", background: "#F4F7FB", borderRadius: 8 }}>
                    <span style={{ fontSize: 20 }}>{r.icon}</span>
                    <div>
                      <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 13, color: "#1F4E79" }}>{r.title}</p>
                      <p style={{ margin: 0, fontSize: 12, color: "#666" }}>{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "#1F4E79", borderRadius: 12, padding: 24, marginTop: 24, color: "white" }}>
              <h3 style={{ margin: "0 0 8px" }}>🤖 About the AI Model</h3>
              <p style={{ margin: 0, fontSize: 13, opacity: 0.85 }}>
                PeopleIQ uses a <strong>Random Forest Classifier</strong> trained on 300 employee records across 7 features including job satisfaction, performance rating, absences, overtime, salary, tenure and age. The model achieves <strong>{overview.model_accuracy}% accuracy</strong> on unseen data and outputs churn probability scores between 0-100% for each active employee. Feature importance scores show which factors most strongly predict employee departure.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "24px", color: "#aaa", fontSize: 12 }}>
        PeopleIQ — Built by Myra Owoo | BIS Graduate, Saskatchewan Polytechnic | github.com/mowoo-987
      </div>
    </div>
  );
}
