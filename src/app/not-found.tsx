import Link from "next/link";
function NotFoundPage() {
    return ( 
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
            <h1 className="text-6xl font-bold">404</h1>
            <p className="mt-4 text-lg">Page Not Found</p>
            <Link href="/dashboard" className="mt-6 text-blue-500 hover:underline">Volver al Dashboard</Link>
        </div>
     );
}

export default NotFoundPage;