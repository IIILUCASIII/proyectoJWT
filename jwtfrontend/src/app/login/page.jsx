'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Error al iniciar sesión');
            }

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user)); 
            }

            setSuccess(true);
            
            setTimeout(() => {
                router.push('/'); 
            }, 1500);

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
            <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-md">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Iniciar Sesión
                </h2>
                
                {error && (
                    <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
                        ¡Inicio de sesión correcto! Redirigiendo...
                    </div>
                )}

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Ingresar
                        </button>
                    </div>
                </form>

                <div className="text-center text-sm text-gray-600">
                    ¿No tienes cuenta?{' '}
                    <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Regístrate aquí
                    </Link>
                </div>
            </div>
        </div>
    );
}
