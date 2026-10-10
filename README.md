# TalentGuard

## AI-Powered Employee Attrition Prediction & Retention Prioritization

TalentGuard is an AI-assisted HR decision-support dashboard designed to help HR teams identify employees at higher risk of attrition, understand key risk indicators, and prioritize limited retention capacity.

### Live Demo

https://talent-guard-lckrrrn1l-thanishlaus.vercel.app/

### GitHub

https://github.com/thanishlaus/TalentGuard

---

## 1. Problem Statement

TechNova is a 12,000-person IT services organization facing approximately 16% annual staff loss. Employee exits create significant business impact, with each exit estimated in the challenge brief to cost 6–9 months of salary.

HR teams cannot conduct detailed retention discussions with every employee. The challenge therefore is to identify the employees who should be prioritized for retention conversations within a limited HR capacity of 50 employees per cycle.

TalentGuard addresses this by predicting employee attrition risk, ranking employees, explaining practical risk indicators, and recommending retention actions.

---

## 2. Solution Overview

TalentGuard uses employee HR and workplace attributes from the IBM HR Analytics Employee Attrition dataset to estimate attrition probability.

The solution follows this flow:

**Employee Data → Preprocessing → ML Model → Attrition Probability → Top-50 Ranking → Risk Reasons → Retention Recommendation → HR Decision**

The dashboard is designed around the HR workflow:

**Predict → Understand → Prioritize → Decide**

The model is trained offline using Python and scikit-learn. The resulting scored employee data is consumed by the Next.js dashboard deployed on Vercel.

---

## 3. Key Features

### 3.1 Top-50 Retention Watchlist

Ranks the highest-risk employees so HR can focus its limited capacity on the most important cases.

Each watchlist record includes:

- Risk rank
- Employee identifier
- Job role
- Department
- Attrition risk
- Business-impact proxy
- Top risk reasons
- Recommended retention action

### 3.2 Risk vs Business Impact Matrix

Employees are positioned using:

- Attrition risk
- Business-impact proxy

This helps HR distinguish between employees who are high risk, high impact, or both.

### 3.3 Team Risk Heatmap

Aggregates risk across departments and helps identify teams with higher retention pressure.

### 3.4 Employee 360 View

Provides an individual employee view containing:

- Attrition risk
- Business-impact proxy
- Risk reasons
- Recommended action
- HR retention action plan

### 3.5 HR Retention Action Plan

Converts risk indicators into practical interventions such as:

- Workload/overtime review
- Engagement discussion
- Work-life balance intervention
- Compensation review
- HR retention conversation

### 3.6 Retention Conversation Draft

The dashboard can prepare a retention conversation action for HR. The action is explicitly treated as **PENDING_APPROVAL** rather than automatically contacting an employee.

### 3.7 Watchlist Export

The prioritized watchlist can be exported as JSON for further HR workflow use.

---

## 4. Dataset

TalentGuard uses the **IBM HR Analytics Employee Attrition & Performance** dataset.

Dataset characteristics:

- 1,470 employee records
- 35 original columns
- Target: `Attrition`
- Attrition classes:
  - No: 1,233
  - Yes: 237
- Missing values: 0
- Duplicate rows: 0
- Attrition rate: 16.12%

The timestamp/time-series approach described for other challenge projects is not used here because TalentGuard is based on the HR attrition dataset and its employee/workplace attributes.

---

## 5. Machine Learning Methodology

### Target

The target variable is:

`Attrition`

It is encoded as:

- `No → 0`
- `Yes → 1`

### Removed Columns

The following columns are excluded from model training:

- `EmployeeNumber` — identifier
- `EmployeeCount` — constant
- `Over18` — constant
- `StandardHours` — constant

### Preprocessing

Categorical features are transformed using one-hot encoding.

Numerical features use median imputation.

The preprocessing and model are combined into a scikit-learn Pipeline to keep transformations consistent between training and inference.

### Model

The current TalentGuard model uses:

**Random Forest Classifier**

Configuration includes:

- 300 trees
- Maximum depth: 10
- `class_weight="balanced"`
- Random state: 42

A stratified train/test split is used with:

- Test size: 20%
- Random state: 42

### Evaluation Metric

The primary reported model metric is ROC-AUC.

**Validation ROC-AUC: 0.7884**

Accuracy is not treated as the main business metric because the attrition classes are imbalanced.

---

## 6. Risk Reasoning

TalentGuard generates practical risk indicators from employee attributes.

Current risk indicators include:

- Frequent overtime
- Low job satisfaction
- Poor work-life balance
- Below-median income
- Multiple behavioral risk indicators when the explicit indicators are not triggered

The dashboard presents up to three risk reasons for each employee.

These reasons are intended as decision-support indicators, not causal explanations.

---

## 7. Business Impact Proxy

TalentGuard uses monthly income relative to the dataset median monthly income as a **business-impact proxy**.

