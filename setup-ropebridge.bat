@echo off
REM ============================================
REM RopeBridge Setup Script
REM Run this from C:\CLAUDE\monstermaker-dashboard
REM ============================================

echo Setting up RopeBridge folder structure...

REM Create dashboard folder
mkdir app\dashboard 2>nul

REM Create dynamic route folder
mkdir "app\[promptSlug]" 2>nul

echo.
echo Creating landing page (app\page.tsx)...
(
echo // app/page.tsx - Landing Page for RopeBridge
echo export default function LandingPage(^) {
echo   return (
echo     ^<div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"^>
echo       ^<div className="container mx-auto px-4 py-16"^>
echo         ^<div className="text-center mb-16"^>
echo           ^<h1 className="text-6xl font-bold text-white mb-4"^>
echo             RopeBridge
echo           ^</h1^>
echo           ^<p className="text-xl text-blue-200 mb-8"^>
echo             Monetize Your AI Prompts. Keep Them Secret.
echo           ^</p^>
echo           ^<div className="flex gap-4 justify-center"^>
echo             ^<a
echo               href="/dashboard"
echo               className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
echo             ^>
echo               Creator Dashboard
echo             ^</a^>
echo             ^<a
echo               href="#prompts"
echo               className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
echo             ^>
echo               Browse Prompts
echo             ^</a^>
echo           ^</div^>
echo         ^</div^>
echo.
echo         ^<div id="prompts" className="grid md:grid-cols-3 gap-8 mt-16"^>
echo           {/* Example Prompt Cards */}
echo           ^<a
echo             href="/monstermaker"
echo             className="bg-white/10 backdrop-blur-lg rounded-lg p-6 hover:bg-white/20 transition"
echo           ^>
echo             ^<h3 className="text-2xl font-bold text-white mb-2"^>MonsterMaker^</h3^>
echo             ^<p className="text-blue-200 mb-4"^>Generate unique creature designs^</p^>
echo             ^<span className="text-green-400 font-semibold"^>$0.10 per use^</span^>
echo           ^</a^>
echo.
echo           ^<a
echo             href="/afp"
echo             className="bg-white/10 backdrop-blur-lg rounded-lg p-6 hover:bg-white/20 transition"
echo           ^>
echo             ^<h3 className="text-2xl font-bold text-white mb-2"^>AFP^</h3^>
echo             ^<p className="text-blue-200 mb-4"^>Analyze-Filter-Package research intelligence^</p^>
echo             ^<span className="text-green-400 font-semibold"^>$0.25 per use^</span^>
echo           ^</a^>
echo.
echo           ^<div className="bg-white/10 backdrop-blur-lg rounded-lg p-6"^>
echo             ^<h3 className="text-2xl font-bold text-white mb-2"^>More Coming Soon^</h3^>
echo             ^<p className="text-blue-200"^>Discover new AI-powered tools^</p^>
echo           ^</div^>
echo         ^</div^>
echo       ^</div^>
echo     ^</div^>
echo   ^);
echo }
) > app\page.tsx

echo.
echo Creating dashboard page (app\dashboard\page.tsx^)...
(
echo // app/dashboard/page.tsx - Creator Dashboard
echo 'use client';
echo.
echo import { useState, useEffect } from 'react';
echo import { supabase } from '@/lib/supabase';
echo.
echo export default function Dashboard(^) {
echo   const [prompts, setPrompts] = useState^<any[]^>([]^);
echo   const [loading, setLoading] = useState(true^);
echo.
echo   useEffect(^(^) =^> {
echo     fetchPrompts(^);
echo   }, []^);
echo.
echo   const fetchPrompts = async (^) =^> {
echo     const { data, error } = await supabase
echo       .from('prompts'^)
echo       .select('*'^)
echo       .order('created_at', { ascending: false }^);
echo.
echo     if (data^) setPrompts(data^);
echo     setLoading(false^);
echo   };
echo.
echo   return (
echo     ^<div className="min-h-screen bg-gray-50"^>
echo       ^<div className="container mx-auto px-4 py-8"^>
echo         ^<div className="flex justify-between items-center mb-8"^>
echo           ^<h1 className="text-4xl font-bold"^>Creator Dashboard^</h1^>
echo           ^<button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"^>
echo             + New Prompt
echo           ^</button^>
echo         ^</div^>
echo.
echo         {loading ? (
echo           ^<p^>Loading your prompts...^</p^>
echo         ^) : prompts.length === 0 ? (
echo           ^<div className="text-center py-16"^>
echo             ^<h2 className="text-2xl font-semibold text-gray-600 mb-4"^>
echo               No prompts yet
echo             ^</h2^>
echo             ^<p className="text-gray-500"^>Create your first prompt to get started!^</p^>
echo           ^</div^>
echo         ^) : (
echo           ^<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"^>
echo             {prompts.map(^(prompt^) =^> (
echo               ^<div key={prompt.id} className="bg-white rounded-lg shadow p-6"^>
echo                 ^<h3 className="text-xl font-bold mb-2"^>{prompt.name}^</h3^>
echo                 ^<p className="text-gray-600 mb-4"^>{prompt.description}^</p^>
echo                 ^<div className="flex justify-between items-center"^>
echo                   ^<span className="text-green-600 font-semibold"^>
echo                     ${prompt.price_per_use}
echo                   ^</span^>
echo                   ^<span className={`px-3 py-1 rounded-full text-sm ${
echo                     prompt.status === 'published' 
echo                       ? 'bg-green-100 text-green-800' 
echo                       : 'bg-gray-100 text-gray-800'
echo                   }`}^>
echo                     {prompt.status}
echo                   ^</span^>
echo                 ^</div^>
echo                 ^<div className="mt-4 pt-4 border-t border-gray-200"^>
echo                   ^<p className="text-sm text-gray-500"^>
echo                     {prompt.total_uses} uses · ${prompt.total_revenue} revenue
echo                   ^</p^>
echo                 ^</div^>
echo               ^</div^>
echo             ^)^)}
echo           ^</div^>
echo         ^)}
echo       ^</div^>
echo     ^</div^>
echo   ^);
echo }
) > app\dashboard\page.tsx

