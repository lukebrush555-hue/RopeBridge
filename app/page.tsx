// app/page.tsx - Landing Page for RopeBridge
'use client';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4">
            RopeBridge
          </h1>
          <p className="text-xl text-blue-200 mb-8">
            Monetize Your AI Prompts. Keep Them Secret. 🚀
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/dashboard"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              Creator Dashboard
            </a>
            <a
              href="#prompts"
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
            >
              Browse Prompts
            </a>
            <button
              onClick={() => alert('It worked! 🎉 Claude can deploy to production!')}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
            >
              Test Button
            </button>
          </div>
        </div>

        <div id="prompts" className="grid md:grid-cols-3 gap-8 mt-16">
          {/* Example Prompt Cards */}
          <a
            href="/monstermaker"
            className="bg-white/10 backdrop-blur-lg rounded-lg p-6 hover:bg-white/20 transition"
          >
            <h3 className="text-2xl font-bold text-white mb-2">MonsterMaker</h3>
            <p className="text-blue-200 mb-4">Generate unique creature designs</p>
            <span className="text-green-400 font-semibold">$0.10 per use</span>
          </a>

          <a
            href="/afp"
            className="bg-white/10 backdrop-blur-lg rounded-lg p-6 hover:bg-white/20 transition"
          >
            <h3 className="text-2xl font-bold text-white mb-2">AFP</h3>
            <p className="text-blue-200 mb-4">Analyze-Filter-Package research intelligence</p>
            <span className="text-green-400 font-semibold">$0.25 per use</span>
          </a>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <h3 className="text-2xl font-bold text-white mb-2">More Coming Soon</h3>
            <p className="text-blue-200">Discover new AI-powered tools</p>
          </div>
        </div>
      </div>
    </div>
  );
}
