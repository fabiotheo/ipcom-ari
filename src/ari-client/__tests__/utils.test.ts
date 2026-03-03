import { describe, it, expect } from 'vitest';
import { isPlaybackEvent, isChannelEvent, toQueryParams } from '../utils';
import type { WebSocketEvent } from '../interfaces';

describe('isPlaybackEvent', () => {
  it('returns true for event with playback.id string', () => {
    const event = {
      type: 'PlaybackStarted',
      playback: { id: 'pb-1' },
      asterisk_id: 'ast-1',
      application: 'test',
    } as WebSocketEvent;

    expect(isPlaybackEvent(event)).toBe(true);
  });

  it('returns false for event without playback', () => {
    const event = {
      type: 'ChannelCreated',
      channel: { id: 'ch-1' },
      application: 'test',
    } as WebSocketEvent;

    expect(isPlaybackEvent(event)).toBe(false);
  });

  it('filters by playback ID when provided', () => {
    const event = {
      type: 'PlaybackStarted',
      playback: { id: 'pb-1' },
      asterisk_id: 'ast-1',
      application: 'test',
    } as WebSocketEvent;

    expect(isPlaybackEvent(event, 'pb-1')).toBe(true);
    expect(isPlaybackEvent(event, 'pb-other')).toBe(false);
  });
});

describe('isChannelEvent', () => {
  it('returns true for event with channel.id', () => {
    const event = {
      type: 'ChannelCreated',
      channel: { id: 'ch-1' },
      application: 'test',
    } as WebSocketEvent;

    expect(isChannelEvent(event)).toBe(true);
  });

  it('returns false for event without channel', () => {
    const event = {
      type: 'PlaybackStarted',
      playback: { id: 'pb-1' },
      asterisk_id: 'ast-1',
      application: 'test',
    } as WebSocketEvent;

    expect(isChannelEvent(event)).toBe(false);
  });

  it('filters by channel ID when provided', () => {
    const event = {
      type: 'ChannelCreated',
      channel: { id: 'ch-1' },
      application: 'test',
    } as WebSocketEvent;

    expect(isChannelEvent(event, 'ch-1')).toBe(true);
    expect(isChannelEvent(event, 'ch-other')).toBe(false);
  });
});

describe('toQueryParams', () => {
  it('converts object to query string', () => {
    const result = toQueryParams({ foo: 'bar', baz: '123' });
    expect(result).toBe('foo=bar&baz=123');
  });

  it('ignores undefined values', () => {
    const result = toQueryParams({ foo: 'bar', baz: undefined });
    expect(result).toBe('foo=bar');
  });

  it('returns empty string for empty object', () => {
    const result = toQueryParams({});
    expect(result).toBe('');
  });
});