echo.
echo Creating dynamic prompt page (app\[promptSlug]\page.tsx^)...
(
echo // app/[promptSlug]/page.tsx - Dynamic End-User Prompt Pages
echo 'use client';
echo.
echo import { useState, useEffect } from 'react';
echo import { supabase } from '@/lib/supabase';
echo.
echo export default function PromptPage(^{ params }: { params: { promptSlug: string } }^) {
echo   const [prompt, setPrompt] = useState^<any^>(null^);
echo   const [loading, setLoading] = useState(true^);
echo.
echo   useEffect(^(^) =^> {
echo     fetchPrompt(^);
echo   }, [params.promptSlug]^);
echo.
echo   const fetchPrompt = async (^) =^> {
echo     const { data, error } = await supabase
echo       .from('prompts'^)
echo       .select('*'^)
echo       .eq('slug', params.promptSlug^)
echo       .eq('status', 'published'^)
echo       .single(^);
echo.
echo     if (data^) setPrompt(data^);
echo     setLoading(false^);
echo   };
echo.
echo   if (loading^) {
echo     return ^<div className="min-h-screen flex items-center justify-center"^>Loading...^</div^>;
echo   }
echo.
echo   if (!prompt^) {
echo     return (
echo       ^<div className="min-h-screen flex items-center justify-center"^>
echo         ^<div className="text-center"^>
echo           ^<h1 className="text-4xl font-bold mb-4"^>Prompt Not Found^</h1^>
echo           ^<a href="/" className="text-blue-600 hover:underline"^>
echo             Back to Home
echo           ^</a^>
echo         ^</div^>
echo       ^</div^>
echo     ^);
echo   }
echo.
echo   return (
echo     ^<div className="min-h-screen bg-gray-50"^>
echo       ^<div className="container mx-auto px-4 py-16 max-w-4xl"^>
echo         ^<div className="bg-white rounded-xl shadow-lg p-8"^>
echo           ^<h1 className="text-4xl font-bold mb-4"^>{prompt.name}^</h1^>
echo           ^<p className="text-xl text-gray-600 mb-8"^>{prompt.description}^</p^>
echo.
echo           ^<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8"^>
echo             ^<div className="flex justify-between items-center"^>
echo               ^<div^>
echo                 ^<p className="text-sm text-gray-600"^>Price per use^</p^>
echo                 ^<p className="text-3xl font-bold text-blue-600"^>
echo                   ${prompt.price_per_use}
echo                 ^</p^>
echo               ^</div^>
echo               ^<button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"^>
echo                 Try Now
echo               ^</button^>
echo             ^</div^>
echo           ^</div^>
echo.
echo           ^<div className="border-t pt-6"^>
echo             ^<h2 className="text-2xl font-bold mb-4"^>How it works^</h2^>
echo             ^<ol className="list-decimal list-inside space-y-2 text-gray-700"^>
echo               ^<li^>Click "Try Now" to get started^</li^>
echo               ^<li^>Provide your input^</li^>
echo               ^<li^>Get instant AI-powered results^</li^>
echo               ^<li^>Pay only ${prompt.price_per_use} per use^</li^>
echo             ^</ol^>
echo           ^</div^>
echo         ^</div^>
echo       ^</div^>
echo     ^</div^>
echo   ^);
echo }
) > "app\[promptSlug]\page.tsx"

echo.
echo ============================================
echo SUCCESS! RopeBridge structure created.
echo ============================================
echo.
echo Next steps:
echo 1. Review the files created
echo 2. Run: npm run dev
echo 3. Test locally at http://localhost:3000
echo 4. Deploy: git add . ^&^& git commit -m "RopeBridge setup" ^&^& git push
echo.
pause
