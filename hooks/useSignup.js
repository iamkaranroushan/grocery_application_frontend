import { useDispatch } from "react-redux";
import { setAuth } from "@/features/auth/authSlice";
import { useState } from "react";
import axios from "axios";

const useSignup = () => {
    const API_URL =
        process.env.NEXT_PUBLIC_API_URL_NETWORK ||
        process.env.NEXT_PUBLIC_API_URL_LOCAL;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    const signup = async (name, email, password) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                API_URL,
                {
                    query: `
                        mutation {
                            createUser(username: "${name}", email: "${email}", password: "${password}") {
                                token
                                user {
                                id
                                username
                                email
                                role
                                addresses{
                                    id
                                    streetAddress
                                    landmark
                                    state
                                    city
                                    zipCode
                                    phoneNumber
                                }
                                cart{
                                    id
                                }
                                }
                                error
                            }
                        }
                    `,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            const data = response.data.data.createUser;
            console.log(data.token)
            console.log(data.user.username)
            console.log(data.user.id)
            console.log(data.user.role)
            console.log(data.user.email)
            console.log(data.user.cart.id)
            if (data?.error) {
                setError(data.error);
                return { error: data.error };
            }
            dispatch(
                setAuth({
                    token: data.token,
                    user: data.user.username,
                    id: data.user.id,
                    role: data.user.role,
                    email: data.user.email,
                    cartId: data.user.cart.id,
                    address: data.user.addresses[0] || null,
                })
            );

            return data;
        } catch (err) {
            console.error("Signup failed:", err.message);
            setError(err.message);
            return { error: err.message };
        } finally {
            setLoading(false);
        }
    };

    return { signup, loading, error };
};

export default useSignup;
