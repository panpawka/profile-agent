import { describe, it, expect, beforeEach } from 'vitest';
import { ProfileAgent } from './index';

describe('ProfileAgent', () => {
  let agent: ProfileAgent;

  beforeEach(() => {
    agent = new ProfileAgent({
      aiProvider: 'gemini',
      aiApiKey: 'test-api-key',
      githubToken: 'test-github-token',
    });
  });

  describe('constructor', () => {
    it('should initialize with config', () => {
      expect(agent).toBeInstanceOf(ProfileAgent);
    });

    it('should throw error when adding CV without path', async () => {
      await expect(
        agent.addSource({ type: 'cv' } as any)
      ).rejects.toThrow('CV path is required');
    });

    it('should throw error when adding text without content', async () => {
      await expect(
        agent.addSource({ type: 'text' } as any)
      ).rejects.toThrow('Text content is required');
    });
  });

  describe('listTemplates', () => {
    it('should list available templates', () => {
      const templates = agent.listTemplates();
      expect(Array.isArray(templates)).toBe(true);
    });
  });

  describe('getProfileData', () => {
    it('should return undefined when no data extracted', () => {
      const data = agent.getProfileData();
      expect(data).toBeUndefined();
    });
  });
});
