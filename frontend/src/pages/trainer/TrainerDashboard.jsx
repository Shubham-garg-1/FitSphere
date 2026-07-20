import { useState, useEffect } from 'react';
import { trainerService } from '../../services/trainerService';
import { Loader2, RefreshCw, AlertCircle, CheckCircle2, Dumbbell, User, Award, Phone, Mail, BookOpen, Plus, Trash2, X, PlusCircle } from 'lucide-react';

const TrainerDashboard = () => {
  const [activeTab, setActiveTab] = useState('clients');
  const [profile, setProfile] = useState(null);
  
  // Data States
  const [clients, setClients] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  
  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Selected Client Details for Workouts Management
  const [selectedClient, setSelectedClient] = useState(null);

  // Form States
  const [workoutForm, setWorkoutForm] = useState({ id: null, name: '', description: '', durationMinutes: 30, difficulty: 'Medium' });
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);

  const fetchTrainerData = async () => {
    setLoading(true);
    setError('');
    try {
      const profData = await trainerService.getProfile();
      setProfile(profData);
      
      const [clientsData, workoutsData] = await Promise.all([
        trainerService.getAssignedClients(),
        trainerService.getWorkouts()
      ]);
      setClients(clientsData);
      setWorkouts(workoutsData);

      // Keep selected client state up to date if one was open
      if (selectedClient) {
        const updated = clientsData.find(c => c.id === selectedClient.id);
        setSelectedClient(updated || null);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch trainer data. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadTrainerData = async () => {
      setLoading(true);
      setError('');
      try {
        const profData = await trainerService.getProfile();
        if (isMounted) setProfile(profData);
        
        const [clientsData, workoutsData] = await Promise.all([
          trainerService.getAssignedClients(),
          trainerService.getWorkouts()
        ]);
        if (isMounted) {
          setClients(clientsData);
          setWorkouts(workoutsData);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError(err.message || 'Failed to fetch trainer data. Make sure backend is running.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadTrainerData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveWorkout = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const payload = {
      ...workoutForm,
      trainerId: profile?.id
    };
    try {
      if (workoutForm.id) {
        await trainerService.updateWorkout(workoutForm.id, payload);
        setSuccess('Workout plan updated!');
      } else {
        await trainerService.createWorkout(payload);
        setSuccess('Workout plan added to library!');
      }
      setShowWorkoutModal(false);
      fetchTrainerData();
    } catch (err) {
      setError(err.message || 'Failed to save workout.');
    }
  };

  const handleDeleteWorkout = async (id) => {
    if (!window.confirm('Delete this workout from the system?')) return;
    setError('');
    setSuccess('');
    try {
      await trainerService.deleteWorkout(id);
      setSuccess('Workout plan deleted.');
      fetchTrainerData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to delete workout.');
    }
  };

  // Workout Assignment Actions
  const handleAssignWorkout = async (workoutId) => {
    if (!selectedClient) return;
    setError('');
    setSuccess('');
    try {
      await trainerService.assignWorkoutToClient(selectedClient.id, workoutId);
      setSuccess(`Workout plan assigned to ${selectedClient.name}!`);
      
      // Update clients local state immediately
      const updatedClients = await trainerService.getAssignedClients();
      setClients(updatedClients);
      setSelectedClient(updatedClients.find(c => c.id === selectedClient.id));
    } catch (err) {
      setError(err.message || 'Failed to assign workout.');
    }
  };

  const handleRemoveWorkout = async (workoutId) => {
    if (!selectedClient) return;
    setError('');
    setSuccess('');
    try {
      await trainerService.removeWorkoutFromClient(selectedClient.id, workoutId);
      setSuccess(`Workout removed from ${selectedClient.name}.`);
      
      // Update clients local state immediately
      const updatedClients = await trainerService.getAssignedClients();
      setClients(updatedClients);
      setSelectedClient(updatedClients.find(c => c.id === selectedClient.id));
    } catch (err) {
      setError(err.message || 'Failed to remove workout.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-1">Trainer Panel</h1>
          {profile && (
            <p className="text-sm text-slate-500">
              Welcome back, <strong className="text-slate-800 font-semibold">{profile.name}</strong> • Specialization: <span className="font-semibold text-indigo-600">{profile.specialization}</span> ({profile.experience} years experience)
            </p>
          )}
        </div>
        <button 
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm transition-all self-start sm:self-center"
          onClick={fetchTrainerData}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 bg-red-50 text-red-700 border border-red-100 rounded-xl px-4 py-3.5 text-sm mb-6" role="alert">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl px-4 py-3.5 text-sm mb-6" role="alert">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button 
          className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'clients' 
              ? 'bg-indigo-600 text-white shadow-sm' 
              : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-600'
          }`}
          onClick={() => setActiveTab('clients')}
        >
          My Clients
        </button>
        <button 
          className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'workouts' 
              ? 'bg-indigo-600 text-white shadow-sm' 
              : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-600'
          }`}
          onClick={() => setActiveTab('workouts')}
        >
          Workouts Library
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
          <p className="text-sm text-slate-500">Loading data...</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6">
          {/* Tab 1: Clients & Workout Assignment */}
          {activeTab === 'clients' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Clients List */}
              <div className="lg:col-span-5">
                <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-500" />
                  Assigned Clients
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Name</th>
                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {clients.length === 0 ? (
                        <tr>
                          <td colSpan="2" className="text-center py-8 text-sm text-slate-400">
                            No clients assigned to you yet.
                          </td>
                        </tr>
                      ) : (
                        clients.map(client => (
                          <tr 
                            key={client.id} 
                            className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                              selectedClient?.id === client.id ? 'bg-indigo-50/40 hover:bg-indigo-50/40' : ''
                            }`}
                            onClick={() => setSelectedClient(client)}
                          >
                            <td className="px-5 py-4">
                              <div className="font-bold text-slate-800">{client.name}</div>
                              <div className="text-xs text-slate-400 mt-0.5">{client.email}</div>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <button 
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-indigo-600 rounded-lg shadow-sm transition-all"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedClient(client);
                                }}
                              >
                                Manage ({client.workouts?.length || 0})
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Assignment Details */}
              <div className="lg:col-span-7">
                <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-indigo-500" />
                  {selectedClient ? `Manage Workouts: ${selectedClient.name}` : 'Manage Workouts'}
                </h4>
                {selectedClient ? (
                  <div className="bg-slate-50/80 border border-slate-100/50 rounded-2xl p-5 space-y-6">
                    {/* Active Workouts List */}
                    <div>
                      <h6 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Active Workout Plan</h6>
                      {selectedClient.workouts && selectedClient.workouts.length > 0 ? (
                        <div className="space-y-2.5">
                          {selectedClient.workouts.map(w => (
                            <div 
                              key={w.id} 
                              className="bg-white border border-slate-200/50 p-4 rounded-xl flex items-center justify-between gap-4 shadow-sm"
                            >
                              <div>
                                <div className="font-bold text-slate-800 text-sm">{w.name}</div>
                                <div className="text-xs text-slate-400 mt-0.5">{w.durationMinutes} mins • {w.difficulty}</div>
                              </div>
                              <button 
                                className="inline-flex items-center justify-center p-2 text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all"
                                onClick={() => handleRemoveWorkout(w.id)}
                                title="Remove Workout"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white border border-slate-100 rounded-xl p-6 text-center text-sm text-slate-400 shadow-sm">
                          No workouts assigned to this client yet.
                        </div>
                      )}
                    </div>

                    {/* Assign New Workout */}
                    <div>
                      <h6 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Assign New Workout</h6>
                      {workouts.length === 0 ? (
                        <div className="bg-white border border-slate-100 rounded-xl p-6 text-center text-sm text-slate-400 shadow-sm">
                          Your workouts library is empty. Create workouts in the 'Workouts Library' tab first.
                        </div>
                      ) : (
                        <div className="overflow-hidden border border-slate-200/60 rounded-xl bg-white shadow-sm">
                          <div className="overflow-y-auto divide-y divide-slate-100" style={{ maxHeight: '250px' }}>
                            {workouts.map(w => {
                              const isAssigned = selectedClient.workouts?.some(sw => sw.id === w.id);
                              return (
                                <div key={w.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                                  <div>
                                    <div className="text-sm font-bold text-slate-800">{w.name}</div>
                                    <div className="text-xs text-slate-400 mt-0.5">{w.durationMinutes}m • {w.difficulty}</div>
                                  </div>
                                  <button 
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm transition-all ${
                                      isAssigned 
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-100' 
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white border border-transparent'
                                    }`}
                                    onClick={() => handleAssignWorkout(w.id)}
                                    disabled={isAssigned}
                                  >
                                    <PlusCircle className="w-3.5 h-3.5" />
                                    {isAssigned ? 'Assigned' : 'Assign'}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 h-64">
                    <BookOpen className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="text-sm font-medium mb-1">Select a client from the left</p>
                    <p className="text-xs">Click a client to review, assign, or remove active workout plans.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Workouts Library */}
          {activeTab === 'workouts' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h4 className="text-xl font-bold text-slate-900">Workouts Library</h4>
                  <p className="text-xs text-slate-400">Manage workout templates that you can assign to your clients</p>
                </div>
                <button 
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all self-start sm:self-center"
                  onClick={() => {
                    setWorkoutForm({ id: null, name: '', description: '', durationMinutes: 30, difficulty: 'Medium' });
                    setShowWorkoutModal(true);
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Create Workout Plan
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Difficulty</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Duration</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {workouts.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-10 text-sm text-slate-400">
                          You haven't created any workouts yet. Click 'Create Workout Plan' to get started.
                        </td>
                      </tr>
                    ) : (
                      workouts.map(workout => (
                        <tr key={workout.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-800">{workout.name}</div>
                            {workout.description && <div className="text-xs text-slate-500 mt-0.5">{workout.description}</div>}
                          </td>
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
                          <td className="px-6 py-4 text-sm font-semibold text-slate-600">{workout.durationMinutes} Mins</td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button 
                              className="inline-flex items-center justify-center px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-indigo-600 rounded-lg shadow-sm transition-all"
                              onClick={() => {
                                setWorkoutForm(workout);
                                setShowWorkoutModal(true);
                              }}
                            >
                              Edit
                            </button>
                            <button 
                              className="inline-flex items-center justify-center px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-transparent hover:border-red-200 text-xs font-semibold text-red-600 rounded-lg transition-all"
                              onClick={() => handleDeleteWorkout(workout.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Workout Create/Edit Modal */}
      {showWorkoutModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h5 className="text-lg font-bold text-slate-900">{workoutForm.id ? 'Edit Workout Plan' : 'Add Workout Plan'}</h5>
              <button 
                type="button" 
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors" 
                onClick={() => setShowWorkoutModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveWorkout}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Workout Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder-slate-400 transition-all bg-slate-50/50 hover:bg-slate-50"
                    placeholder="e.g. Full Body Burner"
                    value={workoutForm.name}
                    onChange={(e) => setWorkoutForm(prev => ({ ...prev, name: e.target.value }))}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                  <textarea 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder-slate-400 transition-all bg-slate-50/50 hover:bg-slate-50" 
                    rows="3"
                    placeholder="e.g. High intensity training consisting of squats, pushups, and burpees."
                    value={workoutForm.description}
                    onChange={(e) => setWorkoutForm(prev => ({ ...prev, description: e.target.value }))}
                  ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Duration (Min)</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder-slate-400 transition-all bg-slate-50/50 hover:bg-slate-50" 
                      min="1"
                      placeholder="e.g. 30"
                      value={workoutForm.durationMinutes}
                      onChange={(e) => setWorkoutForm(prev => ({ ...prev, durationMinutes: parseInt(e.target.value, 10) || 1 }))}
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Difficulty</label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 transition-all bg-slate-50/50 hover:bg-slate-50 cursor-pointer"
                      value={workoutForm.difficulty}
                      onChange={(e) => setWorkoutForm(prev => ({ ...prev, difficulty: e.target.value }))}
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
                <button 
                  type="button" 
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm transition-all" 
                  onClick={() => setShowWorkoutModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all"
                >
                  Save Workout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerDashboard;
