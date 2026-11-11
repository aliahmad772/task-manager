import { useEffect, useState } from "react";

const badge = {
  todo: "bg-gray-200 text-gray-800",
  doing: "bg-blue-200 text-blue-800",
  done: "bg-green-200 text-green-800",
};
const prio = { low: "text-green-600", medium: "text-yellow-600", high: "text-red-600" };

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);

  // debounce search so we don't hit the API on every keystroke
  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams({ page, limit: 10, sortBy, order });
    if (debounced) params.set("search", debounced);
    if (status) params.set("status", status);
    if (priority) params.set("priority", priority);

    setLoading(true);
    fetch(`/api/tasks?${params}`)
      .then((r) => r.json())
      .then((res) => {
        setTasks(res.data);
        setMeta({ total: res.total, pages: res.pages });
      })
      .finally(() => setLoading(false));
  }, [debounced, status, priority, sortBy, order, page]);

  const reset = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  const sel = "border rounded px-3 py-2 bg-white";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Task Manager</h1>

      <div className="grid gap-3 sm:grid-cols-5 mb-4">
        <input
          className={`${sel} sm:col-span-2`}
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className={sel} value={status} onChange={reset(setStatus)}>
          <option value="">All status</option>
          <option value="todo">Todo</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>
        <select className={sel} value={priority} onChange={reset(setPriority)}>
          <option value="">All priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <div className="flex gap-2">
          <select className={`${sel} flex-1`} value={sortBy} onChange={reset(setSortBy)}>
            <option value="createdAt">Created</option>
            <option value="dueDate">Due date</option>
            <option value="title">Title</option>
          </select>
          <button className={sel} onClick={() => setOrder(order === "asc" ? "desc" : "asc")}>
            {order === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-2">{meta.total} results</p>

      <div className={`space-y-3 ${loading ? "opacity-50" : ""}`}>
        {tasks.map((t) => (
          <div key={t._id} className="border rounded p-4 bg-white shadow-sm">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">{t.title}</h2>
              <span className={`text-xs px-2 py-1 rounded ${badge[t.status]}`}>{t.status}</span>
            </div>
            <p className="text-sm text-gray-600">{t.description}</p>
            <div className="text-xs mt-2 flex justify-between">
              <span className={prio[t.priority]}>Priority: {t.priority}</span>
              <span>Due: {new Date(t.dueDate).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
        {!loading && tasks.length === 0 && (
          <p className="text-center text-gray-500">No tasks found.</p>
        )}
      </div>

      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          className="border rounded px-4 py-2 disabled:opacity-40"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>
        <span>
          Page {page} of {meta.pages || 1}
        </span>
        <button
          className="border rounded px-4 py-2 disabled:opacity-40"
          disabled={page >= meta.pages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
