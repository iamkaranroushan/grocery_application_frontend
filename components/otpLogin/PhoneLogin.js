'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export default function PhoneLogin() {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmResult, setConfirmResult] = useState(null);

    const sendOtp = async () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible',
            });
        }

        try {
            const confirmation = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
            setConfirmResult(confirmation);
            alert('OTP sent!');
        } catch (err) {
            console.error(err);
            alert('Failed to send OTP');
        }
    };

    const verifyOtp = async () => {
        try {
            const result = await confirmResult.confirm(otp);
            const user = result.user;
            alert(`Phone authenticated: ${user.phoneNumber}`);
        } catch (err) {
            console.error(err);
            alert('Invalid OTP');
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91XXXXXXXXXX"
                className="p-2 border rounded"
            />
            <button onClick={sendOtp} className="p-2 bg-blue-500 text-white rounded">
                Send OTP
            </button>

            {confirmResult && (
                <>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className="p-2 border rounded"
                    />
                    <button onClick={verifyOtp} className="p-2 bg-green-500 text-white rounded">
                        Verify OTP
                    </button>
                </>
            )}

            <div id="recaptcha-container"></div>
        </div>
    );
}