This is used to prioritize cases where higher attrition risk overlaps with higher employee-value proxy.

It should not be interpreted as an actual financial loss calculation.

The prioritization score is:

`Priority Score = Attrition Risk × Business Impact Proxy`

This provides a simple ranking mechanism for the HR team's limited capacity.

---

## 8. Architecture

```text
                  ┌─────────────────────────┐
                  │ IBM HR Attrition Dataset│
                  │     1,470 employees     │
                  └────────────┬────────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │ Data Preprocessing       │
                  │ Encoding + Imputation    │
                  └────────────┬────────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │ Random Forest Model      │
                  │ 300 trees / balanced     │
                  └────────────┬────────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │ Attrition Probability   │
                  └────────────┬────────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │ Top-50 Prioritization   │
                  │ Risk × Impact Proxy     │
                  └────────────┬────────────┘
                               │
             ┌─────────────────┼──────────────────┐
             ▼                 ▼                  ▼
      Risk Reasons       Recommendations     Team Insights
             │                 │                  │
             └─────────────────┼──────────────────┘
                               ▼
                  ┌─────────────────────────┐
                  │ Next.js / React         │
                  │ TalentGuard Dashboard   │
                  └────────────┬────────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │ Vercel Deployment       │
                  └─────────────────────────┘
```

---

## 9. Technology Stack

### Machine Learning

- Python
- Pandas
- NumPy
- scikit-learn
- Joblib
- Jupyter Notebook

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Recharts

### Deployment

- GitHub
- Vercel

### MLOps / Experiment Tracking

MLflow is part of the challenge's recommended stack and is a planned enhancement for experiment tracking. The current deployed MVP does not claim MLflow tracking in production.

---

## 10. Project Structure

```text
TalentGuard/
│
├── data/
│   └── WA_Fn-UseC_-HR-Employee-Attrition.csv
│
├── ml/
│   └── notebooks/
│       └── 01_talentguard_eda.ipynb
│
├── talentguard_model.pkl
│
├── web/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── public/
│   │   └── talentguard_data.json
│   │
│   ├── package.json
│   ├── next.config.ts
│   └── tsconfig.json
│
└── .gitignore
```

---

## 11. Local Setup

### Prerequisites

- Python 3.11+
- Node.js
- npm
- Git

### Clone the repository

```bash
git clone https://github.com/thanishlaus/TalentGuard.git
cd TalentGuard
```

### Run the Next.js dashboard

```bash
cd web
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

### Build for production

```bash
npm run build
```

---

## 12. Deployment

The dashboard is deployed using Vercel.

The repository contains the Next.js application under the `web` directory, which is configured as the Vercel Root Directory.

Live application:

https://talent-guard-lckrrrn1l-thanishlaus.vercel.app/

---

## 13. Business Benefits

TalentGuard helps HR teams:

1. Focus retention conversations on the highest-risk employees.
2. Work within a fixed capacity of 50 employees per cycle.
3. Understand practical indicators associated with attrition risk.
4. Prioritize risk together with a business-impact proxy.
5. Move from prediction to concrete retention actions.
6. Reduce manual screening effort.
7. Provide an explainable decision-support interface for HR.

---

## 14. Scalability and Feasibility

The current solution separates model training from dashboard delivery.

This allows:

- Model retraining as new HR data becomes available.
- Scored data to be refreshed without redesigning the dashboard.
- The frontend to scale independently through Vercel.
- A future prediction API to replace the current precomputed scoring approach.

For enterprise use, the solution would require additional governance, security, privacy controls, monitoring, model validation, and integration with approved HR systems.

---

## 15. Responsible AI Considerations

TalentGuard is a decision-support tool, not an automated employee decision-maker.

Important safeguards include:

- HR review remains required before action.
- Retention conversation drafts are marked `PENDING_APPROVAL`.
- Risk reasons are presented as indicators, not causal explanations.
- The business-impact value is explicitly a proxy.
- Employee identifiers and sensitive HR data should be protected in a production environment.
- Model outputs should be monitored for bias and performance drift before enterprise adoption.

---

## 16. Future Enhancements

- Add MLflow experiment tracking and model versioning.
- Add a live Python prediction API.
- Add a model monitoring and drift dashboard.
- Add SHAP-based model explanations.
- Improve business-impact estimation using approved business data.
- Add a What-If Retention Simulator with clear non-causal labeling.
- Add role-based HR access control.
- Integrate with enterprise HR systems.
- Add automated retraining pipelines.
- Add fairness and bias monitoring across employee groups.
- Add secure audit logging.

---

## 17. Hackathon Outcome

TalentGuard demonstrates an end-to-end AI business solution:

**Data → ML Prediction → Risk Explanation → Prioritization → HR Action → Web Dashboard → Deployment**

The solution is designed to convert a machine-learning prediction into an actionable HR workflow rather than stopping at model accuracy.
