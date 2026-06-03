'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm">
            <div className="container-fluid">
                {}
                <Link className="navbar-brand font-bold" href="/">
                    JWT App
                </Link>

                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav align-items-center">
                        {user ? (
                            <>
                                {}
                                <li className="nav-item">
                                    <span className="nav-link text-dark font-medium me-3">
                                        👤 {user.name || user.email}
                                    </span>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        onClick={handleLogout} 
                                        className="nav-link btn btn-link text-danger field-label"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                {}
                                <li className="nav-item">
                                    <Link className="nav-link" href="/login">
                                        Login
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link btn btn-primary text-white px-3 ms-2" href="/register">
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}