import { render, screen } from '@testing-library/react';
import PlantingGuidePanel from '@/components/designer/PlantingGuidePanel';
import { presetIds } from '@/data/planting-guides';
import { describe, it, expect } from 'vitest';

describe('PlantingGuidePanel', () => {
  it('Renders for each of the 6 preset IDs', () => {
    for (const id of presetIds) {
      const { unmount } = render(<PlantingGuidePanel presetId={id} />);
      expect(screen.getAllByText(/Planting Guide|Guide|Overview/i).length).toBeGreaterThan(0);
      unmount();
    }
  });

  it('Sub-tabs render without error', () => {
    render(<PlantingGuidePanel presetId={presetIds[0]} />);
    const tabs = ['Overview', 'Timeline', 'Spacing', 'Irrigation', 'Fertiliser', 'Pest Mgmt', 'Harvest'];
    for (const tab of tabs) {
      expect(screen.getByText(tab)).toBeInTheDocument();
    }
  });

  it('Print button is present and has correct aria-label', () => {
    render(<PlantingGuidePanel presetId={presetIds[0]} />);
    expect(screen.getByRole('button', { name: /export|print/i })).toBeInTheDocument();
  });
});
