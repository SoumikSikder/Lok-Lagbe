import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";


import Login from "./pages/Login";

import ManageProfile from "./pages/ManageProfile";

import ProtectedRoute from "./components/ProtectedRoute";



function App() {


    return (

        <BrowserRouter>

            <Routes>


                <Route
                    path="/"
                    element={<Login />}
                />


                <Route
                    path="/login"
                    element={<Login />}
                />


                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ManageProfile />
                        </ProtectedRoute>
                    }
                />


            </Routes>

        </BrowserRouter>

    );

}


export default App;