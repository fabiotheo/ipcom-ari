import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WebSocketClient } from '../websocketClient';

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

function createMockAriClient() {
  return {
    Channel: vi.fn(() => ({ emitEvent: vi.fn() })),
    Playback: vi.fn(() => ({ emitEvent: vi.fn() })),
    Bridge: vi.fn(() => ({ emitEvent: vi.fn() })),
    on: vi.fn(),
    off: vi.fn(),
  } as any;
}

describe('WebSocketClient.handleMessage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('processes valid JSON with type string', () => {
    const client = new WebSocketClient(
      createMockBaseClient(),
      ['test-app'],
      undefined,
      undefined
    );
    const listener = vi.fn();
    client.on('StasisStart', listener);

    const event = JSON.stringify({
      type: 'StasisStart',
      args: [],
      channel: { id: 'ch-1' },
      application: 'test-app',
    });

    (client as any).handleMessage(event);
    vi.advanceTimersByTime(150);

    expect(listener).toHaveBeenCalledOnce();
  });

  it('emits error for malformed JSON', () => {
    const client = new WebSocketClient(
      createMockBaseClient(),
      ['test-app'],
      undefined,
      undefined
    );
    const errorListener = vi.fn();
    client.on('error', errorListener);

    (client as any).handleMessage('not-json{{{');

    expect(errorListener).toHaveBeenCalledOnce();
    expect(errorListener.mock.calls[0][0]).toBeInstanceOf(Error);
  });

  it('ignores JSON without type field', () => {
    const client = new WebSocketClient(
      createMockBaseClient(),
      ['test-app'],
      undefined,
      undefined
    );
    const listener = vi.fn();
    client.on('StasisStart', listener);

    (client as any).handleMessage(JSON.stringify({ data: 'no-type' }));
    vi.advanceTimersByTime(150);

    expect(listener).not.toHaveBeenCalled();
  });

  it('ignores JSON with non-string type', () => {
    const client = new WebSocketClient(
      createMockBaseClient(),
      ['test-app'],
      undefined,
      undefined
    );
    const listener = vi.fn();
    client.on('StasisStart', listener);

    (client as any).handleMessage(JSON.stringify({ type: 123 }));
    vi.advanceTimersByTime(150);

    expect(listener).not.toHaveBeenCalled();
  });

  it('discards event filtered by subscribedEvents', () => {
    const client = new WebSocketClient(
      createMockBaseClient(),
      ['test-app'],
      ['ChannelCreated'],
      undefined
    );
    const listener = vi.fn();
    client.on('StasisStart', listener);

    const event = JSON.stringify({
      type: 'StasisStart',
      args: [],
      channel: { id: 'ch-1' },
      application: 'test-app',
    });

    (client as any).handleMessage(event);
    vi.advanceTimersByTime(150);

    expect(listener).not.toHaveBeenCalled();
  });

  it('debounces same event — processes only once', () => {
    const client = new WebSocketClient(
      createMockBaseClient(),
      ['test-app'],
      undefined,
      undefined
    );
    const listener = vi.fn();
    client.on('StasisStart', listener);

    const event = JSON.stringify({
      type: 'StasisStart',
      args: [],
      channel: { id: 'ch-1' },
      application: 'test-app',
    });

    (client as any).handleMessage(event);
    (client as any).handleMessage(event);
    (client as any).handleMessage(event);

    vi.advanceTimersByTime(150);

    expect(listener).toHaveBeenCalledOnce();
  });

  it('debounce: listener is NOT called before 100ms, IS called at 100ms', () => {
    const client = new WebSocketClient(
      createMockBaseClient(),
      ['test-app'],
      undefined,
      undefined
    );
    const listener = vi.fn();
    client.on('StasisStart', listener);

    const event = JSON.stringify({
      type: 'StasisStart',
      args: [],
      channel: { id: 'ch-1' },
      application: 'test-app',
    });

    (client as any).handleMessage(event);

    expect(listener).not.toHaveBeenCalled();

    vi.advanceTimersByTime(99);
    expect(listener).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(listener).toHaveBeenCalledOnce();
  });

  it('events with different IDs are NOT debounced together', () => {
    const client = new WebSocketClient(
      createMockBaseClient(),
      ['test-app'],
      undefined,
      undefined
    );
    const listener = vi.fn();
    client.on('StasisStart', listener);

    const event1 = JSON.stringify({
      type: 'StasisStart',
      args: [],
      channel: { id: 'ch-1' },
      application: 'test-app',
    });

    const event2 = JSON.stringify({
      type: 'StasisStart',
      args: [],
      channel: { id: 'ch-2' },
      application: 'test-app',
    });

    (client as any).handleMessage(event1);
    (client as any).handleMessage(event2);

    vi.advanceTimersByTime(150);

    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('processEvent propagates channel event to ariClient instances', () => {
    const mockEmitEvent = vi.fn();
    const mockChannelInstance = { emitEvent: mockEmitEvent };
    const ariClient = {
      ...createMockAriClient(),
      Channel: vi.fn(() => mockChannelInstance),
    };

    const client = new WebSocketClient(
      createMockBaseClient(),
      ['test-app'],
      undefined,
      ariClient
    );
    const listener = vi.fn();
    client.on('StasisStart', listener);

    const event = JSON.stringify({
      type: 'StasisStart',
      args: [],
      channel: { id: 'ch-1' },
      application: 'test-app',
    });

    (client as any).handleMessage(event);
    vi.advanceTimersByTime(150);

    expect(ariClient.Channel).toHaveBeenCalledWith('ch-1');
    expect(mockEmitEvent).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0][0].instanceChannel).toBe(
      mockChannelInstance
    );
  });

  it('processEvent propagates playback event to ariClient instances', () => {
    const mockEmitEvent = vi.fn();
    const mockPlaybackInstance = { emitEvent: mockEmitEvent };
    const ariClient = {
      ...createMockAriClient(),
      Playback: vi.fn(() => mockPlaybackInstance),
    };

    const client = new WebSocketClient(
      createMockBaseClient(),
      ['test-app'],
      undefined,
      ariClient
    );
    const listener = vi.fn();
    client.on('PlaybackStarted', listener);

    const event = JSON.stringify({
      type: 'PlaybackStarted',
      playback: { id: 'pb-1' },
      asterisk_id: 'ast-1',
      application: 'test-app',
    });

    (client as any).handleMessage(event);
    vi.advanceTimersByTime(150);

    expect(ariClient.Playback).toHaveBeenCalledWith('pb-1');
    expect(mockEmitEvent).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0][0].instancePlayback).toBe(
      mockPlaybackInstance
    );
  });

  it('processEvent propagates bridge event to ariClient instances', () => {
    const mockEmitEvent = vi.fn();
    const mockBridgeInstance = { emitEvent: mockEmitEvent };
    const ariClient = {
      ...createMockAriClient(),
      Bridge: vi.fn(() => mockBridgeInstance),
    };

    const client = new WebSocketClient(
      createMockBaseClient(),
      ['test-app'],
      undefined,
      ariClient
    );
    const listener = vi.fn();
    client.on('ChannelEnteredBridge', listener);

    const event = JSON.stringify({
      type: 'ChannelEnteredBridge',
      bridge: { id: 'br-1' },
      bridgeId: 'br-1',
      channel: { id: 'ch-1' },
      application: 'test-app',
    });

    (client as any).handleMessage(event);
    vi.advanceTimersByTime(150);

    expect(ariClient.Bridge).toHaveBeenCalledWith('br-1');
    expect(mockEmitEvent).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0][0].instanceBridge).toBe(
      mockBridgeInstance
    );
  });
});
