import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { getCompanionDialogue, getRandomMessage, getProgressiveHint, type DialogueTrigger } from '../data/companionDialogue';
import type { PuzzleType, CompanionState } from '../types';

export interface CompanionMessage {
  text: string;
  state: CompanionState;
  timestamp: number;
  isHint?: boolean;
}

export function useCompanionDialogue(puzzleType?: PuzzleType) {
  const { companion, updateCompanionState } = useGameStore();
  const [currentMessage, setCurrentMessage] = useState<CompanionMessage | null>(null);
  const [hintCount, setHintCount] = useState(0);
  const [messageQueue, setMessageQueue] = useState<CompanionMessage[]>([]);

  // Auto-dismiss messages after duration
  useEffect(() => {
    if (!currentMessage) return;

    const timer = setTimeout(() => {
      setCurrentMessage(null);
      // Process next message in queue if any
      if (messageQueue.length > 0) {
        const [nextMessage, ...remainingQueue] = messageQueue;
        setMessageQueue(remainingQueue);
        setCurrentMessage(nextMessage);
      }
    }, 5000); // 5 seconds per message

    return () => clearTimeout(timer);
  }, [currentMessage, messageQueue]);

  const triggerDialogue = useCallback((
    event: DialogueTrigger['event'],
    immediate: boolean = false
  ) => {
    if (!companion) return;

    const dialogue = getCompanionDialogue(event, companion.personality, puzzleType);
    if (!dialogue) return;

    const message = getRandomMessage(dialogue);
    const newMessage: CompanionMessage = {
      text: message,
      state: dialogue.state,
      timestamp: Date.now(),
      isHint: false
    };

    // Update companion state
    updateCompanionState(dialogue.state);

    // Either show immediately or queue it
    if (immediate || !currentMessage) {
      setCurrentMessage(newMessage);
    } else {
      setMessageQueue(prev => [...prev, newMessage]);
    }
  }, [companion, puzzleType, currentMessage, updateCompanionState]);

  const requestHint = useCallback(() => {
    if (!companion) return null;

    const dialogue = getCompanionDialogue('hint_request', companion.personality, puzzleType);
    if (!dialogue) return null;

    // Get the progressive hint
    const strugglingDialogue = getCompanionDialogue('struggling', companion.personality, puzzleType);
    const hint = strugglingDialogue ? getProgressiveHint(strugglingDialogue, hintCount) : null;

    if (hint) {
      const introMessage = getRandomMessage(dialogue);
      const hintMessage: CompanionMessage = {
        text: `${introMessage}\n\n💡 ${hint}`,
        state: dialogue.state,
        timestamp: Date.now(),
        isHint: true
      };

      setCurrentMessage(hintMessage);
      updateCompanionState(dialogue.state);
      setHintCount(prev => prev + 1);

      return hint;
    }

    return null;
  }, [companion, puzzleType, hintCount, updateCompanionState]);

  const clearMessage = useCallback(() => {
    setCurrentMessage(null);
    setMessageQueue([]);
  }, []);

  const resetHints = useCallback(() => {
    setHintCount(0);
  }, []);

  return {
    currentMessage,
    triggerDialogue,
    requestHint,
    clearMessage,
    resetHints
  };
}
