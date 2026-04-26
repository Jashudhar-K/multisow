import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function generateSimulatedData() {
  const noise = () => (Math.random() * 0.1) - 0.05; // +/- 5% noise
  
  return {
    soil_moisture: {
      sensor_type: 'Soil Moisture',
      value: Number((45 * (1 + noise())).toFixed(1)),
      unit: '%',
      status: 'normal',
      timestamp: new Date().toISOString()
    },
    soil_temperature: {
      sensor_type: 'Soil Temp',
      value: Number((24.5 * (1 + noise())).toFixed(1)),
      unit: '°C',
      status: 'normal',
      timestamp: new Date().toISOString()
    },
    npk_n: {
      sensor_type: 'Nitrogen (N)',
      value: Number((120 * (1 + noise())).toFixed(0)),
      unit: 'kg/ha',
      status: 'warning',
      timestamp: new Date().toISOString()
    },
    npk_p: {
      sensor_type: 'Phosphorus (P)',
      value: Number((45 * (1 + noise())).toFixed(0)),
      unit: 'kg/ha',
      status: 'normal',
      timestamp: new Date().toISOString()
    },
    npk_k: {
      sensor_type: 'Potassium (K)',
      value: Number((180 * (1 + noise())).toFixed(0)),
      unit: 'kg/ha',
      status: 'normal',
      timestamp: new Date().toISOString()
    },
    ambient_light: {
      sensor_type: 'PAR Light',
      value: Number((1800 * (1 + noise())).toFixed(0)),
      unit: 'µmol/m²/s',
      status: 'normal',
      timestamp: new Date().toISOString()
    }
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const farmId = searchParams.get('farm_id');

  // In a real app, we would attempt to fetch from an IoT gateway or real backend:
  // const res = await fetch(`http://backend:8001/api/v1/sensors/${farmId}`);
  // if (res.ok) return NextResponse.json(await res.json());

  // Return simulated data
  return NextResponse.json({
    farm_id: farmId,
    is_simulated: true,
    readings: generateSimulatedData()
  });
}
