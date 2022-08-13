import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./Home";
import ErrorPage from "./ErrorPage";
import Header from './Header';
import Footer from './Footer';
import Navigation from './Navigation';

const [user, setUser] = useState(getUser());

 // Const Function for removing state for user and sending it to child elements
 const logoutUser = () => {
  removeUser();
  setUser(null);
};

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Navigation user={user} logoutUser={logoutUser} />
        <Routes>
          <Route path="/" element={<Home />} />        
          <Route path="/home" element={<Home />} />    
          <Route path="*" element={<ErrorPage />} />      
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
