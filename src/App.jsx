import React, { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CitiesContextProvider from "./Contexts/CitiesContext";
import FakeAuthContextProvider from "./Contexts/FakeAuthContext";
import CityList from "./Components/CityList/CityList";
import CountryList from "./Components/CountryList/CountryList";
import City from "./Components/City/City";
import Form from "./Components/Form/Form";

import ProtectedRoute from "./Pages/ProtectedRoute/ProtectedRoute";
import PageNav from "./Components/PageNav/PageNav";

import SpinnerFullPage from "./Components/SpinnerFullPage/SpinnerFullPage";
// import HomePage from "./Pages/HomePage/HomePage";
// import Product from "./Pages/Product/Product";
// import Pricing from "./Pages/Pricing/Pricing";
// import PageNotFound from "./Pages/PageNotFound/PageNotFound";
// import Login from "./Pages/Login/Login";
// import AppLayout from "./Pages/AppLayout/AppLayout";
// first step
const HomePage = lazy(() => import("./Pages/HomePage/HomePage"));
const Login = lazy(() => import("./Pages/Login/Login"));
const Product = lazy(() => import("./Pages/Product/Product"));
const Pricing = lazy(() => import("./Pages/Pricing/Pricing"));
const PageNotFound = lazy(() => import("./Pages/PageNotFound/PageNotFound"));
const AppLayout = lazy(() => import("./Pages/AppLayout/AppLayout"));

function App() {
  return (
    <FakeAuthContextProvider>
      <CitiesContextProvider>
        <BrowserRouter>
        {/* second step to lazy loading */}
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route index element={<HomePage />} />
              <Route
                path="app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                {/* to use navigate (declaritve way) ->  must be nested route */}
                {/* why this way is called declaritve -> because we  declare in our jsx */}
                <Route index element={<Navigate replace to="cities" />} />
                {/* first step: use pramas with react-router */}
                <Route path="cities/:id" element={<City />} />
                <Route path="cities" element={<CityList />} />
                <Route path="countries" element={<CountryList />} />
                <Route path="form" element={<Form />} />
              </Route>
              <Route path="product" element={<Product />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="login" element={<Login />} />
              <Route path="notFound" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesContextProvider>
    </FakeAuthContextProvider>
  );
}

export default App;
/*
what is the fake authentication:
3 steps->
1- take email and password from user and check with api end points 
  if the password for the given user is correct
2- if the credentiala are correct -> we direct user for the main application & 
    save user object in our state
3- we need to protect our application from unauthorized access(users are n't login)       
*/
