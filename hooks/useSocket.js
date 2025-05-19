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
                "http://192.168.1.3:8000" ||
                "http://localhost:8000" ||
                "https://grocery-application-backend-1.onrender.com";
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
