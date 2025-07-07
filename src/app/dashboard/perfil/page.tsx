"use client";

import { useUser } from "@/context/UserContext";
import { User, Mail, Calendar, Shield } from "lucide-react";
import Image from "next/image";

function PerfilPage() {
    const { userInfo } = useUser();

    if (!userInfo) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="loading loading-spinner text-primary"></div>
            </div>
        );
    }

    const lastLoginDate = new Date(userInfo.lastLoginAt).toLocaleDateString();
    const lastLoginTime = new Date(userInfo.lastLoginAt).toLocaleTimeString();

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                    <User className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold">Perfil de Usuario</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tarjeta de perfil */}
                <div className="md:col-span-1">
                    <div className="card bg-base-100 shadow border border-base-300">
                        <div className="card-body items-center text-center">
                            <div className="avatar placeholder">
                                <div className="bg-neutral text-neutral-content rounded-full w-24 h-24 flex justify-center items-center text-3xl">
                                    {userInfo.avatar_url ? (
                                        <Image
                                            src={userInfo.avatar_url}
                                            alt={`${userInfo.nombre}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="flex items-center justify-center w-full h-full">
                                            {userInfo.nombre.charAt(0)}{userInfo.apellido.charAt(0)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <h2 className="card-title mt-4">{userInfo.nombre} {userInfo.apellido}</h2>
                            <p className="text-base-content/70">{userInfo.email}</p>

                            <div className="flex items-center gap-1 mt-2">
                                <Shield size={16} className={userInfo.es_admin ? "text-success" : "text-base-content/50"} />
                                <span className={userInfo.es_admin ? "text-success font-medium" : "text-base-content/50"}>
                                    {userInfo.es_admin ? "Administrador" : "Usuario estándar"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow border border-base-300 mt-4">
                        <div className="card-body">
                            <h3 className="card-title text-sm font-medium flex items-center gap-2">
                                <Calendar size={16} />
                                Información de acceso
                            </h3>
                            <div className="py-2">
                                <p className="text-sm text-base-content/70">Último acceso:</p>
                                <p className="font-medium">{lastLoginDate} a las {lastLoginTime}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Información detallada */}
                <div className="md:col-span-2">
                    <div className="card bg-base-100 shadow border border-base-300">
                        <div className="card-body">
                            <h2 className="card-title">Información personal</h2>

                            <div className="divider my-2"></div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-base-content/70">Nombre</label>
                                    <p className="font-medium">{userInfo.nombre}</p>
                                </div>

                                <div>
                                    <label className="text-sm text-base-content/70">Apellido</label>
                                    <p className="font-medium">{userInfo.apellido}</p>
                                </div>

                                <div>
                                    <label className="text-sm text-base-content/70">Email</label>
                                    <div className="flex items-center gap-2">
                                        <Mail size={16} className="text-base-content/50" />
                                        <p className="font-medium">{userInfo.email}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm text-base-content/70">ID de usuario</label>
                                    <p className="font-medium text-xs bg-base-200 p-2 rounded mt-1 overflow-auto">
                                        {userInfo.id}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow border border-base-300 mt-4">
                        <div className="card-body">
                            <h3 className="card-title">Permisos y acceso</h3>

                            <div className="overflow-x-auto mt-2">
                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th>Permiso</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Acceso al dashboard</td>
                                            <td><span className="badge badge-success">Concedido</span></td>
                                        </tr>
                                        <tr>
                                            <td>Gestión de autos</td>
                                            <td><span className="badge badge-success">Concedido</span></td>
                                        </tr>
                                        <tr>
                                            <td>Administrar usuarios</td>
                                            <td>
                                                {userInfo.es_admin ? (
                                                    <span className="badge badge-success">Concedido</span>
                                                ) : (
                                                    <span className="badge badge-error">Denegado</span>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Configuración del sistema</td>
                                            <td>
                                                {userInfo.es_admin ? (
                                                    <span className="badge badge-success">Concedido</span>
                                                ) : (
                                                    <span className="badge badge-error">Denegado</span>
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PerfilPage;