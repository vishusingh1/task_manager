import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { TasksAPI } from "../api/tasks.api";
import { TasksAPI } from "../api/tasks.api";

type Task = {
  id: number;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed";
};

const Tasks = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);



useEffect(() => {
  let mounted = true;

  setLoading(true);
  TasksAPI.list()
    .then((res) => {
      if (!mounted) return;
      setTasks(res.data);
    })
    .catch((err) => {
      console.error("Failed to fetch tasks", err);
    })
    .finally(() => {
      if (mounted) setLoading(false);
    });

  return () => {
    mounted = false;
  };
}, []);


  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Tasks</h1>
            <p className="text-slate-400 text-sm">
              View and manage all your tasks
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="px-3 py-2 bg-slate-700 rounded hover:bg-slate-600 cursor-pointer"
            >
              ← Dashboard
            </button>

            <button
              onClick={() => navigate("/tasks/create")}
              className="px-4 py-2 bg-emerald-500 rounded hover:bg-emerald-600 font-semibold cursor-pointer"
            >
              + New Task
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 shadow-lg">

          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-slate-700 rounded w-1/2" />
              <div className="h-4 bg-slate-700 rounded w-3/4" />
              <div className="h-4 bg-slate-700 rounded w-2/3" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center text-slate-400 py-12">
              <p className="text-lg">No tasks yet</p>
              <p className="text-sm mt-1">
                Create your first task to get started 🚀
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-slate-900/70 border border-slate-700 rounded-lg p-4 flex items-start justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-lg">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-slate-400 mt-1">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-3 text-xs">
                      {/* Status */}
                      <span
                        className={`px-2 py-1 rounded-full ${
                          task.status === "completed"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {task.status}
                      </span>

                      {/* Priority */}
                      <span
                        className={`px-2 py-1 rounded-full ${
                          task.priority === "high"
                            ? "bg-red-500/20 text-red-400"
                            : task.priority === "medium"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-slate-500/20 text-slate-300"
                        }`}
                      >
                        {task.priority} priority
                      </span>
                    </div>
                  </div>

                  {/* Actions (future) */}
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="italic">Actions coming soon</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
