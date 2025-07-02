"use client";
import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { FaRupeeSign } from "react-icons/fa";
import { LiaRupeeSignSolid } from "react-icons/lia";
import useCart from "@/hooks/useCart";
import CheckOutBottom from "@/components/checkout/checkoutBottom";
import AddressForm from "@/components/custom/addressForm";
import useCreateOrder from "@/hooks/useCreateOrder";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/custom/loadingSpinner";
import useDeleteCart from "@/hooks/useDeleteCart";
import toast from 'react-hot-toast';
import useSocket from "@/hooks/useSocket";
import useFetchAddressById from "@/hooks/useFetchAddressById";
import Image from "next/image";
import { ArrowDown, IndianRupee } from "lucide-react";
import { RxDropdownMenu } from "react-icons/rx";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp, MdOutlineKeyboardDoubleArrowUp } from "react-icons/md";

const CheckOutPage = () => {
  const socket = useSocket();
  const cartId = useSelector((state) => state.auth.cartId);
  const phoneNumber = useSelector((state) => state.auth.phoneNumber);
  const [routeLoading, setRouteLoading] = useState(false);
  const { addresses, fetchAddressesByUser, loading: addressLoading } = useFetchAddressById();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cartItems } = useCart();
  const isCartEmpty = cartItems.length == 0;
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [isAddressFormOpened, setIsAddressFormOpened] = useState(false);
  const { createOrder, loading } = useCreateOrder();
  const userId = useSelector((state) => state.auth?.id);
  const address = useSelector((state) => state.auth?.address || null);
  const { clearCartItems } = useDeleteCart();

  const itemTotal = useMemo(() => {
    return cartItems?.reduce((sum, product) => sum + product?.productVariant?.price * product?.quantity, 0) || "------";
  }, [cartItems]);

  useEffect(() => {
    setRouteLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => console.log("Socket connected:", socket.id));
    socket.on("newOrder", (data) => {
      toast.success("Order placed successfully!");
      setTimeout(() => routeChange("/orders"), 1500);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("orderConfirmed");
    };
  }, [socket]);

  const routeChange = (url) => {
    const currentUrl = pathname + searchParams.toString();
    if (url !== currentUrl) {
      setRouteLoading(true);
      router.push(url, { scroll: false });
    }
  };

  const handleOrder = async (paymentMethod) => {
    if (!address) return;
    const orderItems = cartItems.map(item => ({
      productId: item?.productVariant?.product?.id,
      variantId: item?.productVariant?.id,
      quantity: item?.quantity,
      priceAtPurchase: item?.productVariant?.price,
    }));

    const orderData = {
      userId,
      addressId: address.id,
      paymentMethod,
      isPaid: false,
      orderItems,
    };

    try {
      await createOrder(orderData);
      if (socket?.connected) {
        socket.emit("orderPlaced", { userId, orderItems, address, paymentMethod, timestamp: new Date() });
      }
      await clearCartItems(cartId);
      routeChange("/orders");
    } catch (err) {
      console.error("Order creation failed:", err);
    }
  };

  return (
    <>
      {isAddressFormOpened && (
        <AddressForm
          setIsAddressFormOpened={setIsAddressFormOpened}
          fetchAddressesByUser={fetchAddressesByUser}
          onClose={() => setIsAddressFormOpened(false)}
        />
      )}

      {routeLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
          <LoadingSpinner />
        </div>
      )}



      <div className={`mt-10 lg:mt-16 max-w-7xl lg:mx-auto lg:px-4 ${isAddressFormOpened ? "blur-sm" : ""}`}>

        <div className=" lg:hidden p-4 mt-14 border-b top-0 z-40">
          <div onClick={() => setShowOrderSummary(prev => !prev)} className="flex justify-between items-center">

            <div className="text-lg font-semibold text-stone-800">
              Summary
            </div>

            <div className="flex gap-2 items-center justify-center font-semibold text-gray-900">
              <div className="text-[16px] text-stone-800">
                ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
                <span className="text-black p-1">₹{itemTotal} </span>
              </div>

              <span >
                {showOrderSummary ? <MdOutlineKeyboardArrowUp className='icons' /> : <MdOutlineKeyboardArrowDown className="icons" />}
              </span>
            </div>
          </div>
        </div>


        
        <div className="flex flex-col-reverse  lg:grid lg:grid-cols-2 gap-6">
          {/* LEFT SECTION: Address + Payment */}
          <div className="lg:p-6 space-y-6">
            {/* Address Info */}
            <div className="bg-white px-4">
              <h2 className="lg:text-3xl text-lg font-semibold text-black mb-4 lg:mb-10">Delivery Address</h2>
              {address ? (
                <div className="lg:text-lg text-[16px] text-stone-700 lg:font-semibold leading-6">
                  <p>{address?.streetAddress}, {address?.landmark}</p>
                  <p>{address?.city}, {address?.state} - {address?.zipCode}</p>
                  <p className="my-2">{phoneNumber}</p>
                </div>
              ) : (
                <div className="">

                  <Button className="mt-4 w-full py-6" onClick={() => setIsAddressFormOpened(true)}>
                    {address ? "Edit Address" : "Add Address To Continue"}
                  </Button>
                </div>
              )}
            </div>

            {/* Payment + Place Order */}
            {address && <div className="bg-white px-3 lg:p-6">
              <h2 className="lg:text-3xl text-lg  font-semibold mb-4 lg:mb-10">Payment Method</h2>
              <CheckOutBottom  isCartEmpty={isCartEmpty} handleOrder={handleOrder} address={address} />
            </div>}
          </div>

          {/* RIGHT SECTION: Order Summary */}
          {/* RIGHT SECTION: Order Summary */}
          {/* Mobile Collapsible Order Summary */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden${showOrderSummary ? "max-h-[1000px]" : "max-h-0"} lg:max-h-full`}>
            <div className="bg-white p-4 sm:p-6 space-y-4 lg:mt-0">
              <h2 className="hidden lg:block text-3xl font-semibold mb-6 lg:mb-10">Order Summary</h2>

              {cartItems?.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {cartItems.map((product) => (
                    <div key={product.id} className="flex items-start gap-4 border-b pb-4">
                      <div className="relative min-w-[100px] w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                        <Image
                          src={product?.productVariant?.product?.imageUrl}
                          alt={product?.productVariant?.product?.name}
                          layout="fill"
                          objectFit="cover"
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm  font-semibold text-gray-800">
                          {product?.productVariant?.product?.name} ({product?.productVariant?.weight})
                        </h3>
                        <p className="text-xs lg:text-sm text-gray-500 line-clamp-2">
                          {product?.productVariant?.product?.description}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          {product?.quantity} x ₹{product?.productVariant?.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-lg lg:text-xl text-gray-500">No cart items</p>
              )}

              {/* Price Breakdown */}
              <div className="flex justify-between font-semibold text-sm lg:text-lg">
                <span className=" text-stone-700">Subtotal</span>
                <span className=" text-stone-700">₹{itemTotal}</span>
              </div>
              <div className="flex justify-between font-semibold text-sm lg:text-lg">
                <span className=" text-stone-700">Shipping Charges</span>
                <span className=" text-stone-700">-----</span>
              </div>
              <div className="flex justify-between font-semibold text-lg lg:text-xl border-t pt-4">
                <span className=" text-black">Total</span>
                <span className=" text-black">₹{itemTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckOutPage;
