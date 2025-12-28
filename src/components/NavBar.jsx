import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
      {/* App Title */}
      <h1 className="text-xl font-bold text-blue-600">
        AI Quiz Classroom
      </h1>

      {/* Navigation Links */}
      <div className="space-x-6">
        <Link to="/" className="text-gray-600 hover:text-blue-600">
          Home
        </Link>
        <Link to="/teacher" className="text-gray-600 hover:text-blue-600">
          Teacher
        </Link>
        <Link to="/join" className="text-gray-600 hover:text-blue-600">
          Join
        </Link>
      </div>
    </nav>
  );
}
