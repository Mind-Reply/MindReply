import type { Metadata } from 'next';
import { CampaignStudioFront } from './components/campaign-studio/CampaignStudioFront';

export const metadata: Metadata = {
  title: 'MindReply Studio',
  description: 'A campaign production studio for briefs, copy angles, launch checklists, and visual direction.',
};

export default function HomePage() {
  return <CampaignStudioFront />;
}
