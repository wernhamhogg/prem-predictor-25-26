// This async function will run on the server to fetch team data from the FPL API
async function getTeams() {
  try {
    // The official FPL API endpoint for bootstrap data (includes teams, players, etc.)
    const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/');
    
    // Check if the request was successful
    if (!response.ok) {
      console.error("Failed to fetch FPL data:", response.statusText);
      return []; // Return an empty array on failure
    }
    
    const data = await response.json();
    
    // The team data is in an array called 'teams'. We just want the names.
    // We map over the array and return a new array containing only the team names.
    const teamNames = data.teams.map((team: { name: string }) => team.name);
    
    return teamNames.sort(); // Sort the teams alphabetically
    
  } catch (error) {
    console.error("An error occurred while fetching FPL data:", error);
    return []; // Return an empty array if an error occurs
  }
}

// We add the 'async' keyword here to allow us to use 'await' for data fetching
export default async function HomePage() {
  // We call our new function and wait for it to return the list of teams
  const teams = await getTeams();

  const renderTeamOptions = () => {
    // If for some reason the API fails, we provide a default fallback option
    if (teams.length === 0) {
      return <option disabled>Could not load teams</option>;
    }
    return teams.map(team => <option key={team} value={team}>{team}</option>);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-900 text-white">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8">
          Powley's Predictor - 25/26
        </h1>

        <form className="space-y-6">
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
                  <select id="title-winner" name="title-winner" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">
                    {renderTeamOptions()}
                  </select>
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
                  <select id="fa-cup-winner" name="fa-cup-winner" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">
                    {renderTeamOptions()}
                  </select>
                </div>
                <div>
                  <label htmlFor="cl-winner" className="block text-sm font-medium text-gray-300">5. Champions League Winner</label>
                  <select id="cl-winner" name="cl-winner" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">
                    {renderTeamOptions()}
                  </select>
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
                  <select id="overachievers" name="overachievers" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">
                    {renderTeamOptions()}
                  </select>
                </div>
                 <div>
                  <label htmlFor="underachievers" className="block text-sm font-medium text-gray-300">11. Biggest Underachievers</label>
                  <select id="underachievers" name="underachievers" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">
                    {renderTeamOptions()}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md text-lg"
          >
            Submit Predictions
          </button>
        </form>
      </div>
    </main>
  );
}