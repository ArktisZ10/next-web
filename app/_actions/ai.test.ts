import { describe, it, expect, vi } from 'vitest';
import { suggestBook, suggestLego, suggestBoardgame } from './ai';
import { generateText } from 'ai';

vi.mock('ai', () => ({
  generateText: vi.fn(),
  Output: {
    object: vi.fn().mockImplementation(({ schema }) => ({ type: 'object', schema }))
  }
}));

vi.mock('@ai-sdk/google', () => ({
  google: vi.fn().mockReturnValue('mock-google-model')
}));

describe('Given the suggestBook action', () => {
  it('When called with current values, it generates text and returns the object', async () => {
    // Given
    const mockOutput = { title: 'Dune', author: 'Frank Herbert' };
    vi.mocked(generateText).mockResolvedValue({
      output: mockOutput,
      text: '',
      finishReason: 'stop',
      usage: { promptTokens: 1, completionTokens: 1, totalTokens: 2 },
      warnings: [],
      rawCall: { rawPrompt: '', rawCompute: [] },
      response: { id: '', timestamp: new Date(), modelId: '' },
      steps: []
    } as any);

    // When
    const result = await suggestBook({ title: 'Du' });

    // Then
    expect(result).toEqual(mockOutput);
    expect(generateText).toHaveBeenCalledWith(expect.objectContaining({
      model: 'mock-google-model',
      prompt: expect.stringContaining('Fill in the missing details for a book'),
    }));
  });
});

describe('Given the suggestLego action', () => {
  it('When called with current values, it generates text and returns the object', async () => {
    // Given
    const mockOutput = { name: 'Death Star' };
    vi.mocked(generateText).mockResolvedValue({
      output: mockOutput,
      text: '',
      finishReason: 'stop',
      usage: { promptTokens: 1, completionTokens: 1, totalTokens: 2 },
      warnings: [],
      rawCall: { rawPrompt: '', rawCompute: [] },
      response: { id: '', timestamp: new Date(), modelId: '' },
      steps: []
    } as any);

    // When
    const result = await suggestLego({ name: 'Death' });

    // Then
    expect(result).toEqual(mockOutput);
    expect(generateText).toHaveBeenCalledWith(expect.objectContaining({
      model: 'mock-google-model',
      prompt: expect.stringContaining('Fill in the missing details for a Lego set'),
    }));
  });
});

describe('Given the suggestBoardgame action', () => {
  it('When called with current values, it generates text and returns the object', async () => {
    // Given
    const mockOutput = { name: 'Catan' };
    vi.mocked(generateText).mockResolvedValue({
      output: mockOutput,
      text: '',
      finishReason: 'stop',
      usage: { promptTokens: 1, completionTokens: 1, totalTokens: 2 },
      warnings: [],
      rawCall: { rawPrompt: '', rawCompute: [] },
      response: { id: '', timestamp: new Date(), modelId: '' },
      steps: []
    } as any);

    // When
    const result = await suggestBoardgame({ name: 'Cat' });

    // Then
    expect(result).toEqual(mockOutput);
    expect(generateText).toHaveBeenCalledWith(expect.objectContaining({
      model: 'mock-google-model',
      prompt: expect.stringContaining('Fill in the missing details for a board game'),
    }));
  });
});
