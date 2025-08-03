export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          College Academic Resource Sharing Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Backend Server Running Successfully
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
          <h2 className="text-lg font-semibold mb-4">API Endpoints Available:</h2>
          <ul className="text-left space-y-2 text-sm text-gray-700">
            <li>• <code>/api/auth/verify-admin</code></li>
            <li>• <code>/api/admin/create-user</code></li>
            <li>• <code>/api/announcements</code></li>
            <li>• <code>/api/notes</code></li>
            <li>• <code>/api/pyqs</code></li>
            <li>• <code>/api/timetables</code></li>
            <li>• <code>/api/upload</code></li>
          </ul>
        </div>
      </div>
    </div>
  )
}