import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate(); // For redirection

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);

  // Function to check password strength
  const checkPasswordStrength = (pwd: string) => {
    if (pwd.length < 6) return "Weak ❌";
    if (
      pwd.match(/[a-z]/) &&
      pwd.match(/[A-Z]/) &&
      pwd.match(/[0-9]/) &&
      pwd.length >= 8
    )
      return "Strong ✅";
    return "Medium ⚠️";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // First Name validation
    if (!firstName.trim()) {
      setError("First Name is required.");
      return;
    }

    // Email validation
    if (!email.endsWith("@wiu.edu")) {
      setError("Only WIU email addresses are allowed.");
      return;
    }

    // Password match validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(""); // Clear error if valid
    setAccountCreated(true);

    // Redirect to login after 2 seconds
    setTimeout(() => navigate("/login"), 2000);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        {accountCreated ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600">
              ✔ Account Created Successfully!
            </h2>
            <p className="text-gray-600 mt-2">Redirecting to login...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Create an Account
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">First Name *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter first name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Middle Name (Optional)
                </label>
                <input
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter middle name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Last Name (Optional)
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter last name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter WIU email"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Set Password *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordStrength(checkPasswordStrength(e.target.value));
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Create password"
                />
                {password && (
                  <p
                    className={`text-sm mt-1 ${
                      passwordStrength === "Strong ✅"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    Password Strength: {passwordStrength}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Confirm password"
                />
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                Create Account
              </button>
            </form>
            <p className="text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Sign in
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
