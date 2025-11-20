import { Receipt } from "lucide-react";

import { listExpenses } from "@/app/actions/expenses";
import { listPeople } from "@/app/actions/people";
import { ExpenseManager } from "@/components/expense/expense-manager";

export default async function Home() {
  const [people, expenses] = await Promise.all([listPeople(), listExpenses()]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-10 px-4">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="rounded-2xl bg-white px-6 py-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3 text-indigo-600">
                <Receipt className="h-6 w-6" />
                <span className="font-semibold tracking-wide uppercase text-xs">
                  Group Expense Splitter
                </span>
              </div>
              <h1 className="mt-2 text-3xl font-semibold text-gray-900">
                Track expenses and split them fairly
              </h1>
              <p className="mt-1 text-gray-600">
                Add detailed expenses, assign who paid, and make sure every split balances.
              </p>
            </div>
            <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
              {people.length === 0
                ? "Add people to start tracking expenses."
                : `${people.length} ${people.length === 1 ? "person" : "people"} in this group`}
            </div>
          </div>
        </header>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <ExpenseManager people={people} expenses={expenses} />
        </div>
      </div>
    </main>
  );
}
      </div>
    </main>
  );
}
