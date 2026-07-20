import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Loader2, RefreshCw, AlertCircle, CheckCircle2, User, Users, Dumbbell, Award, Plus, Trash2, X, PlusCircle, Sparkles, Settings, ArrowRightLeft, Mail, Phone } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('clients');
  
  // Data States
  const [clients, setClients] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  
  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal/Form States
  const [trainerForm, setTrainerForm] = useState({ id: null, name: '', email: '', phone: '', specialization: '', experience: 0 });
  const [showTrainerModal, setShowTrainerModal] = useState(false);
  
  const [workoutForm, setWorkoutForm] = useState({ id: null, name: '', description: '', durationMinutes: 30, difficulty: 'Medium', trainerId: '' });
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  
  const [assignForm, setAssignForm] = useState({ clientId: '', trainerId: '' });

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [clientsData, trainersData, workoutsData] = await Promise.all([
        adminService.getAllClients(),
        adminService.getAllTrainers(),
        adminService.getAllWorkouts()
      ]);
      setClients(clientsData);
      setTrainers(trainersData);
      setWorkouts(workoutsData);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load dashboard data. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const [clientsData, trainersData, workoutsData] = await Promise.all([
          adminService.getAllClients(),
          adminService.getAllTrainers(),
          adminService.getAllWorkouts()
        ]);
        if (isMounted) {
          setClients(clientsData);
          setTrainers(trainersData);
          setWorkouts(workoutsData);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError(err.message || 'Failed to load dashboard data. Check backend connection.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAssignTrainer = async (e) => {
    e.preventDefault();
    if (!assignForm.clientId) return;
    setError('');
    setSuccess('');
    try {
      await adminService.assignTrainer(assignForm.clientId, assignForm.trainerId);
      setSuccess('Trainer assigned successfully!');
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to assign trainer.');
    }
  };

  // Trainer Actions
  const handleSaveTrainer = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (trainerForm.id) {
        await adminService.updateTrainer(trainerForm.id, trainerForm);
        setSuccess('Trainer updated successfully!');
      } else {
        await adminService.createTrainer(trainerForm);
        setSuccess('Trainer added successfully!');
      }
      setShowTrainerModal(false);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to save trainer.');
    }
  };

  const handleDeleteTrainer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trainer?')) return;
    setError('');
    setSuccess('');
    try {
      await adminService.deleteTrainer(id);
      setSuccess('Trainer deleted successfully!');
      fetchData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to delete trainer.');
    }
  };

  // Workout Actions
  const handleSaveWorkout = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // Convert trainerId to numeric or null
    const payload = {
      ...workoutForm,
      trainerId: workoutForm.trainerId ? parseInt(workoutForm.trainerId, 10) : null
    };
    try {
      if (workoutForm.id) {
        await adminService.updateWorkout(workoutForm.id, payload);
        setSuccess('Workout plan updated!');
      } else {
        await adminService.createWorkout(payload);
        setSuccess('Workout plan created!');
      }
      setShowWorkoutModal(false);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to save workout.');
    }
  };

  const handleDeleteWorkout = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return;
    setError('');
    setSuccess('');
    try {
      await adminService.deleteWorkout(id);
      setSuccess('Workout plan deleted!');
      fetchData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to delete workout.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-1 flex items-center gap-2">
            <Settings className="w-8 h-8 text-indigo-600" />
            Admin Hub
          </h1>
          <p className="text-sm text-slate-500">Manage system users, fitness trainers, and workout plans</p>
        </div>
        <button 
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm transition-all self-start sm:self-center" 
          onClick={fetchData}
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
          Clients & Assignments
        </button>
        <button 
          className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'trainers' 
              ? 'bg-indigo-600 text-white shadow-sm' 
              : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-600'
          }`}
          onClick={() => setActiveTab('trainers')}
        >
          Trainers Directory
        </button>
        <button 
          className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'workouts' 
              ? 'bg-indigo-600 text-white shadow-sm' 
              : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-600'
          }`}
          onClick={() => setActiveTab('workouts')}
        >
          Workout Plans
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
          <p className="text-sm text-slate-500">Fetching records...</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6">
          {/* Tab 1: Clients */}
          {activeTab === 'clients' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Trainer Assignment */}
              <div className="lg:col-span-5">
                <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-indigo-500" />
                  Trainer Assignment
                </h4>
                <form onSubmit={handleAssignTrainer} className="p-5 bg-slate-50/80 border border-slate-100 rounded-2xl space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Client</label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 bg-white transition-all cursor-pointer text-sm" 
                      value={assignForm.clientId}
                      onChange={(e) => setAssignForm(prev => ({ ...prev, clientId: e.target.value }))}
                      required
                    >
                      <option value="">-- Choose Client --</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Trainer</label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 bg-white transition-all cursor-pointer text-sm" 
                      value={assignForm.trainerId}
                      onChange={(e) => setAssignForm(prev => ({ ...prev, trainerId: e.target.value }))}
                    >
                      <option value="">-- No Trainer (Unassign) --</option>
                      {trainers.map(t => (
                        <option key={t.id} value={t.id}>{t.name} - {t.specialization}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2">
                    Confirm Assignment
                  </button>
                </form>
              </div>

              {/* Registered Clients */}
              <div className="lg:col-span-7">
                <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-500" />
                  Registered Clients
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Name</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Email</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Assigned Trainer</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {clients.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="text-center py-8 text-sm text-slate-400">
                            No clients registered.
                          </td>
                        </tr>
                      ) : (
                        clients.map(client => (
                          <tr key={client.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 text-sm font-bold text-slate-800">{client.name}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{client.email}</td>
                            <td className="px-6 py-4">
                              {client.trainer ? (
                                <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-lg border bg-emerald-50 text-emerald-700 border-emerald-100">
                                  {client.trainer.name}
                                </span>
                              ) : (
                                <span className="text-xs font-semibold text-slate-400">None</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Trainers */}
          {activeTab === 'trainers' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h4 className="text-xl font-bold text-slate-900">Fitness Trainers</h4>
                  <p className="text-xs text-slate-400">Add, edit, or delete fitness trainer profiles in the system</p>
                </div>
                <button 
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all self-start sm:self-center"
                  onClick={() => {
                    setTrainerForm({ id: null, name: '', email: '', phone: '', specialization: '', experience: 0 });
                    setShowTrainerModal(true);
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Trainer
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Specialization</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Experience</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Contact Info</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {trainers.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-sm text-slate-400">
                          No trainers added yet. Click 'Add Trainer' to get started.
                        </td>
                      </tr>
                    ) : (
                      trainers.map(trainer => (
                        <tr key={trainer.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-bold text-slate-800">{trainer.name}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full">
                              {trainer.specialization}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-slate-600">{trainer.experience} Years</td>
                          <td className="px-6 py-4">
                            <div className="text-xs font-semibold text-slate-700 flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" />{trainer.email}</div>
                            <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3 text-slate-400" />{trainer.phone}</div>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button 
                              className="inline-flex items-center justify-center px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-indigo-600 rounded-lg shadow-sm transition-all"
                              onClick={() => {
                                setTrainerForm(trainer);
                                setShowTrainerModal(true);
                              }}
                            >
                              Edit
                            </button>
                            <button 
                              className="inline-flex items-center justify-center px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-transparent hover:border-red-200 text-xs font-semibold text-red-600 rounded-lg transition-all"
                              onClick={() => handleDeleteTrainer(trainer.id)}
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

          {/* Tab 3: Workouts */}
          {activeTab === 'workouts' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h4 className="text-xl font-bold text-slate-900">Workouts Blueprint Library</h4>
                  <p className="text-xs text-slate-400">Manage all workout blueprints and creators across the system</p>
                </div>
                <button 
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all self-start sm:self-center"
                  onClick={() => {
                    setWorkoutForm({ id: null, name: '', description: '', durationMinutes: 30, difficulty: 'Medium', trainerId: '' });
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
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Assigned Creator</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {workouts.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-sm text-slate-400">
                          No workouts in database. Click 'Create Workout Plan' to add one.
                        </td>
                      </tr>
                    ) : (
                      workouts.map(workout => (
                        <tr key={workout.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-800 text-sm">{workout.name}</div>
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
                          <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                            {workout.trainer ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg">
                                {workout.trainer.name}
                              </span>
                            ) : (
                              <span className="text-xs font-semibold text-slate-400">None</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button 
                              className="inline-flex items-center justify-center px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-indigo-600 rounded-lg shadow-sm transition-all"
                              onClick={() => {
                                setWorkoutForm({
                                  ...workout,
                                  trainerId: workout.trainer?.id || ''
                                });
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

      {/* Trainer Modal */}
      {showTrainerModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h5 className="text-lg font-bold text-slate-900">{trainerForm.id ? 'Edit Trainer' : 'Add Trainer'}</h5>
              <button 
                type="button" 
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors" 
                onClick={() => setShowTrainerModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveTrainer}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Trainer Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder-slate-400 transition-all bg-slate-50/50 hover:bg-slate-50" 
                    placeholder="e.g. Avinash"
                    value={trainerForm.name}
                    onChange={(e) => setTrainerForm(prev => ({ ...prev, name: e.target.value }))}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder-slate-400 transition-all bg-slate-50/50 hover:bg-slate-50" 
                    placeholder="e.g. avinash@gmail.com"
                    value={trainerForm.email}
                    onChange={(e) => setTrainerForm(prev => ({ ...prev, email: e.target.value }))}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder-slate-400 transition-all bg-slate-50/50 hover:bg-slate-50" 
                    placeholder="e.g. 123-456-7890"
                    value={trainerForm.phone}
                    onChange={(e) => setTrainerForm(prev => ({ ...prev, phone: e.target.value }))}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Specialization</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder-slate-400 transition-all bg-slate-50/50 hover:bg-slate-50" 
                    placeholder="e.g. Strength, Yoga, Cardio"
                    value={trainerForm.specialization}
                    onChange={(e) => setTrainerForm(prev => ({ ...prev, specialization: e.target.value }))}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Experience (Years)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder-slate-400 transition-all bg-slate-50/50 hover:bg-slate-50" 
                    min="0"
                    placeholder="e.g. 5"
                    value={trainerForm.experience}
                    onChange={(e) => setTrainerForm(prev => ({ ...prev, experience: parseInt(e.target.value, 10) || 0 }))}
                    required 
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
                <button 
                  type="button" 
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm transition-all" 
                  onClick={() => setShowTrainerModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all"
                >
                  Save Trainer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Workout Modal */}
      {showWorkoutModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h5 className="text-lg font-bold text-slate-900">{workoutForm.id ? 'Edit Workout Plan' : 'Create Workout Plan'}</h5>
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
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Assign Creator (Trainer)</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 transition-all bg-slate-50/50 hover:bg-slate-50 cursor-pointer text-sm"
                    value={workoutForm.trainerId}
                    onChange={(e) => setWorkoutForm(prev => ({ ...prev, trainerId: e.target.value }))}
                  >
                    <option value="">-- No Creator Assigned --</option>
                    {trainers.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.specialization})</option>
                    ))}
                  </select>
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

export default AdminDashboard;
