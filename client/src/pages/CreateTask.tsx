import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { TasksAPI } from "../api/tasks.api";

const CreateTask = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setLoading(true);
      await TasksAPI.create(form);
      navigate("/"); // go back to dashboard
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Create Task</h1>
          <button
            onClick={() => navigate("/")}
            className="text-sm underline cursor-pointer"
          >
            Cancel
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-500/90 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <input
            className="w-full p-3 rounded bg-slate-900 border border-slate-600"
            placeholder="Task title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          {/* Description */}
          <textarea
            className="w-full p-3 rounded bg-slate-900 border border-slate-600 min-h-[100px]"
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          {/* Priority */}
          <select
            className="w-full p-3 rounded bg-slate-900 border border-slate-600"
            value={form.priority}
            onChange={(e) =>
              setForm({ ...form, priority: e.target.value })
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 py-3 rounded font-semibold cursor-pointer"
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
