import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from "firebase/firestore";
import { useHistory } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';
import './AdminPage.css';

const AdminPage = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    useEffect(() => {
        const checkAdmin = async () => {
            const user = auth.currentUser;
            if (!user) {
                history.push('/login');
                return;
            }
            // Only fetch the current user's document
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists() && userDoc.data().role === "admin") {
                setIsAdmin(true);
            } else {
                history.push('/home');
            }
            setLoading(false);
        };
        checkAdmin();
    }, [history]);

    if (loading) return <div>Loading...</div>;
    if (!isAdmin) return null;

    return <AdminDashboard />;
};

export default AdminPage;

