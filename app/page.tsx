// 1. Make this a "Client Component" to allow for interactivity
"use client";

// 2. Import necessary tools
import { useState, useEffect, FormEvent } from 'react';
import { supabase } from '../utils/supabase/client';

// Define the shape of a Player object for TypeScript
interface Player {
  id: number;
  web_name: string;
}

export default function HomePage() {
  // --- STATE MANAGEMENT ---
  // A. State for data fetched from the API
  const [teams, setTeams] = useState<string[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  
  // B. State for managing the form UI and submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);

  // C. State for dynamic dropdowns
  const [top4Selections, setTop4Selections] = useState({ s1: '', s2: '', s3: '' });
  const [relegationSelections, setRelegationSelections] = useState({ s1: '', s2: '', s3: '' });

  // D. State for autocomplete text fields
  const [hitSigningInput, setHitSigningInput] = useState('');
  const [hitSigningSuggestions, setHitSigningSuggestions] = useState<Player[]>([]);
  const [flopSigningInput, setFlopSigningInput] = useState('');
  const [flopSigningSuggestions, setFlopSigningSuggestions] = useState<Player[]>([]);


  // --- DATA FETCHING ---
  useEffect(() => {
    // Fetch initial data (teams and players) when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/');
        if (!response.ok) throw new Error('Failed to fetch FPL data');
        const data = await response.json();
        
        const teamNames = data.teams.map((team: { name: string }) => team.name).sort();
        const playerData = data.elements.map((player: { id: number, web_name: string }) => ({ id: player.id, web_name: player.web_name }));

        setTeams(teamNames);
        setPlayers(playerData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchData();
  }, []); // The empty array [] means this runs only once on mount


  // --- EVENT HANDLERS ---
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus(null);
    const formData = new FormData(event.currentTarget);
    const predictionData = {
      name: formData.get('name') as string, email: formData.get('email') as string,
      title_winner: formData.get('title-winner') as string,
      top_4_teams: [top4Selections.s1, top4Selections.s2, top4Selections.s3],
      relegated_teams: [relegationSelections.s1, relegationSelections.s2, relegationSelections.s3],
      fa_cup_winner: formData.get('fa-cup-winner') as string, cl_winner: formData.get('cl-winner') as string,
      first_manager_to_leave: formData.get('manager-leave') as string,
      manager_leave_date: formData.get('manager-date') as string,
      biggest_hit_signing: hitSigningInput, // Use state value for autocomplete
      biggest_flop_signing: flopSigningInput, // Use state value for autocomplete
      overachievers: formData.get('overachievers') as string, underachievers: formData.get('underachievers') as string,
    };
    try {
      const { error } = await supabase.from('predictions').insert([predictionData]);
      if (error) throw error;
      setSubmissionStatus('success');
      (event.target as HTMLFormElement).reset();
      // Reset all state after successful submission
      setTop4Selections({ s1: '', s2: '', s3: '' });
      setRelegationSelections({ s1: '', s2: '', s3: '' });
      setHitSigningInput('');
      setFlopSigningInput('');
    } catch (error) {
      console.error('Error submitting prediction:', error);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutocompleteChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'hit' | 'flop') => {
    const value = e.target.value;
    if (type === 'hit') {
      setHitSigningInput(value);
      if (value.length > 1) {
        setHitSigningSuggestions(players.filter(p => p.web_name.toLowerCase().includes(value.toLowerCase())).slice(0, 5));
      } else {
        setHitSigningSuggestions([]);
      }
    } else {
      setFlopSigningInput(value);
      if (value.length > 1) {
        setFlopSigningSuggestions(players.filter(p => p.web_name.toLowerCase().includes(value.toLowerCase())).slice(0, 5));
      } else {
        setFlopSigningSuggestions([]);
      }
    }
  };

  const selectSuggestion = (player: Player, type: 'hit' | 'flop') => {
    if (type === 'hit') {
      setHitSigningInput(player.web_name);
      setHitSigningSuggestions([]);
    } else {
      setFlopSigningInput(player.web_name);
      setFlopSigningSuggestions([]);
    }
  };


  // --- UTILITY RENDER FUNCTIONS ---
  const renderTeamOptions = (exclude: string[] = []) => {
    const filteredTeams = teams.filter(t => !exclude.includes(t));
    return (
      <>
        <option value="" disabled>Please select...</option>
        {filteredTeams.map((team: string) => <option key={team} value={team}>{team}</option>)}
      </>
    );
  };

  // --- JSX ---
  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-900 text-white">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8">Powley's Predictor - 25/26</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* User Details */}
          <div className="p-4 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Your Details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                <input type="text" id="name" name="name" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                <input type="email" id="email" name="email" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2" required />
              </div>
            </div>
          </div>

          {/* Predictions */}
          <div className="p-4 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Your Predictions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Column 1 */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="title-winner" className="block text-sm font-medium text-gray-300">1. Premier League Title Winner</label>
                  <select id="title-winner" name="title-winner" defaultValue="" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">{renderTeamOptions()}</select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">2. Other Top 4 Teams</label>
                  <div className="space-y-2 mt-1">
                    <select name="top4-1" defaultValue="" onChange={(e) => setTop4Selections({...top4Selections, s1: e.target.value})} className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">{renderTeamOptions([top4Selections.s2, top4Selections.s3])}</select>
                    <select name="top4-2" defaultValue="" onChange={(e) => setTop4Selections({...top4Selections, s2: e.target.value})} className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">{renderTeamOptions([top4Selections.s1, top4Selections.s3])}</select>
                    <select name="top4-3" defaultValue="" onChange={(e) => setTop4Selections({...top4Selections, s3: e.target.value})} className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">{renderTeamOptions([top4Selections.s1, top4Selections.s2])}</select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">3. Relegated Teams</label>
                  <div className="space-y-2 mt-1">
                    <select name="relegated-1" defaultValue="" onChange={(e) => setRelegationSelections({...relegationSelections, s1: e.target.value})} className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">{renderTeamOptions([relegationSelections.s2, relegationSelections.s3])}</select>
                    <select name="relegated-2" defaultValue="" onChange={(e) => setRelegationSelections({...relegationSelections, s2: e.target.value})} className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">{renderTeamOptions([relegationSelections.s1, relegationSelections.s3])}</select>
                    <select name="relegated-3" defaultValue="" onChange={(e) => setRelegationSelections({...relegationSelections, s3: e.target.value})} className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">{renderTeamOptions([relegationSelections.s1, relegationSelections.s2])}</select>
                  </div>
                </div>
                <div>
                  <label htmlFor="fa-cup-winner" className="block text-sm font-medium text-gray-300">4. FA Cup Winner</label>
                  <select id="fa-cup-winner" name="fa-cup-winner" defaultValue="" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">{renderTeamOptions()}</select>
                </div>
                <div>
                  <label htmlFor="cl-winner" className="block text-sm font-medium text-gray-300">5. Champions League Winner</label>
                  <select id="cl-winner" name="cl-winner" defaultValue="" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">{renderTeamOptions()}</select>
                </div>
              </div>
              {/* Column 2 */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="manager-leave" className="block text-sm font-medium text-gray-300">6. First Manager to Leave</label>
                  <input type="text" id="manager-leave" name="manager-leave" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2" />
                </div>
                <div>
                  <label htmlFor="manager-date" className="block text-sm font-medium text-gray-300">7. When will they leave?</label>
                  <input type="date" id="manager-date" name="manager-date" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2" />
                </div>
                <div className="relative">
                  <label htmlFor="hit-signing" className="block text-sm font-medium text-gray-300">8. Biggest Hit Signing</label>
                  <input type="text" id="hit-signing" value={hitSigningInput} onChange={(e) => handleAutocompleteChange(e, 'hit')} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2" />
                  {hitSigningSuggestions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-gray-800 border border-gray-600 rounded-md mt-1 max-h-60 overflow-auto">
                      {hitSigningSuggestions.map(player => (
                        <li key={player.id} onClick={() => selectSuggestion(player, 'hit')} className="p-2 hover:bg-gray-700 cursor-pointer">{player.web_name}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="relative">
                  <label htmlFor="flop-signing" className="block text-sm font-medium text-gray-300">9. Biggest Flop Signing</label>
                  <input type="text" id="flop-signing" value={flopSigningInput} onChange={(e) => handleAutocompleteChange(e, 'flop')} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2" />
                  {flopSigningSuggestions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-gray-800 border border-gray-600 rounded-md mt-1 max-h-60 overflow-auto">
                      {flopSigningSuggestions.map(player => (
                        <li key={player.id} onClick={() => selectSuggestion(player, 'flop')} className="p-2 hover:bg-gray-700 cursor-pointer">{player.web_name}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <label htmlFor="overachievers" className="block text-sm font-medium text-gray-300">10. Biggest Overachievers</label>
                  <select id="overachievers" name="overachievers" defaultValue="" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">{renderTeamOptions()}</select>
                </div>
                <div>
                  <label htmlFor="underachievers" className="block text-sm font-medium text-gray-300">11. Biggest Underachievers</label>
                  <select id="underachievers" name="underachievers" defaultValue="" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">{renderTeamOptions()}</select>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md text-lg disabled:opacity-50">
            {isSubmitting ? 'Submitting...' : 'Submit Predictions'}
          </button>

          {submissionStatus === 'success' && <p className="text-center text-green-400">Prediction submitted successfully!</p>}
          {submissionStatus === 'error' && <p className="text-center text-red-400">Something went wrong. Please try again.</p>}
        </form>
      </div>
    </main>
  );
}