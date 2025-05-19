"use client";
import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { FaRupeeSign } from "react-icons/fa";
import { LiaRupeeSignSolid } from "react-icons/lia";
import useCart from "@/hooks/useCart";
import { FiEdit } from "react-icons/fi";
import CheckOutBottom from "@/components/checkout/checkoutBottom";
import AddressForm from "@/components/custom/addressForm";
import useCreateOrder from "@/hooks/useCreateOrder";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/custom/loadingSpinner";
import useDeleteCart from "@/hooks/useDeleteCart";
import toast from 'react-hot-toast';
import useSocket from "@/hooks/useSocket";

const CheckOutPage = () => {
  const socket = useSocket();
  const cartId = useSelector((state) => state.auth.cartId);

  const [routeLoading, setRouteLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const routeChange = (url) => {
    const currentUrl = window.location.pathname + window.location.search;
    if (url !== currentUrl) {
      setRouteLoading(true);
      console.log(url);
      router.push(url, { scroll: false });
    }
  };
  useEffect(() => {
    setRouteLoading(false); // Cleanup timer when the effect re-runs
  }, [pathname, searchParams]);

  const { cartItems } = useCart();
  const [isAddressFormOpened, setIsAddressFormOpened] = useState(false);
  const { createOrder, loading, error, success } = useCreateOrder();
  const userId = useSelector((state) => state.auth?.id);
  const role = useSelector((state) => state.auth?.role);
  const address = useSelector((state) => state.auth?.address || null);
  const { clearCartItems } = useDeleteCart();
  const itemTotal = useMemo(() => {
    return cartItems?.reduce((sum, product) => {
      return sum + product?.productVariant?.price * product?.quantity;
    }, 0) || 0;
  }, [cartItems]);


  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("Socket connected with id:", socket.id);
      });

      socket.on("newOrder", (data) => {
        console.log(data.message);
        toast.success("Order placed successfully!");
        setTimeout(() => {
          routeChange("/orders");
        }, 1500);

        // You can update UI or redirect if needed
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      // Cleanup on unmount
      return () => {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("orderConfirmed");

      };
    }
  }, [socket]);


  const handleOrder = async (paymentMethod) => {


    if (address) {
      const orderItems = cartItems.map((item) => ({
        productId: item?.productVariant?.product?.id,
        variantId: item?.productVariant?.id,
        quantity: item?.quantity,
        priceAtPurchase: item?.productVariant?.price,
      }));

      try {
        const orderData = {
          userId: userId, // You can get the userId from Redux or another source
          addressId: address.id, // Assuming `address.id` is available
          paymentMethod: paymentMethod, // You can change this based on the actual method
          isPaid: false, // Adjust this based on your actual payment flow
          orderItems,
        };

        await createOrder(orderData);  // Call createOrder with the required data
        if (socket && socket.connected) {
          socket.emit("orderPlaced", {
            userId,
            orderItems,
            address,
            paymentMethod,
            timestamp: new Date(),
          });
        }
        console.log("Order successfully placed!");
        await clearCartItems(cartId);
        routeChange("/orders");

      } catch (err) {
        console.error("Order creation failed:", err);
      }
    } else {
      console.log("Please update the address.");
    }
  };



  const handleAddress = () => {
    console.log("address form opened")
    setIsAddressFormOpened(true);
  }

  return (<>
    {isAddressFormOpened && <AddressForm setIsAddressFormOpened={setIsAddressFormOpened} onClose={() => setIsAddressFormOpened(false)} />}
    {routeLoading &&
      <div className="fixed inset-0 w-screen flex items-center justify-center  bg-white bg-opacity-60 ">
        <LoadingSpinner />
      </div>
    }
    <div className={`mt-16 flex flex-col gap-4 ${isAddressFormOpened ? "blur-sm" : ""}`}>
      {/* Address */}
      {
        address &&
        <div>
          <h2 className="font-semibold">Address details</h2>
          <div className="p-3 rounded-lg flex items-center justify-between space-x-10">
            <span>
              {address?.streetAddress || "Street Address"},
              {address?.landmark || "Landmark"},
              {address?.city || "City"},
              {address?.state || "State"},
              {address?.zipCode || "Postal Code"}
            </span>
            
          </div>
        </div>
      }

      {/* Item details */}
      <div>
        <h2 className="font-bold">Purchased item details</h2>
        <div className="p-3">
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((product) => (

              <div key={product.id} className="flex justify-between items-end">
                <div className="flex gap-2 items-center justify-center">
                  <span className="flex justify-between items-end">
                    <p className="text-sm">{product?.quantity}</p>
                  </span>
                  <span className="flex justify-between items-end">
                    <p className="text-sm">x</p>
                  </span>
                  <span className="flex justify-between items-end">
                    <p className="text-sm">{product?.productVariant?.product?.name}</p>
                  </span>
                  <span className="flex  justify-between items-end">
                    <p className="text-sm">({product?.productVariant?.weight})</p>
                  </span>
                </div>
                <span className="flex items-center">
                  <LiaRupeeSignSolid className="text-sm" />
                  <p className="text-sm">
                    {product?.productVariant?.price * product?.quantity}
                  </p>
                </span>
              </div>
            ))
          ) : (
            <p>No cart items</p>
          )}
        </div>
      </div>

      {/* Bill details */}
      <div>
        <h2 className="font-bold">Bill details</h2>
        <div className="flex flex-col bg-sky-100/30 rounded-lg justify-center p-3 gap-2">
          <span className="flex justify-between">
            <p className="text-sm text-stone-600">Items total</p>
            <span className="flex justify-center items-center">
              <LiaRupeeSignSolid className="text-xs" />
              <p className="text-xs">{itemTotal}</p>
            </span>
          </span>
          <span className="flex justify-between">
            <p className="text-sm text-stone-600">Delivery charges</p>
            <span className="flex justify-center items-center">
              <LiaRupeeSignSolid className="text-xs" />
              <p className="text-xs">{0}</p>
            </span>
          </span>
          <hr />
          <span className="flex justify-between">
            <p className="font-bold text-md text-stone-800">Subtotal</p>
            <span className="flex gap-1 justify-center items-center">
              <FaRupeeSign className="text-sm" />
              <p className="font-bold text-md">{itemTotal}</p>
            </span>
          </span>
        </div>
      </div>

      {/*checkout bottom*/}
      {address ?
        (
          <div className="bottom-0">
            <CheckOutBottom handleOrder={handleOrder} address={address} />
          </div>
        ) : (
          <div>
            <div className="flex flex-col gap-2 py-3">
              <Button onClick={handleAddress} variant="address" size="address">Update Address to continue</Button>
            </div>

          </div>
        )
      }

    </div>
  </>);
};

export default CheckOutPage;
