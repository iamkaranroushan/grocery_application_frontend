"use client";

import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import PhoneNumberModal from "./numberAuthenticatonForm";
import OtpVerificationModal from "./otpVerificationform";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAuth } from "@/features/auth/authSlice";
import { Button } from "../ui/button";


const Login = ({ onClose }) => {
  const dispatch = useDispatch();
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [firebaseErrors, setFirebaseErrors] = useState("");
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL_LOCAL_AUTH || process.env.NEXT_PUBLIC_API_URL_NETWORK_AUTH;
  const [coolDown, setCoolDown] = useState(0);
  useEffect(() => {
    if (coolDown > 0) {
      const timer = setTimeout(() => setCoolDown(coolDown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [coolDown]);

  useEffect(() => {
    const recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible"
    })
    setRecaptchaVerifier(recaptchaVerifier);
    return () => {
      recaptchaVerifier.clear();
    }
  }, [auth]);

  const handleSendPhone = async (number) => {
    setLoading(true);
    try {

      const formattedPhoneNumber = number.startsWith("+91") ? number : `+91${number}`;
      setPhoneNumber(formattedPhoneNumber);
      console.log(auth, phoneNumber, recaptchaVerifier);

      const result = await signInWithPhoneNumber(auth, formattedPhoneNumber, recaptchaVerifier);
      console.log(result);
      setConfirmationResult(result);
      setIsOtpSent(true);
      setLoading(false)
      setIsOtpStep(true);

      console.log(confirmationResult)

    } catch (err) {
      setLoading(false)
      setCoolDown(0)
      if (err.code === 'auth/invalid-phone-number') {
        setFirebaseErrors("Invalid phone number. please check or try again.");
      } else if (err.code === 'auth/too-many-requests') {
        setFirebaseErrors("Too many otp requests from this number. please try again after some time.");
      } else {
        setFirebaseErrors("invalid credentials.");
      }
      console.log(err);
    }
  };


  const onVerify = async (otpCode) => {
    try {
      console.log(otpCode);
      const userCredential = await confirmationResult.confirm(otpCode);
      const idToken = await userCredential.user.getIdToken();
      const response = await axios.post(
        `${API_URL}/verify-otp`,
        { idToken },
        { withCredentials: true }
      );

      // ✅ Remove reCAPTCHA badge after login
      const badge = document.querySelector(".grecaptcha-badge");
      if (badge) badge.remove();

      setLoading(false);
      const data = response.data;

      if (data?.token) {
        dispatch(
          setAuth({
            token: data.token,
            user: data.user.username,
            id: data.user.id,
            phoneNumber: data.user.phoneNumber,
            role: data.user.role,
            cartId: data.user.cart.id,
            address: data.user.addresses[0] || null,
          })
        );

        onClose();
        router.refresh();
      }
    } catch (err) {
      if (err.code === "auth/invalid-verification-code") {
        setFirebaseErrors("Incorrect otp");
      }
    }
  };


  const handleBack = () => {
    setIsOtpStep(false);
  };

  return (
    <div className="flex-col fixed inset-0 flex p-6 rounded-t-xl z-50 overflow-y-auto">
      <div className="flex justify-end mb-4">
        <span onClick={onClose} className="text-sm text-stone-600 hover:underline">
          <RxCross1 className="text-xl" />
        </span>
      </div>
      {!isOtpStep || !confirmationResult ? (
        <PhoneNumberModal
          onSend={handleSendPhone}
          firebaseErrors={firebaseErrors}
          setFirebaseErrors={setFirebaseErrors}
          loading={loading}
          coolDown={coolDown}
          onClose={onClose}
          setIsOtpSent={setIsOtpSent}
          isOtpSent={isOtpSent}
        />
      ) : (
        <OtpVerificationModal
          phoneNumber={phoneNumber}
          onVerify={onVerify}
          isOtpSent={isOtpSent}
          setLoading={setLoading}
          firebaseErrors={firebaseErrors}
          setFirebaseErrors={setFirebaseErrors}
          loading={loading}
          onClose={onClose}
          onBack={handleBack}
        />
      )}

      <div className="z-[100]" id="recaptcha-container"></div>

    </div>
  );
};

export default Login;
