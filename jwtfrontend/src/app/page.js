'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../component/Navbar'; 

export default function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [privateMessage, setPrivateMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (!token) {
            router.push('/login');
            return;
        }

        if (storedUser) {
            setUserData(JSON.parse(storedUser));
        }

        const fetchPrivateData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/private', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setPrivateMessage(data.datos_secretos);
                } else {
                    handleLogout();
                }
            } catch (error) {
                console.error("Error conectando con la ruta privada:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrivateData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50">
                <div className="text-center">
                    <p className="text-zinc-600 font-sans font-medium">Verificando credenciales...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar /> 
            
            <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans min-h-[80vh]">
                <main className="flex flex-col w-full max-w-3xl items-center justify-between py-16 px-16 bg-white shadow-sm rounded-xl border border-zinc-200">
                    
                    {userData && (
                        <h1 className="text-3xl font-bold text-zinc-800 mb-2">
                            ¡Hola de nuevo, {userData.name || 'Usuario'}! 👋
                        </h1>
                    )}
                    
                    <p className="text-green-600 font-medium mb-6">
                        🔒 Accediste correctamente a la Zona Privada protegida por JWT.
                    </p>

                    <div className="w-full bg-zinc-50 p-4 rounded-lg border border-zinc-200 mb-6">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                            Dato secreto del Backend (Flask):
                        </span>
                        <p className="text-zinc-700 italic mb-0">
                            "{privateMessage || 'Cargando mensaje ultra secreto...'}"
                        </p>
                    </div>

                    {/* --- BOTÓN DE LOGOUT DIRECTO EN LA TARJETA --- */}
                    <button
                        onClick={handleLogout}
                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg shadow-sm transition-colors duration-200"
                    >
                        Cerrar Sesión (Logout)
                    </button>

                </main>
            </div>
        </>
    );
}