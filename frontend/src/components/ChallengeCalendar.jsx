import { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';

const ChallengeCalendar = () => {
    const [calendar, setCalendar] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCalendar();
    }, []);

    const fetchCalendar = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/daily-challenge/stats');
            setCalendar(response.data.monthlyCalendar || []);
            setStats(response.data.stats);
        } catch (error) {
            console.error('Error fetching calendar:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDayStatusColor = (day) => {
        if (!day.hasChallenge) return 'bg-gray-800';
        if (day.solved) return 'bg-green-600';
        if (day.status === 'attempted') return 'bg-yellow-600';
        return 'bg-gray-700';
    };

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="grid grid-cols-7 gap-2">
                    {[...Array(35)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-800 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Challenge Calendar</h3>
                {stats && (
                    <div className="flex gap-4 text-sm">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">{stats.currentStreak}</div>
                            <div className="text-gray-400">Current Streak</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400">{stats.totalSolved}</div>
                            <div className="text-gray-400">Total Solved</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400">{stats.totalPoints}</div>
                            <div className="text-gray-400">Points</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-gray-400 text-sm font-medium">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
                {calendar.map((day, index) => (
                    <div
                        key={index}
                        className={`relative rounded-lg p-2 ${getDayStatusColor(day)} transition-all hover:scale-105 cursor-pointer`}
                        title={`${day.date.toLocaleDateString()}: ${day.hasChallenge ? day.challenge?.title : 'No challenge'}`}
                    >
                        <div className="text-center">
                            <div className="text-white font-medium">{day.date.getDate()}</div>
                            {day.hasChallenge && (
                                <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${
                                    day.solved ? 'bg-green-400' : 
                                    day.status === 'attempted' ? 'bg-yellow-400' : 'bg-gray-500'
                                }`}></div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-600"></div>
                    <span className="text-sm text-gray-300">Solved</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                    <span className="text-sm text-gray-300">Attempted</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                    <span className="text-sm text-gray-300">Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-800"></div>
                    <span className="text-sm text-gray-300">No Challenge</span>
                </div>
            </div>
        </div>
    );
};

export default ChallengeCalendar;