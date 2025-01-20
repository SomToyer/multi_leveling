'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Target, Activity } from 'lucide-react';

export default function TrainingTracker() {
  const [stats, setStats] = useState({
    level: 1,
    exp: 0,
    rank: 'E',
    dailyTasks: [
      { id: 1, name: '100 Liegestütze', completed: false },
      { id: 2, name: '100 Sit-ups', completed: false },
      { id: 3, name: '100 Kniebeugen', completed: false },
      { id: 4, name: '10km Laufen', completed: false }
    ],
    taskHistory: []
  });

  // Constants für Level-System
  const EXP_PER_TASK = 25;
  const EXP_TO_LEVEL_FACTOR = 100;
  const RANKS = ['E', 'D', 'C', 'B', 'A', 'S'];

  // Berechne benötigte EXP für nächstes Level
  const getExpToNextLevel = (level) => level * EXP_TO_LEVEL_FACTOR;

  // Berechne aktuellen Rang basierend auf Level
  const calculateRank = (level) => {
    if (level >= 50) return 'S';
    if (level >= 40) return 'A';
    if (level >= 30) return 'B';
    if (level >= 20) return 'C';
    if (level >= 10) return 'D';
    return 'E';
  };

  // Lade Daten aus LocalStorage beim Start
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStats = localStorage.getItem('trainingStats');
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    }
  }, []);

  // Speichere Daten im LocalStorage bei Änderungen
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('trainingStats', JSON.stringify(stats));
    }
  }, [stats]);

  // Task als erledigt markieren und EXP vergeben
  const completeTask = (taskId) => {
    setStats(prevStats => {
      const updatedTasks = prevStats.dailyTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );

      let newExp = prevStats.exp + (updatedTasks.find(t => t.id === taskId).completed ? EXP_PER_TASK : -EXP_PER_TASK);
      let newLevel = prevStats.level;
      
      // Level-Up Logik
      while (newExp >= getExpToNextLevel(newLevel)) {
        newExp -= getExpToNextLevel(newLevel);
        newLevel++;
      }

      // Verhindere negative EXP
      if (newExp < 0) {
        newExp = 0;
      }

      const newRank = calculateRank(newLevel);

      return {
        ...prevStats,
        dailyTasks: updatedTasks,
        exp: newExp,
        level: newLevel,
        rank: newRank
      };
    });
  };

  // Berechne Fortschritt zum nächsten Level in Prozent
  const levelProgress = (stats.exp / getExpToNextLevel(stats.level)) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Solo Leveling Training Tracker
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-2 bg-slate-100 p-3 rounded-lg">
            <Trophy className="w-6 h-6" />
            <span className="font-bold">Rang: {stats.rank}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-100 p-3 rounded-lg">
            <Target className="w-6 h-6" />
            <span className="font-bold">Level: {stats.level}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-100 p-3 rounded-lg">
            <Activity className="w-6 h-6" />
            <span className="font-bold">EXP: {stats.exp}/{getExpToNextLevel(stats.level)}</span>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span>Fortschritt zum Level {stats.level + 1}</span>
            <span>{Math.round(levelProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${levelProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-4">
          {stats.dailyTasks.map(task => (
            <button
              key={task.id}
              onClick={() => completeTask(task.id)}
              className={`w-full p-4 rounded-lg text-left transition-colors ${
                task.completed 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              {task.completed ? '✓ ' : '○ '}{task.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}