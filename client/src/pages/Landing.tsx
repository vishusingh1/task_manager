import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../api/auth.api";
import { TasksAPI } from "../api/tasks.api";

type User = { id?: number; name?: string; email?: string } | null;

type TaskSummary = {
  total: number;
  completed: number;
  pending: number;
};

type RecentTask = {
  id: number;
  title: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed";
};

export default function Landing() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User>(null);
  const [summary, setSummary] = useState<TaskSummary | null>(null);
  const [recentTasks, setRecentTasks] = useState<RecentTask[]>([]);

  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    AuthAPI.me()
      .then((res) => mounted && setUser(res.data.user))
      .catch(() => mounted && setUser(null))
      .finally(() => mounted && setLoadingUser(false));

    TasksAPI.summary()
      .then((res) => mounted && setSummary(res.data))
      .catch(() => mounted && setError("Failed to load task summary"))
      .finally(() => mounted && setLoadingSummary(false));

    TasksAPI.recent()
      .then((res) => mounted && setRecentTasks(res.data))
      .catch(() => mounted && setRecentTasks([]))
      .finally(() => mounted && setLoadingRecent(false));

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="max-w-5xl w-full bg-slate-800/50 backdrop-blur-md rounded-2xl p-8 shadow-lg">

        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">TaskManager — Dashboard</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/tasks")}
              className="px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-600 cursor-pointer"
            >
              My Tasks
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* MAIN */}
          <div className="col-span-2 bg-slate-700/50 p-6 rounded-lg">

            {/* Welcome */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {loadingUser
                    ? "Welcome"
                    : `Welcome${user?.name ? `, ${user.name}` : user?.email ? `, ${user.email}` : ""} 👋`}
                </h2>
                <p className="text-sm text-slate-300 mt-1">
                  Your personal task workspace.
                </p>
              </div>

              <button
                onClick={() => navigate("/tasks/create")}
                className="flex flex-col items-center px-5 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 font-semibold cursor-pointer"
              >
                <span className="text-xl">+</span>
                <span className="text-sm">New Task</span>
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FeatureCard title="Quick Create" desc="Add a task in seconds." />
              <FeatureCard title="AI Help" desc="Smart descriptions." comingSoon />
              <FeatureCard title="Filters & Views" desc="List, board, calendar." comingSoon />
            </div>

            {/* Recent Tasks */}
            <div className="mt-6">
              <h4 className="text-lg font-medium mb-2">Recent tasks</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {loadingRecent ? (
                  <div className="p-3 bg-slate-800 rounded-md animate-pulse h-16" />
                ) : recentTasks.length === 0 ? (
                  <div className="p-3 bg-slate-800 rounded-md text-slate-300">
                    No recent tasks — create one to get started.
                  </div>
                ) : (
                  recentTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => navigate("/tasks")}
                      className="p-3 bg-slate-800 rounded-md cursor-pointer hover:bg-slate-700"
                    >
                      <h5 className="font-medium">{task.title}</h5>
                      <div className="flex gap-2 mt-2 text-xs">
                        <span
                          className={`px-2 py-0.5 rounded ${
                            task.status === "completed"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {task.status}
                        </span>
                        <span className="text-slate-400">
                          {task.priority} priority
                        </span>
                      </div>
                    </div>
                  ))
                )}

                <div className="p-3 bg-slate-800 rounded-md text-slate-400 italic">
                  Filters for assigned tasks — coming soon
                </div>
              </div>
            </div>
          </div>

          {/* STATS */}
          <aside className="bg-slate-700/50 p-6 rounded-lg">
            <h3 className="font-semibold mb-3">Stats</h3>

            {loadingSummary ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-slate-600 rounded w-3/4"></div>
                <div className="h-4 bg-slate-600 rounded w-1/2"></div>
              </div>
            ) : error ? (
              <p className="text-sm text-rose-400">{error}</p>
            ) : summary ? (
              <ul className="text-sm text-slate-300 space-y-2">
                <li>Total tasks: <strong>{summary.total}</strong></li>
                <li>Completed: <strong>{summary.completed}</strong></li>
                <li>Pending: <strong>{summary.pending}</strong></li>
              </ul>
            ) : null}

            <button
              onClick={() => navigate("/tasks")}
              className="w-full mt-4 px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 cursor-pointer"
            >
              View all tasks
            </button>
          </aside>
        </section>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  desc,
  comingSoon = false,
}: {
  title: string;
  desc: string;
  comingSoon?: boolean;
}) {
  return (
    <div className="p-4 pt-6 bg-slate-800 rounded-lg relative">
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className={`text-sm ${comingSoon ? "text-slate-400" : "text-slate-300"}`}>
        {desc}
      </p>

      {comingSoon && (
        <span className="absolute top-2 right-2 text-xs px-2 py-0.5 bg-slate-600 rounded">
          Coming soon
        </span>
      )}
    </div>
  );
}
