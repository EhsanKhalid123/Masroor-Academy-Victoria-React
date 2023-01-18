import '../Error404.css';

function ErrorPage() {
  
  
    return (
        <div>
      <h1 className="text-center" style={{ paddingTop: "50px" }}>ERROR</h1>

    <div className="mainbox">
      <div className="err">4</div>
      <i className="text-center far fa-question-circle fa-spin"></i>
      <div className="err2">4</div>
      <div className="msg">
        Sorry the page does not exist!
      </div>
    </div>
    </div>
  );
}

// Export the home Function
export default ErrorPage;
