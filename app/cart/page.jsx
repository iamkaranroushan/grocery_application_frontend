"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import Login from "@/components/custom/login";
import CartWithoutLogin from "@/components/cart/cartWithoutLogin";
import MainCart from "@/components/cart/mainCart";

const CartPage = () => {

  const token = useSelector((state) => state.auth.token);
  const [isLoginOpen, setIsLoginOpen] = useState(false);


  return (<>
    {isLoginOpen && <Login setIsLoginOpen={setIsLoginOpen} onClose={() => setIsLoginOpen(false)} />}
    <div className={`mt-16 ${isLoginOpen ? "blur-sm" : ""}`}>
      {!token ? (
        <CartWithoutLogin setIsLoginOpen={setIsLoginOpen} />
      ) : (
        <MainCart setIsLoginOpen={setIsLoginOpen} token={token} />
      )
      }
    </div>
  </>
  );
};

export default CartPage;
