import { describe, it, expect, vi } from 'vitest';
import { BridgeInstance } from '../resources/bridges';
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

function makeBridgeEvent(
  type: string,
  bridgeId: string
): WebSocketEvent {
  return {
    type,
    bridge: { id: bridgeId },
    bridgeId,
    application: 'test',
  } as any;
}

describe('BridgeInstance', () => {
  it('on() receives event for correct bridge', () => {
    const instance = new BridgeInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'br-1'
    );
    const listener = vi.fn();

    instance.on('ChannelEnteredBridge', listener);

    const event = makeBridgeEvent('ChannelEnteredBridge', 'br-1');
    instance.emitEvent(event);

    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith(event);
  });

  it('on() ignores event from another bridge', () => {
    const instance = new BridgeInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'br-1'
    );
    const listener = vi.fn();

    instance.on('ChannelEnteredBridge', listener);
    instance.emitEvent(makeBridgeEvent('ChannelEnteredBridge', 'br-other'));

    expect(listener).not.toHaveBeenCalled();
  });

  it('on() dedup works', () => {
    const instance = new BridgeInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'br-1'
    );
    const listener = vi.fn();

    instance.on('BridgeCreated', listener);
    instance.on('BridgeCreated', listener);

    instance.emitEvent(makeBridgeEvent('BridgeCreated', 'br-1'));

    expect(listener).toHaveBeenCalledOnce();
  });

  it('once() fires once', () => {
    const instance = new BridgeInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'br-1'
    );
    const listener = vi.fn();

    instance.once('BridgeCreated', listener);

    const event = makeBridgeEvent('BridgeCreated', 'br-1');
    instance.emitEvent(event);
    instance.emitEvent(event);

    expect(listener).toHaveBeenCalledOnce();
  });

  it('off() removes listener', () => {
    const instance = new BridgeInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'br-1'
    );
    const listener = vi.fn();

    instance.on('ChannelEnteredBridge', listener);
    instance.off('ChannelEnteredBridge', listener);

    instance.emitEvent(makeBridgeEvent('ChannelEnteredBridge', 'br-1'));

    expect(listener).not.toHaveBeenCalled();
  });

  it('removeAllListeners() clears everything', () => {
    const instance = new BridgeInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'br-1'
    );
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    instance.on('BridgeCreated', listener1);
    instance.on('ChannelEnteredBridge', listener2);
    instance.removeAllListeners();

    instance.emitEvent(makeBridgeEvent('BridgeCreated', 'br-1'));
    instance.emitEvent(makeBridgeEvent('ChannelEnteredBridge', 'br-1'));

    expect(listener1).not.toHaveBeenCalled();
    expect(listener2).not.toHaveBeenCalled();
  });

  it('off(event, listener) preserves other listeners on same event', () => {
    const instance = new BridgeInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'br-1'
    );
    const listenerA = vi.fn();
    const listenerB = vi.fn();

    instance.on('ChannelEnteredBridge', listenerA);
    instance.on('ChannelEnteredBridge', listenerB);
    instance.off('ChannelEnteredBridge', listenerA);

    instance.emitEvent(makeBridgeEvent('ChannelEnteredBridge', 'br-1'));

    expect(listenerA).not.toHaveBeenCalled();
    expect(listenerB).toHaveBeenCalledOnce();
  });

  it('off(event) without listener removes all listeners for that event', () => {
    const instance = new BridgeInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'br-1'
    );
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    instance.on('ChannelEnteredBridge', listener1);
    instance.on('ChannelEnteredBridge', listener2);
    instance.off('ChannelEnteredBridge');

    instance.emitEvent(makeBridgeEvent('ChannelEnteredBridge', 'br-1'));

    expect(listener1).not.toHaveBeenCalled();
    expect(listener2).not.toHaveBeenCalled();
  });

  it('cleanup() removes all listeners and prevents further events', () => {
    const instance = new BridgeInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'br-1'
    );
    const listener = vi.fn();

    instance.on('BridgeCreated', listener);
    instance.cleanup();

    instance.emitEvent(makeBridgeEvent('BridgeCreated', 'br-1'));

    expect(listener).not.toHaveBeenCalled();
    expect(instance.getCurrentData()).toBeNull();
  });

  it('emitEvent(undefined) does not throw', () => {
    const instance = new BridgeInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'br-1'
    );

    expect(() => instance.emitEvent(undefined as any)).not.toThrow();
  });

  it('hasListeners() returns true when listeners exist, false after removal', () => {
    const instance = new BridgeInstance(
      createMockAriClient(),
      createMockBaseClient(),
      'br-1'
    );
    const listener = vi.fn();

    expect(instance.hasListeners('ChannelEnteredBridge')).toBe(false);

    instance.on('ChannelEnteredBridge', listener);
    expect(instance.hasListeners('ChannelEnteredBridge')).toBe(true);

    instance.off('ChannelEnteredBridge', listener);
    expect(instance.hasListeners('ChannelEnteredBridge')).toBe(false);
  });
});
