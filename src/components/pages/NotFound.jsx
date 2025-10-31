import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-6">
            <ApperIcon name="AlertCircle" className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-slate-700 mb-2">Page Not Found</h2>
          <p className="text-slate-600 mb-8">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="space-y-4">
          <Link to="/">
            <Button className="w-full">
              <ApperIcon name="Home" className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Link to="/employees">
            <Button variant="outline" className="w-full">
              <ApperIcon name="Users" className="h-4 w-4 mr-2" />
              View Employees
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;