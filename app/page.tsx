// Make this a "Client Component" to allow for interactivity
"use client";

// Import necessary tools
import { useState, FormEvent } from 'react';
import { supabase } from '../utils/supabase/client'; // This line will now work

export default function HomePage() {
  // A static list to simplify getting the submission logic working first.
  const teams = [
    "Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton",
    "Chelsea", "Crystal Palace", "Everton", "Fulham", "Ipswich Town",
    "Leicester City", "Liverpool", "Manchester City", "Manchester United",
    "Newcastle United", "Nottingham Forest", "Southampton", "Tottenham Hotspur",
    "West Ham United", "Wolverhampton"
  ].sort();

  // State to manage the form submission process
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);

  // The function that handles form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevents the page from reloading
    setIsSubmitting(true);
    setSubmissionStatus(null);

    const formData = new FormData(event.currentTarget);

    // Collect multi-select values into arrays
    const top4Teams = [
      formData.get('top4-1') as string,
      formData.get('top4-2') as string,
      formData.get('top4-3') as string,
    ].filter(Boolean);

    const relegatedTeams = [
      formData.get('relegated-1') as string,
      formData.get('relegated-2') as string,
      formData.get('relegated-3') as string,
    ].filter(Boolean);

    // Create the data object that matches our Supabase table
    const predictionData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      title_winner: formData.get('title-winner') as string,
      top_4_teams: top4Teams,
      relegated_teams: relegatedTeams,
      fa_cup_winner: formData.get('fa-cup-winner') as string,
      cl_winner: formData.get('cl-winner') as string,
      first_manager_to_leave: formData.get('manager-leave') as string,
      manager_leave_date: formData.get('manager-date') as string,
      biggest_hit_signing: formData.get('hit-signing') as string,
      biggest_flop_signing: formData.get('flop-signing') as string,
      overachievers: formData.get('overachievers') as string,
      underachievers: formData.get('underachievers') as string,
    };

    try {
      // Send the data to Supabase
      const { error } = await supabase.from('predictions').insert([predictionData]);

      if (error) {
        throw error;
      }
      
      setSubmissionStatus('success');
      (event.target as HTMLFormElement).reset(); // Reset form on success

    } catch (error) {
      console.error('Error submitting prediction:', error);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTeamOptions = () => {
    return teams.map((team: string) => <option key={team} value={team}>{team}</option>);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-900 text-white">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8">
          Powley's Predictor - 25/26
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Section 1: User Info */}
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

          {/* Section 2: Predictions */}
          <div className="p-4 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Your Predictions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Column 1 */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="title-winner" className="block text-sm font-medium text-gray-300">1. Premier League Title Winner</label>
                  <select id="title-winner" name="title-winner" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">{renderTeamOptions()}</select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">2. Other Top 4 Teams</label>
                  <div className="space-y-2 mt-1">
                    <select name="top4-1" className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">{renderTeamOptions()}</select>
                    <select name="top4-2" className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">{renderTeamOptions()}</select>
                    <select name="top4-3" className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">{renderTeamOptions()}</select>
                  </div>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-300">3. Relegated Teams</label>
                  <div className="space-y-2 mt-1">
                    <select name="relegated-1" className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">{renderTeamOptions()}</select>
                    <select name="relegated-2" className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">{renderTeamOptions()}</select>
                    <select name="relegated-3" className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">{renderTeamOptions()}</select>
                  </div>
                </div>
                <div>
                  <label htmlFor="fa-cup-winner" className="block text-sm font-medium text-gray-300">4. FA Cup Winner</label>
                  <select id="fa-cup-winner" name="fa-cup-winner" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">{renderTeamOptions()}</select>
                </div>
                <div>
                  <label htmlFor="cl-winner" className="block text-sm font-medium text-gray-300">5. Champions League Winner</label>
                  <select id="cl-winner" name="cl-winner" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">{renderTeamOptions()}</select>
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
                <div>
                  <label htmlFor="hit-signing" className="block text-sm font-medium text-gray-300">8. Biggest Hit Signing</label>
                  <input type="text" id="hit-signing" name="hit-signing" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2" />
                </div>
                 <div>
                  <label htmlFor="flop-signing" className="block text-sm font-medium text-gray-300">9. Biggest Flop Signing</label>
                  <input type="text" id="flop-signing" name="flop-signing" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2" />
                </div>
                 <div>
                  <label htmlFor="overachievers" className="block text-sm font-medium text-gray-300">10. Biggest Overachievers</label>
                  <select id="overachievers" name="overachievers" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">{renderTeamOptions()}</select>
                </div>
                 <div>
                  <label htmlFor="underachievers" className="block text-sm font-medium text-gray-300">11. Biggest Underachievers</label>
                  <select id="underachievers" name="underachievers" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">{renderTeamOptions()}</select>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md text-lg disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Predictions'}
          </button>

          {submissionStatus === 'success' && (
            <p className="text-center text-green-400">Prediction submitted successfully!</p>
          )}
          {submissionStatus === 'error' && (
            <p className="text-center text-red-400">Something went wrong. Please try again.</p>
          )}
        </form>
      </div>
    </main>
  );
}