
import { useState } from "react";

import {
  GraduationCap,
  UserRound,
  Mail,
  Lock,
  IdCard,
  Building2,
  Eye,
  EyeOff,
  ArrowLeft,
  UserPlus,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 8) {
      alert("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    alert(
      `Registration Successful!\nName: ${name}\nEmail: ${email}\n\nReal account creation will be connected with backend later.`
    );
  };

  return (
    <div className="min-h-screen flex bg-slate-100">

      {/* Left Section */}

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white p-12 flex-col justify-between">

        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-3 rounded-xl">
            <GraduationCap size={32} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">CampusConnect</h1>
            <p className="text-blue-200 text-sm">Shivalik College</p>
          </div>
        </div>

        <div className="max-w-lg">
          <div className="bg-blue-400/10 border border-blue-300/20 rounded-2xl p-7">

            <UserPlus size={55} className="text-blue-300" />

            <h2 className="text-4xl font-bold mt-6 leading-tight">
              Join Your Campus Community.
            </h2>

            <p className="text-blue-200 mt-5 leading-relaxed">
              Create your account to discover events,
              connect with students and participate
              in exciting college activities.
            </p>

          </div>
        </div>

        <p className="text-blue-300 text-sm">
          © 2026 CampusConnect | Shivalik College
        </p>

      </div>

      {/* Right Section */}

      <div className="flex-1 flex items-center justify-center p-5 sm:p-10">

        <div className="w-full max-w-lg">

          <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
            <GraduationCap size={35} className="text-blue-700" />
            <h1 className="text-2xl font-bold text-blue-950">
              CampusConnect
            </h1>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-7 sm:p-9">

            <Link
              to="/"
              className="inline-flex items-center gap-2 text-blue-700 font-semibold text-sm hover:underline mb-6"
            >
              <ArrowLeft size={18} />
              Back to Login
            </Link>

            <div className="mb-7">
              <div className="inline-flex p-3 bg-blue-50 rounded-xl mb-4">
                <UserRound size={26} className="text-blue-700" />
              </div>

              <h2 className="text-3xl font-bold text-slate-900">
                Create Account
              </h2>

              <p className="text-slate-500 mt-2">
                Register as a Shivalik College student.
              </p>
            </div>

            <form onSubmit={handleRegister}>

              {/* Full Name */}

              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>

                <div className="relative">
                  <UserRound
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Email */}

              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  College Email
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your college email"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Student ID */}

              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Student ID / Enrollment Number
                </label>

                <div className="relative">
                  <IdCard
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Enter your student ID"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Department */}

              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Department
                </label>

                <div className="relative">
                  <Building2
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                  >
                    <option value="">Select Department</option>
                    <option value="CSE">Computer Science Engineering</option>
                    <option value="DS">Data Science</option>
                    <option value="IT">Information Technology</option>
                    <option value="ECE">Electronics and Communication</option>
                    <option value="ME">Mechanical Engineering</option>
                    <option value="CE">Civil Engineering</option>
                  </select>
                </div>
              </div>

              {/* Password */}

              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-300 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>

                <p className="text-xs text-slate-400 mt-1">
                  Minimum 8 characters.
                </p>
              </div>

              {/* Confirm Password */}

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-300 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* Submit */}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-4 rounded-xl transition shadow-lg shadow-blue-200"
              >
                Create Account
                <UserPlus size={20} />
              </button>

            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/"
                  className="text-blue-700 font-bold hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>

          </div>

          <p className="text-center text-xs text-slate-400 mt-5">
            CampusConnect | Shivalik College Event Management System
          </p>

        </div>
      </div>
    </div>
  );
}
