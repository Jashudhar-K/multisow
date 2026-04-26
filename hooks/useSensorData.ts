'use client'

import { useState, useEffect } from 'react';

export interface SensorReading {
  sensor_type: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  timestamp: string;
}

export function useSensorData(farmId: string) {
  const [readings, setReadings] = useState<Record<string, SensorReading>>({});
  const [isSimulated, setIsSimulated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchSensors = async () => {
      try {
        const res = await fetch(`/api/sensors/readings?farm_id=${farmId}`);
        const data = await res.json();
        
        setReadings(data.readings || {});
        setIsSimulated(data.is_simulated || false);
      } catch (err) {
        console.error('Failed to fetch sensor data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSensors();
    intervalId = setInterval(fetchSensors, 5000); // Poll every 5s

    return () => clearInterval(intervalId);
  }, [farmId]);

  return { readings, isSimulated, loading };
}
