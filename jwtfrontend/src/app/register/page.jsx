"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      // Conectado exactamente a tu ruta: /api/register
      const response = await fetch('http://localhost:5000/api/register', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Si tu Flask devuelve error, leemos tu propiedad 'msg'
        setError(data.msg || 'Ocurrió un error al registrarse');
      } else {
        // Captura el "Register terminado" de tu backend
        setSuccess(data.msg || '¡Usuario registrado con éxito!');
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor backend.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-4">
      <main className="w-full max-w-[440px] rounded-2xl bg-white px-10 py-12 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        
        <div className="mb-6 text-center">
          <h1 className="text-[26px] font-bold tracking-tight text-neutral-900">
            Crear cuenta
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            Ingresa tus datos para registrarte
          </p>
        </div>

        {error && <div className="mb-4 text-xs font-semibold text-red-500 text-center bg-red-50 p-2 rounded-lg">{error}</div>}
        {success && <div className="mb-4 text-xs font-semibold text-green-500 text-center bg-green-50 p-2 rounded-lg">{success}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-neutral-700 mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Juan Pérez"
              required
              className="w-full h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 placeholder-neutral-300 focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-neutral-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
              className="w-full h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 placeholder-neutral-300 focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-neutral-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 placeholder-neutral-300 focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-semibold text-neutral-700 mb-1">
              Confirmar contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 placeholder-neutral-300 focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="flex w-full h-10 items-center justify-center rounded-lg bg-[#1a1a1a] text-xs font-semibold text-white hover:bg-neutral-800 transition-colors"
            >
              Registrarse
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-xs text-neutral-400">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="font-semibold text-neutral-800 hover:underline">
            Iniciar sesión
          </Link>
        </div>

      </main>
    </div>
  );
}