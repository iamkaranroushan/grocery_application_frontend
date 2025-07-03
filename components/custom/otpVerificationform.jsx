"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { IoClose } from "react-icons/io5";
import { MdArrowBackIosNew } from "react-icons/md";
import useSendOtp from "@/hooks/useSendOtp";

const OtpVerificationModal = ({ onClose, phoneNumber, onVerify, onBack, isOtpSent,  firebaseErrors, setFirebaseErrors }) => {
    const [otpTimer, setOtpTimer] = useState(300); // 5 minutes = 300 seconds
    const [resendCooldown, setResendCooldown] = useState(0);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [resendError, setResendError] = useState(null);
    const inputRefs = useRef([]);
    // const { sendOtp, loading, error } = useSendOtp();

    useEffect(() => {
        if (otpTimer <= 0) return;
        const interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [otpTimer]);

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const cooldownInterval = setInterval(() => setResendCooldown((prev) => prev - 1), 1000);
        return () => clearInterval(cooldownInterval);
    }, [resendCooldown]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index, value) => {
        setFirebaseErrors(false);
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = () => {
        const code = otp.join("");
        if (code.length === 6 && otpTimer > 0) {
            onVerify?.(code);
        }
    };


    const maskedPhone = phoneNumber?.slice(-4);

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center">
            <div className="bg-white rounded-xl w-[90%] max-w-sm p-6 relative">
                {/* Close */}
                <div className="flex justify-between items-center mb-4">
                    <div className="cursor-pointer" onClick={onBack}><MdArrowBackIosNew /></div>
                    <div className="cursor-pointer" onClick={onClose}>
                        <IoClose size={20} />
                    </div>
                </div>

                {/* Headings */}
                <h2 className="text-xl font-semibold mb-2">Enter the verification code</h2>
                <p className="text-sm text-muted-foreground mb-6">
                    A <span className="font-medium">6-digit</span> code was sent to{" "}
                    <span className="font-semibold">xxx-xxx-{maskedPhone}</span>
                </p>

                {/* OTP Inputs */}
                <div className="flex justify-between mb-6">
                    {otp.map((digit, i) => (
                        <input
                            key={i}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                            ref={(el) => (inputRefs.current[i] = el)}
                            className="w-10 h-12 text-center border border-gray-300 rounded-lg text-lg focus:outline-none focus:border-black"
                        />
                    ))}
                </div>

                {firebaseErrors && (
                    <p className=" text-center text-red-500 text-xs my-4 px-1">{firebaseErrors}</p>
                )}
                {resendError && (
                    <p className=" text-center text-xs text-red-500 my-4 px-1">{resendError}</p>
                )}

                {/* Verify Button */}
                <Button
                    onClick={handleSubmit}
                    className="w-full p-6"
                    disabled={otp.join("").length !== 6 || otpTimer <= 0}
                >
                    Verify
                </Button>

                {/* Timer / Expired Notice */}


                {/* Resend Code */}
                <div className="text-center mt-3">
                    {resendCooldown > 0 ? (
                        <p className="text-sm text-muted-foreground">
                            Resend available in {resendCooldown}s
                        </p>
                    ) : (

                        <Button
                            className="active:bg-white cursor-pointer bg-white shadow-none text-stone-600 hover:text-black hover:underline"
                        >
                            Resend code
                        </Button>
                    )}

                </div>
            </div>
        </div>
    );
};

export default OtpVerificationModal;
