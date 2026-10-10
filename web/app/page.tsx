"use client";



import { useEffect, useState } from "react";



type Employee = {

  rank: number;

  id: number;

  role: string;

  dept: string;

  risk: number;

  impact: number;

  reasons: string[];

  action: string;

};



type Department = {

  name: string;

  risk: number;

  attrition: number;

  high: number;

};



type DashboardData = {

  employees: number;

  attrition_rate: number;

  hr_capacity: number;

  roc_auc: number;

  departments: any[];

  top50: any[];

};





export default function Home() {



  const [employees, setEmployees] = useState<Employee[]>([]);

  const [departments, setDepartments] = useState<Department[]>([]);

  const [selected, setSelected] = useState<Employee | null>(null);



  const [metrics, setMetrics] = useState({

    employees: 0,

    attrition_rate: 0,

    hr_capacity: 50,

    roc_auc: 0

  });



  useEffect(() => {



    fetch("/talentguard_data.json")

      .then((res) => res.json())

      .then((data: DashboardData) => {



        const top50 = data.top50;



        // Convert Python data into dashboard format

        const formattedEmployees: Employee[] = top50.map(

          (e: any, index: number) => {



            const risk = Number(e.AttritionRisk);



            // Monthly income used as a business-impact proxy

            const impact = Math.min(

              1,

              Number(e.MonthlyIncome) / 20000

            );



            return {

              rank: Number(e.RiskRank) || index + 1,

              id: Number(e.EmployeeNumber),

              role: e.JobRole,

              dept: e.Department,

              risk,

              impact,

              reasons: Array.isArray(e.RiskReasons)

                ? e.RiskReasons

                : [String(e.RiskReasons)],

              action: e.Recommendation

            };

          }

        );



        const formattedDepartments: Department[] =

          data.departments.map((d: any) => ({

            name:

              d.Department === "Research & Development"

                ? "R&D"

                : d.Department,



            risk: Number(d.AverageRisk) * 100,



            attrition: Number(d.AttritionRate),



            high: Number(d.HighRisk)

          }));



        setEmployees(formattedEmployees);

        setDepartments(formattedDepartments);



        setMetrics({

          employees: data.employees,

          attrition_rate: data.attrition_rate,

          hr_capacity: data.hr_capacity,

          roc_auc: data.roc_auc

        });



        if (formattedEmployees.length > 0) {

          setSelected(formattedEmployees[0]);

        }



      })

      .catch((error) => {

        console.error(

          "Failed to load TalentGuard data:",

          error

        );

      });



  }, []);



  return (

    <main className="min-h-screen bg-slate-950 text-white">



      {/* HEADER */}

      <header className="border-b border-slate-800 bg-slate-950/95">

        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-6 py-5">

          <div>

            <h1 className="text-2xl font-bold tracking-tight">

              Talent<span className="text-cyan-400">Guard</span>

            </h1>

            <p className="text-sm text-slate-400">

              AI-Powered Employee Retention Intelligence

            </p>

          </div>



          <nav className="flex flex-wrap items-center gap-4">
  <button type="button" onClick={() => document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" })} className="text-sm font-medium text-cyan-400 hover:text-cyan-300">Dashboard</button>
  <button type="button" onClick={() => document.getElementById("watchlist")?.scrollIntoView({ behavior: "smooth" })} className="text-sm text-slate-400 hover:text-white">Watchlist</button>
  <button type="button" onClick={() => document.getElementById("team-insights")?.scrollIntoView({ behavior: "smooth" })} className="text-sm text-slate-400 hover:text-white">Team Insights</button>
  <button type="button" onClick={() => document.getElementById("employee-profile")?.scrollIntoView({ behavior: "smooth" })} className="text-sm text-slate-400 hover:text-white">Employee 360</button>
</nav>

          <div className="flex items-center gap-3">

            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">

              ● MODEL ONLINE

            </span>

            <span className="text-sm text-slate-400">

              TechNova HR

            </span>

          </div>

        </div>

      </header>



      <div

  id="dashboard"

  className="mx-auto max-w-7xl px-6 py-8"

>



        {/* TITLE */}

        <div className="mb-8">

          <h2 className="text-3xl font-bold">

            Retention Command Center

          </h2>

          <p className="mt-2 text-slate-400">

            Identify high-risk employees before they become costly attrition events.

          </p>

        </div>



        {/* KPI CARDS */}

        <section className="grid gap-4 md:grid-cols-4">



          <KPI

            title="Employees"

            value={metrics.employees.toLocaleString()}

            subtitle="Workforce analyzed"

/>



          <KPI

  title="Current Attrition"

  value={`${metrics.attrition_rate}%`}

  subtitle="Historical baseline"

  danger

/>



          <KPI

  title="High-Risk Employees"

  value={String(metrics.hr_capacity)}

  subtitle="HR capacity / cycle"

  warning

/>



          <KPI

  title="Model ROC-AUC"

  value={metrics.roc_auc.toFixed(4)}

  subtitle="Validation performance"

  success

/>



        </section>



        {/* RISK / IMPACT */}

        <section className="mt-8 grid gap-6 lg:grid-cols-2">



          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">



            <div className="mb-5">

              <h3 className="text-lg font-semibold">

                Risk vs Business Impact

              </h3>

              <p className="text-sm text-slate-400">

                Prioritize employees where attrition risk and business impact overlap.

              </p>

            </div>



            <div className="relative h-72 rounded-xl border border-slate-700 bg-slate-950">



              <div className="absolute left-1/2 top-0 h-full border-l border-dashed border-slate-700" />

              <div className="absolute left-0 top-1/2 w-full border-t border-dashed border-slate-700" />



              <span className="absolute left-3 top-3 text-xs text-slate-500">

                HIGH IMPACT

              </span>



              <span className="absolute bottom-3 left-3 text-xs text-slate-500">

                LOW IMPACT

              </span>



              <span className="absolute right-3 top-3 text-xs text-red-400">

                HIGH RISK

              </span>



              <span className="absolute left-3 top-1/2 mt-2 text-xs text-emerald-400">

                LOW RISK

              </span>



              {employees.map((e, i) => (

                <button

                  key={e.id}

                  onClick={() => setSelected(e)}

                  className="absolute h-5 w-5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/40 transition hover:scale-150"

                  style={{

                    left: `${e.risk * 75 + 10}%`,

                    top: `${(1 - e.impact) * 65 + 12}%`,

                  }}

                  title={`Employee ${e.id}`}

                />

              ))}



            </div>



            <div className="mt-4 flex justify-between text-xs text-slate-500">

              <span>Low Attrition Risk</span>

              <span>High Attrition Risk →</span>

            </div>



          </div>



          {/* TEAM HEATMAP */}

          <div

  id="team-insights"

  className="rounded-2xl border border-slate-800 bg-slate-900 p-6"

>



            <div className="mb-5">

              <h3 className="text-lg font-semibold">

                Team Risk Heatmap

              </h3>

              <p className="text-sm text-slate-400">

                Department-level retention pressure.

              </p>

            </div>



            <div className="space-y-4">



              {departments.map((d) => (

                <div

                  key={d.name}

                  className="rounded-xl border border-slate-800 bg-slate-950 p-4"

                >

                  <div className="mb-2 flex justify-between">

                    <span className="font-medium">{d.name}</span>

                    <span className="text-sm text-red-400">

                      {d.risk}% risk

                    </span>

                  </div>



                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                    <div

                      className="h-full rounded-full bg-red-500"

                      style={{ width: `${d.risk}%` }}

                    />

                  </div>



                  <div className="mt-3 flex justify-between text-xs text-slate-500">

                    <span>Attrition: {d.attrition}%</span>

                    <span>High risk: {d.high}</span>

                  </div>

                </div>

              ))}



            </div>



          </div>



        </section>



        {/* WATCHLIST */}

        <section

  id="watchlist"

  className="mt-8 rounded-2xl border border-slate-800 bg-slate-900"

>

        



          <div className="flex items-center justify-between border-b border-slate-800 p-6">



            <div>

              <h3 className="text-lg font-semibold">

                Top-50 Retention Watchlist

              </h3>



              <p className="text-sm text-slate-400">

                Ranked employees requiring HR attention.

              </p>

            </div>



            <button

  type="button"

  onClick={() => {

    const data = JSON.stringify(employees, null, 2);

    const blob = new Blob([data], { type: "application/json" });

    const url = URL.createObjectURL(blob);



    const link = document.createElement("a");

    link.href = url;

    link.download = "TalentGuard_Top50_Watchlist.json";

    link.click();



    URL.revokeObjectURL(url);

  }}

  className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400"

>

  Export Watchlist

</button>



          </div>



          <div className="overflow-x-auto">



            <table className="w-full text-left text-sm">



              <thead className="border-b border-slate-800 text-xs uppercase text-slate-500">



                <tr>

                  <th className="px-6 py-4">Rank</th>

                  <th className="px-6 py-4">Employee</th>

                  <th className="px-6 py-4">Role</th>

                  <th className="px-6 py-4">Department</th>

                  <th className="px-6 py-4">Risk</th>

                  <th className="px-6 py-4">Priority</th>

                  <th className="px-6 py-4">Action</th>

                </tr>



              </thead>



              <tbody>



                {employees.map((e) => (



                  <tr

                    key={e.id}

                    onClick={() => setSelected(e)}

                    className="cursor-pointer border-b border-slate-800/70 transition hover:bg-slate-800/50"

                  >



                    <td className="px-6 py-4 font-bold text-slate-300">

                      #{e.rank}

                    </td>



                    <td className="px-6 py-4 font-medium">

                      EMP-{e.id}

                    </td>



                    <td className="px-6 py-4 text-slate-300">

                      {e.role}

                    </td>



                    <td className="px-6 py-4 text-slate-400">

                      {e.dept}

                    </td>



                    <td className="px-6 py-4">



                      <span className="rounded-full bg-red-500/10 px-3 py-1 text-red-400">

                        {(e.risk * 100).toFixed(0)}%

                      </span>



                    </td>



                    <td className="px-6 py-4">



                      <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-800">

                        <div

                          className="h-full bg-cyan-400"

                          style={{ width: `${e.impact * 100}%` }}

                        />

                      </div>



                    </td>



                    <td className="px-6 py-4">

  <button

    type="button"

    onClick={() => {

      setSelected(e);



      setTimeout(() => {

        document

          .getElementById("employee-profile")

          ?.scrollIntoView({ behavior: "smooth" });

      }, 100);

    }}

    className="cursor-pointer text-cyan-400 hover:text-cyan-300"

  >

    View →

  </button>

</td>



                  </tr>



                ))}



              </tbody>



            </table>



          </div>



        </section>



        {/* EMPLOYEE DETAIL */}

        {selected && (

  <section

    id="employee-profile"

    className="mt-8 grid gap-6 lg:grid-cols-2"

  >



          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">



            <h3 className="text-lg font-semibold">

              Employee Risk Profile

            </h3>



            <div className="mt-6 flex items-center gap-5">



              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-2xl font-bold text-red-400">

                {(selected.risk * 100).toFixed(0)}%

              </div>



              <div>

                <p className="text-xl font-bold">

                  EMP-{selected.id}

                </p>



                <p className="text-slate-400">

                  {selected.role} · {selected.dept}

                </p>

              </div>



            </div>



            <div className="mt-6">



              <p className="mb-3 text-sm font-medium text-slate-300">

                Top Risk Reasons

              </p>



              <div className="space-y-2">



                {selected.reasons.map((reason) => (

                  <div

                    key={reason}

                    className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300"

                  >

                    ⚠ {reason}

                  </div>

                ))}



              </div>



            </div>



          </div>



          <div className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">



            <h3 className="text-lg font-semibold">

              Recommended Retention Action

            </h3>



            <p className="mt-2 text-sm text-slate-400">

              AI-generated recommendation for HR review.

            </p>



            <div className="mt-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">



              <div className="mb-3 text-2xl">💡</div>



              <p className="text-lg font-medium leading-relaxed">

                {selected.action}

              </p>



            </div>

            <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950 p-5">

  <div className="mb-4 flex items-center gap-2">

    <span className="text-xl">🎯</span>

    <h4 className="font-semibold text-white">

      HR Retention Action Plan

    </h4>

  </div>



  <div className="space-y-3">



    {selected.reasons.some((r) =>

      r.toLowerCase().includes("overtime")

    ) && (

      <div className="rounded-lg bg-slate-900 p-3">

        <p className="font-medium text-cyan-400">

          🕐 Workload Intervention

        </p>

        <p className="mt-1 text-sm text-slate-400">

          Review overtime frequency and redistribute workload

          where possible to reduce employee burnout.

        </p>

      </div>

    )}



    {selected.reasons.some((r) =>

      r.toLowerCase().includes("satisfaction")

    ) && (

      <div className="rounded-lg bg-slate-900 p-3">

        <p className="font-medium text-cyan-400">

          💬 Engagement Intervention

        </p>

        <p className="mt-1 text-sm text-slate-400">

          Schedule a one-to-one discussion to understand

          dissatisfaction and identify immediate improvements.

        </p>

      </div>

    )}



    {selected.reasons.some((r) =>

      r.toLowerCase().includes("work-life")

    ) && (

      <div className="rounded-lg bg-slate-900 p-3">

        <p className="font-medium text-cyan-400">

          ⚖️ Work-Life Intervention

        </p>

        <p className="mt-1 text-sm text-slate-400">

          Explore flexible scheduling, workload adjustment,

          or leave planning.

        </p>

      </div>

    )}



    {selected.reasons.some((r) =>

      r.toLowerCase().includes("income")

    ) && (

      <div className="rounded-lg bg-slate-900 p-3">

        <p className="font-medium text-cyan-400">

          💰 Compensation Review

        </p>

        <p className="mt-1 text-sm text-slate-400">

          Review compensation competitiveness and discuss

          available salary or incentive progression.

        </p>

      </div>

    )}



    <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">

      <p className="font-medium text-cyan-400">

        💬 HR Conversation

      </p>

      <p className="mt-1 text-sm text-slate-400">

        Discuss the employee's concerns and agree on

        practical retention actions.

      </p>

    </div>



  </div>



  <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">

    <span className="text-sm text-slate-400">

      Recommended Priority

    </span>



    <span className="rounded-full bg-red-500/10 px-3 py-1 text-sm font-semibold text-red-400">

      HIGH

    </span>

  </div>

</div>



            <button

  type="button"

  onClick={() => {

    alert(

      `Retention conversation prepared for EMP-${selected.id}.\n\nRecommended action:\n${selected.action}\n\nStatus: PENDING_APPROVAL`

    );

  }}

  className="mt-5 w-full rounded-lg bg-cyan-500 py-3 font-semibold text-slate-950 hover:bg-cyan-400"

>

  Start Retention Conversation

</button>



          </div>



        </section>

        )}



        {/* FOOTER */}

        <footer className="py-10 text-center text-xs text-slate-600">

          TalentGuard · AI-assisted retention intelligence · Human review required

        </footer>



      </div>



    </main>

  );

}



function KPI({

  title,

  value,

  subtitle,

  danger,

  warning,

  success,

}: {

  title: string;

  value: string;

  subtitle: string;

  danger?: boolean;

  warning?: boolean;

  success?: boolean;

}) {

  return (

    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">



      <p className="text-sm text-slate-400">{title}</p>



      <p

        className={`mt-2 text-3xl font-bold ${

          danger

            ? "text-red-400"

            : warning

            ? "text-amber-400"

            : success

            ? "text-emerald-400"

            : "text-white"

        }`}

      >

        {value}

      </p>



      <p className="mt-1 text-xs text-slate-500">

        {subtitle}

      </p>



    </div>

  );

}