'use client';

export default function DisabledTestPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test Page Temporarily Disabled</h1>
      <p>
        This test page has been temporarily disabled to allow for production builds.
        It can be re-enabled after deployment by restoring the original test page code.
      </p>
    </div>
  );
}
