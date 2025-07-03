import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";



const useSocket = () => {
    const token = useSelector((state) => state.auth.token);
    const userId = useSelector((state) => state.auth.id);
    const role = useSelector((state) => state.auth.role);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (token) {

            const socketUrl =

                process.env.NEXT_PUBLIC_API_URL_LOCAL_SOCKET ||
                process.env.NEXT_PUBLIC_API_URL_NETWORK_SOCKET ||
                process.env.NEXT_PUBLIC_SOCKET_URL
            const newSocket = io(socketUrl, {
                auth: {
                    token: token,
                },
            });

            newSocket.emit("join", {
                role,
                userId,
            });
            setSocket(newSocket);
            // Disconnect the socket when component unmounts
        }
    }, [token]);

    return socket;
};

export default useSocket;
