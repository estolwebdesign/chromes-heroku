import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// COMPONENTS
import AdminDashboard from "./Components/AdminComponents/AdminDashboard";
import Chromes from "./Components/AdminComponents/Chromes";
import Transaction from "./Components/AdminComponents/Transaction";
import Transactions from "./Components/AdminComponents/Transactions";
import User from "./Components/AdminComponents/User";
import Users from "./Components/AdminComponents/Users";
import Contact from "./Components/Contact";
import Error from "./Components/Layouts/Error";
import Footer from "./Components/Layouts/Footer";
import Header from "./Components/Layouts/Header";
import ForgotPassword from "./Components/UserComponents/ForgotPassword";
import ResetPassword from "./Components/UserComponents/ResetPassword";
import SearchChromes from "./Components/UserComponents/SearchChromes";
import Sign from "./Components/UserComponents/Sign";
import UserChromes from "./Components/UserComponents/UserChromes";
import UserTransactions from "./Components/UserComponents/UserTransactions";
import UserContext from "./Context/UserContext";

const Router = () => {
  const { user } = useContext(UserContext);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/search-chromes" element={<SearchChromes />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-chromes" element={<UserChromes />} />
        <Route path="/my-transactions" element={<UserTransactions />} />
        <Route exact path="/" element={<Sign />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/chromes" element={<Chromes />} />
        <Route path="/admin/transactions" element={<Transactions />} />
        <Route path="/admin/transactions/:id" element={<Transaction />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/users/:id" element={<User />} />

        {/* error */}
        <Route path="*" element={<Error code={404} />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default Router;
