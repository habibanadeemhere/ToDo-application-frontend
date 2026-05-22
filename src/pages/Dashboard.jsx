function Dashboard() {

  return (

    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}

      <div className="flex items-center justify-between px-8 py-5 border-b border-slate-800">

        <h1 className="text-3xl font-bold text-blue-400">
          TaskFlow
        </h1>

        <button
          className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </button>

      </div>

      {/* Board */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">

        {/* TODO */}

        <div className="bg-slate-900 rounded-2xl p-5 min-h-[500px]">

          <h2 className="text-2xl font-bold mb-5 text-yellow-400">
            To Do
          </h2>

          <div className="bg-slate-800 p-4 rounded-xl mb-4">

            <h3 className="font-semibold text-lg">
              Design Dashboard
            </h3>

            <p className="text-slate-400 text-sm mt-2">
              Create Trello board UI
            </p>

          </div>

        </div>

        {/* IN PROGRESS */}

        <div className="bg-slate-900 rounded-2xl p-5 min-h-[500px]">

          <h2 className="text-2xl font-bold mb-5 text-blue-400">
            In Progress
          </h2>

          <div className="bg-slate-800 p-4 rounded-xl mb-4">

            <h3 className="font-semibold text-lg">
              Backend APIs
            </h3>

            <p className="text-slate-400 text-sm mt-2">
              Connect MongoDB APIs
            </p>

          </div>

        </div>

        {/* DONE */}

        <div className="bg-slate-900 rounded-2xl p-5 min-h-[500px]">

          <h2 className="text-2xl font-bold mb-5 text-green-400">
            Done
          </h2>

          <div className="bg-slate-800 p-4 rounded-xl mb-4">

            <h3 className="font-semibold text-lg">
              Authentication Setup
            </h3>

            <p className="text-slate-400 text-sm mt-2">
              JWT Login Complete
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;