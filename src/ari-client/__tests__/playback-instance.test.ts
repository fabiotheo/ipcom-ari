import { describe, it, expect, vi } from 'vitest';
import { PlaybackInstance } from '../resources/playbacks';
import type { WebSocketEvent } from '../interfaces';

function createMockAriClient() {
  return {
    Channel: vi.fn(),
    Playback: vi.fn(),
    Bridge: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  } as any;
}

function createMockBaseClient() {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  } as any;
}

function makePlaybackEvent(
  type: string,
  playbackId: string
): WebSocketEvent {
  return {
    type,
    playback: { id: playbackId },
    asterisk_id: 'ast-1',
    application: 'test',
  } as any;
}

describe('PlaybackInstance', () => {
  it('on() receives event for correct playback', () => {
    const instance = new PlaybackInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'pb-1'
    );
    const listener = vi.fn();

    instance.on('PlaybackStarted', listener);

    const event = makePlaybackEvent('PlaybackStarted', 'pb-1');
    instance.emitEvent(event);

    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith(event);
  });

  it('on() ignores event from another playback', () => {
    const instance = new PlaybackInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'pb-1'
    );
    const listener = vi.fn();

    instance.on('PlaybackStarted', listener);
    instance.emitEvent(makePlaybackEvent('PlaybackStarted', 'pb-other'));

    expect(listener).not.toHaveBeenCalled();
  });

  it('on() dedup works', () => {
    const instance = new PlaybackInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'pb-1'
    );
    const listener = vi.fn();

    instance.on('PlaybackStarted', listener);
    instance.on('PlaybackStarted', listener);

    instance.emitEvent(makePlaybackEvent('PlaybackStarted', 'pb-1'));

    expect(listener).toHaveBeenCalledOnce();
  });

  it('once() fires once', () => {
    const instance = new PlaybackInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'pb-1'
    );
    const listener = vi.fn();

    instance.once('PlaybackFinished', listener);

    const event = makePlaybackEvent('PlaybackFinished', 'pb-1');
    instance.emitEvent(event);
    instance.emitEvent(event);

    expect(listener).toHaveBeenCalledOnce();
  });

  it('off() removes listener', () => {
    const instance = new PlaybackInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'pb-1'
    );
    const listener = vi.fn();

    instance.on('PlaybackStarted', listener);
    instance.off('PlaybackStarted', listener);

    instance.emitEvent(makePlaybackEvent('PlaybackStarted', 'pb-1'));

    expect(listener).not.toHaveBeenCalled();
  });

  it('removeAllListeners() clears everything', () => {
    const instance = new PlaybackInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'pb-1'
    );
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    instance.on('PlaybackStarted', listener1);
    instance.on('PlaybackFinished', listener2);
    instance.removeAllListeners();

    instance.emitEvent(makePlaybackEvent('PlaybackStarted', 'pb-1'));
    instance.emitEvent(makePlaybackEvent('PlaybackFinished', 'pb-1'));

    expect(listener1).not.toHaveBeenCalled();
    expect(listener2).not.toHaveBeenCalled();
  });

  it('off(event, listener) preserves other listeners on same event', () => {
    const instance = new PlaybackInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'pb-1'
    );
    const listenerA = vi.fn();
    const listenerB = vi.fn();

    instance.on('PlaybackStarted', listenerA);
    instance.on('PlaybackStarted', listenerB);
    instance.off('PlaybackStarted', listenerA);

    instance.emitEvent(makePlaybackEvent('PlaybackStarted', 'pb-1'));

    expect(listenerA).not.toHaveBeenCalled();
    expect(listenerB).toHaveBeenCalledOnce();
  });

  it('off(event) without listener removes all listeners for that event', () => {
    const instance = new PlaybackInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'pb-1'
    );
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    instance.on('PlaybackStarted', listener1);
    instance.on('PlaybackStarted', listener2);
    instance.off('PlaybackStarted');

    instance.emitEvent(makePlaybackEvent('PlaybackStarted', 'pb-1'));

    expect(listener1).not.toHaveBeenCalled();
    expect(listener2).not.toHaveBeenCalled();
  });

  it('cleanup() removes all listeners and prevents further events', () => {
    const instance = new PlaybackInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'pb-1'
    );
    const listener = vi.fn();

    instance.on('PlaybackStarted', listener);
    instance.cleanup();

    instance.emitEvent(makePlaybackEvent('PlaybackStarted', 'pb-1'));

    expect(listener).not.toHaveBeenCalled();
    expect(instance.getCurrentData()).toBeNull();
  });

  it('emitEvent(undefined) does not throw', () => {
    const instance = new PlaybackInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'pb-1'
    );

    expect(() => instance.emitEvent(undefined as any)).not.toThrow();
  });

  it('hasListeners() returns true when listeners exist, false after removal', () => {
    const instance = new PlaybackInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'pb-1'
    );
    const listener = vi.fn();

    expect(instance.hasListeners('PlaybackStarted')).toBe(false);

    instance.on('PlaybackStarted', listener);
    expect(instance.hasListeners('PlaybackStarted')).toBe(true);

    instance.off('PlaybackStarted', listener);
    expect(instance.hasListeners('PlaybackStarted')).toBe(false);
  });
});
