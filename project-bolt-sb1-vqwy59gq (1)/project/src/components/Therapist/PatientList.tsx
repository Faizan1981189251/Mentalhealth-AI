import React from 'react';
import { motion } from 'framer-motion';
import { Session } from '../../types';
import { User, Clock, AlertTriangle } from 'lucide-react';

interface PatientListProps {
  sessions: Session[];
  selectedPatient: string | null;
  onSelectPatient: (patientId: string | null) => void;
}

const PatientList: React.FC<PatientListProps> = ({ sessions, selectedPatient, onSelectPatient }) => {
  // Group sessions by patient
  const patientData = sessions.reduce((acc, session) => {
    if (!acc[session.patientId]) {
      acc[session.patientId] = {
        patientId: session.patientId,
        sessions: [],
        lastSession: session.startTime,
        avgRiskScore: 0,
        totalSessions: 0
      };
    }
    
    acc[session.patientId].sessions.push(session);
    acc[session.patientId].totalSessions++;
    
    if (session.startTime > acc[session.patientId].lastSession) {
      acc[session.patientId].lastSession = session.startTime;
    }
    
    return acc;
  }, {} as Record<string, any>);

  // Calculate average risk scores
  Object.values(patientData).forEach((patient: any) => {
    const totalRisk = patient.sessions.reduce((sum: number, session: Session) => sum + session.riskScore, 0);
    patient.avgRiskScore = totalRisk / patient.sessions.length;
  });

  const patients = Object.values(patientData).sort((a: any, b: any) => 
    new Date(b.lastSession).getTime() - new Date(a.lastSession).getTime()
  );

  const getRiskColor = (riskScore: number) => {
    if (riskScore < 30) return 'text-therapeutic-600 bg-therapeutic-100';
    if (riskScore < 70) return 'text-warning-600 bg-warning-100';
    return 'text-danger-600 bg-danger-100';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Patients</h2>
          <button
            onClick={() => onSelectPatient(null)}
            className={`text-sm px-3 py-1 rounded-lg transition-colors ${
              selectedPatient === null
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            View All
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {patients.length === 0 ? (
          <div className="p-6 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No patient data available</p>
          </div>
        ) : (
          patients.map((patient: any) => (
            <motion.div
              key={patient.patientId}
              whileHover={{ backgroundColor: '#f9fafb' }}
              className={`p-4 cursor-pointer transition-colors ${
                selectedPatient === patient.patientId ? 'bg-primary-50' : ''
              }`}
              onClick={() => onSelectPatient(
                selectedPatient === patient.patientId ? null : patient.patientId
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Patient {patient.patientId.slice(-4)}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{patient.totalSessions} sessions</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        Last: {new Date(patient.lastSession).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className={`p-1 rounded-lg ${getRiskColor(patient.avgRiskScore)}`}>
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.round(patient.avgRiskScore)}%
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientList;