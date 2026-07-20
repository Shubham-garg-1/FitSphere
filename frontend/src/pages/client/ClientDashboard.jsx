import { useState, useEffect } from 'react';
import { clientService } from '../../services/clientService';
import { Loader2, RefreshCw, User, Mail, Award, ShieldAlert, BookOpen, Dumbbell, Star, Phone, Activity } from 'lucide-react';

const ClientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await clientService.getProfile();
      setProfile(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await clientService.getProfile();
        if (isMounted) {
          setProfile(data);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError(err.message || 'Failed to fetch profile details.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-1">My Dashboard</h1>
          <p className="text-sm text-slate-500">Track your profile details, trainer, and custom fitness workouts</p>
        </div>
        <button 
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm transition-all self-start sm:self-center" 
          onClick={fetchProfile}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 bg-red-50 text-red-700 border border-red-100 rounded-xl px-4 py-3.5 text-sm mb-6" role="alert">
          <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
          <p className="text-sm text-slate-500">Loading your profile...</p>
        </div>
      ) : profile ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Section 1: My Profile */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 h-full flex flex-col justify-between">
              <div>
                <h4 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-5 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-500" />
                  My Profile
                </h4>
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Name</label>
                    <span className="text-lg font-bold text-slate-800">{profile.name}</span>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      Email Address
                    </label>
                    <span className="text-sm font-medium text-slate-600">{profile.email}</span>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      Account Role
                    </label>
                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg uppercase tracking-wider">
                      {profile.role || 'Client'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Assigned Trainer */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 h-full">
              <h4 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-5 flex items-center gap-2">
                <Star className="w-5 h-5 text-indigo-500" />
                Assigned Trainer
              </h4>
              {profile.trainer ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Name</label>
                      <span className="text-lg font-bold text-slate-800">{profile.trainer.name}</span>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Specialization</label>
                      <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full">
                        {profile.trainer.specialization}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Experience</label>
                      <span className="text-sm font-semibold text-slate-700">{profile.trainer.experience} Years</span>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        Phone Number
                      </label>
                      <span className="text-sm font-semibold text-slate-700">{profile.trainer.phone}</span>
                    </div>
                  </div>
                  <div className="border-t border-slate-50 pt-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      Trainer Email
                    </label>
                    <span className="text-sm font-semibold text-slate-700">{profile.trainer.email}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center h-48">
                  <Activity className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-sm font-medium text-slate-500 mb-1">No trainer has been assigned yet.</p>
                  <p className="text-xs text-slate-400">Please contact an administrator to pair you with a trainer.</p>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Workout Plan */}
          <div className="col-span-12">
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6">
              <h4 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-5 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-indigo-500" />
                My Workout Plan
              </h4>
              {profile.workouts && profile.workouts.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Workout Plan</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Duration</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Difficulty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {profile.workouts.map(workout => (
                        <tr key={workout.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-800">{workout.name}</div>
                            {workout.description && <div className="text-xs text-slate-500 mt-0.5">{workout.description}</div>}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-slate-600">{workout.durationMinutes} Minutes</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-lg border ${
                              workout.difficulty === 'Hard' 
                                ? 'bg-red-50 text-red-700 border-red-100' 
                                : workout.difficulty === 'Medium' 
                                  ? 'bg-amber-50 text-amber-700 border-amber-100' 
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            }`}>
                              {workout.difficulty}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                  <BookOpen className="w-10 h-10 text-slate-300 mb-2" />
                  <p className="text-sm font-medium text-slate-500 mb-1">Your workout plan is empty.</p>
                  <p className="text-xs text-slate-400">Once your trainer assigns you workouts, they will show up here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 text-amber-800 border border-amber-100 rounded-xl p-4 text-sm font-medium">
          Profile details could not be parsed.
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
