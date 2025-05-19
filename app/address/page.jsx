"use client";
import AddressForm from "@/components/custom/addressForm";
import { Button } from "@/components/ui/button";
import useFetchAddressById from "@/hooks/useFetchAddressById";
import { FiEdit } from "react-icons/fi";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Address = () => {
  const userId = useSelector((state) => state.auth.id);
  const [isAddressFormOpened, setIsAddressFormOpened] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);  // <-- for edit

  const { addresses, fetchAddressesByUser, loading, error } = useFetchAddressById();

  // Open form for creating new address
  const handleCreateAddressClicked = () => {
    setSelectedAddress(null);  // clear previous selection for create
    setIsAddressFormOpened(true);
  };

  // Open form for editing existing address
  const handleEditClicked = (address) => {
    setSelectedAddress(address);
    setIsAddressFormOpened(true);
  };

  useEffect(() => {
    if (userId) fetchAddressesByUser(userId);
  }, [userId]);

  if (loading) return <div>Loading addresses...</div>;
  if (error) return <div>Error: {error}</div>;

  const addressList = Array.isArray(addresses) ? addresses : addresses ? [addresses] : [];

  return (
    <>
      {isAddressFormOpened && (
        <AddressForm
          existingAddress={selectedAddress}
          fetchAddressesByUser={fetchAddressesByUser}
          onClose={() => setIsAddressFormOpened(false)}
        />
      )}
      <div className="py-4 max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Your Addresses</h2>
        <div className="py-4">
          <Button size="order" className="w-full" onClick={handleCreateAddressClicked}>
            Create Address
          </Button>
        </div>
        {!addresses || addresses.length === 0 && <div>No addresses found.</div>}
        {addressList.map((addr) => (
          <div
            key={addr.id}
            className="relative mb-4 p-4 border rounded shadow-sm bg-white"
          >
            <div className="p-3 rounded-lg flex items-center justify-between space-x-10">
              <span>
                {addr?.streetAddress || "Street Address"},{" "}
                {addr?.landmark || "Landmark"},{" "}
                {addr?.city || "City"},{" "}
                {addr?.state || "State"},{" "}
                {addr?.postalCode || addr?.pinCode || addr?.zipCode || "Postal Code"}
              </span>
              <span onClick={() => handleEditClicked(addr)} className="cursor-pointer">
                <FiEdit className="icons" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Address;
