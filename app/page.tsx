"use client";

import { useState, useEffect, FormEvent } from 'react';
import { supabase } from '../utils/supabase/client';

// 1. Import the new components from Shadcn/UI
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function HomePage() {
  // State for data fetched from the API
  const [teams, setTeams] = useState<string[]>([]);
  
  // State for managing the form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);

  // State for controlled form inputs
  const [formData, setFormData] = useState({
    name: '', email: '', title_winner: '',
    top4_1: '', top4_2: '', top4_3: '',
    relegated_1: '', relegated_2: '', relegated_3: '',
    fa_cup_winner: '', cl_winner: '',
    manager_leave: '', manager_date: '',
    hit_signing: '', flop_signing: '',
    overachievers: '', underachievers: ''
  });
  
  // Fetch initial team data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/');
        if (!response.ok) throw new Error('Failed to fetch FPL data');
        const data = await response.json();
        const teamNames = data.teams.map((team: { name: string }) => team.name).sort();
        setTeams(teamNames);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({...prev, [name]: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus(null);

    const predictionData = {
      name: formData.name, email: formData.email,
      title_winner: formData.title_winner,
      top_4_teams: [formData.top4_1, formData.top4_2, formData.top4_3],
      relegated_teams: [formData.relegated_1, formData.relegated_2, formData.relegated_3],
      fa_cup_winner: formData.fa_cup_winner, cl_winner: formData.cl_winner,
      first_manager_to_leave: formData.manager_leave,
      manager_leave_date: formData.manager_date,
      biggest_hit_signing: formData.hit_signing,
      biggest_flop_signing: formData.flop_signing,
      overachievers: formData.overachievers,
      underachievers: formData.underachievers
    };

    try {
      const { error } = await supabase.from('predictions').insert([predictionData]);
      if (error) throw error;
      setSubmissionStatus('success');
      // Reset form after successful submission
      setFormData({ name: '', email: '', title_winner: '', top4_1: '', top4_2: '', top4_3: '', relegated_1: '', relegated_2: '', relegated_3: '', fa_cup_winner: '', cl_winner: '', manager_leave: '', manager_date: '', hit_signing: '', flop_signing: '', overachievers: '', underachievers: '' });
    } catch (error) {
      console.error('Error submitting prediction:', error);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTeamOptions = (exclude: string[] = []) => {
      const filteredTeams = teams.filter(t => !exclude.includes(t));
      return filteredTeams.map((team: string) => <SelectItem key={team} value={team}>{team}</SelectItem>);
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4 md:p-8 bg-background">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Powley's Predictor 25/26</h1>
          <p className="text-muted-foreground mt-2">Fill out your predictions for the upcoming season!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Your Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your email" required />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>Your Predictions</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Column 1 */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>1. Premier League Title Winner</Label>
                  <Select name="title_winner" value={formData.title_winner} onValueChange={value => handleSelectChange('title_winner', value)}><SelectTrigger><SelectValue placeholder="Select a team..." /></SelectTrigger><SelectContent>{renderTeamOptions()}</SelectContent></Select>
                </div>
                <div className="space-y-2">
                  <Label>2. Other Top 4 Teams</Label>
                  <div className="space-y-2"><Select name="top4_1" value={formData.top4_1} onValueChange={value => handleSelectChange('top4_1', value)}><SelectTrigger><SelectValue placeholder="Select team..." /></SelectTrigger><SelectContent>{renderTeamOptions([formData.top4_2, formData.top4_3])}</SelectContent></Select></div>
                  <div className="space-y-2"><Select name="top4_2" value={formData.top4_2} onValueChange={value => handleSelectChange('top4_2', value)}><SelectTrigger><SelectValue placeholder="Select team..." /></SelectTrigger><SelectContent>{renderTeamOptions([formData.top4_1, formData.top4_3])}</SelectContent></Select></div>
                  <div className="space-y-2"><Select name="top4_3" value={formData.top4_3} onValueChange={value => handleSelectChange('top4_3', value)}><SelectTrigger><SelectValue placeholder="Select team..." /></SelectTrigger><SelectContent>{renderTeamOptions([formData.top4_1, formData.top4_2])}</SelectContent></Select></div>
                </div>
                <div className="space-y-2">
                  <Label>3. Relegated Teams</Label>
                  <div className="space-y-2"><Select name="relegated_1" value={formData.relegated_1} onValueChange={value => handleSelectChange('relegated_1', value)}><SelectTrigger><SelectValue placeholder="Select team..." /></SelectTrigger><SelectContent>{renderTeamOptions([formData.relegated_2, formData.relegated_3])}</SelectContent></Select></div>
                  <div className="space-y-2"><Select name="relegated_2" value={formData.relegated_2} onValueChange={value => handleSelectChange('relegated_2', value)}><SelectTrigger><SelectValue placeholder="Select team..." /></SelectTrigger><SelectContent>{renderTeamOptions([formData.relegated_1, formData.relegated_3])}</SelectContent></Select></div>
                  <div className="space-y-2"><Select name="relegated_3" value={formData.relegated_3} onValueChange={value => handleSelectChange('relegated_3', value)}><SelectTrigger><SelectValue placeholder="Select team..." /></SelectTrigger><SelectContent>{renderTeamOptions([formData.relegated_1, formData.relegated_2])}</SelectContent></Select></div>
                </div>
                <div className="space-y-2">
                  <Label>4. FA Cup Winner</Label>
                  <Select name="fa_cup_winner" value={formData.fa_cup_winner} onValueChange={value => handleSelectChange('fa_cup_winner', value)}><SelectTrigger><SelectValue placeholder="Select a team..." /></SelectTrigger><SelectContent>{renderTeamOptions()}</SelectContent></Select>
                </div>
                 <div className="space-y-2">
                  <Label>5. Champions League Winner</Label>
                  <Select name="cl_winner" value={formData.cl_winner} onValueChange={value => handleSelectChange('cl_winner', value)}><SelectTrigger><SelectValue placeholder="Select a team..." /></SelectTrigger><SelectContent>{renderTeamOptions()}</SelectContent></Select>
                </div>
              </div>
              {/* Column 2 */}
              <div className="space-y-6">
                 <div className="space-y-2">
                  <Label htmlFor="manager-leave">6. First Manager to Leave</Label>
                  <Input id="manager-leave" name="manager_leave" value={formData.manager_leave} onChange={handleInputChange} placeholder="Enter manager's name" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="manager-date">7. When will they leave?</Label>
                  <Input id="manager-date" name="manager_date" type="date" value={formData.manager_date} onChange={handleInputChange} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="hit-signing">8. Biggest Hit Signing</Label>
                  <Input id="hit-signing" name="hit_signing" value={formData.hit_signing} onChange={handleInputChange} placeholder="Enter player's name" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="flop-signing">9. Biggest Flop Signing</Label>
                  <Input id="flop-signing" name="flop_signing" value={formData.flop_signing} onChange={handleInputChange} placeholder="Enter player's name" />
                </div>
                 <div className="space-y-2">
                  <Label>10. Biggest Overachievers</Label>
                  <Select name="overachievers" value={formData.overachievers} onValueChange={value => handleSelectChange('overachievers', value)}><SelectTrigger><SelectValue placeholder="Select a team..." /></SelectTrigger><SelectContent>{renderTeamOptions()}</SelectContent></Select>
                </div>
                 <div className="space-y-2">
                  <Label>11. Biggest Underachievers</Label>
                  <Select name="underachievers" value={formData.underachievers} onValueChange={value => handleSelectChange('underachievers', value)}><SelectTrigger><SelectValue placeholder="Select a team..." /></SelectTrigger><SelectContent>{renderTeamOptions()}</SelectContent></Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={isSubmitting} className="w-full text-lg py-6">
            {isSubmitting ? 'Submitting...' : 'Submit Predictions'}
          </Button>

          {submissionStatus === 'success' && <p className="text-center text-green-500">Prediction submitted successfully!</p>}
          {submissionStatus === 'error' && <p className="text-center text-red-500">Something went wrong. Please try again.</p>}
        </form>
      </div>
    </main>
  );
}