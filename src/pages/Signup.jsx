import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Signup() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSignup = async (e) => {
    e.preventDefault();

    try {

      await API.post("/auth/register", form);

      alert("Signup Successful");

      navigate("/");

    } catch (error) {
      console.log(error);

      alert("Signup Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-4">

      <form
        onSubmit={handleSignup}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl"
      >

        <h1 className="text-4xl font-bold text-white text-center mb-2">
          Create Account
        </h1>

        <p className="text-slate-300 text-center mb-8">
          Join your task management workspace
        </p>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-4 rounded-xl bg-slate-800 text-white outline-none mb-4"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-4 rounded-xl bg-slate-800 text-white outline-none mb-4"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-4 rounded-xl bg-slate-800 text-white outline-none mb-6"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="w-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white p-4 rounded-xl font-semibold">
          Create Account
        </button>

        <p className="text-slate-300 text-center mt-6">
          Already have an account?

          <Link
            to="/"
            className="text-blue-400 ml-2 font-semibold"
          >
            Login
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Signup;