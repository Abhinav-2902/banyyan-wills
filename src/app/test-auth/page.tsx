"use client";

import { useState } from "react";
import { testProtectedAction } from "@/server/actions/test-auth-action";

export default function TestAuthPage() {
  const [result, setResult] = useState<any>(null);

  const handleCheck = async () => {
    const res = await testProtectedAction();
    setResult(res);
  };

  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">Phase 2 Auth Verification</h1>
      <div className="space-y-4">
        <section className="p-4 border rounded bg-gray-50">
          <h2 className="font-semibold mb-2">Test 1: Middleware Protection</h2>
          <p className="mb-2 text-sm text-gray-600">
            Clicking the link below should redirect you to <code>/auth/login</code> because you are not logged in.
          </p>
          <a
            href="/dashboard"
            target="_blank"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Visit Protected Dashboard
          </a>
        </section>

        <section className="p-4 border rounded bg-gray-50">
          <h2 className="font-semibold mb-2">Test 2: Server Action Protection</h2>
          <p className="mb-2 text-sm text-gray-600">
            Clicking the button will attempt to call a protected server action.
            Since you are not logged in, it should fail.
          </p>
          <button
            onClick={handleCheck}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Call requireAuth()
          </button>
          {result && (
            <div className="mt-4 p-4 bg-white border rounded shadow-sm">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
