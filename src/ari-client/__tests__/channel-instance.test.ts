import { describe, it, expect, vi } from 'vitest';
import { ChannelInstance } from '../resources/channels';
import type { WebSocketEvent } from '../interfaces';

function createMockAriClient() {
  return {
    Channel: vi.fn(),
    Playback: vi.fn(),
    Bridge: vi.fn(),
    channels: { getOrCreate: vi.fn() },
    playbacks: { getOrCreate: vi.fn() },
    bridges: { getOrCreate: vi.fn() },
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
    getCredentials: vi.fn(() => ({
      baseUrl: 'http://localhost:8088/ari',
      username: 'test',
      password: 'test',
      secure: false,
    })),
  } as any;
}

function makeChannelEvent(
  type: string,
  channelId: string
): WebSocketEvent {
  return {
    type,
    channel: { id: channelId },
    application: 'test',
  } as any;
}

describe('ChannelInstance', () => {
  it('on() registers listener and receives event for correct channel', () => {
    const instance = new ChannelInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'ch-1'
    );
    const listener = vi.fn();

    instance.on('StasisStart', listener);

    const event = makeChannelEvent('StasisStart', 'ch-1');
    instance.emitEvent(event);

    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith(event);
  });

  it('on() does NOT fire listener for event from another channel', () => {
    const instance = new ChannelInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'ch-1'
    );
    const listener = vi.fn();

    instance.on('StasisStart', listener);

    instance.emitEvent(makeChannelEvent('StasisStart', 'ch-other'));

    expect(listener).not.toHaveBeenCalled();
  });

  it('on() with same listener twice does not duplicate (dedup)', () => {
    const instance = new ChannelInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'ch-1'
    );
    const listener = vi.fn();

    instance.on('StasisStart', listener);
    instance.on('StasisStart', listener);

    instance.emitEvent(makeChannelEvent('StasisStart', 'ch-1'));

    expect(listener).toHaveBeenCalledOnce();
  });

  it('once() fires once and removes itself', () => {
    const instance = new ChannelInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'ch-1'
    );
    const listener = vi.fn();

    instance.once('ChannelDestroyed', listener);

    const event = makeChannelEvent('ChannelDestroyed', 'ch-1');
    instance.emitEvent(event);
    instance.emitEvent(event);

    expect(listener).toHaveBeenCalledOnce();
  });

  it('once() with same listener does not duplicate', () => {
    const instance = new ChannelInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'ch-1'
    );
    const listener = vi.fn();

    instance.once('ChannelDestroyed', listener);
    instance.once('ChannelDestroyed', listener);

    instance.emitEvent(makeChannelEvent('ChannelDestroyed', 'ch-1'));

    expect(listener).toHaveBeenCalledOnce();
  });

  it('off(event, listener) removes the correct listener', () => {
    const instance = new ChannelInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'ch-1'
    );
    const listener = vi.fn();

    instance.on('StasisStart', listener);
    instance.off('StasisStart', listener);

    instance.emitEvent(makeChannelEvent('StasisStart', 'ch-1'));

    expect(listener).not.toHaveBeenCalled();
  });

  it('off(event) without listener removes all listeners for that event', () => {
    const instance = new ChannelInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'ch-1'
    );
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    instance.on('StasisStart', listener1);
    instance.on('StasisStart', listener2);
    instance.off('StasisStart');

    instance.emitEvent(makeChannelEvent('StasisStart', 'ch-1'));

    expect(listener1).not.toHaveBeenCalled();
    expect(listener2).not.toHaveBeenCalled();
  });

  it('removeAllListeners() clears everything', () => {
    const instance = new ChannelInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'ch-1'
    );
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    instance.on('StasisStart', listener1);
    instance.on('ChannelDestroyed', listener2);
    instance.removeAllListeners();

    instance.emitEvent(makeChannelEvent('StasisStart', 'ch-1'));
    instance.emitEvent(makeChannelEvent('ChannelDestroyed', 'ch-1'));

    expect(listener1).not.toHaveBeenCalled();
    expect(listener2).not.toHaveBeenCalled();
  });

  it('off(event, listener) preserves other listeners on same event', () => {
    const instance = new ChannelInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'ch-1'
    );
    const listenerA = vi.fn();
    const listenerB = vi.fn();

    instance.on('StasisStart', listenerA);
    instance.on('StasisStart', listenerB);
    instance.off('StasisStart', listenerA);

    instance.emitEvent(makeChannelEvent('StasisStart', 'ch-1'));

    expect(listenerA).not.toHaveBeenCalled();
    expect(listenerB).toHaveBeenCalledOnce();
  });

  it('cleanup() removes all listeners and prevents further events', () => {
    const instance = new ChannelInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'ch-1'
    );
    const listener = vi.fn();

    instance.on('StasisStart', listener);
    instance.cleanup();

    instance.emitEvent(makeChannelEvent('StasisStart', 'ch-1'));

    expect(listener).not.toHaveBeenCalled();
  });

  it('emitEvent(undefined) does not throw', () => {
    const instance = new ChannelInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'ch-1'
    );

    expect(() => instance.emitEvent(undefined as any)).not.toThrow();
  });

  it('hasListeners() returns true when listeners exist, false after removal', () => {
    const instance = new ChannelInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'ch-1'
    );
    const listener = vi.fn();

    expect(instance.hasListeners('StasisStart')).toBe(false);

    instance.on('StasisStart', listener);
    expect(instance.hasListeners('StasisStart')).toBe(true);

    instance.off('StasisStart', listener);
    expect(instance.hasListeners('StasisStart')).toBe(false);
  });

  it('off() on non-existent listener is a no-op', () => {
    const instance = new ChannelInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'ch-1'
    );
    const listener = vi.fn();

    expect(() => instance.off('StasisStart', listener)).not.toThrow();
  });
});
