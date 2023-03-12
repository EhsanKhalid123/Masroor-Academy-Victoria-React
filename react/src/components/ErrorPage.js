import { Link } from "react-router-dom";

function ErrorPage() {


  return (
    <div>
      <br />
      <div className="container">
        <h1 className="text-center">ERROR</h1>
        <div className="error-container">
          <div className="error-number">4</div>
          <i className="far fa-question-circle fa-spin"></i>
          <div className="error-number">4</div>
        </div>
        <div className="error-message">Sorry the page does not exist! <Link className="navbar-brand" to="/">Go to Homepage </Link></div>
      </div>
    </div>
  );
}

// Export the home Function
export default ErrorPage;
