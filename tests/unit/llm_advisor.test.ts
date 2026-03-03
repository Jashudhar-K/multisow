import { describe, it, expect } from 'vitest';

// Unit test for the explain_prediction_naturally function (Python, but we can check API contract)
describe('LLM Advisor API contract', () => {
  it('should return a non-empty explanation string for valid input', async () => {
    // Simulate a backend call (mocked)
    const response = await fetch('/api/nlp/explain-prediction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prediction: {
          yield_canopy_t_ha: 8.2,
          yield_middle_t_ha: 5.1,
          yield_understory_t_ha: 2.3,
          LER: 1.3,
          revenue_estimate_inr: 12000,
          shap_features: ['LAI', 'soil_N']
        },
        farm_context: { region: 'Kerala', soil_type: 'laterite', crops: ['coconut', 'banana'] },
        language: 'english'
      })
    });
    const data = await response.json();
    expect(typeof data.explanation).toBe('string');
    expect(data.explanation.length).toBeGreaterThan(20);
  });
});
