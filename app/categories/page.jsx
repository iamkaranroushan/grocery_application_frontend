"use client";

import Categories from "@/components/categoryPage/categories";
import Layout from "@/components/custom/layout";
import { Provider } from "react-redux";
import { store, persistor } from "@/features/auth/authStore";
import { PersistGate } from "redux-persist/integration/react";
const Category = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Layout>
          <Categories />
        </Layout>
      </PersistGate>
    </Provider>
  );
};

export default Category;
