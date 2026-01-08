import { useState } from 'react';

export default function ScrollOfDeedsGenerator() {
  const [adventurerData] = useState({
    name: "Sir Aldric the Brave",
    title: "Dragon Slayer",
    class: "Warrior",
    level: 12,
    rank: "S",
    xp: 3500,
    questsCompleted: 47,
    totalEarnings: 12500,
    joinDate: "2025-06-15",
    achievements: [
      "Defeated the Ancient Dragon",
      "Cleared the Haunted Forest",
      "Rescued the Princess",
      "Found the Lost Artifact"
    ]
  });

  const [generating, setGenerating] = useState(false);
  const [certificateGenerated, setCertificateGenerated] = useState(false);

  const generateCertificate = () => {
    setGenerating(true);
    // Simulate certificate generation
    setTimeout(() => {
      setGenerating(false);
      setCertificateGenerated(true);
    }, 1500);
  };

  const downloadCertificate = () => {
    // In real implementation: Generate and download PDF
    alert('Certificate download would start here (PDF generation not implemented in demo)');
  };

  const verifyCertificate = () => {
    const verificationCode = `ADV-${adventurerData.level}-${Date.now().toString(36).toUpperCase()}`;
    alert(`Certificate Verification Code: ${verificationCode}\n\nThis would verify against blockchain/database in production.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-950 via-slate-900 to-black text-slate-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-4xl font-extrabold tracking-wide text-amber-300 mb-2">
            📜 Scroll of Deeds
          </h1>
          <p className="text-slate-300">Official Guild Certificate of Achievement</p>
        </header>

        {/* Adventurer Profile Summary */}
        <div className="rounded-2xl border-2 border-amber-600/60 bg-gradient-to-b from-amber-900/20 to-slate-900/50 p-6 shadow-[0_0_40px_rgba(251,191,36,0.2)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-amber-200">{adventurerData.name}</h2>
              <p className="text-slate-300">{adventurerData.title} • {adventurerData.class}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold text-amber-400">{adventurerData.rank}</div>
              <div className="text-xs text-slate-400">Guild Rank</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <div className="text-xs text-slate-400">Level</div>
              <div className="text-xl font-bold text-blue-400">{adventurerData.level}</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <div className="text-xs text-slate-400">Experience</div>
              <div className="text-xl font-bold text-purple-400">{adventurerData.xp} XP</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <div className="text-xs text-slate-400">Quests</div>
              <div className="text-xl font-bold text-emerald-400">{adventurerData.questsCompleted}</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <div className="text-xs text-slate-400">Earnings</div>
              <div className="text-xl font-bold text-amber-400">{adventurerData.totalEarnings} 🪙</div>
            </div>
          </div>

          <div className="border-t border-amber-700/40 pt-4">
            <h3 className="text-sm font-semibold text-amber-300 mb-2">Notable Achievements:</h3>
            <ul className="space-y-1">
              {adventurerData.achievements.map((achievement, idx) => (
                <li key={idx} className="text-sm text-slate-300 flex items-center gap-2">
                  <span className="text-amber-500">⭐</span>
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Certificate Preview */}
        {certificateGenerated && (
          <div className="rounded-2xl border-4 border-double border-amber-600 bg-gradient-to-br from-amber-50 to-amber-100 p-8 shadow-2xl text-slate-900 relative overflow-hidden">
            {/* Decorative corner ornaments */}
            <div className="absolute top-4 left-4 text-6xl text-amber-700/20">❦</div>
            <div className="absolute top-4 right-4 text-6xl text-amber-700/20">❦</div>
            <div className="absolute bottom-4 left-4 text-6xl text-amber-700/20">❦</div>
            <div className="absolute bottom-4 right-4 text-6xl text-amber-700/20">❦</div>

            <div className="relative z-10 text-center space-y-4">
              <div className="text-5xl font-serif text-amber-900">⚔️</div>
              <h2 className="text-3xl font-serif font-bold text-amber-950">
                Scroll of Deeds
              </h2>
              <p className="text-sm italic text-amber-800">
                Be it known throughout the realm that
              </p>
              
              <div className="my-6 py-4 border-y-2 border-amber-700">
                <p className="text-4xl font-serif font-extrabold text-amber-950">
                  {adventurerData.name}
                </p>
                <p className="text-lg italic text-amber-800 mt-2">
                  {adventurerData.title}
                </p>
              </div>

              <p className="text-base text-slate-800 max-w-2xl mx-auto leading-relaxed">
                Has distinguished themselves in the service of the Guild, completing{' '}
                <span className="font-bold">{adventurerData.questsCompleted} quests</span> with
                valor and skill, achieving the esteemed rank of{' '}
                <span className="font-bold text-amber-900">{adventurerData.rank}</span>, and
                earning a total of <span className="font-bold">{adventurerData.totalEarnings} gold pieces</span>.
              </p>

              <div className="mt-8 pt-6 border-t-2 border-amber-700">
                <p className="text-sm text-amber-800">Issued by the Tavern Adventurer Guild</p>
                <p className="text-xs text-slate-700 mt-1">
                  Date of Issue: {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-xs text-slate-600 mt-2">
                  Certificate ID: CERT-{Date.now().toString(36).toUpperCase()}
                </p>
              </div>

              <div className="flex items-center justify-center gap-8 mt-8">
                <div className="text-center">
                  <div className="w-32 border-t-2 border-amber-900 mb-1"></div>
                  <p className="text-xs text-amber-900 font-semibold">Guild Master</p>
                </div>
                <div className="text-3xl text-amber-700">🏰</div>
                <div className="text-center">
                  <div className="w-32 border-t-2 border-amber-900 mb-1"></div>
                  <p className="text-xs text-amber-900 font-semibold">Guild Seal</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {!certificateGenerated ? (
            <button
              onClick={generateCertificate}
              disabled={generating}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {generating ? '🔄 Generating Certificate...' : '📜 Generate Scroll of Deeds'}
            </button>
          ) : (
            <>
              <button
                onClick={downloadCertificate}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold shadow-lg transition-all"
              >
                💾 Download Certificate (PDF)
              </button>
              <button
                onClick={verifyCertificate}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold shadow-lg transition-all"
              >
                ✓ Verify Certificate
              </button>
              <button
                onClick={() => setCertificateGenerated(false)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white font-semibold shadow-lg transition-all"
              >
                🔄 Generate New
              </button>
            </>
          )}
        </div>

        {/* Verification Info */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <span>🔐</span> Certificate Verification
          </h3>
          <div className="space-y-2 text-sm text-slate-300">
            <p>
              ✓ Each Scroll of Deeds contains a unique verification code
            </p>
            <p>
              ✓ Certificates are cryptographically signed by the Guild Master
            </p>
            <p>
              ✓ Verification can be done instantly using the certificate ID
            </p>
            <p className="text-xs text-slate-500 mt-3">
              In production: Certificates would be stored on blockchain or secure database with 
              cryptographic signatures for tamper-proof verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
